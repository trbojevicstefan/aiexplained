export type Vec2=[number,number];export type Mat2=[[number,number],[number,number]];
export const tokens=["The","robot","lifted","cube"];
export const input:Vec2[]=[[.35,.12],[.82,.58],[.18,.92],[.76,.25]];
export const Wq:Mat2=[[.8,-.25],[.2,.7]],Wk:Mat2=[[.55,.35],[-.15,.9]],Wv:Mat2=[[.9,.1],[.3,.65]];
export const Wq2:Mat2=[[-.2,.9],[.75,.1]],Wk2:Mat2=[[.7,-.4],[.45,.6]],Wv2:Mat2=[[.4,.8],[-.55,.7]];
export const mul=(v:Vec2,m:Mat2):Vec2=>[v[0]*m[0][0]+v[1]*m[1][0],v[0]*m[0][1]+v[1]*m[1][1]];
export const dot=(a:Vec2,b:Vec2)=>a[0]*b[0]+a[1]*b[1];
export const softmax=(xs:number[])=>{const mx=Math.max(...xs),e=xs.map(x=>Math.exp(x-mx)),s=e.reduce((a,b)=>a+b,0);return e.map(x=>x/s)};
export function head(qm:Mat2,km:Mat2,vm:Mat2){const q=input.map(v=>mul(v,qm)),k=input.map(v=>mul(v,km)),v=input.map(x=>mul(x,vm));const scores=q.map(qv=>k.map(kv=>dot(qv,kv)/Math.sqrt(2)));const weights=scores.map(softmax);const out=weights.map(row=>row.reduce<Vec2>((acc,w,i)=>[acc[0]+w*v[i][0],acc[1]+w*v[i][1]],[0,0]));return{q,k,v,scores,weights,out}}
export const h1=head(Wq,Wk,Wv),h2=head(Wq2,Wk2,Wv2);
export const add=(a:Vec2,b:Vec2):Vec2=>[a[0]+b[0],a[1]+b[1]];
export const layerNorm=(v:Vec2):Vec2=>{const mean=(v[0]+v[1])/2,variance=((v[0]-mean)**2+(v[1]-mean)**2)/2,s=Math.sqrt(variance+1e-5);return[(v[0]-mean)/s,(v[1]-mean)/s]};
export const relu=(x:number)=>Math.max(0,x);
export const ffn=(v:Vec2):Vec2=>{const h=[relu(v[0]*.8+v[1]*-.3+.1),relu(v[0]*-.2+v[1]*.9-.05),relu(v[0]*.55+v[1]*.4)] as [number,number,number];return[h[0]*.5+h[1]*-.25+h[2]*.45,h[0]*-.15+h[1]*.6+h[2]*.3]};
export const quiz=[
{q:"Q, K and V are usually produced by…",o:["Different learned linear projections of token representations","The tokenizer vocabulary IDs directly","Three different datasets","The test split"],c:0},
{q:"Scaled dot-product attention scores compare…",o:["Queries with keys","Values with labels","Token IDs with positions","Loss with gradients"],c:0},
{q:"Softmax over one attention row makes the weights…",o:["Positive and sum to 1","All equal to token IDs","Always binary","Independent of scores"],c:0},
{q:"The attention output for one query is mainly…",o:["A weighted mixture of value vectors","The query copied unchanged","A vocabulary ID","A loss scalar"],c:0},
{q:"Multi-head attention uses multiple learned projection sets so heads can form different interaction patterns.",o:["True","False"],c:0},
{q:"A residual connection discards the block input.",o:["True","False"],c:1},
{q:"Transformer feed-forward/MLP layers usually operate…",o:["Position-wise after attention mixing","Only on token IDs before embedding","Only during tokenization","As the attention softmax itself"],c:0},
] as const;