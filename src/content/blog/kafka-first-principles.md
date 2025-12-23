---
title: Kafka Explained Using First Principles
date: December 20, 2025
readTime: 10 min read
category: 'tech '
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

> “Experience with Kafka required.”

Suddenly, that “simple queue” is running Netflix, Uber, LinkedIn, and half the internet.

So what *is* Kafka really?

Turns out, Kafka is not magic.  
Kafka is **just a log** — designed so well that it became the backbone of modern distributed systems.

---

# Kafka Is Just a Log (And That’s Why It Runs the World)

## The Problem That Powers Everything

Early backend systems were simple.

A request came in.  
The service processed it.  
The database stored the result.

Life was good.

Then systems grew.

Now:
- Multiple services needed the same data
- Events needed to be processed asynchronously
- Systems couldn’t block on each other
- Data had to move fast, reliably, and in order

The naive solution?

“Let’s add a message queue.”

That worked… until it didn’t.

Traditional queues struggled with:
- Scalability
- Replayability
- Multiple consumers
- Ordering guarantees
- Fault tolerance

What we actually needed was **a system that remembers everything**.

That’s where Kafka enters.

---

## Wait — What Is Kafka Actually?

Kafka is not:
- Just a message queue
- Just pub-sub
- Just streaming

Kafka is a **persistent, distributed, append-only log**.

Everything else is built on top of that idea.

In Kafka:
- Data is never updated
- Data is never deleted immediately
- Data is only appended

No random writes.  
No in-place mutations.

Just logs.

And logs scale surprisingly well.

---

## The Log Abstraction

If you understand this, you understand Kafka.

A log is:
- An ordered sequence of records
- Each record has an offset
- New records are appended at the end

Example:

Offset | Event  
------ | ------
0 | UserSignedUp  
1 | UserLoggedIn  
2 | OrderPlaced  
3 | PaymentCompleted  

Kafka stores everything like this.

Databases store **current state**.  
Kafka stores **history**.

History is power.

---

## Topics, Partitions, and Ordering

A topic is just a named log.

But a single log doesn’t scale.

So Kafka splits topics into
orders-topic
├── partition-0
├── partition-1
└── partition-2
Each partition:
- Is an independent log
- Maintains strict ordering
- Is append-only

Ordering is guaranteed **within a partition**, not across the entire topic.

This tradeoff is deliberate.  
It allows Kafka to scale horizontally while preserving order where it matters.

---

## Producers and Consumers (The Real Producer–Consumer Problem)

Kafka is the cleanest real-world implementation of the producer–consumer problem you studied in DSA.

- Producers write records to partitions
- Consumers read records from partitions
- Brokers store the logs
- Consumer groups enable parallelism

Here’s the key difference from traditional queues:

 **Consumers do not delete messages.**

They only move an **offset pointer**.
consumer_offset = 124

If a consumer crashes:
- Restart
- Resume from last offset
- No data loss
- No coordination chaos

This single idea unlocks Kafka’s power.

---

## Kafka vs Traditional Queues

| Feature | Traditional Queue | Kafka |
|------|------------------|------|
| Message deletion | On read | Never (until retention) |
| Replay messages | ❌ | ✅ |
| Multiple consumers | Limited | Native |
| Ordering | Weak | Strong (per partition) |
| Persistence | Optional | Core design |

Kafka didn’t replace queues.  
Kafka **generalized** them.

---

## Why Append-Only Is So Fast

Kafka’s performance feels unreal until you understand why.

Kafka:
- Writes sequentially to disk
- Uses the OS page cache
- Avoids random disk seeks
- Uses zero-copy (`sendfile`)

Sequential disk writes are extremely fast.

Kafka treats disk like an append buffer, not like a database.

That’s why Kafka can handle **millions of messages per second** on commodity hardware.

---

## Replication and Fault Tolerance

Kafka assumes machines will fail.

Every partition is replicated.

Partition 0
Leader: Broker 1
Followers: Broker 2, Broker 3

- Producers write to the leader
- Followers replicate the log
- If the leader dies, a follower is elected

No data loss.  
No downtime.

Consistency through logs.

---

## Exactly-Once Semantics (Yes, Really)

Distributed systems usually give you a painful choice:
- At-most-once
- At-least-once
- Exactly-once (theoretical)

Kafka actually supports **exactly-once semantics**.

How?
- Idempotent producers
- Transactional writes
- Offset commits tied to transactions

This allows Kafka to be used not just for messaging, but for **stateful stream processing**.

---

## Kafka Streams: Logs Become Computation

Kafka Streams treats logs as **dataflow**.

Instead of:
- Read → Process → Store

You get:
- Log → Transform → Log

Operations include:
- Map
- Filter
- Join
- Window
- Aggregate

State is rebuilt by replaying logs.

Crash?  
Restart?  
Rewind?

No problem.

---

## Event Sourcing and Kafka

Kafka naturally enables **event sourcing**.

Instead of storing current state:

balance = 100

You store events:

+10
-20
+30

State is derived, not stored.

This gives you:
- Full audit logs
- Time travel
- Deterministic recovery
- Debuggable systems

Kafka doesn’t force event sourcing — it simply makes it practical.

---

## Why This Matters

Kafka reveals something important:

> **Most “modern systems” are just old CS ideas applied at scale.**

Logs.  
Offsets.  
Ordering.  
Producer–consumer.

Nothing fancy.

Just extremely disciplined engineering.

---

## The Irony

Students complain that DSA problems are artificial.

But Kafka is literally:
- Logs
- Queues
- Ordering
- Offsets
- Fault tolerance

The same ideas you studied.

Just promoted to production scale.

---

## Lessons Learned

1. Simple abstractions scale best  
2. Logs beat mutable state  
3. History is more powerful than snapshots  
4. Distributed systems are about tradeoffs, not magic  
5. DSA concepts don’t disappear — they evolve  

---

## Conclusion

Kafka is not complicated because it is complex.

Kafka is powerful because it is **simple**.

A distributed, append-only log.

That’s it.

Once you understand that, Kafka stops being intimidating and starts being obvious.

The same way LCS powers `git diff`,  
the same way logs power databases,  
the same way queues power systems —

Kafka is just a log.

And logs run the world.