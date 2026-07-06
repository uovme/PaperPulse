from datetime import datetime, timedelta, timezone

from .base import WorkflowNode
from ..context import WorkflowContext
from ...services.ai_analyzer import analyze_new_papers


class AiAnalyzeNode(WorkflowNode):
    def __init__(self, analysis_window_hours: int | None = None, prefer_fetched_papers: bool = True):
        super().__init__("ai-analyze")
        self.analysis_window_hours = analysis_window_hours
        self.prefer_fetched_papers = prefer_fetched_papers

    def _window_hours(self, context: WorkflowContext) -> tuple[bool, int | None]:
        if self.analysis_window_hours is not None:
            return True, self.analysis_window_hours
        if "analysis_window_hours" in context.summary:
            try:
                return True, int(context.summary.get("analysis_window_hours") or 0)
            except (TypeError, ValueError):
                return True, 0
        return False, None

    async def run(self, context: WorkflowContext) -> None:
        async def on_progress(progress: dict) -> None:
            await context.update_summary(progress)

        paper_ids = None
        fetched_since = None
        has_window, window_hours = self._window_hours(context)
        if context.summary.get("target_paper_ids"):
            paper_ids = context.summary["target_paper_ids"]
        elif has_window:
            if window_hours and window_hours > 0:
                fetched_since = datetime.now(timezone.utc) - timedelta(hours=window_hours)
        elif self.prefer_fetched_papers and "fetched_paper_ids" in context.state:
            paper_ids = context.state["fetched_paper_ids"]

        results = await analyze_new_papers(
            context.db,
            progress_callback=on_progress,
            control_callback=context.wait_if_paused_or_cancelled,
            paper_ids=paper_ids,
            fetched_since=fetched_since,
            workspace_id=context.workspace_id,
            raise_errors=True,
        )
        analyzed = int(context.summary.get("analysis_analyzed", 0))
        total = int(context.summary.get("analysis_total", analyzed))
        related = int(context.summary.get("analysis_related", 0))
        literature_summary = f"本次共分析 {analyzed}/{total} 篇论文，其中 {related} 篇与主题词相关。"
        await context.update_summary(
            analyses=len(results),
            analyzed=analyzed,
            analysis_results=len(results),
            literature_summary=literature_summary,
        )
        await context.log(
            "info",
            f"Analysis progress {analyzed}/{total}, related {related}",
            {
                "analysis_total": total,
                "analysis_analyzed": analyzed,
                "analysis_related": related,
                "analysis_results": len(results),
            },
        )
