"use client";

import { motion } from "motion/react";
import { AiMascot } from "@/components/mascots/ai-mascot";
import styles from "./schema-validator.module.css";

export type BookingOutput={status?:unknown;event_id?:unknown;start?:unknown;duration_minutes?:unknown};
export function validateBooking(value:BookingOutput){const errors:string[]=[];if(typeof value.status!=="string")errors.push("status must be string");if(value.event_id!==undefined&&typeof value.event_id!=="string")errors.push("event_id must be string when present");if(typeof value.start!=="string")errors.push("start must be string");if(typeof value.duration_minutes!=="number")errors.push("duration_minutes must be number");return errors}
export function SchemaValidator({value}:{value:BookingOutput}){const errors=validateBooking(value);return <div className={styles.wrap}><div className={styles.schema}><header>JSON SCHEMA</header><pre>{`{\n  "type": "object",\n  "required": ["status","start","duration_minutes"],\n  "properties": {\n    "status": {"type":"string"},\n    "event_id": {"type":"string"},\n    "start": {"type":"string"},\n    "duration_minutes": {"type":"number"}\n  }\n}`}</pre></div><div className={styles.gate}><AiMascot variant="briefcase" accent={errors.length?"#ff8585":"#73d9ad"} mood={errors.length?"wow":"excited"} size={70} label="VALIDATE"/><motion.i animate={errors.length?{x:[-5,5,-5]}:{scale:[1,1.2,1]}} transition={{duration:.8,repeat:Infinity}}/><b>{errors.length?"REJECT":"ACCEPT"}</b></div><div className={styles.output}><header>MODEL OUTPUT</header><pre>{JSON.stringify(value,null,2)}</pre>{errors.length?<ul>{errors.map(error=><li key={error}>{error}</li>)}</ul>:<p>✓ syntax + schema shape accepted</p>}</div></div>}
