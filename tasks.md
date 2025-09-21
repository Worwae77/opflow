# OpFlow Implementation Tasks

## Feature Overview

**Feature Name:** OpFlow - n8n-based DevOps Automation Platform

**Description:** Build a low-code automation platform using n8n to streamline DevOps tasks with governance and compliance.

**Tech Stack:** n8n (self-hosted), Docker/K8s, PostgreSQL, Keycloak SSO, Custom n8n nodes (Jenkins, Vault, JFrog, AWX, MCP), Git versioning.

**Available Docs:** specification.md (executive summary, requirements, roadmap).

**Dependencies:** None (greenfield project).

**Estimated Effort:** 4-6 weeks for MVP.

## Task Execution Guidelines

- Tasks are numbered sequentially (T001, T002, etc.) with dependencies noted.
- [P] indicates parallelizable tasks (different files/services).
- Use TDD: Write tests before implementation where possible.
- Each task includes specific file paths and acceptance criteria.
- Run tests after each task: `npx jest --coverage`.
- Commit to `dev` branch after completing dependent tasks.

## Core Principles

- Follow the dependency order: Setup -> Tests -> Models -> Services -> Endpoints -> Core -> Integration -> Polish.
- Use design docs as the source of truth for file paths and responsibilities.
- Ensure no credentials are stored in the repo; use templates for secrets.

## Tasks

### Setup Phase (Related to GH Issue #1: Implement Core Platform Setup)

**T001: Project Initialization**  
Description: Set up project structure, dependencies, and basic configuration.

Files:
- `package.json` (add n8n, jest, TypeScript, and related deps)
- `tsconfig.json` (TypeScript config)
- `jest.config.js` (testing setup)
- `docker-compose.yml` (n8n + PostgreSQL + Keycloak)

Dependencies: None

Acceptance Criteria:
- `npm install` succeeds.
- `npx tsc --noEmit` passes.
- Docker services start: `docker-compose up`.

Effort: 2h

**T002: Environment Configuration**  
Description: Configure secure environment variables and templates.

Files:
- `.env.example` (update with all placeholders)
- `docker-compose.test.yml` (test environment)

Dependencies: T001

Acceptance Criteria:
- All required env vars documented.
- No sensitive values in repo.
- Test env spins up without errors.

Effort: 1h

### Core Implementation Phase (TDD) (Related to GH Issue #2: Implement Custom Nodes)

**T003: Jenkins Custom Node Implementation**  
Description: Create Jenkins n8n node with build and status operations.

Files:
- `nodes/Jenkins/Jenkins.node.ts` (node class, operations)
- `nodes/Jenkins/Jenkins.credentials.ts` (auth)
- `nodes/__tests__/Jenkins.test.ts` (unit tests)

Dependencies: T002

Acceptance Criteria:
- Node registers in n8n.
- Build job triggers successfully (mocked).
- 80% test coverage.

Effort: 4h

**T004: Vault Custom Node Implementation [P]**  
Description: Create HashiCorp Vault n8n node for secret operations.

Files:
- `nodes/Vault/Vault.node.ts` (read/write/delete/rotate)
- `nodes/Vault/Vault.credentials.ts` (token auth)
- `nodes/__tests__/Vault.test.ts` (unit tests)

Dependencies: T002 (parallel with T003)

Acceptance Criteria:
- Secret read/write works (mocked Vault).
- Error handling for invalid paths.
- 80% test coverage.

Effort: 4h

**T005: JFrog Artifactory Node [P]**  
Description: Implement Artifactory node for artifact management.

Files:
- `nodes/Artifactory/Artifactory.node.ts`  
- `nodes/Artifactory/Artifactory.credentials.ts`  
- `nodes/__tests__/Artifactory.test.ts`  

Dependencies: T002 (parallel with T003/T004)

Acceptance Criteria:
- Upload/download artifact operations.
- Auth with username/password or API key.
- Unit tests for core ops.

Effort: 3h

**T006: Ansible AWX Node [P]**  
Description: Create AWX node for playbook execution.

Files:
- `nodes/AWX/AWX.node.ts`  
- `nodes/AWX/AWX.credentials.ts`  
- `nodes/__tests__/AWX.test.ts`  

Dependencies: T002 (parallel)  

Acceptance Criteria:
- Trigger playbook runs.
- Monitor job status.
- Credential security.

Effort: 3h

