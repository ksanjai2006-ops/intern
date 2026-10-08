from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any

from .auth import authenticate_user, create_access_token, User, USERS_DB
from .parser import parse_document_file, parse_markdown, ParsedDocument
from .knowledge_base import DEFAULT_KB_DATA, KnowledgeBase
from .gap_engine import analyze_document_gaps, GapAnalysisResult
from .quality_engine import calculate_readability, QualityMetrics
from .exporter import generate_pdf_report
from .admin import get_admin_analytics, AdminAnalytics
from .sample_data import SAMPLE_TECHNICAL_DOC_1, SAMPLE_TECHNICAL_DOC_2_WITH_GAPS

app = FastAPI(
    title="AI-Based Knowledge Gap Detector API",
    description="Backend service for detecting missing concepts, shallow explanations, and prerequisite chain violations in technical documents.",
    version="1.0.0"
)

# Enable CORS for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class LoginRequest(BaseModel):
    email: str
    password: str

class TextAnalysisRequest(BaseModel):
    title: str
    content: str
    kb_id: Optional[str] = "kb_dist_systems_v2"

@app.get("/")
def root():
    return {
        "status": "healthy",
        "service": "AI-Based Knowledge Gap Detector API",
        "version": "1.0.0"
    }

@app.post("/api/auth/login")
def login(req: LoginRequest):
    user = authenticate_user(req.email, req.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token(user)
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user
    }

@app.get("/api/kb")
def get_knowledge_base():
    return DEFAULT_KB_DATA

@app.get("/api/samples")
def get_sample_documents():
    return [
        {
            "id": "sample_1",
            "title": "Enterprise Microservices Architecture Spec",
            "content": SAMPLE_TECHNICAL_DOC_1,
            "filename": "Enterprise_Microservices_Architecture.md"
        },
        {
            "id": "sample_2",
            "title": "Distributed Analytics Engine (With Prereq & Missing Gaps)",
            "content": SAMPLE_TECHNICAL_DOC_2_WITH_GAPS,
            "filename": "Distributed_Analytics_Engine_Gaps.md"
        }
    ]

@app.post("/api/analyze/text", response_model=Dict[str, Any])
def analyze_text(req: TextAnalysisRequest):
    parsed_doc = parse_markdown(req.content, req.title or "Untitled_Document.md")
    gap_results = analyze_document_gaps(parsed_doc, DEFAULT_KB_DATA)
    quality_metrics = calculate_readability(req.content)
    
    return {
        "parsed_document": parsed_doc,
        "gap_analysis": gap_results,
        "quality_metrics": quality_metrics
    }

@app.post("/api/analyze/file")
async def analyze_file(file: UploadFile = File(...)):
    contents = await file.read()
    parsed_doc = parse_document_file(contents, file.filename)
    gap_results = analyze_document_gaps(parsed_doc, DEFAULT_KB_DATA)
    
    # Calculate text content across sections for readability
    full_text = " ".join([s.content for s in parsed_doc.sections])
    quality_metrics = calculate_readability(full_text)
    
    return {
        "parsed_document": parsed_doc,
        "gap_analysis": gap_results,
        "quality_metrics": quality_metrics
    }

@app.post("/api/export/pdf")
def export_pdf_report(req: TextAnalysisRequest):
    parsed_doc = parse_markdown(req.content, req.title or "Untitled_Document.md")
    gap_results = analyze_document_gaps(parsed_doc, DEFAULT_KB_DATA)
    quality_metrics = calculate_readability(req.content)
    
    pdf_bytes = generate_pdf_report(gap_results, quality_metrics)
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=Gap_Report_{req.title.replace(' ', '_')}.pdf"}
    )

@app.get("/api/admin/analytics")
def get_analytics():
    return get_admin_analytics()
