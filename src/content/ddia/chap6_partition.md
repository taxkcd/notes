# Chapter 6: Partitioning

## Introduction

**What is Partitioning?**
- Breaking data up into **partitions** (also called **sharding**)
- Each partition is a small database of its own
- Different names in different systems:
  - **Shard**: MongoDB, Elasticsearch, SolrCloud
  - **Region**: HBase
  - **Tablet**: Bigtable
  - **vNode**: Cassandra, Riak
  - **vBucket**: Couchbase

**Key Principle**: Each piece of data (record/row/document) belongs to **exactly one partition**

**Why Partition?**
- **Scalability**: Main reason for partitioning
- Different partitions can be on different nodes in shared-nothing cluster
- Query load distributed across many processors
- Throughput scales by adding more nodes
- Large datasets that don't fit on single machine

**Partitioning vs Replication**
- These are **independent** but usually used together
- Partitioning: Split dataset into smaller parts
- Replication: Keep copies of same data on multiple nodes
- Common setup: Each partition is replicated across multiple nodes for fault tolerance

---

## Partitioning and Replication

**Typical Architecture**:
- Each node may store multiple partitions
- Each partition is replicated on multiple nodes
- Node can be leader for some partitions and follower for others
- Partitioning scheme is independent of replication scheme

**Result**: Fault-tolerant, scalable system where data is both partitioned and replicated

---

## Partitioning of Key-Value Data

**Goal**: Distribute data and query load evenly across nodes

**Problems to Avoid**:
- **Skewed partitioning**: Unfair distribution of data/load
- **Hot spots**: Partitions with disproportionately high load
- Skew makes partitioning much less effective

**Random Partitioning**:
- Simplest approach: Assign records randomly to nodes
- **Problem**: Reading requires querying all nodes in parallel (no way to know which node has the data)
- Not practical for most use cases

---

### Partitioning by Key Range

**How It Works**:
- Assign continuous range of keys to each partition
- Similar to paper encyclopedia volumes (A-B, C-D, etc.)
- Boundaries chosen manually by admin or automatically by database

**Advantages**:
- Keys are **sorted within each partition**
- **Efficient range queries**: Easy to scan ranges
- Can quickly find partition for any given key

**Disadvantages**:
- Certain access patterns can cause **hot spots**
- Example: Partitioning by timestamp - today's partition gets all writes while old partitions sit idle
- Risk of uneven data distribution if key patterns are not uniform

**Used by**: Bigtable, HBase, RethinkDB, MongoDB (before 2.4)

**Best Practice**: Choose partition keys carefully to avoid hot spots (e.g., use sensor_name + timestamp instead of just timestamp)

---

### Partitioning by Hash of Key

**How It Works**:
- Use hash function to determine partition
- Assign each partition a **range of hashes** (not range of keys)
- Good hash function: Takes skewed data and makes it uniformly distributed

