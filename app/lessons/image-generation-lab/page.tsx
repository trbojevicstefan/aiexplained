"use client";
import { LessonShell } from "@/components/course/lesson-shell";
import { ImageGenerationLabLesson } from "@/components/lessons/image-generation-lab/image-generation-lab-lesson";
const sections=[
{id:"diffusion",title:"Noise and denoising",taskId:"img-diffusion"},
{id:"steps",title:"Sampling steps",taskId:"img-steps"},
{id:"latent",title:"Latent diffusion and VAE",taskId:"img-latent"},
{id:"denoiser",title:"U-Net and Diffusion Transformers",taskId:"img-denoiser"},
{id:"conditioning",title:"Text conditioning",taskId:"img-conditioning"},
{id:"clip",title:"Joint text-image representations",taskId:"img-clip"},
{id:"control",title:"Structural conditioning / ControlNet intuition",taskId:"img-control"},
{id:"editing",title:"Inpainting and outpainting",taskId:"img-editing"},
{id:"img2img",title:"Image-to-image and style transfer",taskId:"img-img2img"},
{id:"explain",title:"Explain image generation",taskId:"img-explain"},
] as const;
export default function ImageGenerationLabPage(){return <LessonShell lessonId="image-generation-lab" lessonTitle="Image Generation Lab" sections={sections}>{progress=><ImageGenerationLabLesson progress={progress}/>}</LessonShell>}
