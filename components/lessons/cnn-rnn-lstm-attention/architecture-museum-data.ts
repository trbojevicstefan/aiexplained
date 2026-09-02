export type Arch = "cnn" | "rnn" | "lstm" | "attention";

export const defs = [
  ["biases","inspect-architecture-biases"],["cnn-kernel","run-convolution"],["weight-sharing","inspect-weight-sharing"],["rnn-state","run-rnn-state"],["long-memory","stress-rnn-memory"],["lstm-gates","control-lstm-gates"],["attention-path","inspect-attention-path"],["architecture-choice","choose-sequence-architecture"],["explain-evolution","explain-architecture-evolution"],
] as const;

export const cases:{text:string;answer:Arch}[]=[
  {text:"Detect the same edge pattern anywhere in an image with shared local filters.",answer:"cnn"},
  {text:"Small streaming sequence where one recurrent hidden state is enough.",answer:"rnn"},
  {text:"Sequential model needs explicit gates to preserve/forget memory over longer spans.",answer:"lstm"},
  {text:"Language model should let distant tokens interact directly and process many positions in parallel during training.",answer:"attention"},
];

export const quiz=[
  {q:"What is weight sharing in a CNN?",o:["The same learned kernel is applied at many spatial positions","Every pixel gets a unique network","All weights are zero","The test set is reused"],c:0},
  {q:"An RNN hidden state h_t depends on…",o:["Only the current input","The previous state and current input","Only the final label","No learned weights"],c:1},
  {q:"LSTM gates mainly control…",o:["What memory to keep, write and expose","Image resolution","Dataset size","Token IDs"],c:0},
  {q:"Why can vanilla recurrence struggle with very long dependencies?",o:["Repeated state transitions create long gradient/information paths","It has no parameters","It cannot process numbers","It always uses attention"],c:0},
  {q:"Attention can connect token i to distant token j in…",o:["A direct interaction inside the attention operation","Only after one recurrent step per token","No way at all","Only through convolution"],c:0},
  {q:"Attention made RNNs useless for every possible problem.",o:["True","False"],c:1},
  {q:"CNNs encode a useful prior for images because…",o:["Local patterns and shared filters matter spatially","Images are always sequences of words","They remove learning","They require no data"],c:0},
] as const;
