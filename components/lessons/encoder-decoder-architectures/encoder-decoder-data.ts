export type Family="encoder"|"decoder"|"encdec";
export const defs=[["why-transformers","compare-recurrence-transformers"],["encoder","inspect-encoder"],["decoder","inspect-decoder"],["cross-attention","run-cross-attention"],["encoder-only","inspect-encoder-only"],["decoder-only","inspect-decoder-only"],["encoder-decoder","inspect-encoder-decoder"],["choose-architecture","choose-transformer-family"],["explain-families","explain-transformer-families"]] as const;
export const source=["the","red","cube"],target=["le","cube","rouge"];
export const encoderWeights=[[.42,.32,.26],[.25,.48,.27],[.22,.28,.50]];
export const decoderWeights=[[1,0,0],[.44,.56,0],[.22,.36,.42]];
export const decoderMask=[[false,true,true],[false,false,true],[false,false,false]];
export const crossWeights=[[.52,.18,.30],[.18,.12,.70],[.16,.68,.16]];
export const cases:{text:string;answer:Family}[]=[
{text:"Encode a sentence into representations for classification where every input token may use both left and right context.",answer:"encoder"},
{text:"Autoregressively continue a prompt one token at a time.",answer:"decoder"},
{text:"Translate a source sentence into a target sentence while target tokens attend to encoded source representations.",answer:"encdec"},
{text:"Masked-language-style representation learning over bidirectional context.",answer:"encoder"},
{text:"Generate code from an instruction using causal next-token prediction.",answer:"decoder"},
];
export const quiz=[
{q:"Encoder self-attention is commonly…",o:["Bidirectional over the available input sequence","Always causal","Cross-attention only","Tokenization"],c:0},
{q:"A decoder-only language model normally uses…",o:["Causal self-attention","Only bidirectional attention","No attention","CNN kernels only"],c:0},
{q:"In encoder-decoder cross-attention, decoder representations typically provide…",o:["Queries, while encoder outputs provide keys/values","Only values for themselves","Token IDs only","Gradients only"],c:0},
{q:"Encoder-only models are naturally suited to representation/classification-style input understanding tasks.",o:["True","False"],c:0},
{q:"Decoder-only models generate autoregressively by predicting the next token from prior visible context.",o:["True","False"],c:0},
{q:"Encoder-decoder models can separate source encoding from target generation.",o:["True","False"],c:0},
{q:"Transformers became attractive partly because attention shortens long dependency paths and permits more parallel training across sequence positions than strict recurrence.",o:["True","False"],c:0},
] as const;