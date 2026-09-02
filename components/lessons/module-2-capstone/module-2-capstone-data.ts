export type BossArch="mlp"|"cnn"|"rnn"|"lstm"|"attention"|"residual";
export const defs=[["wire-network","boss-wire-network"],["forward-probe","boss-forward-probe"],["train-classifier","boss-train-classifier"],["optimizer-room","boss-tune-optimizer"],["gradient-emergency","boss-gradient-health"],["generalization-room","boss-generalization"],["architecture-room","boss-architecture"],["ship-checkpoint","boss-ship-checkpoint"]] as const;
export const archCases:{text:string;answer:BossArch}[]=[
{text:"Small dense classifier on fixed numeric features.",answer:"mlp"},
{text:"Detect local visual patterns with shared filters.",answer:"cnn"},
{text:"Very deep transformation stack needs identity shortcuts.",answer:"residual"},
{text:"Long language sequence needs direct content-dependent token interactions.",answer:"attention"},
];
export const exam=[
{q:"A neuron computes a weighted sum plus bias before activation.",o:["True","False"],c:0},
{q:"Why are nonlinear activations important?",o:["Without them stacked linear layers collapse to one linear mapping","They create labels","They remove weights","They guarantee generalization"],c:0},
{q:"Backpropagation primarily computes…",o:["Gradients of loss with respect to parameters","Token IDs","Train/test splits","New labels"],c:0},
{q:"Learning rate controls…",o:["Optimizer step scale","Number of labels","Model vocabulary","Inference batch count only"],c:0},
{q:"One epoch means…",o:["One example","One pass through the training dataset","One layer","One gradient value"],c:1},
{q:"Vanishing gradients arise when backward factors repeatedly shrink the signal.",o:["True","False"],c:0},
{q:"Gradient clipping is mainly a guardrail for…",o:["Exploding updates","Missing data","Tokenization","Test leakage"],c:0},
{q:"Dropout is typically stochastic during training and off in ordinary inference.",o:["True","False"],c:0},
{q:"Residual block shorthand is…",o:["y=x+F(x)","y=0","y=label(x)","y=x only forever"],c:0},
{q:"CNN weight sharing means…",o:["The same kernel can scan many locations","Every location gets unrelated weights","No training is needed","All pixels are identical"],c:0},
{q:"LSTM gates help control recurrent memory.",o:["True","False"],c:0},
{q:"A major reason attention fits modern LLM training is…",o:["Shorter dependency paths plus parallel position processing","It has no matrix multiplication","It needs no data","It removes probability"],c:0},
] as const;