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
- [x] Create distinct Lesson 02 art direction with more color, objects and two opposing guide characters: RULEY and PIX.
- [x] Simple / Real / Expert intro explaining explicit logic vs learned behavior.
- [x] Activity 01: package rule-trace game where learner selects which IF rules fire.
- [x] Immediate feedback explaining that the computer follows authored conditions, not common sense.
- [x] Activity 02: deterministic repeat experiment — run identical coupon code three times and observe identical output.
- [x] Explicitly teach that deterministic does not mean small or trivial.
- [x] Activity 03: hand-written cat-detector rulebook that grows as four edge cases are introduced.
- [x] Clarify that rules are not bad; rule cost becomes painful for fuzzy/high-dimensional inputs.
- [x] Activity 04: draggable/slider decision boundary with labeled safe/risky examples.
- [x] Live training accuracy updates as learner moves the threshold.
- [x] “Let the model fit it” action that demonstrates learning a boundary from examples.
- [x] Clarify toy threshold fitting vs real multi-parameter model optimization.
- [x] Activity 05: six-scenario Rules / ML / Hybrid decision game.
- [x] Scenarios cover exact tax logic, computer vision, fraud, password policy, spam and high-value refunds.
- [x] Each scenario reveals mechanism-level reasoning after the learner commits to a choice.
- [x] Activity 06: draggable hybrid payment-risk pipeline.
- [x] Required safe order: Hard rules → ML risk score → Human approval → Action.
- [x] Animated run result through the completed hybrid pipeline.
- [x] Activity 07: debugging comparison between an exact rule trace and learned model signals.
- [x] Require inspection of both systems and a traceability answer.
- [x] Activity 08: “anti-hype” challenge where the learner must deliberately choose boring deterministic software when it is the better tool.
- [x] Teach the rule of thumb: exact/stable → rules; fuzzy/pattern-heavy → consider ML; high stakes → combine mechanisms and safeguards.
- [x] Activity 09: typed Feynman explain-back that rejects “AI is smarter” as an insufficient explanation.
- [x] Explain-back validation requires mechanism vocabulary and sufficient detail.
- [x] Seven-question final quiz.
- [x] 6/7 pass threshold.
- [x] Wrong-answer explanations for every quiz question.
- [x] Quiz locked until all 9 scenes are visited and all 9 required activities are complete.
- [x] Lesson 02 local progress, quiz attempts, best score and explanation depth persist independently from Lesson 01.
- [x] Lesson 02 responsive CSS module.
- [x] Lesson 02 reduced-motion CSS fallback.

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

Build **Lesson 03 — AI vs Machine Learning vs Deep Learning**. It should turn the nesting relationship into a physical explorable world, show examples that are AI-but-not-ML, ML-but-not-deep-learning, and deep-learning systems, then force the learner to classify and assemble the hierarchy before the quiz unlocks.
