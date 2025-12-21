


# Chapter 5: Replication

## Introduction to Replication

**Replication** means keeping a copy of the same data on multiple machines that are connected via a network. This is one of the fundamental concepts in distributed data systems.

### Why Do We Need Replication?

There are several compelling reasons to replicate data:

1. **Reduce Latency (Geographic Proximity)**: Keep data geographically close to your users. If you have users across the world, having data centers in multiple regions means users can access data from the nearest location, reducing network round-trip time.

2. **High Availability (Fault Tolerance)**: Allow the system to continue working even if some machines fail. If one server goes down, others can still serve requests, ensuring your application remains available.

3. **Read Scalability (Increased Throughput)**: Scale out the number of machines that can serve read queries. Instead of one machine handling all read requests, you can distribute the load across multiple replicas, dramatically increasing the total read throughput your system can handle.

### The Core Challenge

Replicating static data (data that never changes) is trivial—just copy it once to every node and you're done. The real challenge in replication is **handling changes to replicated data**. How do you ensure that when data changes on one node, those changes are properly reflected on all other nodes?

---

## Leaders and Followers (Single-Leader Replication)

The most common solution to the replication problem is **leader-based replication** (also known as active/passive or master/slave replication).

### How It Works

```
Client Write Request
       ↓
   [Leader Node]
   /    |    \
  ↓     ↓     ↓
[F1]  [F2]  [F3]  ← Follower Nodes
  ↑     ↑     ↑
  Read Read Read ← Clients can read from any node
```

1. **One replica is designated as the leader** (also called master or primary)
2. **Write requests must go to the leader**: When clients want to write to the database, they must send requests to the leader, which first writes the new data to its local storage
3. **Leader sends data to followers**: Whenever the leader writes new data to its local storage, it also sends the data change to all of its followers as part of a **replication log** or **change stream**
4. **Followers apply changes**: Each follower receives the replication log from the leader and applies these changes to its own local copy of the database in the same order
5. **Reads can go anywhere**: Clients can query the leader or any of the followers for reads. However, writes are only accepted on the leader.

### Real-World Examples

This approach is used by many popular databases:
- **Relational databases**: PostgreSQL, MySQL, Oracle Data Guard, SQL Server's AlwaysOn Availability Groups
- **NoSQL databases**: MongoDB, RethinkDB, Espresso
- **Message brokers**: Kafka, RabbitMQ (for high availability queues)

---

## Synchronous vs. Asynchronous Replication

One of the most important decisions in leader-based replication is whether replication should be **synchronous** or **asynchronous**. This choice has profound implications for your system's behavior.

### Synchronous Replication

In synchronous replication, the leader waits for confirmation from followers before reporting success to the client.

**How it works:**
1. Client sends write to leader
2. Leader writes to its own storage
3. Leader sends change to followers
4. **Leader waits for acknowledgment from followers**
5. Followers write to their storage and send acknowledgment
6. Leader responds to client confirming the write

```
Client → Leader → Follower 1 (wait for ACK) ✓
              → Follower 2 (wait for ACK) ✓
        ← Response to Client
```

**Advantages:**
- **Strong durability guarantee**: The follower is guaranteed to have an up-to-date copy of the data that is consistent with the leader
- **No data loss if leader fails**: If the leader suddenly fails, the data is still available on the synchronous follower

**Disadvantages:**
- **Increased latency**: The write operation takes longer because you must wait for the network round-trip to the follower and the follower's write to complete
- **Reduced availability**: If the synchronous follower doesn't respond (crashed, network issue, etc.), the write cannot be processed. The leader must block all writes until the follower becomes available again.
- **Impractical for all followers**: If you have multiple followers and make them all synchronous, any single node outage would cause the entire system to grind to a halt

### Asynchronous Replication

In asynchronous replication, the leader does not wait for followers before reporting success to the client.

