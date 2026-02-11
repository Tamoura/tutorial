# IBM ACE to Microservices Migration Plan

## 1. Executive Summary

This document outlines the strategy for decomposing monolithic IBM App Connect Enterprise (ACE) applications into containerized microservices. Two strategies are covered:

- **Strategy A** — ACE-in-Container (lift & shift, keep ACE runtime)
- **Strategy B** — Full ACE Replacement (rewrite to native microservices, eliminate ACE entirely)

Strategy B removes IBM ACE licensing costs, proprietary runtime dependencies, and vendor lock-in by replacing ACE capabilities with open-source or cloud-native equivalents.

**Key constraint: IBM API Connect (APIC) is retained** as the API management and gateway layer. Native microservices will register their APIs with APIC for traffic management, security policies, rate limiting, and analytics — exactly as they did when backed by ACE.

---

## 2. Current State Assessment

### 2.1 Inventory Checklist

Before migration, catalog every ACE artifact:

| Artifact Type | What to Capture |
|---|---|
| **Message Flows** (`.msgflow`) | Flow name, input/output nodes, protocols (HTTP, MQ, File, Kafka) |
| **ESQL Modules** (`.esql`) | Business logic, database calls, shared modules |
| **Subflows** (`.subflow`) | Reusable components shared across flows |
| **Policies** (`.policyxml`) | Security, JMS, JDBC, SMTP policy configurations |
| **BAR Files** (`.bar`) | Deployment units — which flows are bundled together |
| **Schemas** (`.xsd`, `.wsdl`, `.json`) | Message models, API contracts |
| **Java Compute Nodes** | Custom Java code in compute nodes |
| **Broker Configuration** | Server.conf.yaml, node configuration, queue manager bindings |
| **External Dependencies** | MQ queues, databases, LDAP, external APIs, file shares |

### 2.2 Dependency Mapping

For each message flow, document:
- **Upstream systems** — who sends data into this flow
- **Downstream systems** — what this flow calls or writes to
- **Shared state** — databases, caches, or queues used across flows
- **Shared libraries** — ESQL modules or subflows used by multiple flows

---

## 3. Decomposition Strategy

### 3.1 Identifying Microservice Boundaries

Each microservice should map to a **bounded context** — a cohesive set of integration logic. Use these heuristics:

| Heuristic | Rule |
|---|---|
| **One BAR = One Candidate Service** | Each BAR file that deploys independently is a natural service boundary |
| **Single Protocol Endpoint** | A flow exposing one REST API or consuming one MQ queue = one service |
| **Shared Data = Same Service** | Flows that read/write the same database tables should stay together initially |
| **Independent Lifecycle** | Flows that change at different rates should be separate services |
| **Team Ownership** | Flows maintained by different teams should be separate services |

### 3.2 Decomposition Patterns

```
┌─────────────────────────────────────────────────────┐
│              MONOLITHIC ACE SERVER                   │
│                                                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  │ Flow A   │ │ Flow B   │ │ Flow C   │           │
│  │ (REST)   │ │ (MQ)     │ │ (File)   │           │
│  └──────────┘ └──────────┘ └──────────┘           │
│  ┌──────────────────────────────────────┐          │
│  │      Shared ESQL / Subflows          │          │
│  └──────────────────────────────────────┘          │
└─────────────────────────────────────────────────────┘

                      ▼ MIGRATION ▼

┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Service A    │  │ Service B    │  │ Service C    │
│ (Container)  │  │ (Container)  │  │ (Container)  │
│              │  │              │  │              │
│ REST API     │  │ MQ Consumer  │  │ File Watcher │
│ ACE Runtime  │  │ ACE Runtime  │  │ OR native    │
│ Lightweight  │  │ Lightweight  │  │ code         │
└──────────────┘  └──────────────┘  └──────────────┘
```

### 3.3 Migration Approaches (per flow)

| Approach | When to Use | Effort |
|---|---|---|
| **Lift & Shift (ACE in Container)** | Complex ESQL logic, tight timeline | Low |
| **Refactor (ACE lightweight container)** | Need scalability, keep ACE runtime | Medium |
| **Rewrite (Native microservice)** | Simple transformations, team has dev skills | High |
| **Replace (Managed service)** | Standard pattern (e.g., API proxy) → use API Gateway | Varies |

---

## 4. Target Architecture

### 4.1 Container Platform

