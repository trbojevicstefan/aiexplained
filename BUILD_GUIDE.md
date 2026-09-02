# AI Explained — Master Build Guide

> **Mission:** Build the most intuitive, interactive, visually memorable way to understand modern AI — from “what is AI?” to transformers, agents, memory, tool calling, MCP, orchestration, inference infrastructure, evals, safety, and AI economics.
>
> **Audience:** A curious 10-year-old should be able to follow the beginner layer. An engineer or founder should still find enough depth to build a correct mental model.
>
> **Core rule:** We do not explain something with a wall of text if it can be *felt*, *played with*, *changed*, *broken*, or *visualized*.

---

# 0. Product North Star

AI Explained is **not** a blog, glossary, documentation site, or video course.

It is an **interactive explorable AI textbook/game**.

Every lesson should make the learner do at least one meaningful action before finishing:

- drag something
- change a parameter
- predict an outcome
- connect components
- reorder a process
- inspect a hidden state
- run a tiny simulation
- make a choice and observe a consequence
- fix a broken system
- complete a small challenge

The learning loop should feel like:

**See → Touch → Predict → Change → Break → Understand → Explain Back → Quiz → Unlock**

## Non-negotiable quality bar

- [ ] No lesson is primarily a wall of text.
- [ ] Every major concept has a visual mental model.
- [ ] Every major concept has an interactive element.
- [ ] Every lesson has an end-of-lesson quiz.
- [ ] Every module has a practical “build it / fix it / inspect it” checkpoint.
- [ ] Animations explain cause and effect; they are never decorative noise.
- [ ] Beginner explanations avoid jargon until the learner has first seen the idea visually.
- [ ] Technical terminology is introduced after intuition, not before it.
- [ ] Every lesson supports reduced-motion accessibility.
- [ ] Mobile interactions remain usable; rich desktop interactions progressively enhance the experience.
- [ ] Every lesson has a “Go deeper” layer for advanced users.
- [ ] Every concept links backward to prerequisites and forward to what it unlocks.

---

# 1. Learning Design System

## 1.1 Three-layer explanation model

Every concept must be authored in three layers.

### Layer A — “Explain it to a 10-year-old”

- one concrete analogy
- one sentence definition
- one animated visual
- zero unnecessary acronyms

### Layer B — “Now show me how it really works”

- actual terminology
- actual data flow
- interactive controls
- simplified but technically faithful mechanics

### Layer C — “Expert mode”

- equations where useful
- architectural tradeoffs
- edge cases
- real implementation notes
- failure modes
- links to original papers/specs/docs where appropriate

- [ ] Build reusable UI switch: `Simple / Real / Expert`.
- [ ] Persist preferred explanation depth per user.
- [ ] Allow lesson authors to hide Expert mode until prerequisites are complete.

## 1.2 Lesson DNA

Every full lesson should use this sequence where appropriate:

1. **Cold open** — one surprising question or animation.
2. **Make a prediction** — user commits to an intuition before explanation.
3. **Core visual** — show the mechanism with almost no text.
4. **Hands-on interaction** — user changes the system.
5. **Name the concept** — introduce the actual term.
6. **Run it again** — now with technical labels visible.
7. **Break it** — deliberately create a failure mode.
8. **Real-world connection** — where this appears in ChatGPT/Claude/Gemini/agents/etc.
9. **Mini challenge** — solve a small task using the concept.
10. **Quiz** — 3–7 questions, mixed formats.
11. **Explain-back** — learner chooses or writes the best explanation.
12. **Unlock animation** — reveal next node on learning map.

- [ ] Build a reusable `LessonShell` supporting this structure.
- [ ] Build reusable step navigation and keyboard controls.
- [ ] Build per-step completion state.
- [ ] Build lesson resume from last interaction.

## 1.3 Quiz formats

Do not rely only on multiple choice.

- [ ] Multiple choice.
- [ ] Multiple select.
- [ ] Drag concepts into correct order.
- [ ] Match term to visual.
- [ ] Connect components with arrows.
- [ ] Predict next token.
- [ ] Move slider until desired behavior occurs.
- [ ] Repair a broken architecture.
- [ ] Choose correct tool call JSON.
- [ ] Identify an unsafe agent action.
- [ ] Build a prompt/context stack in correct order.
- [ ] Fill missing node in agent loop.
- [ ] Classify memory vs state vs context.
- [ ] Scenario-based “what happens next?” questions.
- [ ] Confidence rating after answer.
- [ ] Immediate feedback explaining *why* an answer is correct or wrong.

## 1.4 Mastery model

- [ ] Track lesson completion.
- [ ] Track quiz accuracy.
- [ ] Track first-try accuracy separately from retried accuracy.
- [ ] Track concept mastery, not only lesson completion.
- [ ] Surface weak concepts in a Review queue.
- [ ] Add spaced review checkpoints between later modules.
- [ ] Allow learners to replay simulations without resetting lesson progress.

---

# 2. Product Experience & Navigation

## 2.1 Home experience

The homepage should immediately demonstrate the product instead of describing it.

- [ ] Hero contains a live interactive “tiny AI brain” rather than a static hero illustration.
- [ ] User types a short phrase and sees it split into tokens in real time.
- [ ] Tokens flow through a simplified model and next-token probabilities animate.
- [ ] Primary CTA: `Start from zero`.
- [ ] Secondary CTA: `Show me the map`.
- [ ] Tertiary path for experienced users: `Test what I already know`.

## 2.2 Learning map

Use a visual path rather than a flat course list.

Suggested macro-path:

**Foundations → Neural Networks → LLMs → Context & RAG → Agents → Tools & Protocols → Production AI → Advanced Systems**

- [ ] Each module is a visible node/planet/circuit region.
- [ ] Locked topics show which prerequisite concept unlocks them.
- [ ] Completed nodes visually transform rather than merely displaying a checkmark.
- [ ] Current path is visually obvious.
- [ ] Optional side quests branch from the main path.
- [ ] Expert-only modules can be entered without forcing every beginner exercise.

## 2.3 Gamification

Gamification must support learning rather than distract from it.

- [ ] XP for lessons and meaningful challenges.
- [ ] Daily streak.
- [ ] Mastery percentage by concept family.
- [ ] Module badges based on understanding, not simple attendance.
- [ ] “Perfect lesson” distinction for first-try quiz success.
- [ ] Daily 3-minute challenge.
- [ ] Review queue for weak concepts.
- [ ] Optional leaderboard; never gate learning behind competition.
- [ ] Celebration animation for genuine milestones.
- [ ] Avoid punitive mechanics that make experimentation scary.

---

# 3. Visual & Animation Direction

## 3.1 Visual identity

Target feeling: **premium science museum + futuristic operating system + playful explorable textbook**.

Not:

- generic SaaS cards
- endless gradients
- crypto neon overload
- childish cartoon learning app
- static article with Lottie decorations

- [ ] Establish one distinct visual language for “information moving through a system”.
- [ ] Establish visual grammar for tokens, vectors, neurons, context, tools, memory, models, agents, users, permissions, and external systems.
- [ ] Use consistent shape/color/icon identity for each concept across the entire course.
- [ ] Build a design token system before producing many lessons.

## 3.2 Animation hierarchy

Use animation at four levels.

### Micro
Buttons, toggles, sliders, cards, success states, hover inspection.

### Component
Tokens moving, neurons firing, embeddings moving, attention lines changing, tool calls travelling.

### Scene
A concept unfolds as the learner scrolls or progresses through steps.

### Simulation
The learner controls a working simplified system.

- [ ] Motion must have semantic meaning.
- [ ] Use spring/physics-based interaction where objects represent manipulable concepts.
- [ ] Use scroll-driven animation only when sequence matters.
- [ ] Never block comprehension behind long unskippable animation.
- [ ] Provide instant reset/replay for simulations.

## 3.3 Core visualization tech

Recommended implementation mix:

- **React + TypeScript** for all learning logic.
- **Motion** for component and layout motion.
- **GSAP** for carefully choreographed scroll/scene sequences where needed.
- **SVG + D3** for diagrams, graphs, attention maps, distributions, vector spaces.
- **Canvas** for high-density particles/tokens or simulations.
- **React Three Fiber / Three.js** only when 3D genuinely improves intuition (vector space, latent space, model landscape); never as decorative overhead.
- **Rive** for authored character/state-machine animation only if we introduce a guide character.

- [ ] Build animation performance budget.
- [ ] Maintain 60fps target on modern desktop during normal lessons.
- [ ] Lazy-load heavy visualizers.
- [ ] Pause simulations when off-screen.
- [ ] Provide reduced-motion implementations.

---

# 4. Technical Foundation

Recommended baseline:

- Next.js + TypeScript
- App Router
- Tailwind CSS or equivalent token-driven styling
- Motion
- GSAP only for special sequences
- D3 utilities + custom SVG/Canvas renderers
- Zustand or equivalent lightweight local simulation state
- Zod for lesson/content schemas
- Firebase App Hosting
- Firebase Authentication
- Firestore for user progress, quiz history, streaks, mastery, bookmarks
- Static/content-first lesson data where possible
- MDX only for supporting prose; interactive lessons remain typed React content blocks
- Playwright for interaction/e2e tests
- Vitest for simulation/math unit tests

- [ ] Initialize Next.js TypeScript project.
- [ ] Configure linting/formatting.
- [ ] Configure absolute imports.
- [ ] Create `src/app`, `src/components`, `src/lessons`, `src/simulations`, `src/lib`, `src/content` architecture.
- [ ] Configure Firebase App Hosting.
- [ ] Configure Firebase Auth abstraction.
- [ ] Configure Firestore progress model.
- [ ] Create anonymous/local progress fallback before sign-in.
- [ ] Merge anonymous progress into account after sign-in.
- [ ] Add analytics event abstraction from day one.
- [ ] Add error boundaries around interactive simulations.

## 4.1 Proposed content model

Each lesson should be machine-readable rather than hard-coded as an unstructured page.

```ts
type Lesson = {
  id: string
  slug: string
  moduleId: string
  title: string
  oneLineIdea: string
  prerequisites: string[]
  unlocks: string[]
  estimatedMinutes: number
  concepts: string[]
  steps: LessonStep[]
  quiz: QuizItem[]
  expertNotes?: ExpertNote[]
}
```

- [ ] Define typed schema for module.
- [ ] Define typed schema for lesson.
- [ ] Define typed schema for interactive block.
- [ ] Define typed schema for quiz items.
- [ ] Define typed schema for simulation presets.
- [ ] Validate content at build time.

---

# 5. Reusable Interactive Component Library

Before building 100+ lessons, build primitives that make interactive lesson authoring fast.

- [ ] `TokenStream` — split text into draggable/inspectable tokens.
- [ ] `ProbabilityBars` — animate next-token probabilities.
- [ ] `VectorPlot2D` — inspect vectors and similarity.
- [ ] `VectorSpace3D` — optional 3D semantic space.
- [ ] `NeuronNode` — activation/weight visualization.
- [ ] `LayerGraph` — neural network layers and signal flow.
- [ ] `AttentionMatrix` — interactive attention heatmap.
- [ ] `AttentionLines` — token-to-token attention connections.
- [ ] `ContextStack` — system/user/tool/history context visualizer.
- [ ] `PromptStackBuilder` — reorder messages and inspect resulting request.
- [ ] `SamplingPlayground` — temperature/top-p/top-k playground.
- [ ] `ChunkingPlayground` — drag chunk size/overlap and inspect retrieval.
- [ ] `EmbeddingSearch` — type query and inspect nearest results.
- [ ] `AgentLoop` — animated observe/think/act/result cycle.
- [ ] `ToolCallInspector` — model output → arguments → execution → result.
- [ ] `MemoryShelf` — store/retrieve/edit/delete memory objects.
- [ ] `StateMachineViewer` — workflow/agent state transitions.
- [ ] `RouterPlayground` — route jobs between models.
- [ ] `QueueVisualizer` — jobs/workers/retries/dead-letter queue.
- [ ] `PermissionGate` — approve/deny sensitive agent actions.
- [ ] `TraceTimeline` — model/tool/agent spans over time.
- [ ] `CostMeter` — live token/tool/inference cost visual.
- [ ] `ArchitectureBuilder` — drag model, RAG, tools, memory, guardrails into a working AI system.
- [ ] `ComparePanel` — side-by-side behavior comparison.
- [ ] `PredictionPrompt` — learner predicts before revealing animation.
- [ ] `ExplainBack` — select/reorder explanation statements.
- [ ] `QuizEngine` — common quiz shell and scoring.

---

# 6. Curriculum Map

The curriculum below covers the full modern AI stack. Each checkbox represents a lesson or clearly separable learning unit. We can merge very small concepts into one lesson where that improves pacing, but **none of these concepts should disappear from the curriculum**.

---

# MODULE 1 — AI From Absolute Zero

**Goal:** Understand what AI is before touching LLM jargon.

### Signature interactive
A “sorting robot” learns to distinguish simple objects. The learner first gives explicit rules, then examples, and sees the difference between traditional programming and learning.

- [ ] What is Artificial Intelligence?
- [ ] AI vs normal software.
- [ ] Rules vs learned behavior.
- [ ] AI vs Machine Learning vs Deep Learning.
- [ ] Generative AI vs predictive AI.
- [ ] Symbolic AI vs neural AI.
- [ ] Narrow AI vs AGI.
- [ ] Deterministic vs probabilistic systems.
- [ ] Training vs inference.
- [ ] Model vs algorithm.
- [ ] Dataset vs model.
- [ ] Parameters vs hyperparameters.
- [ ] Features and labels.
- [ ] Supervised learning.
- [ ] Unsupervised learning.
- [ ] Self-supervised learning.
- [ ] Semi-supervised learning.
- [ ] Reinforcement learning.
- [ ] Online learning.
- [ ] Transfer learning.
- [ ] Representation learning.
- [ ] Generalization.
- [ ] Overfitting.
- [ ] Underfitting.
- [ ] Bias vs variance.
- [ ] Training/validation/test sets.
- [ ] Checkpoints.
- [ ] Module 1 challenge: identify which learning approach fits five real-world scenarios.
- [ ] Module 1 mastery quiz.

---

# MODULE 2 — Neural Networks Without the Mystery

### Signature interactive
Build a tiny network by connecting neurons, adjust weights, press “train,” and watch the decision boundary improve.

- [ ] What is a neural network?
- [ ] Neurons.
- [ ] Inputs and outputs.
- [ ] Layers.
- [ ] Hidden layers.
- [ ] Weights.
- [ ] Biases.
- [ ] Activation functions.
- [ ] ReLU.
- [ ] Sigmoid.
- [ ] Softmax.
- [ ] Forward pass.
- [ ] Loss functions.
- [ ] Gradient intuition.
- [ ] Gradient descent.
- [ ] Stochastic gradient descent.
- [ ] Backpropagation.
- [ ] Learning rate.
- [ ] Epochs.
- [ ] Batches.
- [ ] Vanishing gradients.
- [ ] Exploding gradients.
- [ ] Normalization.
- [ ] Regularization.
- [ ] Dropout.
- [ ] Residual connections.
- [ ] Feed-forward networks / MLPs.
- [ ] CNN intuition.
- [ ] RNN intuition.
- [ ] LSTM intuition.
- [ ] Why attention replaced much sequential recurrence for modern LLMs.
- [ ] Module 2 simulation: train a toy classifier in-browser.
- [ ] Module 2 mastery quiz.

---

# MODULE 3 — How Language Becomes Numbers

### Signature interactive
Type a sentence, physically break it into tokens, inspect token IDs, then watch each token turn into a movable vector.