**How it works:**
1. Client sends write to leader
2. Leader writes to its own storage
3. Leader immediately responds to client
4. Leader sends change to followers (but doesn't wait for acknowledgment)
5. Followers eventually receive and apply the changes

```
Client → Leader ← Immediate response
              → Follower 1 (no wait)
              → Follower 2 (no wait)
```

**Advantages:**
- **Low latency**: The leader can respond to the client immediately without waiting for followers
- **High availability**: The leader can continue processing writes even if all followers have fallen behind or are temporarily unavailable
- **Better throughput**: The system can handle more writes per second since the leader isn't blocking on follower acknowledgments

**Disadvantages:**
- **Potential data loss**: If the leader fails before followers receive the latest writes, those writes are lost permanently
- **Weakened durability**: There's no guarantee that writes have been persisted to multiple machines
- **Eventual consistency**: Followers may lag behind the leader, so reads from followers may return stale data

### Semi-Synchronous Replication (The Practical Middle Ground)

Most real-world systems use a hybrid approach called **semi-synchronous replication**:

- **One follower is synchronous**: The leader waits for acknowledgment from one follower before responding to the client
- **Other followers are asynchronous**: The leader doesn't wait for them

```
Client → Leader → Follower 1 (synchronous - wait for ACK) ✓
              → Follower 2 (asynchronous - no wait)
              → Follower 3 (asynchronous - no wait)
        ← Response to Client
```

This provides a good balance:
- You get some durability guarantee (data exists on at least two nodes)
- You don't sacrifice availability (if one synchronous follower fails, another can be promoted to synchronous)
- Latency is still reasonable (only waiting for one follower, not all of them)

### Configuration in Practice

In many relational databases, this is a configurable option. For example:
- PostgreSQL allows you to specify which followers are synchronous
- MySQL has settings for synchronous vs. asynchronous replication

Other systems are hardcoded to be either synchronous or asynchronous by design.

---

## Setting Up New Followers

A common operational task is adding new follower nodes to increase read capacity or replace failed nodes. The challenge: how do you set up a new follower without locking the database and making it unavailable?

### The Naive Approach (Doesn't Work)

You might think: "Just lock the database, copy all data to the new follower, then unlock." But this would cause downtime, which defeats the purpose of high availability.

### The Correct Approach: Snapshot and Catch-Up

Here's how it's actually done:

1. **Take a consistent snapshot** of the leader's database at some point in time, without locking the entire database. Most databases have features to do this.

2. **Copy the snapshot** to the new follower node.

3. **Connect to the leader** and request all changes that happened since the snapshot was taken. The snapshot must be associated with a specific position in the leader's replication log. This position has various names:
   - PostgreSQL: log sequence number
   - MySQL: binlog coordinates

4. **Apply the backlog of changes**: The follower requests all data changes that happened since the snapshot. This may take some time depending on how far behind the follower is.

5. **Caught up**: Once the follower has processed the backlog of changes since the snapshot, it's now "caught up" and can continue to process changes from the leader as they happen.

**Example Timeline:**
```
Time: T0 → T1 → T2 → T3 → T4
Leader: [Snapshot] → W1 → W2 → W3 → W4
Follower:    [Get Snapshot at T0]
             [Apply W1, W2, W3, W4]
             [Now caught up at T4]
```

The practical steps vary significantly by database, but the principle remains the same across all systems.

---

## Handling Node Failures

In a distributed system with replication, node failures are inevitable. The goal is to keep the system running despite individual node failures and minimize the impact.

### Follower Failure: Catch-Up Recovery

**Scenario**: A follower node crashes or its network connection is interrupted.

**Solution**: Follower recovery is straightforward:

1. Each follower keeps a **local log** of the data changes it has received from the leader
2. The log records which changes have been processed
3. When the follower crashes and restarts (or network reconnects), it can recover easily:
   - Check its local log to find the last transaction it successfully processed
   - Connect to the leader and request all changes that occurred since that point
   - Apply those changes to catch up
4. Once caught up, continue processing new changes from the leader normally

This is relatively simple because the follower doesn't make any decisions—it just follows the leader's instructions.

### Leader Failure: Failover (More Complex)

**Scenario**: The leader node crashes. This is more problematic because all writes go through the leader.

**Solution**: A process called **failover** is required:

1. **Determine that the leader has failed**
   - Most systems use a timeout: if the leader doesn't respond within a certain period (e.g., 30 seconds), it's assumed to be dead
   - There's no foolproof way to detect failure—maybe the leader is just slow, or there's a network partition

2. **Choose a new leader**
   - This could be done through an election process (where remaining replicas vote for a new leader)
   - Or a previously elected **controller node** can appoint a new leader
   - The best candidate is usually the replica with the most up-to-date data from the old leader (to minimize data loss)

3. **Reconfigure the system to use the new leader**
   - Clients need to send write requests to the new leader
   - If the old leader comes back online, it needs to become a follower and recognize the new leader
   - The system must prevent the old leader from thinking it's still the leader

**Failover can be automatic or manual:**
- **Automatic failover**: The system detects failure and promotes a new leader without human intervention
- **Manual failover**: An administrator is notified and manually promotes a new leader

### Problems with Failover

Failover is fraught with potential issues:

#### 1. Data Loss with Asynchronous Replication

If asynchronous replication is used, the new leader may not have received all writes from the old leader before it failed.

**Example scenario:**
```
Time:     T0 → T1 → T2 → T3 (Leader crashes)
Leader:   W1 → W2 → W3 → X
Follower: W1 → W2 → ?    (W3 never received)
```

When the follower is promoted to leader, write W3 is lost. What should happen to W3?

**Common solutions:**
- **Discard writes**: The unreplicated writes are simply lost. This is dangerous if other systems coordinated with the database based on those writes (e.g., caches were invalidated, messages were sent to users).
- **Conflict resolution**: Some systems try to merge the old leader's remaining writes with the new leader's writes when the old leader recovers. This is complex and error-prone.

#### 2. Split Brain Problem

In certain fault scenarios, two nodes may both believe they are the leader. This is called **split brain**.

**How it happens:**
- Network partition: The leader becomes unreachable, but it's still running
- A new leader is elected
- Now you have two leaders accepting writes
- When the partition heals, you have conflicting writes and data corruption

**Example:**
```
Client A → [Old Leader] → Writes X=1
Client B → [New Leader] → Writes X=2

Result: Inconsistent data! Which value is correct?
```

**Solutions:**
- **Shutdown mechanism**: If two leaders are detected, automatically shut down one of them (called "fencing" or "STONITH" - "Shoot The Other Node In The Head")
- **Monitoring**: Carefully monitor and detect split-brain scenarios quickly

#### 3. Timeout Configuration Trade-offs

Choosing the right timeout for detecting leader failure is difficult:

**Too long of a timeout:**
- Longer recovery time
- Users experience more downtime
- But fewer false positives

**Too short of a timeout:**
- Faster recovery if leader actually fails
- But more false positives: if the leader is just temporarily slow (high load, garbage collection pause), you might trigger an unnecessary failover
- Unnecessary failovers make the situation worse: now you have two nodes competing, system is unstable, clients are confused about where to send requests

**Best practice**: Timeout should be tuned based on your specific system's behavior and requirements.

### Key Takeaway

There are no easy solutions to these problems. Failover is complex, and every solution involves trade-offs. Many operations teams prefer manual failover for critical systems to avoid the risks of automatic failover going wrong.

---

## Implementation of Replication Logs

When the leader processes a write, it must send the change to followers. But what exactly does the leader send? There are several approaches, each with trade-offs.

### 1. Statement-Based Replication

**How it works**: The leader logs every write request (SQL statement) it executes and sends that statement to followers.

**Example**: 
```sql
INSERT INTO products (id, name, price) VALUES (1, 'Widget', 9.99);
UPDATE products SET price = 10.99 WHERE id = 1;
DELETE FROM products WHERE id = 1;
```

The leader would send these exact SQL statements to each follower, and each follower would execute them.

**Advantages:**
- Conceptually simple
- Compact: statements are usually smaller than the actual data being modified
- Human-readable for debugging

**Problems**: This approach has fallen out of favor due to several edge cases:

1. **Non-deterministic functions**: 
   - `NOW()` returns the current timestamp
   - `RAND()` returns a random number
   - If followers execute these statements at different times, they'll get different values
   - Example: `INSERT INTO logs (timestamp, message) VALUES (NOW(), 'Event occurred');`
     - Leader executes at 14:32:15.123
     - Follower executes at 14:32:15.456
     - Result: Different timestamps in leader and follower!

2. **Auto-incrementing columns**:
   - `INSERT INTO users (name) VALUES ('Alice');` with an auto-increment ID column
   - The ID assigned depends on existing data in the table
   - If statements are executed in a different order on a replica, IDs will be different

3. **Statements depending on existing data**:
   - `UPDATE users SET rank = rank + 1 WHERE points > 1000;`
   - The result depends on which users currently have points > 1000
   - If replicas have diverged even slightly, this statement will produce different results

4. **Side effects**:
   - Triggers, stored procedures, user-defined functions may have side effects
   - These side effects might not be deterministic or might interact with external systems

**Workarounds exist**: You can replace non-deterministic functions with fixed values before sending to followers (e.g., replace `NOW()` with the actual timestamp), but this adds complexity.

**Who uses it**: MySQL used statement-based replication before version 5.1. It's still available but not recommended.

### 2. Write-Ahead Log (WAL) Shipping

**How it works**: The leader sends its **write-ahead log** (WAL) to followers. 

**Background**: Many databases use a write-ahead log for their own crash recovery. The WAL is an append-only sequence of bytes containing all writes to the database. Before any changes are made to the database, they're first written to the WAL. If the database crashes, it can recover by replaying the WAL.

**For replication**: The leader can simply ship this same WAL to followers. Followers process the log and build a copy of the exact same data structures as the leader.

**Example**: In PostgreSQL:
```
WAL Entry: "Write page 1234, offset 56, bytes: 0x4F2E..."
          "Update index on page 5678..."
```

**Advantages:**
- No additional work required: the WAL already exists for crash recovery
- Exact replication: followers end up with identical data structures
- Handles all the problematic cases from statement-based replication

**Major disadvantage**: 
- **Tightly coupled to storage engine**: The WAL describes data changes at a very low level (which bytes changed on which disk blocks)
- **Version compatibility issues**: If the database software version changes and modifies the storage format, the WAL format changes too
  - Example: Leader runs PostgreSQL 12, Follower runs PostgreSQL 13
  - PostgreSQL 13 might store data differently on disk
  - The WAL from version 12 won't work correctly on version 13
- **Zero-downtime upgrades become impossible**: You can't run different database versions on leader and followers, so you can't gradually upgrade followers one at a time
- **Operational pain**: You must shut down the entire system to upgrade, causing downtime

**Who uses it**: PostgreSQL and Oracle use WAL shipping.

### 3. Logical (Row-Based) Log Replication

**How it works**: Use a separate log format for replication that's decoupled from the storage engine internals. This is called a **logical log** (as opposed to the physical log of the WAL).

**Structure**: A logical log for a relational database is usually a sequence of records describing writes at the granularity of a row:

**For an inserted row:**
```
LOG: INSERT table=users, new_values={id: 123, name: 'Alice', email: 'alice@example.com'}
```

**For a deleted row:**
```
LOG: DELETE table=users, primary_key={id: 123}
```
(Or if no primary key, log all old column values)

**For an updated row:**
```
LOG: UPDATE table=users, primary_key={id: 123}, new_values={email: 'alice@newdomain.com'}
```

**For a transaction affecting multiple rows:**
```
BEGIN TRANSACTION
INSERT table=orders, values={...}
INSERT table=order_items, values={...}
INSERT table=order_items, values={...}
COMMIT TRANSACTION
```

**Advantages:**
- **Decoupled from storage engine**: The logical log format can remain stable even if the storage engine internals change
- **Backward compatible**: Different database versions can use the same logical log format
- **Zero-downtime upgrades**: You can upgrade followers to a new version while the leader stays on the old version, then switch over
- **External systems can parse it**: The logical log is easier for external systems to understand (for change data capture, data warehouses, custom caching systems, etc.)

**Who uses it**: MySQL's binlog uses row-based replication when configured to use the `ROW` format. PostgreSQL's logical decoding feature provides this as well.

### 4. Trigger-Based Replication

**How it works**: Move replication logic up to the application layer. Use database triggers to notify the application when data changes.

**Database triggers**: A trigger is a piece of code that automatically executes when a certain event happens (INSERT, UPDATE, DELETE) on a table.

**Example**: In PostgreSQL:
```sql
CREATE TRIGGER users_replication_trigger
AFTER INSERT OR UPDATE OR DELETE ON users
FOR EACH ROW
EXECUTE FUNCTION replicate_to_followers();
```

**Two approaches:**

1. **Trigger reads the WAL**: 
   - Trigger fires when a write occurs
   - Application reads the database's replication log
   - Application adapts/filters it and sends to followers

2. **Trigger writes to separate table**:
   - Trigger fires and writes the change to a separate "changelog" table
   - Application (or external process) reads from the changelog table
   - Application sends the change to followers

**Advantages:**
- **Flexibility**: You can add custom logic. For example:
  - Replicate only a subset of data (only certain tables or columns)
  - Transform data before replicating (e.g., encrypt sensitive fields)
  - Replicate to different types of systems (not just the same database)
- **No database internals knowledge needed**: You're working at the application level

**Disadvantages:**
- **Greater overhead**: Triggers add overhead to every write operation
- **More prone to bugs**: You're introducing custom application code into the critical write path
- **Limited by trigger capabilities**: Database trigger systems have their own limitations and quirks

**Use cases**: 
- When you need features not provided by built-in replication (e.g., selective replication, data transformation)
- When replicating from one database system to a completely different one
- Change Data Capture (CDC) systems often use this approach

**Who uses it**: Oracle GoldenGate, Databus for Oracle, Bucardo for Postgres.

---

## Problems with Replication Lag

Leader-based replication with asynchronous followers is widely used because it offers good performance and availability. However, it introduces a significant problem: **replication lag**.

**Replication lag** is the delay between:
- A write being processed on the leader, and
- That write being reflected on the followers

With asynchronous replication, followers may lag behind the leader by seconds, minutes, or even longer if there are network issues or the followers are overloaded.

### Why Replication Lag Happens

Several factors contribute to lag:
- **Network latency**: Physical distance between data centers
- **Follower processing speed**: A slow follower can't keep up with the leader's write rate
- **High write load**: If the leader is processing writes faster than followers can apply them
- **Resource contention**: Followers also serve read queries, which compete with applying replication updates

In normal operation, lag might be a fraction of a second. But during problems (network issues, high load, follower maintenance), lag can grow to minutes or hours.

### Eventual Consistency

Systems with replication lag provide **eventual consistency**: if you stop writing to the database and wait a while, eventually all replicas will converge to the same state.

But "eventually" is vague—it might be milliseconds or minutes. During this lag period, different replicas may return different results to queries.

Let's explore the specific problems this causes and their solutions.

---

## Problem 1: Reading Your Own Writes (Read-After-Write Inconsistency)

### The Problem

Imagine a user submits data to your application:

1. User posts a comment: "Great article!" → Write goes to the leader
2. Leader acknowledges: "Comment posted successfully"
3. User refreshes the page immediately → Read request goes to a follower
4. Follower hasn't received the update yet
5. User sees: No comment! Their comment appears to be lost

```
Timeline:
T0: User writes comment → Leader
T1: Leader responds OK → User
T2: Leader sends to followers (but not arrived yet)
T3: User reads page → Follower (stale data)
T4: Comment appears missing! Frustrating experience!
```

**This is called "read-after-write inconsistency"** or the lack of **read-your-writes consistency**.

### Real-World Impact

The severity depends on the use case:

**Low severity:**
- Viewing the number of likes on a post: If you like a post and it doesn't show your like immediately, it's mildly annoying but not terrible

**High severity:**
- Social media comment: You post a comment and it disappears—you might think it failed and post again (creating duplicates)
- E-commerce: You update your shipping address, but the order confirmation shows the old address—very confusing
- Profile updates: You change your profile photo and it doesn't appear—you might upload it multiple times

### Solutions

#### Solution 1: Read from Leader for User-Modified Data

**Strategy**: When reading something that the user may have modified, read it from the leader. Otherwise, read from a follower.

**Example implementations:**

**For user profiles:**
```
if (viewing_own_profile) {
    read_from_leader();
} else {
    read_from_follower();
}
```

**For social media:**
```
if (viewing_own_posts || viewing_own_comments) {
    read_from_leader();
} else {
    read_from_follower();
}
```

**Advantages:**
- Simple to implement for cases where you can clearly identify "this user's data"
- Guarantees that users always see their own updates

**Disadvantages:**
- Reduces the benefit of read scaling if many users are viewing their own data
- Need a clear notion of "ownership"—doesn't work well for collaborative data where many users can edit

#### Solution 2: Time-Based Read Routing

**Strategy**: Track the timestamp of the user's last write. For a short period after a write (e.g., 1 minute), route that user's reads to the leader. After the grace period, route to followers.

```
last_write_time = user.get_last_write_timestamp();
current_time = now();

if (current_time - last_write_time < 60 seconds) {
    read_from_leader();
} else {
    read_from_follower();
}
```

**Advantages:**
- Works for any data the user modifies, not just data they "own"
- Automatically transitions back to reading from followers after lag subsides

**Disadvantages:**
- Needs to track timestamps per user
- Still sends some reads to the leader, reducing scalability
- The time window is a guess—replication lag might exceed it

#### Solution 3: Monitor Replication Lag

**Strategy**: Don't read from a follower that's more than X seconds behind the leader.

```
for each follower {
    lag = leader.current_position - follower.position;
    if (lag < MAX_ACCEPTABLE_LAG) {
        eligible_followers.add(follower);
    }
}

read_from(random(eligible_followers));
```

If all followers exceed the lag threshold, either:
- Wait until a follower catches up, or
- Read from the leader

**Advantages:**
- Can distribute reads across multiple followers as long as they're sufficiently up-to-date
- More flexible than time-based routing

**Disadvantages:**
- Requires monitoring infrastructure to track replication lag
- Might need to queue read requests if all followers are lagging

#### Solution 4: Logical Timestamps

**Strategy**: The client remembers the timestamp or log position of its most recent write. When making a read, the client provides this timestamp. The system ensures the read reflects all writes up to that timestamp.

```
write_response = leader.write(data);
client.last_write_position = write_response.log_position;

// Later, when reading:
read_response = any_replica.read(query, min_position=client.last_write_position);
```

The replica either:
- Serves the read if it has processed up to that position
- Waits until it catches up to that position
- Forwards the request to another replica that's further along

**Advantages:**
- Precise: guarantees the read reflects the write
- Works across multiple data centers

**Disadvantages:**
- More complex to implement
- Requires replicas to track and expose their replication position

### Cross-Device Consistency

The problem becomes harder when users access your application from multiple devices:

**Scenario:**
```
Device 1 (Laptop): User posts a comment → Leader
Device 2 (Phone):  User checks page 5 seconds later → Follower (stale)
Result: User doesn't see their comment on their phone
```

**Additional challenges:**

1. **Timestamp tracking**:
   - Solution 2 (time-based routing) requires tracking the last write timestamp
   - But Device 2 doesn't know about writes made on Device 1
   - Need a centralized metadata store to track user activity across all devices

2. **Replica affinity**:
   - For better performance, you might route devices to nearby data centers
   - Device 1 in New York → East Coast data center
   - Device 2 in New York → Also East Coast data center (different replica)
   - If Device 2 happens to hit a follower that's behind Device 1's replica, inconsistency occurs

**Solution**: Centralized tracking:
```
# Metadata store (e.g., Redis)
user_123_last_write = {
    timestamp: 2024-03-15 14:32:15,
    log_position: 8472939,
    from_device: 'device_1'
}

# Device 2 checks this before reading
```

---

## Problem 2: Monotonic Reads (Going Back in Time)

### The Problem

Imagine a user making two read requests in succession, hitting different followers with different lag:

**Timeline:**
```
T0: User posts a comment → Leader
T1: Read request 1 → Follower 1 (caught up) → User sees their comment ✓
T2: Read request 2 → Follower 2 (lagging) → Comment disappears! ✗
```

From the user's perspective: "I saw my comment, refreshed, and now it's gone!"

```
User's experience:
Page load 1: Comment appears
Page load 2: Comment disappears  
Page load 3: Comment appears again
```

This is called a **non-monotonic read** or a **moving backwards in time** anomaly. It occurs when a user reads from different replicas with different lag.

### Real-World Example

**Social media feed:**
```
Request 1 → Follower A (3 second lag): Shows 15 posts
Request 2 → Follower B (10 second lag): Shows only 12 posts (missing recent posts)
Request 3 → Follower A (now 2 second lag): Shows 16 posts

Result: User's feed jumps around, posts appear and disappear
```

**Online gaming leaderboard:**
```
Request 1 → Replica 1: Your rank is #47
Request 2 → Replica 2: Your rank is #51 (older data)

Result: Player sees their rank getting worse even though nothing changed
```

### Why It's Confusing

Going backwards in time is deeply confusing because:
- It violates causality—users expect time to move forward
- It undermines trust in the system: "Is my data safe? Is the system broken?"
- It's unpredictable: sometimes it happens, sometimes it doesn't

### Solution: Monotonic Reads Guarantee

**Monotonic reads** guarantee: if a user makes several reads in sequence, they will not see time go backwards. After seeing data at a particular state, subsequent reads will not return a state that's older.

**Implementation**: Ensure each user always reads from the same replica.

**Approach 1: Session affinity (sticky sessions)**
```
user_hash = hash(user_id);
replica = replicas[user_hash % num_replicas];
route_to(replica);
```

Each user is consistently routed to the same replica based on a hash of their user ID.

**Example:**
```
User ID: 12345
Hash: 7829142
Replica: 7829142 % 5 = 2
Result: User 12345 always reads from Replica 2
```

**Advantages:**
- Simple to implement (many load balancers support this)
- Guarantees monotonic reads for each user
- Load is still distributed across replicas (different users go to different replicas)

**Disadvantages:**
- If that replica fails, users need to be rerouted to another replica (need a fallback mechanism)
- Less flexible than fully random distribution

**Approach 2: Track read position**

Alternatively, clients can track the replication position of the last read and specify that all subsequent reads must reflect at least that position:

```
last_read_position = client.track_position();
next_read = replica.read(query, min_position=last_read_position);
```

---

# Problem 3: Consistent Prefix Reads (Causality Violations)

## The Problem

Some writes are causally related, and their order matters. If replicas apply writes in different orders, observers might see effects before causes.

**Consistent Prefix Reads** is a guarantee that says: *If a sequence of writes happens in a certain order, then anyone reading those writes will see them appear in the same order.*

This is particularly a problem when dealing with **causality** - when one piece of data depends on or is a response to another piece of data.

---

## A Real-World Example: The Conversation Problem

Imagine a conversation between two people in a messaging system:

**The correct sequence:**
```
Mr. Poons: "How far into the future can you see, Mrs. Cake?"
Mrs. Cake: "About ten seconds, usually, Mr. Poons."
```

This conversation makes sense because the question comes before the answer. The answer is **causally dependent** on the question.

---

## What Actually Happens with Causality Violations

**Timeline of Events:**

```
T0: Mr. Poons writes: "How far into the future can you see, Mrs. Cake?"
    → This write goes to Partition A (or Datacenter A)

T1: Mrs. Cake writes: "About ten seconds, usually, Mr. Poons."
    → This write goes to Partition B (or Datacenter B)
```

**Different observers see different orders:**

**Observer 1 (reads from Partition A first, then Partition B):**
```
Mr. Poons: "How far into the future can you see, Mrs. Cake?"
Mrs. Cake: "About ten seconds, usually, Mr. Poons."
✓ Makes sense! Question before answer.
```

**Observer 2 (reads from Partition B first, then Partition A):**
```
Mrs. Cake: "About ten seconds, usually, Mr. Poons."
Mr. Poons: "How far into the future can you see, Mrs. Cake?"
✗ Nonsense! The answer appears before the question!
```

Observer 2 sees a **causality violation** - the effect (answer) appears before the cause (question).

---

## Why Does This Happen?

### The Root Cause: Different Partitions with No Global Ordering

This problem is particularly common in **partitioned databases** (also called sharded databases):

1. **Different partitions operate independently**
   - Partition A has its own sequence of writes
   - Partition B has its own sequence of writes
   - There's no single, global ordering across all partitions

2. **Writes to different partitions can be reordered**
   - Mr. Poons' message might go to one partition
   - Mrs. Cake's message might go to a different partition
   - Different replicas might receive updates in different orders

3. **No coordination between partitions**
   - Partition A doesn't know what order Partition B is processing writes
   - When reading from multiple partitions, there's no guarantee about the order

### Visual Representation

```
                    CLIENT WRITES
                         |
                         v
        +----------------+------------------+
        |                                   |
        v                                   v
   Partition A                         Partition B
   (Question)                          (Answer)
        |                                   |
        |  Replication lag: 100ms           |  Replication lag: 50ms
        |                                   |
        v                                   v
   Replica A1                          Replica B1
        |                                   |
        |                                   |
        +----------------+------------------+
                         |
                         v
                    OBSERVER READS
                    
If observer reads B1 before A1 finishes replicating,
they see the answer before the question!
```

---

## When Does This Problem Occur?

### 1. Partitioned Databases (Sharding)

**Scenario:**
- Database is split across multiple partitions/shards
- Each partition has its own replication stream
- No global ordering of writes across partitions

**Example:**
- Messages are partitioned by user ID
- Mr. Poons' messages go to Partition 1
- Mrs. Cake's messages go to Partition 2
- A reader querying "all recent messages" reads from both partitions
- Different partitions may have different replication lags

### 2. Multi-Leader Replication

**Scenario:**
- Multiple leaders accept writes independently
- Each leader has its own ordering
- When changes are merged, causality can be violated

**Example:**
- Datacenter 1 accepts Mr. Poons' question
- Datacenter 2 accepts Mrs. Cake's answer
- Datacenter 3 receives updates from both
- Updates might arrive in wrong order

### 3. Leaderless Replication

**Scenario:**
- Multiple replicas accept writes concurrently
- No single authority on ordering
- Different nodes might apply writes in different orders

---

## Why Single-Leader Replication Doesn't Have This Problem

In **single-leader replication**, this problem typically doesn't occur because:

1. **All writes go through one leader**
   - The leader defines a global ordering
   - Every write gets a sequence number

2. **Followers apply writes in the same order**
   - Follower 1 applies writes in order: A, B, C
   - Follower 2 applies writes in order: A, B, C
   - All followers converge to the same state in the same order

3. **Causality is preserved automatically**
   - If write B depends on write A, and both go through the leader
   - The leader ensures A is replicated before B

**However**, even with single-leader replication, causality violations can still occur if:
- You read from followers with different amounts of lag
- You use multiple leaders for different data (partitioning)

---

## More Examples of Causality Violations

### Example 1: Social Media Thread

**Correct order:**
```
Alice: "I just got engaged! 💍"
Bob: "Congratulations Alice!"
Charlie: "When's the wedding?"
```

**Causality violation (if Bob's and Alice's posts are in different partitions):**
```
Bob: "Congratulations Alice!"     ← What is Bob congratulating?
Charlie: "When's the wedding?"     ← What wedding?
Alice: "I just got engaged! 💍"    ← Oh, now it makes sense
```

### Example 2: Banking Transactions

**Correct order:**
```
T1: Deposit $1000 into Account A
T2: Transfer $500 from Account A to Account B
```

**Causality violation:**
```
T2: Transfer $500 from Account A to Account B  ← Fails! Insufficient funds
T1: Deposit $1000 into Account A               ← Too late
```

The transfer fails because it's processed before the deposit, even though the deposit happened first in real time.

### Example 3: Question-Answer System

**Correct order:**
```
Question ID: 42, "What is the capital of France?"
Answer ID: 100, "The capital of France (Question 42) is Paris"
```

**Causality violation:**
```
Answer ID: 100, "The capital of France (Question 42) is Paris"
Question ID: 42, "What is the capital of France?"
```

The answer references Question 42, but observers see the answer before the question exists!

---

## Solutions to Consistent Prefix Reads

### Solution 1: Ensure Causally-Related Writes Go to the Same Partition

**How it works:**
- Hash on a value that groups related data together
- All messages in a conversation go to the same partition
- All data for a user goes to the same partition

**Example:**
- Use `conversation_id` as the partition key
- Mr. Poons' message and Mrs. Cake's message both go to the same partition
- That partition maintains ordering
- All observers reading from that partition see the correct order

**Implementation:**
```
Partition key = hash(conversation_id)

Both messages:
  "How far into the future..." → conversation_id: "conv_123" → Partition 2
  "About ten seconds..."       → conversation_id: "conv_123" → Partition 2
```

**Pros:**
- Simple and effective
- No special conflict resolution needed
- Maintains causality automatically

**Cons:**
- Limits parallelism (all related writes go to one partition)
- Hot partitions if one conversation is very active
- Doesn't help with cross-partition causality

### Solution 2: Use Explicit Causality Tracking

**How it works:**
- Track dependencies between writes explicitly
- Each write includes information about which previous writes it depends on
- System ensures dependent writes are applied in order

**Techniques:**
- **Version vectors**: Track which writes each node has seen
- **Lamport timestamps**: Assign totally-ordered timestamps that respect causality
- **Happens-before relationships**: Explicitly record dependencies

**Example with version vectors:**
```
Mr. Poons writes: "How far into the future can you see?"
  Version: {Poons: 1, Cake: 0}

Mrs. Cake reads Poons' message, then writes: "About ten seconds..."
  Version: {Poons: 1, Cake: 1}  ← Includes Poons:1, showing it depends on it
  
When replicating, system ensures Poons:1 is applied before Cake:1
```

**Pros:**
- Works across partitions
- Maintains causality even with complex dependencies
- Allows maximum parallelism

**Cons:**
- More complex to implement
- Overhead of tracking and transmitting version information
- Requires conflict resolution for concurrent writes

### Solution 3: Use Timestamps or Logical Clocks

**How it works:**
- Assign timestamps that respect causal order
- Not physical time, but logical time that captures causality

**Lamport Timestamps:**
- Each node maintains a counter
- When sending a message, include the counter
- When receiving, set counter to max(local_counter, received_counter) + 1
- This creates a total ordering that respects causality

**Example:**
```
T=1: Mr. Poons writes question (timestamp: 1)
T=2: Mrs. Cake sees question, writes answer (timestamp: 2)

Even if answer arrives at replica first, timestamp shows it must come after T=1
```

**Pros:**
- Lightweight (just a number with each message)
- Works across partitions
- Easy to implement

**Cons:**
- Doesn't tell you about concurrency (can't distinguish concurrent vs sequential)
- May delay operations while waiting for causally-earlier operations

