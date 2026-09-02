# Batch 13 — Train / Validation / Test + Checkpoints

Status: **implemented in code; local runtime/browser QA pending**

- [x] Create `/lessons/splits-checkpoints` with nine-section task/quiz gating.
- [x] Create data-vault visual language for TRAIN / VALIDATION / TEST and SNAP checkpoint character.
- [x] Activity 01: build and lock a train/validation/test split with sensible toy proportions.
- [x] Simple / Real / Expert explanations for the three split roles.
- [x] Activity 02: run training epochs where only training rows change model parameters.
- [x] Activity 03: run four model/hyperparameter configs and select using validation performance.
- [x] Deliberately include a config with best training score but worse validation score.
- [x] Activity 04: deliberately contaminate final test evaluation with repeated peeking/tuning.
- [x] Require three+ test peeks, then reset/re-seal experiment and perform exactly one clean final evaluation.
- [x] Activity 05: classify six scenarios as random, stratified or time-based splitting.
- [x] Activity 06: detect duplicate leakage where different row IDs contain the same content hash across train/test.
- [x] Require removal/grouping of duplicates and accept lower but more honest test score.
- [x] Activity 07: inspect five model checkpoints across epochs.
- [x] Require restoring epoch 14 because it has best validation loss even though epoch 20 has lower training loss.
- [x] Activity 08: classify eight artifacts as dataset split, model/training checkpoint or neither.
- [x] Activity 09: typed explain-back covering fit/selection/final-test/checkpoint roles and evaluation contamination.
- [x] Seven-question final quiz with explanations, pass 6/7.
- [x] Quiz locked behind all nine sections + nine tasks.
- [x] Responsive/reduced-motion data-vault CSS.

## Next gap from Module 1 guide

Build a dedicated **Learning Across Time & Tasks** lesson covering Online Learning, Transfer Learning and Representation Learning. These concepts were present in the master curriculum but not given a dedicated drawer lesson in the first navigation draft.