- [ ] What is a token?
- [ ] Why models do not literally read words.
- [ ] Tokenization.
- [ ] Tokenizers.
- [ ] Vocabulary.
- [ ] Token IDs.
- [ ] Special tokens.
- [ ] BOS/EOS tokens.
- [ ] Byte Pair Encoding / BPE intuition.
- [ ] SentencePiece intuition.
- [ ] WordPiece intuition.
- [ ] Character vs byte vs subword tokens.
- [ ] Tokens vs words.
- [ ] Why different models tokenize the same text differently.
- [ ] Token counting and limits.
- [ ] What is an embedding?
- [ ] Vectors.
- [ ] Dimensions.
- [ ] Semantic similarity.
- [ ] Cosine similarity.
- [ ] Dot product intuition.
- [ ] Euclidean distance intuition.
- [ ] Text embeddings.
- [ ] Image embeddings.
- [ ] Multimodal embeddings.
- [ ] Embedding spaces.
- [ ] Nearest-neighbor search.
- [ ] Approximate nearest neighbor / ANN.
- [ ] Semantic search.
- [ ] Clustering.
- [ ] Module 3 challenge: place words in a semantic vector space.
- [ ] Module 3 mastery quiz.

---

# MODULE 4 — Transformers Visually, Step by Step

### Signature interactive
A sentence enters on the left. The learner advances one transformer stage at a time and can inspect exactly what changed at each stage.

- [ ] Why transformers were invented.
- [ ] Transformer architecture overview.
- [ ] Input embeddings.
- [ ] Position information.
- [ ] Positional encoding.
- [ ] Positional embeddings.
- [ ] RoPE intuition.
- [ ] Attention.
- [ ] Self-attention.
- [ ] Cross-attention.
- [ ] Query, Key, Value.
- [ ] Q/K/V matrices.
- [ ] Attention scores.
- [ ] Scaled dot-product attention.
- [ ] Softmax inside attention.
- [ ] Multi-head attention.
- [ ] What different attention heads can represent.
- [ ] Feed-forward layers inside transformer blocks.
- [ ] Residual connections in transformers.
- [ ] Layer normalization.
- [ ] Transformer blocks.
- [ ] Encoder.
- [ ] Decoder.
- [ ] Encoder-only models.
- [ ] Decoder-only models.
- [ ] Encoder-decoder models.
- [ ] Causal attention.
- [ ] Attention masks.
- [ ] KV cache.
- [ ] Flash Attention intuition.
- [ ] Sparse attention.
- [ ] Sliding-window attention.
- [ ] Module 4 lab: manually change attention and see output representation change.
- [ ] Module 4 mastery quiz.

---

# MODULE 5 — How an LLM Actually Produces Text

### Signature interactive
A miniature next-token machine: user gives “The sky is”, sees candidate tokens/probabilities, changes sampling controls, then generates sentence token by token.

- [ ] What is a Large Language Model?
- [ ] What an LLM learns during training.
- [ ] Next-token prediction.
- [ ] Conditional probability intuition.
- [ ] Sequence modeling.
- [ ] Autoregressive generation.
- [ ] Token-by-token generation.
- [ ] Logits.
- [ ] Softmax probabilities.
- [ ] Sampling.
- [ ] Greedy decoding.
- [ ] Temperature.
- [ ] Top-K.
- [ ] Top-P / nucleus sampling.
- [ ] Repetition penalties.
- [ ] Stop sequences.
- [ ] Max output tokens.
- [ ] Seeds and determinism.
- [ ] Why identical prompts can produce different answers.
- [ ] Why LLMs hallucinate.
- [ ] Why LLMs appear to reason.
- [ ] Model parameters and weights.
- [ ] Parameter count.
- [ ] Dense models.
- [ ] Sparse models.
- [ ] Mixture of Experts / MoE.
- [ ] Expert routing.
- [ ] Model routing vs MoE routing.
- [ ] Small Language Models / SLMs.
- [ ] Foundation models.
- [ ] Base vs instruct vs chat models.
- [ ] Reasoning models.
- [ ] Scaling laws intuition.
- [ ] Emergent capabilities as a debated/nuanced concept.
- [ ] Module 5 lab: sampling playground.
- [ ] Module 5 mastery quiz.

---

# MODULE 6 — Context & Prompting

### Signature interactive
A transparent “model backpack” shows exactly what goes into the context window. Learners add/remove system instructions, history, documents, and tool results, then inspect behavioral changes.

- [ ] What is context?
- [ ] Context window.
- [ ] System instructions.
- [ ] User messages.
- [ ] Assistant history.
- [ ] Tool results in context.
- [ ] Documents in context.
- [ ] Context length.
- [ ] Context overflow.
- [ ] Context truncation.
- [ ] Context compression.
- [ ] Context summarization.
- [ ] Context engineering.
- [ ] Context selection.
- [ ] Context prioritization.
- [ ] Lost-in-the-middle problem.
- [ ] Long-context models.
- [ ] Prompt caching.
- [ ] Context caching vs KV caching.
- [ ] What is a prompt?
- [ ] Prompt roles / instruction hierarchy.
- [ ] Zero-shot prompting.
- [ ] One-shot prompting.
- [ ] Few-shot prompting.
- [ ] Prompt templates.
- [ ] Role/persona prompting.
- [ ] Constraints and delimiters.
- [ ] Structured prompts.
- [ ] Structured outputs.
- [ ] Planning prompts.
- [ ] Reflection and critique patterns.
- [ ] Self-consistency concept.
- [ ] Prompt injection.
- [ ] Indirect prompt injection.
- [ ] Jailbreaking.
- [ ] Prompt leakage.
- [ ] Prompt engineering vs context engineering.
- [ ] Module 6 challenge: repair a bad context stack.
- [ ] Module 6 mastery quiz.

---

# MODULE 7 — Training & Post-Training

### Signature interactive
A tiny model starts as random behavior, learns a pattern during pretraining, then changes behavior after instruction tuning/preference feedback.

- [ ] Pretraining.
- [ ] Training corpus.
- [ ] Data collection.
- [ ] Data cleaning.
- [ ] Deduplication.
- [ ] Data filtering.
- [ ] Data quality.
- [ ] Data contamination.
- [ ] Synthetic data.
- [ ] Training objective.
- [ ] Cross-entropy loss.
- [ ] Backpropagation at scale.
- [ ] Distributed training.
- [ ] Data parallelism.
- [ ] Model parallelism.
- [ ] Tensor parallelism.
- [ ] Pipeline parallelism.
- [ ] Training checkpoints.
- [ ] Fine-tuning.
- [ ] Supervised Fine-Tuning / SFT.
- [ ] Instruction tuning.
- [ ] Preference tuning.
- [ ] RLHF.
- [ ] Reward models.
- [ ] PPO intuition.
- [ ] DPO intuition.
- [ ] RLAIF.
- [ ] Constitutional AI concept.
- [ ] LoRA.
- [ ] QLoRA.
- [ ] PEFT.
- [ ] Adapter layers.
- [ ] Domain fine-tuning.
- [ ] Distillation.
- [ ] Knowledge distillation.
- [ ] Model merging.
- [ ] Continual learning.
- [ ] Catastrophic forgetting.
- [ ] Quantization-aware training.
- [ ] Module 7 compare lab: base model vs post-trained model behavior.
- [ ] Module 7 mastery quiz.

---

# MODULE 8 — Reasoning & Test-Time Compute

### Signature interactive
Give three “solvers” the same puzzle: instant answer, plan-and-solve, and generator+verifier. Show quality, steps, latency, and cost.

- [ ] What “reasoning” means in modern model systems.
- [ ] Reasoning tokens.
- [ ] Test-time compute.
- [ ] Deliberation.
- [ ] Planning.
- [ ] Search over possible solutions.
- [ ] Verification.
- [ ] Self-correction.
- [ ] Critic models.
- [ ] Generator/verifier systems.
- [ ] Process Reward Models.
- [ ] Outcome Reward Models.
- [ ] Tree search intuition.
- [ ] Tree of Thoughts concept.
- [ ] Best-of-N generation.
- [ ] Majority voting.
- [ ] Self-consistency.
- [ ] Reasoning vs memorization.
- [ ] Accuracy/latency/cost tradeoff.
- [ ] Module 8 mastery quiz.

---

# MODULE 9 — RAG & Knowledge Retrieval

### Signature interactive
Learner uploads/selects a tiny document set, chooses chunk size, watches embeddings appear, runs a query, changes retrieval settings, and sees which chunks enter the prompt.

