import os
import sys
import tempfile
import unittest
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import patch


TEST_DIR = tempfile.TemporaryDirectory()
os.environ["DB_PATH"] = str(Path(TEST_DIR.name) / "paperpulse-rss-test.db")
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.database import Base, SessionLocal, engine
from app.models import Feed, Paper
from app.services.rss_fetcher import clean_text, extract_abstract, fetch_feed, normalize_paper_url


class RssFetcherTest(unittest.TestCase):
    def test_clean_text_strips_html_and_collapses_whitespace(self):
        self.assertEqual("Battery abstract text", clean_text("<p>Battery&nbsp; abstract\n text</p>"))

    def test_extract_abstract_reads_content_when_summary_missing(self):
        entry = SimpleNamespace(content=[{"value": "<div>Detailed abstract</div>"}])

        self.assertEqual("Detailed abstract", extract_abstract(entry))

    def test_normalize_paper_url_removes_sciencedirect_rss_tracking(self):
        url = "https://www.sciencedirect.com/science/article/pii/S1359645426004003?dgcid=rss_sd_all"

        self.assertEqual(
            "https://www.sciencedirect.com/science/article/pii/S1359645426004003",
            normalize_paper_url(url),
        )

    def test_normalize_paper_url_preserves_non_tracking_query_parameters(self):
        url = "https://example.com/article?id=42&utm_source=rss&utm_campaign=feed"

        self.assertEqual("https://example.com/article?id=42", normalize_paper_url(url))


class RssFetcherDatabaseTest(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self):
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.drop_all)
            await conn.run_sync(Base.metadata.create_all)

    async def asyncTearDown(self):
        await engine.dispose()

    async def test_fetch_feed_updates_last_fetched_when_all_entries_are_duplicates(self):
        async with SessionLocal() as db:
            feed = Feed(name="Existing feed", url="https://example.test/feed.xml", enabled=True)
            paper = Paper(
                feed=feed,
                title="Existing paper",
                url="https://example.test/paper",
                title_hash="unused",
            )
            db.add_all([feed, paper])
            await db.commit()
            await db.refresh(feed)

            parsed = SimpleNamespace(
                entries=[
                    SimpleNamespace(
                        title="Existing paper",
                        link="https://example.test/paper",
                    )
                ]
            )

            with patch("app.services.rss_fetcher.feedparser.parse", return_value=parsed):
                papers = await fetch_feed(db, feed)

            self.assertEqual([], papers)
            await db.refresh(feed)
            self.assertIsNotNone(feed.last_fetched)
