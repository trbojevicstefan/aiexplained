# Batch 19 — Module 2 / Lesson 03 — Loss, Gradient Descent & Backpropagation

Status: **implemented in code; local runtime/build check performed; visual QA still user/local**

- [x] Add `lib/toy-neural-network-gradients.ts` with inspectable full-batch gradients, gradient application, gradient norm and scalar chain-rule trace.
- [x] Create `/lessons/loss-gradients-backprop` with nine-section task/quiz gating.
- [x] Activity 01: compare prediction/target pairs with binary cross-entropy and squared error.
- [x] Activity 02: walk a one-weight loss landscape generated from a real four-example logistic toy dataset.
- [x] Activity 03: estimate local gradient numerically from loss left/right of the current weight.
- [x] Activity 04: compare tiny, useful and excessively large learning rates over ten updates.
- [x] Activity 05: manually run repeated gradient-descent updates and watch the point descend on the loss curve.
- [x] Activity 06: expose a scalar two-layer chain rule from BCE loss backward through sigmoid, output weight, tanh hidden activation and first weight.
- [x] Activity 07: run repeated real backprop gradient computation + separate optimizer-style updates on scalar weights.
- [x] Explicitly teach that backprop computes gradients while the optimizer/update rule changes parameters.
- [x] Activity 08: inspect real gradients from the same 2→4→1 XOR-like engine used in Lesson 01 and apply a real loss-reducing update.
- [x] Activity 09: typed explain-back requiring prediction, target/loss, gradient/slope, backprop/chain rule, learning rate, optimizer and parameter update.
- [x] Seven-question gated quiz, pass 6/7.
- [x] Responsive/reduced-motion loss-landscape/backward-signal styling.

## Next lesson

Build **SGD, Batches, Epochs & Learning Rate** as a physical data-loader / optimizer conveyor: one pass = epoch; batch determines how many examples contribute to one gradient estimate; batch size changes number/noise of updates; shuffling changes stochastic paths; and a live mini-batch trainer compares learning curves under several batch sizes.
