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
- [x] Build lesson/progress drawer and section jump navigation.
- [x] Build lesson progress HUD, per-section visited state and per-activity completion state.
- [x] Build quiz gating and quiz engine v1 with explanations, retries, best score and persistent completion.
- [x] Add responsive layouts and `prefers-reduced-motion` fallback.

### Lesson 01 — What is Artificial Intelligence?

- [x] AI/not-AI classification cold open.
- [x] `See → Find → Guess` drag exercise.
- [x] Rules vs learning tiny-model exercise.
- [x] Seven-layer AI X-ray with Simple / Real / Expert copy.
- [x] Training loop with epochs/loss/confidence and checkpoint action.
- [x] Probability / temperature playground with repeated samples.
- [x] AI → ML → Deep Learning reorder challenge.
- [x] Typed Feynman explain-back validation.
- [x] Six-question quiz, pass 5/6, locked behind all 8 sections + 8 tasks.

---

## Batch 02 — Generic lesson engine + Lesson 02

Status: **implemented in code; local runtime QA pending**

### Lesson engine refactor

- [x] Refactor `LessonShell` into reusable multi-lesson shell accepting `lessonId`, `lessonTitle` and section/task map.
- [x] Make progress, drawer navigation and local persistence independent per lesson.
- [x] Extract reusable `LessonSection`, `DepthSwitch` and `TaskStamp` primitives.
- [x] Keep Lesson 01 compatible with generic shell.

### Lesson 02 — AI vs normal software

- [x] Create `/lessons/ai-vs-software`.
- [x] Add RULEY and PIX guide characters and distinct visual direction.
- [x] Package IF-rule trace game.
- [x] Deterministic repeat experiment.
- [x] Cat-detector rule explosion with four edge cases.
- [x] Decision-boundary slider with live accuracy and toy auto-fit.
- [x] Six-scenario Rules / ML / Hybrid decision game.
- [x] Draggable safe hybrid payment-risk pipeline.
- [x] Rule-trace vs learned-model debugging comparison.
- [x] Anti-hype “boring software wins” challenge.
- [x] Typed mechanism-level explain-back.
- [x] Seven-question quiz, pass 6/7, gated behind all 9 scenes + 9 tasks.
- [x] Responsive CSS module and reduced-motion fallback.

---

## Batch 03 — Lesson 03: AI / ML / Deep Learning

Status: **implemented in code; local runtime QA pending**

### Course navigation

- [x] Add Lesson 03 as available in drawer.
- [x] Create `/lessons/ai-ml-dl` and its independent nine-section progress map.

### Lesson 03 — AI vs Machine Learning vs Deep Learning

- [x] Create nested-world visual direction with AURA, MILO and DEEP characters.
- [x] Clickable concentric AI → ML → DL world with Simple / Real / Expert explanations.
- [x] Six-example most-specific-level classification game.
- [x] AI-but-not-ML examples: symbolic/search chess and expert rules.
- [x] ML-but-not-DL examples: linear regression and decision tree.
- [x] Deep-learning examples: deep vision model and LLM.
- [x] Symbolic/search AI maze with state transitions and no training dataset.
- [x] Classic nearest-neighbor ML lab with movable mystery point.
- [x] Six-floor deep-learning layer elevator: Pixels → Edges → Textures → Parts → Objects → Meaning.
- [x] Symbolic AI / classic ML / deep learning tradeoff console.
- [x] Draggable AI → ML → DL hierarchy challenge.
- [x] Four 3D myth-flip cards.
- [x] Typed hierarchy explain-back.
- [x] Seven-question quiz, pass 6/7, gated behind all 9 sections + 9 tasks.
- [x] Responsive CSS module and reduced-motion fallback.

---

## Batch 04 — Lesson 04: Generative AI vs Predictive AI

Status: **implemented in code; local runtime QA pending**

### Course navigation

- [x] Add Lesson 04 as an available drawer lesson.
- [x] Create `/lessons/generative-vs-predictive`.
- [x] Give Lesson 04 its own nine-section task/progress map.
- [x] Preserve independent local progress, depth, quiz attempts and best score through the generic shell.

### Lesson 04 — Generative AI vs Predictive AI

- [x] Create a distinct “two-machine AI workshop / printing factory” visual direction.
- [x] Add PREDI score-machine character and GENI generator/printer character.
- [x] Simple / Real / Expert explanation of product-level predictive vs generative tasks.
- [x] Explicitly teach the central nuance: an autoregressive generator can generate by repeatedly predicting next-token distributions.
- [x] Activity 01: feed one customer message into two machines — predictive churn/urgency scoring vs generative reply drafting.
- [x] Require both machines to be run before completion.
- [x] Activity 02: classify six outputs as Predictive / Generative / Hybrid by output shape.
- [x] Cover probability, label, forecast, generated text, generated image and score+generation hybrid examples.
- [x] Activity 03: next-token conveyor/factory with visible candidate probability bars.
- [x] Require five learner-selected next-token prediction steps to construct a sentence.
- [x] Activity 04: predictive churn score lab with usage, support-ticket and late-payment sliders.
- [x] Live score updates as all three features move.
- [x] Clearly label scoring formula as a teaching toy rather than a production model.
- [x] Activity 05: generator lab with tone, length and temperature controls.
- [x] Require at least three generated drafts.
- [x] Activity 06: same conceptual foundation language model used with two product contracts — constrained JSON classification vs free-form generation.
- [x] Explicitly separate model capability from application/output contract.
- [x] Activity 07: six-scenario Predictive / Generative / Hybrid product-architecture game.
- [x] Include forecasting, artwork, support drafting, fraud-score+summary, inventory forecasting and conceptual urgency-score+handoff scenarios.
- [x] Activity 08: failure-mode sorter covering false positives, calibration, drift, hallucination, instruction failure and hybrid error cascades.
- [x] Activity 09: typed Feynman explain-back answering “If LLMs predict next tokens, why are they generative?”
- [x] Explain-back validation requires both product-output vocabulary and internal prediction/token vocabulary.
- [x] Seven-question final quiz with wrong-answer explanations.
- [x] 6/7 pass threshold.
- [x] Quiz locked until all 9 sections are visited and all 9 tasks are complete.
- [x] Responsive CSS module for two-machine lab, token conveyor, score lab, generator controls, same-model modes, architecture cards, failures and quiz.
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

Build **Lesson 05 — Symbolic AI vs Neural AI**. It should let the learner inspect a transparent symbolic knowledge/rule graph beside a neural pattern learner, solve the same problem through both approaches, deliberately break each system, compare interpretability/data requirements, and finish by building a hybrid symbolic+neural pipeline before its locked quiz.