```
┌─────────────────────────────────────────────────────────────┐
│                    Kubernetes Cluster                        │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │  Namespace:  │  │  Namespace:  │  │  Namespace:  │       │
│  │  ace-orders  │  │  ace-billing │  │  ace-notify  │       │
│  │             │  │             │  │             │        │
│  │ ┌─────────┐ │  │ ┌─────────┐ │  │ ┌─────────┐ │        │
│  │ │ Pod(s)  │ │  │ │ Pod(s)  │ │  │ │ Pod(s)  │ │        │
│  │ │ ACE     │ │  │ │ ACE     │ │  │ │ ACE     │ │        │
│  │ │ Runtime │ │  │ │ Runtime │ │  │ │ Runtime │ │        │
│  │ └─────────┘ │  │ └─────────┘ │  │ └─────────┘ │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
│                                                             │
│  ┌──────────────────────────────────────────────────┐      │
│  │  Shared Infrastructure                            │      │
│  │  - Ingress Controller    - Config Maps            │      │
│  │  - Service Mesh (Istio)  - Secrets Management     │      │
│  │  - Monitoring (Prometheus/Grafana)                │      │
│  │  - Logging (EFK/Loki)    - MQ (external/in-cluster)│    │
│  └──────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 Technology Stack

| Layer | Technology |
|---|---|
| **Container Runtime** | Docker / Podman |
| **Orchestration** | Kubernetes (OpenShift, EKS, AKS, or GKE) |
| **Base Image** | `cp.icr.io/cp/appc/ace-server-prod` (IBM ACE certified container) |
| **Service Mesh** | Istio or Linkerd (optional, for mTLS and observability) |
| **API Gateway** | IBM API Connect (APIC) — retained, not replaced |
| **Message Broker** | IBM MQ in container or managed MQ service |
| **CI/CD** | GitHub Actions / Jenkins / Tekton |
| **Config Management** | Kubernetes ConfigMaps + Secrets (or Vault) |
| **Monitoring** | Prometheus + Grafana |
| **Logging** | EFK stack (Elasticsearch, Fluentd, Kibana) or Loki |
| **Registry** | Harbor / ECR / ACR / GCR |

### 4.3 Configuration Externalization

ACE configurations that must be externalized for containers:

| ACE Config | Container Equivalent |
|---|---|
| `server.conf.yaml` | ConfigMap mounted as volume |
| JDBC credentials | Kubernetes Secret or Vault |
| MQ connection info | ConfigMap + Secret |
| Policy projects | Baked into image or ConfigMap |
| Keystores / truststores | Kubernetes Secret (TLS) |
| `setdbparms` credentials | Kubernetes Secret → `ace_config` type |

---

## 5. Migration Phases

### Phase 1: Foundation (Infrastructure Setup)

- [ ] Set up container registry
- [ ] Set up Kubernetes cluster with namespaces
- [ ] Configure CI/CD pipeline templates
- [ ] Set up monitoring and logging infrastructure
- [ ] Establish base Docker image with ACE runtime
- [ ] Create Helm chart templates for ACE services
- [ ] Set up secrets management (Vault or K8s secrets)

### Phase 2: Pilot Migration (1-2 Flows)

- [ ] Select low-risk, well-understood flow as pilot
- [ ] Extract flow and dependencies into standalone BAR
- [ ] Containerize using ACE certified container image
- [ ] Write Kubernetes deployment manifests
- [ ] Deploy to dev/staging environment
- [ ] Run integration tests against containerized version
- [ ] Validate performance benchmarks vs. existing deployment
- [ ] Document lessons learned

### Phase 3: Incremental Migration (Remaining Flows)

- [ ] Prioritize remaining flows by business criticality and complexity
- [ ] Migrate flows in batches, starting with lowest risk
- [ ] For each flow:
  - Extract into standalone service
  - Containerize and test
  - Deploy with traffic splitting (canary or blue-green)
  - Validate and cut over
- [ ] Handle shared ESQL modules → extract into shared library image layer or duplicate
- [ ] Update upstream/downstream systems as endpoints change

### Phase 4: Optimization

- [ ] Evaluate candidates for native rewrite (remove ACE runtime overhead)
- [ ] Implement horizontal pod autoscaling (HPA)
- [ ] Add circuit breakers and retry policies
- [ ] Optimize container resource requests/limits
- [ ] Implement distributed tracing (Jaeger/Zipkin)
- [ ] Consolidate monitoring dashboards

### Phase 5: Decommission Legacy

- [ ] Verify all traffic is served by containerized services
- [ ] Remove old ACE integration node/server
- [ ] Archive legacy BAR files and configuration
- [ ] Update operational runbooks

---

## 6. Per-Service Migration Checklist

For each ACE flow being migrated:

```
□ Identify flow and all dependencies (ESQL, subflows, schemas, policies)
□ Document external connections (MQ queues, DB, APIs, files)
□ Create standalone project structure:
    service-name/
    ├── Dockerfile
    ├── bar/                    # BAR file(s)
    ├── config/
    │   ├── server.conf.yaml    # ACE server config
    │   ├── policies/           # Policy XML files
    │   └── setdbparms.sh       # Credential setup script
    ├── k8s/
    │   ├── deployment.yaml
    │   ├── service.yaml
    │   ├── configmap.yaml
    │   └── hpa.yaml
    ├── tests/
    │   ├── integration/
    │   └── contract/
    └── README.md
