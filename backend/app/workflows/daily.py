from sqlalchemy.ext.asyncio import AsyncSession

from ..database import SessionLocal
from ..models import WorkflowExecution
from .engine import WorkflowEngine
from .nodes.ai_analyze import AiAnalyzeNode
from .nodes.email_report import EmailReportNode
from .nodes.enrich_abstracts import EnrichAbstractsNode
from .nodes.fetch_rss import FetchRssNode
from .nodes.webdav_backup import WebdavBackupNode
from .nodes.weknora_sync import WeKnoraSyncNode

DAILY_ANALYSIS_WINDOW_HOURS = 24

async def run_analysis_workflow(
    db: AsyncSession,
    workspace_id: int = 1,
    analysis_window_hours: int | None = None,
) -> WorkflowExecution:
    return await WorkflowEngine(db).run(
        "manual-analysis",
        [
            AiAnalyzeNode(analysis_window_hours=analysis_window_hours, prefer_fetched_papers=analysis_window_hours is None),
            EmailReportNode(report_window_hours=analysis_window_hours),
        ],
        workspace_id=workspace_id,
    )


async def run_fetch_analyze_workflow(db: AsyncSession, workspace_id: int = 1) -> WorkflowExecution:
    return await WorkflowEngine(db).run(
        "manual-fetch-analyze",
        [FetchRssNode(), AiAnalyzeNode(), EmailReportNode()],
        workspace_id=workspace_id,
    )


async def run_send_report_workflow(db: AsyncSession, workspace_id: int = 1) -> WorkflowExecution:
    return await WorkflowEngine(db).run("manual-send-report", [EmailReportNode()], workspace_id=workspace_id)


async def run_daily_workflow(db: AsyncSession, workspace_id: int = 1) -> WorkflowExecution:
    return await WorkflowEngine(db).run(
        "daily-paperpulse",
        [
            FetchRssNode(),
            EnrichAbstractsNode(),
            AiAnalyzeNode(analysis_window_hours=DAILY_ANALYSIS_WINDOW_HOURS, prefer_fetched_papers=False),
            EmailReportNode(report_window_hours=DAILY_ANALYSIS_WINDOW_HOURS),
            WeKnoraSyncNode(),
            WebdavBackupNode(),
        ],
        workspace_id=workspace_id,
    )


def analysis_initial_summary() -> dict:
    return {
        "analysis_total": 0,
        "analysis_analyzed": 0,
        "analysis_related": 0,
        "analysis_results": 0,
        "analysis_current_title": "",
        "literature_summary": "",
        "execution_control": "running",
    }


async def create_analysis_workflow_execution(
    db: AsyncSession,
    workspace_id: int = 1,
    analysis_window_hours: int | None = None,
) -> WorkflowExecution:
    summary = analysis_initial_summary()
    if analysis_window_hours is not None:
        summary["analysis_window_hours"] = int(analysis_window_hours)
    return await WorkflowEngine(db).create_execution(
        "manual-analysis",
        summary,
        workspace_id=workspace_id,
    )


async def create_fetch_analyze_workflow_execution(db: AsyncSession, workspace_id: int = 1) -> WorkflowExecution:
    return await WorkflowEngine(db).create_execution(
        "manual-fetch-analyze",
        {"new_papers": 0, **analysis_initial_summary()},
        workspace_id=workspace_id,
    )


async def run_analysis_workflow_execution(execution_id: int) -> None:
    async with SessionLocal() as db:
        await WorkflowEngine(db).run_existing(execution_id, [AiAnalyzeNode(), EmailReportNode()])


async def run_fetch_analyze_workflow_execution(execution_id: int) -> None:
    async with SessionLocal() as db:
        await WorkflowEngine(db).run_existing(execution_id, [FetchRssNode(), AiAnalyzeNode(), EmailReportNode()])