### Solution 4: Application-Level Handling

**How it works:**
- Application tracks causality explicitly
- Store metadata like "this is a reply to message X"
- Application reorders or waits for dependencies

**Example:**
```
Message 1: { id: "msg_1", text: "Question...", reply_to: null }
Message 2: { id: "msg_2", text: "Answer...", reply_to: "msg_1" }

When displaying:
  - Check if msg_1 exists
  - If not, wait or fetch it
  - Display in correct order
```

**Pros:**
- Full control over causality semantics
- Can implement complex business logic
- No database-level changes needed

**Cons:**
- More complex application code
- Application must handle missing dependencies
- Performance overhead from checking dependencies

### Solution 5: Single-Leader for Causally-Related Data

**How it works:**
- Use single-leader replication for data with causal dependencies
- All causally-related writes go through the same leader
- Leader enforces ordering

**Example:**
- One leader per conversation
- All messages in that conversation go through that leader

**Pros:**
- Simple and reliable
- Automatic causality preservation
- No special conflict resolution

**Cons:**
- Single point of bottleneck for that data
- Less available (if leader fails, writes block)
- Doesn't scale for high write throughput

---

## Comparison of Solutions

| Solution | Pros | Cons | Best For |
|----------|------|------|----------|
| Same Partition | Simple, automatic | Limited parallelism, hot partitions | Data naturally grouped (conversations, user data) |
| Version Vectors | Works across partitions, precise | Complex, overhead | Distributed systems needing strong causality |
| Lamport Timestamps | Lightweight, total ordering | Can't detect concurrency | Simple ordering needs |
| Application-Level | Flexible, no DB changes | Complex app code | Custom business logic |
| Single Leader | Simple, reliable | Bottleneck, less available | Strong consistency needs |

