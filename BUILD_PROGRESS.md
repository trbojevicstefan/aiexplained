# AI Explained — Build Progress

`[x]` means implemented in repository code. Runtime/browser QA is tracked separately and is never marked complete unless actually performed.

## Foundation
Status: **implemented in code**
- [x] Next.js + TypeScript foundation, Motion interaction layer and Firebase App Hosting config.
- [x] localStorage lesson progress, generic `LessonShell`, drawer, section jumps, progress HUD and gated quiz pattern.
- [x] reusable `LessonSection`, `DepthSwitch`, `TaskStamp`, `VectorPlot2D` and `AttentionMatrix` primitives.
- [x] responsive and reduced-motion support across the lesson system.
- [x] living `AiMascot` design-system primitive with bot/star/briefcase/tile/mail toy variants.
- [x] mascot gaze follows pointer with spring motion, random blinking, breathing, hover/tap reaction and mood states.
- [x] living mascot companion integrated globally into lesson topbar + lesson drawer.
- [x] course drawer synchronized with all built Module 1–7 routes.

## Modules 1–6
Status: **content implemented in code**
- [x] Module 1 foundations + Boss Level.
- [x] Module 2 real toy neural-network curriculum + Boss Lab.
- [x] Module 3 tokenization/embeddings/vector-search curriculum + Boss Lab.
- [x] Module 4 transformer/attention curriculum + Boss Lab.
- [x] Module 5 LLM generation/sampling/model-zoo/routing curriculum + Boss Lab.
- [x] Module 6 context/prompting/instruction-hierarchy/security curriculum + Boss Lab.

## Module 7 — Training & Post-Training
Status: **content implemented in code**
- [x] Pretraining corpus construction, filtering, data quality and deduplication.
- [x] evaluation/benchmark contamination detection.
- [x] synthetic-data mix intuition and quality caveats.
- [x] next-token cross-entropy objective.
- [x] backpropagation at distributed-cluster scale.
- [x] data, tensor, pipeline and model-parallelism distinctions.
- [x] checkpoint save/failure/recovery flow.
- [x] base pretrained behavior vs SFT behavior.
- [x] instruction-tuning demonstration data.
- [x] chosen/rejected preference-pair construction.
- [x] reward-model scoring intuition and reward-hacking caveat.
- [x] PPO-style RLHF reward-vs-policy-drift/KL intuition.
- [x] DPO chosen-vs-rejected relative-likelihood intuition.
- [x] RLAIF and Constitutional AI critique/revision principles.
- [x] comparison game choosing SFT vs DPO vs PPO vs RLAIF by supervision type.
- [x] full fine-tuning vs parameter-efficient fine-tuning.
- [x] LoRA low-rank A/B update and rank/parameter-count slider.
- [x] QLoRA quantized frozen base + trainable LoRA stack.
- [x] adapter/domain fine-tuning intuition.
- [x] teacher/student knowledge distillation.
- [x] model-merging trade-off and interference warning.
- [x] continual learning + catastrophic forgetting simulation.
- [x] quantization-aware training intuition.
- [x] Module 7 end-to-end Training Control Room Boss Lab.
- [x] 12-question Module 7 mastery exam, pass threshold 10/12.

## Current Module 7 routes
- [x] `/lessons/pretraining-factory`
- [x] `/lessons/posttraining-arena`
- [x] `/lessons/efficient-adaptation`
- [x] `/lessons/module-7-capstone`

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
Build **Module 8 — Reasoning & Test-Time Compute**: compare instant answer vs deliberate planning vs generator+verifier; expose reasoning/test-time-compute budgets, search trees, verification/self-correction, PRM/ORM intuition, Best-of-N and self-consistency, and quality/latency/cost trade-offs before the locked mastery exam.
