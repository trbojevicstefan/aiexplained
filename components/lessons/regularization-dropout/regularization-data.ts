export type Intervention = "l2" | "dropout" | "early" | "data";

export const defs = [
  ["overfit-gap","create-overfit-gap"],["l2-pruning","apply-l2-decay"],["dropout-masks","sample-dropout-masks"],["train-vs-infer","compare-dropout-modes"],["early-stop","choose-early-stop"],["capacity-data","balance-capacity-data"],["regularizer-choice","choose-regularizer"],["recipe","build-regularization-recipe"],["explain-regularization","explain-regularization"],
] as const;

export const cases:{text:string;answer:Intervention}[]=[
  {text:"A few weights grow extremely large and the model becomes brittle.",answer:"l2"},
  {text:"Hidden units rely too heavily on the exact same partners during training.",answer:"dropout"},
  {text:"Validation loss bottoms at epoch 14, then climbs while training loss keeps falling.",answer:"early"},
  {text:"You have a huge model and only 80 representative training examples.",answer:"data"},
];

export const quiz = [
  {q:"What does L2 regularization add?",o:["A penalty related to weight magnitude","Random labels","More hidden layers","A larger test set"],c:0},
  {q:"Standard dropout is normally active during…",o:["Training only","Inference only","Dataset splitting only","Checkpoint loading only"],c:0},
  {q:"Why can dropout reduce co-adaptation?",o:["Units cannot always rely on the same partners","It freezes all weights","It removes labels","It removes loss"],c:0},
  {q:"Early stopping usually selects a checkpoint using…",o:["Training loss only","Validation performance","Repeated test peeking","Batch size"],c:1},
  {q:"Training improves while validation worsens. This suggests…",o:["Underfitting","Overfitting","Gradient clipping","Label smoothing"],c:1},
  {q:"Does regularization guarantee generalization?",o:["Yes","No"],c:1},
  {q:"At ordinary inference after dropout training, use…",o:["A random new mask every request","The full network with scaling accounted for","A retraining pass","Zero weights"],c:1},
] as const;

export const baseWeights=[2.8,-2.2,1.9,-3.1,2.5,-1.7];
export const norm=(xs:number[])=>Math.sqrt(xs.reduce((s,x)=>s+x*x,0));
export const clamp=(x:number,a:number,b:number)=>Math.min(b,Math.max(a,x));