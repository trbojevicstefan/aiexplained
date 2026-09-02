# Batch 09 — Lesson 09: Features & Labels

Status: **implemented in code; local runtime/browser QA pending**

This batch file is a temporary append-only implementation receipt for `BUILD_PROGRESS.md` while the lesson is being integrated into the central course map.

- [x] Create `/lessons/features-labels` with independent nine-section progress/task gating.
- [x] Create new detective/evidence-board visual language with CLUE and TARGET characters.
- [x] Activity 01: convert five messy real-world customer observations into structured features.
- [x] Reveal historical `churned_next_30d` label only after moving forward in time.
- [x] Explicitly teach that the supervised label is known for historical training examples but is the unknown answer at prediction time.
- [x] Activity 02: classify eight terms as Feature/Input vs Label/Target.
- [x] Activity 03: feature-selection lab with four deliberately relevant toy churn signals and four deliberately irrelevant distractors.
- [x] Explicitly state that real-world feature usefulness must be validated empirically.
- [x] Activity 04: deliberately add a post-churn `cancellation_reason` target-leak feature.
- [x] Show suspicious validation accuracy jump from 82.4% to 99.8%.
- [x] Require learner to remove leakage and accept the lower but honest metric.
- [x] Activity 05: feature representation/engineering lab for categorical encoding, elapsed-time derivation and normalized ratios.
- [x] Activity 06: prediction-time availability audit across six features/future facts.
- [x] Activity 07: compare human-engineered features with learned neural representations.
- [x] Explicitly state the two can be combined rather than treated as mutually exclusive ideologies.
- [x] Activity 08: eight-column schema audit: legitimate feature, label, leakage or metadata/identifier.
- [x] Activity 09: typed Feynman explain-back requiring feature/input, label/target and target-leakage/time-boundary concepts.
- [x] Seven-question quiz with wrong-answer explanations.
- [x] 6/7 pass threshold.
- [x] Quiz locked until all nine sections are visited and all nine tasks complete.
- [x] Responsive CSS and reduced-motion fallback.

## Integration still to fold into the central tracker/course map

- [ ] Mark `features-labels` as `available` in `content/course.ts` and use the central section map from both route/component.
- [ ] Fold this receipt into `BUILD_PROGRESS.md` after the central file update.
- [ ] Local `npm run typecheck` and `npm run build` verification by the user's environment.
- [ ] Browser visual QA on desktop + touch devices.

## Next batch

Lesson 10 should cover **Supervised, Unsupervised and Self-Supervised Learning** as three different learning rooms, with the same raw dataset routed through each objective so the difference is learned by doing rather than vocabulary.
