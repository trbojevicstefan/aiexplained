# AI Explained — Build Progress

`[x]` means implemented in repository code. Runtime/browser QA is tracked separately and is **never** marked complete unless actually performed.

## Foundation
Status: **implemented in code**
- [x] Next.js + TypeScript foundation, Motion interaction layer and Firebase App Hosting config.
- [x] localStorage lesson progress, generic `LessonShell`, drawer, section jumps, progress HUD and gated-quiz pattern.
- [x] reusable `LessonSection`, `DepthSwitch`, `TaskStamp`, `VectorPlot2D`, `AttentionMatrix`, `AgentLoop`, `ToolCallInspector`, `MemoryShelf`, `StateMachineViewer`, `QueueVisualizer`, `RouterPlayground`, `TraceTimeline`, `CodeAgentWorkbench`, `BrowserAgentWorkbench`, `VoicePipeline`, `PermissionGate` and `SandboxBoundary` primitives.
- [x] responsive and reduced-motion support across the lesson system.
- [x] foundation + advanced course registries composed into one lesson drawer.

## Global Visual Polish V2
Status: **implemented in code; local/browser QA still open**
- [x] rebuilt lesson topbar as a stable responsive 3-column layout.
- [x] module-colored progress bar, current module/lesson identity, activity count and quiz-complete indicator.
- [x] mobile chrome progressively removes verbose identity/mascot/progress pieces instead of overflowing.
- [x] `AiMascot` upgraded to premium toy/plastic art direction with shell depth, highlights, ear pods, antenna LED, glossy capsule eyes and ground shadow.
- [x] mascot pupils follow pointer with spring motion; full face subtly tilts toward pointer.
- [x] random blink, breathing, hover lift, click squash/stretch and excited states retained.
- [x] bot/star/briefcase/tile/mail variants share one consistent face DNA.
- [x] reusable `AgentIdentityCard` created for agent/worker name, role, status and activity pulse.
- [x] Coding Agent workbench migrated to living `Patch` identity.
- [x] Browser/Computer-Use workbench migrated to canonical living browser agent.
- [x] Voice pipeline migrated to living `Echo` identity with real-time/barge-in status.
- [x] homepage rebuilt into the same visual world with GUIDE / IDEA / BUILD mascots on a dark interactive stage.
- [x] `AgentLoop` hardened for custom/empty step sets and type-safe CSS variables.
- [x] legacy `/lessons/agent-foundations` and `/lessons/tool-calling-lifecycle` URLs redirect to canonical routes.
- [ ] migrate remaining old lesson-local mascots (for example legacy BYTE in the oldest lesson) after browser QA so we do not destabilize large lesson state files.

## Module 1 — AI From Absolute Zero
- [x] foundations, learning types, scope/uncertainty and Boss Level.

## Module 2 — Neural Networks Without the Mystery
- [x] real toy neural-network engine, forward/backprop, SGD, gradient health, regularization, residuals, CNN/RNN/LSTM/attention and Boss Lab.

## Module 3 — How Language Becomes Numbers
- [x] tokenization/tokenizer families, token IDs, embeddings/vector metrics, semantic search/ANN and Boss Lab.

## Module 4 — Transformers
- [x] Q/K/V, attention, multi-head, positions/RoPE, masks, KV cache, efficient attention, encoder/decoder/cross-attention and Boss Lab.

## Module 5 — How an LLM Produces Text
- [x] seeded autoregressive sampler, logits/softmax/decoding controls, hallucination/reasoning framing, model zoo, MoE/model routing and Boss Lab.

## Module 6 — Context & Prompting
- [x] context budget/overflow/compression/placement/cache, prompting/instruction hierarchy, direct/indirect injection and Boss Lab.

## Module 7 — Training & Post-Training
- [x] pretraining factory, SFT/preferences/RLHF/PPO/DPO/RLAIF, LoRA/QLoRA/PEFT/distillation/merging/continual learning and Boss Lab.

## Module 8 — Reasoning & Test-Time Compute
- [x] planning/search/verification, PRM/ORM, Best-of-N/self-consistency, quality-latency-cost tradeoff and Boss Lab.

## Module 9 — RAG & Knowledge Retrieval
- [x] ingestion/chunking, keyword/semantic/hybrid retrieval, filters/rewrites/HyDE/reranking, HNSW/IVF/evals/migrations and Boss Lab.

## Module 10 — What Is an AI Agent?
- [x] chatbot/workflow/agent distinction.
- [x] full `Agent Loop Builder` restored from placeholder into 9 interactive scenes.
- [x] living `Nova` + `AgentLoop` + `ToolCallInspector` + state/memory + permission/retry controls.
- [x] Agent Boss Lab.

## Module 11 — Harness, Framework & Runtime
- [x] harness/runtime/framework/SDK separation, harness internals, sandbox/retries/tracing/framework atlas and Boss Lab.

## Module 12 — Tool Calling
- [x] tool lifecycle, schemas, selection/arguments/external execution/results, sequential/parallel, tool design/reliability/safety and Boss Lab.

## Module 13 — MCP & Agent-to-Agent Protocols
- [x] MCP host/client/server, tools/resources/prompts, transports/auth/trust.
- [x] A2A identity/capabilities/task/status/artifact delegation.
- [x] Protocol Boss Lab.