---

## Key Takeaways

1. **Consistent prefix reads mean observers see writes in a causally-consistent order**
   - If A causes B, everyone sees A before B
   - The "prefix" means you see a consistent snapshot up to a certain point

2. **This is mainly a problem with partitioned databases**
   - Different partitions have independent orderings
   - No global coordination across partitions

3. **Single-leader replication usually preserves causality automatically**
   - Leader defines a global order
   - All followers see the same order

4. **Solutions involve either grouping related data or tracking causality explicitly**
   - Grouping: Put causally-related data in the same partition
   - Tracking: Use version vectors, timestamps, or application logic

5. **Trade-off between consistency and performance**
   - Stronger causality guarantees → more coordination → less performance
   - Weaker guarantees → better performance → application must handle anomalies

6. **This problem is subtle and often overlooked**
   - Many systems don't provide consistent prefix reads by default
   - Applications must be designed to handle causality violations
   - Or choose a system that provides stronger guarantees

---

## Real-World Impact

**When it matters most:**
- Social media feeds and messaging (conversations must make sense)
- Collaborative editing (edits must be applied in logical order)
- Event sourcing (events must be processed in causal order)
- Distributed transactions (operations must respect dependencies)

**When it might be acceptable:**
- Analytics and reporting (eventual consistency is fine)
- Caching layers (stale data is tolerable)
- Metrics and monitoring (approximate ordering is okay)

