"use client";

import Link from "next/link";
import { useState } from "react";
import { LessonProgressApi } from "@/components/course/lesson-shell";
import { LessonSection, TaskStamp } from "@/components/course/lesson-primitives";
import { GraphEdge, GraphNode, KnowledgeGraphViewer } from "@/components/visualizations/knowledge-graph-viewer";
import styles from "./knowledge-graph-lab.module.css";

type Props={progress:LessonProgressApi};
const nodes:GraphNode[]=[
{id:"acme",label:"Acme AI",type:"Company",x:18,y:25},{id:"nova",label:"Nova Labs",type:"Company",x:50,y:20},{id:"maya",label:"Maya Chen",type:"Person",x:80,y:28},{id:"agentx",label:"AgentX",type:"Product",x:25,y:68},{id:"orbit",label:"Orbit",type:"Product",x:58,y:70},{id:"europe",label:"Europe",type:"Region",x:84,y:72},
];
const edges:GraphEdge[]=[
{from:"acme",to:"nova",label:"acquired"},{from:"nova",to:"maya",label:"founded_by"},{from:"acme",to:"agentx",label:"makes"},{from:"nova",to:"orbit",label:"makes"},{from:"orbit",to:"europe",label:"available_in"},{from:"maya",to:"orbit",label:"led"},
];
const ontologyCases=[
["Company, Person, Product and Region","entity-types"],["acquired, founded_by, makes, available_in","relationship-types"],["Person.founded_by.Company as a random untyped string","bad"],["Rules such as Product may be available_in Region","schema-rule"],
] as const;
const entityCases=[
["Acme AI","Company"],["Maya Chen","Person"],["Orbit","Product"],["Europe","Region"],
] as const;
const relationCases=[
["Acme AI → Nova Labs","acquired"],["Nova Labs → Maya Chen","founded_by"],["Nova Labs → Orbit","makes"],["Orbit → Europe","available_in"],
] as const;
const resolutionCases=[
["Nova Labs","Nova Labs"],["Nova Laboratories","Nova Labs"],["nova-labs.com company","Nova Labs"],["Maya Chen","Maya Chen"],
] as const;
const graphRagCases=[
["Who founded the company acquired by Acme AI?","graph-first"],["What exact paragraph describes Orbit pricing?","document-retrieval"],["Which products belong to companies connected to Maya Chen, then fetch their launch docs","graph+docs"],["Find semantically similar support articles","vector-first"],
] as const;
const hybridCases=[
["Use embedding search to find candidate entity mentions, then resolve to graph nodes","vector→graph"],["Traverse product nodes, then fetch related documents for grounded answer","graph→docs"],["Use graph neighbors as metadata/filter expansion for vector retrieval","graph→vector"],["Replace every relationship with one giant text chunk","bad"],
] as const;
const whenCases=[
["Need explicit multi-hop relationships between named entities","graph"],["Need fuzzy semantic similarity over thousands of prose chunks","vector"],["Need both relationship constraints and supporting text evidence","hybrid"],["One simple static FAQ answer with no relationship structure","plain-search"],
] as const;
const quiz=[
["An ontology describes…",["Types/concepts and allowed relationships in a knowledge domain","Only vector embeddings","Only model weights","Only web pages"],0],
["An entity is…",["A specific thing represented as a node/record, such as a person or company","A sampling temperature","A token only","A GPU"],0],
["A knowledge-graph edge represents…",["A relationship between entities","A browser cookie","A model parameter","A diffusion step"],0],
["Entity resolution is needed because…",["Different mentions/names may refer to the same real entity","Graphs cannot store labels","Models cannot read text","Edges are always duplicated"],0],
["Graph traversal is especially useful for…",["Following explicit relationship paths across entities","Only exact keyword search","Only image generation","Only TTS"],0],
["Graph RAG can…",["Use graph structure to select/expand relevant entities then retrieve evidence for grounded generation","Replace all citations","Guarantee truth","Remove the need for source data"],0],
["Vector search and knowledge graphs are mutually exclusive.",["True","False"],1],
["A graph is especially valuable when relationship structure is central to the question.",["True","False"],0],
["Entity resolution mistakes can create wrong graph connections.",["True","False"],0],
["A multi-hop graph answer should still be grounded in trustworthy source/provenance when used for factual claims.",["True","False"],0],
] as const;

