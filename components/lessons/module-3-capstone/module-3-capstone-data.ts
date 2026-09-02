export type Cluster="animals"|"vehicles"|"fruit";export type DebugLayer="tokenizer"|"embedding"|"retrieval";
export const defs=[["pipeline","m3-build-pipeline"],["place-words","m3-place-words"],["metric-room","m3-compare-metrics"],["search-room","m3-semantic-search"],["budget-room","m3-token-budget"],["multimodal-room","m3-multimodal-match"],["ann-room","m3-ann-choice"],["debug-room","m3-debug-pipeline"]] as const;
export const words:{word:string;cluster:Cluster}[]=[{word:"puppy",cluster:"animals"},{word:"kitten",cluster:"animals"},{word:"truck",cluster:"vehicles"},{word:"sedan",cluster:"vehicles"},{word:"banana",cluster:"fruit"},{word:"pear",cluster:"fruit"}];
export const debugCases:{text:string;answer:DebugLayer}[]=[{text:"The same visible sentence suddenly uses 30% more context positions after switching model families.",answer:"tokenizer"},{text:"Token IDs are stable, but semantically related items no longer sit near one another after loading a corrupted matrix.",answer:"embedding"},{text:"Vectors look correct, but the search index returns distant neighbors because its metric/config is wrong.",answer:"retrieval"}];
export const exam=[
{q:"Token IDs are categorical vocabulary indices, not semantic coordinates.",o:["True","False"],c:0},
{q:"Which stage creates a continuous vector from a token ID?",o:["Embedding lookup","BPE merge only","Test split","Dropout"],c:0},
{q:"BPE, WordPiece and SentencePiece are exactly identical algorithms.",o:["True","False"],c:1},
{q:"Cosine similarity mostly compares vector direction.",o:["True","False"],c:0},
{q:"Semantic search commonly ranks candidates by…",o:["Embedding similarity","Alphabetical order","Token ID magnitude","Training epoch"],c:0},
{q:"SentencePiece-style ▁ often exposes whitespace/boundary information.",o:["True","False"],c:0},
{q:"Positive scaling can change dot product while preserving cosine direction.",o:["True","False"],c:0},
{q:"Multimodal embedding models can align related text and image representations.",o:["True","False"],c:0},
{q:"ANN indexes are useful because they…",o:["Trade some exact recall for faster large-scale nearest-neighbor search","Create embeddings from scratch","Increase context window","Replace tokenizers"],c:0},
{q:"A context limit is fundamentally about model token/position budget, not human word count.",o:["True","False"],c:0},
{q:"Larger tokenizer vocabulary always improves every model with no tradeoffs.",o:["True","False"],c:1},
{q:"Clustering in embedding space can reveal groups of nearby representations.",o:["True","False"],c:0},
] as const;