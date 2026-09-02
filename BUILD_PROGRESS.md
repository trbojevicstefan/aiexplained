# AI Explained — Build Progress

`[x]` means implemented in repository code. Runtime/browser QA is tracked separately and is never marked complete unless actually performed.

## Foundation
Status: **implemented in code**
- [x] Next.js + TypeScript foundation, Motion interaction layer and Firebase App Hosting config.
- [x] localStorage lesson progress, generic `LessonShell`, drawer, section jumps, progress HUD and gated quiz pattern.
- [x] reusable `LessonSection`, `DepthSwitch`, `TaskStamp`, `VectorPlot2D`, `AttentionMatrix`, `AgentLoop`, `ToolCallInspector`, `MemoryShelf`, `StateMachineViewer`, `QueueVisualizer` and `RouterPlayground` primitives.
- [x] responsive and reduced-motion support across the lesson system.
- [x] living `AiMascot` design-system primitive with bot/star/briefcase/tile/mail toy variants.
- [x] mascot gaze follows pointer with spring motion, random blinking, breathing, hover/tap reaction and mood states.
- [x] living mascot companion integrated globally into lesson topbar + lesson drawer.
- [x] foundation + advanced course registries; Modules 1–16 are reachable through the lesson drawer.

## Modules 1–13
Status: **content implemented in code**
- [x] Module 1 — AI From Absolute Zero + Boss Level.
- [x] Module 2 — Neural Networks Without the Mystery + real toy network + Boss Lab.
- [x] Module 3 — Tokens, tokenizers, embeddings, vector search + Boss Lab.
- [x] Module 4 — Transformers, attention, positions, masks, KV cache, architecture families + Boss Lab.
- [x] Module 5 — Autoregressive generation, sampling, model families, MoE/model routing + Boss Lab.
- [x] Module 6 — Context engineering, prompting, hierarchy, injection + Boss Lab.
- [x] Module 7 — Pretraining, post-training, preference tuning, PEFT/adaptation + Boss Lab.
- [x] Module 8 — Reasoning, search, verification, PRM/ORM, Best-of-N + Boss Lab.
- [x] Module 9 — RAG ingestion, chunking, retrieval/reranking, vector indexes/evals + Boss Lab.
- [x] Module 10 — Agent foundations, real agent loop, permissions/tools/state + Boss Lab.
- [x] Module 11 — Harness/framework/runtime, sandbox/retries/tracing/framework atlas + Boss Lab.
- [x] Module 12 — Tool-call lifecycle, JSON Schema, tool design/reliability/safety + Boss Lab.
- [x] Module 13 — MCP host/client/server + capability discovery + A2A task delegation + Protocol Boss Lab.

## Module 14 — Memory & State
Status: **content implemented in code**
- [x] context vs persistent memory vs execution state vs model weights.
- [x] working, episodic, semantic, procedural and preference memory.
- [x] memory extraction, normalization, provenance, storage, embeddings/retrieval/ranking and context injection.
- [x] memory conflicts, deduplication, consolidation, update, decay and explicit deletion.
- [x] user / agent / entity / shared-memory scopes.
- [x] SQL/vector/Redis/graph/event-log storage mental models.
- [x] reusable animated `MemoryShelf`.
- [x] ephemeral/session/persistent task state.
- [x] state machines, transition events and reusable `StateMachineViewer`.
- [x] checkpoints, crash/resume, durable state, idempotent recovery and snapshot vs event-log intuition.
- [x] Module 14 Memory + State Boss Lab with post-side-effect crash recovery.

## Module 15 — Agent Architecture & Orchestration
Status: **content implemented in code**
- [x] single-agent, supervisor/worker, hierarchical, peer and swarm topology intuition.
- [x] planner/router/supervisor/worker/critic/specialist roles.
- [x] task decomposition and goal decomposition.
- [x] queues, scheduler/dispatch, workers and reusable animated `QueueVisualizer`.
- [x] sequential, parallel and async execution.
- [x] fan-out/fan-in and DAG dependency intuition.
- [x] events, webhooks, Pub/Sub and schedules.
- [x] retries, backoff classifications and dead-letter queues.
- [x] structured agent handoffs, ownership and shared-workspace coordination.
- [x] ReAct, plan-and-execute, reflection and backtracking.
- [x] static vs dynamic agentic workflows.
- [x] infinite-loop, duplicate-work and deadlock prevention.
- [x] debate/voting/verification with shared-error caveat.
- [x] durable orchestration semantics.
- [x] Module 15 Broken Swarm Boss Lab.

## Module 16 — Model Routing & Systems of Models
Status: **content implemented in code**
- [x] reusable `RouterPlayground` with quality/latency/cost/context/modality profiles and living model mascots.
- [x] task/complexity routing.
- [x] hard quality, latency, cost, context, modality and provider constraints.
- [x] rules-based, semantic and learned-router mental models.
- [x] fallback models/providers.
- [x] cascades and escalation thresholds.
- [x] quality/cost/latency frontier.
- [x] explicit internal MoE expert routing vs external model routing distinction.
- [x] ensembles, generator+judge, cascades and specialist composition as distinct systems-of-models patterns.
- [x] correlated-failure/diversity caveat.
- [x] hard policy constraints before soft routing optimization.
- [x] aggregate multi-model cost/latency/quality accounting.
- [x] Module 16 Routing Boss Lab with workload routing and toy quality-cost-latency target.

## Current advanced routes
- [x] Modules 10–13 routes tracked in prior batches.
- [x] Module 14: `/lessons/memory-palace`, `/lessons/state-machine-lab`, `/lessons/module-14-capstone`
- [x] Module 15: `/lessons/orchestration-control-room`, `/lessons/multi-agent-patterns`, `/lessons/module-15-capstone`
- [x] Module 16: `/lessons/model-routing-arena`, `/lessons/model-systems-lab`, `/lessons/module-16-capstone`

## QA / platform work still open
- [ ] Fresh `npm ci` + `npm run typecheck` + `npm run build` on an environment with repository/network access.
- [ ] Browser visual QA across desktop and touch devices.
- [ ] Formal Playwright E2E tests.
- [ ] Firebase Authentication.
- [ ] Firestore cloud progress synchronization.
- [ ] Anonymous → authenticated progress merge.
- [ ] Full visual learning-map/planet view.
- [ ] TokenStream homepage demo.
- [ ] migrate remaining legacy one-off lesson mascots into the canonical `AiMascot` primitive.

## Next batch
Build **Module 17 — Coding, Browser & Computer-Use Agents**: repository/file discovery → code search/AST/dependencies → patch/test/failure-repair/Git verification loop → sandbox/checkpoints; then DOM/selectors/accessibility tree/browser state/cookies/forms/auth/screenshots/visual grounding/mouse-keyboard/coordinate vs DOM actions/action verification/CAPTCHA limitations → integrated coding+browser Boss Lab.