**T007: MCP Node Implementation [P]**  
Description: Add Model Context Protocol node for AI integrations.

Files:
- `nodes/MCP/MCP.node.ts`  
- `nodes/MCP/MCP.credentials.ts`  
- `nodes/__tests__/MCP.test.ts`  

Dependencies: T002 (parallel)  

Acceptance Criteria:
- Basic MCP server interactions.
- Future-proof for AI agents.
- Unit tests.

Effort: 2h

### Integration Phase (After Core Nodes) (Related to GH Issue #1: Implement Core Platform Setup)

**T008: Database Integration**  
Description: Set up PostgreSQL schema for audit logs and workflow state.

Files:
- `database/schema.sql` (tables for logs, workflows)
- `docker-compose.yml` (update with persistent volumes)

Dependencies: T001-T002

Acceptance Criteria:
- Tables created on startup.
- Connection tested via n8n.

Effort: 2h

**T009: Keycloak SSO Integration**  
Description: Configure authentication with Keycloak.

Files:
- `n8n/config/auth.js` (SSO setup)
- `.env.example` (Keycloak vars)

Dependencies: T008

Acceptance Criteria:
- Login via Keycloak works.
- RBAC roles mapped.

Effort: 3h

### Governance Phase (Related to GH Issue #4: Implement Governance Features)

**T010: Workflow Templates**  
Description: Create baseline workflows for key use cases.

Files:
- `workflows/developer-onboarding.json`
- `workflows/secret-rotation.json`
- `workflows/temporary-access.json`
- `workflows/jenkins-agent.json`
- `workflows/notifications.json`

Dependencies: T003-T007, T009

Acceptance Criteria:
- Workflows import into n8n.
- Approval gates included.
- Node integrations tested.

Effort: 6h

**T011: RBAC and Approvals**  
Description: Implement role-based access and approval workflows.

Files:
- `middleware/rbac.js` (permission checks)
- `workflows/approval-gate.json`  

Dependencies: T009, T010

Acceptance Criteria:
- Unauthorized access blocked.
- Approvals trigger notifications.

Effort: 4h

**T012: Audit Logging**  
Description: Add comprehensive logging for compliance.

Files:
- `middleware/logger.js`  
- `database/audit-schema.sql` (update)  

Dependencies: T008, T011  

Acceptance Criteria:
- All actions logged to DB.  
- Logs queryable.  

Effort: 2h  

**T013: Git Versioning for Workflows**  
Description: Set up Git integration for workflow changes.

Files:
- `.github/workflows/version-workflows.yml` (CI)  
- `scripts/version-workflow.js`  

Dependencies: T010, T012  

Acceptance Criteria:
- Workflow changes committed automatically.  
- Rollback possible.  

Effort: 3h  

### Testing and Polish Phase [P] (Related to GH Issue #5: Complete Test Implementation)

**T014: Unit Test Coverage [P]**  
Description: Ensure 80% coverage across all nodes and services.

Files:
- Update all `nodes/__tests__/*.test.ts`  

Dependencies: T003-T007  

Acceptance Criteria:
- `npx jest --coverage` shows >=80%.  
- Edge cases covered.  

Effort: 4h (parallel review)  

**T015: Integration Tests [P]**  
Description: Test end-to-end workflows with mocks.

Files:
- `tests/integration/workflows.test.ts`  

Dependencies: T010  

Acceptance Criteria:
- Workflows execute without errors.  
- Mock external services.  

Effort: 3h  

**T016: Performance Tests**  
Description: Benchmark workflow execution times.

Files:
- `tests/performance/load.test.js` (using Artillery/JMeter)  

Dependencies: T015  

Acceptance Criteria:
- Response times < 5s for core ops.  
- Report generated.  

Effort: 2h  

**T017: Documentation and Polish [P]**  
Description: Add README, API docs, and cleanup.

Files:
- `README.md` (setup, usage)  
- `docs/api.md`  
- Code linting fixes  

Dependencies: All previous  

Acceptance Criteria:
- Project builds cleanly.  
- Docs cover MVP features.  

Effort: 2h  

## Completion Checklist

- [ ] All tasks completed and tested
- [ ] Coverage >=80%
- [ ] Docker environment functional
- [ ] Workflows imported and runnable
- [ ] Security scan passes (no secrets)

## Next Steps After MVP

- Phase 2: AI Agent Node
- Phase 3: Self-service portal

Generated on: September 21, 2025
