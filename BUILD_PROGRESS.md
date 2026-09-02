# AI Explained — Build Progress

This is the execution log for `BUILD_GUIDE.md`. `[x]` means implemented in repository code. Runtime/browser verification remains separate and is never marked complete unless actually performed.

## Batch 01 — Foundation + Lesson 01

Status: **implemented**

### Foundation
- [x] Next.js + TypeScript application foundation.
- [x] Absolute imports, visual tokens, Motion animation layer and Firebase App Hosting config.
- [x] Anonymous/localStorage lesson progress.
- [x] Reusable Simple / Real / Expert depth state.
- [x] Lesson/progress drawer, section jumps, progress HUD, visited sections and completed activities.
- [x] Locked quiz engine with attempts, best score and persistence.
- [x] Responsive layouts and reduced-motion fallback.

### Lesson 01 — What is Artificial Intelligence?
- [x] AI/not-AI classification cold open.
- [x] `See → Find → Guess` drag exercise.
- [x] Rules vs learning tiny-model exercise.
- [x] Seven-layer AI X-ray with Simple / Real / Expert copy.
- [x] Training loop with epochs/loss/confidence and checkpoint action.
- [x] Probability / temperature playground.
- [x] AI → ML → Deep Learning reorder challenge.
- [x] Typed Feynman explain-back.
- [x] Six-question quiz, pass 5/6, locked behind 8 sections + 8 tasks.

---

## Batch 02 — Generic lesson engine + Lesson 02

Status: **implemented in code; local runtime QA pending**

### Engine refactor
- [x] Generic `LessonShell` accepting lesson id/title/section map.
- [x] Independent per-lesson progress and drawer state.
- [x] Reusable `LessonSection`, `DepthSwitch`, `TaskStamp` primitives.
- [x] Lesson 01 migrated to generic shell without changing its content implementation.

### Lesson 02 — AI vs normal software
- [x] `/lessons/ai-vs-software` route.
- [x] RULEY and PIX characters.
- [x] IF-rule trace game.
- [x] Deterministic repeat experiment.
- [x] Rule-explosion edge-case machine.
- [x] Decision-boundary slider + toy auto-fit.
- [x] Rules / ML / Hybrid scenario game.
- [x] Draggable hybrid payment pipeline.
- [x] Rule trace vs learned-model debugging comparison.
- [x] “Boring software wins” anti-hype challenge.
- [x] Typed explain-back.
- [x] Seven-question quiz, pass 6/7, gated behind 9 sections + 9 tasks.
- [x] Responsive + reduced-motion styles.

---

## Batch 03 — Lesson 03: AI / ML / Deep Learning

Status: **implemented in code; local runtime QA pending**

- [x] `/lessons/ai-ml-dl` route + independent progress map.
- [x] AURA / MILO / DEEP nested-world characters.
- [x] Clickable concentric AI → ML → DL explorable world.
- [x] Six-example most-specific-level classification.
- [x] AI-without-ML symbolic/search examples.
- [x] ML-without-DL linear/tree examples.
- [x] DL vision + LLM examples.
- [x] Symbolic/search maze.
- [x] Classic nearest-neighbor ML lab.
- [x] Six-floor deep-learning representation elevator.
- [x] Symbolic / classic ML / DL tradeoff console.
- [x] Draggable hierarchy reconstruction.
- [x] Four myth-flip cards.
- [x] Typed hierarchy explain-back.
- [x] Seven-question quiz, pass 6/7, gated behind 9 sections + 9 tasks.
- [x] Responsive + reduced-motion styles.

---

## Batch 04 — Lesson 04: Generative AI vs Predictive AI

Status: **implemented in code; local runtime QA pending**

- [x] `/lessons/generative-vs-predictive` route + drawer availability.
- [x] PREDI score-machine and GENI generator/printer characters.
- [x] Same-input two-machine experiment: predictive scoring vs generative response.
- [x] Predictive / Generative / Hybrid output-shape classifier.
- [x] Next-token conveyor with visible candidate probability bars.
- [x] Five-step learner-controlled autoregressive generation sequence.
- [x] Predictive churn-score feature slider lab.
- [x] Generator lab with tone, length and temperature controls.
- [x] Same conceptual foundation model shown under constrained classification vs free-form generation contracts.
- [x] Six-scenario product architecture game.
- [x] Predictive vs generative vs hybrid failure-mode sorter.
- [x] Typed explanation of why autoregressive generation still uses prediction internally.
- [x] Seven-question quiz, pass 6/7, gated behind 9 sections + 9 tasks.
- [x] Responsive + reduced-motion styles.

---

## Batch 05 — Lesson 05: Symbolic AI vs Neural AI

Status: **implemented in code; local runtime QA pending**

### Course navigation
- [x] Add Lesson 05 as an available drawer lesson.
- [x] Create `/lessons/symbolic-vs-neural`.
- [x] Add independent nine-section task/progress map.

### Lesson 05 — Symbolic AI vs Neural AI
- [x] Create split “glass AI laboratory” art direction rather than reusing previous lesson scenes.
- [x] Add LOGI symbolic/rule character and NOVA neural/weight character.
- [x] Simple / Real / Expert explanations focused on where each approach represents knowledge.
- [x] Activity 01: X-ray both minds — explicit facts/rules vs distributed weights.
- [x] Activity 02: explicit symbolic knowledge-graph proof for `MILO → DOG → MAMMAL → ANIMAL → NEEDS FOOD`.
- [x] Require all four inference edges to be traversed in order.
- [x] Activity 03: feed six labeled cat/dog examples into a visual neural network.
- [x] Require training and manipulation of a hidden-activation control.
- [x] Explain that the learned classification pattern is distributed over weights/activations rather than a single authored rule.
- [x] Activity 04: deliberately delete a symbolic ontology relation and break the proof chain.
- [x] Require learner to choose the exact missing rule to repair the symbolic system.
- [x] Activity 05: deliberately poison a neural training label.
- [x] Show degraded confidence and require learner to identify/repair the mislabeled row.
- [x] Teach different brittleness: missing/wrong knowledge vs bad/unrepresentative learning data.
- [x] Activity 06: inspect explicit policy trace beside neural activation heatmap.
- [x] Require a traceability answer after inspecting both mechanisms.
- [x] Activity 07: interactive symbolic-vs-neural tradeoff console.
- [x] Compare explicit reasoning, raw-example learning, fuzzy perception, hard constraints, hand-authored knowledge and high-dimensional inputs.
- [x] Explicitly warn against turning the comparison into “old AI vs new AI” ideology.
- [x] Activity 08: draggable neuro-symbolic document pipeline.
- [x] Required order: Neural perception → Symbolic constraints → Human approval → Action.
- [x] Animated hybrid run result.
- [x] Activity 09: typed Feynman explain-back requiring representation + hybrid vocabulary.
- [x] Seven-question final quiz with wrong-answer explanations.
- [x] 6/7 pass threshold.
- [x] Quiz locked behind all 9 sections + 9 tasks.
- [x] Responsive CSS module for split lab, graph proof, neural network, repair labs, activation inspection, comparison console, pipeline and quiz.
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

Build **Lesson 06 — Training vs Inference** as a two-floor AI factory: upstairs is an expensive training line that repeatedly updates weights from examples; downstairs is a fast frozen-model inference line that accepts new inputs without changing weights. Learners should checkpoint/freeze a model, route new requests through inference, detect accidental online learning, compare compute/latency/cost, and unlock the quiz only after completing the whole factory.
