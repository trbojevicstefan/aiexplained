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
- [x] reusable `VectorPlot2D` primitive.
- [x] course drawer synchronized with all built Module 1–3 routes.

## Module 1 — AI From Absolute Zero
Status: **content implemented in code**
- [x] What is AI, software/rules vs learning, AI/ML/DL, generative/predictive, symbolic/neural.
- [x] Training/inference, model/algorithm/data, parameters/hyperparameters, features/labels.
- [x] Supervised/unsupervised/self-supervised/semi-supervised/RL.
- [x] Generalization, overfit/underfit, bias-variance, splits/checkpoints.
- [x] Online/transfer/representation learning, scope/AGI framing and probabilistic systems.
- [x] Module 1 Boss Level + mastery exam.

## Module 2 — Neural Networks Without the Mystery
Status: **content implemented in code**
- [x] Real 2→4→1 toy neural-network math engine.
- [x] neurons, I/O, hidden layers, weights, bias, ReLU/sigmoid/softmax, forward pass.
- [x] loss, gradients, GD/SGD, backprop, learning rate, batches and epochs.
- [x] vanishing/exploding gradients, clipping and normalization.
- [x] regularization, L2, dropout and early stopping.
- [x] residual connections and MLPs.
- [x] CNN, RNN, LSTM and why attention displaced much recurrence for modern LLMs.
- [x] Module 2 Boss Lab + 12-question mastery exam.

## Module 3 — How Language Becomes Numbers
Status: **content implemented in code**
- [x] Tokens vs words; word/character/byte/subword units.
- [x] Vocabulary, token IDs, BOS/EOS and context-token limits.
- [x] Toy BPE merge lab.
- [x] BPE vs WordPiece vs SentencePiece workshop, including continuation and whitespace-marker intuition.
- [x] Same text → different tokenizer boundaries/counts.
- [x] Token ID → learned embedding lookup mental model.
- [x] Vector dimensions and reusable 2-D embedding plot.
- [x] Cosine similarity, dot product and Euclidean distance.
- [x] Semantic search and nearest-neighbor ranking.
- [x] Text/image multimodal embedding-space intuition.
- [x] Clustering.
- [x] Exact nearest neighbors vs ANN trade-off.
- [x] Drag/drop Module 3 challenge: place words into semantic regions.
- [x] Module 3 Boss Lab pipeline: text → tokens → IDs → embeddings → retrieval.
- [x] 12-question Module 3 mastery exam, pass threshold 10/12.

## Current Module 3 routes
- [x] `/lessons/tokens-tokenization`
- [x] `/lessons/tokenizer-families`
- [x] `/lessons/embeddings-vectors`
- [x] `/lessons/module-3-capstone`

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
Build **Module 4 — Transformers Visually, Step by Step**. Start with a transformer-block flow lab and reusable attention heatmap: embeddings → position information → Q/K/V projections → scaled dot-product scores → softmax weights → weighted values → multi-head concat → residual + LayerNorm → MLP.
