import math
import re
from typing import List, Dict, Any
from pydantic import BaseModel
from .parser import ParsedDocument
from .knowledge_base import KnowledgeBase, DEFAULT_KB_DATA

class QualityMetrics(BaseModel):
    flesch_kincaid_score: float
    readability_grade: str
    gunning_fog_index: float
    clarity_rating: str  # Excellent, Moderate, Needs Simplification
    contradiction_warnings: List[Dict[str, str]]
    outdated_info_flags: List[Dict[str, str]]

def calculate_readability(text: str) -> QualityMetrics:
    words = re.findall(r'\w+', text)
    sentences = re.split(r'[.!?]+', text)
    sentences = [s.strip() for s in sentences if s.strip()]
    
    num_words = max(1, len(words))
    num_sentences = max(1, len(sentences))
    
    # Estimate syllable count
    def count_syllables(word):
        word = word.lower()
        if len(word) <= 3:
            return 1
        vowels = "aeiouy"
        count = sum(1 for char in word if char in vowels)
        return max(1, count)
        
    num_syllables = sum(count_syllables(w) for w in words)
    complex_words = sum(1 for w in words if count_syllables(w) >= 3)

    # Flesch-Kincaid Reading Ease Formula
    fk_score = 206.835 - (1.015 * (num_words / num_sentences)) - (84.6 * (num_syllables / num_words))
    fk_score = round(max(0.0, min(100.0, fk_score)), 1)

    # Gunning Fog Index
    gunning_fog = 0.4 * ((num_words / num_sentences) + 100 * (complex_words / num_words))
    gunning_fog = round(gunning_fog, 1)

    grade = "Technical Professional (College Level)"
    clarity = "Excellent"
    if fk_score < 30:
        grade = "Post-Graduate / Overly Complex"
        clarity = "Needs Simplification"
    elif fk_score < 50:
        grade = "Advanced Technical (College)"
        clarity = "Moderate"
    elif fk_score < 70:
        grade = "Standard Technical (High School)"
        clarity = "Excellent"

    # Detect potential contradiction & outdated information warnings against KB specs
    contradictions = []
    outdated = []
    text_lower = text.lower()

    if "paxos is faster than raft" in text_lower or "paxos guarantees zero latency" in text_lower:
        contradictions.append({
            "term": "Paxos vs Raft Performance",
            "issue": "Document states Paxos is faster than Raft, which contradicts KB benchmark specifications.",
            "recommendation": "Review consensus latency section and align with KB benchmark metrics."
        })

    if "jwt algorithm: none" in text_lower or "unencrypted tokens" in text_lower:
        contradictions.append({
            "term": "JWT Encryption standard",
            "issue": "Document allows unencrypted JWT tokens ('none' algorithm), violating Security Non-Functional Requirements.",
            "recommendation": "Enforce HMAC-SHA256 or RSA256 signature verification."
        })

    if "paxos v1.0" in text_lower or "neo4j v1.8" in text_lower or "celery 3.0" in text_lower:
        outdated.append({
            "term": "Outdated Version Reference",
            "issue": "Reference to legacy framework version (e.g. Paxos/Neo4j v1.x) detected.",
            "recommendation": "Update reference to latest KB release standard (v2.4.0)."
        })

    return QualityMetrics(
        flesch_kincaid_score=fk_score,
        readability_grade=grade,
        gunning_fog_index=gunning_fog,
        clarity_rating=clarity,
        contradiction_warnings=contradictions,
        outdated_info_flags=outdated
    )
