# Batch 20 — Module 2 / Lesson 04 — SGD, Batches, Epochs & Learning Rate

Status: **implemented in code; local visual QA pending**

- [x] Create `/lessons/sgd-batches-epochs` with nine-section task/quiz gating.
- [x] Activity 01: physical 12-example data-loader conveyor; complete one epoch only after all examples pass through batches.
- [x] Activity 02: batch-size microscope with classical stochastic (1), mini-batch, and full-batch (12) regimes.
- [x] Activity 03: repeatedly sample per-batch scalar gradients and compare single-example noise with full-batch averaging.
- [x] Activity 04: run three deterministic shuffle seeds and visualize different stochastic parameter paths for the same examples.
- [x] Activity 05: calculate updates/epoch as `ceil(N / batch)` and total updates as updates/epoch × epochs.
- [x] Activity 06: real 2→4→1 XOR-like network training under batch sizes 1/2/4/8 using actual mini-batch gradients.
- [x] Activity 07: pair batch size and learning rate; require noisy-small-step, balanced and deliberately huge-step regimes.
- [x] Activity 08: solve six concrete training-budget/update-count cases.
- [x] Activity 09: typed explain-back separating epoch/pass, batch/examples, gradient/update, SGD/shuffling and learning rate.
- [x] Seven-question gated quiz, pass 6/7.
- [x] Responsive/reduced-motion loader/conveyor styling.

## Next lesson

Build **Vanishing Gradients, Exploding Gradients & Normalization** as a gradient-health laboratory: multiply local derivatives through deep chains, deliberately make gradients disappear/explode, inspect saturation, clip huge gradients, normalize shifted/scaled activations, and compare BatchNorm-vs-LayerNorm axes without pretending every architecture uses the same normalization scheme.
