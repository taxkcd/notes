---
title: IIO Guide - II
date: 2025-11-14
---

> **Source**: [interviewing.io Part 2](https://interviewing.io/guides/system-design-interview/part-two#part-2-introduction)
 

# System Design Interview Guide - Part 2: Introduction

## Overview

### What Part 2 Covers
- **15 fundamental system design concepts** (12 technical + 3 tacit knowledge)
- 30,000-foot overview of system design
- Introductory and theory-focused
- Best bang-for-your-buck concepts for interviews

### Concept Categories
1. **Tacit Knowledge** (3 concepts): Learned from thousands of interview hours
2. **Core Technical Topics**: Must know well
3. **Supplementary Topics**: Worth knowing a little (covered in future iterations)

## Proof: No Single Right Answer

### Watch and Learn
- Video showing two experts designing the same system side-by-side
- Proves "there's no right way to design a system"
- Demonstrates effective techniques:
  - Guiding interview toward your strengths
  - Being open about knowledge gaps
- Split into two parts for complete comparison

## Rules of Thumb (Apply to Everything)

### 1. Differentiating Good vs Stuck Candidates
- **Interviewer challenge**: Hard to tell bad candidate from good-but-stuck candidate
- **Your solution**: Communicate clearly when you're stuck

### 2. When Interviewer Interrupts You
- **Likely reason**: You're going off track
- **What to do**: 
  - Let them explain expected direction
  - Ask clarifying questions
  - Ensure understanding before proceeding

### 3. Questions vs Being Told
- **Good sign**: Interviewer asks you questions
- **Bad sign**: Interviewer tells you how to do things
  - Signals you need help to move forward
  - Will lower your score

### 4. Two Interview Situations
- **Situation A**: Interviewer knows area deeply
- **Situation B**: Interviewer knows topic at surface level
- **Hint**: Research interviewer's background for preparation clues

### 5. Breadth Over Depth
- **Key principle**: Cover everything broadly > explain everything in detail
- **Why**: Interviewer asks "Could this person get an MVP off the ground?"
- If answer is "no" → drastically reduced passing chances

### 6. Why Matters More Than What
- **Critical**: Explain reasoning for every decision
- Interviewers care about **tradeoffs** (positives/negatives)
- Be prepared to justify everything you say

### 7. Keep It Simple
- **First rule of distributed systems**: Avoid them if you don't need them
- Always consider maintenance costs
- People don't build distributed systems for fun
- If Google could run on one machine, they would
- **Occam's Razor**: Simple path > complex path
  - Not because simple is more correct
  - But because complex requires more assumptions to be true

### 8. Embrace "I Don't Know"
- Accept knowledge gaps
- Be ready to admit them
- Don't lose points by doing it right (covered in next concept)

### 9. Communication Skills Priority
- Once you reach competency threshold, communication > design skills
- **After this guide**: Focus on refining communication
- **Best practice**: Mock interviews with different interviewer types
- Or work with dedicated coach who knows you well

## Tacit Knowledge Concepts

### Concept 1: The Art of "I Don't Know"

#### Weak vs Strong Candidates
- **Weak**: Scared to say "I don't know"
- **Strong**: Say it more often + add a buffer
- **Naked "I don't know"** = dead end for interviewer
- **Buffered "I don't know"** = multiple paths forward

#### Three Levels of Knowledge

##### 🌟 Candidate #1: Expert Level
- **Knowledge**: Knows shit ton about topic (e.g., load balancers)
- **Most mid/senior engineers**: NOT this candidate
- **What to say**: "Rock on with your bad self" → strut your stuff

##### 🎯 Candidate #2: Surface Level (MOST COMMON)
- **Knowledge**: Knows what it is and what it does, not algorithms/internals
- **Best response**: "I don't know, I'm definitely going to look that up right after this interview, but if I had to give my best guess I'd say... [x] and here is why [explanation/thought process]"

**Alternative phrases**:
- "I'm going to throw some things out there, but don't hold me to them..."
- "I don't have experience with that yet but I've been reading [Thing] and I would approach it like [Idea]"
- "I don't have hands-on experience with this, but I have read about it and here's what I know"
- "This reminds me of this thing I built one time..."
- (With charisma) "This is super interesting, tell me more about that"

**Watch for**: Interviewer will give indications if you're on fruitful path

##### ❌ Candidate #3: No Knowledge
- **Knowledge**: Never heard of it
- **What to say**: Tell interviewer exactly that
- **Interviewer will either**:
  - Move to different topic
  - Explain it to you (listen and engage)

#### Pushing Back on Interviewer

**When interviewer suggests removing something**:

**Language for letting guard down**:
- Start with "I'm sorry"
- Example: "Ok. I'm sorry, but if we take out the cache won't that result in [technical reasoning]..."

**Language for demonstrating collaboration**:
- Use "We" or "Let's"
- Example: "We could take out the cache. However, if we did that one drawback would be [technical reasoning]..."

**Direct pushback**:
- "Sure we can take out the cache, though the reason I think a cache might be useful here is [technical reasoning]. Do you think there might be a better way we can approach this?"

### Concept 2: Time Management in 40-60 Minutes

#### Core Reality
- **Impossible**: Design real-world system in 40-60 minutes
- **Possible**: Design partial non-usable systems
- **Cannot**: Cover everything in depth

#### Breadth > Depth (Repeated)
- More important to cover everything broadly
- Common example: "Design Gmail"
  - Too many dimensions to actually design Gmail
  - "Whenever people tell you to 'design gmail' that is to scare you"

#### Handwaving Strategy
- **Definition**: "I'm going to skip going into [detailed thing] for now, but if we want, we can come back to it later"
- **Smart because**:
  - Avoids falling down rabbit holes
  - Prevents derailment
  - Shows time management

**Benefits**:
- Demonstrates knowledge by calling it out
- Keeps interview on track
- Shows you know where NOT to go (equally important)

#### Proactive Problem Identification
- **Don't**: Avoid problematic parts
- **Do**: Pinpoint them right away

**Template**:
"The challenge we would face very soon would be with [multiple workers updating their offsets while grabbing the next task concurrently?]. Let me finish the [API specs / DB schema / etc] part and then begin attacking that challenge. I know that would be a hard part, and might kindly ask you to navigate it if I begin approaching the problem from the wrong end."

### Concept 3: Two Interviewer Types

#### 🔥 Warm Interviewers
- **Characteristics**:
  - Enjoy collaboration
  - Like when you check in
  - Visibly engage during interview
  
- **What to do**:
  - Check in with them regularly
  - Ask questions
  - Treat like colleagues
  - Work through problem together

**Phrases to use**:
- "I think I can do X because of Y. What do you think?"
- "I think we can proceed with either X, Y, or Z. Personally, I think X because N. What do you think?"

**Warm interviewer quote**:
"It's better to ask first than to run with something you aren't sure about because it'll waste time and you'll go down the wrong path"

#### ❄️ Cold Interviewers
- **Characteristics**:
  - Prefer you work independently
  - Visibly withdraw with too much engagement
  - May seem like they'd rather not be there
  
- **Danger**: More likely to let you screw yourself
- **Reality**: Hard to find interviewer who admits they'd let candidate fail

**What to do**:
- Use statements instead of questions
- Do less thinking out loud
- Silences are more acceptable
- Don't speak until reasonably sure

**Phrases to use (statements, not questions)**:
- "Correct me if I'm wrong, but I think I can do X because of Y"
- "Stop me if I'm going off track, but I think the next thing to do is X because of Y"

**Cold interviewer quote**:
"If you go down the wrong road, I will just let you go there"

#### Key Balance
- **Questions**: Necessitate response (more work)
- **Well-worded statements**: Only need response if certain conditions met (less work)
- Too many questions → seem junior/incompetent
- Strategic check-ins at major milestones → seem senior

#### Common Failure Pattern
- Candidates expect engagement
- Get cold interviewer instead
- Become more cautious
- Make slower progress
- Get worse score

**Solution**: Do mocks with different people to get comfortable with different styles

#### Caveat on Questions
- **Don't ask dumb clarifying questions** just because you think you're "supposed to"
- Exposes you as more junior
- Ask questions that demonstrate understanding

**Example**:
- ❌ Check in after every single decision → noob
- ✅ Check in at major milestones (done with requirements, done with high-level design) → senior

---

# 12 Fundamental Technical Concepts

## 1. APIs (Application Programming Interfaces)

### What It Is
- Set of rules/contracts for communication between software entities
- Like hand gestures for ordering hot dogs on Mars (universal communication without common language)

### Three Main Architectural Styles

#### REST (Representational State Transfer)
- **Model**: Based on resources (entities in database)
- **Access**: Single URI per resource
- **Actions**: HTTP verbs (GET/PUT/POST/PATCH/DELETE)
- **Example**: `POST /order/orderNumber={} [Order body]`

**Strengths**:
- Structured data access/modification
- Universal standard
- Auto-generated documentation support
- Works for most circumstances

**Weaknesses**:
- Requires separate requests for each entity type
- Less space-efficient than RPC
- Not as flexible as GraphQL for complex queries

**When to use**: Default choice for most applications, especially external APIs

#### RPC (Remote Procedure Call)
- **Model**: Execute procedures/commands on remote machines
- **Concept**: Write code for remote execution like local code
- **Example**: `/placeAnOrder(OrderDetails order)`
- **Like**: Communication with family (skip formalities, make assumptions)

**Strengths**:
- More space-efficient than REST
- Easier development (no special syntax for remote calls)
- Internal communication friendly

**Weaknesses**:
- Only for internal communication
- Can hide timing/network issues
- Developers might miss corner cases in distributed scenarios

**When to use**: Internal microservices communication

#### GraphQL
- **Model**: Graph-based data relationships
- **Concept**: Clients define exactly what data they need
- **Process**: Build schema → clients craft custom queries
- **Like**: Amazon Go stores (take what you need, automatic tracking)

**Strengths**:
- Single request for all needed data (no multiple calls)
- Frontend devs can create queries without backend changes
- Perfect for mobile apps with complex data needs

**Weaknesses**:
- Upfront setup work (frontend + backend)
- Less friendly for external users vs REST
- Not suitable when backend aggregation needed
- Documentation not auto-generated like REST

**When to use**: Customer-facing web/mobile apps with complex, nested data requirements

### Quick Decision Guide
- **External/public API** → REST
- **Internal services** → RPC
- **Mobile/complex frontend** → GraphQL

---

## 2. Databases: SQL vs NoSQL

### Core Question
How should your system store data?

### SQL (Relational Databases)

#### Structure
- Tables with rows (entities) and columns (fields)
- Strict relationships between tables
- Fixed schema

#### Example
```
People Table | PetOwner Table | Cat Table
Separate tables with relationships
```

#### Advantages

**1. Powerful Querying**
- SQL language for complex queries
- No custom code needed
- Optimized over time independently

**2. Strong ACID Guarantees**
- **A**tomicity, **C**onsistency, **I**solation, **D**urability
- Strong consistency (users always see up-to-date info)
- Perfect for: Payment systems, financial transactions
- Trade-off: Slight delays acceptable to ensure correctness

#### Disadvantages

**1. Slower Writes**
- Uses B-Trees (fixed-size pages)
- Must overwrite existing values
- SSD limitation: must erase/rewrite large blocks
- Slower than NoSQL's append-only approach

**2. Higher Latency for Eventual Consistency Use Cases**
- Locks fields during updates
- Other users must wait
- Bad for apps where eventual consistency is fine (e.g., messaging apps)

**3. Schema Migrations Required**
- Fixed schema = migrations for new fields
- Expensive and time-consuming across all nodes
- NoSQL allows flexible schemas (different versions coexist)

#### Storage: B-Trees
- Mental model: Bags within bags with ranges
- Root bag → intermediate bags → leaf bags (photos)
- Pages = 4KB traditionally
- Fast reads, slower writes

**When to use SQL**:
- Strong consistency required
- Complex queries needed
- Financial/payment systems
- Data with clear relationships

---

### NoSQL (Non-Relational Databases)

#### Structure
- Nested key-value stores
- No fixed schema
- Four types: Document stores, Key-value, Column-family, Graph
- **Focus here**: Document stores (most common)

#### Example
```
{
  "person": {
    "name": "John",
    "cats": [...]
  }
}
```

#### Advantages

**1. Faster Writes**
- Uses LSM Trees (Log-Structured Merge Trees)
- Append-only (like a log list)
- No restructuring during writes
- Mental model: NASCAR scorekeeper adding times to list

**2. Better for Eventual Consistency**
- No field locking
- Lower latency
- Perfect for: Social media, messaging, content delivery

**3. Managed Services Include Auto-Scaling**
- DynamoDB, MongoDB have sharding out-of-the-box
- Less planning needed vs SQL
- Just increase paid capacity

**4. Flexible Schema**
- Different data versions can coexist
- No migrations needed
- Add fields without downtime

#### Disadvantages

**1. Slower/Limited Queries**
- Less efficient queries than SQL
- Must scan through data (like finding driver in long list)
- Limited query types

**2. Not Ideal for Strong Consistency**
- Can enable it, but introduces latency
- Defeats performance benefits

#### Storage: LSM Trees
- Append-only log structure
- Compaction improves efficiency over time
- Fast writes, slower reads (vs SQL)

**When to use NoSQL**:
- Write-heavy workloads
- Eventual consistency acceptable
- Flexible schema needed
- Horizontal scaling priority
- Social media, IoT, real-time apps

---

### Decision Framework

```
Need strong consistency? → SQL
Need fast writes? → NoSQL
Complex queries required? → SQL
Flexible schema needed? → NoSQL
Financial/payment data? → SQL
Social media/messaging? → NoSQL
```

**Note**: Lines blur with managed services (AWS RDS adds scaling, DynamoDB adds strong consistency options)

---

## 3. Scaling

### The Cat Celebrity Problem
- You have the cutest cat in the neighborhood
- More people want to see your cat
- Limited by: condo capacity + cat attention span
- **Scaling** = solving these bottlenecks as demand grows

### Two Major Approaches

#### Vertical Scaling (Scale Up)
- **Concept**: Make current computer more powerful
- **Example**: Bigger hard drive, more RAM, faster CPU
- **Cat analogy**: Renovate condo, give cat cybernetic upgrades

**Advantages**:
- Easiest initially (no architecture changes)
- Reduces latency (everything local, no network calls)
- No distributed systems complexity

**Disadvantages**:
- Hardware limits exist
- Single point of failure
- Expensive at high levels
- Downtime during upgrades

**When to use**: Initial scaling, latency-sensitive operations

---

#### Horizontal Scaling (Scale Out)
- **Concept**: Add more computers, distribute load
- **Example**: Multiple servers sharing work
- **Cat analogy**: Buy more condos, clone your cat

**Two Forms**:

##### Database Scaling (Sharding)
- Split data across multiple databases
- Hash function determines which database stores what
- `machine_id = H(request_id) % n`
- Can add layers of sharding for efficiency

**Challenge**: Adding/removing nodes requires reallocation

##### Compute Scaling
- Process work in parallel across machines
- Jobs in a queue
- Multiple workers process simultaneously
- **Example**: Divide video into pieces, process in parallel

**Advantages**:
- No hardware limits
- Fault tolerance (one machine down ≠ system down)
- Cost-effective at scale
- No downtime for adding capacity

**Disadvantages**:
- Complex architecture
- Network latency between machines
- Harder to debug
- Data consistency challenges

**When to use**: High traffic, need fault tolerance, growing data

---

### Combined Approach (Real-World)

#### Email Architecture Example (Gmail, Yahoo, Outlook)
- **Vertical**: Size nodes for user sets (geographic regions)
- **Horizontal**: Millions of primary + backup nodes
- **Reason**: Keep user data together (privacy laws), reduce latency
- **Load balancer** decides which node handles each user

### Scaling Strategy
1. Start with vertical scaling (simple)
2. Add horizontal as traffic grows
3. Combine both for optimal performance
4. Consider latency vs complexity tradeoffs

### Key Principle
> "The first rule of distributed systems is that you should avoid them if you don't need them!"

**Don't scale until you need to** → Assess users, data volume, traffic patterns first

---

## 4. CAP Theorem

### The Bank Branch Analogy

#### Setup
- Bank in New York (main branch)
- Bank opens in London (expansion)
- You deposit in NY, vacation in London
- London has no record of your deposit!

#### Problem
- Branches don't share transaction data
- Inconsistent information across locations

### Solution Attempts

#### Strong Consistency Approach
- Branches phone each other before completing transactions
- All branches must acknowledge
- Transaction only complete when everyone records it

**Problem**: What if London is closed? NY transactions can't complete! (Not available)

#### High Availability Approach
- Don't wait for acknowledgments
- Send email instead (async)
- London processes backlog when it reopens

**Problem**: Network outage? Can't send emails! Must choose: complete transaction (inconsistent) or reject (unavailable)

---

### CAP Theorem Defined

Three properties (can only achieve 2 of 3):

#### C - Consistency
- All nodes see same data at same time
- Users always see up-to-date information
- **Example**: Banking, payment systems

#### A - Availability
- System always responds to requests
- May serve slightly stale data
- **Example**: Social media, content apps

#### P - Partition Tolerance
- System continues operating despite network failures
- **In practice**: Always required (networks fail)
- **Real choice**: Consistency vs Availability

---

### Practical Decision

Since Partition Tolerance is mandatory:

**CP Systems (Consistency over Availability)**
- Reject requests during network issues
- Guarantee data correctness
- Use for: Finance, booking systems, inventory

**AP Systems (Availability over Consistency)**
- Always respond, accept stale data temporarily
- **Eventual consistency**: Becomes consistent over time
- Use for: Social feeds, video streaming, messaging

**Examples**:
- **TikTok**: OK if some users see video later (AP)
- **Bank account**: NOT OK if balance is wrong (CP)

### The Tradeoff
```
Network partition occurs:
├─ CP: "Sorry, can't process now" (maintain correctness)
└─ AP: "Here's the data I have" (may be stale)
```

**Remember**: You can't have strong consistency AND high availability during network failures

---

## 5. Security & Authentication

### The Zombie Apocalypse Door

#### Scenario
- Grocery store, thin wooden door
- Need security vs need to exit
- Too secure = wall (can't leave)
- Not secure = hole (zombies enter)
- **Goal**: Right balance of security + functionality

---

### Authentication Components

#### 1. Username + Password

**Storage Rules (CRITICAL)**:

❌ **NEVER DO**:
- Store passwords in plain text
- If database compromised = all passwords exposed
- Users reuse passwords across sites

✅ **DO**:
- Hash passwords with cryptographic function
- Store hash, not password
- Login: hash submitted password, compare hashes
- **Cannot reverse hash** to get original password

---

#### 2. Salting

**Problem**: Rainbow tables
- Huge lookup tables: common passwords → their hashes
- Attacker finds hash in table → knows password

**Solution**: Salt
- Random string added to password before hashing
- Hash `password + salt`, store both hash and salt (salt is NOT secret)
- Example: `hash("password123:a8h2rmd1tb")`
- Rainbow tables useless (don't have salted versions)
- Forces attacker to brute force each user individually
- Use slow hash function (increases brute force time)

**Note**: Don't write your own crypto! Use vetted libraries

---

#### 3. Secure Submission

**HTTPS Always**
- Especially for login endpoints
- Prevents password interception on network

**Logging Warning**:
- Don't auto-log POST bodies or GET parameters
- Will capture passwords in plain text
- Only log after verifying no sensitive data

---

#### 4. Session Management

**Problem**: Don't want password with every request

**Session Tokens**:
- Random, long, secure token generated at login
- Represents this user's session
- Sent in cookie with subsequent requests
- **Treat like password**: Salt and hash before storing
- Include expiration date (short as feasible)
- Rotate silently in background

**JWT (JSON Web Tokens)**:
- Encode user ID, permissions, expiration in token
- Two approaches:

**Signed JWT** (most common):
- Private key signs token
- Anyone with public key can verify
- Advantage: Third parties can validate
- Advantage: Transparent (client sees contents)

**Encrypted JWT**:
- Encrypted payload
- Only server can decrypt
- Like session token but distributed
- Can store small data for session duration

---

#### 5. Cookies

**What**: Key-value pairs browser stores and sends with requests

**Security Flags**:
- `Secure`: Only send over HTTPS
- `HttpOnly`: JavaScript can't access (prevents XSS)
- `SameSite`: Limits cross-site requests (prevents CSRF)

**Use**: Store session tokens/JWTs for automatic inclusion in requests

---

### Authentication Lifecycle

```
1. Signup
   ├─ User provides password
   ├─ Generate random salt
   ├─ Hash (password + salt)
   └─ Store: username, salt, hash

2. Login
   ├─ User submits password (HTTPS)
   ├─ Retrieve salt for user
   ├─ Hash (submitted password + salt)
   ├─ Compare with stored hash
   ├─ If match: generate session token
   └─ Return token in secure cookie

3. Authenticated Requests
   ├─ Browser automatically sends cookie
   ├─ Server validates token
   └─ Process request

4. Logout
   └─ Invalidate token
```

### Key Principles
- Defense in depth (multiple security layers)
- Assume breaches will happen (hash everything sensitive)
- HTTPS everywhere
- Short token expiration
- Use established libraries, not DIY crypto

---

## 6. Load Balancers

### The Parking Lot Problem

#### Scenario
- You own 3 parking lots near shopping district
- Lots 1 & 2 fill up
- Lot 3 stays empty
- Customers leave thinking no parking available
- **Solution needed**: Distribute traffic evenly

**Load Balancer** = System directing customers/requests to available resources

---

### Purpose
- Distribute traffic across multiple machines
- Handle machine additions/removals
- Manage failures
- Essential for distributed systems

---

### Load Balancing Algorithms

#### 1. Round Robin
**How it works**:
- N machines → send to each in rotation
- Machine 1, Machine 2, Machine 3, Machine 1...

**Example**: 3 parking lots → 1st car to lot 1, 2nd car to lot 2, 3rd car to lot 3, 4th car to lot 1

**Pros**:
- Simple to implement
- Fair distribution if all machines equal

**Cons**:
- Doesn't account for machine load
- Continues sending to overloaded machines
- Assumes uniform capacity

**When to use**: Identical servers, similar request costs

---

#### 2. Least Connections / Minimum Response Time
**How it works**:
- Route to machine with fewest connections
- Or machine with fastest response time
- Checks actual load before routing

**Example**: Parking lot with broken ticket machine → sends fewer cars there

**Pros**:
- Adapts to machine performance
- Handles varying request durations
- Better for heterogeneous servers

**Cons**:
- More complex tracking
- Overhead of monitoring

**When to use**: Varying connection times, different server capacities

---

#### 3. Hashing
**How it works**:
- Hash based on request property (user ID, IP address)
- `machine_id = H(request_id) % n`
- Same input → same machine

**Example**: 
```
request_id = 292341
n = 160
machine_id = H(292341) % 160 = 112
```

**Pros**:
- Session persistence (same user → same server)
- Useful for WebSocket connections
- Stateful applications

**Cons**:
- Adding/removing machines reallocates many keys
- Uneven distribution if hash not uniform
- Can overwhelm servers during reallocation

**When to use**: Sticky sessions needed, stateful connections, consistent routing required

---

### Comparison

| Algorithm | Distribution | Stickiness | Complexity | Adaptation |
|-----------|-------------|-----------|------------|-----------|
| Round Robin | Even | No | Low | No |
| Least Connections | Adaptive | No | Medium | Yes |
| Hashing | Variable | Yes | Medium | No |

### Key Considerations
- **Stateless** applications → Round Robin or Least Connections
- **Stateful** applications → Hashing
- **Real-time** requirements → Least Connections
- **Simple** setup → Round Robin

**Note**: Modern load balancers often combine multiple strategies

---

## 7. Caching

### The Line Counter Analogy

#### Problem
```
How many lines are in this text?
```
- Function counts: 11 lines
- Someone asks again
- Instead of recounting → remember "11"
- **This is caching**: Store expensive computation result

---

### What Is Caching?
- Store expensive computation/data for reuse
- Avoid repeating work
- Trade storage/memory for speed

### Storage Location
- **Primary**: RAM (fastest)
- **Alternative**: Disk (slower but cheaper)

---

### When to Use Caching

#### Read-Heavy Systems
**Perfect for**: Twitter, YouTube
- Most users: reading tweets, watching videos
- Few users: posting content
- Cache popular content

#### The 80/20 Rule
- 80% of requests served by 20% of cached data
- Cache the most popular items
- **Example**: Popular tweet → cache everywhere (device, CDN, application)

#### Geographic Relevance
- Cache popular content per region
- **Example**: 
  - Britney Spears video → cache in America
  - Korean drama → cache in Korea

---

### Caching Patterns

#### 1. Cache-Aside (Lazy Loading)
**Most popular pattern**

**Flow**:
```
1. Application checks cache
2. If MISS → fetch from database
3. Write to cache
4. Return to user
```

**Advantages**:
- Only cache what's needed
- Simple to implement

**Disadvantages**:
- Data can become stale (DB updates bypass cache)
- Cache misses add latency (cache → DB → cache → user)
- If many misses → worse than no cache

**Mitigation**: Add TTL (Time To Live) for automatic expiration

**When to use**: Read-heavy, unpredictable access patterns

---

#### 2. Write-Through
**Flow**:
```
1. Application writes to cache
2. Cache synchronously writes to DB
3. Return to user
```

**Advantages**:
- Cache always up-to-date
- Data consistency

**Disadvantages**:
- Slower writes (sync operation)
- Caches all writes (even rare reads)
- Wastes cache memory on unpopular data

**When to use**: Read-heavy, write consistency critical

---

#### 3. Write-Back (Write-Behind)
**Flow**:
```
1. Application writes to cache
2. Cache queues write to DB (async)
3. Return to user immediately
4. DB updated later
```

**Advantages**:
- Fast writes (async)
- Batching possible

**Disadvantages**:
- Data loss risk (if cache fails before DB write)
- Inconsistency window
- All data cached (memory waste)

**When to use**: Write-heavy, eventual consistency OK

---

### Client-Side Caching

**Example**: Netflix app
- Movie thumbnails cached on device/browser
- Served from local memory
- No network call needed
- Faster load times

**When to use**: Static assets, user-specific data, mobile apps

---

### Cache Invalidation

#### The Stale Data Problem
```
Cache says: 11 lines
Reality: 13 lines (2 added)
Data is now stale!
```

#### LRU (Least Recently Used)
**Most important policy**

**How it works**:
```
Memory: 4 slots

Add A (timestamp 1) → [A¹]
Add B (timestamp 2) → [A¹, B²]
Add C (timestamp 3) → [A¹, B², C³]
Access B (timestamp 4) → [A¹, C³, B⁴]  // B updated
Add D (timestamp 5) → [A¹, C³, B⁴, D⁵]
Add E (timestamp 6) → [C³, B⁴, D⁵, E⁶]  // A evicted (oldest)
Access C (timestamp 7) → [B⁴, D⁵, E⁶, C⁷]  // C updated
Add F (timestamp 8) → [D⁵, E⁶, C⁷, F⁸]  // B evicted
```

**Why LRU?**:
- 80/20 rule: Popular data accessed repeatedly
- Keeps "hot" data in cache
- Automatically evicts "cold" data

**Result**: Fewer cache misses (popular items stay cached)

---

### Cache Patterns Summary

| Pattern | Write Speed | Read Speed | Consistency | Memory Usage |
|---------|------------|-----------|-------------|--------------|
| Cache-Aside | N/A | Miss = Slow | Can be stale | Efficient |
| Write-Through | Slow | Fast | Strong | Wasteful |
| Write-Back | Fast | Fast | Eventual | Wasteful |

### Key Principle
Caching reduces latency for read-heavy systems by storing popular data closer to users

---

## 8. Message Queues

### The Zombie Apocalypse Tribe

#### Scenario
- Future cavemen forgot concept of queuing
- Resource distribution = chaos + fights
- Leader must supervise every distribution
- **Solution**: Introduce queues (line up, wait your turn)
- **Improvement**: Priority queues (children/elderly first)

**Lesson**: Queues enable efficient resource distribution without constant supervision

---

### What Are Message Queues?

#### Definition
- Intermediary for asynchronous communication
- **Fire and forget**: Send message, don't wait for response
- Task handled later by worker
- Decouples sender from processor

#### Analogy
- Community: Add basket of food → people line up → orderly distribution
- Systems: Add task to queue → workers process → efficient handling

---

### Asynchronous Systems

#### Characteristics
- Client sends request
- Does NOT wait for delivery/processing
- Like API call but no response expected
- Client moves on immediately

#### Components
- **Producer**: Sends messages
- **Queue/Broker**: Holds messages
- **Consumer**: Processes messages

---

### Queue Properties

#### Based on Implementation

**1. Single vs Multiple Queues**
- Single queue: All consumers subscribe
- Multiple queues: Different queues for different needs

**2. Message Filtering**
- Consumers filter messages they can process
- Or queue intelligently routes to appropriate consumers

**3. Delivery Guarantees**
- At-most-once (may lose messages)
- At-least-once (may duplicate)
- Exactly-once (guaranteed single delivery)

**4. Ordering**
- FIFO (First In First Out)
- Priority-based
- No ordering guarantee

---

### Common Technologies

**Note**: Don't mention brand names in interviews unless you're an expert!

- **Kafka**: High throughput, distributed, persistent
- **RabbitMQ**: AMQP protocol, reliable, flexible routing

---

### When to Use Message Queues

#### Use Cases
1. **Decouple Services**: Producer doesn't need to know about consumers
2. **Handle Traffic Spikes**: Queue absorbs bursts
3. **Background Processing**: Long-running tasks (video encoding, email sending)
4. **Async Workflows**: Order processing, notifications
5. **Microservices Communication**: Event-driven architecture

#### Benefits
- **Reliability**: Messages persist until processed
- **Scalability**: Add more workers as needed
- **Fault Tolerance**: Workers can fail, messages remain
- **Load Leveling**: Smooth out traffic spikes

#### Example Flow
```
User uploads video
    ↓
API stores video, sends message to queue
    ↓
API returns immediately to user
    ↓
Worker picks up message from queue
    ↓
Worker processes video (transcoding, thumbnails)
    ↓
Worker updates database when complete
```

### Key Principle
Message queues enable **fire-and-forget** operations, allowing systems to handle tasks asynchronously without blocking

## 9. Indexing

### The Problem
- **Analogy**: Doreamon's magical pouch - too large, hard to find items
- Slow websites/portals often lack proper indices
- Database queries take too long to find data

### What Indexing Does
- Mechanism to map data for faster retrieval
- Like a book's index - find chapter by page number quickly
- Avoids scanning every record on disk

### How It Works

#### Without Index
- **Example**: 100 records, 128B each, 512B blocks
- Each block holds 4 records
- Worst case: Load 25 blocks (100/4) to find data

#### With Index
- **Index**: Map of record ID (key) → block address (value)
- Each key-value pair: 2B → Total index: 200B
- **Process**: 
  1. Load index into RAM
  2. Find block address from key
  3. Load specific block only
- **Result**: 2 I/O calls instead of 25

### Types of Indices
- **Dense Index**: Key-value mapping for EVERY record
- **Sparse Index**: Mapping for SUBSET of records

### Multilevel Indices
- **Problem**: As database grows (100 → 10,000 records), index grows too
- 10,000 records → 20,000B index → ~40 I/O calls
- **Solution**: Index of indices (multiple levels)
- Reduces I/O calls from 40 to 2

### B-Trees
- **Purpose**: Self-adjusting trees for multilevel indexing
- Generalized Binary Search Trees
- Data stored in sorted order
- Efficient space utilization + small tree height

**Properties** (for B-tree of order n):
- Each node has max n children
- Root: minimum 2 children
- Internal nodes: minimum ⌈n/2⌉ children
- All leaf nodes at same level

### B+ Trees (Extension of B-Trees)
- **Key differences**:
  - Only leaf nodes store actual data
  - Internal nodes only store keys
  - Leaf nodes linked together (sequential access)

---

## 10. Failover

### The Scenario
- **Analogy**: Plane pilot locks himself in bathroom (spider phobia)
- No one piloting! Need to find new leader quickly
- This is failover - leader fails, need replacement

### What Failover Is
- **Trigger**: When leader node fails
- **Process**: Promote follower to new leader
- **Prerequisite**: Track leader failures via health-status pings

### Failover Process
1. Detect leader failure (health checks/response times)
2. Identify best replacement (usually most up-to-date follower)
3. Promote follower to leader
4. Notify system of new leader

### Tricky Issues

#### Split-Brain Problem
- Old leader comes back online
- Both old and new think they're leader
- System has two leaders → data conflicts
- **Solution**: Old leader must recognize role change, become follower

#### Data Loss Risk
- If using asynchronous replication
- Uncommitted writes on old leader lost when it fails

#### False Positives
- Network issues may fake leader failure
- System promotes new leader unnecessarily

### Best Practice
- Have backup ready (like backup pilot)
- Use replication strategies
- Ensure old leader picks up follower role when returning

---

## 11. Replication

### The Analogy
- **480 BC Sparta**: Leonidas defending against Persians
- Messengers carry orders
- If messenger killed → orders never arrive, lose battle
- **Solution**: Replicate critical info across multiple messengers
- No single point of failure

### Why Replicate
- **High Availability**: System works even if nodes fail
- **Low Latency**: Serve users from geographically closer replicas
- **Scalability**: Read requests distributed across multiple machines

### Key Terms
- **Replica**: Copy of data
- **Leader**: Handles write requests
- **Followers**: Replicas of leader, handle read requests

### Replication Types

#### Synchronous Replication
- **Process**: Leader waits for acknowledgment from ALL followers
- **Analogy**: Leonidas waits for confirmation all messengers heard
- **Pros**: Guaranteed delivery to all followers
- **Cons**: Slower, client waits longer

#### Asynchronous Replication
- **Process**: Leader doesn't wait for follower acknowledgment
- **Analogy**: Leonidas barks orders, assumes heard, moves on
- **Pros**: Faster, less time-consuming
- **Cons**: No guarantee of delivery

#### Semi-Synchronous (Hybrid)
- ONE follower synchronous
- Rest asynchronous
- If synchronous follower crashes → promote asynchronous one
- **Benefit**: Up-to-date copy in at least 2 nodes, client not waiting long

### Replication Architectures

#### Single-Leader (Primary-Standby / Active-Passive)
- **Structure**: One leader, multiple followers
- **Writes**: All go through leader
- **Reads**: Handled by followers
- **Leader role**: Pass write info to followers
- **Failover**: Promote follower (with most up-to-date data) when leader fails
- **Old name**: Master-slave (now deprecated)

#### Multi-Leader
- **Structure**: Multiple machines accept writes
- **Benefit**: More reliable if one leader fails
- **Challenge**: All machines must sync writes from other machines
- **Analogy**: Multiple messenger group leaders reporting to Leonidas

#### Leaderless
- **Structure**: All machines handle reads and writes
- **No hierarchy**: No designated leader
- **Mechanism**: 
  - Client writes to all machines OR
  - Coordinator broadcasts to all nodes
- **Quorum**: Minimum acknowledgments (writes) / consistent values (reads) for validity
- **Analogy**: Messengers compare notes for latest order before delivery

---

## 12. Consistent Hashing

### The Problem
- **Analogy**: WWI - French general needs to distribute troops via taxis
- 1000 taxis, 2000 troops → each taxi gets 2 soldiers
- **Issue**: Don't know how many taxis will volunteer or when
- Don't know how many trips each will make
- Need dynamic, balanced work distribution

### Real-World Application
- Servers added/removed unpredictably
- Need to balance work evenly
- Must handle dynamic changes without performance hit

### Naive Approach (Doesn't Scale)
- **Method**: Hash(key) % N (where N = number of nodes)
- **Example**: Cache key 1234, 3 servers (0, 1, 2)
- Hash result = 1 → assign to server #1
- **Problem**: Works ONLY with static number of servers
- When server added/removed → change N → all assignments change
- **Cost**: O(N) operation to reallocate ALL keys
- Bad during high traffic (when node likely failed)

### Consistent Hashing Solution

#### Hash Ring Concept
- Map hash results onto a ring (e.g., 0 to 100)
- Assign each node to a point on ring
- To read/write: plot hash position, go clockwise to next node
- That node owns the key

#### When Node Fails
- Only reallocate keys assigned to THAT node
- Keys go to next node clockwise
- **Cost**: O(N/M + log M) where M = nodes, N = keys
- Much better than O(N)

#### Virtual Nodes Problem
- **Issue**: If purple node fails → all keys go to red node
- Red inherits high traffic → red fails → cascade failure

#### Virtual Nodes Solution
- Put MULTIPLE points per node on ring (not just one)
- Randomly distributed
- When node fails → keys distributed evenly across ALL remaining nodes
- Prevents cascade failure

### Performance Tradeoffs

#### Naive Hashing
- Add/remove node: O(N)
- Insert/lookup key: O(1)

#### Consistent Hashing
- Add/remove node: O(N/M + log M)
- Insert/lookup key: O(log M) - binary search for next node

---

## Outro

### What You've Accomplished
- ✅ Completed theory fundamentals
- ✅ Achievement unlocked 🤖
- ✅ Ready for practical application

### What's Next
- **Parts 3 & 4**: Getting super practical
- Integrate all theories discussed
- Build simple systems from scratch
- Learn how to get unstuck
- 3-step framework to crush interviews

### The Goal
- You won't be an expert yet
- But you'll be well on your way
- Better engineer + much better interview candidate

---