The key is understanding your application's require
----
----
----
----
----
----
----
----
----


# Chapter 5: Replication (Continued)

## Multi-Leader Replication

### What Is Multi-Leader Replication?

In single-leader replication, all writes must go through one leader. **Multi-leader replication** (also called master-master or active-active replication) extends this by allowing **multiple nodes to accept writes**.

Each leader simultaneously acts as a follower to the other leaders. Write changes are replicated from each leader to all the others.

### Use Cases for Multi-Leader Replication

#### 1. Multi-Datacenter Operation

This is the most common use case for multi-leader replication.

**Single-Leader Setup Across Datacenters:**
- One leader in one datacenter
- Followers in other datacenters
- All writes must go through the one datacenter with the leader
- Cross-datacenter network delays affect write performance

**Multi-Leader Setup Across Datacenters:**
- One leader in EACH datacenter
- Each datacenter's leader replicates its changes to leaders in other datacenters
- Within each datacenter, single-leader replication is used

**Advantages:**
- **Performance**: Writes can be processed in the local datacenter without going over the internet to another datacenter. This appears fast to users.
- **Tolerance of datacenter outages**: If one datacenter fails, other datacenters can continue operating independently
- **Tolerance of network problems**: Inter-datacenter connections are more resilient to temporary network interruptions

