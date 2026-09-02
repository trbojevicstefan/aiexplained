# Batch 10 — Learning Types

Status: **implemented in code; local runtime/browser QA pending**

- [x] Create `/lessons/learning-types` with nine-section local progress/task map.
- [x] Create four-room visual system with TEACH (supervised), SCOUT (unsupervised), MASK (self-supervised) and BRIDGE (semi-supervised).
- [x] Simple / Real / Expert explanation copy for all four learning setups.
- [x] Activity 01: inspect all four learning rooms.
- [x] Activity 02: supervised fruit classifier with six explicit labeled input/target pairs and training action.
- [x] Activity 03: unsupervised clustering playground with the same unlabeled geometry clustered at K=2 and K=3.
- [x] Activity 04: self-supervised masked-data exercise with four targets automatically derived from the original data.
- [x] Explicitly teach that self-supervised learning still has a training objective/supervisory signal; the target is derived from the data instead of manually labeled for the downstream task.
- [x] Activity 05: semi-supervised seed-label + pseudo-label/propagation toy lab.
- [x] Explicitly mark propagation as a simplified teaching picture rather than one universal semi-supervised algorithm.
- [x] Activity 06: use the same 10,000-image raw dataset under four different learning objectives.
- [x] Activity 07: eight real-world scenario routing questions across supervised / unsupervised / self-supervised / semi-supervised.
- [x] Activity 08: labeling-budget strategy arena comparing all-manual, tiny-labeled-only, semi-supervised and self-supervised-pretrain + fine-tune setups.
- [x] Explicitly state that the arena scores are toy teaching numbers and there is no universal winning learning setup.
- [x] Activity 09: typed Feynman explain-back based on where supervision comes from.
- [x] Seven-question final quiz with wrong-answer explanations.
- [x] 6/7 pass threshold.
- [x] Quiz locked behind all 9 sections + 9 tasks.
- [x] Responsive four-room CSS and reduced-motion fallback.

## Integration still to fold into central course files

- [ ] Mark `learning-types` as available in `content/course.ts`.
- [ ] Move the route-local section map into central `course.ts`.
- [ ] Fold this receipt into `BUILD_PROGRESS.md`.
- [ ] Local typecheck/build and browser QA.

## Next batch

Build **Lesson 11 — Reinforcement Learning** as a playable environment: state → action → reward → next state. Learners should train a tiny policy through trial/error, alter the reward function and watch behavior change, see exploration vs exploitation, distinguish reward from supervised label, trigger reward hacking in a deliberately flawed environment, repair the reward, and finish with a locked quiz.