- [ ] Why RAG exists.
- [ ] RAG vs model knowledge.
- [ ] RAG vs fine-tuning.
- [ ] Document ingestion.
- [ ] Parsing.
- [ ] Cleaning.
- [ ] Chunking.
- [ ] Chunk size.
- [ ] Chunk overlap.
- [ ] Metadata.
- [ ] Embedding generation.
- [ ] Vector database role.
- [ ] Indexing.
- [ ] Retrieval.
- [ ] Semantic retrieval.
- [ ] Keyword retrieval.
- [ ] BM25 intuition.
- [ ] Hybrid search.
- [ ] Metadata filtering.
- [ ] Query rewriting.
- [ ] Multi-query retrieval.
- [ ] HyDE concept.
- [ ] Reranking.
- [ ] Cross-encoders.
- [ ] Context assembly.
- [ ] Grounded generation.
- [ ] Citations.
- [ ] Retrieval precision.
- [ ] Retrieval recall.
- [ ] RAG evaluation.
- [ ] Vector DB overview: pgvector, Pinecone, Qdrant, Weaviate, Milvus, Chroma.
- [ ] HNSW intuition.
- [ ] IVF intuition.
- [ ] Similarity thresholds.
- [ ] Embedding migrations / version changes.
- [ ] Module 9 lab: fix a RAG system returning the wrong document.
- [ ] Module 9 mastery quiz.

---

# MODULE 10 — What Is an AI Agent?

### Signature interactive
A chatbot and agent receive the same task. The chatbot only answers; the agent gets a goal, chooses a tool, observes the result, and continues until completion.

- [ ] What is an AI agent?
- [ ] LLM vs agent.
- [ ] Chatbot vs agent.
- [ ] Workflow vs agent.
- [ ] Automation vs agent.
- [ ] Goal.
- [ ] Environment.
- [ ] State.
- [ ] Actions.
- [ ] Tools.
- [ ] Memory.
- [ ] Planning.
- [ ] Autonomy.
- [ ] Permissions.
- [ ] Agent policy.
- [ ] Agent runtime.
- [ ] The Observe → Decide → Act loop.
- [ ] Tool result → next model step.
- [ ] Completion / stop decisions.
- [ ] Why an LLM alone is not an agent.
- [ ] Module 10 lab: turn a chatbot into an agent by adding missing pieces.
- [ ] Module 10 mastery quiz.

---

# MODULE 11 — Agent Harness, Framework & Runtime

### Signature interactive
Start with a naked model. Drag `tools`, `loop`, `context manager`, `sandbox`, `memory`, `retry`, `permissions` around it until it becomes a working coding/research agent.

- [ ] What is an agent harness?
- [ ] Harness as runtime machinery wrapped around a model.
- [ ] What is an agent framework?
- [ ] Framework as developer abstractions/toolkit.
- [ ] What is a runtime?
- [ ] Harness vs framework vs runtime vs SDK.
- [ ] Prompt management.
- [ ] Context construction.
- [ ] Tool registration.
- [ ] Tool execution.
- [ ] Permission enforcement.
- [ ] Retry logic.
- [ ] Error handling.
- [ ] State management.
- [ ] Memory integration.
- [ ] Sandboxing.
- [ ] Filesystem access.
- [ ] Shell access.
- [ ] Browser access.
- [ ] Code execution.
- [ ] Logging and tracing.
- [ ] Token/context management.
- [ ] Context compression.
- [ ] Checkpointing.
- [ ] Human approvals.
- [ ] Session management.
- [ ] Framework concepts: agents, tools, messages, state, graphs, handoffs.
- [ ] Conceptual tour: LangGraph.
- [ ] Conceptual tour: LangChain.
- [ ] Conceptual tour: LlamaIndex.
- [ ] Conceptual tour: Semantic Kernel.
- [ ] Conceptual tour: AutoGen.
- [ ] Conceptual tour: CrewAI.
- [ ] Conceptual tour: OpenAI Agents SDK.
- [ ] Conceptual tour: PydanticAI.
- [ ] Conceptual tour: Google ADK.
- [ ] Module 11 challenge: correctly classify harness/framework/runtime/tool examples.
- [ ] Module 11 mastery quiz.

---

# MODULE 12 — Tool Calling

### Signature interactive
The learner becomes the model: read a user request, select a tool, construct arguments, execute it, inspect result, then choose whether another tool is needed.

- [ ] What is a tool?
- [ ] Function calling vs tool calling.
- [ ] Tool definitions.
- [ ] Tool name.
- [ ] Tool description.
- [ ] Parameters.
- [ ] JSON Schema.
- [ ] Tool selection.
- [ ] Tool arguments.
- [ ] Tool invocation.
- [ ] Tool execution happens outside the LLM.
- [ ] Tool result returned to the model.
- [ ] Multiple tool calls.
- [ ] Sequential tool calls.
- [ ] Parallel tool calls.
- [ ] Tool retries.
- [ ] Tool errors.
- [ ] Tool timeouts.
- [ ] Tool permissions.
- [ ] Good tool descriptions.
- [ ] Tool granularity.
- [ ] One large tool vs many small tools.
- [ ] Idempotent tools.
- [ ] Read vs write vs destructive tools.
- [ ] Confirmation-required tools.
- [ ] Rate limits.
- [ ] Tool reliability.
- [ ] Common tool categories: web, browser, APIs, DB, SQL, filesystem, shell, code, Git, email, calendar, CRM, Slack, Drive, payments, cloud APIs.
- [ ] Module 12 lab: repair malformed or unsafe tool calls.
- [ ] Module 12 mastery quiz.

---

# MODULE 13 — MCP & Agent-to-Agent Protocols

### Signature interactive
A host discovers tools from an MCP server live on screen; learner can connect/disconnect servers and see which capabilities appear. Then a separate scene shows one agent delegating a task to another agent.

- [ ] Why protocols matter.
- [ ] API vs tool vs MCP server.
- [ ] Model Context Protocol / MCP.
- [ ] MCP host.
- [ ] MCP client.
- [ ] MCP server.
- [ ] MCP tools.
- [ ] MCP resources.
- [ ] MCP prompts.
- [ ] Capability discovery.
- [ ] stdio transport concept.
- [ ] HTTP transport concept.
- [ ] Authentication.
- [ ] Authorization.
- [ ] Local vs remote MCP servers.
- [ ] MCP security risks.
- [ ] Agent-to-Agent communication.
- [ ] A2A concepts.
- [ ] Agent discovery.
- [ ] Agent identity.
- [ ] Capability descriptions.
- [ ] Task delegation.
- [ ] Agent messaging.
- [ ] Agent contracts.
- [ ] Agent authentication and authorization.
- [ ] Remote agent services.
- [ ] Agent marketplaces concept.
- [ ] Module 13 architecture challenge.
- [ ] Module 13 mastery quiz.

---

# MODULE 14 — Memory & State

### Signature interactive
A user tells an agent facts over several sessions. Learner chooses what to store, where to store it, what to retrieve later, and watches irrelevant/bad memory damage the next answer.

- [ ] Why an LLM does not automatically have persistent memory.
- [ ] Context vs memory.
- [ ] Memory vs state.
- [ ] Short-term memory.
- [ ] Long-term memory.
- [ ] Working memory.
- [ ] Episodic memory.
- [ ] Semantic memory.
- [ ] Procedural memory.
- [ ] Conversation memory.
- [ ] User memory.
- [ ] Agent memory.
- [ ] Shared memory.
- [ ] Entity memory.
- [ ] Memory extraction.
- [ ] Memory candidates.
- [ ] Memory normalization.
- [ ] Memory storage.
- [ ] Memory embeddings.
- [ ] Memory retrieval.
- [ ] Memory ranking.
- [ ] Memory injection into context.
- [ ] Memory consolidation.
- [ ] Memory updating.
- [ ] Memory conflicts.
- [ ] Memory deduplication.
- [ ] Memory decay.
- [ ] Forgetting/deletion.
- [ ] Memory summarization.
- [ ] Storage options: context, SQL, NoSQL, vector DB, graph, files, Redis, event log.
- [ ] Session state.
- [ ] Persistent state.
- [ ] Ephemeral state.
- [ ] Workflow/task/agent state.
- [ ] Checkpoints.
- [ ] Resuming jobs.
- [ ] State machines.
- [ ] Event sourcing concept.
- [ ] Module 14 lab: choose the right storage strategy for scenarios.
- [ ] Module 14 mastery quiz.

