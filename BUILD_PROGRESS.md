# AI Explained — Build Progress

`[x]` means implemented in repository code. Runtime/browser QA is tracked separately and is never marked complete unless actually performed.

## Foundation
Status: **implemented in code**
- [x] Next.js + TypeScript foundation, Motion interaction layer and Firebase App Hosting config.
- [x] localStorage lesson progress, generic `LessonShell`, drawer, section jumps, progress HUD and gated quiz pattern.
- [x] reusable `LessonSection`, `DepthSwitch`, `TaskStamp`, `VectorPlot2D` and `AttentionMatrix` primitives.
- [x] responsive and reduced-motion support across the lesson system.
- [x] living `AiMascot` design-system primitive with bot/star/briefcase/tile/mail toy variants.
- [x] mascot gaze follows pointer with spring motion, plus random blinking, breathing, hover/tap reaction and mood states.
- [x] living mascot companion integrated globally into lesson topbar + lesson drawer.
- [x] course drawer synchronized with all built Module 1–6 routes.

## Modules 1–5
Status: **content implemented in code**
- [x] Module 1 foundations + Boss Level.
- [x] Module 2 real toy neural-network curriculum + Boss Lab.
- [x] Module 3 tokenization/embeddings/vector-search curriculum + Boss Lab.
- [x] Module 4 transformer/attention curriculum + Boss Lab.
- [x] Module 5 LLM generation/sampling/model-zoo/routing curriculum + Boss Lab.

## Module 6 — Context & Prompting
Status: **content implemented in code**
- [x] context vs weights vs persistent application memory.
- [x] system instructions, user messages, history, documents and tool results inside context.
- [x] real toy-token counting using the existing tokenizer lab.
- [x] context-window budget and deliberate overflow.
- [x] truncation vs summarization/compression vs relevance selection.
- [x] context prioritization / evidence-per-token mental model.
- [x] lost-in-the-middle failure intuition and context placement.
- [x] long-context capacity vs effective-use/latency/cost distinction.
- [x] prompt/prefix cache vs application/context cache vs KV cache.
- [x] prompt engineering vs broader context engineering.
- [x] simplified instruction hierarchy across system/developer/user and untrusted tool/document data.
- [x] zero-shot, one-shot and few-shot in-context examples.
- [x] persona/role, constraints and delimiters.
- [x] structured-output schema + validation intuition.
- [x] planning, critique/reflection and self-consistency patterns with cost/reliability caveats.
- [x] direct prompt injection defense mental model.
- [x] indirect prompt injection through retrieved/tool content and trust-boundary reasoning.
- [x] prompt/system leakage scenario.
- [x] Module 6 Context Incident Boss Lab: repair budget, hierarchy, evidence, placement, injection, output schema and cache selection.
- [x] 12-question Module 6 mastery exam, pass threshold 10/12.

## Current Module 6 routes
- [x] `/lessons/context-backpack`
- [x] `/lessons/prompting-instruction-hierarchy`
- [x] `/lessons/module-6-capstone`

## QA / platform work still open
- [ ] Fresh `npm ci` + `npm run typecheck` + `npm run build` on an environment with repository/network access.
- [ ] Browser visual QA across desktop and touch devices.
- [ ] Formal Playwright E2E tests.
- [ ] Firebase Authentication.
- [ ] Firestore cloud progress synchronization.
- [ ] Anonymous → authenticated progress merge.
- [ ] Full visual learning-map/planet view.
- [ ] TokenStream homepage demo.
- [ ] migrate remaining legacy one-off lesson mascots into the new canonical `AiMascot` primitive.

## Next batch
Build **Module 7 — Training & Post-Training**: pretraining data factory → distributed training → checkpoints; then SFT/instruction tuning → preferences/RLHF/PPO/DPO/RLAIF/Constitutional AI; then LoRA/QLoRA/PEFT/adapters, distillation, model merging, continual learning/catastrophic forgetting and quantization-aware training before the module Boss Lab.
