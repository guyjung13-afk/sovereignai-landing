"""
SovereignAI — VAULT CONTRACT
Standalone clandestine-briefing intake service for air-gapped deployment (MS-01 Max).

Storage : local SQLite (vault.db) — zero external services.
Security: X-Sovereign-Key header check + per-IP rate limiting.

Run:
    pip install fastapi uvicorn
    SOVEREIGN_KEY=<your-key> python vault_contract.py --host 0.0.0.0 --port 8001
"""

import argparse
import os
import sqlite3
import sys
import threading
import time
import uuid
from datetime import datetime, timezone
from typing import Optional

import uvicorn
from fastapi import FastAPI, Header, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

SOVEREIGN_KEY = os.environ.get("SOVEREIGN_KEY")
if not SOVEREIGN_KEY:
    sys.exit("FATAL: SOVEREIGN_KEY environment variable is not set. Perimeter cannot open.")

DB_PATH = os.environ.get("VAULT_DB", "vault.db")
RATE_WINDOW_SECONDS = 60
RATE_MAX_REQUESTS = 5

_db_lock = threading.Lock()
_rate_registry: dict = {}

app = FastAPI(title="SovereignAI Vault Contract", docs_url=None, redoc_url=None)

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)


def _connect() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS briefings (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            org TEXT NOT NULL,
            role TEXT NOT NULL,
            sector TEXT NOT NULL,
            requirements TEXT NOT NULL,
            origin_ip TEXT,
            created_at TEXT NOT NULL
        )
        """
    )
    return conn


class BriefingCreate(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    org: str = Field(min_length=1, max_length=200)
    role: str = Field(min_length=1, max_length=200)
    sector: str = Field(min_length=1, max_length=100)
    requirements: str = Field(min_length=1, max_length=5000)


def _verify_key(key: Optional[str]):
    if key != SOVEREIGN_KEY:
        raise HTTPException(status_code=401, detail="INVALID SOVEREIGN KEY")


def _client_ip(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


def _check_rate_limit(ip: str):
    now = time.time()
    hits = [t for t in _rate_registry.get(ip, []) if now - t < RATE_WINDOW_SECONDS]
    if len(hits) >= RATE_MAX_REQUESTS:
        raise HTTPException(status_code=429, detail="CHANNEL SATURATED — RATE LIMIT EXCEEDED")
    hits.append(now)
    _rate_registry[ip] = hits


@app.get("/api/v1/health")
def health():
    return {"status": "SOVEREIGN", "vault": DB_PATH}


@app.post("/api/v1/briefing")
def create_briefing(
    payload: BriefingCreate,
    request: Request,
    x_sovereign_key: Optional[str] = Header(default=None),
):
    _verify_key(x_sovereign_key)
    ip = _client_ip(request)
    _check_rate_limit(ip)

    briefing_id = str(uuid.uuid4())
    created_at = datetime.now(timezone.utc).isoformat()
    with _db_lock:
        conn = _connect()
        try:
            conn.execute(
                "INSERT INTO briefings (id, name, org, role, sector, requirements, origin_ip, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                (briefing_id, payload.name, payload.org, payload.role, payload.sector, payload.requirements, ip, created_at),
            )
            conn.commit()
        finally:
            conn.close()
    return {"status": "QUEUED", "id": briefing_id}


@app.get("/api/v1/briefings")
def list_briefings(x_sovereign_key: Optional[str] = Header(default=None)):
    _verify_key(x_sovereign_key)
    with _db_lock:
        conn = _connect()
        try:
            rows = conn.execute(
                "SELECT id, name, org, role, sector, requirements, origin_ip, created_at FROM briefings ORDER BY created_at DESC"
            ).fetchall()
        finally:
            conn.close()
    keys = ["id", "name", "org", "role", "sector", "requirements", "origin_ip", "created_at"]
    return {"count": len(rows), "briefings": [dict(zip(keys, r)) for r in rows]}


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="SovereignAI Vault Contract")
    parser.add_argument("--host", default="0.0.0.0")
    parser.add_argument("--port", type=int, default=8001)
    args = parser.parse_args()
    uvicorn.run(app, host=args.host, port=args.port)