---

# MODULE 15 — Agent Architecture & Orchestration

### Signature interactive
Build an agent team by dragging roles onto a canvas, route jobs between them, then trigger failures such as loops, duplicate work, deadlocks, or queue congestion.

- [ ] Single-agent architecture.
- [ ] Multi-agent systems.
- [ ] Supervisor agent.
- [ ] Worker agents.
- [ ] Router agent.
- [ ] Planner agent.
- [ ] Executor agent.
- [ ] Critic agent.
- [ ] Research agent.
- [ ] Coding agent.
- [ ] Browser agent.
- [ ] Data agent.
- [ ] Voice agent.
- [ ] Computer-use agent.
- [ ] Specialist agents.
- [ ] Hierarchical agents.
- [ ] Peer-to-peer agents.
- [ ] Agent swarms concept.
- [ ] Task decomposition.
- [ ] Goal decomposition.
- [ ] Planning and replanning.
- [ ] Plan-and-execute.
- [ ] ReAct.
- [ ] Reflection.
- [ ] Backtracking.
- [ ] Static vs dynamic workflows.
- [ ] Agentic workflows.
- [ ] What is orchestration?
- [ ] Workflow engines.
- [ ] Router.
- [ ] Dispatcher.
- [ ] Scheduler.
- [ ] Queue.
- [ ] Workers.
- [ ] Jobs.
- [ ] Events.
- [ ] Event-driven architecture.
- [ ] Pub/Sub.
- [ ] Webhooks.
- [ ] Async execution.
- [ ] Parallel execution.
- [ ] Sequential execution.
- [ ] Fan-out/fan-in.
- [ ] DAG execution.
- [ ] Durable execution.
- [ ] Retries.
- [ ] Dead-letter queues.
- [ ] Agent handoffs.
- [ ] Shared memory/workspace.
- [ ] Infinite-loop prevention.
- [ ] Deadlock prevention.
- [ ] Consensus/debate/voting patterns.
- [ ] Module 15 lab: fix a broken multi-agent architecture.
- [ ] Module 15 mastery quiz.

---

# MODULE 16 — Model Routing & Systems of Models

### Signature interactive
Incoming jobs have different complexity, latency, privacy, and price requirements. Learner writes routing rules and competes against a baseline on quality/cost/latency.

- [ ] What is model routing?
- [ ] Dynamic model selection.
- [ ] Routing by task.
- [ ] Routing by complexity.
- [ ] Routing by latency.
- [ ] Routing by cost.
- [ ] Routing by quality.
- [ ] Routing by context length.
- [ ] Routing by modality.
- [ ] Routing by provider.
- [ ] Fallback models.
- [ ] Model cascades.
- [ ] Ensembles.
- [ ] Mixture of Models.
- [ ] Mixture of Experts vs external model routing.
- [ ] Router models.
- [ ] Rules-based routing.
- [ ] Learned routing.
- [ ] Semantic routing.
- [ ] Quality/cost/latency frontier.
- [ ] Module 16 routing challenge.
- [ ] Module 16 mastery quiz.

---

# MODULE 17 — Coding, Browser & Computer-Use Agents

### Signature interactive
A toy coding agent receives a bug, searches files, edits code, runs a test, sees failure, fixes it, and commits. Learner can intervene at each step.

- [ ] Repository context.
- [ ] File discovery.
- [ ] Code search.
- [ ] AST intuition.
- [ ] Dependency understanding.
- [ ] Shell commands.
- [ ] File editing / patches.
- [ ] Running tests.
- [ ] Reading failures.
- [ ] Iterative repair loop.
- [ ] Git commits.
- [ ] Pull requests.
- [ ] Coding-agent sandboxing.
- [ ] Planning and checkpoints.
- [ ] Verification before completion.
- [ ] Browser automation.
- [ ] DOM.
- [ ] CSS selectors.
- [ ] Browser state.
- [ ] Cookies/sessions.
- [ ] Forms and authentication.
- [ ] Screenshots.
- [ ] Visual grounding.
- [ ] Accessibility trees.
- [ ] Mouse and keyboard actions.
- [ ] Coordinate clicking vs DOM interaction.
- [ ] Action verification.
- [ ] CAPTCHA and anti-bot limitations.
- [ ] Module 17 mastery quiz.

---

# MODULE 18 — Multimodal AI

### Signature interactive
One “AI sensor room” accepts text, image, audio, and video and shows how each modality becomes representations the model can work with.

- [ ] Text models.
- [ ] Vision models.
- [ ] Vision-Language Models / VLMs.
- [ ] Audio models.
- [ ] Speech models.
- [ ] Video models.
- [ ] Multimodal models.
- [ ] Image understanding.
- [ ] Image generation overview.
- [ ] Diffusion models.
- [ ] Latent diffusion.
- [ ] Noise and denoising.
- [ ] Sampling steps.
- [ ] Latent space.
- [ ] VAE intuition.
- [ ] UNet historical role.
- [ ] Diffusion Transformers.
- [ ] Text conditioning.
- [ ] CLIP-style joint representations.
- [ ] ControlNet concept.
- [ ] Inpainting.
- [ ] Outpainting.
- [ ] Image-to-image.
- [ ] Style transfer.
- [ ] Automatic Speech Recognition / ASR.
- [ ] Speech-to-text.
- [ ] Text-to-speech.
- [ ] Voice Activity Detection.
- [ ] Speaker diarization.
- [ ] Voice cloning concept and safety considerations.
- [ ] Streaming audio.
- [ ] Turn detection.
- [ ] Interruptions.
- [ ] Real-time voice-agent architecture.
- [ ] Module 18 mastery quiz.

---

# MODULE 19 — Search, Knowledge Bases & Knowledge Graphs

### Signature interactive
The same question is answered using keyword search, semantic search, hybrid search, and a knowledge graph. Learner sees why each retrieves different evidence.

- [ ] Knowledge bases.
- [ ] Knowledge graphs.
- [ ] Ontologies.
- [ ] Entities.
- [ ] Relationships.
- [ ] Entity resolution.
- [ ] Graph RAG.
- [ ] Keyword search.
- [ ] Semantic search.
- [ ] Vector search.
- [ ] Hybrid search.
- [ ] Web search.
- [ ] Search agents.
- [ ] Query expansion.
- [ ] Query rewriting.
- [ ] Reranking.
- [ ] Source selection.
- [ ] Source credibility.
- [ ] Citation systems.
- [ ] Module 19 mastery quiz.

---

# MODULE 20 — AI APIs & Structured Outputs

### Signature interactive
Build an LLM request visually: model + messages + tools + response schema + generation settings. Send it into a mock endpoint and inspect request/stream/tool response.

- [ ] REST.
- [ ] HTTP basics relevant to AI APIs.
- [ ] JSON.
- [ ] API keys.
- [ ] Bearer tokens.
- [ ] OAuth.
- [ ] Rate limits.
- [ ] Retry policies.
- [ ] Webhooks.
- [ ] Server-Sent Events / SSE.
- [ ] WebSockets.
- [ ] Streaming APIs.
- [ ] Async APIs.
- [ ] Batch APIs.
- [ ] Typical LLM request structure.
- [ ] Model field.
- [ ] Messages/instructions.
- [ ] Tools.
- [ ] Generation controls.
- [ ] Response format.
- [ ] JSON mode.
- [ ] JSON Schema.
- [ ] Type validation.
- [ ] Constrained decoding.
- [ ] Typed outputs.
- [ ] Output parsing.
- [ ] Validation/retry/schema repair.
- [ ] Module 20 mastery quiz.

---

# MODULE 21 — Model Providers & Running Models Locally

