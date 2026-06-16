# NovaDB — Secure Session Management API

> **Full-stack authentication system** with encrypted Redis session storage, built to demonstrate production-grade data persistence and real-time key-value architecture — core competencies in Data Engineering and Data Science infrastructure.

---

## Overview

NovaDB is a **production-ready REST API** for stateless session management, combining a secure Node.js/Express backend with a Redis in-memory data store. The project showcases critical data infrastructure patterns: low-latency data access, encrypted state persistence, and horizontal scalability — all foundational to modern data pipelines and ML serving layers.

---

## Tech Stack

| Layer | Technology | Role |
|---|---|---|
| Runtime | Node.js + Express | REST API server |
| Data Store | Redis (ioredis) | In-memory session persistence |
| Encryption | AES-256-CBC (Node crypto) | Session data security |
| Auth | bcrypt (cost factor 12) | Password hashing |
| Containerization | Docker + Docker Compose | Reproducible deployment |
| Testing | Jest + Artillery | Unit, security & load testing |
| Frontend | React 19 | Auth UI + NoSQL knowledge base |

---

## Key Features

- **AES-256 encrypted sessions** — all session payloads encrypted at rest in Redis
- **Sub-millisecond data retrieval** — Redis in-memory engine, validated by performance tests
- **Sliding session expiry** — TTL auto-refreshed on each authenticated request (30 min)
- **Secure cookie transport** — HttpOnly, Secure, SameSite=Strict flags
- **Load-tested** — Artillery scenarios: 10 → 20 → 50 req/s ramp
- **Redis resilience suite** — failure recovery, pipeline bulk writes (10k+ sessions)

---

## Data Science Relevance

This project directly maps to **data infrastructure skills** required in DS/DE roles:

- **Key-value store mastery** — Redis as a feature store / real-time serving layer pattern
- **Data encryption & governance** — AES-256 at-rest encryption for sensitive payloads
- **Pipeline performance** — Redis pipelining for high-throughput batch operations
- **Scalability patterns** — session sharding concepts applicable to distributed ML inference
- **CAP theorem in practice** — eventual consistency trade-offs documented in the UI knowledge base

---

## Project Structure

```
├── authController.js     # Core auth logic (signup / login / logout / profile)
├── authRoutes.js         # Express router with middleware-protected endpoints
├── redis.js              # ioredis client with exponential backoff reconnection
├── app.js                # Express app (helmet, compression, payload limits)
├── docker-compose.yml    # API + Redis services
├── tests/
│   ├── sessionSecurity.test.js    # AES-256 encryption validation
│   ├── sessionPerformance.test.js # Latency < 10ms + 10k pipeline test
│   └── sessionResilience.test.js  # Failure recovery simulation
└── load-test.yml         # Artillery load test (10→50 rps)
```

---

## Getting Started

```bash
# Clone & launch (Docker required)
git clone https://github.com/YOUR_USERNAME/novadb.git
cd novadb
docker-compose up --build

# Run test suite
npm test

# Run load test
npx artillery run load-test.yml
```

---

## Test Coverage

| Suite | Scenario | Assertion |
|---|---|---|
| Security | AES-256 encrypt/decrypt | Ciphertext ≠ plaintext |
| Performance | Single GET latency | < 10ms |
| Performance | Bulk pipeline write | 10,000 sessions |
| Resilience | Flush + restore | Value integrity |

---

## License

MIT — open for extension and contribution.
