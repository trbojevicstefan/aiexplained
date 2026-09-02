"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { LessonProgressApi } from "@/components/course/lesson-shell";
import { LessonSection, TaskStamp } from "@/components/course/lesson-primitives";
import styles from "./knowledge-search-lab.module.css";

type Props={progress:LessonProgressApi};
type Mode="keyword"|"semantic"|"hybrid";
const docs=[
{id:"d1",title:"Cancellation policy",text:"Guests may cancel free of charge until 48 hours before check-in.",lex:.18,sem:.94,source:"internal policy",fresh:true,authority:95},
{id:"d2",title:"Refund FAQ",text:"Refunds for eligible cancellations are returned to the original payment method.",lex:.48,sem:.78,source:"internal FAQ",fresh:true,authority:90},
{id:"d3",title:"Old blog post",text:"Cancellation fees may apply after booking.",lex:.68,sem:.64,source:"blog 2023",fresh:false,authority:45},
{id:"d4",title:"Community forum",text:"Someone said they got a full refund the day before arrival.",lex:.42,sem:.61,source:"forum",fresh:true,authority:25},
];
const kbCases=[
["Curated company policies and FAQ documents","knowledge-base"],["Random pages currently discoverable on the public web","web"],["CRM customers and contracts stored in internal databases","knowledge-base"],["Model weights learned during pretraining","not-kb"],
] as const;
const webCases=[
["Need today's product pricing from official vendor site","web"],["Need private employee handbook already indexed internally","internal"],["Need current breaking news across publishers","web"],["Need stable user preference stored in profile","memory"],
] as const;
const rewriteCases=[
["'refund tomorrow?' → 'hotel cancellation refund one day before check-in'","rewrite"],["Add synonyms: refund / reimbursement / money back","expansion"],["Generate three alternate phrasings and retrieve for each","multi-query"],["Replace query with unrelated broad topic","bad"],
] as const;
const sourceCases=[
["Official current policy page","high"],["Anonymous forum anecdote","low"],["Current regulator guidance for legal requirement","high"],["Undated SEO summary copying another site","low"],
] as const;
const citationCases=[
["Answer: 'Free cancellation until 48 hours before check-in.' supported by current policy chunk","cite"],["Answer uses no retrieved evidence but adds citation marker anyway","bad"],["Citation points to obsolete version contradicting current policy","bad"],["Each material factual claim links to the evidence actually used","cite"],
] as const;
const quiz=[
["A knowledge base is…",["An organized collection of information a system can retrieve/use","The model weights only","A sampling strategy","A GPU queue"],0],
["Keyword search is especially sensitive to…",["Literal terms/lexical overlap","Only vector distance","Only image pixels","Only speaker identity"],0],
["Semantic search aims to retrieve…",["Conceptually similar/relevant content even when wording differs","Only exact string matches","Only current web pages","Only graph neighbors"],0],
["Hybrid search combines…",["Lexical and semantic signals","ASR and TTS","Only two LLMs","Memory and weights"],0],
["Web search is particularly useful when…",["Fresh public information outside the local knowledge base is needed","Only static internal policy is needed","No internet access is allowed","We need workflow state"],0],
["Query rewriting can improve retrieval by…",["Expressing the information need in a form better matched to indexed content","Changing model weights","Deleting sources","Avoiding all evaluation"],0],
["A reranker…",["Re-scores retrieved candidates for relevance after initial retrieval","Always generates final answer","Builds a tokenizer","Stores cookies"],0],
["High similarity score guarantees source credibility.",["True","False"],1],
["Citations should ideally point to…",["Evidence actually supporting the claim","Any popular page","The first search result regardless of content","A model name"],0],
["Retrieval quality and source trustworthiness are separate dimensions.",["True","False"],0],
] as const;