**Disadvantages:**
- **Write conflicts**: The same data may be modified concurrently in different datacenters, creating conflicts
- **Complexity**: Auto-incrementing keys, triggers, and integrity constraints can be problematic
- **Risk of subtle bugs**: Multi-leader replication is often considered dangerous territory with surprising edge cases

#### 2. Clients with Offline Operation

Another use case is applications that need to work while disconnected from the internet.

**Example: Calendar Apps**
- You have a calendar on your phone, laptop, and tablet
- You need to be able to make changes on any device, even without internet
- Each device acts as a "leader" with its local database
- When devices come online, changes are synced (replicated) between them

This is essentially a multi-leader replication problem where:
- The replication lag can be days or weeks (while offline)
- Each device is a "datacenter"
- Network connection is extremely unreliable

**Technologies**: CouchDB is designed for this mode of operation.

#### 3. Collaborative Editing

Real-time collaborative editing applications (like Google Docs) are similar to multi-leader replication.

**How It Works:**
- When one user edits a document, changes are instantly applied to their local copy
- Changes are asynchronously replicated to the server and other users
- To avoid conflicts, the application may lock the document or use fine-grained locks (lock per character or word)

**The Challenge:**
- For true real-time collaboration, you want to make units of change very small (a single keystroke)
- This requires very fast conflict resolution
- Changes must be applied in the right order across all users

---

### Handling Write Conflicts in Multi-Leader Replication

The biggest problem with multi-leader replication is that **write conflicts** can occur. This happens when two leaders accept writes that conflict with each other.

#### Example of a Write Conflict

Imagine a wiki page with a title that is currently "Introduction":
- **User 1** (connected to Datacenter A) changes the title to "Getting Started"
- **User 2** (connected to Datacenter B) changes the title to "Overview"
- Both changes are accepted by their local leaders
- When the changes are replicated, there's a conflict: which title should win?

```
Time →
Datacenter A (Leader 1):  Introduction → Getting Started
Datacenter B (Leader 2):  Introduction → Overview
                                ↓
                          CONFLICT!
```

#### Conflict Detection

**Synchronous vs Asynchronous Detection:**
- In single-leader databases, the second write waits for the first to complete or aborts the transaction - conflicts are detected synchronously
- In multi-leader systems, both writes succeed initially and conflicts are only detected later (asynchronously)
- By the time the conflict is detected, it may be too late to ask the user what to do

#### Conflict Avoidance (The Best Strategy)

The simplest strategy is to **avoid conflicts** in the first place.

**How:**
- Ensure that all writes for a particular record go through the same leader
- For example, in a social media application, all writes about a user's profile go through their "home" datacenter
- If a user moves location or their datacenter fails, you may need to reroute traffic (this can cause conflicts during the transition)

**Example:**
- User Alice's data always goes through the US datacenter
- User Bob's data always goes through the EU datacenter
- No conflicts because different users' data never conflicts

#### Converging Toward a Consistent State

In single-leader databases, writes are applied in sequential order - the last write determines the final value.

In multi-leader configuration, there is no defined ordering of writes. If conflicts aren't resolved, different replicas might permanently diverge.

**The database must ensure eventual convergence:** All replicas must eventually arrive at the same final value when all changes have been replicated.

**Ways to Achieve Convergent Conflict Resolution:**

1. **Last Write Wins (LWW)**
   - Give each write a unique ID (timestamp, UUID, hash, etc.)
   - Pick the write with the highest ID as the winner
   - Discard other writes
   - **Problem**: Data loss! One user's changes are silently thrown away
   - Popular but dangerous - prone to losing data

2. **Assign Each Replica a Unique ID**
   - Writes from higher-numbered replicas always take precedence
   - **Problem**: Also implies data loss and is arbitrary

3. **Merge Values Together**
   - For example, order them alphabetically and concatenate: "Getting Started / Overview"
   - Or preserve both versions in some format
   - **Example**: In the title conflict, store both titles and let the user choose later

4. **Record the Conflict and Preserve All Information**
   - Store all conflicting versions
   - Write application code to resolve the conflict later (perhaps by prompting the user)

#### Custom Conflict Resolution Logic

Most multi-leader replication tools let you write application code to resolve conflicts.

**On Write:**
- As soon as the database detects a conflict, it calls your conflict handler
- Handler typically runs in a background process
- Cannot prompt the user (runs automatically)

**On Read:**
- All conflicting versions are stored
- Next time the data is read, all versions are returned to the application
- The application may prompt the user or automatically resolve the conflict
- **Example**: CouchDB works this way

**Automatic Conflict Resolution:**
Some research systems try to resolve conflicts automatically:
- **Conflict-free Replicated Datatypes (CRDTs)**: Data structures that can be automatically merged in a sensible way (e.g., sets, maps, ordered lists)
- **Mergeable Persistent Data Structures**: Track history and use a three-way merge function (like Git)
- **Operational Transformation**: Algorithm used by Google Docs for concurrent editing

---

### Multi-Leader Replication Topologies

A **replication topology** describes the communication paths along which writes are propagated from one node to another.

#### Common Topologies

