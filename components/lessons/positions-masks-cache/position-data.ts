export const tokens=["I","saw","the","red","cube"];
export const defs=[["position-need","prove-position-need"],["position-types","compare-position-types"],["rope","rotate-rope"],["causal-mask","apply-causal-mask"],["kv-cache","build-kv-cache"],["flash","inspect-flash-attention"],["sparse","inspect-sparse-attention"],["sliding","inspect-sliding-window"],["explain-efficiency","explain-position-efficiency"]] as const;
export const softmax=(xs:number[])=>{const m=Math.max(...xs),e=xs.map(x=>Math.exp(x-m)),s=e.reduce((a,b)=>a+b,0);return e.map(x=>x/s)};
export const baseScores=tokens.map((_,r)=>tokens.map((_,c)=>1.2-Math.abs(r-c)*.42+(r===c?.2:0)));
export const fullWeights=baseScores.map(softmax);
export const causalMask=tokens.map((_,r)=>tokens.map((_,c)=>c>r));
export const causalWeights=baseScores.map((row,r)=>{const safe=row.map((x,c)=>c>r?-1e9:x);return softmax(safe)});
export const sparseMask=tokens.map((_,r)=>tokens.map((_,c)=>!(c===0||c===r||Math.abs(r-c)===1)));
export const sparseWeights=baseScores.map((row,r)=>softmax(row.map((x,c)=>sparseMask[r][c]?-1e9:x)));
export const slidingMask=(window:number)=>tokens.map((_,r)=>tokens.map((_,c)=>Math.abs(r-c)>window));
export const slidingWeights=(window:number)=>baseScores.map((row,r)=>softmax(row.map((x,c)=>Math.abs(r-c)>window?-1e9:x)));
export const sinusoid=(p:number):[number,number]=>[Math.sin(p),Math.cos(p)];
export const learned:[[number,number],[number,number],[number,number],[number,number],[number,number]]=[[.12,.44],[-.25,.36],[.4,-.18],[.61,.15],[-.38,-.42]];
export const rotate=(v:[number,number],angle:number):[number,number]=>[v[0]*Math.cos(angle)-v[1]*Math.sin(angle),v[0]*Math.sin(angle)+v[1]*Math.cos(angle)];
export const quiz=[
{q:"Why does a transformer need position information?",o:["Attention alone does not inherently encode sequence order from token content","Token IDs contain perfect syntax","Softmax deletes words","Embeddings are always sorted"],c:0},
{q:"Learned positional embeddings and sinusoidal encodings are…",o:["Two ways of injecting position information","Identical to token IDs","KV cache formats","Dropout methods"],c:0},
{q:"RoPE intuition applies a position-dependent…",o:["Rotation to query/key feature pairs","Random token deletion","Vocabulary merge","Loss penalty"],c:0},
{q:"A causal mask prevents a decoder token from attending to…",o:["Future positions","Its past","Itself in every architecture","The embedding table"],c:0},
{q:"KV cache primarily avoids recomputing past…",o:["Key/value projections during autoregressive decoding","Tokenization","Training gradients","Dataset labels"],c:0},
{q:"Flash Attention is mainly about…",o:["Computing exact attention more IO/memory-efficiently without materializing the full score matrix at once","Making attention sparse by definition","Changing token IDs","Replacing softmax"],c:0},
{q:"Sliding-window attention restricts each position to a local neighborhood, reducing long-sequence attention work.",o:["True","False"],c:0},
] as const;