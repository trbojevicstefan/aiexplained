export const defs=[["training-objective","inspect-next-token-training"],["logits","inspect-logits"],["softmax","inspect-softmax"],["decode-modes","compare-decoding-modes"],["sampling-controls","tune-sampling-controls"],["stops","control-generation-stops"],["seed","compare-seeds"],["hallucination","inspect-hallucination-reasoning"],["explain-generation","explain-autoregressive-generation"]] as const;
export const trainExamples=[{prefix:"The sky is",target:" blue"},{prefix:"A cat sat on the",target:" mat"},{prefix:"2 + 2 =",target:" 4"},{prefix:"Paris is in",target:" France"}];
export const quiz=[
{q:"During standard autoregressive language-model pretraining, the model is trained to predict…",o:["Next tokens conditioned on prior context","Only document titles","A single fixed answer per model","Tool outputs only"],c:0},
{q:"A logit is…",o:["An unnormalized score before softmax","A probability that already sums to 1","A token ID","A context window"],c:0},
{q:"Greedy decoding chooses…",o:["The highest-probability available token each step","A random token uniformly","Only top-P tokens randomly without scores","The smallest token ID"],c:0},
{q:"Increasing temperature generally makes the probability distribution…",o:["Flatter / more exploratory","Always one-hot","Unrelated to logits","Deterministic by definition"],c:0},
{q:"Top-K and top-P are…",o:["Candidate truncation/filtering strategies before sampling","Training datasets","Attention masks","Embedding metrics"],c:0},
{q:"With deterministic computation, identical seed + prompt + sampling settings can reproduce a sampled sequence in this toy engine.",o:["True","False"],c:0},
{q:"Why can an LLM hallucinate?",o:["Next-token probability can favor plausible continuation without an external truth guarantee","It never learned language","Softmax stores a factual database","Token IDs are incorrect"],c:0},
] as const;