□ Build and test Docker image locally
□ Push image to registry
□ Deploy to dev namespace
□ Run integration tests
□ Performance test
□ Deploy to staging with traffic split
□ Production cutover
□ Monitor for 1-2 weeks
□ Decommission legacy flow
```

---

## 7. Key Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Shared ESQL modules create tight coupling | High | Duplicate into each service or extract as shared library layer |
| MQ queue dependencies span services | Medium | Use separate queues per service, bridge if needed |
| Performance regression in containers | Medium | Benchmark before/after, tune JVM and ACE resource settings |
| License cost for multiple ACE runtimes | High | Use IBM ACE certified containers (per-core licensing), evaluate rewrite for simple flows |
| Credential management across services | Medium | Centralize in Vault or K8s secrets with RBAC |
| Network latency between services | Medium | Co-locate dependent services, use service mesh |
| Data consistency across services | High | Use saga pattern or event-driven approach for distributed transactions |

---

## 8. Testing Strategy

| Test Type | Scope | Tools |
|---|---|---|
| **Unit Tests** | ESQL logic, Java compute nodes | ACE Test Project, JUnit |
| **Integration Tests** | End-to-end flow with real dependencies | Postman/Newman, pytest, custom test harness |
| **Contract Tests** | API schema validation | Pact, Schemathesis |
| **Performance Tests** | Throughput, latency under load | JMeter, k6, Gatling |
| **Chaos Tests** | Resilience (pod kill, network partition) | Chaos Mesh, Litmus |
| **Smoke Tests** | Post-deployment health check | Curl-based health endpoint checks |

---

## 9. Observability Requirements

Each containerized ACE service must expose:

1. **Health endpoints**: `/health/ready` and `/health/live` for Kubernetes probes
2. **Metrics**: Prometheus endpoint at `/metrics` (ACE provides built-in metrics)
3. **Structured logging**: JSON-formatted logs to stdout/stderr
4. **Tracing**: OpenTelemetry or Zipkin headers propagation

---

## 10. Decision Log

| Decision | Options Considered | Chosen | Rationale |
|---|---|---|---|
| Container strategy | Lift-and-shift vs. rewrite | Lift-and-shift first | Reduces risk, faster time to value |
| Orchestration | Docker Compose vs. Kubernetes | Kubernetes | Production-grade, auto-scaling, self-healing |
| ACE base image | Custom build vs. IBM certified | IBM certified | Supported, security patches, license compliance |
| Config management | Baked in image vs. externalized | Externalized (ConfigMap/Secret) | Environment portability, security |
| CI/CD | Jenkins vs. GitHub Actions | TBD per team | Depends on existing tooling |

---

## 11. Strategy B — Full ACE Replacement (No ACE Runtime)

### 11.1 Why Replace ACE Completely?

| Factor | ACE-in-Container | Full Replacement |
|---|---|---|
| **License cost** | Still requires IBM ACE license per core | Zero IBM licensing |
| **Image size** | ~1.5 GB (ACE runtime) | ~100-300 MB (native app) |
| **Startup time** | 30-60 seconds | 2-10 seconds |
| **Memory footprint** | 512 MB - 1 GB minimum | 64-256 MB typical |
| **Vendor lock-in** | Still tied to IBM release cycles | Fully open-source stack |
| **Developer skills** | Need ESQL / ACE toolkit expertise | Standard Java/Node.js/Python/Go |
| **Scaling** | Heavier pods = slower autoscaling | Lightweight pods = fast autoscaling |
| **Hiring** | Niche skill set, hard to hire | Mainstream skills, easy to hire |

### 11.2 ACE Capability → Native Replacement Mapping

Every ACE feature has a native equivalent. This is the core reference table:

#### Protocol / Connectivity

| ACE Capability | What It Does | Native Replacement | Technology |
|---|---|---|---|
| **HTTPInput / HTTPReply** | Expose REST/SOAP APIs | REST framework | Spring Boot, Express.js, FastAPI, Go net/http |
| **MQInput / MQOutput** | Consume/produce MQ messages | MQ client library | JMS (Spring JMS), amqplib, MQ Go client |
| **KafkaConsumer / KafkaProducer** | Kafka pub/sub | Kafka client | Spring Kafka, kafkajs, confluent-kafka-python |
| **FileInput / FileOutput** | Read/write files | File I/O + watcher | Spring Integration, chokidar (Node), watchdog (Python) |
| **SOAPInput / SOAPRequest** | SOAP web services | SOAP library | Apache CXF (Java), soap (Node.js) |
| **DatabaseInput / DatabaseRoute** | DB polling / routing | Scheduled DB queries | Spring Data + @Scheduled, cron + query |
| **TCPIPInput / TCPIPOutput** | Raw TCP/IP sockets | Socket library | Netty (Java), net (Node.js) |
| **EmailOutput (SMTP)** | Send emails | SMTP client | JavaMail, Nodemailer, smtplib (Python) |
| **FTPInput / FTPOutput** | FTP file transfer | FTP client library | Apache Commons Net, basic-ftp (Node) |

#### Data Transformation

| ACE Capability | What It Does | Native Replacement | Technology |
|---|---|---|---|
| **ESQL Compute Node** | Message transformation & business logic | Application code | Java methods, JS/TS functions, Python functions |
| **Mapping Node** | Graphical field mapping | Object mapper | MapStruct (Java), Automapper, custom mappers |
| **XSLT / XPath** | XML transformation | XSLT processor | Saxon (Java), xslt-processor (Node), lxml (Python) |
| **JSON Parser / Builder** | JSON handling | Native JSON | Jackson (Java), built-in JSON (Node/Python/Go) |
| **XML Parser / Builder** | XML parsing and creation | XML library | JAXB/DOM (Java), fast-xml-parser (Node) |
| **DFDL Parser** | Parse fixed-format / binary data | Custom parser | Daffodil (Apache), manual parsing |
| **GraphQL Compute** | GraphQL handling | GraphQL server | Apollo Server (Node), Spring GraphQL |

#### Integration Patterns

| ACE Capability | What It Does | Native Replacement | Technology |
|---|---|---|---|
| **Route / Filter Node** | Content-based routing | Router logic in code | Spring Integration Router, Express middleware |
| **Aggregate Node** | Aggregate multiple messages | Aggregation pattern | Spring Integration Aggregator, custom code |
| **Sequence Node** | Message sequencing | Queue-based ordering | Kafka partition ordering, Redis sorted sets |
| **Collector Node** | Collect and batch messages | Batch processor | Spring Batch, Bull (Node.js) |
| **Timeout Control** | Message timeout handling | Timeout middleware | Resilience4j (Java), p-timeout (Node), context (Go) |
| **Try / Catch** | Error handling in flows | Try/catch in code | Native language error handling |
| **Subflows** | Reusable flow components | Shared libraries / packages | Maven/npm/pip packages, internal modules |

#### Cross-Cutting Concerns

| ACE Capability | What It Does | Native Replacement | Technology |
|---|---|---|---|
| **Security Profiles / Policies** | Authentication, SSL/TLS | Security framework | Spring Security, Passport.js, OAuth2 libraries |
| **Activity Log** | Message auditing | Structured logging | SLF4J+Logback (Java), Winston (Node), Loki/EFK |
| **Monitoring (server stats)** | Runtime metrics | Metrics library | Micrometer (Java), prom-client (Node) → Prometheus |
| **setdbparms** | Credential storage | Secrets manager | Kubernetes Secrets, HashiCorp Vault, AWS Secrets Manager |
| **Policy Projects** | External config | Config management | Spring Cloud Config, ConfigMaps, Consul |
| **User Defined Properties** | Runtime overrides | Environment variables | 12-factor app env vars, config files |
| **Transaction coordination** | 2-phase commit / XA | Saga pattern | Eventuate, Axon, or manual saga orchestration |

### 11.3 Decision Matrix — Which Flows to Rewrite

Score each flow to decide if it's a good rewrite candidate:

| Criteria | Score 1 (Poor fit) | Score 3 (Good fit) | Score 5 (Excellent fit) |
|---|---|---|---|
| **ESQL complexity** | 500+ lines, complex recursion | 100-500 lines, moderate logic | < 100 lines, simple mapping |
| **Protocol usage** | Exotic (DFDL, TCPIP, CICS) | Standard (MQ, File) | HTTP/REST only |
| **External dependencies** | Many (5+ systems) | Moderate (2-4 systems) | Few (1-2 systems) |
| **Team skill** | No Java/Node experience | Some experience | Strong experience |
| **Change frequency** | Rarely changes | Occasional changes | Frequent changes (high ROI) |
| **Performance needs** | Acceptable as-is | Moderate improvement needed | Needs significant improvement |

**Scoring guide:**
- **25-30 points** → Rewrite immediately, high ROI
- **18-24 points** → Good candidate, plan rewrite
- **12-17 points** → Consider rewrite after initial migration
- **6-11 points** → Keep in ACE container for now, revisit later

### 11.4 Full Replacement Architecture (APIC Retained)

```
                    ┌─────────────────────────────┐
                    │       IBM API Connect        │  ◄── RETAINED
                    │         (APIC)               │
                    │                              │
                    │  - API Gateway / Proxy       │
                    │  - Rate Limiting             │
                    │  - OAuth / Security Policies │
                    │  - Developer Portal          │
                    │  - Analytics & Monitoring     │
                    └──────────┬──────────────────┘
                               │
                    ┌──────────▼──────────────────┐
                    │     Kubernetes Ingress       │
                    └──────────┬──────────────────┘
                               │
    ┌──────────────────────────┼──────────────────────────┐
    │                          │   Kubernetes Cluster      │
    │                          │                          │
    │  ┌─────────────────┐  ┌──▼──────────────┐  ┌─────────────────┐
    │  │  Order Service   │  │ Billing Service  │  │ Notification Svc│
    │  │  (Spring Boot)   │  │  (Node.js)       │  │  (Go)           │
    │  │                  │  │                  │  │                  │
    │  │  REST API        │  │  MQ Consumer     │  │  Kafka Consumer  │
    │  │  DB Access       │  │  REST Client     │  │  SMTP Client     │
    │  │  ~150 MB image   │  │  ~100 MB image   │  │  ~30 MB image    │
    │  │  ~3s startup     │  │  ~2s startup     │  │  ~1s startup     │
    │  └────────┬─────────┘  └────────┬─────────┘  └────────┬────────┘
    │           │                     │                      │        │
    │  ┌────────▼─────────────────────▼──────────────────────▼──────┐ │
    │  │                    Infrastructure Layer                     │ │
    │  │                                                            │ │
    │  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐ │ │
    │  │  │ IBM MQ   │ │ Kafka    │ │Databases │ │ Vault / K8s  │ │ │
    │  │  │(retained)│ │(optional)│ │(Postgres)│ │ Secrets      │ │ │
    │  │  └──────────┘ └──────────┘ └──────────┘ └──────────────┘ │ │
    │  │                                                            │ │
    │  │  ┌──────────┐ ┌──────────┐ ┌──────────┐                  │ │
    │  │  │Prometheus│ │ Grafana  │ │ Jaeger / │                  │ │
    │  │  │+ Metrics │ │Dashboard │ │ OTel     │                  │ │
    │  │  └──────────┘ └──────────┘ └──────────┘                  │ │
    │  └────────────────────────────────────────────────────────────┘ │
    └─────────────────────────────────────────────────────────────────┘
