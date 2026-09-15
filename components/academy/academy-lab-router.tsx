"use client";

import { AcademySignatureLab, hasAcademySignatureLab } from "./academy-signature-lab";
import { AcademySignatureLabBatch2, hasAcademySignatureLabBatch2 } from "./academy-signature-lab-batch2";
import { AcademySignatureLabBatch3, hasAcademySignatureLabBatch3 } from "./academy-signature-lab-batch3";
import { AcademySignatureLabBatch4, hasAcademySignatureLabBatch4 } from "./academy-signature-lab-batch4";
import { AcademySignatureLabBatch5, hasAcademySignatureLabBatch5 } from "./academy-signature-lab-batch5";
import { AcademySignatureLabBatch6, hasAcademySignatureLabBatch6 } from "./academy-signature-lab-batch6";
import { AcademySignatureLabBatch7, hasAcademySignatureLabBatch7 } from "./academy-signature-lab-batch7";

export function hasAcademyLab(slug: string) {
  return hasAcademySignatureLab(slug)
    || hasAcademySignatureLabBatch2(slug)
    || hasAcademySignatureLabBatch3(slug)
    || hasAcademySignatureLabBatch4(slug)
    || hasAcademySignatureLabBatch5(slug)
    || hasAcademySignatureLabBatch6(slug)
    || hasAcademySignatureLabBatch7(slug);
}

export function AcademyLabRouter({ slug, accent, onComplete }: { slug: string; accent: string; onComplete: (done: boolean) => void }) {
  if (hasAcademySignatureLab(slug)) return <AcademySignatureLab slug={slug} accent={accent} onComplete={onComplete} />;
  if (hasAcademySignatureLabBatch2(slug)) return <AcademySignatureLabBatch2 slug={slug} accent={accent} onComplete={onComplete} />;
  if (hasAcademySignatureLabBatch3(slug)) return <AcademySignatureLabBatch3 slug={slug} accent={accent} onComplete={onComplete} />;
  if (hasAcademySignatureLabBatch4(slug)) return <AcademySignatureLabBatch4 slug={slug} accent={accent} onComplete={onComplete} />;
  if (hasAcademySignatureLabBatch5(slug)) return <AcademySignatureLabBatch5 slug={slug} accent={accent} onComplete={onComplete} />;
  if (hasAcademySignatureLabBatch6(slug)) return <AcademySignatureLabBatch6 slug={slug} accent={accent} onComplete={onComplete} />;
  if (hasAcademySignatureLabBatch7(slug)) return <AcademySignatureLabBatch7 slug={slug} accent={accent} onComplete={onComplete} />;
  return null;
}
