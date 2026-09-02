"use client";

import Link from "next/link";
import { useState } from "react";
import { LessonProgressApi } from "@/components/course/lesson-shell";
import { LessonSection, TaskStamp } from "@/components/course/lesson-primitives";
import { GraphEdge, GraphNode, KnowledgeGraphViewer } from "@/components/visualizations/knowledge-graph-viewer";
import styles from "./module-19-capstone.module.css";

type Props={progress:LessonProgressApi};
const nodes:GraphNode[]=[{id:"acme",label:"Acme AI",type:"Company",x:18,y:24},{id:"nova",label:"Nova Labs",type:"Company",x:49,y:19},{id:"maya",label:"Maya Chen",type:"Person",x:79,y:25},{id:"orbit",label:"Orbit",type:"Product",x:54,y:68},{id:"eu",label:"EU",type:"Region",x:84,y:72}];
const edges:GraphEdge[]=[{from:"acme",to:"nova",label:"acquired"},{from:"nova",to:"maya",label:"founded_by"},{from:"nova",to:"orbit",label:"makes"},{from:"orbit",to:"eu",label:"available_in"}];
const sourceCases=[
["Internal acquisition graph","graph"],["Current official Orbit product page","web"],["Old community forum rumor","weak"],["Internal product launch docs","kb"],
] as const;
const searchCases=[
["Find docs saying 'data residency' exactly","keyword"],["Find docs about 'where customer data is stored' with different wording","semantic"],["Combine exact compliance terms + conceptual meaning","hybrid"],["Need today's current official availability page","web"],
] as const;
const resolveCases=[
["Nova Laboratories","Nova Labs"],["nova-labs.com","Nova Labs"],["Acme Artificial Intelligence","Acme AI"],["M. Chen, founder of Nova","Maya Chen"],
] as const;
const rerankCases=[
["Official current product page","keep-high"],["2023 cached blog with obsolete availability","downrank"],["Internal signed acquisition record","keep-high"],["Anonymous forum claim","downrank"],
] as const;
const hybridCases=[
["Graph identifies Orbit as product of acquired Nova; then fetch Orbit docs","graph→docs"],["Semantic search finds mention 'Nova Laboratories'; resolve to graph entity","vector→graph"],["Graph region=EU expands filter for compliance documents","graph→search"],["Ignore graph relationships and use first similar paragraph","bad"],
] as const;
const citationCases=[
["Claim: Acme acquired Nova → cite acquisition record","cite"],["Claim: Maya founded Nova → cite verified company/founder source","cite"],["Claim: Orbit currently available in EU → cite current product page","cite"],["Claim based on forum rumor → cite it as authoritative fact","bad"],
] as const;
const quiz=[
["Knowledge-base search and web search differ mainly in…",["Scope/freshness/ownership of information sources","Whether text exists","Whether embeddings exist","Whether models can answer"],0],
["Keyword search is strongest when…",["Exact lexical terms matter","Only relationships matter","Only audio exists","No text exists"],0],
["Semantic search helps when…",["Relevant wording differs from the query","Exact phrase must match only","No representation exists","Only graph edges matter"],0],
["Hybrid search combines…",["Lexical and semantic evidence","Only two web pages","Only graph nodes","ASR and TTS"],0],
["Entity resolution prevents…",["Aliases from becoming incorrect duplicate or mismatched graph entities","All hallucinations","All stale data","All latency"],0],
["Multi-hop graph traversal is useful for…",["Questions requiring explicit chained relationships","Only typo correction","Image generation","Voice synthesis"],0],
["Graph RAG can use graph structure to…",["Select/expand relevant entities and then retrieve supporting evidence","Replace source provenance","Guarantee truth","Avoid citations"],0],
["High semantic similarity automatically makes a source authoritative.",["True","False"],1],
["Currentness can matter independently from relevance.",["True","False"],0],
["Citation quality depends on…",["Whether the cited evidence actually supports the claim","Only source popularity","Only vector score","Only model confidence"],0],
["Graph and vector search can be combined in one retrieval system.",["True","False"],0],
["A simple FAQ always requires a knowledge graph.",["True","False"],1],
] as const;