## Module 14 — Memory & State
- [x] memory types/extraction/storage/retrieval/injection/conflicts/deletion, state/checkpoints/resume and Boss Lab.

## Module 15 — Agent Architecture & Orchestration
- [x] roles, queues, workers, DAG/events/retries/DLQ/handoffs/multi-agent patterns/failures/durable orchestration and Boss Lab.

## Module 16 — Model Routing & Systems of Models
- [x] routing constraints/fallback/cascade/frontier, ensembles/judges/correlated failures/economics and Boss Lab.

## Module 17 — Coding, Browser & Computer-Use Agents
- [x] code search/context/AST/dependencies/shell/patch/tests/Git verification.
- [x] browser DOM/a11y/visual grounding/sessions/forms/mouse-keyboard/postcondition verification.
- [x] integrated coding + browser Boss Lab and 12-question mastery exam.

## Module 18 — Multimodal AI
- [x] Multimodal Room, Image Generation Lab, Voice Agent Lab and Multimodal Boss Lab registered and available.

## Module 19 — Search, Knowledge Bases & Knowledge Graphs
- [x] Knowledge Search Lab, Knowledge Graph Lab and Boss Lab registered and available.

## Module 20 — AI APIs & Structured Outputs
- [x] API Request Builder, Structured Output Lab and API Boss Lab registered and available.

## Module 21 — Providers & Running Models Locally
- [x] Provider Map, Local Model Garage and Local Model Boss Lab registered and available.

## Module 22 — Inference & AI Infrastructure
- [x] Inference Factory, Scaling & Serving Lab and Infrastructure Boss Lab registered and available.

## Module 23 — Caching & AI Economics
- [x] Cache Lab, AI Cost Challenge and Economics Boss Lab registered and available.

## Module 24 — Evals & Observability
Status: **content implemented in code**
- [x] Evals Lab.
- [x] Observability & Trace Lab.
- [x] Module 24 Trace Detective Boss Lab.
- [x] production incident with wrong retrieved policy and fluent-but-wrong generation.
- [x] trace-span diagnosis using `TraceTimeline`.
- [x] eval-suite design: golden, adversarial, agent/tool and efficiency evals.
- [x] human vs LLM vs pairwise evaluation choices.
- [x] live precision/recall/F1 threshold lab.
- [x] retrieval vs groundedness vs citation failure diagnosis.
- [x] telemetry keep/redact/drop privacy decisions.
- [x] quality/groundedness/latency regression gate.
- [x] controlled before/after replay.
- [x] 12-question mastery exam, pass threshold 10/12.
- [x] Module 24 Boss Lab marked `available` in drawer.

## Module 25 — Security, Guardrails & Permissions
Status: **content implemented in code**
- [x] reusable living `PermissionGate` with low/medium/high/critical risk and allow/deny/approval decisions.
- [x] reusable `SandboxBoundary` showing network/filesystem/command/resource containment.
- [x] Security Red-Team Control Room.
- [x] agent attack-surface mapping: prompts, retrieval, tools, memory, credentials and MCP/capability servers.
- [x] direct vs indirect prompt-injection trust-boundary exercises.
- [x] defensive data-exfiltration/credential-leakage boundary exercise.
- [x] RAG, memory, tool and MCP poisoning diagnosis.
- [x] excessive-agency / least-privilege capability reduction.
- [x] destructive-action approval and permission-gate exercise.
- [x] PII/secret keep/redact/drop exercise.
- [x] threat-model builder: identity, asset, entry point, trust boundary, impact and control.
- [x] Guardrails & Sandbox Lab.
- [x] input/output/schema/tool guardrails.
- [x] step/cost/rate limits.
- [x] network/filesystem/command sandbox configuration.
- [x] command/capability allowlist decisions.
- [x] human-in-the-loop placement by consequence.
- [x] Security Escape Room Boss Lab: repair injection trust, poisoned memory/knowledge, permissions, secrets, sandbox, runtime budgets, approvals and audit evidence.
- [x] 12-question Module 25 mastery exam, pass threshold 10/12.
- [x] complete Module 25 registered and available in drawer.

## Navigation / Registry Reconciliation
- [x] fixed Module 10 canonical lesson id/slug to `what-is-an-agent` / `/lessons/what-is-an-agent`.
- [x] fixed Module 12 canonical lesson id/slug to `tool-call-lifecycle` / `/lessons/tool-call-lifecycle`.
- [x] Modules 18–25 now registered so `LessonShell` receives correct module identity/accent instead of silently falling back to Foundations.

## QA / platform work still open
- [ ] Fresh `npm ci` + `npm run typecheck` + `npm run build` on an environment with repository/network access.
- [ ] Browser visual QA across desktop and touch devices.
- [ ] Formal Playwright E2E tests.
- [ ] Firebase Authentication.
- [ ] Firestore cloud progress synchronization.
- [ ] Anonymous → authenticated progress merge.
- [ ] Full visual learning-map/planet view.
- [ ] TokenStream homepage demo.
- [ ] continue page-by-page visual QA and migrate remaining legacy lesson-local mascot implementations.

## Next batch
Continue the visual consistency sweep from the oldest lessons, then build **Module 26 — Reliability & Production Agent Operations**: retries/backoff/timeouts/circuit breakers/fallbacks/idempotency/error classification/partial failures/graceful degradation/durable jobs/checkpoints/recovery/approval escalation and a production-incident Boss Lab.
