from datetime import datetime, timedelta, timezone

from .base import WorkflowNode
from ..context import WorkflowContext
from ...services.email_sender import send_daily_report


class EmailReportNode(WorkflowNode):
    def __init__(self, report_window_hours: int | None = None):
        super().__init__("email-report")
        self.report_window_hours = report_window_hours

    def _window_hours(self, context: WorkflowContext) -> tuple[bool, int | None]:
        if self.report_window_hours is not None:
            return True, self.report_window_hours
        if "report_window_hours" in context.summary:
            try:
                return True, int(context.summary.get("report_window_hours") or 0)
            except (TypeError, ValueError):
                return True, 0
        if "analysis_window_hours" in context.summary:
            try:
                return True, int(context.summary.get("analysis_window_hours") or 0)
            except (TypeError, ValueError):
                return True, 0
        return False, None

    async def run(self, context: WorkflowContext) -> None:
        has_window, window_hours = self._window_hours(context)
        paper_since = None
        paper_ids = context.state.get("fetched_paper_ids")
        if has_window:
            paper_ids = None
            if window_hours and window_hours > 0:
                paper_since = datetime.now(timezone.utc) - timedelta(hours=window_hours)
        result = await send_daily_report(
            context.db,
            paper_ids=paper_ids,
            paper_since=paper_since,
            analyzed_count=int(context.summary.get("analysis_analyzed", 0)),
            related_count=int(context.summary.get("analysis_related", 0)),
            workspace_id=context.workspace_id,
        )
        sent = bool(result.get("sent"))
        await context.update_summary(
            email_report_id=result.get("report_id"),
            email_sent=sent,
            email_skipped=bool(result.get("skipped")),
            email_reason=result.get("reason", ""),
            email_paper_count=int(result.get("paper_count", 0)),
            email_sent_count=int(result.get("sent_count", 1 if sent else 0)),
            email_topic_reports=result.get("topic_reports", []),
        )
        level = "info" if sent or result.get("skipped") else "warning"
        await context.log(level, "Email report completed" if sent else "Email report skipped or failed", {
            **result,
        })
