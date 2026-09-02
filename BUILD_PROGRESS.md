# AI Explained — Build Progress

This is the execution log for `BUILD_GUIDE.md`. `[x]` means implemented in repository code. Runtime/browser verification remains separate and is never marked complete unless actually performed.

## Batch 01 — Foundation + Lesson 01
Status: **implemented**
- [x] Next.js + TypeScript application foundation, Motion layer, visual tokens and Firebase App Hosting config.
- [x] localStorage lesson progress, Simple / Real / Expert state, drawer, section jumps, progress HUD and locked quiz engine.
- [x] Responsive/reduced-motion foundation.
- [x] Lesson 01: AI/not-AI, See→Find→Guess, rules-vs-learning, AI X-ray, training loop, probability/temperature, AI/ML/DL reorder, explain-back, locked 6-question quiz.

## Batch 02 — Generic lesson engine + Lesson 02
Status: **implemented in code; local runtime QA pending**
- [x] Generic `LessonShell` with independent lesson id/title/section map and local persistence.
- [x] Reusable `LessonSection`, `DepthSwitch`, `TaskStamp`.
- [x] Lesson 02 `/lessons/ai-vs-software`: RULEY/PIX, rule trace, deterministic repeat, rule explosion, decision boundary, Rules/ML/Hybrid game, draggable hybrid pipeline, debug comparison, anti-hype challenge, explain-back, 7-question gated quiz.

## Batch 03 — Lesson 03: AI / ML / Deep Learning
Status: **implemented in code; local runtime QA pending**
- [x] `/lessons/ai-ml-dl` + drawer/progress map.
- [x] AURA/MILO/DEEP nested worlds.
- [x] Most-specific-level classifier, symbolic/search maze, nearest-neighbor ML, six-floor deep-learning elevator, tradeoff console, reorder hierarchy, myth flips, explain-back, 7-question gated quiz.

## Batch 04 — Lesson 04: Generative vs Predictive AI
Status: **implemented in code; local runtime QA pending**
- [x] `/lessons/generative-vs-predictive` + drawer/progress map.
- [x] PREDI/GENI two-machine workshop.
- [x] Output-shape classifier, next-token conveyor, churn-score sliders, generation controls, same-model/two-output-contract demo, product architecture game, failure sorter, explain-back, 7-question gated quiz.
- [x] Explicitly teach that autoregressive generation can be repeated next-token prediction.

## Batch 05 — Lesson 05: Symbolic AI vs Neural AI
Status: **implemented in code; local runtime QA pending**
- [x] `/lessons/symbolic-vs-neural` + drawer/progress map.
- [x] LOGI/NOVA split glass laboratory.
- [x] Explicit symbolic proof graph, visual neural learner, break/repair symbolic knowledge, poison/repair neural data, trace-vs-activation inspection, tradeoff console, neuro-symbolic pipeline, explain-back, 7-question gated quiz.

---

## Batch 06 — Lesson 06: Training vs Inference

Status: **implemented in code; local runtime QA pending**

### Course navigation
- [x] Add Lesson 06 as available in drawer.
- [x] Create `/lessons/training-vs-inference`.
- [x] Add independent nine-section task/progress map.

### Lesson 06 — Training vs Inference
- [x] Create a distinct two-floor AI factory art direction.
- [x] Add FORGE training-line character and ZIP inference-serving character.
- [x] Activity 01: inspect Training floor and Inference floor with Simple / Real / Expert explanations.
- [x] Explicitly teach core distinction: training changes model parameters; ordinary inference uses a selected checkpoint with weights fixed.
- [x] Activity 02: interactive training conveyor with six labeled examples.
- [x] Expose Forward → Loss → Gradient → Update phases.
- [x] Run multiple training batches with live toy loss and weight changes.
- [x] Require all four phases + six batches before completion.
- [x] Activity 03: one-dimensional optimizer/loss hill.
- [x] Manual parameter slider and repeated optimizer-step control.
- [x] Require learner to move the weight manually, take at least four optimizer steps and reach low loss.
- [x] Explicitly mark the hill as one-dimensional intuition rather than a realistic model parameter space.
- [x] Activity 04: checkpoint/freezer station.
- [x] Require sufficient training before saving model checkpoint `v1.0`.
- [x] Show live changing training model beside frozen/versioned checkpoint.
- [x] Activity 05: inference serving line with five new unseen requests.
- [x] Require all five requests to pass through the frozen checkpoint.
- [x] Visually prove checkpoint weight is unchanged before/after inference requests.
- [x] Activity 06: deliberately enable `UPDATE WEIGHTS AFTER REQUEST` during serving.
- [x] Show serving-weight drift after accidental online-learning-like updates.
- [x] Require at least two accidental updates and recovery from known-good checkpoint.
- [x] Explicitly explain that ordinary inference/context does not imply permanent model-weight learning.
- [x] Distinguish deliberately designed online/continual learning from normal inference.
- [x] Activity 07: training/inference compute economics console.
- [x] Training GPU, batch size and inference replica sliders.
- [x] Live illustrative training compute/time and serving latency/throughput readouts.
- [x] Explicitly label metrics as teaching numbers, not hardware benchmarks.
- [x] Activity 08: draggable controlled ML lifecycle.
- [x] Required order: Collect data → Train/update weights → Evaluate+checkpoint → Deploy frozen version → Run inference → Monitor → Retrain when needed.
- [x] Activity 09: typed Feynman explain-back answering why chatting with a model does not automatically retrain its weights.
- [x] Explain-back validation requires training/update/loss/checkpoint/inference/frozen vocabulary.
- [x] Seven-question final quiz with wrong-answer explanations.
- [x] 6/7 pass threshold.
- [x] Quiz locked behind all 9 sections + 9 tasks.
- [x] Responsive CSS module for factory floors, training belt, loss hill, freezer, serving line, drift recovery, compute console, lifecycle and quiz.
- [x] Reduced-motion fallback.

### Explicitly not complete yet
- [ ] Firebase Authentication.
- [ ] Firestore cloud progress synchronization.
- [ ] Anonymous → authenticated progress merge.
- [ ] Full visual learning-map/planet view.
- [ ] TokenStream homepage demo.
- [ ] Formal E2E/Playwright tests.
- [ ] Local `npm install` / `npm run typecheck` / `npm run build` verification by the user environment.
- [ ] Browser visual QA across desktop + touch devices.
- [ ] Remaining Module 1 lessons.

## Next batch

Build **Lesson 07 — Models, Algorithms and Datasets**. The learner should physically assemble the relationship: data is examples/observations, an algorithm is a procedure, and a model is the learned/fitted artifact used for predictions. Include a “kitchen” analogy but immediately expose its limits, train the same algorithm on two datasets to create two different models, use two algorithms on one dataset to create different models, inspect model files/checkpoints, and force the learner to diagnose which layer changed before the locked quiz.
