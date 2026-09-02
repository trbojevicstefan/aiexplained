"use client";

export type VectorPoint2D={id:string;label:string;x:number;y:number;group?:string};

type Props={points:VectorPoint2D[];activeId?:string;onSelect?:(id:string)=>void;height?:number};

export function VectorPlot2D({points,activeId,onSelect,height=320}:Props){
  return <div style={{position:"relative",height,border:"2px solid #15130f",borderRadius:18,background:"linear-gradient(#fff,#f8f8ff)",overflow:"hidden"}}>
    <i style={{position:"absolute",left:"50%",top:0,bottom:0,width:1,background:"#c8c1b7"}}/>
    <i style={{position:"absolute",top:"50%",left:0,right:0,height:1,background:"#c8c1b7"}}/>
    {points.map(p=><button key={p.id} onClick={()=>onSelect?.(p.id)} title={`${p.label} (${p.x.toFixed(2)}, ${p.y.toFixed(2)})`} style={{position:"absolute",left:`${(p.x+1)*50}%`,top:`${(1-p.y)*50}%`,transform:"translate(-50%,-50%)",border:"2px solid #15130f",borderRadius:999,padding:"7px 10px",background:p.id===activeId?"#c9f66d":"#fff",boxShadow:"2px 2px 0 #15130f",fontWeight:800,cursor:"pointer",whiteSpace:"nowrap"}}>{p.label}</button>)}
  </div>;
}
