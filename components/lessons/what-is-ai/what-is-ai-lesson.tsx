"use client";

import { AnimatePresence, motion, Reorder, useReducedMotion } from "motion/react";
import { ChangeEvent, ReactNode, useEffect, useMemo, useState } from "react";
import { whatIsAiSections } from "@/content/course";
import { LessonProgressApi } from "@/components/course/lesson-shell";
import { ExplanationDepth } from "@/lib/course-progress";

type Props = { progress: LessonProgressApi };

type DepthCopy = Record<ExplanationDepth, ReactNode>;

const depthLabels: Record<ExplanationDepth, string> = {
  simple: "Simple",
  real: "Real",
  expert: "Expert",
};

const aiOrNotItems = [
  { id: "calculator", icon: "🧮", title: "Pocket calculator", detail: "2 + 2 always follows explicit arithmetic rules.", answer: "not" },
  { id: "spam", icon: "📨", title: "Spam filter", detail: "Modern spam filters can learn patterns from examples of spam and normal mail.", answer: "ai" },
  { id: "thermostat", icon: "🌡️", title: "Basic thermostat", detail: "A simple thermostat can be a fixed if-temperature-then-switch rule.", answer: "not" },
  { id: "photos", icon: "🖼️", title: "Photo face finder", detail: "Vision models learn visual patterns that help detect or group faces.", answer: "ai" },
  { id: "recommend", icon: "🎧", title: "Music recommendations", detail: "Recommendation systems learn patterns from behavior and item data.", answer: "ai" },
  { id: "timer", icon: "⏲️", title: "Kitchen timer", detail: "A countdown does exactly what its programmed clock logic says.", answer: "not" },
] as const;

const layers = [
  {
    id: "experience",
    number: "01",
    title: "Experience",
    color: "#ffdf3f",
    simple: "The part you touch: chat box, microphone, camera, buttons.",
    real: "The interface collects input and shows the system's output. It is not the intelligence itself.",
    expert: "Presentation and interaction layer: UI, modality capture, streaming output, stateful client behavior and user controls.",
  },
  {
    id: "system",
    number: "02",
    title: "AI system",
    color: "#ff6d5a",
    simple: "The organizer around the brain. It decides what the AI can see and do.",
    real: "Prompts, context, tools, memory, retrieval, safety rules and application logic wrap around the model.",
    expert: "The application/harness composes context, mediates capabilities, handles tool I/O, state, policies, orchestration and retries.",
  },
  {
    id: "model",
    number: "03",
    title: "Model",
    color: "#6f65ff",
    simple: "A giant pattern machine made from numbers learned during training.",
    real: "A trained neural network transforms input representations into useful predictions or generated output.",
    expert: "A parameterized function whose learned weights map high-dimensional inputs to output distributions via repeated tensor operations.",
  },
  {
    id: "layers",
    number: "04",
    title: "Network layers",
    color: "#4ed7b1",
    simple: "Many tiny transformation steps stacked one after another.",
    real: "Layers repeatedly transform representations, letting later stages work with richer features than earlier stages.",
    expert: "Composition of learned transformations; in LLMs this is typically repeated transformer blocks containing attention and MLP sublayers.",
  },
  {
    id: "weights",
    number: "05",
    title: "Weights",
    color: "#ff9ed0",
    simple: "Millions or billions of little number knobs that training adjusts.",
    real: "Weights control how strongly signals influence later computations. Learning changes these values.",
    expert: "Trainable tensors optimized to reduce a loss objective using gradients; collectively they encode distributed statistical structure.",
  },
  {
    id: "math",
    number: "06",
    title: "Math",
    color: "#55bcff",
    simple: "Underneath everything, the machine is doing lots of number operations very fast.",
    real: "Vectors and matrices are multiplied, added and transformed to produce scores and probabilities.",
    expert: "Dense linear algebra dominates compute: matrix multiplications, normalization, nonlinearities and probability normalization over output logits.",
  },
  {
    id: "data",
    number: "07",
    title: "Data + training",
    color: "#b9f66d",
    simple: "Examples are the practice material. Training is the practice session.",
    real: "The model makes predictions on data, measures error, then adjusts weights so future predictions improve.",
    expert: "Optimization minimizes an objective over batches of training examples, usually through backpropagation and variants of gradient descent.",
  },
] as const;

const quizQuestions = [
  {
    q: "Which description is the best beginner definition of AI?",
    options: [
      "Any computer program",
      "A computer system that uses learned or designed intelligence-like methods to make useful predictions, decisions or generations",
      "A robot that looks human",
      "A database with lots of information",
    ],
    correct: 1,
    why: "AI is a broad family of systems. The key is the capability to perform tasks that involve prediction, perception, language, decision-making or generation—not whether it looks like a robot.",
  },
  {
    q: "What is the clearest difference between a simple rule program and a learned model?",
    options: [
      "A learned model must use the internet",
      "A rule program has no code",
      "In a rule program humans specify the decision rules; in machine learning the system learns useful patterns from examples",
      "A learned model is always more accurate",
    ],
    correct: 2,
    why: "Machine learning does not remove software or human design. It changes where some behavior comes from: learned parameters rather than only hand-written decision rules.",
  },
  {
    q: "During training, what is being adjusted inside a neural model?",
    options: ["The user's screen", "Weights / parameters", "The keyboard", "Only the dataset"],
    correct: 1,
    why: "Training uses error signals to adjust model parameters. Those numbers influence how future inputs are transformed.",
  },
  {
    q: "When a trained model receives a new input and produces an output, that phase is called…",
    options: ["Inference", "Backpropagation", "Data labeling", "Checkpointing"],
    correct: 0,
    why: "Inference means using the already-trained model to produce predictions or generations for new inputs.",
  },
  {
    q: "Which nesting is most useful as a first mental model?",
    options: [
      "Deep Learning contains AI contains Machine Learning",
      "AI contains Machine Learning, and Machine Learning contains Deep Learning",
      "Machine Learning and AI are unrelated",
      "AI and Deep Learning mean exactly the same thing",
    ],
    correct: 1,
    why: "AI is the broad umbrella. Machine learning is one approach to AI; deep learning is a machine-learning approach based on multi-layer neural networks.",
  },
  {
    q: "Why is an AI output often better thought of as a prediction than a fact retrieved from a tiny database?",
    options: [
      "Because AI never stores any information",
      "Because the model computes scores/probabilities from learned patterns for the current input",
      "Because probability means the output is random nonsense",
      "Because models cannot use tools or retrieval",
    ],
    correct: 1,
    why: "A model computes an output from learned parameters and the current input. An AI application can also add databases or search tools, but that is a system capability around the model.",
  },
] as const;

