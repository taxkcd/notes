---
title: IIO Guide - III
date: 2025-11-14
---

# System Design Interview - Part 3: 3-Step Framework

> **Source**: [interviewing.io Part 3](https://interviewing.io/guides/system-design-interview/part-three)

## Framework Overview

**Three steps to design systems:**
1. **Requirements Gathering** → Define functional & non-functional requirements
2. **API & Scale Estimation** → Define data types, access patterns, and scale
3. **Design** → Choose data storage and microservices

**Key Principle**: Don't mention time allocations. Focus on mastering each step, not filling time.

---

## Step 1: Requirements Gathering

### 1.1 Functional Requirements

**Goal**: Define WHAT the system does (black box view, no implementation details)

**Process**:
1. Identify main business objects (e.g., Twitter: Accounts, Tweets)
2. Clarify relations between objects using cross-product matrix
3. Dive into object properties (can they contain media?)
4. Define access patterns: "Given object X, return all related Y"
5. Consider ranking requirements (chronological vs curated feeds?)
6. Ask about mutability: Can objects be edited/deleted after creation?

**Pro Tips**:
- If interviewer volunteers random info (e.g., "30 days to build"), it's important—use it
- For unfamiliar systems, ask interviewer for high-level overview first
- Media is common—always check if objects can hold images/videos

### 1.2 Non-Functional Requirements (NFRs)

**Three main NFRs to consider:**

**Performance** (Speed)
- **When to optimize**: Synchronous, user-facing, frequently accessed workflows
- Example: Twitter feed (users expect immediate response)
- Trade-off: May sacrifice consistency or add complexity

**Availability** (Uptime)
- **When to optimize**: When downtime = financial loss or correctness issues
- Measure: "Five nines" (99.999% = <6 min downtime/year)
- **Warning**: Don't obsess over "number of nines" unless design changes based on it
- Trade-off: May sacrifice consistency (banking prefers consistency over availability)

**Security**
- **When to optimize**: Low-trust code execution (user-submitted code)
- Must run in isolation/sandbox with limited resources
- Example: LeetCode code submissions, deployment systems

**Key Insight**: Relaxing one NFR is often strategic. Good candidates explain what they're NOT optimizing for and why.

---

## Step 2: API & Scale Estimation

### 2.1 Data Types to Store

Two categories:
- **Structured data**: Users, posts, metadata (JSON/database records)
- **Media/Blobs**: Images, videos, binaries (separate blob storage)

### 2.2 Define API (Access Patterns)

**Default to HTTP/REST** (90%+ of cases)

Convert functional requirements to endpoints:
```
GET /{accountId}/tweets?nextPageToken={token}
PUT /{accountId}/tweets
POST /{accountId}/retweet
```

**Rule**: One endpoint per access pattern from Step 1

### 2.3 Scale Estimation

**First**: Determine read-heavy vs write-heavy
- Analyze which endpoints get called most frequently
- Twitter example: `getFeed` >> `putTweet` (read-heavy)

**Optional Math** (ask interviewer first):
- Use powers of 10 for easy calculation
- When unsure, guess higher (margin of safety)
- Example: 100k reads/min, 1k writes/min, 1MB avg = 1GB/min storage

**Don't obsess over precision—ballpark is fine**

---

## Step 3: Design

### Mindset Shift

**Say this**: "I'm thinking out loud—don't hold me to any of this. We can iterate."

**Design = Iterative Process**: Identify → Implement → Assess → Improve

### 3.1 Data Storage

#### A. Blob Storage

**For**: Media, binaries, large files
- Use generic "blob storage" (don't say S3 unless you know it deeply)
- Consider CDN later for distribution (not in this step)

#### B. SQL vs NoSQL Decision

**Use SQL (Relational) when**:
- Need strong consistency (ACID transactions)
- Example: Banking, payment systems, inventory with stock levels

**Use NoSQL (Non-Relational) when**:
- Large volumes of unstructured data
- Horizontal scaling needed
- Eventual consistency acceptable
- Example: Social feeds, product catalogs, symptom databases

**Use Both when**:
- Mixed requirements (e.g., Amazon: SQL for transactions, NoSQL for product catalog)

**After deciding, mention trade-offs:**
- SQL: Rigid schema, vertical scaling, ACID guarantees
- NoSQL: Flexible schema, horizontal scaling, eventual consistency

#### C. Database Schema Design

**Process**:
1. Create table for each entity identified
2. Add unique, immutable IDs to each record
3. Review access patterns—adjust schema/indexes accordingly
4. Guard "get all" queries with pagination

**Optimization Pattern**: 
- Slow read-heavy access pattern? → Pre-compute and store results in separate table
- Example: Twitter feeds—store pre-computed feeds instead of computing on-demand
- Trade-off: Memory usage + maintenance complexity

**When to optimize**: Only after assessing limitations with interviewer

**Template for checking**: 
> "This works functionally, but may not meet our NFRs. Since we identified read-heavy traffic, this could be slow. Should we optimize?"

### 3.2 Microservices & Infrastructure

#### Caching (e.g., Redis)

**Use caching when ALL three are true:**
1. Read-heavy workload
2. Data doesn't mutate frequently (or mutability isn't critical)
3. Performance is a priority

**Trade-offs**: 
- Creates data inconsistency risk (stale cache vs DB)
- Adds maintenance complexity
- Memory cost

**Don't cache just because you can—have a reason**

#### Load Balancing

**Purpose**: Horizontal scaling + high availability

**Best for**: Stateless API servers
- Routes requests to any available node
- Round robin is most common strategy

**Benefits**:
1. Scalability: Add more servers as traffic grows
2. Availability: If one node fails, others handle traffic

---

## Complete Examples

### Example 1: Twitter
- **Functional**: Post tweets, follow accounts, view feeds, like/retweet
- **NFRs**: Performance (feeds), Availability (99.999%), eventual consistency OK
- **Data**: NoSQL (flexible, horizontal scaling), Blob storage (media)
- **Key Pattern**: Pre-compute feeds for active users, on-demand for inactive

### Example 2: Code Deployment System
- **Functional**: Publish release, deploy to servers, check status
- **NFRs**: Performance (1hr deploy time), Availability (99.9% OK), Security (trusted code)
- **Scale**: 1-10GB artifacts, thousands daily, hundreds of servers
- **Data**: Could use either SQL/NoSQL (simple schema, not much relation complexity)

### Example 3: interviewing.io
- **Objects**: Users, Interviews, Bookings, Recordings
- **NFRs**: Availability (platform must be up), Audio quality, Code isolation (security)
- **Data**: SQL (transactional bookings, well-defined schemas), Blob storage (video recordings)
- **Scale**: ~1000 interviews/day, 100MB each = 100GB/day

---

## Critical Reminders

1. **Never dive into design first**—70%+ of good design is requirements
2. **Every decision has trade-offs**—mention downsides of your choices
3. **Check with interviewer before optimizing**—they may not care about that problem
4. **Use generic names** ("cache") not brands ("Redis") unless you're an expert
5. **Pagination**: Always page "get all" endpoints
6. **Mutability matters**: Affects caching strategy significantly
7. **State trade-offs explicitly**: Shows senior-level thinking

---

## Anti-Patterns to Avoid

- ❌ Diving straight into drawing boxes
- ❌ Adding caching/load balancing without justification  
- ❌ Saying "5 nines availability" when it won't change your design
- ❌ Over-formatting responses with excessive bullets/headers (for senior+ roles)
- ❌ Writing too much code for APIs (signals junior level)
- ❌ Premature optimization without assessing current solution first
- ❌ Using brand names (S3, Redis) without deep expertise

---

## Interview Flow Template

```
1. Clarify functional requirements
   - Objects + relations
   - Access patterns  
   - Mutability

2. Agree on non-functional requirements
   - Performance needs?
   - Availability needs?
   - Security needs?

3. Define data types + API
   - Structured vs media
   - REST endpoints
   - Read-heavy vs write-heavy?

4. (Optional) Back-of-envelope math
   - Ask interviewer if they want this
   - Use powers of 10

5. Design storage
   - Blobs → blob storage
   - Structured → SQL vs NoSQL decision
   - Schema design + indexes

6. Add microservices
   - Caching (if justified)
   - Load balancing (for scalability)

7. Iterate
   - Assess limitations
   - Check with interviewer
   - Improve if needed
```