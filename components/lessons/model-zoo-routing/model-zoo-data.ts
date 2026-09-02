export type Expert="code"|"math"|"language"|"science";export type ModelKind="small"|"large";
export const defs=[["parameters","inspect-llm-parameters"],["dense-sparse","compare-dense-sparse"],["moe","inspect-moe"],["expert-router","route-moe-experts"],["routing-levels","compare-routing-levels"],["model-sizes","compare-model-sizes"],["posttrain-families","compare-base-instruct-chat"],["reasoning-models","inspect-reasoning-models"],["scaling","inspect-scaling-emergence"],["explain-zoo","explain-model-zoo"]] as const;
export const routeTable:Record<string,[Expert,number][]>= {"function":[["code",.72],["math",.12],["language",.1],["science",.06]],"integral":[["math",.68],["science",.18],["language",.09],["code",.05]],"photosynthesis":[["science",.71],["language",.15],["math",.08],["code",.06]],"story":[["language",.74],["science",.1],["code",.09],["math",.07]]};
export const scaling=[{p:1,score:39,loss:3.3},{p:3,score:47,loss:3.0},{p:7,score:55,loss:2.75},{p:13,score:62,loss:2.55},{p:34,score:70,loss:2.34},{p:70,score:76,loss:2.22}];
export const quiz=[
{q:"A model parameter is…",o:["A learned numeric weight/bias-like value inside the model","A token count only","A user prompt","A benchmark label"],c:0},
{q:"In a dense transformer layer, usually…",o:["All dense FFN parameters participate for each token in that layer","Only one expert exists","No weights run","The router selects a separate API model"],c:0},
{q:"MoE routing commonly selects…",o:["A subset of expert submodules inside one model for each token/position","A separate company API","A tokenizer","A test split"],c:0},
{q:"Model routing and MoE expert routing happen at the same architectural level.",o:["True","False"],c:1},
{q:"A foundation model is broadly pretrained and can be adapted/post-trained for many tasks.",o:["True","False"],c:0},
{q:"Instruct/chat models are typically post-trained from a base/pretrained model toward following instructions/conversation behavior.",o:["True","False"],c:0},
{q:"A benchmark threshold can make a smooth scaling curve look like an abrupt emerging capability.",o:["True","False"],c:0},
] as const;