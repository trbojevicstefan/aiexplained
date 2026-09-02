# Batch 17 — Module 2 / Lesson 01 — What is a Neural Network?

Status: **implemented in code; local runtime/browser QA pending**

- [x] Add a real reusable browser-side toy neural-network engine in `lib/toy-neural-network.ts`.
- [x] Implement a 2 → 4 → 1 dense network with tanh hidden activations and sigmoid binary output.
- [x] Implement deterministic seeded initialization, forward trace, binary cross-entropy, full-batch backpropagation and gradient-based parameter updates.
- [x] Add an eight-point XOR-like BLOOP/ZING dataset so the hidden layer has to represent a nonlinear pattern.
- [x] Create `/lessons/neural-networks` with nine required interactive scenes.
- [x] Activity 01: inspect input, hidden and output layers with Simple / Real / Expert copy.
- [x] Activity 02: manually control a single neuron with x1/x2, w1/w2 and bias sliders; produce low/mid/high activations.
- [x] Activity 03: inspect at least six signed/magnitude-weighted network connections.
- [x] Activity 04: step through a real forward pass: input → hidden pre-activation → tanh hidden activation → output logit → sigmoid prediction.
- [x] Activity 05: drag a probe through all four quadrants of a decision space rendered from real network predictions on a 12×12 grid.
- [x] Activity 06: train the actual client-side network for 250+ epochs and gate completion on real loss/accuracy targets.
- [x] Activity 07: inspect all four hidden neurons and their computed activation heat maps.
- [x] Activity 08: save a trained checkpoint, zero all learned weights/biases, observe collapsed behavior, and restore learned behavior from the checkpoint.
- [x] Activity 09: typed explain-back requiring inputs, weights, bias, hidden layer, activation, forward pass, output, loss and training.
- [x] Seven-question gated quiz, pass 6/7.
- [x] Responsive / reduced-motion neural-lab styling.

## Next lesson

Build **Weights, Bias & Activation Functions** as a deeper interactive microscope: signed influence, bias-as-offset, linear-vs-nonlinear stacking, ReLU, sigmoid, softmax, saturation and why activation choice depends on layer/task.