1. **Circular Topology**
   - Each node receives writes from one node and forwards them to another node
   - Forms a circle: A → B → C → A
   - Writes are forwarded until they come full circle
   - Each node is tagged with identifiers of all nodes it has passed through (to prevent infinite loops)

2. **Star Topology**
   - One designated root node forwards writes to all other nodes
   - Similar to a tree structure
   - Other nodes send their writes to the root

3. **All-to-All Topology** (Most Common)
   - Every leader sends its writes to every other leader
   - Most general and most commonly used

```
Circular:         Star:           All-to-All:
  A → B             A               A ←→ B
  ↑   ↓           ↙   ↘             ↕   ↕
  C ←               B   C             C

```

#### Problems with Topologies

**Single Point of Failure (Circular and Star):**
- If one node fails in a circular topology, the chain is broken
- If the root fails in a star topology, replication stops
- Need to reconfigure the topology to work around the failed node

**Causality Problems (All-to-All):**
- Some network links may be faster than others
- Some replication messages may "overtake" others
- This can lead to causality violations

**Example of Causality Violation:**
- Client A inserts a row into a table (datacenter 1)
- Client B updates that row (datacenter 2)
- Datacenter 3 might receive the update BEFORE the insert
- The update fails because the row doesn't exist yet!

**Solution:**
- Use **version vectors** (discussed later) to track causality and ensure correct ordering

---

## Leaderless Replication

In some systems, there is no concept of a leader at all. Any replica can directly accept writes from clients.

### The Rise of Leaderless Replication

Leaderless replication was used in early databases but fell out of favor. It was revived by **Amazon's Dynamo** system (used internally for shopping cart) and became popular again.

**Examples of Leaderless Databases:**
- **Riak**
- **Cassandra**
- **Voldemort**

These are often called **Dynamo-style** databases (not to be confused with Amazon DynamoDB, which uses single-leader replication).

### How Leaderless Replication Works

#### Writing to the Database

When a client wants to write to the database:
1. Client sends the write to **multiple replicas** (e.g., all of them, or a subset)
2. Client doesn't wait for all replicas to respond
3. As long as a certain number (a quorum) acknowledge the write, it's considered successful

**No Failover:**
- If a replica is down or slow, the write continues without it
- When the failed node comes back online, it has stale data
- The system must have mechanisms to catch up the node

#### Reading from the Database

When reading, the client also reads from **multiple replicas in parallel**:
1. Client sends read requests to several replicas
2. Different replicas may return different versions (some may be stale)
3. Client uses version numbers to determine which value is newest

#### Read Repair

When a client reads from multiple replicas and detects stale data:
- The client writes the newer value back to the replicas with stale data
- This brings the stale replicas up to date
- Works well for frequently read values

#### Anti-Entropy Process

Some datastores have a **background process** that constantly looks for differences between replicas and copies missing data.

**Differences from Read Repair:**
- Doesn't wait for a read - runs continuously in the background
- May have significant delays before data is copied (unlike read repair which is immediate)
- Not all systems implement anti-entropy

Without anti-entropy, values that are rarely read may be missing from some replicas for a long time.

---

### Quorums for Reading and Writing

If there are `n` replicas:
- Every write must be confirmed by `w` nodes (write quorum)
- Every read must query `r` nodes (read quorum)
- As long as `w + r > n`, we expect to get an up-to-date value when reading

**Why This Works:**
- If `w + r > n`, at least one of the `r` nodes you read from must have the latest value
- The set of nodes you read from must overlap with the set of nodes that confirmed the write

**Common Configuration:**
- `n = 3` (three replicas)
- `w = 2` (need 2 confirmations to write)
- `r = 2` (read from 2 nodes)

This means:
- A write can succeed even if 1 node is down
- A read can succeed even if 1 node is down
- At least one of the 2 nodes you read from will have the latest value

```
Example: n=3, w=2, r=2

Write to A, B, C:
  A ✓ (confirms)
  B ✓ (confirms)  
  C ✗ (down)
Write succeeds! (2 out of 3 confirmed, w=2 satisfied)

Read from A, B, C:
  A: returns version 5 ✓
  B: returns version 5 ✓
  C: (we don't read from it)
Read succeeds! At least one node (actually two) has latest version
```

#### Trade-offs in Quorum Configuration

**Higher `w` and `r`:**
- More likely to read up-to-date values
- More latency (wait for more nodes)
- Lower availability (more nodes must be working)

**Lower `w` and `r`:**
- Faster reads and writes
- Higher availability
- More risk of reading stale values

**Common Choices:**
- `n = 3`, `w = 2`, `r = 2` - good balance
- `n = 5`, `w = 3`, `r = 3` - can tolerate 2 node failures
- `w = n`, `r = 1` - Fast reads, but writes fail if any node is down
- `w = 1`, `r = n` - Fast writes, but reads are slow and fail if any node is down

**As long as `w + r > n`, you can tolerate:**
- `n - w` failed nodes during writes
- `n - r` failed nodes during reads

---

### Limitations of Quorum Consistency

Even with `w + r > n`, there are edge cases where you might read stale data:

1. **Sloppy Quorum**
   - If `w` writes go to different nodes than the `r` reads, there may be no overlap
   - Discussed more in the next section

2. **Concurrent Writes**
   - If two writes happen concurrently, it's not clear which one happened first
   - Need conflict resolution (e.g., last write wins)
   - Some writes may be lost

3. **Write and Read Happen Concurrently**
   - Unclear whether the read will see the new or old value

