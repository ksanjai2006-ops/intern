from typing import Dict, Any, List
from pydantic import BaseModel

class AdminAnalytics(BaseModel):
    total_projects: int
    total_reviews_run: int
    avg_gap_score: float
    common_gap_categories: List[Dict[str, Any]]
    document_volume_by_month: List[Dict[str, Any]]
    recent_audit_logs: List[Dict[str, str]]

def get_admin_analytics() -> AdminAnalytics:
    return AdminAnalytics(
        total_projects=14,
        total_reviews_run=142,
        avg_gap_score=76.4,
        common_gap_categories=[
            {"category": "Missing Prerequisite Chain", "count": 48, "percentage": 33.8},
            {"category": "Shallow Concept Explanation", "count": 39, "percentage": 27.5},
            {"category": "Disconnected Related Concepts", "count": 28, "percentage": 19.7},
            {"category": "Security / Auth Gap", "count": 17, "percentage": 12.0},
            {"category": "Outdated Version Reference", "count": 10, "percentage": 7.0}
        ],
        document_volume_by_month=[
            {"month": "May", "reviews": 18},
            {"month": "Jun", "reviews": 24},
            {"month": "Jul", "reviews": 32},
            {"month": "Aug", "reviews": 29},
            {"month": "Sep", "reviews": 39}
        ],
        recent_audit_logs=[
            {"time": "10 mins ago", "user": "Elena Rostova", "action": "Ran Gap Analysis on Distributed_Storage_Arch.md", "status": "Needs Revision"},
            {"time": "1 hour ago", "user": "Dr. Alex Rivera", "action": "Exported PDF Report for Consensus_Protocol_Spec.pdf", "status": "Completed"},
            {"time": "3 hours ago", "user": "Sarah Connor", "action": "Updated Knowledge Base Ontology 'kb_dist_systems_v2'", "status": "Published"}
        ]
    )
