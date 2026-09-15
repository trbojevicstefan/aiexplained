"use client";

import { AcademySignatureLab, hasAcademySignatureLab } from "./academy-signature-lab";
import { AcademySignatureLabBatch2, hasAcademySignatureLabBatch2 } from "./academy-signature-lab-batch2";

export function hasAcademyLab(slug: string) {
  return hasAcademySignatureLab(slug) || hasAcademySignatureLabBatch2(slug);
}

export function AcademyLabRouter({ slug, accent, onComplete }: { slug: string; accent: string; onComplete: (done: boolean) => void }) {
  if (hasAcademySignatureLab(slug)) return <AcademySignatureLab slug={slug} accent={accent} onComplete={onComplete} />;
  if (hasAcademySignatureLabBatch2(slug)) return <AcademySignatureLabBatch2 slug={slug} accent={accent} onComplete={onComplete} />;
  return null;
}
