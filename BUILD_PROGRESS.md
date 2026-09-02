# AI Explained — Build Progress

This is the execution log for `BUILD_GUIDE.md`. `[x]` means implemented in repository code. Runtime/browser verification remains separate and is never marked complete unless actually performed.

## Batch 01 — Foundation + Lesson 01
Status: **implemented**
- [x] Next.js + TypeScript foundation, Motion layer, visual tokens and Firebase App Hosting config.
- [x] localStorage lesson progress, Simple / Real / Expert state, drawer, section jumps, progress HUD and locked quiz engine.
- [x] Responsive/reduced-motion foundation.
- [x] Lesson 01: AI/not-AI, See→Find→Guess, rules-vs-learning, AI X-ray, training loop, probability/temperature, AI/ML/DL reorder, explain-back, gated quiz.

## Batch 02 — Generic lesson engine + Lesson 02
Status: **implemented in code; local runtime QA pending**
- [x] Generic `LessonShell` and independent per-lesson progress.
- [x] Reusable `LessonSection`, `DepthSwitch`, `TaskStamp` primitives.
- [x] Lesson 02 `/lessons/ai-vs-software`: rule trace, deterministic repeat, rule explosion, decision boundary, Rules/ML/Hybrid game, draggable hybrid pipeline, debugging comparison, anti-hype challenge, explain-back and gated quiz.

## Batch 03 — Lesson 03: AI / ML / Deep Learning
Status: **implemented in code; local runtime QA pending**
- [x] `/lessons/ai-ml-dl`, AURA/MILO/DEEP nested worlds, scope classifier, symbolic maze, nearest-neighbor lab, layer elevator, tradeoffs, hierarchy reorder, myths, explain-back and gated quiz.

## Batch 04 — Lesson 04: Generative vs Predictive AI
Status: **implemented in code; local runtime QA pending**
- [x] `/lessons/generative-vs-predictive`, PREDI/GENI workshop, output-shape classifier, next-token conveyor, predictive score sliders, generator controls, same-model output contracts, product architecture, failure sorter, explain-back and gated quiz.
- [x] Explicitly teach that autoregressive generation can be repeated next-token prediction.

## Batch 05 — Lesson 05: Symbolic vs Neural AI
Status: **implemented in code; local runtime QA pending**
- [x] `/lessons/symbolic-vs-neural`, LOGI/NOVA lab, explicit proof graph, visual neural learner, break/repair symbolic knowledge, poison/repair neural data, trace-vs-activation inspection, tradeoffs, neuro-symbolic pipeline, explain-back and gated quiz.

## Batch 06 — Lesson 06: Training vs Inference
Status: **implemented in code; local runtime QA pending**
- [x] `/lessons/training-vs-inference`, FORGE/ZIP two-floor factory.
- [x] Forward → Loss → Gradient → Update training line.
- [x] Loss hill / optimizer-step interaction.
- [x] Freeze checkpoint `v1.0` and serve five new inference requests without changing weights.
- [x] Deliberately enable update-on-request, demonstrate serving drift, then recover checkpoint.
- [x] Training-vs-serving compute console.
- [x] Controlled lifecycle reorder and explain-back.
- [x] Seven-question quiz, pass 6/7, gated behind all 9 sections + 9 tasks.

---

## Batch 07 — Lesson 07: Models, Algorithms and Datasets
Status: **implemented in code; local runtime QA pending**

### Course/navigation
- [x] Add Lesson 07 as available in course drawer.
- [x] Create `/lessons/models-algorithms-data`.
- [x] Add independent nine-section task/progress map.
- [x] Add visible Simple / Real / Expert depth switch to Lesson 07 hero.

### Lesson 07 interactions
- [x] Create fresh workshop visual language with DOT (dataset), LOOP (algorithm) and MOD (model) characters.
- [x] Activity 01: inspect data, algorithm and model as physically distinct objects/roles.
- [x] Activity 02: draggable pipeline `Dataset → Training algorithm → Learned model → New input → Prediction`.
- [x] Explicitly separate training-time model creation from inference-time model use.
- [x] Activity 03: train the same conceptual linear algorithm on City vs Suburb housing datasets.
- [x] Show two different fitted coefficient sets and different 80m² predictions from the same procedure.
- [x] Activity 04: train two different algorithms on the same conceptual customer dataset.
- [x] Compare smooth linear/logistic score with decision-tree piecewise rule structure.
- [x] Activity 05: classify six realistic artifacts/files as Data / Algorithm / Model.
- [x] Cover CSV/image examples, training procedure code and saved model/checkpoint artifacts.
- [x] Activity 06: deliberately add a bad outlier to a tiny dataset and watch fitted prediction shift.
- [x] Require learner to verify/clean the row and see model behavior recover.
- [x] Activity 07: six-scenario diagnostic game requiring exact layer diagnosis — data, algorithm/procedure or model artifact.
- [x] Activity 08: kitchen analogy `ingredients ≈ data`, `recipe ≈ algorithm`, `dish ≈ model`.
- [x] Immediately require learner to reveal three technical limits of the analogy.
- [x] Activity 09: typed Feynman explain-back requiring evidence/procedure/fitted-artifact vocabulary.
- [x] Seven-question final quiz with explanations.
- [x] 6/7 pass threshold.
- [x] Quiz locked behind all 9 sections + 9 tasks.
- [x] Responsive CSS module and reduced-motion fallback.

### Cross-lesson compile-safety maintenance
- [x] Mark lesson `page.tsx` routes 01–07 as client boundaries where they pass the `(progress) => ...` render prop into client `LessonShell`.
- [x] Avoid Server Component → Client Component function-prop serialization failure in the lesson route pattern.

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

Build **Lesson 08 — Parameters vs Hyperparameters**. The signature interaction should open a model control room where learned parameters visibly change during training while hyperparameters remain user/developer-selected controls that shape training or model behavior. Learners should deliberately set a terrible learning rate, watch optimization fail, tune it, compare model parameters before/after training, and finish with a classification/diagnosis challenge before the locked quiz.
