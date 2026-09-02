# AI Explained — Build Progress

This file is the execution log for `BUILD_GUIDE.md`. Items are marked only when implemented in code, not when merely planned.

## Batch 01 — Foundation + Lesson 01

Status: **implemented**

### Foundation

- [x] Initialize Next.js TypeScript project.
- [x] Configure absolute imports.
- [x] Establish the first production visual system and design tokens.
- [x] Configure Motion for gesture, entrance, state and continuous animation patterns.
- [x] Configure Firebase App Hosting runtime file.
- [x] Create anonymous/local progress persistence before sign-in.
- [x] Build reusable `Simple / Real / Expert` depth switch.
- [x] Persist explanation depth with lesson progress.
- [x] Build reusable `LessonShell`.
- [x] Build lesson/progress drawer.
- [x] Build section jump navigation.
- [x] Build lesson progress HUD and lesson trail.
- [x] Build per-section visited state.
- [x] Build per-activity completion state.
- [x] Build quiz gating: quiz remains locked until every section is visited and every required activity is complete.
- [x] Build quiz engine v1 with explanations for wrong answers, retries, best score and persistent completion.
- [x] Add responsive layouts.
- [x] Add `prefers-reduced-motion` fallback.

### Lesson 01 — What is Artificial Intelligence?

- [x] Cold open: classify six everyday systems as AI / not AI.
- [x] Immediate misconception feedback for every classification.
- [x] Interactive `See → Find → Guess` drag exercise.
- [x] Explain rules-based software vs learned behavior.
- [x] Drag/tap six examples into a tiny learner and train it.
- [x] Reveal inference on a new example after training.
- [x] Seven-layer AI X-ray: Experience → System → Model → Network Layers → Weights → Math → Data/Training.
- [x] Simple / Real / Expert copy for every X-ray layer.
- [x] Interactive training loop with epochs, loss, mistakes and confidence.
- [x] Require user to reach 8+ epochs and freeze/checkpoint the model.
- [x] Interactive inference probability playground.
- [x] Temperature slider changes output distribution.
- [x] Require at least three output samples.
- [x] Draggable AI → Machine Learning → Deep Learning family-tree challenge.
- [x] Clarify that not all AI is machine learning.
- [x] Typed explain-back / Feynman exercise.
- [x] Validate the explain-back response against minimum detail and core mechanism vocabulary.
- [x] Six-question end-of-lesson quiz.
- [x] 5/6 pass threshold.
- [x] Locked quiz until all 8 sections + all 8 activities are complete.
- [x] Lesson mastery celebration.

---

## Batch 02 — Generic lesson engine + Lesson 02

Status: **implemented in code; local runtime QA pending**

### Lesson engine refactor

- [x] Refactor `LessonShell` from a hard-coded Lesson 01 shell into a reusable multi-lesson shell.
- [x] `LessonShell` now accepts `lessonId`, `lessonTitle` and a lesson-specific section/task map.
- [x] Progress calculation is now lesson-specific.
- [x] Drawer current-lesson section navigation is now lesson-specific.
- [x] Multiple available lessons can coexist in the drawer and persist progress independently.
- [x] Extract reusable `LessonSection` intersection/entrance behavior.
- [x] Extract reusable `DepthSwitch`.
- [x] Extract reusable `TaskStamp`.
- [x] Keep Lesson 01 compatible with the generic shell.
- [x] Mark Lesson 02 as available in the course map.

### Lesson 02 — AI vs normal software

- [x] Create `/lessons/ai-vs-software` route.
- [x] Distinct Lesson 02 art direction with RULEY and PIX guide characters.
- [x] Simple / Real / Expert intro explaining explicit logic vs learned behavior.
- [x] Package IF-rule trace game.
- [x] Deterministic repeat experiment.
- [x] Cat-detector rule explosion with four edge cases.
- [x] Decision-boundary slider with live accuracy.
- [x] Toy auto-fit action demonstrating learning a boundary from examples.
- [x] Six-scenario Rules / ML / Hybrid decision game.
- [x] Draggable safe hybrid payment-risk pipeline.
- [x] Rule-trace vs learned-model debugging comparison.
- [x] Anti-hype “boring software wins” challenge.
- [x] Typed Feynman explain-back with mechanism validation.
- [x] Seven-question quiz with explanations; pass 6/7.
- [x] Quiz gated behind all 9 scenes + 9 tasks.
- [x] Independent Lesson 02 local progress and quiz persistence.
- [x] Responsive CSS module and reduced-motion fallback.

---

## Batch 03 — Lesson 03: AI / ML / Deep Learning

Status: **implemented in code; local runtime QA pending**

### Course navigation

- [x] Add Lesson 03 to the course drawer as an available lesson.
- [x] Create `/lessons/ai-ml-dl` route.
- [x] Give Lesson 03 its own nine-section progress/task map.
- [x] Lesson 03 progress persists independently through the generic lesson engine.

### Lesson 03 — AI vs Machine Learning vs Deep Learning

- [x] Create a distinct “nested worlds / science museum” visual direction for the hierarchy lesson.
- [x] Add three new visual guide creatures: AURA (AI), MILO (ML), DEEP (Deep Learning).
- [x] Activity 01: clickable concentric AI → ML → DL world with progressive Simple / Real / Expert explanations.
- [x] Force learner to enter hierarchy from broadest to narrowest.
- [x] Activity 02: six-example most-specific-level classification game.
- [x] Include AI-but-not-ML examples: search-based chess and symbolic expert rules.
- [x] Include ML-but-not-DL examples: linear regression and decision trees.
- [x] Include DL examples: deep vision networks and LLMs.
- [x] Reveal explanation after the learner commits each classification.
- [x] Activity 03: symbolic/search AI maze with explicit state transitions and no training dataset.
- [x] Activity 04: classic nearest-neighbor ML lab with movable mystery point.
- [x] Require at least three nearest-neighbor predictions.
- [x] Explicitly teach machine learning without deep learning.
- [x] Activity 05: six-floor “deep learning layer elevator.”
- [x] Visual representation progression: Pixels → Edges → Textures → Parts → Objects → Meaning.
- [x] Slider and floor buttons both change the active representation layer.
- [x] Require learner to inspect all six levels.
- [x] Explicitly kill the myth that “deep” means conscious, wise or human-style deep thinking.
- [x] Activity 06: interactive approach comparison console for symbolic AI, classic ML and deep learning.
- [x] Live comparison meters for data need, compute, explainability and adaptability.
- [x] Require all three approaches to be inspected.
- [x] Activity 07: draggable/reorder hierarchy challenge.
- [x] Required order: AI → Machine Learning → Deep Learning.
- [x] Activity 08: four 3D-style myth flip cards.
- [x] Cover “all AI is ML,” “all ML is DL,” “all DL is ML,” and “LLMs are DL.”
- [x] Require all myths to be flipped.
- [x] Activity 09: typed Feynman explanation requiring scope + mechanism vocabulary.
- [x] Seven-question end-of-lesson quiz with per-question explanations.
- [x] 6/7 pass threshold.
- [x] Quiz locked until all 9 sections are visited and all 9 activities are complete.
- [x] Responsive CSS module for nested worlds, maze, nearest-neighbor line, layer elevator, tradeoff dashboard, reorder challenge, flip cards and quiz.
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

Build **Lesson 04 — Generative AI vs Predictive AI**. The signature interaction should let the learner use the same underlying input in two machines: one predicts a label/value, while the other generates a new artifact token-by-token. It should clearly teach that generative models still perform prediction internally while the product-level task is generation.
