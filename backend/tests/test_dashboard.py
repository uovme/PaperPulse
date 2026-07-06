import os
import sys
import tempfile
import unittest
from datetime import datetime, timezone
from pathlib import Path


TEST_DIR = tempfile.TemporaryDirectory()
os.environ["DB_PATH"] = str(Path(TEST_DIR.name) / "paperpulse-dashboard-test.db")
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from httpx import ASGITransport, AsyncClient

from app.database import Base, SessionLocal, engine
from app.main import app
from app.models import AnalysisResult, Paper


class DashboardApiTest(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self):
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.drop_all)
            await conn.run_sync(Base.metadata.create_all)
        self.transport = ASGITransport(app=app)
        self.client = AsyncClient(transport=self.transport, base_url="http://testserver")

    async def asyncTearDown(self):
        await self.client.aclose()
        await engine.dispose()

    async def test_chart_data_handles_sqlite_datetime_values(self):
        now = datetime.now(timezone.utc)
        async with SessionLocal() as db:
            paper = Paper(title="Chart paper", fetched_at=now, workspace_id=1)
            db.add(paper)
            await db.commit()
            await db.refresh(paper)
            db.add(
                AnalysisResult(
                    paper_id=paper.id,
                    relevance_score=6,
                    analyzed_at=now,
                    workspace_id=1,
                )
            )
            await db.commit()

        response = await self.client.get("/api/dashboard/chart-data?days=7")

        self.assertEqual(200, response.status_code)
        data = response.json()
        self.assertEqual(7, len(data["dates"]))
        self.assertEqual(1, sum(data["daily_new_papers"]))
        self.assertEqual(1, sum(data["daily_analyses"]))
        self.assertEqual(1, sum(data["daily_related_papers"]))


if __name__ == "__main__":
    unittest.main()
