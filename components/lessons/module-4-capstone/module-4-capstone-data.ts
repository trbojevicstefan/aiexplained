export type PositionChoice="learned"|"sinusoidal"|"rope";export type Family="encoder"|"decoder"|"encdec";
export const defs=[["assemble-block","m4-assemble-block"],["edit-attention","m4-edit-attention"],["mask-incident","m4-fix-causal-mask"],["position-room","m4-position-choice"],["head-room","m4-head-comparison"],["cache-room","m4-cache-choice"],["family-room","m4-family-choice"],["ship-block","m4-ship-block"]] as const;
export const blockOrder=["QKV projections","attention + softmax","weighted values / heads","residual + norm","MLP / FFN","residual + norm"];
export const familyCases:{text:string;answer:Family}[]=[{text:"Bidirectional sentence representations for classification.",answer:"encoder"},{text:"Autoregressive prompt continuation.",answer:"decoder"},{text:"Translation with a separate source sequence and generated target.",answer:"encdec"}];
export const exam=[
{q:"Scaled dot-product attention begins with…",o:["QKᵀ / √dₖ","VVᵀ only","Token ID addition","Loss gradients"],c:0},
{q:"Softmax converts one query's attention scores into normalized weights.",o:["True","False"],c:0},
{q:"Attention outputs are weighted mixtures of…",o:["Value vectors","Token IDs","Labels","Optimizer states"],c:0},
{q:"Multi-head attention uses multiple learned projection subspaces.",o:["True","False"],c:0},
{q:"RoPE injects position by…",o:["Position-dependent rotations of Q/K feature pairs","Deleting tokens","Caching values","Changing vocabulary"],c:0},
{q:"Causal masking prevents future-token visibility.",o:["True","False"],c:0},
{q:"KV cache helps autoregressive decoding by reusing past keys/values.",o:["True","False"],c:0},
{q:"Flash Attention and sparse attention are identical because both skip arbitrary query-key pairs.",o:["True","False"],c:1},
{q:"Sliding-window attention restricts interactions to a local neighborhood.",o:["True","False"],c:0},
{q:"Encoder-only attention is commonly bidirectional over input tokens.",o:["True","False"],c:0},
{q:"Cross-attention usually uses decoder queries and encoder keys/values.",o:["True","False"],c:0},
{q:"Residual + LayerNorm and MLP are part of the transformer block flow beyond attention itself.",o:["True","False"],c:0},
] as const;