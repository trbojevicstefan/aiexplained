import { VectorPoint2D } from "@/components/interactive/vector-plot-2d";
export const defs=[["lookup","inspect-embedding-lookup"],["dimensions","inspect-vector-dimensions"],["similarity","measure-cosine-similarity"],["metrics","compare-vector-metrics"],["text-search","run-semantic-search"],["multimodal","inspect-multimodal-space"],["clusters","inspect-vector-clusters"],["ann","compare-ann-search"],["explain-embeddings","explain-embeddings"]] as const;
export const points:VectorPoint2D[]=[
{id:"cat",label:"cat",x:.76,y:.62,group:"pet"},{id:"dog",label:"dog",x:.70,y:.69,group:"pet"},{id:"kitten",label:"kitten",x:.83,y:.56,group:"pet"},
{id:"car",label:"car",x:-.70,y:.28,group:"vehicle"},{id:"truck",label:"truck",x:-.78,y:.18,group:"vehicle"},{id:"bus",label:"bus",x:-.62,y:.34,group:"vehicle"},
{id:"apple",label:"apple",x:.10,y:-.73,group:"fruit"},{id:"banana",label:"banana",x:.02,y:-.84,group:"fruit"},{id:"pear",label:"pear",x:.17,y:-.69,group:"fruit"},
];
export const queryVectors:Record<string,[number,number]>={pet:[.75,.64],vehicle:[-.72,.26],fruit:[.09,-.76]};
export const dot=(a:number[],b:number[])=>a.reduce((s,x,i)=>s+x*b[i],0);
export const magnitude=(a:number[])=>Math.sqrt(dot(a,a));
export const cosine=(a:number[],b:number[])=>dot(a,b)/(Math.max(1e-9,magnitude(a)*magnitude(b)));
export const euclidean=(a:number[],b:number[])=>Math.sqrt(a.reduce((s,x,i)=>s+(x-b[i])**2,0));
export const vector8=(token:string)=>Array.from({length:8},(_,i)=>Math.sin((token.charCodeAt(i%token.length)+17)*(i+1)*.137));
export const tokenId=(token:string)=>1000+Array.from(token).reduce((s,c,i)=>s+c.charCodeAt(0)*(i+11),0)%47000;
export const quiz=[
{q:"A token ID is the same thing as its embedding vector.",o:["True","False"],c:1},
{q:"An embedding dimension is…",o:["One coordinate/feature axis of the learned vector representation","A token ID","A training epoch","A word count"],c:0},
{q:"Cosine similarity primarily compares…",o:["Direction/angle between vectors","Only vector length","Token IDs","Batch size"],c:0},
{q:"Positive scaling of one vector leaves cosine similarity unchanged but changes dot product magnitude.",o:["True","False"],c:0},
{q:"Semantic search usually retrieves items whose embeddings are…",o:["Nearby/similar under a chosen vector metric","Alphabetically adjacent","The same token ID","Always exact text matches"],c:0},
{q:"Multimodal embeddings can place text and image representations in a compatible shared space.",o:["True","False"],c:0},
{q:"ANN search trades some exactness/recall for…",o:["Faster search over large vector collections","More labels","Longer tokens","Bigger gradients"],c:0},
] as const;