export function KnowledgeSearchLabLesson({progress}:Props){
 const [kb,setKb]=useState<Record<number,string>>({}),[mode,setMode]=useState<Mode>("keyword"),[seenModes,setSeenModes]=useState<Mode[]>([]),[lexWeight,setLexWeight]=useState(50),[web,setWeb]=useState<Record<number,string>>({}),[rewrite,setRewrite]=useState<Record<number,string>>({}),[query,setQuery]=useState("Can I get my money back if I cancel two days before arrival?"),[reranked,setReranked]=useState(false),[sources,setSources]=useState<Record<number,string>>({}),[citations,setCitations]=useState<Record<number,string>>({}),[explain,setExplain]=useState(""),[feedback,setFeedback]=useState(""),[answers,setAnswers]=useState<Record<number,number>>({});
 const tasks=["ks-kb","ks-keyword","ks-semantic","ks-hybrid","ks-web","ks-rewrite","ks-rerank","ks-sources","ks-citations","ks-explain"],sections=["kb","keyword","semantic","hybrid","web","rewrite","rerank","sources","citations","explain"];
 const done=tasks.filter(t=>progress.completedTasks[t]).length,read=sections.filter(s=>progress.visitedSections.has(s)).length,unlocked=done===10&&read===10;
 const quizScore=quiz.reduce((n,q,i)=>n+(answers[i]===q[2]?1:0),0),quizDone=Object.keys(answers).length===quiz.length;
 const solve=(current:Record<number,string>,setter:(next:Record<number,string>)=>void,cases:readonly (readonly [string,string])[],i:number,choice:string,task:string)=>{const next={...current,[i]:choice};setter(next);if(cases.every((x,j)=>next[j]===x[1]))progress.completeTask(task)};
 const ranked=useMemo(()=>[...docs].map(doc=>{const base=mode==="keyword"?doc.lex:mode==="semantic"?doc.sem:doc.lex*(lexWeight/100)+doc.sem*(1-lexWeight/100);const credibility=doc.authority/100*(doc.fresh?1:.7);const final=reranked?base*.72+credibility*.28:base;return{...doc,base,final}}).sort((a,b)=>b.final-a.final),[mode,lexWeight,reranked]);
 const selectMode=(next:Mode)=>{setMode(next);setSeenModes(current=>{const merged=[...new Set([...current,next])];if(merged.includes("keyword"))progress.completeTask("ks-keyword");if(merged.includes("semantic"))progress.completeTask("ks-semantic");if(merged.includes("hybrid"))progress.completeTask("ks-hybrid");return merged})};
 const submit=()=>{const t=explain.toLowerCase();const hits=["knowledge base","keyword","semantic","hybrid","web","rewrite","rerank","source","credib","citation"].filter(w=>t.includes(w)).length;if(explain.length<150||hits<7){setFeedback("Go deeper: distinguish knowledge base vs web search, lexical/semantic/hybrid retrieval, query rewrite, reranking, source credibility and citations.");return;}setFeedback("Strong. You separated retrieval relevance from source trust and final evidence/citation responsibility.");progress.completeTask("ks-explain")};
 return <main className={styles.root}>
  <section className={styles.hero}><div><span className={styles.eyebrow}>MODULE 19 · KNOWLEDGE & SEARCH LAB</span><h1>Finding something similar is not the same as finding something trustworthy.</h1><p>Run one question through lexical, semantic, hybrid and web-search mental models. Then improve it with query rewriting, reranking, source selection and real evidence citations.</p><TaskStamp done={done===10}>{done}/10 search missions complete</TaskStamp></div><div className={styles.searchBox}><span>QUERY</span><p>{query}</p><div>{(["keyword","semantic","hybrid"] as Mode[]).map(item=><button key={item} className={mode===item?styles.active:""} onClick={()=>selectMode(item)}>{item}</button>)}</div></div></section>

  <LessonSection id="kb" onVisit={progress.markVisited} className={styles.scene}><h2>1. What counts as a knowledge base?</h2>{kbCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["knowledge-base","web","not-kb"].map(choice=><button key={choice} className={`${styles.button} ${kb[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(kb,setKb,kbCases,i,choice,"ks-kb")}>{choice}</button>)}</div>)}<p>A knowledge base can live in documents, databases, graph stores or other managed sources. It is a product/system information source, distinct from the model's pretrained weights.</p></LessonSection>

  <LessonSection id="keyword" onVisit={progress.markVisited} className={styles.scene}><h2>2. Keyword search rewards literal overlap.</h2><button className={styles.primary} onClick={()=>selectMode("keyword")}>Run keyword search</button><ResultList rows={ranked}/><p>Notice how a document using the exact word “cancellation” may rank strongly even if its policy is stale.</p></LessonSection>

  <LessonSection id="semantic" onVisit={progress.markVisited} className={styles.scene}><h2>3. Semantic/vector search can bridge wording gaps.</h2><button className={styles.primary} onClick={()=>selectMode("semantic")}>Run semantic search</button><ResultList rows={ranked}/><p>The query says “money back,” while the relevant documents may say “refund” or “eligible cancellation.” Semantic representations can connect those concepts.</p></LessonSection>

  <LessonSection id="hybrid" onVisit={progress.markVisited} className={styles.scene}><h2>4. Hybrid search blends two useful failure modes.</h2><label className={styles.slider}>Lexical weight <b>{lexWeight}%</b><input type="range" min="0" max="100" value={lexWeight} onChange={e=>{setLexWeight(+e.target.value);selectMode("hybrid")}}/></label><ResultList rows={ranked}/><p>Hybrid systems may use weighted score fusion, reciprocal-rank fusion or other approaches. This toy blend is deliberately simple.</p></LessonSection>

  <LessonSection id="web" onVisit={progress.markVisited} className={styles.scene}><h2>5. Web search and internal search solve different freshness/scope problems.</h2>{webCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["web","internal","memory"].map(choice=><button key={choice} className={`${styles.button} ${web[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(web,setWeb,webCases,i,choice,"ks-web")}>{choice}</button>)}</div>)}<p>Search agents often decide which source family to query, then gather, normalize, deduplicate and evaluate evidence before answering.</p></LessonSection>

  <LessonSection id="rewrite" onVisit={progress.markVisited} className={styles.scene}><h2>6. Rewrite the information need, not the user's intent.</h2><label className={styles.query}>Search query<input value={query} onChange={e=>setQuery(e.target.value)}/></label>{rewriteCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["rewrite","expansion","multi-query","bad"].map(choice=><button key={choice} className={`${styles.button} ${rewrite[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(rewrite,setRewrite,rewriteCases,i,choice,"ks-rewrite")}>{choice}</button>)}</div>)}</LessonSection>

  <LessonSection id="rerank" onVisit={progress.markVisited} className={styles.scene}><h2>7. Retrieve broadly, then rerank with richer signals.</h2><button className={styles.primary} onClick={()=>{setReranked(true);progress.completeTask("ks-rerank")}}>Apply relevance + credibility/freshness reranker</button><ResultList rows={ranked}/><p>Reranking can use a cross-encoder/model or additional metadata/rules. The important idea is a second scoring stage over a smaller candidate set.</p></LessonSection>

  <LessonSection id="sources" onVisit={progress.markVisited} className={styles.scene}><h2>8. Relevance score does not grant authority.</h2>{sourceCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["high","low"].map(choice=><button key={choice} className={`${styles.button} ${sources[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(sources,setSources,sourceCases,i,choice,"ks-sources")}>{choice}</button>)}</div>)}</LessonSection>

  <LessonSection id="citations" onVisit={progress.markVisited} className={styles.scene}><h2>9. Citation is a mapping from claim back to evidence.</h2>{citationCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["cite","bad"].map(choice=><button key={choice} className={`${styles.button} ${citations[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(citations,setCitations,citationCases,i,choice,"ks-citations")}>{choice}</button>)}</div>)}<div className={styles.answer}><b>ANSWER</b><p>Free cancellation is available until 48 hours before check-in. <sup>[Policy v4]</sup></p><small>Citation should resolve to the exact current evidence used for the claim.</small></div></LessonSection>

  <LessonSection id="explain" onVisit={progress.markVisited} className={styles.scene}><h2>10. Explain a trustworthy search pipeline.</h2><textarea className={styles.textarea} value={explain} onChange={e=>setExplain(e.target.value)} placeholder="Explain knowledge bases, keyword/semantic/hybrid/web search, query rewriting, reranking, source credibility and citations."/><button className={styles.primary} onClick={submit}>Check explanation</button>{feedback&&<p className={styles.feedback}>{feedback}</p>}</LessonSection>

  <section className={styles.quiz}><h2>Knowledge & Search quiz</h2>{!unlocked?<div className={styles.locked}>🔒 Complete all 10 rooms. {done}/10 tasks · {read}/10 sections.</div>:<>{quiz.map((q,i)=><div className={styles.question} key={q[0]}><strong>{i+1}. {q[0]}</strong>{q[1].map((option,oi)=><button key={option} className={answers[i]===oi?styles.selected:""} onClick={()=>setAnswers(a=>({...a,[i]:oi}))}>{option}</button>)}{answers[i]!==undefined&&<small>{answers[i]===q[2]?"✓ Correct":`Correct: ${q[1][q[2]]}`}</small>}</div>)}<button className={styles.primary} disabled={!quizDone} onClick={()=>progress.saveQuiz(quizScore,quizScore>=9)}>Submit · {quizScore}/10</button>{quizDone&&<p className={styles.feedback}>{quizScore>=9?"★ SEARCH PIPELINES MASTERED":"Pass is 9/10. Revisit relevance vs trust/citations."}</p>}</>}</section>
  <div className={styles.footer}><Link href="/lessons/module-18-capstone">← Multimodal AI</Link><Link href="/lessons/knowledge-graph-lab">Knowledge Graphs →</Link></div>
 </main>
}

function ResultList({rows}:{rows:Array<{id:string;title:string;text:string;source:string;fresh:boolean;authority:number;final:number}>}){
 return <div className={styles.results}>{rows.map((row,index)=><div key={row.id}><span>#{index+1}</span><div><b>{row.title}</b><p>{row.text}</p><small>{row.source} · {row.fresh?"current":"stale"} · authority {row.authority}</small></div><em>{Math.round(row.final*100)}</em></div>)}</div>
}