```

### 11.4.1 APIC Integration — What Changes, What Stays

Since APIC is retained, here's how the integration works with native microservices:

**What stays the same:**
- APIC continues to be the front door for all external API consumers
- Existing APIC Products, Plans, and Subscriptions remain unchanged
- Developer Portal, rate limiting, OAuth policies — all unchanged
- APIC analytics continues to capture traffic metrics

**What changes:**
- APIC backend URLs point to new Kubernetes Service endpoints instead of ACE server endpoints
- OpenAPI specs in APIC may need updating if API contracts change (ideally they don't)
- APIC invoke policies now route to native microservice URLs

| APIC Configuration | Before (ACE) | After (Native) |
|---|---|---|
| Backend URL | `http://ace-server:7800/api/orders` | `http://order-service.ace-services:8080/api/orders` |
| API definition | OpenAPI from ACE REST API | OpenAPI from native service (same contract) |
| Security policy | Pass-through to ACE | Pass-through to native service (or enforce at APIC) |
| Rate limiting | APIC handles | APIC handles (no change) |

**Migration steps for each API in APIC:**
1. Deploy native microservice alongside existing ACE flow
2. In APIC, create a new API version pointing to native service (or update backend URL)
3. Use APIC's built-in traffic management to gradually shift traffic (canary)
4. Validate via APIC analytics that error rates and latency are acceptable
5. Complete cutover in APIC
6. Remove old ACE-backed API version

