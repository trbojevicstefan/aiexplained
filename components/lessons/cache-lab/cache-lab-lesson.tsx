"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { LessonProgressApi } from "@/components/course/lesson-shell";
import { LessonSection, TaskStamp } from "@/components/course/lesson-primitives";
import { CacheLayer, CacheStack } from "@/components/visualizations/cache-stack";
import styles from "./cache-lab.module.css";

type Props={progress:LessonProgressApi};
const baseLayers:CacheLayer[]=[
{id:"prefix",title:"Prompt / prefix cache",stores:"reusable model-side prefix computation / eligible prompt prefix",key:"exact/eligible prefix + model/runtime",hit:72,accent:"#78a7ff"},
{id:"context",title:"Application context cache",stores:"assembled/processed context artifact",key:"user/scope + sources + versions + query pattern",hit:54,accent:"#9d8cff"},
{id:"kv",title:"KV cache",stores:"attention key/value state for active sequence",key:"sequence/session + token positions",hit:98,accent:"#78dca8"},
{id:"semantic",title:"Semantic cache",stores:"prior result for sufficiently similar meaning",key:"embedding similarity + scope/policy",hit:31,accent:"#ffb773"},
{id:"response",title:"Response cache",stores:"final response/output",key:"exact normalized request + context/version",hit:42,accent:"#ff91bd"},
{id:"embedding",title:"Embedding cache",stores:"text/image → embedding vector",key:"content hash + embedding model/version",hit:84,accent:"#6ed7d0"},
{id:"tool",title:"Tool-result cache",stores:"external tool/API read result",key:"tool + args + auth/scope + TTL/version",hit:47,accent:"#ffe06b"},
{id:"retrieval",title:"Retrieval cache",stores:"retrieved document IDs/chunks/ranks",key:"query + filters + index/version",hit:58,accent:"#8fa4ff"},
];
const prefixCases=[
["Same 6k-token system/policy prefix, new user question appended","good"],["Entire prompt totally different","miss"],["Reuse prefix compute is the same as reusing final answer","false"],
] as const;
const contextCases=[
["Cache parsed/assembled static policy context keyed by source versions","context-cache"],["Serve another tenant's context because query text is same","bad"],["Invalidate when source/version/permissions change","invalidate"],
] as const;
const kvCases=[
["Reuse previous attention K/V while generating next token in same sequence","kv"],["A final answer cached for future identical request","not-kv"],["KV memory grows with active sequence/context and architecture","true"],
] as const;
const semanticCases=[
["'refund policy?' matches cached 'how do cancellations get refunded?' within safe scope","semantic-hit"],["Personal bank balance query matches another user's similar wording","bad"],["Similarity threshold too loose can return wrong cached answer","true"],
] as const;
const responseCases=[
["Exact deterministic FAQ request + same policy version","response-cache"],["Highly personalized current account state","avoid-or-scope"],["Prompt/model/tool/source versions may belong in cache key","true"],
] as const;
const embeddingCases=[
["Same document chunk unchanged, same embedding model version","hit"],["Embedding model changed","invalidate"],["Text changed by one material paragraph","recompute"],
] as const;
const toolCases=[
["Weather GET result cached for 5 minutes","safe-ttl"],["Bank transfer POST result cached and replayed as if action happened again","bad"],["Product catalog read keyed by tenant + filters + source version","safe-scope"],
] as const;
const retrievalCases=[
["Same normalized query + filters + same index version","hit"],["Knowledge index rebuilt with new policy","invalidate"],["User permission scope changed","invalidate"],
] as const;
const invalidCases=[
["TTL expires","invalidate"],["Model/prompt version changes semantic behavior","consider-version"],["Tenant/permission changes","invalidate"],["Source document update","invalidate"],["Hit rate 100% is always ideal even if answers are stale","false"],
] as const;
const quiz=[
["A prompt/prefix cache primarily reuses…",["Eligible repeated prefix processing/work","Any final answer regardless of suffix","Model weights between providers","Tool permissions"],0],
["KV cache stores…",["Attention key/value state used during sequence generation","Final answers for future users","Embeddings for documents only","OAuth tokens only"],0],
["Semantic cache keys requests by…",["Meaning/similarity plus safety/scope constraints","Only exact bytes","Only user id","Only GPU id"],0],
["Response cache typically stores…",["A final output/result for a sufficiently identical/scoped request","KV tensors only","Model weights","Training gradients"],0],
["Embedding cache key should include…",["Content identity plus embedding model/version","Only current time","Only output length","Only user browser"],0],
["Tool-result caching is safest for…",["Read/idempotent results with explicit key/scope/TTL semantics","Unbounded destructive writes","Every payment POST","Unknown side effects"],0],
["Retrieval cache may need invalidation when…",["Index/source version or permission filters change","Only CSS changes","Only model mascot changes","Never"],0],
["Cache hit rate measures…",["Fraction of eligible lookups served from cache","Model accuracy","Training speed","Token vocabulary size"],0],
["A high hit rate with stale/wrong data is still a bad cache.",["True","False"],0],
["These cache types are interchangeable because they all store 'AI stuff'.",["True","False"],1],
] as const;