### Signature interactive
A “model garage” lets the learner choose model size, precision, hardware, and runtime, then shows expected memory footprint and tradeoffs.

- [ ] Provider vs model.
- [ ] OpenAI ecosystem overview.
- [ ] Anthropic ecosystem overview.
- [ ] Google ecosystem overview.
- [ ] NVIDIA ecosystem overview.
- [ ] Meta/Llama ecosystem overview.
- [ ] Mistral ecosystem overview.
- [ ] DeepSeek ecosystem overview.
- [ ] xAI ecosystem overview.
- [ ] Cohere ecosystem overview.
- [ ] Qwen ecosystem overview.
- [ ] Closed models.
- [ ] Open-weight models.
- [ ] Open-source terminology nuance.
- [ ] Hosted models.
- [ ] Self-hosted models.
- [ ] Model weights.
- [ ] Hugging Face ecosystem.
- [ ] Safetensors.
- [ ] GGUF.
- [ ] Quantization.
- [ ] FP32.
- [ ] FP16.
- [ ] BF16.
- [ ] INT8.
- [ ] INT4.
- [ ] VRAM.
- [ ] RAM.
- [ ] GPU inference.
- [ ] CPU inference.
- [ ] CUDA.
- [ ] ROCm.
- [ ] Apple Metal.
- [ ] llama.cpp.
- [ ] Ollama.
- [ ] vLLM.
- [ ] TensorRT-LLM concept.
- [ ] Module 21 hardware/configuration challenge.
- [ ] Module 21 mastery quiz.

---

# MODULE 22 — Inference & AI Infrastructure

### Signature interactive
Requests enter an inference server. Learner changes batching, replicas, cache, GPU capacity, and request load while watching latency/throughput/cost change live.

- [ ] CPU vs GPU vs TPU.
- [ ] VRAM/HBM intuition.
- [ ] GPU clusters.
- [ ] CUDA role.
- [ ] Inference servers.
- [ ] Model servers.
- [ ] Model loading.
- [ ] Request queue.
- [ ] Scheduler.
- [ ] Prefill.
- [ ] Decode.
- [ ] KV cache in serving.
- [ ] Dynamic batching.
- [ ] Continuous batching.
- [ ] Model replicas.
- [ ] Load balancing.
- [ ] Autoscaling.
- [ ] Serverless inference.
- [ ] Tensor parallelism during inference.
- [ ] Pipeline parallelism during inference.
- [ ] Speculative decoding.
- [ ] Request routing.
- [ ] Streaming responses.
- [ ] GPU utilization.
- [ ] TTFT / Time to First Token.
- [ ] Inter-token latency.
- [ ] Tokens per second.
- [ ] Throughput.
- [ ] Requests per second.
- [ ] Cache hit rate.
- [ ] Module 22 infrastructure simulator challenge.
- [ ] Module 22 mastery quiz.

---

# MODULE 23 — Caching & AI Economics

### Signature interactive
A live cost meter follows one user request through prompt tokens, output tokens, embeddings, tools, retries, and model routing. Learner optimizes the architecture under a budget.

- [ ] Token pricing.
- [ ] Input token cost.
- [ ] Output token cost.
- [ ] Cached token cost.
- [ ] Reasoning/test-time compute cost.
- [ ] Embedding cost.
- [ ] Tool/API cost.
- [ ] GPU cost.
- [ ] Training cost.
- [ ] Fine-tuning cost.
- [ ] Inference cost.
- [ ] Cost per request.
- [ ] Cost per successful task.
- [ ] Token budgets.
- [ ] Agent budgets.
- [ ] Model routing for cost.
- [ ] Prompt cache.
- [ ] Context cache.
- [ ] KV cache.
- [ ] Semantic cache.
- [ ] Response cache.
- [ ] Embedding cache.
- [ ] Tool-result cache.
- [ ] Retrieval cache.
- [ ] Why these caches are not interchangeable.
- [ ] Module 23 “hit the quality target under budget” game.
- [ ] Module 23 mastery quiz.

---

# MODULE 24 — Evals & Observability

### Signature interactive
A broken agent looks fine from the outside. Learner opens its trace, finds the wrong retrieval/tool step, creates an eval, fixes the system, and watches success rate improve.

- [ ] What is an eval?
- [ ] Benchmarks.
- [ ] Test sets.
- [ ] Golden datasets.
- [ ] Human evaluation.
- [ ] LLM-as-a-judge.
- [ ] Pairwise evaluation.
- [ ] Accuracy.
- [ ] Precision.
- [ ] Recall.
- [ ] F1.
- [ ] Groundedness.
- [ ] Faithfulness.
- [ ] Hallucination rate.
- [ ] Tool success rate.
- [ ] Task completion rate.
- [ ] Agent success rate.
- [ ] Cost and latency as eval dimensions.
- [ ] Agent-specific eval: correct tool selection.
- [ ] Agent-specific eval: correct arguments.
- [ ] Agent-specific eval: recovery from errors.
- [ ] Agent-specific eval: stopping behavior.
- [ ] Step count / efficiency.
- [ ] What is observability?
- [ ] Logs.
- [ ] Metrics.
- [ ] Traces.
- [ ] OpenTelemetry concepts.
- [ ] Spans.
- [ ] LLM traces.
- [ ] Agent traces.
- [ ] Tool traces.
- [ ] Prompt/context logging.
- [ ] Token logging.
- [ ] Cost monitoring.
- [ ] Replay/debugging agent runs.
- [ ] Module 24 trace-debugging challenge.
- [ ] Module 24 mastery quiz.

---

# MODULE 25 — Security, Guardrails & Permissions

### Signature interactive
A red-team simulation presents an agent with malicious web content and dangerous actions. Learner configures permissions/guardrails/sandboxing and tries to keep the task useful while blocking compromise.

- [ ] Prompt injection.
- [ ] Indirect prompt injection.
- [ ] Jailbreaking.
- [ ] Data exfiltration.
- [ ] Tool abuse.
- [ ] Credential leakage.
- [ ] System prompt leakage.
- [ ] Model extraction concept.
- [ ] Training-data leakage concept.
- [ ] RAG poisoning.
- [ ] Memory poisoning.
- [ ] Tool poisoning.
- [ ] Malicious MCP servers.
- [ ] Supply-chain risk.
- [ ] Excessive agency.
- [ ] Privilege escalation.
- [ ] Least privilege.
- [ ] Read/write/delete permissions.
- [ ] Financial-action approvals.
- [ ] Tool allowlists/denylists.
- [ ] Network isolation.
- [ ] Filesystem isolation.
- [ ] Credential isolation.
- [ ] Short-lived credentials.
- [ ] Audit trails.
- [ ] Input guardrails.
- [ ] Output guardrails.
- [ ] Tool guardrails.
- [ ] Content filters.
- [ ] Schema validation as guardrail.
- [ ] PII detection.
- [ ] Secret detection.
- [ ] Action limits.
- [ ] Rate limits.
- [ ] Cost limits.
- [ ] Step limits.
- [ ] Human-in-the-loop.
- [ ] Container sandbox.
- [ ] VM sandbox.
- [ ] Browser sandbox.
- [ ] Process isolation.
- [ ] CPU/memory/time limits.
- [ ] Allowed/blocked commands.
- [ ] Module 25 red-team challenge.
- [ ] Module 25 mastery quiz.

---

# MODULE 26 — Reliability & Production Agent Operations

### Signature interactive
A simulated production agent experiences timeouts, API rate limits, malformed outputs, duplicate requests, and worker crashes. Learner adds reliability controls until the system survives.

- [ ] Retries.
- [ ] Exponential backoff.
- [ ] Timeouts.
- [ ] Circuit breakers.
- [ ] Fallback models.
- [ ] Fallback tools.
- [ ] Idempotency.
- [ ] Error classification.
- [ ] Partial failures.
- [ ] Graceful degradation.
- [ ] Durable jobs.
- [ ] Checkpointing.
- [ ] Recovery.
- [ ] Approval/review/escalation flows.
- [ ] Agent confidence and uncertainty.
- [ ] Sensitive-action handling.
- [ ] Module 26 production incident challenge.
- [ ] Module 26 mastery quiz.

