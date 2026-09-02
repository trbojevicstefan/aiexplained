export type ArchitectureChoice = "mlp" | "residual";

export const defs = [
  ["dense-anatomy","build-dense-mlp"],["width-depth","explore-width-depth"],["plain-chain","stress-plain-stack"],["residual-block","build-residual-block"],["information-path","compare-information-paths"],["gradient-path","compare-gradient-paths"],["residual-limits","diagnose-residual-limits"],["architecture-choice","choose-architecture"],["explain-residual","explain-residual"],
] as const;

export const cases:{text:string;answer:ArchitectureChoice}[]=[
  {text:"Small tabular classifier with two dense hidden layers and no need for extreme depth.",answer:"mlp"},
  {text:"Very deep stack where we want each block to learn a correction around an identity path.",answer:"residual"},
  {text:"Simple output head on top of frozen embeddings.",answer:"mlp"},
  {text:"Dozens of transformation blocks where optimization degrades as depth grows.",answer:"residual"},
];

export const quiz = [
  {q:"What is a standard dense MLP layer doing?",o:["Each output unit combines many previous activations with learned weights and a bias","Copying pixels without weights","Only sorting data","Removing the loss"],c:0},
  {q:"A residual block is commonly summarized as…",o:["y = F(x)","y = x + F(x)","y = x × 0","y = softmax(x) only"],c:1},
  {q:"Why can an identity shortcut help deep optimization?",o:["It provides a direct path for information and gradients","It removes all parameters","It guarantees zero loss","It replaces training data"],c:0},
  {q:"Residual connections guarantee perfect training at any depth.",o:["True","False"],c:1},
  {q:"Width and depth are the same architectural choice.",o:["True","False"],c:1},
  {q:"An MLP is best described as…",o:["A stack of learned affine transformations and nonlinearities","A database","A tokenizer","A test split"],c:0},
  {q:"If F(x) learns near zero in y=x+F(x), the block can approximate…",o:["An identity mapping","A random labeler","A convolution kernel only","A deleted layer"],c:0},
] as const;

export const clamp=(x:number,a:number,b:number)=>Math.min(b,Math.max(a,x));