function LessonSection({ id, className = "", onVisit, children }: { id: string; className?: string; onVisit: (id: string) => void; children: ReactNode }) {
  useEffect(() => {
    const element = document.getElementById(id);
    if (!element) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting && entry.intersectionRatio >= 0.4)) onVisit(id);
    }, { threshold: [0.4, 0.65] });
    observer.observe(element);
    return () => observer.disconnect();
  }, [id, onVisit]);

  return (
    <motion.section
      id={id}
      className={`lesson-scene ${className}`}
      initial={{ opacity: 0, y: 28, scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: 0.5, ease: [0, 0, 0.2, 1] }}
    >
      {children}
    </motion.section>
  );
}

function DepthSwitch({ value, onChange }: { value: ExplanationDepth; onChange: (depth: ExplanationDepth) => void }) {
  return (
    <div className="depth-switch" role="group" aria-label="Explanation depth">
      {(Object.keys(depthLabels) as ExplanationDepth[]).map((depth) => (
        <button key={depth} className={value === depth ? "active" : ""} onClick={() => onChange(depth)}>
          {depthLabels[depth]}
        </button>
      ))}
    </div>
  );
}

function TaskStamp({ done, children }: { done: boolean; children: ReactNode }) {
  return (
    <motion.div className={`task-stamp ${done ? "done" : ""}`} animate={done ? { rotate: [0, -2, 1, 0], scale: [1, 1.08, 1] } : undefined}>
      <span>{done ? "✓" : "◆"}</span>{children}
    </motion.div>
  );
}

function Mascot({ mood = "happy", label = "BYTE" }: { mood?: "happy" | "thinking" | "wow"; label?: string }) {
  return (
    <motion.div className={`mascot mascot-${mood}`} animate={{ y: [0, -7, 0], rotate: [0, 1, -1, 0] }} transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}>
      <div className="mascot-antenna"><i /></div>
      <div className="mascot-face"><i className="eye left" /><i className="eye right" /><b className="mouth" /></div>
      <div className="mascot-label">{label}</div>
      <motion.span className="mascot-hand hand-left" animate={{ rotate: [12, -22, 12] }} transition={{ duration: 2.2, repeat: Infinity }} />
      <span className="mascot-hand hand-right" />
    </motion.div>
  );
}

function getDepth(copy: DepthCopy, depth: ExplanationDepth) {
  return copy[depth];
}

