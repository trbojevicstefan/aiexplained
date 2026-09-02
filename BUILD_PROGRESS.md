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
- [x] foundation + advanced registries; Modules 1–17 are reachable through the lesson drawer.

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

## Current advanced routes
- [x] Modules 10–16 routes tracked in prior batches.
- [x] Module 17: `/lessons/coding-agent-lab`, `/lessons/browser-computer-use-lab`, `/lessons/module-17-capstone`

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
Build **Module 18 — Multimodal AI**: text/image/audio/video representation room → VLM/image understanding → diffusion/noise/denoising/latent/VAE/DiT + conditioning/ControlNet/inpainting/outpainting/image-to-image → ASR/TTS/VAD/diarization/streaming/turn-taking/interruption → real-time voice-agent pipeline → Multimodal Boss Lab.