---

# MODULE 27 — Identity, Authentication & Authorization for Agents

### Signature interactive
A user, agent, SaaS backend, and third-party tool each have different credentials. Learner routes identity correctly and sees the security failure when the agent is given the wrong scope.

- [ ] User identity.
- [ ] Agent identity.
- [ ] Service identity.
- [ ] Authentication.
- [ ] Authorization.
- [ ] API keys.
- [ ] OAuth.
- [ ] Service accounts.
- [ ] Scopes.
- [ ] Delegated permissions.
- [ ] Agent credentials.
- [ ] User-delegated credentials.
- [ ] Token exchange concept.
- [ ] Permission boundary design.
- [ ] Module 27 mastery quiz.

---

# MODULE 28 — AI Product & SaaS Architecture

### Signature interactive
Build a production AI application from blocks. The app only “works” when authentication, runtime, model, tools, memory, data, safety, observability, and billing are wired correctly.

- [ ] Complete AI product request lifecycle.
- [ ] Frontend.
- [ ] API/backend.
- [ ] Authentication.
- [ ] Agent runtime.
- [ ] Model router.
- [ ] LLM/model endpoint.
- [ ] Tools.
- [ ] Memory.
- [ ] RAG.
- [ ] Databases.
- [ ] External APIs.
- [ ] Observability.
- [ ] Evals.
- [ ] Safety layer.
- [ ] Multi-tenancy.
- [ ] Users.
- [ ] Organizations/workspaces.
- [ ] API credential handling.
- [ ] Agent definitions.
- [ ] Conversations/runs/tasks.
- [ ] Usage metering.
- [ ] Billing.
- [ ] Quotas.
- [ ] Rate limiting.
- [ ] Audit logs.
- [ ] Agent definition → runtime → harness → model → tools → environment → memory/state loop.
- [ ] Traditional automation vs workflow vs AI workflow vs autonomous agent.
- [ ] Module 28 architecture-builder capstone.
- [ ] Module 28 mastery quiz.

---

# MODULE 29 — Model & Agent Limitations

### Signature interactive
“Failure museum”: learners trigger common failures intentionally and identify which layer caused them.

- [ ] Hallucination.
- [ ] Context limits.
- [ ] Knowledge freshness/cutoff.
- [ ] Numerical errors.
- [ ] Logical errors.
- [ ] Tool misuse.
- [ ] Prompt sensitivity.
- [ ] Instruction conflicts.
- [ ] Data bias.
- [ ] Non-determinism.
- [ ] Reasoning failures.
- [ ] Planning failures.
- [ ] Long-horizon degradation.
- [ ] Retrieval failures.
- [ ] Memory failures.
- [ ] Agent loop failures.
- [ ] “Model problem” vs “system problem”.
- [ ] Module 29 diagnosis challenge.
- [ ] Module 29 mastery quiz.

---

# MODULE 30 — Advanced AI Research Concepts

### Signature interactive
A research map links advanced concepts back to the practical mechanisms the learner already understands.

- [ ] Scaling laws in more depth.
- [ ] In-context learning.
- [ ] Emergence and interpretation caveats.
- [ ] Mechanistic interpretability.
- [ ] Sparse autoencoders.
- [ ] Representation engineering.
- [ ] Model editing.
- [ ] Activation steering.
- [ ] Alignment.
- [ ] Reward hacking.
- [ ] Goal misgeneralization.
- [ ] Distribution shift.
- [ ] Interpretability vs explainability.
- [ ] Module 30 mastery quiz.

---

# MODULE 31 — Final Mental Model: Deconstruct Any AI System

The final module turns the entire course into one reusable mental model.

Learner must be able to identify:

- [ ] **MODEL** — where learned intelligence lives.
- [ ] **CONTEXT** — what the model can currently see.
- [ ] **PROMPT/INSTRUCTIONS** — what the model is being asked to do.
- [ ] **RAG** — external information retrieved for this task.
- [ ] **MEMORY** — information intentionally persisted between interactions.
- [ ] **TOOLS** — external actions the system can execute.
- [ ] **HARNESS** — machinery operating the model as an agent.
- [ ] **AGENT LOOP** — repeated decision/action/observation cycle.
- [ ] **FRAMEWORK** — developer abstractions used to construct the system.
- [ ] **ORCHESTRATOR** — coordinates tasks, workers, agents, and workflows.
- [ ] **ROUTER** — selects model/agent/path.
- [ ] **STATE** — where execution currently stands.
- [ ] **INFRASTRUCTURE** — compute/runtime/serving foundation.
- [ ] **EVALS** — how we know whether it works.
- [ ] **GUARDRAILS** — what it is allowed to do.
- [ ] **OBSERVABILITY** — how we know what happened.
- [ ] **ECONOMICS** — what quality/latency/cost tradeoff makes it viable.

### Final capstone

- [ ] Present a fictional ChatGPT-like assistant and have learner decompose the architecture.
- [ ] Present a coding agent and have learner decompose the architecture.
- [ ] Present a support RAG agent and have learner decompose the architecture.
- [ ] Present a multi-agent research system and have learner decompose the architecture.
- [ ] Present a deliberately broken architecture and have learner repair it.
- [ ] Final comprehensive assessment.
- [ ] Generate shareable completion certificate/profile.

---

# 7. Cross-Curriculum “Interactive Labs”

These should feel like mini-products, not quiz widgets.

- [ ] **Token Lab** — inspect tokenization across sample tokenizers.
- [ ] **Next Token Arcade** — guess the next token before revealing probabilities.
- [ ] **Temperature Machine** — visual randomness controlled by temperature/top-p/top-k.
- [ ] **Vector Galaxy** — explore semantic neighborhoods.
- [ ] **Neural Network Playground** — train a toy classifier.
- [ ] **Attention Microscope** — inspect attention token-by-token.
- [ ] **Context Tetris** — fit useful information inside a context budget.
- [ ] **RAG Lab** — chunk/retrieve/rerank documents.
- [ ] **Agent Builder** — construct a working agent from primitives.
- [ ] **Tool Call Simulator** — select tools and produce valid arguments.
- [ ] **Memory Lab** — decide what should be remembered and retrieve it later.
- [ ] **MCP Wiring Lab** — connect capabilities to an agent.
- [ ] **Multi-Agent Control Room** — route/delegate work.
- [ ] **Model Router Arena** — optimize quality/cost/latency.
- [ ] **Inference Factory** — batching/cache/replicas/GPU load simulator.
- [ ] **Agent Security Escape Room** — stop prompt injection/tool abuse.
- [ ] **Trace Detective** — debug a failed agent from traces.
- [ ] **AI Cost Challenge** — hit target quality under a fixed budget.
- [ ] **Build the Whole System** — final architecture canvas.

---

# 8. Content Quality Rules

- [ ] Lead with concrete examples before abstractions.
- [ ] Define every new technical word on first use.
- [ ] Never use an analogy that creates a technically false mental model without immediately showing its limit.
- [ ] Use the same conceptual vocabulary consistently across lessons.
- [ ] Clearly mark simplifications: “The real version has more detail; this is the part that matters first.”
- [ ] Separate facts from debated interpretations.
- [ ] Never imply the model is literally conscious, thinking like a human, or “looking up” an answer unless the system actually performs retrieval.
- [ ] When saying a model “remembers,” specify whether this means context, persistent application memory, or learned weights.
- [ ] When saying a model “uses a tool,” make clear that the model generally emits a structured request and external code executes the action.
- [ ] When teaching agents, always separate the model from the harness/runtime around it.
- [ ] Add “common misconception” callouts to every major lesson.
- [ ] Add at least one real-world architecture example per module.

---

# 9. Accessibility & Performance

- [ ] Keyboard-accessible interactions.
- [ ] Screen-reader descriptions for every meaningful visualization.
- [ ] Non-color-only encoding for state differences.
- [ ] Reduced-motion mode.
- [ ] Captions/transcripts for any narration.
- [ ] Touch targets sized for mobile.
- [ ] Performance budget for simulations.
- [ ] Avoid unnecessary 3D/WebGL on low-power devices.
- [ ] Dynamically simplify particle counts/visual density for weak hardware.
- [ ] Persist learner work locally during connection loss where possible.

