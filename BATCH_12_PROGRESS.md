# Batch 12 — Generalization, Underfitting, Overfitting & Bias/Variance

Status: **implemented in code; local runtime/browser QA pending**

- [x] Create `/lessons/generalization` with nine-section task/quiz gating.
- [x] Create living curve-fitting / graph-paper visual language with FLEX and NEW DATA characters.
- [x] Activity 01: separate training examples from new/holdout examples and require four new-data predictions.
- [x] Explicitly teach that training score is practice performance; generalization concerns new relevant examples.
- [x] Activity 02: model-complexity slider with toy train-error decrease and U-shaped new-data error.
- [x] Require learner to test low, useful and excessively flexible complexity zones.
- [x] Activity 03: deliberately create underfitting and repair it by increasing useful flexibility.
- [x] Activity 04: deliberately create overfitting using noise + excessive flexibility.
- [x] Require learner to improve the train/new-data gap using regularization.
- [x] Activity 05: vary data size and observe a toy generalization-gap trend across at least three runs.
- [x] Explicitly state more data is useful only when sufficiently relevant/representative and measured correctly.
- [x] Activity 06: interactive statistical bias/variance seesaw using complexity, data size and noise.
- [x] Require high-bias, high-variance and more balanced regimes.
- [x] Explicitly distinguish statistical bias here from social/fairness bias.
- [x] Activity 07: interpolation-vs-extrapolation range lab.
- [x] Require one prediction inside/near the training range and one far outside it.
- [x] Activity 08: diagnose eight model-behavior cases as underfit, overfit, healthy generalization, or distribution/range shift.
- [x] Activity 09: typed explain-back requiring train/new-data, underfit/overfit, complexity and bias/variance concepts.
- [x] Seven-question final quiz with wrong-answer explanations.
- [x] 6/7 pass threshold.
- [x] Quiz locked behind all nine sections + nine tasks.
- [x] Responsive/reduced-motion curve-lab CSS.

## Integration still to fold into central course files

- [ ] Mark `generalization` available in `content/course.ts`.
- [ ] Move the route-local section map into central `course.ts`.
- [ ] Fold this receipt into `BUILD_PROGRESS.md`.
- [ ] Local typecheck/build and browser visual QA.

## Next batch

Build **Lesson 13 — Train / Validation / Test Sets & Checkpoints**. The learner should physically split one dataset into training, validation and test rooms; fit weights only on training data; compare hyperparameter candidates on validation data; keep the final test set sealed; deliberately peek/reuse the test set until evaluation becomes contaminated; detect duplicate leakage across splits; compare random, stratified and time-based splitting; save multiple training checkpoints; restore the checkpoint with best validation performance; distinguish a model checkpoint from a data split; then finish a locked quiz.
