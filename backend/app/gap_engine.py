from typing import List, Dict, Any
from pydantic import BaseModel
from .parser import ParsedDocument, DocumentSection
from .knowledge_base import KnowledgeBase, KBConcept, DEFAULT_KB_DATA

class GapItem(BaseModel):
    id: str
    gap_type: str  # missing, shallow, disconnected, prerequisite_violation, outdated
    severity: str  # High, Medium, Low
    concept_id: str
    concept_name: str
    section_id: str
    section_title: str
    description: str
    recommendation: str
    reference_link: str

class CoverageHeatmapPoint(BaseModel):
    section_id: str
    section_title: str
    word_count: int
    concept_count: int
    coverage_score: float  # 0 to 100
    shallow_count: int
    missing_count: int
    gap_density: str # High, Moderate, Low

class GapAnalysisResult(BaseModel):
    document_name: str
    total_score: float  # 0 - 100 completeness & quality score
    overall_status: str  # Critical Gaps, Needs Revision, Production Ready
    coverage_percentage: float
    gaps: List[GapItem]
    heatmap: List[CoverageHeatmapPoint]
    detected_concepts: List[str]
    missing_concepts: List[str]
    shallow_concepts: List[str]

def analyze_document_gaps(doc: ParsedDocument, kb: KnowledgeBase = DEFAULT_KB_DATA) -> GapAnalysisResult:
    gaps: List[GapItem] = []
    heatmap: List[CoverageHeatmapPoint] = []
    
    # 1. Map where concepts appear across sections (section order matters for prerequisite chains)
    concept_locations: Dict[str, List[int]] = {}  # concept_id -> list of section index positions
    concept_word_counts: Dict[str, int] = {}
    
    # Pre-tokenize all text
    full_text_lower = " ".join([s.content for s in doc.sections]).lower()
    
    # Scan KB concepts against document
    detected_concept_ids = set()
    shallow_concept_ids = set()
    
    for concept_id, kb_concept in kb.concepts.items():
        c_name_lower = kb_concept.name.lower()
        
        # Check presence in sections
        found_indices = []
        total_words_allocated = 0
        
        for idx, sec in enumerate(doc.sections):
            sec_lower = sec.content.lower()
            if c_name_lower in sec_lower:
                found_indices.append(idx)
                # Count approximate paragraph words around concept
                paragraphs = sec.content.split("\n\n")
                for p in paragraphs:
                    if c_name_lower in p.lower():
                        total_words_allocated += len(p.split())

        if found_indices:
            detected_concept_ids.add(concept_id)
            concept_locations[concept_id] = found_indices
            concept_word_counts[concept_id] = total_words_allocated
            
            # Check depth of explanation
            if total_words_allocated < kb_concept.min_required_words:
                shallow_concept_ids.add(concept_id)
                sec_target = doc.sections[found_indices[0]]
                gaps.append(GapItem(
                    id=f"gap_shallow_{concept_id}",
                    gap_type="shallow",
                    severity="Medium",
                    concept_id=concept_id,
                    concept_name=kb_concept.name,
                    section_id=sec_target.id,
                    section_title=sec_target.title,
                    description=f"Concept '{kb_concept.name}' is mentioned shallowly (~{total_words_allocated} words) but requires at least {kb_concept.min_required_words} words for thorough technical clarity.",
                    recommendation=f"Expand explanation in section '{sec_target.title}' with architectural diagrams, implementation details, or code snippets.",
                    reference_link=f"https://docs.tech-standard.org/{concept_id}"
                ))

    # 2. Absent (Missing) Concept Gap Check
    missing_concept_ids = set(kb.concepts.keys()) - detected_concept_ids
    for m_id in missing_concept_ids:
        kb_concept = kb.concepts[m_id]
        # Assign to first section or general
        first_sec = doc.sections[0] if doc.sections else DocumentSection(id="sec_1", title="Overview", level=1, content="", word_count=0, extracted_concepts=[])
        gaps.append(GapItem(
            id=f"gap_missing_{m_id}",
            gap_type="missing",
            severity="High",
            concept_id=m_id,
            concept_name=kb_concept.name,
            section_id=first_sec.id,
            section_title=first_sec.title,
            description=f"Core Knowledge Base concept '{kb_concept.name}' ({kb_concept.category}) is completely absent from the document.",
            recommendation=f"Add a dedicated section or subsection explaining '{kb_concept.name}' and its integration into the architecture.",
            reference_link=f"https://docs.tech-standard.org/kb/{m_id}"
        ))

    # 3. Prerequisite Chain Checking
    # (If Concept B is explained before Concept A, but B depends on A)
    for c_id in detected_concept_ids:
        kb_concept = kb.concepts[c_id]
        first_b_idx = concept_locations[c_id][0]
        
        for prereq_id in kb_concept.prerequisites:
            if prereq_id in detected_concept_ids:
                first_a_idx = concept_locations[prereq_id][0]
                if first_b_idx < first_a_idx:
                    sec_b = doc.sections[first_b_idx]
                    prereq_concept = kb.concepts[prereq_id]
                    gaps.append(GapItem(
                        id=f"gap_prereq_{c_id}_{prereq_id}",
                        gap_type="prerequisite_violation",
                        severity="High",
                        concept_id=c_id,
                        concept_name=kb_concept.name,
                        section_id=sec_b.id,
                        section_title=sec_b.title,
                        description=f"Prerequisite order violation: '{kb_concept.name}' is introduced in section '{sec_b.title}' before its prerequisite '{prereq_concept.name}' is introduced.",
                        recommendation=f"Reorder sections or add a brief summary of '{prereq_concept.name}' before introducing '{kb_concept.name}'.",
                        reference_link=f"https://docs.tech-standard.org/prereqs/{prereq_id}"
                    ))
            elif prereq_id in missing_concept_ids:
                sec_b = doc.sections[first_b_idx]
                prereq_concept = kb.concepts[prereq_id]
                gaps.append(GapItem(
                    id=f"gap_missing_prereq_{c_id}_{prereq_id}",
                    gap_type="prerequisite_violation",
                    severity="High",
                    concept_id=c_id,
                    concept_name=kb_concept.name,
                    section_id=sec_b.id,
                    section_title=sec_b.title,
                    description=f"Concept '{kb_concept.name}' relies on prerequisite '{prereq_concept.name}' which is missing entirely from the document.",
                    recommendation=f"Define prerequisite '{prereq_concept.name}' before or within section '{sec_b.title}'.",
                    reference_link=f"https://docs.tech-standard.org/prereqs/{prereq_id}"
                ))

    # 4. Disconnection Detection
    # (Concept present but related concepts mentioned in KB are missing from document context)
    for c_id in detected_concept_ids:
        kb_concept = kb.concepts[c_id]
        for rel_id in kb_concept.related_concepts:
            if rel_id not in detected_concept_ids:
                sec_idx = concept_locations[c_id][0]
                sec_target = doc.sections[sec_idx]
                rel_concept = kb.concepts[rel_id]
                gaps.append(GapItem(
                    id=f"gap_disconn_{c_id}_{rel_id}",
                    gap_type="disconnected",
                    severity="Low",
                    concept_id=c_id,
                    concept_name=kb_concept.name,
                    section_id=sec_target.id,
                    section_title=sec_target.title,
                    description=f"Concept '{kb_concept.name}' is present but disconnected from its strongly related architectural concept '{rel_concept.name}'.",
                    recommendation=f"Add a cross-reference or brief explanation showing how '{kb_concept.name}' connects with '{rel_concept.name}'.",
                    reference_link=f"https://docs.tech-standard.org/relationships/{c_id}"
                ))

    # 5. Build Coverage Heatmap per section
    for sec in doc.sections:
        c_in_sec = [c for c, locs in concept_locations.items() if any(doc.sections[i].id == sec.id for i in locs)]
        shallow_in_sec = [c for c in c_in_sec if c in shallow_concept_ids]
        
        # Calculate section quality score
        score = 100.0
        if not c_in_sec:
            score = 45.0
        else:
            shallow_penalty = len(shallow_in_sec) * 15.0
            score = max(20.0, 100.0 - shallow_penalty)

        density = "Low"
        if score > 80:
            density = "Low"
        elif score > 50:
            density = "Moderate"
        else:
            density = "High"

        heatmap.append(CoverageHeatmapPoint(
            section_id=sec.id,
            section_title=sec.title,
            word_count=sec.word_count,
            concept_count=len(c_in_sec),
            coverage_score=round(score, 1),
            shallow_count=len(shallow_in_sec),
            missing_count=len(missing_concept_ids) if sec.id == doc.sections[0].id else 0,
            gap_density=density
        ))

    # Calculate Total Score
    total_kb_concepts = len(kb.concepts)
    cov_ratio = len(detected_concept_ids) / max(1, total_kb_concepts)
    shallow_ratio = len(shallow_concept_ids) / max(1, total_kb_concepts)
    prereq_violations = sum(1 for g in gaps if g.gap_type == "prerequisite_violation")
    
    raw_score = (cov_ratio * 70.0) - (shallow_ratio * 20.0) - (prereq_violations * 5.0) + 30.0
    final_score = max(10.0, min(98.5, round(raw_score, 1)))

    status = "Production Ready"
    if final_score < 60:
        status = "Critical Gaps"
    elif final_score < 82:
        status = "Needs Revision"

    return GapAnalysisResult(
        document_name=doc.filename,
        total_score=final_score,
        overall_status=status,
        coverage_percentage=round(cov_ratio * 100, 1),
        gaps=gaps,
        heatmap=heatmap,
        detected_concepts=[kb.concepts[c].name for c in detected_concept_ids],
        missing_concepts=[kb.concepts[m].name for m in missing_concept_ids],
        shallow_concepts=[kb.concepts[s].name for s in shallow_concept_ids]
    )
