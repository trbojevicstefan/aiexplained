# AI Explained — Build Progress

`[x]` means implemented in repository code. Runtime/browser QA is tracked separately and is never marked complete unless actually performed.

## Foundation
Status: **implemented in code**
- [x] Next.js + TypeScript foundation, Motion interaction layer and Firebase App Hosting config.
- [x] localStorage lesson progress, generic `LessonShell`, drawer, section jumps, progress HUD and gated quiz pattern.
- [x] reusable `LessonSection`, `DepthSwitch`, `TaskStamp`, `VectorPlot2D`, `AttentionMatrix`, `AgentLoop` and `ToolCallInspector` primitives.
- [x] responsive and reduced-motion support across the lesson system.
- [x] living `AiMascot` design-system primitive with bot/star/briefcase/tile/mail toy variants.
- [x] mascot gaze follows pointer with spring motion, random blinking, breathing, hover/tap reaction and mood states.
- [x] living mascot companion integrated globally into lesson topbar + lesson drawer.
- [x] foundation drawer registry plus advanced-module registry; Modules 1–13 are reachable through the lesson drawer.

## Modules 1–9
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

## Module 10 — What Is an AI Agent?
Status: **content implemented in code**
- [x] chatbot vs workflow vs agent comparison.
- [x] goal, environment, state, actions, tools, memory, planning, autonomy, permissions and policy mental model.
- [x] reusable Observe → Decide → Act → Environment → Result → Update/Stop visual loop.
- [x] tool result re-enters context/state before the next model turn.
- [x] interactive naked-LLM → working-agent builder.
- [x] scheduling-agent lifecycle with read tool, write tool, permission gate and stop decision.
- [x] Module 10 Agent Boss Lab.

## Module 11 — Agent Harness, Framework & Runtime
Status: **content implemented in code**
- [x] model vs harness vs runtime vs framework vs SDK/library distinction.
- [x] prompt/context construction, tool registry/execution, permissions and state management.
- [x] retry/error handling, timeout policy and resumability.
- [x] sandbox, filesystem, shell, browser and code-execution capability boundaries.
- [x] logging/tracing and token/context management.
- [x] checkpoints, approvals and sessions.
- [x] conceptual framework atlas covering agent/tool/message/state/graph/handoff patterns with ecosystem examples.
- [x] Harness Incident Boss Lab.

## Module 12 — Tool Calling
Status: **content implemented in code**
- [x] reusable `ToolCallInspector`: model proposal → validation → execution → result.
- [x] tool definition/name/description/JSON Schema/arguments.
- [x] function calling vs tool calling mental model.
- [x] sequential vs parallel tool calls.
- [x] retries, errors, timeouts and result handling.
- [x] tool descriptions and tool granularity.
- [x] idempotency and retry-safe writes.
- [x] read vs write vs destructive tools and confirmation requirements.
- [x] rate limits and tool reliability.
- [x] common tool-category routing examples.
- [x] Tool Calling Boss Lab.

## Module 13 — MCP & Agent-to-Agent Protocols
Status: **content implemented in code**
- [x] API vs tool vs MCP server distinction.
- [x] MCP host/client/server roles.
- [x] tools/resources/prompts capability discovery.
- [x] local stdio-style vs remote HTTP transport intuition.
- [x] authentication, authorization and local/remote trust boundaries.
- [x] malicious/over-scoped MCP capability scenarios.
- [x] A2A Agent Card/capability discovery.
- [x] remote agent identity and task-scoped authorization.
- [x] task delegation contract with goal/input/constraints/output/task id.
- [x] task-scoped messages and submitted/working/input-required/completed lifecycle.
- [x] returned artifact validation and handoff.
- [x] discovery/marketplace layer vs identity/authorization/contract separation.
- [x] Module 13 Protocol Boss Lab distinguishing API/tool/MCP/A2A boundaries.
- [x] 12-question Module 13 mastery exam, pass threshold 10/12.

## Current advanced routes
- [x] Module 10: `/lessons/agent-foundations`, `/lessons/agent-loop-builder`, `/lessons/module-10-capstone`
- [x] Module 11: `/lessons/harness-framework-runtime`, `/lessons/harness-runtime-lab`, `/lessons/framework-atlas`, `/lessons/module-11-capstone`
- [x] Module 12: `/lessons/tool-calling-lifecycle`, `/lessons/tool-design-safety`, `/lessons/module-12-capstone`
- [x] Module 13: `/lessons/mcp-capability-lab`, `/lessons/a2a-delegation-lab`, `/lessons/module-13-capstone`

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
Build **Module 14 — Memory & State** as a living Memory Palace: context vs memory vs state → short/long/working/episodic/semantic/procedural memory → extraction/normalization/storage/embeddings/retrieval/ranking/injection → consolidation/update/conflict/dedup/decay/deletion → storage backends → ephemeral/session/persistent workflow state → checkpoints/resume/state machine/event-log intuition → Memory Boss Lab.
