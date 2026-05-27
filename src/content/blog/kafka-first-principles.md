---
title: Kafka Explained Using First Principles
date: December 20, 2025
readTime: 10 min read
category: 'tech'
tags:
  - backends
  - kafka
excerpt: >
  Kafka often feels like a massive, complex system when you first encounter it.
  In reality, Kafka is built on a surprisingly simple idea: **an append-only
  log**.
---

Every CS student studies queues, stacks, logs, and the producer–consumer problem. They feel basic. Almost boring.
Push an element. Pop an element. FIFO. Done.

Then you open a backend job description.

> "Experience with Kafka required."

Suddenly, that "simple queue" is running Netflix, Uber, LinkedIn, and half the internet.

So what *is* Kafka really?

Turns out, Kafka is not magic.
Kafka is **just a log** — designed so well that it became the backbone of modern distributed systems.

---

# Kafka Is Just a Log (And That's Why It Runs the World)

## The Problem That Powers Everything

Early backend systems were simple. A request came in, the service processed it, the database stored the result. One service, one database, one happy developer. Life was good.

Then systems grew. What used to be a single monolith became ten microservices, each with its own database, its own deployment pipeline, and its own opinions about data formats. Suddenly, multiple services needed the same data. Events needed to be processed asynchronously. Systems couldn't afford to block on each other. And data had to move fast, reliably, and in order.

The naive solution? "Let's add a message queue." RabbitMQ, ActiveMQ, pick your poison. That worked… until it didn't.

Traditional message queues were designed for a simpler world. They struggled with scalability because adding consumers meant complex routing logic. They couldn't replay messages — once a consumer read a message, it was gone forever. Supporting multiple independent consumers reading the same data required awkward fan-out patterns. Ordering guarantees were weak or non-existent across the whole system. And fault tolerance was an afterthought bolted on with clustering plugins.

What we actually needed was **a system that remembers everything**. A system where data isn't consumed and destroyed, but persisted and replayed. A system built around the idea that the history of events is just as valuable as the current state.

That's where Kafka enters.

---

## Wait — What Is Kafka Actually?

Kafka gets mislabeled constantly. People call it a message queue, but it's not *just* a message queue. People call it pub-sub, but it's more than that. People call it a streaming platform, but that's only part of the story.

Kafka is a **persistent, distributed, append-only log**. Everything else — the pub-sub semantics, the stream processing, the event sourcing — is built on top of that single idea.

Here's what makes Kafka fundamentally different from most data systems you've worked with: data is never updated in place. Data is never deleted immediately. Data is only ever appended to the end of a log. No random writes. No in-place mutations. Just sequential appends to an immutable log structure.

This sounds limiting, but it's actually liberating. Once you stop trying to mutate state and instead just record what happened, a surprising number of hard distributed systems problems become simple. And logs, as it turns out, scale surprisingly well.

---

## The Log Abstraction

If you understand this section, you understand Kafka. Everything else is implementation detail.

A log in Kafka is an ordered, immutable sequence of records. Each record gets assigned a monotonically increasing number called an **offset**. New records are always appended at the end — never inserted in the middle, never overwritten. Think of it like a notebook where you can only write on the next blank page, and every page is numbered.

```
Log: orders-events

Offset | Event            | Timestamp
-------|------------------|-------------------
0      | UserSignedUp     | 2025-12-20 09:00
1      | UserLoggedIn     | 2025-12-20 09:01
2      | OrderPlaced      | 2025-12-20 09:05
3      | PaymentCompleted | 2025-12-20 09:06
4      | OrderShipped     | 2025-12-20 09:30
```

This is deceptively powerful. A database stores **current state** — the user's balance is $100. Kafka stores **history** — the user deposited $50, then $80, then withdrew $30. You can always derive current state from history, but you can never reconstruct history from current state alone.

> History is power. A log gives you time travel.

