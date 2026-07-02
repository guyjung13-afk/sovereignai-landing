"""Backend tests for /api/v1/briefing endpoint (SovereignAI)."""
import os
import time
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")
if not BASE_URL:
    # Fallback: read from frontend/.env
    from pathlib import Path
    for line in Path("/app/frontend/.env").read_text().splitlines():
        if line.startswith("REACT_APP_BACKEND_URL="):
            BASE_URL = line.split("=", 1)[1].strip().rstrip("/")

SOVEREIGN_KEY = "75f635bfc726bc10747c396441fbe0ff7fdc391183a39f1076729be9705b3bd5"
BRIEFING_URL = f"{BASE_URL}/api/v1/briefing"


def _payload(name: str = "TEST_agent") -> dict:
    return {
        "name": name,
        "org": "TEST_Org",
        "role": "Analyst",
        "sector": "Defense",
        "requirements": "Automated regression test payload.",
    }


def test_briefing_success() -> None:
    r = requests.post(BRIEFING_URL, json=_payload(), headers={"X-Sovereign-Key": SOVEREIGN_KEY})
    assert r.status_code == 200, r.text
    data = r.json()
    assert data.get("status") == "QUEUED"
    assert isinstance(data.get("id"), str) and len(data["id"]) > 10


def test_briefing_missing_key() -> None:
    r = requests.post(BRIEFING_URL, json=_payload())
    assert r.status_code == 401


def test_briefing_wrong_key() -> None:
    r = requests.post(BRIEFING_URL, json=_payload(), headers={"X-Sovereign-Key": "wrong"})
    assert r.status_code == 401


def test_briefing_missing_fields() -> None:
    r = requests.post(BRIEFING_URL, json={"name": ""}, headers={"X-Sovereign-Key": SOVEREIGN_KEY})
    assert r.status_code == 422


def test_briefing_empty_string_field() -> None:
    bad = _payload()
    bad["requirements"] = ""
    r = requests.post(BRIEFING_URL, json=bad, headers={"X-Sovereign-Key": SOVEREIGN_KEY})
    assert r.status_code == 422


def test_rate_limiting() -> None:
    # Wait for prior window to clear
    time.sleep(61)
    codes = []
    for i in range(7):
        r = requests.post(BRIEFING_URL, json=_payload(f"TEST_rate_{i}"), headers={"X-Sovereign-Key": SOVEREIGN_KEY})
        codes.append(r.status_code)
    # First 5 should be 200, remaining should be 429
    assert codes[:5] == [200] * 5, f"Expected 5x200, got {codes}"
    assert 429 in codes[5:], f"Expected 429 after 5 requests, got {codes}"
