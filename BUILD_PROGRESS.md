# AI Explained — Build Progress

`[x]` means implemented in repository code. Runtime/browser QA is tracked separately and is never marked complete unless actually performed.

## Foundation
Status: **implemented in code**
- [x] Next.js + TypeScript foundation, Motion interaction layer and Firebase App Hosting config.
- [x] localStorage lesson progress, generic `LessonShell`, drawer, section jumps, progress HUD and gated quiz pattern.
- [x] reusable `LessonSection`, `DepthSwitch`, `TaskStamp`, `VectorPlot2D`, `AttentionMatrix`, `AgentLoop`, `ToolCallInspector`, `MemoryShelf`, `StateMachineViewer`, `QueueVisualizer`, `RouterPlayground`, `CodeAgentWorkbench` and `BrowserAgentWorkbench` primitives.
- [x] responsive and reduced-motion support across the lesson system.
- [x] living `AiMascot` toy-character system with pointer-following eyes, random blinking, breathing, hover/tap reaction and mood states.
- [x] mascot companion integrated globally into topbar/drawer and specialist mascots used inside lessons.
- [x] foundation + advanced registries composed into one lesson drawer.

## Global Visual Polish V2
Status: **implemented in code; browser QA still open**
- [x] rebuilt lesson topbar as a stable responsive 3-column layout instead of the old fragile `1fr / auto / 1fr` chrome.
- [x] module-colored progress bar, current lesson identity, activity counter and quiz-complete indicator in the global topbar.
- [x] mobile topbar progressively collapses lesson identity, mascot and verbose progress instead of overflowing.
- [x] `AiMascot` upgraded with stronger plastic/toy depth, shell highlights, ear pods, antenna LED, glossy capsule eyes, ground shadow and shared face language across bot/star/briefcase/tile/mail variants.
- [x] mascot pupils follow pointer with springs and the full face subtly tilts toward pointer; blink, breathing, hover, tap and excited states remain available.
- [x] reusable `AgentIdentityCard` added for consistent living agent/worker presentation with role/status/activity pulse.
- [x] Coding Agent workbench migrated to `AgentIdentityCard` and invalid legacy mascot mood removed.
- [x] Browser/Computer-Use workbench migrated to canonical living bot status instead of flat/legacy agent treatment.
- [x] Voice pipeline migrated to a living `Echo` voice-agent identity card with real-time/barge-in status.
- [x] homepage moved into the same art direction with a dark mascot stage, living GUIDE/IDEA/BUILD characters and interactive gaze.
- [x] `AgentLoop` primitive hardened for empty/custom step sets and type-safe CSS variables.
- [x] legacy `/lessons/agent-foundations` and `/lessons/tool-calling-lifecycle` URLs redirect to the canonical routes.

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

## Modules 14–16
Status: **content implemented in code**
- [x] Module 14 — Memory & State: MemoryShelf, extraction/storage/retrieval/injection/conflicts/deletion, state machines/checkpoints/crash recovery + Boss Lab.
- [x] Module 15 — Agent Architecture & Orchestration: QueueVisualizer, roles/queues/DAG/events/retries/DLQ/handoffs/multi-agent failures/durable orchestration + Boss Lab.
- [x] Module 16 — Model Routing & Systems of Models: RouterPlayground, constraints/fallback/cascade/frontier, ensembles/judges/correlated failures/economics + Boss Lab.

## Module 17 — Coding, Browser & Computer-Use Agents
Status: **content implemented in code**
- [x] reusable animated `CodeAgentWorkbench` with file tree, editor, run timeline and test state.
- [x] repository context selection, file discovery and code search/reference/test search.
- [x] AST node intuition and import/dependency graph.
- [x] constrained shell/sandbox command policy.
- [x] scoped patch editing.
- [x] test execution, assertion failure reading and iterative repair loop.
- [x] planning/run checkpoints.
- [x] Git diff/status/commit/PR verification mental model.
- [x] reusable `BrowserAgentWorkbench` with rendered-page, DOM-tree and accessibility-tree views.
- [x] DOM/CSS selectors and semantic target grounding.
- [x] accessibility roles/names/status grounding.
- [x] browser cookies/session/profile/authentication-state handling.
- [x] forms and authentication workflow.
- [x] screenshot/visual grounding vs semantic DOM interaction.
- [x] mouse, drag and keyboard action categories.
- [x] coordinate clicking vs DOM/accessibility targeting trade-off.
- [x] post-action/postcondition verification.
- [x] CAPTCHA / site-policy / anti-bot boundary handling.
- [x] integrated coding + browser Boss Lab: repo fix → unit test → sandbox → browser grounding → UI postcondition → Git artifact.
- [x] 12-question Module 17 mastery exam, pass threshold 10/12.

## Advanced Registry Reconciliation
Status: **navigation reconciled with routes already present in the repository**
- [x] fixed Module 10 canonical lesson id/slug to `what-is-an-agent` / `/lessons/what-is-an-agent`.
- [x] fixed Module 12 canonical lesson id/slug to `tool-call-lifecycle` / `/lessons/tool-call-lifecycle`.
- [x] Module 18 registered: Multimodal Room, Image Generation Lab, Voice Agent Lab, Multimodal Boss Lab.
- [x] Module 19 registered: Knowledge/Search Lab, Knowledge Graph Lab, Knowledge Boss Lab.
- [x] Module 20 registered: AI API Request Builder, Structured Output Lab, API Boss Lab.
- [x] Module 21 registered: Model Provider Map, Local Model Garage, Local Model Boss Lab.
- [x] Module 22 registered: Inference Factory, Scaling & Serving Lab, Infrastructure Boss Lab.
- [x] Module 23 registered: Cache Lab, AI Cost Challenge, Economics Boss Lab.
- [x] Module 24 registered with existing Evals Lab and Observability/Trace Lab.
- [ ] Module 24 Boss Lab route/content still needs to be built; drawer intentionally shows it as `planned`.

## Agent Loop Builder Repair
- [x] removed the temporary placeholder that said interactive content was not built.
- [x] implemented 9 interactive scenes: naked-model contrast, agent assembly, observe/context rack, tool decision, tool-call execution x-ray, result reinjection, state-vs-memory classification, approval/retry policy and explain-back.
- [x] integrated living `Nova` agent identity + `AgentLoop` + `ToolCallInspector`.
- [x] quiz remains locked until all nine sections and nine activities are complete; pass threshold 7/8.

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
- [ ] continue page-by-page layout QA for old lesson-local hero/agent implementations after user local feedback.

## Next batch
Continue the **visual consistency sweep first**, then build the missing **Module 24 Evals & Observability Boss Lab**. After that continue Build Guide Module 25 — Security, Guardrails & Permissions.
