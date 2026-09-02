# AI Explained — Build Progress

`[x]` means implemented in repository code. Runtime/browser QA is tracked separately and is never marked complete unless actually performed.

## Foundation
Status: **implemented in code**
- [x] Next.js + TypeScript foundation.
- [x] Motion-based interaction layer and visual tokens.
- [x] Firebase App Hosting config.
- [x] localStorage per-lesson progress fallback.
- [x] reusable `LessonShell`, drawer, section jumps and progress HUD.
- [x] reusable `LessonSection`, `DepthSwitch`, `TaskStamp` primitives.
- [x] gated quiz pattern with persistent best score / pass state.
- [x] responsive and reduced-motion support across the lesson system.
- [x] course drawer synchronized with all built Module 1 and Module 2 routes.

## Module 1 — AI From Absolute Zero
Status: **content implemented in code**
- [x] What is AI?
- [x] AI vs normal software / rules vs learned behavior.
- [x] AI vs ML vs DL.
- [x] Generative vs predictive AI.
- [x] Symbolic vs neural AI.
- [x] Training vs inference.
- [x] Model vs algorithm vs dataset.
- [x] Parameters vs hyperparameters.
- [x] Features and labels + target leakage.
- [x] Supervised / unsupervised / self-supervised / semi-supervised learning.
- [x] Reinforcement learning + reward hacking.
- [x] Generalization / overfitting / underfitting / bias-variance intuition.
- [x] Train / validation / test sets + checkpoints + contamination traps.
- [x] Online / transfer / representation learning.
- [x] Narrow/specialized AI, AGI framing, deterministic vs probabilistic systems.
- [x] Module 1 Boss Level and mastery exam.

## Module 2 — Neural Networks Without the Mystery
Status: **content implemented in code**
- [x] Real 2→4→1 toy neural-network math engine in `lib/toy-neural-network.ts`.
- [x] Neural network anatomy, neurons, inputs/outputs, layers and hidden layers.
- [x] Weights, biases, ReLU, sigmoid and softmax.
- [x] Forward pass.
- [x] Loss functions, gradient intuition, gradient descent and backpropagation.
- [x] Learning rate, SGD, batches and epochs with real mini-batch updates.
- [x] Vanishing and exploding gradients.
- [x] Gradient clipping.
- [x] Normalization, including BatchNorm-vs-LayerNorm axis intuition.
- [x] Regularization, L2 weight decay, dropout and early stopping.
- [x] Residual connections and dense MLP intuition.
- [x] CNN local kernels and weight sharing.
- [x] RNN recurrent state and long-dependency limitation.
- [x] LSTM gated memory intuition.
- [x] Why attention replaced much sequential recurrence for modern LLM training.
- [x] Module 2 Boss Lab using the real toy-network engine.
- [x] 12-question Module 2 mastery exam, pass threshold 10/12.

## Current routes added in Module 2
- [x] `/lessons/neural-networks`
- [x] `/lessons/weights-bias-activations`
- [x] `/lessons/loss-gradients-backprop`
- [x] `/lessons/sgd-batches-epochs`
- [x] `/lessons/gradient-health-normalization`
- [x] `/lessons/regularization-dropout`
- [x] `/lessons/residual-mlp`
- [x] `/lessons/cnn-rnn-lstm-attention`
- [x] `/lessons/module-2-capstone`

## QA / platform work still open
- [ ] Fresh `npm ci` + `npm run typecheck` + `npm run build` on an environment with repository/network access.
- [ ] Browser visual QA across desktop and touch devices.
- [ ] Formal Playwright E2E tests.
- [ ] Firebase Authentication.
- [ ] Firestore cloud progress synchronization.
- [ ] Anonymous → authenticated progress merge.
- [ ] Full visual learning-map/planet view.
- [ ] TokenStream homepage demo.

## Next batch
Build **Module 3 — How Language Becomes Numbers**, starting with a signature tokenizer lab: type text → split into visible tokens → inspect token IDs → compare tokenization strategies → transform tokens into draggable vectors and inspect similarity.