Traditional databases answer the question "what is the state of the world right now?" Kafka answers a different question: "what happened, and in what order?" That second question turns out to be more fundamental. If you know everything that happened, you can reconstruct any point-in-time snapshot. You can replay events. You can build new views of your data without ever touching the original source. This is the core insight that makes Kafka so versatile.

---

## Topics, Partitions, and Ordering

A **topic** is just a named log. You might have a `user-events` topic, an `orders` topic, and a `payments` topic. Each topic is a logical category for a stream of related events.

But a single log doesn't scale. If every event in your system flows through one sequential log on one machine, that machine becomes a bottleneck. You need a way to split the work.

Kafka solves this by dividing each topic into **partitions** — independent logs that can live on different machines and be written to in parallel.

```
orders-topic
├── partition-0  [offset 0, 1, 2, 3, ...]  → Broker 1
├── partition-1  [offset 0, 1, 2, 3, ...]  → Broker 2
└── partition-2  [offset 0, 1, 2, 3, ...]  → Broker 3
```

Each partition is its own append-only log with its own sequence of offsets. When a producer writes a record, it gets routed to a specific partition — either round-robin for load balancing, or by a partition key (like `user_id`) when you need related events to land in the same partition.

Here's the critical tradeoff: **ordering is guaranteed within a partition, but not across partitions**. If you send all events for user #42 to partition-1, those events will be strictly ordered. But events in partition-0 and partition-1 have no ordering relationship to each other.

This tradeoff is deliberate and it's what makes Kafka horizontally scalable. If you needed global ordering across all partitions, you'd be back to a single bottleneck. By relaxing ordering to the partition level, Kafka lets you scale by adding more partitions (and more brokers to host them) while still preserving order where it actually matters — within a logical entity like a user or an order.

---

## Producers and Consumers (The Real Producer–Consumer Problem)

Kafka is arguably the cleanest real-world implementation of the producer–consumer problem you studied in your OS or DSA course. The textbook version has a bounded buffer, some semaphores, and maybe a condition variable. Kafka takes that same idea and makes it distributed, fault-tolerant, and fast enough to handle millions of messages per second.

**Producers** write records to topic partitions. They can choose which partition to write to — either letting Kafka decide (round-robin) or specifying a key so that all records with the same key go to the same partition. Producers can also choose their durability guarantees: fire-and-forget (`acks=0`), wait for the leader to acknowledge (`acks=1`), or wait for all replicas to confirm (`acks=all`).

**Consumers** read records from partitions. But here's the key difference from traditional queues: **consumers do not delete messages**. They simply advance an **offset pointer** — a bookmark that says "I've read up to record #124."

```
Partition-0:  [0] [1] [2] [3] [4] [5] [6] [7] [8] [9]
                                    ↑
                            consumer_offset = 4
                        "I've processed up to here"
```

This is the single most important design decision in Kafka, and it has enormous consequences. Because messages aren't deleted on read, multiple consumers can independently read the same data. An analytics service and a notification service and an audit logger can all consume from the same topic, each maintaining their own offset, without interfering with each other.

**Consumer groups** add another layer of parallelism. Within a group, each partition is assigned to exactly one consumer. If you have 6 partitions and 3 consumers in a group, each consumer handles 2 partitions. If a consumer crashes, Kafka automatically reassigns its partitions to the surviving consumers in the group — a process called **rebalancing**.

If a consumer crashes and restarts, recovery is trivial: read the last committed offset, resume from there. No data loss, no coordination chaos, no complicated recovery protocol. Just pick up where you left off.

**Brokers** are the servers that store the actual log data. Each broker hosts some number of partition replicas. A Kafka cluster is just a set of brokers working together, coordinated by a controller (historically ZooKeeper, now KRaft in newer versions).

---

## Kafka vs Traditional Queues