export function WhatIsAiLesson({ progress }: Props) {
  const reducedMotion = useReducedMotion();
  const [aiAnswers, setAiAnswers] = useState<Record<string, "ai" | "not">>({});
  const [moveStage, setMoveStage] = useState(0);
  const [fedExamples, setFedExamples] = useState<string[]>([]);
  const [trained, setTrained] = useState(false);
  const [selectedLayer, setSelectedLayer] = useState(0);
  const [seenLayers, setSeenLayers] = useState<string[]>([]);
  const [epochs, setEpochs] = useState(0);
  const [trainingFrozen, setTrainingFrozen] = useState(false);
  const [temperature, setTemperature] = useState(0.45);
  const [temperatureMoved, setTemperatureMoved] = useState(false);
  const [samples, setSamples] = useState<string[]>([]);
  const [familyOrder, setFamilyOrder] = useState(["Deep Learning", "AI", "Machine Learning"]);
  const [explanation, setExplanation] = useState("");
  const [explanationFeedback, setExplanationFeedback] = useState("");

  const allAiAnswered = aiOrNotItems.every((item) => aiAnswers[item.id]);
  const aiCorrect = aiOrNotItems.filter((item) => aiAnswers[item.id] === item.answer).length;

  useEffect(() => {
    if (allAiAnswered) progress.completeTask("ai-or-not");
  }, [allAiAnswered, progress]);

  useEffect(() => {
    if (moveStage >= 3) progress.completeTask("three-moves");
  }, [moveStage, progress]);

  useEffect(() => {
    if (trained && fedExamples.length === 6) progress.completeTask("teach-machine");
  }, [trained, fedExamples.length, progress]);

  useEffect(() => {
    if (seenLayers.length === layers.length) progress.completeTask("inspect-layers");
  }, [seenLayers.length, progress]);

  useEffect(() => {
    if (trainingFrozen && epochs >= 8) progress.completeTask("training-loop");
  }, [trainingFrozen, epochs, progress]);

  useEffect(() => {
    if (temperatureMoved && samples.length >= 3) progress.completeTask("probability-lab");
  }, [temperatureMoved, samples.length, progress]);

  useEffect(() => {
    if (familyOrder.join("|") === "AI|Machine Learning|Deep Learning") progress.completeTask("family-tree");
  }, [familyOrder, progress]);

  const sampleProbabilities = useMemo(() => {
    const sharpness = Math.max(0.2, 1.55 - temperature);
    const raw = [0.58, 0.23, 0.12, 0.07].map((p) => Math.pow(p, sharpness));
    const total = raw.reduce((a, b) => a + b, 0);
    return raw.map((p) => p / total);
  }, [temperature]);

  const outputWords = ["blue", "clear", "bright", "falling"];
  const runSample = () => {
    const r = Math.random();
    let cursor = 0;
    const index = sampleProbabilities.findIndex((p) => {
      cursor += p;
      return r <= cursor;
    });
    const word = outputWords[index < 0 ? 0 : index];
    setSamples((current) => [...current.slice(-4), word]);
  };

  const submitExplanation = () => {
    const normalized = explanation.toLowerCase();
    const conceptHits = ["pattern", "learn", "example", "data", "guess", "predict", "decision", "generate"].filter((word) => normalized.includes(word));
    if (explanation.trim().length < 45) {
      setExplanationFeedback("Go one step deeper. Try at least two sentences: what goes in, what the system learns or uses, and what comes out.");
      return;
    }
    if (conceptHits.length < 2) {
      setExplanationFeedback("Good start. Add the mechanism: mention patterns, examples/data, learning, prediction, decisions or generation.");
      return;
    }
    setExplanationFeedback("That mental model is strong enough to move on. You described AI as a mechanism, not magic.");
    progress.completeTask("explain-back");
  };

  const requiredTasks = whatIsAiSections.map((section) => section.taskId);
  const tasksDone = requiredTasks.filter((id) => progress.completedTasks[id]).length;
  const sectionsRead = whatIsAiSections.filter((section) => progress.visitedSections.has(section.id)).length;
  const quizUnlocked = tasksDone === requiredTasks.length && sectionsRead === whatIsAiSections.length;

  return (
    <main className="lesson-main">
      <div className="ambient-world" aria-hidden="true">
        <motion.i className="ambient-shape shape-a" animate={reducedMotion ? undefined : { y: [0, 20, 0], rotate: [5, 18, 5] }} transition={{ duration: 8, repeat: Infinity }} />
        <motion.i className="ambient-shape shape-b" animate={reducedMotion ? undefined : { y: [0, -18, 0], x: [0, 12, 0] }} transition={{ duration: 6, repeat: Infinity }} />
        <motion.i className="ambient-shape shape-c" animate={reducedMotion ? undefined : { rotate: [0, 360] }} transition={{ duration: 18, repeat: Infinity, ease: "linear" }} />
      </div>

      <section className="lesson-hero">
        <div className="hero-copy">
          <motion.span className="eyebrow hero-eyebrow" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>LESSON 01 · FOUNDATIONS</motion.span>
          <motion.h1 initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.46 }}>
            What <em>is</em><br />Artificial Intelligence?
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}>
            You&apos;re not going to memorize a definition. You&apos;re going to open an AI system, train a tiny learner, break its guesses, and rebuild the idea from the inside out.
          </motion.p>
          <div className="hero-controls">
            <DepthSwitch value={progress.depth} onChange={progress.setDepth} />
            <span className="lesson-time">~24 MIN · 8 ACTIVITIES · QUIZ</span>
          </div>
        </div>
        <div className="hero-stage" aria-hidden="true">
          <Mascot mood="wow" />
          <motion.div className="hero-orbit orbit-one" animate={reducedMotion ? undefined : { rotate: 360 }} transition={{ duration: 14, repeat: Infinity, ease: "linear" }}><span>DATA</span></motion.div>
          <motion.div className="hero-orbit orbit-two" animate={reducedMotion ? undefined : { rotate: -360 }} transition={{ duration: 11, repeat: Infinity, ease: "linear" }}><span>PATTERN</span></motion.div>
          <motion.div className="hero-bubble bubble-one" animate={reducedMotion ? undefined : { y: [0, -10, 0], scale: [1, 1.05, 1] }} transition={{ duration: 2.7, repeat: Infinity }}>?</motion.div>
          <motion.div className="hero-bubble bubble-two" animate={reducedMotion ? undefined : { y: [0, 9, 0], rotate: [0, 8, 0] }} transition={{ duration: 3.1, repeat: Infinity }}>42%</motion.div>
          <div className="hero-floor"><i /><i /><i /><i /></div>
        </div>
      </section>

      <div className="lesson-trail" aria-label="Lesson progress trail">
        {whatIsAiSections.map((section, index) => {
          const done = Boolean(progress.completedTasks[section.taskId]);
          return <a key={section.id} href={`#${section.id}`} className={done ? "done" : progress.visitedSections.has(section.id) ? "visited" : ""}><b>{index + 1}</b><span>{section.title}</span></a>;
        })}
        <a href="#quiz" className={progress.quizPassed ? "done" : quizUnlocked ? "visited" : "locked"}><b>★</b><span>Quiz</span></a>
      </div>

      <LessonSection id="cold-open" className="scene-cold-open" onVisit={progress.markVisited}>
        <div className="scene-heading split-heading">
          <div>
            <span className="scene-number">01</span>
            <span className="eyebrow">COLD OPEN · MAKE A PREDICTION</span>
            <h2>Which ones are actually AI?</h2>
          </div>
          <div className="sticky-note">Don&apos;t overthink it.<br /><b>Guess first.</b></div>
        </div>
        <p className="scene-lead">Before definitions, test your intuition. For each object, choose <b>AI</b> or <b>NOT AI</b>. You&apos;ll get the explanation immediately.</p>

        <div className="ai-or-not-grid">
          {aiOrNotItems.map((item, index) => {
            const chosen = aiAnswers[item.id];
            const correct = chosen === item.answer;
            return (
              <motion.article key={item.id} className={`decision-card ${chosen ? (correct ? "correct" : "wrong") : ""}`} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} whileHover={{ y: -5, rotate: index % 2 ? 0.5 : -0.5 }}>
                <motion.div className="object-icon" animate={chosen ? { scale: [1, 1.18, 0.98, 1], rotate: [0, -6, 4, 0] } : undefined}>{item.icon}</motion.div>
                <h3>{item.title}</h3>
                {!chosen ? (
                  <div className="binary-choice">
                    <button onClick={() => setAiAnswers((current) => ({ ...current, [item.id]: "ai" }))}>AI</button>
                    <button onClick={() => setAiAnswers((current) => ({ ...current, [item.id]: "not" }))}>NOT AI</button>
                  </div>
                ) : (
                  <AnimatePresence mode="wait">
                    <motion.div className="decision-feedback" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                      <strong>{correct ? "Nice read." : "Sneaky one."}</strong>
                      <p>{item.detail}</p>
                      <button onClick={() => setAiAnswers((current) => { const copy = { ...current }; delete copy[item.id]; return copy; })}>change answer</button>
                    </motion.div>
                  </AnimatePresence>
                )}
              </motion.article>
            );
          })}
        </div>
        <div className="lesson-insight-bar">
          <div><span>YOUR SCORE</span><strong>{aiCorrect}/{aiOrNotItems.length}</strong></div>
          <p>{allAiAnswered ? "Notice something important: not every clever-looking computer behavior needs AI. A fixed rule can already do a lot." : "Answer all six. The point is to expose your current mental model before we rebuild it."}</p>
        </div>
        <TaskStamp done={Boolean(progress.completedTasks["ai-or-not"])}>Classify all six objects</TaskStamp>
      </LessonSection>

      <LessonSection id="core-idea" className="scene-core-idea" onVisit={progress.markVisited}>
        <div className="scene-heading centered-heading">
          <span className="scene-number">02</span>
          <span className="eyebrow">THE CORE IDEA</span>
          <h2>Most modern AI becomes less mysterious if you remember three moves.</h2>
        </div>

        <div className="depth-explainer big-explainer">
          <span>{depthLabels[progress.depth]} explanation</span>
          <p>{getDepth({
            simple: <>AI looks at examples, spots useful patterns, and uses those patterns to make a <b>guess</b> about something new.</>,
            real: <>Many modern AI systems learn statistical patterns from data. At inference time, those learned patterns are used to estimate likely outputs, classifications, actions or generated content.</>,
            expert: <>A learned model parameterizes a conditional mapping from input representations to output scores or distributions. Training optimizes parameters against an objective; inference applies the learned function to unseen inputs.</>,
          }, progress.depth)}</p>
        </div>

        <div className="three-moves-lab">
          <div className="moves-track">
            <div className={`move-zone ${moveStage >= 1 ? "active" : ""}`}><span>1</span><b>SEE</b><small>examples + data</small></div>
            <div className={`move-zone ${moveStage >= 2 ? "active" : ""}`}><span>2</span><b>FIND</b><small>useful patterns</small></div>
            <div className={`move-zone ${moveStage >= 3 ? "active" : ""}`}><span>3</span><b>GUESS</b><small>something new</small></div>
            <motion.button
              className="learning-spark"
              drag="x"
              dragConstraints={{ left: 0, right: 610 }}
              dragElastic={0.08}
              onDrag={(_, info) => setMoveStage(Math.max(moveStage, info.offset.x > 420 ? 3 : info.offset.x > 210 ? 2 : info.offset.x > 35 ? 1 : 0))}
              onDragEnd={(_, info) => setMoveStage(Math.max(moveStage, info.offset.x > 420 ? 3 : info.offset.x > 210 ? 2 : info.offset.x > 35 ? 1 : 0))}
              whileTap={{ scale: 0.9 }}
              aria-label="Drag the learning spark across the three AI moves"
            >
              ✦
            </motion.button>
          </div>
          <p className="interaction-hint">← Grab the spark and drag it through all three stages. On touch devices, slide it with your finger.</p>
        </div>
        <div className="concept-cards-row">
          <article><span>👀</span><strong>Examples</strong><p>Pictures, text, clicks, sensor readings, game states… data can take many forms.</p></article>
          <article><span>🧩</span><strong>Patterns</strong><p>The model does not need a human to manually write every possible rule.</p></article>
          <article><span>🎯</span><strong>Prediction</strong><p>The output might be a class, number, next word, image, action, ranking or decision score.</p></article>
        </div>
        <TaskStamp done={Boolean(progress.completedTasks["three-moves"])}>Drag the spark through See → Find → Guess</TaskStamp>
      </LessonSection>

      <LessonSection id="rules-vs-learning" className="scene-rules-learning" onVisit={progress.markVisited}>
        <div className="scene-heading split-heading">
          <div>
            <span className="scene-number">03</span>
            <span className="eyebrow">RULES VS LEARNING</span>
            <h2>Teach a machine without writing every rule.</h2>
          </div>
          <Mascot mood="thinking" label="ADA" />
        </div>

        <div className="rules-compare">
          <article className="rule-machine-card">
            <span className="machine-tag">NORMAL SOFTWARE</span>
            <h3>You write the decision recipe.</h3>
            <div className="code-block">
              <code>IF ears = pointy</code>
              <code>AND whiskers = yes</code>
              <code>THEN cat</code>
            </div>
            <p>Great when the rules are known, stable and manageable.</p>
          </article>
          <motion.div className="versus-badge" animate={reducedMotion ? undefined : { rotate: [-4, 5, -4], scale: [1, 1.05, 1] }} transition={{ duration: 2.5, repeat: Infinity }}>VS</motion.div>
          <article className="learn-machine-card">
            <span className="machine-tag">MACHINE LEARNING</span>
            <h3>You give examples. Training adjusts the model.</h3>
            <div className="mini-neural-net"><i /><i /><i /><i /><i /><i /><i /></div>
            <p>Useful when the pattern is hard to express as a giant hand-written rulebook.</p>
          </article>
        </div>

        <div className="feed-the-machine">
          <div className="training-examples">
            <div className="training-examples-head"><span>TRAINING EXAMPLES</span><strong>{fedExamples.length}/6 fed</strong></div>
            {["🐱 cat", "🐶 dog", "🐱 cat", "🐶 dog", "🐱 cat", "🐶 dog"].map((label, index) => {
              const id = `example-${index}`;
              const fed = fedExamples.includes(id);
              return (
                <motion.button
                  key={id}
                  className={`training-chip ${fed ? "fed" : ""}`}
                  drag={!fed ? "x" : false}
                  dragConstraints={{ left: 0, right: 360 }}
                  dragSnapToOrigin
                  whileDrag={{ scale: 1.12, rotate: index % 2 ? 4 : -4, zIndex: 3 }}
                  whileTap={{ scale: 0.96 }}
                  onDragEnd={(_, info) => {
                    if (info.offset.x > 135 && !fed) setFedExamples((current) => [...current, id]);
                  }}
                  onClick={() => !fed && setFedExamples((current) => [...current, id])}
                  disabled={fed}
                >
                  {fed ? "✓ learned example" : label}
                </motion.button>
              );
            })}
            <small>Drag → toward the learner, or tap an example.</small>
          </div>

          <div className={`tiny-learner ${fedExamples.length === 6 ? "ready" : ""} ${trained ? "trained" : ""}`}>
            <motion.div className="learner-head" animate={fedExamples.length ? { scale: [1, 1.025, 1] } : undefined} transition={{ repeat: Infinity, duration: 1.6 }}>
              <i className="learner-eye left" /><i className="learner-eye right" />
              <b>{trained ? "I found a pattern!" : fedExamples.length === 6 ? "Ready to train." : "Feed me examples."}</b>
            </motion.div>
            <div className="learner-memory-slots">
              {Array.from({ length: 6 }).map((_, index) => <motion.i key={index} animate={index < fedExamples.length ? { scale: [0, 1.3, 1] } : {}} className={index < fedExamples.length ? "filled" : ""} />)}
            </div>
            <button className="train-button tactile" disabled={fedExamples.length < 6 || trained} onClick={() => setTrained(true)}>
              {trained ? "TRAINED ✓" : fedExamples.length < 6 ? `NEED ${6 - fedExamples.length} MORE` : "TRAIN TINY MODEL"}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {trained && (
            <motion.div className="mystery-test" initial={{ opacity: 0, y: 22, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }}>
              <div className="mystery-animal">🐱</div>
              <div><span>NEW EXAMPLE</span><h3>“cat” <b>92%</b></h3><p>The model was never handed an explicit “pointy ears + whiskers” rule. Training changed internal parameters so this new input lands closer to the learned cat pattern.</p></div>
            </motion.div>
          )}
        </AnimatePresence>

        <TaskStamp done={Boolean(progress.completedTasks["teach-machine"])}>Feed six examples and train the tiny learner</TaskStamp>
      </LessonSection>

      <LessonSection id="layers" className="scene-layers" onVisit={progress.markVisited}>
        <div className="scene-heading centered-heading inverted-heading">
          <span className="scene-number">04</span>
          <span className="eyebrow">X-RAY MODE</span>
          <h2>“AI” is not one thing.<br />Open the machine.</h2>
          <p>Click every layer. The outer experience is only the top shell.</p>
        </div>

        <div className="layer-lab">
          <div className="layer-stack">
            {layers.map((layer, index) => {
              const seen = seenLayers.includes(layer.id);
              return (
                <motion.button
                  key={layer.id}
                  className={`layer-slab ${selectedLayer === index ? "selected" : ""}`}
                  style={{ background: layer.color, zIndex: layers.length - index }}
                  animate={{ x: selectedLayer === index ? 22 : 0, rotate: selectedLayer === index ? -0.6 : 0 }}
                  whileHover={{ x: 12 }}
                  onClick={() => {
                    setSelectedLayer(index);
                    setSeenLayers((current) => seen ? current : [...current, layer.id]);
                  }}
                >
                  <span>{layer.number}</span><strong>{layer.title}</strong><b>{seen ? "✓" : "+"}</b>
                </motion.button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.article key={`${layers[selectedLayer].id}-${progress.depth}`} className="layer-detail" initial={{ opacity: 0, x: 26, rotate: 0.6 }} animate={{ opacity: 1, x: 0, rotate: 0 }} exit={{ opacity: 0, x: -18 }} transition={{ duration: 0.24 }}>
              <div className="layer-detail-head">
                <span style={{ background: layers[selectedLayer].color }}>{layers[selectedLayer].number}</span>
                <div><small>YOU OPENED</small><h3>{layers[selectedLayer].title}</h3></div>
              </div>
              <DepthSwitch value={progress.depth} onChange={progress.setDepth} />
              <p className="layer-big-copy">{layers[selectedLayer][progress.depth]}</p>
              <div className="layer-not-this">
                <strong>Important distinction</strong>
                <p>{selectedLayer === 0 ? "The chat screen is not the model." : selectedLayer === 1 ? "An agent/system can add memory and tools that the underlying model does not own by itself." : selectedLayer === 2 ? "The model is only one component of a complete AI product." : selectedLayer === 6 ? "Training happens before normal inference use; your everyday prompt usually does not retrain the model." : "This layer contributes to behavior, but it is not the entire AI system."}</p>
              </div>
            </motion.article>
          </AnimatePresence>
        </div>

        <div className="layer-visited-row">
          <span>Layers inspected</span>
          <div>{layers.map((layer) => <i key={layer.id} className={seenLayers.includes(layer.id) ? "done" : ""} style={{ background: seenLayers.includes(layer.id) ? layer.color : undefined }} />)}</div>
          <strong>{seenLayers.length}/{layers.length}</strong>
        </div>
        <TaskStamp done={Boolean(progress.completedTasks["inspect-layers"])}>Open all seven layers</TaskStamp>
      </LessonSection>

      <LessonSection id="training-loop" className="scene-training" onVisit={progress.markVisited}>
        <div className="scene-heading split-heading">
          <div>
            <span className="scene-number">05</span>
            <span className="eyebrow">TRAINING IS PRACTICE</span>
            <h2>Watch error turn into adjustment.</h2>
          </div>
          <div className="loss-ticket"><span>LOSS</span><strong>{Math.max(0.07, 1.05 * Math.exp(-epochs * 0.29)).toFixed(2)}</strong></div>
        </div>

        <div className="training-console">
          <div className="training-loop-visual">
            {["EXAMPLE", "PREDICT", "COMPARE", "ADJUST"].map((label, index) => (
              <motion.div key={label} className="training-step" animate={epochs > 0 && !trainingFrozen ? { scale: [1, 1.08, 1], y: [0, -4, 0] } : undefined} transition={{ delay: index * 0.12, duration: 0.75, repeat: Infinity }}>
                <span>{index + 1}</span><b>{label}</b>
              </motion.div>
            ))}
            <motion.div className="training-arrow arrow-a" animate={reducedMotion ? undefined : { x: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.1 }}>→</motion.div>
            <motion.div className="training-arrow arrow-b" animate={reducedMotion ? undefined : { x: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.1, delay: 0.2 }}>→</motion.div>
            <motion.div className="training-arrow arrow-c" animate={reducedMotion ? undefined : { x: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.1, delay: 0.4 }}>→</motion.div>
          </div>

          <div className="epoch-control">
            <div className="epoch-head"><span>TRAINING ROUNDS</span><strong>{epochs} epochs</strong></div>
            <input type="range" min="0" max="10" step="1" value={epochs} onChange={(event) => { setEpochs(Number(event.target.value)); setTrainingFrozen(false); }} />
            <div className="training-metrics">
              <div><span>mistakes</span><strong>{Math.max(1, 19 - epochs * 2)}</strong></div>
              <div><span>confidence</span><strong>{Math.min(96, 42 + epochs * 5)}%</strong></div>
              <div><span>loss</span><strong>{Math.max(0.07, 1.05 * Math.exp(-epochs * 0.29)).toFixed(2)}</strong></div>
            </div>
            <button className="freeze-button tactile" disabled={epochs < 8} onClick={() => setTrainingFrozen(true)}>{trainingFrozen ? "MODEL CHECKPOINTED ✓" : epochs < 8 ? "TRAIN TO 8+ EPOCHS" : "FREEZE THIS MODEL"}</button>
          </div>
        </div>

        <div className="training-explanation-grid">
          <article><span>1</span><h3>Forward pass</h3><p>The current model produces a prediction from the input.</p></article>
          <article><span>2</span><h3>Measure error</h3><p>A loss function tells training how far the prediction is from the target.</p></article>
          <article><span>3</span><h3>Find direction</h3><p>Gradients estimate how parameter changes would affect the loss.</p></article>
          <article><span>4</span><h3>Update</h3><p>An optimizer nudges weights. Repeat over many batches and examples.</p></article>
        </div>
        <TaskStamp done={Boolean(progress.completedTasks["training-loop"])}>Train to 8+ epochs and freeze a checkpoint</TaskStamp>
      </LessonSection>

      <LessonSection id="probability" className="scene-probability" onVisit={progress.markVisited}>
        <div className="scene-heading split-heading">
          <div>
            <span className="scene-number">06</span>
            <span className="eyebrow">INFERENCE = USING THE TRAINED MODEL</span>
            <h2>AI often gives you its best guess.</h2>
          </div>
          <div className="probability-cloud"><span>?</span><b>%</b><i>≈</i></div>
        </div>

        <div className="probability-lab">
          <div className="prompt-console">
            <span className="console-label">INPUT</span>
            <p>The sky is <motion.b key={samples.at(-1) ?? "_"} initial={{ opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }}>{samples.at(-1) ?? "_____"}</motion.b></p>
            <button className="sample-button tactile" onClick={runSample}>SAMPLE NEXT WORD</button>
            <div className="sample-history">{samples.length ? samples.map((word, index) => <motion.i key={`${word}-${index}`} initial={{ scale: 0 }} animate={{ scale: 1 }}>{word}</motion.i>) : <span>Run at least 3 samples.</span>}</div>
          </div>
          <div className="distribution-panel">
            <div className="temperature-head"><span>TEMPERATURE</span><strong>{temperature.toFixed(2)}</strong></div>
            <input type="range" min="0.1" max="1.5" step="0.05" value={temperature} onChange={(event: ChangeEvent<HTMLInputElement>) => { setTemperature(Number(event.target.value)); setTemperatureMoved(true); }} />
            <p className="slider-caption">Move the slider. Lower = sharper distribution. Higher = more alternatives get a chance.</p>
            <div className="probability-bars">
              {outputWords.map((word, index) => {
                const percentage = Math.round(sampleProbabilities[index] * 100);
                return <div key={word}><span>{word}</span><div><motion.i animate={{ width: `${percentage}%` }} /></div><b>{percentage}%</b></div>;
              })}
            </div>
          </div>
        </div>

        <div className="myth-split">
          <article><span className="myth-label">NOT QUITE</span><h3>“The model looks up the right sentence.”</h3><p>That mental model breaks quickly. A standalone generative model computes output from its learned parameters and current input.</p></article>
          <article><span className="myth-label good">BETTER</span><h3>“The model computes scores for possible outputs.”</h3><p>Applications can additionally use search, databases or RAG—but that is extra system machinery around the model.</p></article>
        </div>
        <TaskStamp done={Boolean(progress.completedTasks["probability-lab"])}>Change temperature and sample at least three outputs</TaskStamp>
      </LessonSection>

      <LessonSection id="family-tree" className="scene-family" onVisit={progress.markVisited}>
        <div className="scene-heading centered-heading">
          <span className="scene-number">07</span>
          <span className="eyebrow">THE FAMILY TREE</span>
          <h2>AI, Machine Learning and Deep Learning are not synonyms.</h2>
          <p>Drag the cards into order from the broadest umbrella to the most specific.</p>
        </div>

        <div className="family-lab">
          <Reorder.Group axis="y" values={familyOrder} onReorder={setFamilyOrder} className="family-reorder">
            {familyOrder.map((item, index) => (
              <Reorder.Item key={item} value={item} className={`family-card family-${item === "AI" ? "ai" : item === "Machine Learning" ? "ml" : "dl"}`} whileDrag={{ scale: 1.035, rotate: index % 2 ? 1.4 : -1.4, boxShadow: "10px 12px 0 #111" }}>
                <span>{index + 1}</span><strong>{item}</strong><b>↕ drag</b>
              </Reorder.Item>
            ))}
          </Reorder.Group>
          <div className="family-rings" aria-hidden="true">
            <div className="ring-ai"><span>AI</span><div className="ring-ml"><span>ML</span><div className="ring-dl"><span>DL</span><i>●</i><i>●</i><i>●</i></div></div></div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={familyOrder.join("-")} className={`family-feedback ${familyOrder.join("|") === "AI|Machine Learning|Deep Learning" ? "success" : ""}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            {familyOrder.join("|") === "AI|Machine Learning|Deep Learning" ? (
              <><strong>Exactly.</strong><p><b>AI</b> is the broad goal/field. <b>Machine Learning</b> is a major approach where behavior is learned from data. <b>Deep Learning</b> is machine learning using deep neural networks.</p></>
            ) : (
              <><strong>Not nested correctly yet.</strong><p>Hint: AI is the biggest umbrella. Deep Learning is the smallest of these three.</p></>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="side-note warning-note"><span>!</span><p>This is a useful beginner map, not a claim that every AI system uses machine learning. Rule-based and symbolic AI also exist.</p></div>
        <TaskStamp done={Boolean(progress.completedTasks["family-tree"])}>Drag the family tree into the correct nesting order</TaskStamp>
      </LessonSection>

      <LessonSection id="explain-back" className="scene-explain-back" onVisit={progress.markVisited}>
        <div className="scene-heading split-heading">
          <div>
            <span className="scene-number">08</span>
            <span className="eyebrow">Feynman CHECK · EXPLAIN IT BACK</span>
            <h2>If you can explain it simply, you own the idea.</h2>
          </div>
          <Mascot mood="happy" label="BYTE" />
        </div>

        <div className="explain-workbench">
          <div className="explain-prompt">
            <span>IMAGINE THIS:</span>
            <h3>Your 10-year-old cousin asks:</h3>
            <blockquote>“Okay… but what actually IS AI?”</blockquote>
            <p>Write your answer without using “magic”, “it just knows”, or “a robot brain”.</p>
          </div>
          <div className="explain-input-card">
            <textarea value={explanation} onChange={(event) => setExplanation(event.target.value)} placeholder="AI is…" rows={7} />
            <div className="writing-meter"><span style={{ width: `${Math.min(100, (explanation.length / 140) * 100)}%` }} /><b>{explanation.length} chars</b></div>
            <button className="lock-explanation tactile" onClick={submitExplanation}>CHECK MY MENTAL MODEL</button>
            {explanationFeedback && <motion.p className={`explain-feedback ${progress.completedTasks["explain-back"] ? "success" : ""}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>{explanationFeedback}</motion.p>}
          </div>
        </div>

        <div className="mental-model-board">
          <span className="board-title">THE VERSION TO KEEP IN YOUR HEAD</span>
          <div className="mental-flow">
            <div><span>①</span><strong>DATA / INPUT</strong><small>Something comes in.</small></div>
            <b>→</b>
            <div><span>②</span><strong>MODEL / METHOD</strong><small>Patterns transform it.</small></div>
            <b>→</b>
            <div><span>③</span><strong>OUTPUT</strong><small>Prediction, decision or generation.</small></div>
          </div>
          <p>And if it&apos;s a learned model: <b>training shaped the internal parameters before inference.</b></p>
        </div>
        <TaskStamp done={Boolean(progress.completedTasks["explain-back"])}>Write and validate your own explanation</TaskStamp>
      </LessonSection>

      <QuizSection progress={progress} unlocked={quizUnlocked} tasksDone={tasksDone} sectionsRead={sectionsRead} />

      <footer className="lesson-footer">
        <div><span className="brand-dot" /> AI EXPLAINED</div>
        <p>Lesson 01 · built to be touched, not memorized.</p>
        <button onClick={progress.resetLesson}>Reset this lesson</button>
      </footer>
    </main>
  );
}

function QuizSection({ progress, unlocked, tasksDone, sectionsRead }: { progress: LessonProgressApi; unlocked: boolean; tasksDone: number; sectionsRead: number }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const score = quizQuestions.reduce((total, question, index) => total + (answers[index] === question.correct ? 1 : 0), 0);
  const passed = score >= 5;

  const submit = () => {
    if (Object.keys(answers).length !== quizQuestions.length) return;
    setSubmitted(true);
    progress.saveQuiz(score, passed);
    if (passed) setCelebrate(true);
  };

  const retry = () => {
    setAnswers({});
    setSubmitted(false);
    setCelebrate(false);
  };

  return (
    <section id="quiz" className={`lesson-scene quiz-scene ${unlocked ? "unlocked" : "locked"}`}>
      {!unlocked ? (
        <div className="quiz-lock-card">
          <motion.div className="big-lock" animate={{ rotate: [-2, 2, -2], y: [0, -4, 0] }} transition={{ duration: 2.8, repeat: Infinity }}>🔒</motion.div>
          <span className="eyebrow">QUIZ LOCKED</span>
          <h2>No speed-running the lesson.</h2>
          <p>The quiz unlocks only after you&apos;ve visited every section and finished every hands-on activity.</p>
          <div className="lock-checklist">
            <div><span>{sectionsRead === whatIsAiSections.length ? "✓" : "○"}</span><strong>Read all lesson sections</strong><b>{sectionsRead}/{whatIsAiSections.length}</b></div>
            <div><span>{tasksDone === whatIsAiSections.length ? "✓" : "○"}</span><strong>Complete all interactions</strong><b>{tasksDone}/{whatIsAiSections.length}</b></div>
          </div>
          <a href={`#${whatIsAiSections.find((section) => !progress.completedTasks[section.taskId])?.id ?? "cold-open"}`}>Take me to what&apos;s missing ↑</a>
        </div>
      ) : (
        <div className="quiz-wrap">
          <div className="quiz-head">
            <span className="eyebrow">FINAL CHECK · LESSON 01</span>
            <h2>Prove you can use the mental model.</h2>
            <p>Pass mark: 5/6. Wrong answers explain the misconception instead of just turning red.</p>
          </div>

          <div className="quiz-questions">
            {quizQuestions.map((question, index) => (
              <article key={question.q} className={`quiz-question ${submitted ? (answers[index] === question.correct ? "correct" : "wrong") : ""}`}>
                <div className="quiz-question-head"><span>{String(index + 1).padStart(2, "0")}</span><h3>{question.q}</h3></div>
                <div className="quiz-options">
                  {question.options.map((option, optionIndex) => (
                    <motion.button
                      key={option}
                      disabled={submitted}
                      className={answers[index] === optionIndex ? "selected" : ""}
                      whileTap={{ scale: 0.975 }}
                      onClick={() => setAnswers((current) => ({ ...current, [index]: optionIndex }))}
                    >
                      <span>{String.fromCharCode(65 + optionIndex)}</span>{option}
                    </motion.button>
                  ))}
                </div>
                <AnimatePresence>
                  {submitted && (
                    <motion.div className="quiz-why" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                      <strong>{answers[index] === question.correct ? "Correct." : `Best answer: ${String.fromCharCode(65 + question.correct)}.`}</strong>
                      <p>{question.why}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </article>
            ))}
          </div>

          {!submitted ? (
            <button className="quiz-submit tactile" disabled={Object.keys(answers).length !== quizQuestions.length} onClick={submit}>SUBMIT {Object.keys(answers).length}/{quizQuestions.length} ANSWERS</button>
          ) : (
            <div className={`quiz-result ${passed ? "passed" : "retry"}`}>
              <div className="result-score"><span>{score}</span><b>/6</b></div>
              <div>
                <span className="eyebrow">{passed ? "LESSON MASTERED" : "ONE MORE RUN"}</span>
                <h3>{passed ? "You can move forward." : "You&apos;re close."}</h3>
                <p>{passed ? "The important part is not the score: you can now separate rules from learning, training from inference, and AI from the model inside the system." : "Read the explanations above, then retry. Your best score is saved."}</p>
                {!passed && <button className="retry-button tactile" onClick={retry}>RETRY QUIZ</button>}
              </div>
            </div>
          )}
        </div>
      )}

      <AnimatePresence>
        {celebrate && passed && (
          <motion.div className="celebration-layer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onAnimationComplete={() => setTimeout(() => setCelebrate(false), 1700)} aria-hidden="true">
            {Array.from({ length: 22 }).map((_, index) => (
              <motion.i key={index} initial={{ x: 0, y: 0, scale: 0, rotate: 0 }} animate={{ x: (index % 2 ? 1 : -1) * (70 + (index * 31) % 430), y: 100 + ((index * 67) % 520), scale: [0, 1.2, 0.8], rotate: index * 44 }} transition={{ duration: 1.2 + (index % 5) * 0.12, ease: [0.2, 0.8, 0.2, 1] }} />
            ))}
            <motion.div className="mastery-badge" initial={{ scale: 0, rotate: -18 }} animate={{ scale: [0, 1.18, 0.96, 1], rotate: [-18, 8, -3, 0] }} transition={{ duration: 0.78, ease: [0.34, 1.56, 0.64, 1] }}>★<span>AI<br />BASICS</span></motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