**Hash Functions**:
- No need for cryptographic strength
- Examples: MD5 (MongoDB), Murmur3 (Cassandra)
- Built-in hash functions in programming languages may not be suitable (e.g., Java's Object.hashCode() gives different values in different processes)

**Consistent Hashing**:
- Term sometimes used, but actual implementation differs from original definition
- Most DBs use simple range of hashes approach, not consistent hashing
- Boundaries can be evenly spaced or pseudorandom

**Advantages**:
- Distributes keys **fairly among partitions**
- Reduces hot spots caused by skewed key distribution

**Disadvantages**:
- **Lose efficient range queries**
- Adjacent keys scattered across partitions
- Range queries must be sent to **all partitions**
- MongoDB range queries work on hash if using hash-partitioned data, but inefficient

**Used by**: Cassandra, MongoDB, Riak, Couchbase, Voldemort

**Hybrid Approach (Compound Keys)**:
- Use part of key for partitioning, part for sorting within partition
- Example: social media (user_id, update_timestamp)
  - Hash on user_id for partitioning
  - Sort by timestamp within partition
- Enables efficient range queries within one user's data
- Used by Cassandra (first column is hash key, others for sorting)

---

### Skewed Workloads and Relieving Hot Spots

**The Celebrity Problem**:
- Even with hash partitioning, hot spots can occur
- Example: Celebrity with millions of followers - all writes to same key
- Extreme case: All writes go to same partition

**Current State**:
- Most systems **cannot automatically compensate** for highly skewed workload
- Application must handle hot keys

**Application-Level Solutions**:
- Add random number to beginning/end of hot key
- Splits writes across multiple keys (e.g., key + random 0-99)
- **Tradeoffs**:
  - Additional bookkeeping needed
  - Reads must query all split keys and combine results
  - Only needed for small number of hot keys
  - Adds complexity tracking which keys are split

**Future Direction**: More automated techniques for detecting and compensating for skew

---

## Partitioning and Secondary Indexes

**The Challenge**:
- Secondary indexes don't map neatly to partitions
- They are the **raison d'être** of relational databases
- Also common in document databases (MongoDB, Riak, Elasticsearch)
- Problem: Record may be in one partition, but secondary index might need to reference records in other partitions

**Two Main Approaches**:
1. Document-partitioned indexes (local indexes)
2. Term-partitioned indexes (global indexes)

---

### Partitioning Secondary Indexes by Document

**Also Called**: Local indexes

**How It Works**:
- Each partition maintains its **own secondary indexes**
- Index covers only documents in that partition
- Partition is completely independent

**Example**: Website selling cars
- Partition by document ID
- Each partition has indexes for color, make, etc.
- Index only covers cars in that partition

**Writing**:
- Only need to update **one partition**
- Fast writes

**Reading (Querying)**:
- Must query **all partitions** and combine results
- Known as **scatter/gather**
- Can be expensive, especially with many partitions
- **Tail latency amplification**: Slow partitions make overall query slow
- Most database systems prefer to query single partition when possible

**Used by**: MongoDB, Riak, Cassandra, Elasticsearch, SolrCloud, VoltDB

**Use Case**: Good when write throughput is critical and expensive queries are acceptable

---

### Partitioning Secondary Indexes by Term

**Also Called**: Global indexes

**How It Works**:
- **Global index** covers data in all partitions
- Global index itself is also partitioned (differently from primary key)
- Index partitioned by the **term** being indexed

**Example**: Cars database
- Primary data partitioned by document ID
- Color index partitioned by color (a-r in partition 0, s-z in partition 1)
- Make index partitioned by make name

**Why "Term-Partitioned"**: 
- Comes from full-text indexes where terms are words
- Applies to any indexed values

**Index Partitioning Approaches**:
- **By term itself**: Range scan over terms
- **By hash of term**: More even load distribution

**Writing**:
- Single document write may affect **multiple index partitions**
- Every term in the document needs index update
- Slower and more complicated than local indexes
- Usually **asynchronous updates**: Write lag between write and index update

**Reading (Querying)**:
- Can be served from **single partition** (efficient)
- Don't need to scatter/gather across all partitions
- Example: Query "red cars" - only read red partition of color index

**Used by**: DynamoDB, Riak's search, Oracle's global indexes

**Use Case**: Good when read performance is critical and write throughput can be somewhat compromised

---

## Rebalancing Partitions

**What is Rebalancing?**
- Moving load from one node to another
- Occurs when:
  - Query throughput increases → add more CPUs
  - Dataset size increases → add more disks/RAM
  - Machine fails → other machines take over

**Requirements After Rebalancing**:
- Load (data & requests) shared fairly between nodes
- Database continues accepting reads/writes during rebalancing
- No more data than necessary moved between nodes (minimize network/disk I/O)

---

### Strategies for Rebalancing

#### How NOT to Do It: Hash mod N

**Why mod N is Bad**:
- If partitions = hash(key) mod N
- When N changes, most keys need to move to different nodes
- Makes rebalancing very expensive
- Not used by databases in practice

---

#### Fixed Number of Partitions

**How It Works**:
- Create many more partitions than nodes at start
- Assign multiple partitions to each node
- When node added: Steal partitions from existing nodes
- When node removed: Distribute its partitions to other nodes

**Key Insight**: Only entire partitions move between nodes, not individual keys

**Example**:
- 10 nodes, 1000 partitions → 100 partitions per node
- Add node → new node takes partitions from existing nodes until balanced
- Each node now has ~91 partitions

**Partition Assignment**:
- Can be **random** (simple)
- Can be more sophisticated to account for hardware differences

**Advantages**:
- Number of partitions doesn't change
- Key-to-partition assignment doesn't change
- Only partition-to-node assignment changes
- Efficient: Change metadata only, not actual data movement

**Challenge: Choosing Number of Partitions**:
- Fixed at database setup, difficult to change later
- Too high: Management overhead
- Too low: Can't rebalance effectively
- Right number depends on total dataset size

**Used by**: Riak, Elasticsearch, Couchbase, Voldemort

**Guideline**: Size of each partition should be between certain minimum and maximum

---

#### Dynamic Partitioning

**How It Works**:
- Start with single partition
- When partition grows beyond threshold (e.g., 10GB), **split into two**
- When partition shrinks (due to deletions), **merge with adjacent partition**
- Similar to B-tree splitting/merging

**Advantages**:
- Number of partitions **adapts to data volume**
- Small datasets: Few partitions
- Large datasets: Many partitions
- Partition size stays within configured bounds

**Initial State Problem**:
- Start with single partition = all writes to same node (not ideal)
- **Solution**: Pre-splitting (configure set of initial partitions) - used by HBase, MongoDB

**Configuration**:
- Number of partitions proportional to dataset size
- Size of each partition inversely proportional to dataset size
- Splitting and merging keeps partitions within min/max bounds

**Used by**: HBase, MongoDB (since 2.4), RethinkDB

**Flexibility**: Can work with both key-range and hash partitioning

---

#### Partitioning Proportionally to Nodes

**How It Works**:
- Fixed number of partitions **per node**
- When node added: Randomly chooses fixed number of existing partitions to split
- Takes half of each split partition (new node gets half, old node keeps half)
- Randomization can produce unfair splits, but averages out over many partitions

**Example**: 
- 10 partitions per node
- 10 nodes → 100 partitions total
- Add node → 110 partitions total (11 per node on average)

**Advantages**:
- Partition size proportional to dataset size
- Number of partitions grows with cluster size
- Each partition size stays stable

**Used by**: Cassandra, Ketama

**Hash Function**: Uses hash-based partitioning with random partition boundaries

---

### Operations: Automatic or Manual Rebalancing

**Fully Automatic Rebalancing**:
- System automatically decides when/how to move partitions
- Less operational work
- **Risks**:
  - Can overload network/nodes
  - Rebalancing expensive: Moves large amounts of data, requires rerouting requests
  - Can harm performance of other requests
  - **Dangerous with automatic failure detection**: Node overloaded → slow → detected as dead → rebalance → more load → cascade failure

**Fully Manual Rebalancing**:
- Admin explicitly configures which partitions go where
- More operational work
- Less surprising behavior
- Prevents automatic rebalancing during unexpected times

**Hybrid Approach (Recommended)**:
- System suggests partition assignment
- Admin commits/approves changes
- Example: Couchbase, Riak, Voldemort
- Good balance: Automatic computation + human confirmation

**Best Practice**: Have human in the loop for rebalancing to prevent operational surprises

---

## Request Routing

**The Service Discovery Problem**:
- When client makes request, how does it know which node to connect to?
- Partitions rebalance → partition-to-node assignment changes
- General problem: **service discovery** (not limited to databases)

**Three Main Approaches**:

### Approach 1: Contact Any Node
- Client can contact any node
- If node has partition → handles request
- If not → forwards to appropriate node
- Node acts as **load balancer**

### Approach 2: Routing Tier
- All requests go through **routing tier** (partition-aware load balancer)
- Routing tier determines correct node
- Forwards request to appropriate partition
- Doesn't handle requests itself

### Approach 3: Client Awareness
- Client aware of partitioning and assignment
- Connects directly to appropriate node
- No intermediary needed

**Key Challenge**: How does routing decision-maker learn about partition assignment changes?

---

### Coordination Services

**Using Consensus Protocol**:
- Many systems use separate **coordination service** (e.g., ZooKeeper)
- ZooKeeper keeps authoritative partition-to-node mapping
- Other actors subscribe to this information

**Approach 1 + ZooKeeper**:
- Each node registers itself in ZooKeeper
- ZooKeeper maintains authoritative partition assignment
- Routing tier or clients subscribe to ZooKeeper
- When partition assignment changes, notified via ZooKeeper
- Used by: HBase, SolrCloud, Kafka

**Approach 2 + ZooKeeper**:
- Routing tier subscribes to ZooKeeper
- Used by: LinkedIn's Espresso

**MongoDB Approach**:
- Relies on config server (similar role to ZooKeeper)
- mongos daemon acts as routing tier
- Clients connect to mongos
- mongos queries config server for partition assignment
- Caches and routes requests

**Cassandra/Riak Approach**:
- Use **gossip protocol** among nodes
- Requests to any node
- Node knows about partition assignment changes via gossip
- Adds complexity but avoids external coordination service

**Couchbase Approach**:
- Doesn't automatically rebalance
- Configured routing tier called moxi
- Clients and nodes notified on any changes

---

### Client-Side Routing Libraries

**When Clients Route Directly**:
- Client library needs to know partition assignment
- Can query coordination service directly (ZooKeeper)
- Or receive updates from routing tier
- Avoids extra network hop

**Trade-off**: More complex client logic vs. better performance

---

## Parallel Query Execution

**Massively Parallel Processing (MPP)**:
- So far: Simple queries on single partition or scatter/gather on all partitions
- MPP databases: More sophisticated queries with parallel execution

**Complex Query Example**:
- Multiple joins
- Filtering
- Grouping
- Aggregation operations

**MPP Query Optimizer**:
- Breaks query into **execution stages**
- Partitions distributed across multiple machines
- Some stages depend on others
- Database automatically parallelizes query
- Uses partitioned data effectively

**Future Reference**: Covered more in Chapter 10 (Batch Processing)

**Key Insight**: Queries that would be complex on single machine become tractable when parallelized across hundreds of machines

---

## Summary

### Core Concepts Reviewed

**Partitioning Goal**:
- Spread data and query load evenly across multiple machines
- Avoid hot spots
- Enable scalability beyond single machine

### Partitioning Approaches

**Two Main Methods**:

1. **Key Range Partitioning**:
   - Keys sorted, partition owns range
   - Efficient range queries
   - Risk of hot spots if keys not chosen carefully

2. **Hash Partitioning**:
   - Hash function applied to each key
   - Reduces hot spots
   - Loses range query efficiency

### Secondary Index Partitioning

**Two Approaches**:

1. **Document-Partitioned (Local) Indexes**:
   - Each partition has own index
   - Writes update single partition (fast)
   - Reads require scatter/gather (slow)

2. **Term-Partitioned (Global) Indexes**:
   - Index partitioned separately from data
   - Writes update multiple partitions (slow)
   - Reads query single partition (fast)

### Rebalancing

**Purpose**: Move data when nodes added/removed

**Three Techniques**:
1. Fixed number of partitions
2. Dynamic partitioning (split/merge based on size)
3. Partitions proportional to nodes

**Best Practice**: Automatic partition assignment with manual approval

### Request Routing

**Challenge**: How clients find correct node for partition

**Solutions**:
- Contact any node (acts as load balancer)
- Routing tier
- Client-side routing
- Use coordination service (ZooKeeper) or gossip protocol

### Advanced Features

**Parallel Query Execution**:
- MPP databases can parallelize complex queries
- Query broken into stages
- Executed across many machines simultaneously

### Key Takeaway

Partitioning is a powerful technique for scalability, but introduces complexity in:
- Choosing partitioning scheme
- Handling secondary indexes  
- Rebalancing when cluster changes
- Routing requests to correct nodes

Understanding these trade-offs is essential for building large-scale distributed systems.