---

# 10. Analytics We Actually Care About

Do not optimize only for pageviews.

- [ ] Lesson start rate.
- [ ] Lesson completion rate.
- [ ] Drop-off by lesson step.
- [ ] Time spent interacting vs passively reading.
- [ ] Interaction replay/reset rate.
- [ ] Quiz first-try correctness.
- [ ] Quiz retry correctness.
- [ ] Concept mastery progression.
- [ ] Review success rate.
- [ ] “I understand this now” self-rating.
- [ ] Return rate / streak.
- [ ] Path progression.
- [ ] Performance errors by device.
- [ ] Simulation error rate.

---

# 11. SEO & Public Knowledge Surface

Even though the course is interactive, every core topic should still be indexable and shareable.

- [ ] One canonical URL per concept/lesson.
- [ ] Server-rendered title, definition, summary, prerequisites, and glossary metadata.
- [ ] Dynamic Open Graph image per lesson.
- [ ] Structured metadata where appropriate.
- [ ] Accessible static explanation fallback when JS interaction is unavailable.
- [ ] Internal links between prerequisite concepts.
- [ ] Public glossary generated from lesson concept definitions.
- [ ] Public “AI map” page linking every topic.
- [ ] Avoid hiding valuable educational text entirely inside canvas/WebGL.

---

# 12. Testing Strategy

- [ ] Unit-test mathematical/simulation logic separately from animation.
- [ ] Snapshot/test lesson schemas.
- [ ] E2E test lesson completion.
- [ ] E2E test every quiz format.
- [ ] E2E test anonymous progress → authenticated merge.
- [ ] E2E test reduced motion.
- [ ] Visual regression test signature interactives.
- [ ] Mobile interaction tests.
- [ ] Test lesson completion after refresh/resume.
- [ ] Test incorrect answers and recovery paths.
- [ ] Test simulations with extreme slider/input values.

---

# 13. Development Checkpoints

We will build the product in vertical slices so every checkpoint produces something usable rather than creating 31 empty modules.

## CHECKPOINT 0 — Foundation & Experience Prototype

- [ ] Initialize application.
- [ ] Set up global visual system.
- [ ] Build navigation shell.
- [ ] Build learning-map prototype.
- [ ] Build `LessonShell`.
- [ ] Build progress bar.
- [ ] Build quiz engine v1.
- [ ] Build animation primitives.
- [ ] Build `TokenStream`.
- [ ] Build `ProbabilityBars`.
- [ ] Build one homepage live demo.
- [ ] Verify desktop/mobile/reduced motion.

**Exit criteria:** Someone can open the site, start a lesson, interact, answer a quiz, complete it, and return to a visibly updated learning path.

## CHECKPOINT 1 — Module 1: AI From Absolute Zero

- [ ] Build complete Module 1 content.
- [ ] Build sorting/learning simulation.
- [ ] Build all Module 1 quizzes.
- [ ] Add module completion state.
- [ ] User-test explanations against “10-year-old clarity” standard.

**Exit criteria:** A person with no technical background can correctly explain AI vs ML vs deep learning, training vs inference, and basic learning paradigms.

## CHECKPOINT 2 — Neural Network Playground

- [ ] Build Module 2.
- [ ] Build real client-side toy neural network simulation.
- [ ] Visualize weights, activations, forward pass, loss, and training.
- [ ] Add guided presets so beginners cannot get lost.

## CHECKPOINT 3 — Tokens, Embeddings & LLM Generation

- [ ] Build Modules 3 and 5 core interactives.
- [ ] Tokenization playground.
- [ ] Vector playground.
- [ ] Next-token probability simulation.
- [ ] Temperature/top-k/top-p simulator.

## CHECKPOINT 4 — Transformer Visualizer

- [ ] Build Module 4.
- [ ] Create signature transformer walkthrough.
- [ ] Create attention heatmap and attention-line interactions.
- [ ] Q/K/V interactive.
- [ ] KV-cache animation.

## CHECKPOINT 5 — Context, Prompting & RAG

- [ ] Build Modules 6 and 9.
- [ ] Context stack visualizer.
- [ ] Context budget game.
- [ ] RAG chunk/retrieval/reranking lab.

## CHECKPOINT 6 — Agents

- [ ] Build Modules 10–15.
- [ ] Agent-loop simulator.
- [ ] Harness builder.
- [ ] Tool-call simulator.
- [ ] MCP visualizer.
- [ ] Memory lab.
- [ ] Multi-agent orchestrator lab.

## CHECKPOINT 7 — Systems of Models & Applied Agents

- [ ] Build Modules 16–20.
- [ ] Model router game.
- [ ] Coding-agent walkthrough.
- [ ] Browser/computer-use visualizer.
- [ ] Multimodal room.
- [ ] API request builder.

## CHECKPOINT 8 — Production AI

- [ ] Build Modules 21–28.
- [ ] Local-model hardware explorer.
- [ ] Inference-factory simulator.
- [ ] AI cost challenge.
- [ ] Trace detective.
- [ ] Security escape room.
- [ ] Reliability incident simulator.
- [ ] Identity/permissions lab.
- [ ] Full AI architecture builder.

## CHECKPOINT 9 — Limitations, Research & Final Capstone

- [ ] Build Modules 29–31.
- [ ] Failure museum.
- [ ] Advanced research map.
- [ ] Final architecture-decomposition capstone.
- [ ] Final assessment.
- [ ] Completion profile/certificate.

## CHECKPOINT 10 — Retention, Polish & Scale

- [ ] Review queue.
- [ ] Spaced repetition.
- [ ] Daily challenge.
- [ ] Streak.
- [ ] XP and badges.
- [ ] Optional leaderboard.
- [ ] Search/glossary.
- [ ] Analytics dashboards.
- [ ] SEO pass.
- [ ] Accessibility pass.
- [ ] Performance pass.
- [ ] Content QA across entire curriculum.

---

# 14. Definition of Done for Every Lesson

A lesson is **not done** because the copy exists.

Before checking a lesson complete:

- [ ] Beginner explanation exists.
- [ ] Technically accurate explanation exists.
- [ ] Expert layer exists where warranted.
- [ ] Signature visual is implemented.
- [ ] At least one meaningful interaction is implemented.
- [ ] Interaction teaches cause/effect, not decoration.
- [ ] Prediction/reveal moment exists where useful.
- [ ] Common misconception is addressed.
- [ ] Real-world application is shown.
- [ ] Quiz exists.
- [ ] Wrong-answer explanations exist.
- [ ] Progress is persisted.
- [ ] Mobile layout works.
- [ ] Keyboard accessibility works.
- [ ] Reduced-motion state works.
- [ ] Performance is acceptable.
- [ ] Content has been checked for technical accuracy.

---

# 15. First Build Target

**We start with CHECKPOINT 0, then build Module 1 completely before expanding horizontally.**

The first production-quality experience should prove the entire philosophy with one path:

`What is AI?` → `AI vs normal software` → `Machine Learning` → `Training vs inference` → `How machines learn from examples` → `Module quiz`

The first lesson should contain a signature interaction in which the learner teaches a tiny visual machine using examples and can immediately see the difference between:

1. manually writing rules, and
2. allowing a model to learn a pattern from data.

If that first lesson does not feel unusually good, we do **not** rush into building 100 lessons. We improve the lesson engine and interaction language first, then scale it across the curriculum.

---

# 16. Guiding Principle

By the end, the learner should not merely recognize vocabulary.

They should be able to look at almost any modern AI product and mentally ask:

> What is the model? What context can it see? Where does memory live? What retrieves knowledge? What tools can act? What harness controls the loop? What framework built it? How is work orchestrated? Who chooses the model? Where is state stored? What infrastructure runs it? How do we evaluate it? What can it access? How do we observe it? And what does one successful task cost?

When they can answer those questions, **AI stops feeling like magic and starts feeling like a system they can reason about and build.**
