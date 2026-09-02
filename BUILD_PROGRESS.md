# AI Explained — Build Progress

`[x]` means implemented in repository code. Runtime/browser QA is tracked separately and is never marked complete unless actually performed.

## Foundation
Status: **implemented in code**
- [x] Next.js + TypeScript foundation, Motion interaction layer and Firebase App Hosting config.
- [x] localStorage lesson progress, generic `LessonShell`, drawer, section jumps, progress HUD and gated quiz pattern.
- [x] reusable `LessonSection`, `DepthSwitch`, `TaskStamp`, `VectorPlot2D` and `AttentionMatrix` primitives.
- [x] responsive and reduced-motion support across the lesson system.
- [x] living `AiMascot` design-system primitive with bot/star/briefcase/tile/mail toy variants.
- [x] mascot gaze follows pointer with spring motion, random blinking, breathing, hover/tap reaction and mood states.
- [x] living mascot companion integrated globally into lesson topbar + lesson drawer.
- [x] foundation drawer registry plus separate advanced-module registry for Module 8+.

## Modules 1–7
Status: **content implemented in code**
- [x] Module 1 foundations + Boss Level.
- [x] Module 2 real toy neural-network curriculum + Boss Lab.
- [x] Module 3 tokenization/embeddings/vector-search curriculum + Boss Lab.
- [x] Module 4 transformer/attention curriculum + Boss Lab.
- [x] Module 5 LLM generation/sampling/model-zoo/routing curriculum + Boss Lab.
- [x] Module 6 context/prompting/instruction-hierarchy/security curriculum + Boss Lab.
- [x] Module 7 pretraining/post-training/PEFT curriculum + Boss Lab.

## Module 8 — Reasoning & Test-Time Compute
Status: **content implemented in code**
- [x] operational definition of reasoning as additional inference-time planning/search/verification compute.
- [x] reasoning/test-time-compute budget slider with toy quality/latency/cost trade-off.
- [x] visible planning scaffold without presenting private model chain-of-thought as required output.
- [x] candidate search and Best-of-N intuition.
- [x] explicit verifier criteria and generator/verifier pattern.
- [x] self-correction using concrete failed tests/feedback.
- [x] critic/revision loop.
- [x] process reward model (PRM) vs outcome reward model (ORM) intuition.
- [x] tree-search and Tree-of-Thoughts propose/evaluate/expand-prune pattern.
- [x] majority voting and shared-error caveat.
- [x] self-consistency over multiple sampled solution paths.
- [x] reasoning-vs-memorization diagnosis using novel/controlled evaluation framing.
- [x] verifier/proxy failure and reward-hacking warning.
- [x] quality/latency/cost routing by task importance.
- [x] Module 8 Reasoning Boss Lab.
- [x] 12-question Module 8 mastery exam, pass threshold 10/12.

## Current Module 8 routes
- [x] `/lessons/reasoning-solver-arena`
- [x] `/lessons/search-verification-lab`
- [x] `/lessons/module-8-capstone`

## QA / platform work still open
- [ ] Fresh `npm ci` + `npm run typecheck` + `npm run build` on an environment with repository/network access.
- [ ] Browser visual QA across desktop and touch devices.
- [ ] Formal Playwright E2E tests.
- [ ] Firebase Authentication.
- [ ] Firestore cloud progress synchronization.
- [ ] Anonymous → authenticated progress merge.
- [ ] Full visual learning-map/planet view.
- [ ] TokenStream homepage demo.
- [ ] migrate remaining legacy one-off lesson mascots into the canonical `AiMascot` primitive.

## Next batch
Build **Module 9 — RAG & Knowledge Retrieval**: document ingestion/cleaning → chunk size/overlap → embeddings/index → keyword/BM25 vs semantic vs hybrid retrieval → metadata filters/query rewriting/HyDE → reranking/cross-encoders → grounded context/citations → precision/recall evaluation → vector DB/HNSW/IVF trade-offs and embedding migrations before the RAG Boss Lab.
