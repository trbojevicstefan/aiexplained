# AI Explained — Build Progress

`[x]` means implemented in repository code. Runtime/browser QA is tracked separately and is never marked complete unless actually performed.

## Foundation
Status: **implemented in code**
- [x] Next.js + TypeScript foundation, Motion interaction layer and Firebase App Hosting config.
- [x] localStorage lesson progress, generic `LessonShell`, drawer, section jumps, progress HUD and gated quiz pattern.
- [x] reusable `LessonSection`, `DepthSwitch`, `TaskStamp`, `VectorPlot2D` and `AttentionMatrix` primitives.
- [x] responsive and reduced-motion support across the lesson system.
- [x] course drawer synchronized with all built Module 1–4 routes.

## Module 1 — AI From Absolute Zero
Status: **content implemented in code**
- [x] Core AI/software/ML/DL/generative/symbolic/training/data/parameter/feature concepts.
- [x] Learning types, RL, generalization, splits/checkpoints, online/transfer/representation learning.
- [x] Scope/AGI/probabilistic framing and Module 1 Boss Level.

## Module 2 — Neural Networks Without the Mystery
Status: **content implemented in code**
- [x] Real 2→4→1 toy network, forward pass, weights/bias/activations.
- [x] loss, gradient descent, SGD, backprop, LR/batches/epochs.
- [x] gradient health, clipping, normalization, regularization/dropout/early stopping.
- [x] residual/MLP, CNN/RNN/LSTM/attention evolution and Module 2 Boss Lab.

## Module 3 — How Language Becomes Numbers
Status: **content implemented in code**
- [x] Tokens, vocabulary, IDs, special tokens and context-token limits.
- [x] BPE, WordPiece and SentencePiece workshop.
- [x] embeddings, dimensions, cosine/dot/Euclidean, semantic search, multimodal space, clustering and ANN.
- [x] drag/drop semantic-space challenge and Module 3 Boss Lab.

## Module 4 — Transformers Visually, Step by Step
Status: **content implemented in code**
- [x] Why transformer attention shortens dependency paths and enables parallel-friendly training.
- [x] token representations through Q/K/V learned projections.
- [x] attention scores, scaled dot-product attention and row-wise softmax.
- [x] weighted value mixing and multi-head attention with distinct projection sets.
- [x] residual connections, LayerNorm intuition and transformer MLP/FFN.
- [x] transformer block flow.
- [x] absolute sinusoidal vs learned positional information.
- [x] RoPE rotation intuition.
- [x] causal masks and attention masks.
- [x] KV cache decode intuition.
- [x] Flash Attention vs sparse attention distinction.
- [x] sparse and sliding-window attention patterns.
- [x] encoder, decoder, encoder-only, decoder-only and encoder-decoder families.
- [x] cross-attention with decoder queries over encoder keys/values.
- [x] signature challenge: manually edit attention weights and watch output representation move.
- [x] Module 4 Boss Lab + 12-question mastery exam.

## Current Module 4 routes
- [x] `/lessons/transformer-block-flow`
- [x] `/lessons/positions-masks-cache`
- [x] `/lessons/encoder-decoder-architectures`
- [x] `/lessons/module-4-capstone`

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
Build **Module 5 — How an LLM Actually Produces Text**: a real seeded next-token sampler for logits → softmax → greedy / temperature / top-k / top-p / repetition penalties / stop / max tokens, followed by a Model Zoo lesson for dense, sparse, MoE, routing and model families.