export function CacheLabLesson({progress}:Props){
 const [active,setActive]=useState("prefix"),[layers,setLayers]=useState(baseLayers),[prefix,setPrefix]=useState<Record<number,string>>({}),[context,setContext]=useState<Record<number,string>>({}),[kv,setKv]=useState<Record<number,string>>({}),[semantic,setSemantic]=useState<Record<number,string>>({}),[response,setResponse]=useState<Record<number,string>>({}),[embedding,setEmbedding]=useState<Record<number,string>>({}),[tool,setTool]=useState<Record<number,string>>({}),[retrieval,setRetrieval]=useState<Record<number,string>>({}),[invalid,setInvalid]=useState<Record<number,string>>({}),[ttl,setTtl]=useState(15),[version,setVersion]=useState(1),[explain,setExplain]=useState(""),[feedback,setFeedback]=useState(""),[answers,setAnswers]=useState<Record<number,number>>({});
 const tasks=["cache-prefix","cache-context","cache-kv","cache-semantic","cache-response","cache-embedding","cache-tool","cache-retrieval","cache-invalidation","cache-explain"],sections=["prefix","context","kv","semantic","response","embedding","tool","retrieval","invalidation","explain"];
 const done=tasks.filter(t=>progress.completedTasks[t]).length,read=sections.filter(s=>progress.visitedSections.has(s)).length,unlocked=done===10&&read===10;
 const score=quiz.reduce((n,q,i)=>n+(answers[i]===q[2]?1:0),0),quizDone=Object.keys(answers).length===quiz.length;
 const activeLayer=useMemo(()=>layers.find(x=>x.id===active)??layers[0],[layers,active]);
 const solve=(current:Record<number,string>,setter:(next:Record<number,string>)=>void,cases:readonly (readonly [string,string])[],i:number,answer:string,task:string)=>{const next={...current,[i]:answer};setter(next);setActive(task.replace("cache-",""));if(cases.every((x,j)=>next[j]===x[1]))progress.completeTask(task)};
 const changeHit=(id:string,delta:number)=>setLayers(current=>current.map(layer=>layer.id===id?{...layer,hit:Math.max(0,Math.min(100,layer.hit+delta))}:layer));
 const submit=()=>{const t=explain.toLowerCase();const hits=["prefix","context","kv","semantic","response","embedding","tool","retrieval","invalidate","ttl","hit rate"].filter(w=>t.includes(w)).length;if(explain.length<170||hits<9){setFeedback("Go deeper: explain what each cache stores/keys, especially prefix vs KV vs response/semantic/embedding/tool/retrieval caches, then cover invalidation/TTL/scope/versioning.");return;}setFeedback("Strong. You separated caches by stored object, key, lifetime and trust/invalidation boundary.");progress.completeTask("cache-explain")};
 return <main className={styles.root}>
  <section className={styles.hero}><div><span className={styles.eyebrow}>MODULE 23 · AI CACHE LAB</span><h1>Eight caches. Eight different things being reused.</h1><p>Click through the stack and learn what each layer actually stores. A KV cache is not a response cache. A semantic cache is not a prefix cache. A high hit rate is useless when keys or invalidation are wrong.</p><TaskStamp done={done===10}>{done}/10 cache missions complete</TaskStamp></div><CacheStack layers={layers} active={active} onSelect={setActive}/></section>

  <LessonSection id="prefix" onVisit={progress.markVisited} className={styles.scene}><h2>1. Prompt / prefix cache: reuse eligible repeated input-prefix work.</h2>{prefixCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["good","miss","false"].map(answer=><button key={answer} className={`${styles.button} ${prefix[i]===answer?(answer===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(prefix,setPrefix,prefixCases,i,answer,"cache-prefix")}>{answer}</button>)}</div>)}<CacheStack layers={layers.filter(x=>x.id==="prefix")} active="prefix"/><p>Provider/runtime terminology differs. Durable idea: repeated prefixes can sometimes reuse prior processing/cached computation, but the new suffix still changes the request and final output.</p></LessonSection>

  <LessonSection id="context" onVisit={progress.markVisited} className={styles.scene}><h2>2. Application context cache: reuse expensive context assembly safely.</h2>{contextCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["context-cache","bad","invalidate"].map(answer=><button key={answer} className={`${styles.button} ${context[i]===answer?(answer===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(context,setContext,contextCases,i,answer,"cache-context")}>{answer}</button>)}</div>)}<p>This is an application-level concept, not a universal provider API name: cache parsed docs, assembled static context or expensive context-building outputs under source/version/permission keys.</p></LessonSection>

  <LessonSection id="kv" onVisit={progress.markVisited} className={styles.scene}><h2>3. KV cache lives inside active sequence inference.</h2>{kvCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["kv","not-kv","true"].map(answer=><button key={answer} className={`${styles.button} ${kv[i]===answer?(answer===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(kv,setKv,kvCases,i,answer,"cache-kv")}>{answer}</button>)}</div>)}<div className={styles.kv}><span>token 1 K/V</span><span>token 2 K/V</span><span>token 3 K/V</span><b>→ next decode step</b></div></LessonSection>

  <LessonSection id="semantic" onVisit={progress.markVisited} className={styles.scene}><h2>4. Semantic cache reuses prior results for similar meaning — which is powerful and dangerous.</h2>{semanticCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["semantic-hit","bad","true"].map(answer=><button key={answer} className={`${styles.button} ${semantic[i]===answer?(answer===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(semantic,setSemantic,semanticCases,i,answer,"cache-semantic")}>{answer}</button>)}</div>)}<label className={styles.slider}>Similarity threshold <b>{activeLayer.id==="semantic"?Math.round((activeLayer.hit/100)*25+70):82}%</b><input type="range" min="70" max="98" value="82" readOnly/></label></LessonSection>

  <LessonSection id="response" onVisit={progress.markVisited} className={styles.scene}><h2>5. Response cache stores the final answer/result.</h2>{responseCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["response-cache","avoid-or-scope","true"].map(answer=><button key={answer} className={`${styles.button} ${response[i]===answer?(answer===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(response,setResponse,responseCases,i,answer,"cache-response")}>{answer}</button>)}</div>)}</LessonSection>

  <LessonSection id="embedding" onVisit={progress.markVisited} className={styles.scene}><h2>6. Embedding cache prevents re-vectorizing unchanged content.</h2>{embeddingCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["hit","invalidate","recompute"].map(answer=><button key={answer} className={`${styles.button} ${embedding[i]===answer?(answer===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(embedding,setEmbedding,embeddingCases,i,answer,"cache-embedding")}>{answer}</button>)}</div>)}<div className={styles.vector}><code>sha256(document chunk) + embedding_model_v3 → [0.13, -0.82, …]</code></div></LessonSection>

  <LessonSection id="tool" onVisit={progress.markVisited} className={styles.scene}><h2>7. Tool-result cache must understand side effects and freshness.</h2>{toolCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["safe-ttl","bad","safe-scope"].map(answer=><button key={answer} className={`${styles.button} ${tool[i]===answer?(answer===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(tool,setTool,toolCases,i,answer,"cache-tool")}>{answer}</button>)}</div>)}<label className={styles.slider}>Weather tool TTL <b>{ttl} min</b><input type="range" min="1" max="120" value={ttl} onChange={e=>setTtl(+e.target.value)}/></label></LessonSection>

  <LessonSection id="retrieval" onVisit={progress.markVisited} className={styles.scene}><h2>8. Retrieval cache stores search results, not necessarily the generated answer.</h2>{retrievalCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["hit","invalidate"].map(answer=><button key={answer} className={`${styles.button} ${retrieval[i]===answer?(answer===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(retrieval,setRetrieval,retrievalCases,i,answer,"cache-retrieval")}>{answer}</button>)}</div>)}<div className={styles.vector}><code>query + tenant + filters + index_v{version} → [doc_17, doc_4, doc_9]</code><button className={styles.button} onClick={()=>setVersion(v=>v+1)}>Rebuild index → v{version+1}</button></div></LessonSection>

  <LessonSection id="invalidation" onVisit={progress.markVisited} className={styles.scene}><h2>9. Cache invalidation is part of correctness and security.</h2>{invalidCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["invalidate","consider-version","false"].map(answer=><button key={answer} className={`${styles.button} ${invalid[i]===answer?(answer===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(invalid,setInvalid,invalidCases,i,answer,"cache-invalidation")}>{answer}</button>)}</div>)}<div className={styles.hitControls}>{layers.map(layer=><button key={layer.id} onClick={()=>changeHit(layer.id,5)}>{layer.title}<b>{layer.hit}%</b><span>+5 hit</span></button>)}</div><p>Higher hit rate is useful only when keys, scope, freshness and invalidation make the reused value correct.</p></LessonSection>

  <LessonSection id="explain" onVisit={progress.markVisited} className={styles.scene}><h2>10. Explain why “add caching” is not one engineering task.</h2><textarea className={styles.textarea} value={explain} onChange={e=>setExplain(e.target.value)} placeholder="Explain prefix/context/KV/semantic/response/embedding/tool-result/retrieval caches, their keys, TTL/version/scope and hit-rate correctness."/><button className={styles.primary} onClick={submit}>Check explanation</button>{feedback&&<p className={styles.feedback}>{feedback}</p>}</LessonSection>

  <section className={styles.quiz}><h2>AI Cache Lab quiz</h2>{!unlocked?<div className={styles.locked}>🔒 Complete all 10 rooms. {done}/10 tasks · {read}/10 sections.</div>:<>{quiz.map((q,i)=><div className={styles.question} key={q[0]}><strong>{i+1}. {q[0]}</strong>{q[1].map((option,oi)=><button key={option} className={answers[i]===oi?styles.selected:""} onClick={()=>setAnswers(a=>({...a,[i]:oi}))}>{option}</button>)}{answers[i]!==undefined&&<small>{answers[i]===q[2]?"✓ Correct":`Correct: ${q[1][q[2]]}`}</small>}</div>)}<button className={styles.primary} disabled={!quizDone} onClick={()=>progress.saveQuiz(score,score>=9)}>Submit · {score}/10</button>{quizDone&&<p className={styles.feedback}>{score>=9?"★ AI CACHE TYPES MASTERED":"Pass is 9/10. Revisit what each cache actually stores."}</p>}</>}</section>
  <div className={styles.footer}><Link href="/lessons/ai-cost-challenge">← AI Economics</Link><Link href="/lessons/module-23-capstone">Cost + Cache Boss →</Link></div>
 </main>
}
