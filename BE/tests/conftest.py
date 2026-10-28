import os
from collections.abc import Iterator
from dataclasses import dataclass, field
from typing import Any

import pytest

# Pin config before src.main runs load_dotenv(), which never overrides set vars.
os.environ["CORS_ORIGINS"] = "http://localhost:5173"
os.environ["GEMINI_API_KEY"] = "test-key"


@dataclass
class _Chunk:
    text: str | None


@dataclass
class FakeGemini:
    """Stands in for google.genai.Client; tests script the streamed reply."""

    chunks: list[str] = field(default_factory=list)
    error: Exception | None = None
    requests: list[dict[str, Any]] = field(default_factory=list)

    def reply(self, *chunks: str) -> None:
        self.chunks = list(chunks)

    def fail(self, error: Exception) -> None:
        self.error = error

    def client(self, **_: Any) -> "FakeGemini":
        return self

    @property
    def models(self) -> "FakeGemini":
        return self

    def generate_content_stream(self, **request: Any) -> Iterator[_Chunk]:
        self.requests.append(request)
        if self.error:
            raise self.error
        if not self.chunks:
            raise AssertionError("Test called Gemini without scripting a reply")
        return iter([_Chunk(None), *(_Chunk(text) for text in self.chunks)])


@pytest.fixture(autouse=True)
def gemini(monkeypatch: pytest.MonkeyPatch) -> FakeGemini:
    """Every test gets a fake Gemini so no test can reach the network."""
    fake = FakeGemini()
    monkeypatch.setattr("src.analysis.genai.Client", fake.client)
    return fake
