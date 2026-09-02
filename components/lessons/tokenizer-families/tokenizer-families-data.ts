export type Family="bpe"|"wordpiece"|"sentencepiece";
export const defs=[["three-families","inspect-tokenizer-families"],["bpe-workshop","build-bpe-token"],["wordpiece-workshop","build-wordpiece-token"],["sentencepiece-workshop","inspect-sentencepiece"],["whitespace","inspect-whitespace-markers"],["unknowns","compare-unknown-handling"],["tradeoffs","compare-tokenizer-tradeoffs"],["choose-family","choose-tokenizer-family"],["explain-families","explain-tokenizer-families"]] as const;
export const chooseCases:{text:string;answer:Family}[]=[
{text:"You want a corpus-trained merge table that repeatedly combines adjacent symbols.",answer:"bpe"},
{text:"You want WordPiece-style subword segmentation and familiar continuation-piece intuition such as ##ing.",answer:"wordpiece"},
{text:"You want to train directly from raw text and make whitespace part of the symbol stream rather than requiring a separate language-specific pre-tokenizer.",answer:"sentencepiece"},
];
export const quiz=[
{q:"BPE intuition repeatedly combines…",o:["Selected adjacent symbol pairs","Random labels","Embedding dimensions","Whole datasets"],c:0},
{q:"WordPiece and BPE are exactly the same algorithm with different names.",o:["True","False"],c:1},
{q:"A common pedagogical WordPiece notation uses ## to indicate…",o:["A continuation subword inside a word","BOS","A byte value","An embedding"],c:0},
{q:"SentencePiece is notable because it can train from…",o:["Raw text streams including whitespace representation","Only pre-split English words","Only images","Only token IDs"],c:0},
{q:"The ▁ marker often represents…",o:["A whitespace/word-boundary-like marker in SentencePiece-style rendering","A gradient","A hidden state","A label"],c:0},
{q:"Larger vocabulary usually tends to trade against…",o:["Sequence length / granularity","Learning rate","Number of layers","Test leakage"],c:0},
{q:"Tokenizer choice is part of the model interface and can affect token counts and context use.",o:["True","False"],c:0},
] as const;