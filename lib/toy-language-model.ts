export type DecodeMode="sample"|"greedy";
export type SamplerConfig={temperature:number;topK:number;topP:number;repetitionPenalty:number;seed:number;mode:DecodeMode};
export type Candidate={token:string;logit:number;prob:number};
const tables:Record<string,[string,number][]>= {
  "is":[[" blue",3.2],[" clear",2.5],[" bright",2.0],[" falling",.4],[" infinite",.2],[" cloudy",1.4],[".",.1]],
  "blue":[[" today",2.6],[".",2.3],[" and",1.9],[" because",1.2],[" above",.8]],
  "clear":[[" today",2.3],[".",2.4],[" and",2.0],[" after",.7]],
  "bright":[[" today",2.0],[".",2.5],[" and",1.8],[" above",1.0]],
  "cloudy":[[" today",2.2],[".",2.1],[" and",1.6],[" with",1.2]],
  "falling":[[".",1.7],[" slowly",1.5],[" today",.8],[" upward",.4]],
  "infinite":[[".",2.0],[" and",1.3],[" today",.6]],
  "today":[[".",3.0],[",",1.7],[" and",1.4],[" because",.9]],
  "and":[[" calm",1.9],[" quiet",1.7],[" bright",1.4],[" blue",1.2]],
  "because":[[" sunlight",1.8],[" weather",1.5],[" clouds",1.2]],
  ".":[["<EOS>",3.4],[" The",.6],[" It",.5]],
  "default":[[".",2.0],[" and",1.4],[" today",1.0],["<EOS>",.8]]
};
export const seedRandom=(seed:number)=>{let a=seed>>>0;return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}};
export const softmax=(xs:number[],temperature=1)=>{const t=Math.max(.05,temperature),scaled=xs.map(x=>x/t),m=Math.max(...scaled),e=scaled.map(x=>Math.exp(x-m)),s=e.reduce((a,b)=>a+b,0);return e.map(x=>x/s)};
const keyOf=(token:string)=>token.trim().replace(/[.,!?]/g,m=>m).toLowerCase()||"default";
export function candidatesFor(context:string[],config:SamplerConfig):Candidate[]{const last=context.length?keyOf(context[context.length-1]):"is";let rows=[...(tables[last]??tables.default)].map(([token,logit])=>({token,logit:context.includes(token)?logit/Math.max(1,config.repetitionPenalty):logit}));rows.sort((a,b)=>b.logit-a.logit);if(config.topK>0)rows=rows.slice(0,Math.min(config.topK,rows.length));let probs=softmax(rows.map(x=>x.logit),config.temperature);let list=rows.map((x,i)=>({...x,prob:probs[i]}));if(config.topP<.999){let cumulative=0;const kept:typeof list=[];for(const item of list){kept.push(item);cumulative+=item.prob;if(cumulative>=config.topP)break;}const z=kept.reduce((s,x)=>s+x.prob,0);list=kept.map(x=>({...x,prob:x.prob/z}));}return list;}
export function nextToken(context:string[],config:SamplerConfig,rng:()=>number):{token:string;candidates:Candidate[]}{const c=candidatesFor(context,config);if(config.mode==="greedy")return{token:c[0]?.token??"<EOS>",candidates:c};const r=rng();let s=0;for(const item of c){s+=item.prob;if(r<=s)return{token:item.token,candidates:c};}return{token:c.at(-1)?.token??"<EOS>",candidates:c};}
export function generate(promptTokens:string[],config:SamplerConfig,maxTokens:number,stopTokens:string[]=[]){const rng=seedRandom(config.seed);const out:string[]=[];let last:Candidate[]=[];for(let i=0;i<maxTokens;i++){const step=nextToken([...promptTokens,...out],config,rng);last=step.candidates;if(step.token==="<EOS>"||stopTokens.includes(step.token))break;out.push(step.token);}return{tokens:out,candidates:last,text:out.join("")};}