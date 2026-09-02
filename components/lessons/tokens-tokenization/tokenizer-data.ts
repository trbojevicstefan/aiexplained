export type TokenMode="word"|"char"|"byte"|"subword";
export const defs=[["split-text","split-text-into-tokens"],["strategy","compare-token-units"],["vocab-ids","inspect-token-ids"],["special-tokens","inspect-special-tokens"],["bpe-lab","run-bpe-merges"],["different-tokenizers","compare-tokenizers"],["context-limit","hit-token-limit"],["token-myths","destroy-token-myths"],["explain-tokenization","explain-tokenization"]] as const;

const pieces=(text:string)=>text.match(/[A-Za-z]+|\d+|[^\sA-Za-z\d]/g)??[];
export const wordTokens=(text:string)=>pieces(text);
export const charTokens=(text:string)=>Array.from(text);
export const byteTokens=(text:string)=>Array.from(new TextEncoder().encode(text)).map(n=>`0x${n.toString(16).padStart(2,"0")}`);

function splitA(word:string){const w=word.toLowerCase();const map:Record<string,string[]>={artificial:["art","ificial"],intelligence:["intelli","gence"],tokenization:["token","ization"],unbelievable:["un","believ","able"],running:["run","ning"],models:["model","s"]};return map[w]??(word.length>7?[word.slice(0,4),word.slice(4)]:[word]);}
function splitB(word:string){const w=word.toLowerCase();const map:Record<string,string[]>={artificial:["artificial"],intelligence:["intel","ligence"],tokenization:["tokenization"],unbelievable:["unbelievable"],running:["running"],models:["models"]};return map[w]??(word.length>9?[word.slice(0,6),word.slice(6)]:[word]);}
export const tokenizerA=(text:string)=>pieces(text).flatMap(p=>/^[A-Za-z]+$/.test(p)?splitA(p):[p]);
export const tokenizerB=(text:string)=>pieces(text).flatMap(p=>/^[A-Za-z]+$/.test(p)?splitB(p):[p]);
export const tokenize=(text:string,mode:TokenMode)=>mode==="word"?wordTokens(text):mode==="char"?charTokens(text):mode==="byte"?byteTokens(text):tokenizerA(text);

export const tokenId=(token:string)=>{let h=2166136261;for(const ch of token){h^=ch.codePointAt(0)??0;h=Math.imul(h,16777619);}return 100+((h>>>0)%48000);};
export const myths=[
  {text:"One visible word always equals one token.",answer:false},
  {text:"A token ID like 4812 is just a vocabulary index; its numeric magnitude is not semantic meaning.",answer:true},
  {text:"Different model families can tokenize the same text differently.",answer:true},
  {text:"Punctuation, whitespace and unusual characters can affect token counts.",answer:true},
] as const;
export const quiz=[
  {q:"What is a token?",o:["A model-specific unit produced by a tokenizer","Always exactly one English word","A neural weight","A training epoch"],c:0},
  {q:"Token ID 9000 is semantically nine times larger than token ID 1000.",o:["True","False"],c:1},
  {q:"Why can two models count the same sentence differently?",o:["They may use different tokenizer vocabularies/merge rules","Math is inconsistent","Words change spelling","Token IDs are random each request"],c:0},
  {q:"BPE intuition starts from smaller units and repeatedly…",o:["Merges frequent/useful adjacent pairs","Deletes all rare words","Adds labels","Runs backprop"],c:0},
  {q:"BOS/EOS are examples of…",o:["Special tokens","Hidden layers","Gradients","CNN kernels"],c:0},
  {q:"A context limit is usually enforced in terms of…",o:["Tokens/positions rather than human-visible word count","Only paragraphs","Only characters","Only sentences"],c:0},
  {q:"Byte, character, word and subword tokenization trade off vocabulary size and sequence length differently.",o:["True","False"],c:0},
] as const;