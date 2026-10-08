SAMPLE_TECHNICAL_DOC_1 = """# Technical Specification: Enterprise Microservices Architecture

## Executive Overview
This document outlines the distributed cloud architecture for our enterprise data pipeline. The system handles real-time data ingestion and processing with high fault-tolerance.

## Authentication & Security
Our platform implements JWT Authentication for API endpoints. Users send bearer tokens with every request.
We enforce Role-Based Access Control to ensure authors and reviewers have appropriate project level permissions.

## High Performance Consensus Algorithm
We utilize Raft Consensus for maintaining state across server nodes. When a leader fails, follower nodes trigger an election term.
Log entries are replicated across majority quorum nodes before committing state.

## Vector Search & Embeddings
For semantic search across knowledge repositories, we compute Vector Embeddings for incoming document chunks.
Using Cosine Similarity metrics, our engine locates relevant reference concepts in high-dimensional vector space.

## Infrastructure & Async Processing
Background tasks are queued using Celery Queue and Redis Cache to process document parsing asynchronously.
"""

SAMPLE_TECHNICAL_DOC_2_WITH_GAPS = """# Architecture Overview: Distributed Analytics Engine

## Introduction
This specification documents our internal analytics database architecture.

## Consensus Implementation
We rely on Raft Consensus protocol to ensure state machine replication across our 5-node cluster. When electing a new leader, nodes send RPC requests.
(Note: Notice how this section introduces Raft Consensus before explaining the underlying Consistency Model or Paxos theory!)

## Graph Storage Engine
Our knowledge graph relies on Neo4j Ontology to query entity relationships.

## Data Sharding
We partition data tables using Sharding to distribute write load.
"""
