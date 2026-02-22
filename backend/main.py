"""
Community Alerts – FastAPI Backend
"""

from __future__ import annotations

import os
from pathlib import Path
from typing import Optional

from dotenv import load_dotenv
from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase import create_client, Client

load_dotenv(dotenv_path=Path(__file__).with_name(".env"))

SUPABASE_URL: str = os.environ["SUPABASE_URL"]
SUPABASE_SERVICE_KEY: str = os.environ["SUPABASE_SERVICE_ROLE_KEY"]
VOTE_THRESHOLD: int = int(os.environ.get("VOTE_THRESHOLD", "5"))

# Service-role client (full access)
sb: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

app = FastAPI(title="Community Alerts API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Helpers ──────────────────────────────────────────────────

def _get_user_id(authorization: str | None) -> str:
    """Extract user id from the JWT passed in Authorization header."""
    if not authorization:
        raise HTTPException(401, "Missing Authorization header")
    token = authorization.replace("Bearer ", "")
    try:
        user = sb.auth.get_user(token)
        return user.user.id
    except Exception:
        raise HTTPException(401, "Invalid token")


def _get_profile(user_id: str) -> dict:
    res = sb.table("profiles").select("*").eq("id", user_id).execute()
    if res.data:
        return res.data[0]
    # Auto-create profile if the signup trigger didn't fire
    insert_res = sb.table("profiles").insert({"id": user_id}).execute()
    return insert_res.data[0]


# ── Schemas ──────────────────────────────────────────────────

class ReportCreate(BaseModel):
    type: str
    title: str
    description: str = ""
    lat: float
    lng: float
    community_id: Optional[str] = None


class ThresholdUpdate(BaseModel):
    default_threshold: int


# ── Routes ───────────────────────────────────────────────────

@app.get("/me")
def get_me(authorization: str = Header(None)):
    uid = _get_user_id(authorization)
    profile = _get_profile(uid)
    return profile


@app.put("/me/threshold")
def update_threshold(body: ThresholdUpdate, authorization: str = Header(None)):
    uid = _get_user_id(authorization)
    sb.table("profiles").update({"default_threshold": body.default_threshold}).eq("id", uid).execute()
    return {"ok": True}


@app.post("/me/make-admin")
def make_admin(authorization: str = Header(None)):
    uid = _get_user_id(authorization)
    _get_profile(uid)  # ensure profile row exists
    sb.table("profiles").update({"role": "admin"}).eq("id", uid).execute()
    return {"ok": True, "role": "admin"}


# ── Reports ──────────────────────────────────────────────────

@app.get("/reports")
def list_reports():
    res = sb.table("reports").select("*, report_votes(count)").order("created_at", desc=True).execute()
    rows = res.data or []
    # Flatten vote count
    for r in rows:
        votes = r.pop("report_votes", [])
        r["vote_count"] = votes[0]["count"] if votes else 0
    return rows


@app.post("/reports")
def create_report(body: ReportCreate, authorization: str = Header(None)):
    uid = _get_user_id(authorization)
    _get_profile(uid)  # ensures profile row exists before foreign-key insert
    data = body.model_dump()
    data["user_id"] = uid
    res = sb.table("reports").insert(data).execute()
    return res.data[0]


@app.post("/reports/{report_id}/upvote")
def upvote_report(report_id: str, authorization: str = Header(None)):
    uid = _get_user_id(authorization)
    _get_profile(uid)  # ensures profile row exists before foreign-key insert

    # Insert vote (unique constraint prevents duplicates)
    try:
        sb.table("report_votes").insert({"report_id": report_id, "user_id": uid}).execute()
    except Exception as e:
        if "duplicate" in str(e).lower() or "unique" in str(e).lower() or "23505" in str(e):
            raise HTTPException(409, "Already voted")
        raise

    # Count votes
    count_res = sb.table("report_votes").select("id", count="exact").eq("report_id", report_id).execute()
    vote_count: int = count_res.count or 0

    return {"vote_count": vote_count}


@app.delete("/reports/{report_id}/upvote")
def remove_vote(report_id: str, authorization: str = Header(None)):
    uid = _get_user_id(authorization)

    # Delete the vote row
    res = sb.table("report_votes").delete().eq("report_id", report_id).eq("user_id", uid).execute()
    if not res.data:
        raise HTTPException(404, "Vote not found")

    # Return updated count
    count_res = sb.table("report_votes").select("id", count="exact").eq("report_id", report_id).execute()
    vote_count: int = count_res.count or 0
    return {"vote_count": vote_count}


@app.get("/me/votes")
def list_my_votes(authorization: str = Header(None)):
    uid = _get_user_id(authorization)
    res = sb.table("report_votes").select("report_id").eq("user_id", uid).execute()
    return [row["report_id"] for row in (res.data or [])]


def _estimate_alerted(community_id: str | None) -> int:
    if community_id:
        res = sb.table("community_memberships").select("user_id", count="exact").eq("community_id", community_id).execute()
        return res.count or 0
    else:
        res = sb.table("profiles").select("id", count="exact").execute()
        return res.count or 0


# ── Alerts ───────────────────────────────────────────────────

@app.get("/alerts")
def list_alerts():
    res = sb.table("alerts").select("*").order("created_at", desc=True).execute()
    return res.data or []


# ── Admin analytics ──────────────────────────────────────────

@app.get("/admin/analytics")
def admin_analytics(authorization: str = Header(None)):
    uid = _get_user_id(authorization)
    profile = _get_profile(uid)
    if profile.get("role") != "admin":
        raise HTTPException(403, "Admin only")

    # Fetch reports with vote counts
    reports_res = sb.table("reports").select("id, title, type, community_id, report_votes(count)").execute()
    reports_raw = reports_res.data or []

    total_votes = 0
    total_reports = len(reports_raw)
    # Reports that crossed the threshold count as "raised an alert" (1 alert each)
    alerts_per_report = []
    alerted_users_estimate = []

    # Total profiles for notification estimate
    profiles_count = sb.table("profiles").select("id", count="exact").execute().count or 0

    for r in reports_raw:
        votes = r.pop("report_votes", [])
        vc = votes[0]["count"] if votes else 0
        total_votes += vc

        if vc >= VOTE_THRESHOLD:
            # Each report that crossed the threshold = 1 alert raised
            alerts_per_report.append({
                "report_id": r["id"],
                "report_title": r["title"],
                "alert_count": 1,
                "vote_count": vc,
            })
            # Estimate users alerted: community members if in a community, else all profiles
            if r.get("community_id"):
                cm_res = sb.table("community_memberships").select("user_id", count="exact").eq("community_id", r["community_id"]).execute()
                estimated = cm_res.count or 0
            else:
                estimated = profiles_count
            alerted_users_estimate.append({
                "alert_id": r["id"],  # use report id as the alert identifier
                "report_title": r["title"],
                "estimated_users_alerted": estimated,
            })

    return {
        "alerts_per_report": alerts_per_report,
        "alerted_users_estimate": alerted_users_estimate,
        "total_reports": total_reports,
        "total_votes": total_votes,
        "vote_threshold": VOTE_THRESHOLD,
    }