### 11.5 Full Replacement — Migration Phases

#### Phase R1: Analyze & Plan
- [ ] Score every flow using the Decision Matrix (Section 11.3)
- [ ] Group flows into rewrite waves by score (highest first)
- [ ] Map each flow's ESQL logic to equivalent native code design
- [ ] Identify shared ESQL modules → plan as shared libraries (Maven/npm packages)
- [ ] Choose target language per service (Java/Node/Go/Python)
- [ ] Document API contracts (OpenAPI spec) for each flow's inputs/outputs

#### Phase R2: Foundation
- [ ] Set up monorepo or multi-repo structure for services
- [ ] Create project scaffolding templates per language (Spring Boot, Node.js, Go)
- [ ] Set up shared libraries for common patterns:
  - MQ connectivity wrapper
  - Logging + metrics middleware
  - Error handling & retry patterns
  - Health check endpoints
- [ ] Build CI/CD pipeline for native services (build, test, scan, deploy)
- [ ] Set up message broker (keep MQ or migrate to RabbitMQ/Kafka)

#### Phase R3: Rewrite Pilot (1-2 highest-scoring flows)
- [ ] Rewrite flow logic in target language
- [ ] Implement same input/output contracts (API, message format)
- [ ] Write comprehensive tests (unit + integration + contract)
- [ ] Deploy alongside existing ACE flow (shadow / parallel run)
- [ ] Compare outputs between ACE and native versions
- [ ] Validate performance meets or exceeds ACE baseline
- [ ] Cut over traffic to native service
- [ ] Monitor for 2 weeks, then decommission ACE flow

