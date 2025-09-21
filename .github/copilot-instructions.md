GitHub Copilot

Approved. The Copilot guidance has been aligned with the OpFlow specification and GH-issues workflow. Below is the updated operational guide you can apply to your repository.

Glossary (OpFlow terminology)
- Feature: The top-level capability being implemented (e.g., Jenkins integration, Vault integration).
- Task: A concrete unit of work (implementation, test, or documentation) derived from design artifacts.
- Node: An n8n node (e.g., Jenkins, Vault, Artifactory, AWX, MCP).
- Workflow: Baseline or template workflows used by the platform.
- Contract: API contract or endpoint specification.
- Entity: A data model element defined in data-model.md.
- Endpoint: A concrete API endpoint defined in contracts/.

Updated Instructions for Copilot
1) Prerequisites check
- From the repo root, try to run .specify/scripts/powershell/check-task-prerequisites.ps1 -Json to obtain absolute paths for FEATURE_DIR and AVAILABLE_DOCS.
- If the script is unavailable, fall back to scanning the repository for design artifacts and produce absolute paths for FEATURE_DIR and AVAILABLE_DOCS. 

2) Load design documents
- Always read plan.md or specification.md for tech stack and libraries.
- If present, read data-model.md for entities.
- If contracts/ exists, read API endpoints (contracts/).
- If research.md exists, read technical decisions.
- If quickstart.md exists, read test scenarios.

3) Generate tasks using the base template
- Use .specify/templates/tasks-template.md as the base. 
- Use .github/prompts/tasks.prompt.md for prompts and guidance.
- Tasks should reflect the following categories:
  - Setup tasks: Project init, dependencies, linting
  - Test tasks [P]: One per contract, one per integration scenario
  - Core tasks: One per entity, service, CLI command, endpoint
  - Integration tasks: DB connections, middleware, logging
  - Polish tasks [P]: Unit tests, performance, docs

4) Task generation rules (mapping to OpFlow concepts)
- Each contract file → contract test task marked [P]
- Each entity in data-model → model creation task marked [P]
- Each endpoint → implementation task (sequential if sharing files)
- Each user story → integration test marked [P]
- Different files = parallel [P]
- Same file = sequential (no [P])

5) Order tasks by dependencies
- Setup before everything
- Tests before implementation (TDD)
- Models before services
- Services before endpoints
- Core before integration
- Everything before polish

6) Parallel execution examples
- Group [P] tasks that can run together
- Show actual Task agent commands, for example:
  - Terminal 1: task-agent --task T003 --feature opflow
  - Terminal 2: task-agent --task T004 --feature opflow
  - Terminal 3: task-agent --task T005 --feature opflow

7) Output target: FEATURE_DIR/tasks.md
- Create FEATURE_DIR/tasks.md with:
  - Correct feature name from the implementation plan
  - Numbered tasks (T001, T002, etc.)
  - Clear file paths for each task
  - Dependency notes
  - Parallel execution guidance

Context for task generation: $ARGUMENTS

The tasks.md should be immediately executable. Each task must be specific enough for an LLM to complete without additional context.

8) Tool Usage Guidelines
- Use MCP tools for n8n operations: When working with n8n workflows, nodes, or automation, utilize the n8n-mcp tool suite (e.g., get_node_info, create_workflow, list_workflows) to interact with the n8n instance programmatically.
- Use Context7 for library documentation: For technical questions about libraries, frameworks, or APIs, use mcp_mcp_docker_get-library-docs after resolving library IDs with mcp_mcp_docker_resolve-library-id.
- Use sequential thinking for complex problems: For multi-step analysis, planning, or debugging, employ mcp_mcp_docker_sequentialthinking to break down problems into manageable thought steps with verification.
- Integrate tools with OpFlow workflow: When creating or modifying n8n workflows, use MCP tools to validate node configurations, test workflows, and ensure proper integration with custom OpFlow nodes (Jenkins, Vault, Artifactory, AWX, MCP).