import re
import os
from typing import List, Dict, Any
from pydantic import BaseModel

class DocumentSection(BaseModel):
    id: str
    title: str
    level: int
    content: str
    word_count: int
    extracted_concepts: List[str]

class ParsedDocument(BaseModel):
    filename: str
    file_type: str
    total_words: int
    sections: List[DocumentSection]
    extracted_entities: List[Dict[str, str]]

def extract_concepts_from_text(text: str) -> List[str]:
    """Basic NLP concept & entity extraction (NER + keyphrases)"""
    # Key technical terms regex & patterns
    known_tech_keywords = [
        "Distributed Systems", "Consistency Model", "Raft Consensus", "Paxos",
        "Vector Embeddings", "Semantic Search", "Cosine Similarity", "Neo4j Ontology",
        "JWT Authentication", "Role-Based Access Control", "Rate Limiting", "Celery Queue",
        "Redis Cache", "Eventual Consistency", "ACID Transactions", "CAP Theorem",
        "Prerequisite Chain", "Schema Migration", "Sharding", "Replication Factor",
        "Depth of Explanation", "Knowledge Graph", "Embedding Space", "GPU Inference",
        "Flesch-Kincaid", "Asynchronous Workers", "Isolation Level", "Two-Phase Commit"
    ]
    
    found = []
    text_lower = text.lower()
    for kw in known_tech_keywords:
        if kw.lower() in text_lower:
            found.append(kw)
            
    # Also extract capitalized noun phrases
    capitalized_phrases = re.findall(r'\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+\b', text)
    for cap in capitalized_phrases:
        if len(cap) > 4 and cap not in found:
            found.append(cap)
            
    return list(set(found))

def parse_markdown(text: str, filename: str) -> ParsedDocument:
    lines = text.splitlines()
    sections = []
    current_title = "Introduction"
    current_level = 1
    current_lines = []
    sec_count = 0

    for line in lines:
        if line.startswith("#"):
            if current_lines:
                sec_text = "\n".join(current_lines).strip()
                sec_count += 1
                sections.append(DocumentSection(
                    id=f"sec_{sec_count}",
                    title=current_title,
                    level=current_level,
                    content=sec_text,
                    word_count=len(sec_text.split()),
                    extracted_concepts=extract_concepts_from_text(sec_text)
                ))
                current_lines = []
            
            # parse header
            header_match = re.match(r'^(#+)\s*(.*)', line)
            if header_match:
                current_level = len(header_match.group(1))
                current_title = header_match.group(2).strip()
        else:
            current_lines.append(line)

    if current_lines:
        sec_text = "\n".join(current_lines).strip()
        sec_count += 1
        sections.append(DocumentSection(
            id=f"sec_{sec_count}",
            title=current_title,
            level=current_level,
            content=sec_text,
            word_count=len(sec_text.split()),
            extracted_concepts=extract_concepts_from_text(sec_text)
        ))

    all_text = " ".join([s.content for s in sections])
    total_words = sum(s.word_count for s in sections)
    entities = [{"entity": c, "category": "Concept"} for c in extract_concepts_from_text(all_text)]

    return ParsedDocument(
        filename=filename,
        file_type="markdown",
        total_words=total_words,
        sections=sections,
        extracted_entities=entities
    )

def parse_document_file(file_content: bytes, filename: str) -> ParsedDocument:
    ext = os.path.splitext(filename)[1].lower()
    text = ""
    if ext in ['.md', '.markdown', '.txt']:
        text = file_content.decode('utf-8', errors='ignore')
        return parse_markdown(text, filename)
    
    # PDF fallback text extraction
    if ext == '.pdf':
        try:
            import pypdf
            import io
            reader = pypdf.PdfReader(io.BytesIO(file_content))
            pages_text = [page.extract_text() or "" for page in reader.pages]
            text = "\n\n".join(pages_text)
        except Exception:
            text = file_content.decode('utf-8', errors='ignore')
        return parse_markdown(text, filename)
        
    # DOCX fallback text extraction
    if ext == '.docx':
        try:
            import docx
            import io
            doc = docx.Document(io.BytesIO(file_content))
            text = "\n\n".join([p.text for p in doc.paragraphs])
        except Exception:
            text = file_content.decode('utf-8', errors='ignore')
        return parse_markdown(text, filename)

    text = file_content.decode('utf-8', errors='ignore')
    return parse_markdown(text, filename)