#### Phase R4: Incremental Rewrite (remaining flows)
- [ ] Rewrite flows in priority order (wave by wave)
- [ ] For each flow, follow the same pilot process:
  - Rewrite → test → parallel run → validate → cut over
- [ ] Replace MQ-based integrations:
  - Option A: Keep IBM MQ, use native MQ client libraries
  - Option B: Migrate to RabbitMQ or Kafka (if MQ license is also a concern)
- [ ] Extract shared transformations into reusable packages

#### Phase R5: Decommission ACE Entirely
- [ ] Verify zero flows running on ACE
- [ ] Terminate IBM ACE license
- [ ] Remove ACE toolkit from developer machines
- [ ] Archive all ESQL/msgflow source as historical reference
- [ ] Update architecture documentation
- [ ] Final cost savings report

### 11.6 ESQL → Native Code Translation Guide

Common ESQL patterns and their native equivalents:

#### Variable Declaration & Assignment
```
-- ESQL
DECLARE myVar CHARACTER;
SET myVar = InputRoot.JSON.Data.name;
SET OutputRoot.JSON.Data.greeting = 'Hello ' || myVar;
```
```java
// Java (Spring Boot)
String myVar = input.getData().getName();
output.getData().setGreeting("Hello " + myVar);
```
```javascript
// Node.js (Express)
const myVar = input.data.name;
output.data.greeting = `Hello ${myVar}`;
```

#### Database Access
```
-- ESQL
SET OutputRoot.JSON.Data.customer = THE(
    SELECT c.name FROM Database.CUSTOMERS AS c
    WHERE c.id = InputRoot.JSON.Data.customerId
);
```
```java
// Java (Spring Data JPA)
@Query("SELECT c.name FROM Customer c WHERE c.id = :id")
String findNameById(@Param("id") String id);
```
```javascript
// Node.js (Knex/pg)
const result = await db('customers')
    .select('name')
    .where('id', input.data.customerId)
    .first();
```

