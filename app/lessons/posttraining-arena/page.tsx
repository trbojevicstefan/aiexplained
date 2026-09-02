"use client";
import {LessonShell} from "@/components/course/lesson-shell";
import {PostTrainingArenaLesson} from "@/components/lessons/posttraining-arena/posttraining-arena-lesson";
const sections=[
{id:"base-sft",title:"Base model vs SFT",taskId:"posttrain-base-sft"},
{id:"instruction",title:"Instruction tuning",taskId:"posttrain-instruction"},
{id:"preferences",title:"Build preference pairs",taskId:"posttrain-preferences"},
{id:"reward-model",title:"Train a reward signal",taskId:"posttrain-reward-model"},
{id:"ppo",title:"PPO and the KL leash",taskId:"posttrain-ppo"},
{id:"dpo",title:"DPO chosen vs rejected",taskId:"posttrain-dpo"},
{id:"rlaif",title:"RLAIF and Constitutional AI",taskId:"posttrain-rlaif"},
{id:"compare",title:"Choose the post-training tool",taskId:"posttrain-compare"},
{id:"explain",title:"Explain post-training back",taskId:"posttrain-explain"},
] as const;
export default function PostTrainingArenaPage(){return <LessonShell lessonId="posttraining-arena" lessonTitle="Post-Training Arena" sections={sections}>{progress=><PostTrainingArenaLesson progress={progress}/>}</LessonShell>}