export function Module19CapstoneLesson({progress}:Props){
 const [sources,setSources]=useState<Record<number,string>>({}),[search,setSearch]=useState<Record<number,string>>({}),[resolve,setResolve]=useState<Record<number,string>>({}),[path,setPath]=useState<string[]>([]),[rerank,setRerank]=useState<Record<number,string>>({}),[hybrid,setHybrid]=useState<Record<number,string>>({}),[cite,setCite]=useState<Record<number,string>>({}),[explain,setExplain]=useState(""),[feedback,setFeedback]=useState(""),[answers,setAnswers]=useState<Record<number,number>>({});
 const tasks=["m19-sources","m19-search","m19-resolve","m19-traverse","m19-rerank","m19-hybrid","m19-cite","m19-explain"],sections=["sources","search","resolve","traverse","rerank","hybrid","cite","explain"];
 const done=tasks.filter(t=>progress.completedTasks[t]).length,read=sections.filter(s=>progress.visitedSections.has(s)).length,unlocked=done===8&&read===8;
 const quizScore=quiz.reduce((n,q,i)=>n+(answers[i]===q[2]?1:0),0),quizDone=Object.keys(answers).length===quiz.length;
 const solve=(current:Record<number,string>,setter:(next:Record<number,string>)=>void,cases:readonly (readonly [string,string])[],i:number,choice:string,task:string)=>{const next={...current,[i]:choice};setter(next);if(cases.every((x,j)=>next[j]===x[1]))progress.completeTask(task)};
 const walk=(id:string)=>{const next=path.includes(id)?path:[...path,id];setPath(next);if(["acme","nova","orbit","eu"].every(x=>next.includes(x)))progress.completeTask("m19-traverse")};
 const submit=()=>{const t=explain.toLowerCase();const hits=["knowledge base","web","keyword","semantic","hybrid","entity","graph","travers","rerank","source","citation"].filter(w=>t.includes(w)).length;if(explain.length<160||hits<8){setFeedback("Go deeper: explain source selection, search mode, entity resolution, multi-hop graph traversal, reranking/trust, graph+document hybrid and citations.");return;}setFeedback("Strong. You built an evidence investigation pipeline that distinguishes retrieval mechanism from source authority and graph structure.");progress.completeTask("m19-explain")};
 return <main className={styles.root}>
  <section className={styles.hero}><div><span className={styles.eyebrow}>MODULE 19 · KNOWLEDGE INVESTIGATION BOSS</span><h1>Who owns Orbit, who founded them, and is Orbit in the EU today?</h1><p>One question needs internal relationship structure <b>and</b> current evidence. Build the investigation path instead of asking one search box to do everything.</p><TaskStamp done={done===8}>{done}/8 boss missions complete</TaskStamp></div><KnowledgeGraphViewer nodes={nodes} edges={edges} activePath={path} onNode={walk}/></section>

  <LessonSection id="sources" onVisit={progress.markVisited} className={styles.scene}><h2>1. Decide which source systems belong in the investigation.</h2>{sourceCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["graph","web","kb","weak"].map(choice=><button key={choice} className={`${styles.button} ${sources[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(sources,setSources,sourceCases,i,choice,"m19-sources")}>{choice}</button>)}</div>)}</LessonSection>

  <LessonSection id="search" onVisit={progress.markVisited} className={styles.scene}><h2>2. Choose the search mode by information need.</h2>{searchCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["keyword","semantic","hybrid","web"].map(choice=><button key={choice} className={`${styles.button} ${search[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(search,setSearch,searchCases,i,choice,"m19-search")}>{choice}</button>)}</div>)}</LessonSection>

  <LessonSection id="resolve" onVisit={progress.markVisited} className={styles.scene}><h2>3. Resolve mentions before attaching facts to the graph.</h2>{resolveCases.map((c,i)=><div className={styles.resolve} key={c[0]}><code>{c[0]}</code><b>→</b>{["Nova Labs","Acme AI","Maya Chen","new entity"].map(choice=><button key={choice} className={`${styles.button} ${resolve[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(resolve,setResolve,resolveCases,i,choice,"m19-resolve")}>{choice}</button>)}</div>)}</LessonSection>

  <LessonSection id="traverse" onVisit={progress.markVisited} className={styles.scene}><h2>4. Follow the ownership/product path.</h2><p>Click <b>Acme AI → Nova Labs → Orbit → EU</b>. This path answers relationship structure; it does not by itself prove that the graph is current.</p><KnowledgeGraphViewer nodes={nodes} edges={edges} activePath={path} onNode={walk}/><button className={styles.button} onClick={()=>setPath([])}>Reset path</button></LessonSection>

  <LessonSection id="rerank" onVisit={progress.markVisited} className={styles.scene}><h2>5. Rerank for relevance, authority and freshness.</h2>{rerankCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["keep-high","downrank"].map(choice=><button key={choice} className={`${styles.button} ${rerank[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(rerank,setRerank,rerankCases,i,choice,"m19-rerank")}>{choice}</button>)}</div>)}</LessonSection>

  <LessonSection id="hybrid" onVisit={progress.markVisited} className={styles.scene}><h2>6. Combine graph structure with document evidence.</h2>{hybridCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["graph→docs","vector→graph","graph→search","bad"].map(choice=><button key={choice} className={`${styles.button} ${hybrid[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(hybrid,setHybrid,hybridCases,i,choice,"m19-hybrid")}>{choice}</button>)}</div>)}</LessonSection>

  <LessonSection id="cite" onVisit={progress.markVisited} className={styles.scene}><h2>7. Attach each claim to evidence that actually supports it.</h2>{citationCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["cite","bad"].map(choice=><button key={choice} className={`${styles.button} ${cite[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(cite,setCite,citationCases,i,choice,"m19-cite")}>{choice}</button>)}</div>)}<div className={styles.answer}><b>FINAL INVESTIGATION</b><p>Acme AI acquired Nova Labs. Nova was founded by Maya Chen. Orbit is a Nova product and is currently listed as available in the EU. <sup>[acquisition record] [founder source] [current Orbit page]</sup></p></div></LessonSection>

  <LessonSection id="explain" onVisit={progress.markVisited} className={styles.scene}><h2>8. Explain the investigation pipeline end to end.</h2><textarea className={styles.textarea} value={explain} onChange={e=>setExplain(e.target.value)} placeholder="Explain source selection, lexical/semantic/hybrid/web search, entity resolution, graph traversal, reranking/trust and citations."/><button className={styles.primary} onClick={submit}>Check explanation</button>{feedback&&<p className={styles.feedback}>{feedback}</p>}</LessonSection>

  <section className={styles.quiz}><h2>Module 19 mastery exam</h2>{!unlocked?<div className={styles.locked}>🔒 Complete all eight boss rooms. {done}/8 tasks · {read}/8 sections.</div>:<>{quiz.map((q,i)=><div className={styles.question} key={q[0]}><strong>{i+1}. {q[0]}</strong>{q[1].map((option,oi)=><button key={option} className={answers[i]===oi?styles.selected:""} onClick={()=>setAnswers(a=>({...a,[i]:oi}))}>{option}</button>)}{answers[i]!==undefined&&<small>{answers[i]===q[2]?"✓ Correct":`Correct: ${q[1][q[2]]}`}</small>}</div>)}<button className={styles.primary} disabled={!quizDone} onClick={()=>progress.saveQuiz(quizScore,quizScore>=10)}>Submit · {quizScore}/12</button>{quizDone&&<p className={styles.feedback}>{quizScore>=10?"★ SEARCH + KNOWLEDGE GRAPHS MASTERED":"Pass is 10/12. Revisit retrieval vs authority and graph/entity resolution."}</p>}</>}</section>
  <div className={styles.footer}><Link href="/lessons/knowledge-graph-lab">← Knowledge Graphs</Link><Link href="/lessons/ai-api-request-builder">AI APIs →</Link></div>
 </main>
}
