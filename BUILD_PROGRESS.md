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

### Explicitly not complete yet

- [ ] Firebase Authentication.
- [ ] Firestore cloud progress synchronization.
- [ ] Anonymous → authenticated progress merge.
- [ ] Full visual learning-map/planet view.
- [ ] TokenStream homepage demo.
- [ ] Formal E2E/Playwright tests.
- [ ] Runtime visual QA in a browser after dependency install.
- [ ] Remaining Module 1 lessons.

## Next batch

Build **Lesson 02 — AI vs normal software** as another full vertical lesson, reusing the shell/progress architecture while extracting reusable interaction primitives from Lesson 01 where duplication appears.
