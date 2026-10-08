from typing import List, Dict, Any, Optional
from pydantic import BaseModel

class KBConcept(BaseModel):
    id: str
    name: str
    category: str
    description: str
    prerequisites: List[str]  # IDs of concepts that MUST be explained prior
    related_concepts: List[str]
    min_required_words: int
    latest_version: str

class KnowledgeBase(BaseModel):
    id: str
    title: str
    domain: str
    version: str
    concepts: Dict[str, KBConcept]

# Default Reference Technical Knowledge Base (Distributed Systems & AI Infrastructure Ontology)
DEFAULT_KB_DATA = KnowledgeBase(
    id="kb_dist_systems_v2",
    title="Distributed Systems & Modern Data Architecture KB",
    domain="Software Engineering & AI Infrastructure",
    version="2.4.0",
    concepts={
        "c_auth": KBConcept(
            id="c_auth",
            name="JWT Authentication",
            category="Security & Access Control",
            description="JSON Web Token based authentication mechanism specifying signing algorithms, claim payload structure, and expiration handling.",
            prerequisites=[],
            related_concepts=["c_rbac"],
            min_required_words=120,
            latest_version="2.4.0"
        ),
        "c_rbac": KBConcept(
            id="c_rbac",
            name="Role-Based Access Control",
            category="Security & Access Control",
            description="Access management strategy mapping permissions to roles (Admin, Reviewer, Author) and assigning roles to authenticated users.",
            prerequisites=["c_auth"],
            related_concepts=["c_auth"],
            min_required_words=150,
            latest_version="2.4.0"
        ),
        "c_consensus": KBConcept(
            id="c_consensus",
            name="Raft Consensus",
            category="Distributed Core",
            description="Consensus algorithm designed for managing a replicated log across node clusters via leader election and log replication.",
            prerequisites=["c_consistency"],
            related_concepts=["c_paxos", "c_sharding"],
            min_required_words=200,
            latest_version="2.4.0"
        ),
        "c_consistency": KBConcept(
            id="c_consistency",
            name="Consistency Model",
            category="Distributed Core",
            description="Contract between data store and clients defining read and write order guarantees (Strong, Eventual, Sequential consistency).",
            prerequisites=[],
            related_concepts=["c_consensus", "c_acid"],
            min_required_words=180,
            latest_version="2.4.0"
        ),
        "c_paxos": KBConcept(
            id="c_paxos",
            name="Paxos",
            category="Distributed Core",
            description="Family of protocols for solving consensus in a network of unreliable processors.",
            prerequisites=["c_consistency"],
            related_concepts=["c_consensus"],
            min_required_words=160,
            latest_version="2.3.0"
        ),
        "c_vector_emb": KBConcept(
            id="c_vector_emb",
            name="Vector Embeddings",
            category="AI & Document Intelligence",
            description="Dense numerical vector representations of text snippets capturing semantic similarity in high-dimensional vector space.",
            prerequisites=[],
            related_concepts=["c_cosine", "c_neo4j"],
            min_required_words=150,
            latest_version="2.4.0"
        ),
        "c_cosine": KBConcept(
            id="c_cosine",
            name="Cosine Similarity",
            category="AI & Document Intelligence",
            description="Mathematical metric measuring dot product normalized by magnitude to determine semantic angular alignment between embeddings.",
            prerequisites=["c_vector_emb"],
            related_concepts=["c_vector_emb"],
            min_required_words=100,
            latest_version="2.4.0"
        ),
        "c_neo4j": KBConcept(
            id="c_neo4j",
            name="Neo4j Ontology",
            category="Knowledge Store",
            description="Graph database storing hierarchical nodes, directional relationships, and domain knowledge graphs for quick semantic graph queries.",
            prerequisites=["c_vector_emb"],
            related_concepts=["c_vector_emb", "c_prereq_chain"],
            min_required_words=140,
            latest_version="2.4.0"
        ),
        "c_sharding": KBConcept(
            id="c_sharding",
            name="Sharding",
            category="Data Architecture",
            description="Horizontal database partitioning strategy breaking data tables across multiple node shards based on partition keys.",
            prerequisites=["c_consistency"],
            related_concepts=["c_consensus"],
            min_required_words=160,
            latest_version="2.4.0"
        ),
        "c_prereq_chain": KBConcept(
            id="c_prereq_chain",
            name="Prerequisite Chain",
            category="Document Intelligence",
            description="Logical dependency graph requiring fundamental concepts (e.g. Consistency Model) to be introduced before derivative topics (e.g. Raft Consensus).",
            prerequisites=["c_consistency", "c_neo4j"],
            related_concepts=["c_depth_score"],
            min_required_words=130,
            latest_version="2.4.0"
        ),
        "c_depth_score": KBConcept(
            id="c_depth_score",
            name="Depth of Explanation",
            category="Document Intelligence",
            description="Quantitative evaluation metric assessing whether a concept is merely mentioned shallowly vs thoroughly explained with code, formulas or examples.",
            prerequisites=[],
            related_concepts=["c_prereq_chain"],
            min_required_words=150,
            latest_version="2.4.0"
        ),
        "c_celery": KBConcept(
            id="c_celery",
            name="Celery Queue",
            category="Async Infrastructure",
            description="Distributed task queue processing background asynchronous document parsing, embedding computation, and report rendering.",
            prerequisites=[],
            related_concepts=["c_redis"],
            min_required_words=110,
            latest_version="2.4.0"
        ),
        "c_redis": KBConcept(
            id="c_redis",
            name="Redis Cache",
            category="Async Infrastructure",
            description="In-memory key-value store serving as message broker for Celery and caching calculated embedding vectors.",
            prerequisites=[],
            related_concepts=["c_celery"],
            min_required_words=100,
            latest_version="2.4.0"
        )
    }
)
