"use client";

import { AiMascot } from "@/components/mascots/ai-mascot";
import styles from "./model-memory-estimator.module.css";

export type Precision="FP32"|"FP16"|"BF16"|"INT8"|"INT4";
const bits:Record<Precision,number>={FP32:32,FP16:16,BF16:16,INT8:8,INT4:4};
export function estimateWeightGb(paramsB:number,precision:Precision){return paramsB*1e9*bits[precision]/8/1e9}
export function ModelMemoryEstimator({paramsB,precision,contextK=8,concurrency=1,availableVram=16}:{paramsB:number;precision:Precision;contextK?:number;concurrency?:number;availableVram?:number}){
 const weights=estimateWeightGb(paramsB,precision);const kv=Math.max(.2,paramsB*.0125*contextK*concurrency);const overhead=Math.max(.6,weights*.12);const total=weights+kv+overhead;const fits=total<=availableVram;
 return <div className={styles.wrap}><div className={styles.mascot}><AiMascot variant="briefcase" accent={fits?"#79dba8":"#ff8a8a"} mood={fits?"excited":"wow"} size={82} label={fits?"FITS":"OOM?"}/></div><div className={styles.stats}><div><span>weights</span><b>{weights.toFixed(1)} GB</b><small>{paramsB}B × {bits[precision]} bits ÷ 8</small></div><div><span>toy KV/cache estimate</span><b>{kv.toFixed(1)} GB</b><small>{contextK}k ctx × {concurrency} stream(s)</small></div><div><span>runtime overhead proxy</span><b>{overhead.toFixed(1)} GB</b><small>allocator / buffers / runtime</small></div><div className={fits?styles.fit:styles.fail}><span>toy total</span><b>{total.toFixed(1)} / {availableVram} GB</b><small>{fits?"fits this simplified budget":"does not fit simplified VRAM budget"}</small></div></div><p>This is a teaching estimator, not a deployment calculator. Real KV size depends on architecture, layers, hidden/head dimensions, KV precision, batching and runtime; quantization metadata/overheads also vary.</p></div>
}
