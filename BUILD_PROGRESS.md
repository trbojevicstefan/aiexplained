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
- [x] foundation drawer registry plus advanced-module registry for Module 8+.

## Modules 1–8
Status: **content implemented in code**
- [x] Module 1 foundations + Boss Level.
- [x] Module 2 real toy neural-network curriculum + Boss Lab.
- [x] Module 3 tokenization/embeddings/vector-search curriculum + Boss Lab.
- [x] Module 4 transformer/attention curriculum + Boss Lab.
- [x] Module 5 LLM generation/sampling/model-zoo/routing curriculum + Boss Lab.
- [x] Module 6 context/prompting/instruction-hierarchy/security curriculum + Boss Lab.
- [x] Module 7 pretraining/post-training/PEFT curriculum + Boss Lab.
- [x] Module 8 reasoning/test-time-compute/search/verification curriculum + Boss Lab.

## Module 9 — RAG & Knowledge Retrieval
Status: **content implemented in code**
- [x] why RAG exists; RAG vs model weights/fine-tuning distinction.
- [x] document ingestion, parsing and source normalization.
- [x] cleaning/boilerplate removal.
- [x] real interactive chunk-size generator.
- [x] overlap slider and duplicate-token/index-cost intuition.
- [x] metadata for tenant, source, type, version/freshness and language.
- [x] chunk → embedding → vector + metadata → index pipeline.
- [x] grounded context assembly and source/citation example.
- [x] lexical/BM25 intuition with explicit simplified-toy disclaimer.
- [x] semantic retrieval via cosine similarity.
- [x] hybrid lexical/semantic blending.
- [x] tenant/document-type metadata filtering as relevance + security scope.
- [x] query rewriting and multi-query retrieval.
- [x] HyDE hypothetical-document retrieval intuition with evidence caveat.
- [x] query-document reranking / cross-encoder intuition.
- [x] vector-database role and examples: pgvector, Pinecone, Qdrant, Weaviate, Milvus, Chroma.
- [x] exact nearest neighbor vs ANN trade-off.
- [x] HNSW graph-walk intuition.
- [x] IVF coarse-cluster/probe intuition.
- [x] similarity threshold tuning.
- [x] retrieval precision vs recall with live calculation.
- [x] separate retrieval vs groundedness/faithfulness vs citation evaluation layers.
- [x] embedding-model/index migration workflow.
- [x] RAG Boss Lab fixing chunk boundaries, wrong tenant/version, hybrid weights, query rewrite, reranking, threshold, grounding/citations and embedding migration.
- [x] 12-question Module 9 mastery exam, pass threshold 10/12.

## Current Module 9 routes
- [x] `/lessons/rag-ingestion-chunking`
- [x] `/lessons/retrieval-ranking-lab`
- [x] `/lessons/vector-index-rag-evals`
- [x] `/lessons/module-9-capstone`

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
Build **Module 10 — What Is an AI Agent?**: chatbot vs workflow vs agent → goal/environment/state/actions/tools/memory/planning/autonomy/permissions/policy/runtime → Observe→Decide→Act→Observe loop → tool result back into context → completion/stop decisions → interactive “turn a chatbot into an agent” lab and Module 10 mastery Boss Lab.
