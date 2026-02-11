# IBM ACE to Microservices Migration Plan

## 1. Executive Summary

This document outlines the strategy for decomposing monolithic IBM App Connect Enterprise (ACE) applications into containerized microservices. The goal is to move from heavyweight integration server deployments to lightweight, independently deployable, and scalable container-based services.

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
| **API Gateway** | Kong, APIC, or cloud-native gateway |
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