export function KnowledgeGraphLabLesson({progress}:Props){
 const [ontology,setOntology]=useState<Record<number,string>>({}),[entity,setEntity]=useState<Record<number,string>>({}),[relations,setRelations]=useState<Record<number,string>>({}),[resolution,setResolution]=useState<Record<number,string>>({}),[path,setPath]=useState<string[]>([]),[queryPath,setQueryPath]=useState<string[]>([]),[rag,setRag]=useState<Record<number,string>>({}),[hybrid,setHybrid]=useState<Record<number,string>>({}),[when,setWhen]=useState<Record<number,string>>({}),[explain,setExplain]=useState(""),[feedback,setFeedback]=useState(""),[answers,setAnswers]=useState<Record<number,number>>({});
 const tasks=["kg-ontology","kg-entities","kg-relationships","kg-resolution","kg-traversal","kg-query","kg-rag","kg-hybrid","kg-when","kg-explain"],sections=["ontology","entities","relationships","resolution","traversal","query","graph-rag","hybrid","when","explain"];
 const done=tasks.filter(t=>progress.completedTasks[t]).length,read=sections.filter(s=>progress.visitedSections.has(s)).length,unlocked=done===10&&read===10;
 const quizScore=quiz.reduce((sum,q,i)=>sum+(answers[i]===q[2]?1:0),0),quizDone=Object.keys(answers).length===quiz.length;
 const solve=(current:Record<number,string>,setter:(next:Record<number,string>)=>void,cases:readonly (readonly [string,string])[],i:number,choice:string,task:string)=>{const next={...current,[i]:choice};setter(next);if(cases.every((x,j)=>next[j]===x[1]))progress.completeTask(task)};
 const walk=(id:string)=>{setPath(current=>{const next=current.includes(id)?current:[...current,id];if(["acme","nova","maya"].every(x=>next.includes(x)))progress.completeTask("kg-traversal");return next})};
 const runMultiHop=()=>{setQueryPath(["acme","nova","maya"]);progress.completeTask("kg-query")};
 const submit=()=>{const t=explain.toLowerCase();const hits=["ontology","entity","relationship","resolution","travers","multi-hop","graph rag","vector","provenance"].filter(w=>t.includes(w)).length;if(explain.length<145||hits<7){setFeedback("Go deeper: define ontology/entities/typed relationships, entity resolution, traversal/multi-hop queries, Graph RAG and graph+vector hybrids.");return;}setFeedback("Strong. You described graphs as explicit relationship structure, not as a fancy vector database.");progress.completeTask("kg-explain")};
 return <main className={styles.root}>
  <section className={styles.hero}><div><span className={styles.eyebrow}>MODULE 19 · KNOWLEDGE GRAPH LAB</span><h1>Documents say things. Graphs say how things relate.</h1><p>Build entities and typed relationships, resolve duplicate names, follow multi-hop paths, then combine graph structure with document/vector retrieval when the answer needs both.</p><TaskStamp done={done===10}>{done}/10 graph missions complete</TaskStamp></div><KnowledgeGraphViewer nodes={nodes} edges={edges} activePath={queryPath.length?queryPath:path} onNode={walk}/></section>

  <LessonSection id="ontology" onVisit={progress.markVisited} className={styles.scene}><h2>1. Ontology: define the kinds of things and relationships that may exist.</h2>{ontologyCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["entity-types","relationship-types","schema-rule","bad"].map(choice=><button key={choice} className={`${styles.button} ${ontology[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(ontology,setOntology,ontologyCases,i,choice,"kg-ontology")}>{choice}</button>)}</div>)}<div className={styles.schema}><span>Company</span><b>— acquired →</b><span>Company</span><span>Company</span><b>— makes →</b><span>Product</span><span>Product</span><b>— available_in →</b><span>Region</span></div></LessonSection>

  <LessonSection id="entities" onVisit={progress.markVisited} className={styles.scene}><h2>2. Entities are specific things inside those types.</h2>{entityCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["Company","Person","Product","Region"].map(choice=><button key={choice} className={`${styles.button} ${entity[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(entity,setEntity,entityCases,i,choice,"kg-entities")}>{choice}</button>)}</div>)}</LessonSection>

  <LessonSection id="relationships" onVisit={progress.markVisited} className={styles.scene}><h2>3. Typed edges make relationships machine-readable.</h2>{relationCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["acquired","founded_by","makes","available_in"].map(choice=><button key={choice} className={`${styles.button} ${relations[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(relations,setRelations,relationCases,i,choice,"kg-relationships")}>{choice}</button>)}</div>)}<KnowledgeGraphViewer nodes={nodes} edges={edges} activePath={[]}/></LessonSection>

  <LessonSection id="resolution" onVisit={progress.markVisited} className={styles.scene}><h2>4. Entity resolution stops aliases from becoming fake people/companies.</h2>{resolutionCases.map((c,i)=><div className={styles.resolve} key={c[0]}><code>{c[0]}</code><span>→ resolve to →</span>{["Nova Labs","Maya Chen","new entity"].map(choice=><button key={choice} className={`${styles.button} ${resolution[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(resolution,setResolution,resolutionCases,i,choice,"kg-resolution")}>{choice}</button>)}</div>)}<p>Resolution may use identifiers, domains, addresses, context, fuzzy matching, embeddings and rules. Wrong resolution can poison every downstream graph traversal.</p></LessonSection>

  <LessonSection id="traversal" onVisit={progress.markVisited} className={styles.scene}><h2>5. Traverse a relationship path by clicking nodes.</h2><p>Question: <b>Who founded the company acquired by Acme AI?</b> Click Acme AI → Nova Labs → Maya Chen.</p><KnowledgeGraphViewer nodes={nodes} edges={edges} activePath={path} onNode={walk}/><button className={styles.button} onClick={()=>setPath([])}>Reset path</button></LessonSection>

  <LessonSection id="query" onVisit={progress.markVisited} className={styles.scene}><h2>6. Multi-hop query: let structure narrow the answer.</h2><div className={styles.queryBox}><code>MATCH (a:Company)-[:acquired]→(b:Company)-[:founded_by]→(p:Person)</code><code>WHERE a.name = "Acme AI" RETURN p</code><button className={styles.primary} onClick={runMultiHop}>Run toy graph query</button></div>{queryPath.length>0&&<><KnowledgeGraphViewer nodes={nodes} edges={edges} activePath={queryPath}/><p className={styles.feedback}>Result: <b>Maya Chen</b>. The query followed explicit relation types rather than asking which paragraph “looks similar.”</p></>}</LessonSection>

  <LessonSection id="graph-rag" onVisit={progress.markVisited} className={styles.scene}><h2>7. Graph RAG can use structure to decide what evidence to retrieve.</h2>{graphRagCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["graph-first","document-retrieval","graph+docs","vector-first"].map(choice=><button key={choice} className={`${styles.button} ${rag[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(rag,setRag,graphRagCases,i,choice,"kg-rag")}>{choice}</button>)}</div>)}<div className={styles.pipeline}><span>QUESTION</span><b>→ graph traversal</b><span>ENTITY SET</span><b>→ retrieve documents</b><span>EVIDENCE</span><b>→ generation + citations</b></div></LessonSection>

  <LessonSection id="hybrid" onVisit={progress.markVisited} className={styles.scene}><h2>8. Graph and vector retrieval can strengthen each other.</h2>{hybridCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["vector→graph","graph→docs","graph→vector","bad"].map(choice=><button key={choice} className={`${styles.button} ${hybrid[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(hybrid,setHybrid,hybridCases,i,choice,"kg-hybrid")}>{choice}</button>)}</div>)}</LessonSection>

  <LessonSection id="when" onVisit={progress.markVisited} className={styles.scene}><h2>9. Do not build a graph just because graphs look smart.</h2>{whenCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["graph","vector","hybrid","plain-search"].map(choice=><button key={choice} className={`${styles.button} ${when[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(when,setWhen,whenCases,i,choice,"kg-when")}>{choice}</button>)}</div>)}</LessonSection>

  <LessonSection id="explain" onVisit={progress.markVisited} className={styles.scene}><h2>10. Explain knowledge graphs as structure, not magic knowledge.</h2><textarea className={styles.textarea} value={explain} onChange={e=>setExplain(e.target.value)} placeholder="Explain ontology, entities, typed relationships, entity resolution, traversal/multi-hop queries, Graph RAG and graph+vector hybrids."/><button className={styles.primary} onClick={submit}>Check explanation</button>{feedback&&<p className={styles.feedback}>{feedback}</p>}</LessonSection>

  <section className={styles.quiz}><h2>Knowledge Graph Lab quiz</h2>{!unlocked?<div className={styles.locked}>🔒 Complete all 10 rooms. {done}/10 tasks · {read}/10 sections.</div>:<>{quiz.map((q,i)=><div className={styles.question} key={q[0]}><strong>{i+1}. {q[0]}</strong>{q[1].map((option,oi)=><button key={option} className={answers[i]===oi?styles.selected:""} onClick={()=>setAnswers(a=>({...a,[i]:oi}))}>{option}</button>)}{answers[i]!==undefined&&<small>{answers[i]===q[2]?"✓ Correct":`Correct: ${q[1][q[2]]}`}</small>}</div>)}<button className={styles.primary} disabled={!quizDone} onClick={()=>progress.saveQuiz(quizScore,quizScore>=9)}>Submit · {quizScore}/10</button>{quizDone&&<p className={styles.feedback}>{quizScore>=9?"★ KNOWLEDGE GRAPHS MASTERED":"Pass is 9/10. Revisit entity resolution and graph-vs-vector use cases."}</p>}</>}</section>
  <div className={styles.footer}><Link href="/lessons/knowledge-search-lab">← Knowledge & Search</Link><Link href="/lessons/module-19-capstone">Knowledge Boss Lab →</Link></div>
 </main>
}