| Feature | Traditional Queue | Kafka |
|------|------------------|------|
| Message deletion | On read | Never (until retention expires) |
| Replay messages | ❌ | ✅ |
| Multiple consumers | Limited (fan-out required) | Native (consumer groups) |
| Ordering | Weak or none globally | Strong (per partition) |
| Persistence | Optional, often in-memory | Core design, always on disk |
| Scalability | Vertical, limited | Horizontal, partition-based |
| Back-pressure | Queue fills up, producers block | Consumers read at their own pace |

Kafka didn't replace queues. Kafka **generalized** them. A traditional queue is a special case of Kafka where you have one consumer group and set the retention to zero. But Kafka gives you the option to do so much more — replay, multi-consumer fan-out, long-term storage — all from the same underlying abstraction.

---

## Why Append-Only Is So Fast

Kafka's throughput numbers feel unreal until you understand the mechanics. Millions of messages per second on commodity hardware. How?

It starts with how Kafka writes to disk. Most database systems perform random writes — they update records scattered across different locations on disk. Random writes are slow because they require the disk head to physically seek to different locations (on HDDs) or require complex write amplification strategies (on SSDs). Kafka avoids all of this by writing **sequentially**. Every new record is appended to the end of a file. Sequential disk writes are so fast that they can actually outperform random writes to memory — a fact that surprises most people but has been well-documented in systems research.

Kafka also leans heavily on the **OS page cache**. Instead of maintaining its own in-memory cache (like most databases do), Kafka writes to the filesystem and lets the operating system handle caching. This is a brilliant design choice. The OS page cache uses all available free memory, is automatically managed, and survives process restarts. It also means Kafka's memory footprint stays small — the JVM heap doesn't balloon with cached data.

The final trick is **zero-copy transfer** via the `sendfile()` system call. When a consumer requests data, Kafka doesn't read data from disk into application memory and then write it to the network socket. Instead, `sendfile()` tells the OS to transfer data directly from the page cache to the network interface, bypassing the application entirely. This eliminates two memory copies and two context switches per transfer.

```
Traditional path:  Disk → Kernel Buffer → App Buffer → Socket Buffer → NIC
Zero-copy path:    Disk → Kernel Buffer → NIC
```

These three things together — sequential writes, page cache delegation, and zero-copy reads — are why Kafka can treat spinning disks like high-performance storage. Kafka doesn't fight the hardware. It works *with* it.

---

## Replication and Fault Tolerance

Kafka is designed with the assumption that machines will fail. Not *might* fail. *Will* fail. Every partition is replicated across multiple brokers.

```
Partition-0 Replication:
  Leader:    Broker 1  ← Producers write here, consumers read here
  Follower:  Broker 2  ← Replicates from leader
  Follower:  Broker 3  ← Replicates from leader
```

Producers always write to the **leader** replica of a partition. Followers continuously pull new records from the leader to stay in sync. The set of followers that are fully caught up is called the **In-Sync Replica set (ISR)**. When a producer sets `acks=all`, the write isn't acknowledged until every broker in the ISR has the record.

If the leader broker dies, Kafka's controller detects the failure and promotes one of the in-sync followers to be the new leader. Consumers and producers are notified of the leadership change and redirect their traffic. This whole failover process happens in seconds, and because the ISR guarantees that followers have all committed records, **no acknowledged data is lost**.

The replication factor is configurable per topic. A replication factor of 3 means every partition exists on 3 brokers, so the cluster can tolerate 2 simultaneous broker failures without data loss. In practice, most production Kafka deployments use a replication factor of 3 with `min.insync.replicas=2`, which gives you a good balance between durability and availability.

---

## Exactly-Once Semantics (Yes, Really)

Distributed systems usually present you with a painful trilemma. **At-most-once** delivery means messages might be lost but never duplicated — fast but unreliable. **At-least-once** delivery means messages are never lost but might be duplicated — safe but messy. **Exactly-once** delivery means every message is processed exactly one time — the holy grail that most distributed systems textbooks call theoretically impossible (or at least impractical).

Kafka actually supports exactly-once semantics. Here's how it pulls it off, in layers.