4. **Write Succeeds on Some Replicas but Fails on Others**
   - Overall write fails (didn't reach `w` confirmations)
   - But some replicas have the new value
   - Subsequent reads might see the new value (inconsistent)
   - Rollback of partially successful writes is difficult

5. **Node with New Value Fails**
   - Its data is restored from a replica with old value
   - Number of replicas with new value falls below `w`

6. **Timing Edge Cases**
   - Various timing issues can cause reads to see old values

**Conclusion:**
- Dynamo-style databases generally provide **eventual consistency**
- Even with quorums, stronger guarantees like "read your writes" or "monotonic reads" are not guaranteed
- Applications must be prepared to handle stale data

---

### Monitoring Staleness

For leader-based replication, it's easy to monitor replication lag:
- Database exposes metrics showing how far behind followers are
- Can alert if lag becomes too large

For leaderless replication, there's no fixed order of writes, so monitoring is harder:
- No simple "replication lag" metric
- Research has shown ways to measure eventual consistency in practice, but not widely adopted

If the system doesn't provide staleness metrics, you have little visibility into whether replicas are truly in sync.

---

### Sloppy Quorums and Hinted Handoff

Databases with leaderless replication are designed to be highly available and tolerate node failures.

**The Problem:**
- If you require `w = 3` confirmations but only 2 nodes are reachable, what do you do?
- Do you fail the write (reducing availability)?
- Or do you accept the write anyway (violating the quorum)?

#### Sloppy Quorum

A **sloppy quorum** is a compromise:
- Accept writes even if `w` or `r` nodes aren't available
- Write to `w` nodes that are reachable, even if they're not among the designated `n` "home" nodes for that data
- This increases write availability
- But you might read stale data because the `r` nodes you read from might not include the nodes that accepted the recent writes

**Example:**
- Normally, data X is stored on nodes A, B, C (n=3)
- Node C is down
- Client writes X with w=2
- Nodes A and D (not normally responsible for X) accept the write
- Later, client reads from A, B with r=2
- Node B has stale data, but reads succeed
- This is a "sloppy" quorum because D is not one of the normal nodes

#### Hinted Handoff

Once the network problems are fixed or a node comes back:
- The temporary nodes (like D) send the data back to the appropriate "home" nodes (C)
- This is called **hinted handoff**
- It's like leaving a note: "I'm holding this data temporarily, it really belongs to you"

**Trade-off:**
- Sloppy quorums are useful for increasing write availability
- But they don't guarantee that `r` reads will see the latest value from `w` writes
- Traditional quorum guarantee (`w + r > n`) does not apply

---

### Multi-Datacenter Operation with Leaderless Replication

Leaderless replication is also suitable for multi-datacenter operation.

**Configuration:**
- `n` includes replicas in all datacenters
- Client can configure how many replicas (`w` and `r`) should be in the local datacenter vs remote datacenters

**Examples:**
- **Cassandra**: You can specify how many replicas should be in each datacenter
- **Riak**: Keeps all communication between clients and database nodes local to one datacenter, and background replication between datacenters is asynchronous

---

### Detecting Concurrent Writes

Dynamo-style databases allow multiple clients to write to the same key concurrently. This means conflicts can occur even without multi-leader replication.

The problem: **If events happen concurrently, there is no clear ordering.**

#### Last Write Wins (Discarding Concurrent Writes)

One approach: declare that each replica stores only the "most recent" value and discards older values.

**How It Works:**
- Attach a timestamp to each write
- Pick the write with the largest timestamp as the winner
- Discard all other concurrent writes

**Problems:**
- **Data loss**: Even if all writes were reported as successful, only one survives
- Writes can be lost even if they were concurrent and there was no clear "before" or "after"
- If losing data is not acceptable, LWW is a poor choice
- LWW is the default in Cassandra and can be the only supported option in some databases

**When LWW Is Acceptable:**
- If immutability is guaranteed (every write has a unique key, like a UUID)
- Keys are written only once and never updated
- Example: Storing sensor readings where each has a unique timestamp

#### The "Happens-Before" Relationship

To determine which write came first, we need to understand causality.

**Definition:**
- Operation A **happens before** operation B if B knows about A, or B depends on A, or B builds upon A
- If neither A happens before B, nor B happens before A, then A and B are **concurrent**

**Key Insight:**
- Concurrency has nothing to do with physical time
- Two operations can be concurrent even if they occur at different wall-clock times
- What matters is whether one operation knows about the other

#### Capturing the Happens-Before Relationship

To determine which operations are concurrent, we need to track the **happens-before** relationship.

**Algorithm (Simplified):**
1. Server maintains a version number for each key
2. When key is written, server increments version and stores new value with new version
3. When client reads key, server returns all current values with their version numbers
4. When client writes key, it must include the version number from prior read
5. Server can tell if a write is concurrent with other writes or supersedes them

**Version Numbers:**
- When writing, client must merge together all values it received in prior reads
- The version number indicates which previous state the write is replacing

**Example Flow:**

```
Client 1                Server                  Client 2
                    [key: empty, v0]

Read key
  ← [empty, v0]

Write "A" (v0)
  → ["A", v1]                               

                    [key: "A", v1]

                                            Read key
                                              ← ["A", v1]

                                            Write "B" (v1)
                                              → ["B", v2]

                    [key: "B", v2]

Read key
  ← ["B", v2]

Write "C" (v0)  ← CONCURRENT! v0 doesn't include v2
  → ["C", v3]

                    [key: {"B", v2}, {"C", v3}]
                    CONFLICT! Both exist

Read key
  ← [{"B", v2}, {"C", v3}]

Merge and write "BC" (v2, v3)
  → ["BC", v4]

                    [key: "BC", v4]
```

In this example:
- Write "C" is concurrent with "B" because it was based on v0, which didn't include "B"
- The server keeps both values and marks them as conflicting
- Next read sees both values
- Client must merge them and write back the merged value

#### Merging Concurrently Written Values

When multiple values exist for the same key, the application needs to merge them.

**Simple Merging Strategies:**
- Take the union of values (for sets)
- Pick one arbitrarily
- Prompt the user to resolve

**Example: Shopping Cart**
- Client 1 adds "milk" to cart
- Client 2 adds "eggs" to cart (concurrently)
- Server keeps both: ["milk"], ["eggs"]
- Client merges: ["milk", "eggs"]

**Problem with Deletion:**
- If client removes an item, you can't just delete it
- Concurrent write might add it back
- Need a **tombstone** to mark deletion

A **tombstone** is a special marker indicating that an item was deleted. When merging, tombstones indicate items to remove from the final set.

---

### Version Vectors

For multiple replicas, a single version number is not enough. Each replica needs its own version number.

A **version vector** is a collection of version numbers from all replicas:
- Each replica tracks a version number for every other replica
- When replicas exchange data, they also exchange version vectors
- Version vectors help detect which values are concurrent and which supersede others

**How It Works:**
- Each replica maintains a version number for itself
- When replica processes a write, it increments its own version number
- Version vector = [version numbers from all replicas]

**Example with 3 Replicas:**
```
Replica A: version vector [A:2, B:1, C:1]
Replica B: version vector [A:1, B:3, C:1]
Replica C: version vector [A:1, B:1, C:2]
```

**Detecting Causality:**
- Version vector X **happens before** version vector Y if all version numbers in X are ≤ corresponding numbers in Y
- If neither X ≤ Y nor Y ≤ X, they are concurrent

**Also Called:**
- Version vectors
- Vector clocks (though technically different)
- Dotted version vectors

**Usage:**
- Riak uses dotted version vectors
- Cassandra uses different technique (doesn't distinguish concurrent writes well)

---

## Summary of Replication

Replication serves important purposes:
- **High availability**: Keep system running despite node failures
- **Disconnected operation**: Allow application to work when network is interrupted  
- **Latency**: Place data geographically close to users
- **Scalability**: Serve more read requests by distributing across replicas

### Three Main Approaches

1. **Single-Leader Replication**
   - Clients send writes to a single leader
   - Leader sends changes to followers
   - Reads can be served by any replica
   - **Pros**: Easy to understand, no write conflicts
   - **Cons**: All writes through one node, possible replication lag

2. **Multi-Leader Replication**
   - Multiple nodes accept writes
   - Changes are replicated between leaders
   - **Pros**: Better performance and availability across datacenters, offline operation
   - **Cons**: Complex conflict resolution, easy to get wrong

3. **Leaderless Replication**
   - Clients send writes and reads to multiple nodes
   - Uses quorums to determine success
   - **Pros**: High availability, tolerates node failures well
   - **Cons**: Concurrent writes require conflict resolution, less guarantee of consistency

### Key Challenges

- **Replication Lag**: Followers may be behind the leader, causing inconsistencies
- **Eventual Consistency**: Replicas eventually converge if you wait long enough
- **Read-after-write**: Ensuring users see their own writes
- **Monotonic reads**: Ensuring time doesn't go backward when reading
- **Consistent prefix reads**: Ensuring causality is preserved

### Consistency Models

Trade-off between **consistency** and **availability**:
- Stronger consistency = better guarantees for application developers, but lower availability and worse performance
- Weaker consistency = better availability and performance, but application must handle inconsistencies

### Conflict Resolution

When same data is modified concurrently:
- **Last write wins**: Simple but loses data
- **Merge values**: Application-specific logic
- **Preserve all versions**: Let application or user resolve later
- **CRDTs**: Data structures designed to merge automatically