#### MQ Operations
```
-- ESQL (MQOutput)
SET OutputRoot.MQMD.MsgType = MQMT_DATAGRAM;
SET OutputRoot.MQMD.Format = MQFMT_STRING;
SET OutputRoot.JSON.Data = InputRoot.JSON.Data;
PROPAGATE TO TERMINAL 'out';
```
```java
// Java (Spring JMS)
@Autowired
private JmsTemplate jmsTemplate;

public void sendMessage(OrderData data) {
    jmsTemplate.convertAndSend("ORDERS.OUT", data);
}
```

#### Content-Based Routing
```
-- ESQL (Route Node equivalent)
IF InputRoot.JSON.Data.type = 'ORDER' THEN
    PROPAGATE TO TERMINAL 'out1';
ELSEIF InputRoot.JSON.Data.type = 'RETURN' THEN
    PROPAGATE TO TERMINAL 'out2';
END IF;
```
```java
// Java (Spring)
@PostMapping("/process")
public ResponseEntity<?> route(@RequestBody Message msg) {
    return switch (msg.getType()) {
        case "ORDER"  -> orderService.handle(msg);
        case "RETURN" -> returnService.handle(msg);
        default       -> ResponseEntity.badRequest().build();
    };
}
```

#### Error Handling
```
-- ESQL (Try/Catch)
BEGIN
    -- business logic
    CALL processOrder(InputRoot, OutputRoot);
EXCEPTION
    SET OutputRoot.JSON.Data.error = SQLCODE || ': ' || SQLERRORTEXT;
    PROPAGATE TO TERMINAL 'failure';
END;
```
```java
// Java (Spring)
@ExceptionHandler(ProcessingException.class)
public ResponseEntity<ErrorResponse> handleError(ProcessingException ex) {
    log.error("Processing failed: {}", ex.getMessage());
    return ResponseEntity.status(500)
        .body(new ErrorResponse(ex.getCode(), ex.getMessage()));
}
```

### 11.7 MQ Replacement Decision

If you also want to eliminate IBM MQ:

| Option | Pros | Cons |
|---|---|---|
| **Keep IBM MQ** (just remove ACE) | No message migration, existing apps work | Still paying MQ license |
| **Migrate to RabbitMQ** | Open source, AMQP standard, easy setup | Different protocol, need client changes |
| **Migrate to Apache Kafka** | High throughput, event sourcing, replay | Different paradigm (log vs. queue), steeper learning curve |
| **Migrate to cloud-managed** (SQS, Pub/Sub, Azure Service Bus) | Zero ops, auto-scaling | Cloud vendor lock-in, latency |

### 11.8 Cost Comparison

> **Note:** IBM APIC license cost is not included — it is retained in both strategies.

| Cost Category | ACE-in-Container (Strategy A) | Full ACE Replacement (Strategy B) |
|---|---|---|
| IBM ACE License | ~$15K-50K/core/year | $0 |
| IBM APIC License | Retained (no change) | Retained (no change) |
| IBM MQ License | Retained (keep MQ) | Retained (keep MQ) |
| Development effort | Low (repackage) | High (rewrite) |
| Ongoing maintenance | Medium (ACE + APIC) | Low (native + APIC) |
| Infrastructure cost | Higher (large ACE images, more RAM) | Lower (small native images, less RAM) |
| Time to market | Weeks | Months |
| Long-term TCO (3-year) | Higher (ACE license + infra) | Lower (zero ACE license) |

---

## 12. Recommended Approach

**Hybrid strategy (APIC retained, ACE removed):**

1. **Immediately** — Lift & shift all flows into ACE containers (Strategy A) to get off bare-metal/VM
2. **In parallel** — Score all flows using the Decision Matrix (Section 11.3)
3. **Next quarter** — Rewrite the top-scoring flows as native microservices (Strategy B)
4. **For each rewrite** — Update APIC backend URLs to point to new native service (Section 11.4.1)
5. **Over 6-12 months** — Progressively rewrite remaining flows, wave by wave
6. **End state** — APIC (retained) → Native microservices on Kubernetes, zero ACE runtime

```
BEFORE:  Consumer → APIC → ACE Integration Server → Backend Systems
AFTER:   Consumer → APIC → Native Microservice (K8s) → Backend Systems
```

APIC remains the consistent API management layer throughout the entire migration — consumers see no change.