**Idempotent producers** solve the duplicate-write problem. Each producer gets a unique ID, and each record gets a sequence number. If a producer retries a write (say, because of a network timeout), the broker detects the duplicate sequence number and silently discards it. The producer gets a successful acknowledgment either way. This guarantees that retries don't create duplicate records in the log — exactly-once *production*.

**Transactional writes** extend this across multiple partitions. A producer can open a transaction, write to several topic-partitions atomically, and either commit or abort the whole batch. This is critical for stream processing, where you read from one topic, transform the data, and write to another. Without transactions, a crash mid-processing could result in partial outputs.

**Transactional offset commits** close the loop on the consumer side. When a consumer processes a batch of records and produces output, it can commit its consumer offsets as part of the same transaction that writes the output. If the transaction commits, both the output and the offset advance atomically. If it aborts, neither takes effect. This means the consumer will re-read and re-process the same input, but produce the same output — exactly-once *end-to-end*.

```
Transaction:
  1. Read from input-topic (offset 100-110)
  2. Transform records
  3. Write results to output-topic
  4. Commit offset 110 to input-topic
  → All of this is atomic. Commit or rollback together.
```

This is what allows Kafka to be used not just for fire-and-forget messaging, but for **stateful stream processing** where correctness actually matters — financial transactions, inventory systems, billing pipelines.

---

## Kafka Streams: Logs Become Computation

Kafka Streams takes the log abstraction and turns it into a computational model. Instead of the traditional Read → Process → Store pipeline, you get a continuous dataflow: **Log → Transform → Log**.

You can map, filter, join, window, and aggregate streams of records, and the results are written back to Kafka topics. State is maintained locally using RocksDB and backed by changelog topics — which means state can be rebuilt at any time by replaying those changelogs.

Crash? Restart. Rewind? No problem. The log has everything you need to recover.

---

## Event Sourcing and Kafka

Kafka naturally enables **event sourcing**, a pattern where instead of storing current state, you store the sequence of events that produced that state.

Instead of a database row that says `balance = 100`, you store the events:

```
+50  (initial deposit)
+80  (paycheck)
-30  (grocery run)
= 100 (derived, not stored)
```

State is derived by replaying events, not stored as a mutable snapshot. This gives you full audit logs for free, time travel to any historical state, deterministic recovery after failures, and highly debuggable systems where you can trace exactly what happened and why.

Kafka doesn't force event sourcing — it simply makes it practical by providing a durable, ordered, replayable log as a first-class primitive.

---

## Why This Matters

Kafka reveals something important about our field:

> **Most "modern systems" are just old CS ideas applied at scale.**

Logs. Offsets. Ordering. Producer–consumer synchronization. Nothing fancy. Just extremely disciplined engineering applied to ideas that have existed since the 1970s.

Students complain that DSA problems are artificial. But Kafka is literally logs, queues, ordering, offsets, and fault tolerance — the same concepts you studied in class, just promoted to production scale and running at LinkedIn, Netflix, and Uber.

---

## Lessons Learned

1. **Simple abstractions scale best** — an append-only log is about as simple as it gets, and it powers some of the most demanding systems on earth
2. **Logs beat mutable state** — immutability simplifies replication, recovery, and reasoning about your system
3. **History is more powerful than snapshots** — you can always derive state from events, but never events from state
4. **Distributed systems are about tradeoffs, not magic** — Kafka trades global ordering for horizontal scalability, and that tradeoff is what makes it work
5. **DSA concepts don't disappear — they evolve** — the producer-consumer problem from your textbook is alive and well inside every Kafka cluster

---

## Conclusion

Kafka is not complicated because it is complex.

Kafka is powerful because it is **simple**.

A distributed, append-only log.

That's it.

Once you understand that, Kafka stops being intimidating and starts being obvious.

The same way LCS powers `git diff`,
the same way logs power databases,
the same way queues power systems —

Kafka is just a log.

And logs run the world.