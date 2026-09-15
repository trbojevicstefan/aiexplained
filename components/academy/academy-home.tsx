"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { academyCertificates, academyLessons, academyMentalModels, academyPhases } from "@/content/academy-course";
import styles from "./academy-home.module.css";

const progressKey = (slug: string) => `ai-academy:lesson:${slug}`;

export function AcademyHome() {
  const reduced = useReducedMotion();
  const [query, setQuery] = useState("");
  const [completed, setCompleted] = useState<string[]>([]);
  const [lastVisited, setLastVisited] = useState<string | null>(null);

  useEffect(() => {
    const done = academyLessons.filter((lesson) => {
      try {
        const raw = window.localStorage.getItem(progressKey(lesson.slug));
        return raw ? Boolean(JSON.parse(raw).passed) : false;
      } catch {
        return false;
      }
    }).map((lesson) => lesson.slug);
    setCompleted(done);
    setLastVisited(window.localStorage.getItem("ai-academy:last-lesson"));
  }, []);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("sr");
    if (!normalized) return academyPhases;
    return academyPhases
      .map((phase) => ({
        ...phase,
        lessons: phase.lessons.filter((lesson) =>
          [lesson.title, lesson.summary, ...lesson.topics, ...(lesson.tools ?? [])]
            .join(" ")
            .toLocaleLowerCase("sr")
            .includes(normalized),
        ),
      }))
      .filter((phase) => phase.lessons.length > 0);
  }, [query]);

  const percent = Math.round((completed.length / academyLessons.length) * 100);
  const saved = academyLessons.find((lesson) => lesson.slug === lastVisited);
  const continueLesson = saved && !completed.includes(saved.slug)
    ? saved
    : academyLessons.find((lesson) => !completed.includes(lesson.slug)) ?? academyLessons[academyLessons.length - 1];

  return (
    <main className={styles.page}>
      <header className={styles.siteHeader}>
        <Link href="/ai-academy" className={styles.wordmark}><b>AI ACADEMY</b><span>SR</span></Link>
        <nav><a href="#program">Program</a><a href="#principi">Principi</a><a href="#sertifikati">Sertifikacija</a></nav>
        <Link href={`/ai-academy/lekcije/${continueLesson.slug}`} className={styles.headerAction}>Nastavi program <span>↗</span></Link>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}>PRAKTIČNA AI ENGINEERING AKADEMIJA · SRPSKI</span>
          <h1>Od ideje do sistema koji <em>stvarno radi.</em></h1>
          <p>
            Program za ljude koji žele da razumeju i isporučuju AI sisteme: agenti, API-ji, automatizacija,
            MCP, deployment, debugging, security i produkcioni rad. Bez magije i bez učenja komandi napamet.
          </p>
          <div className={styles.heroActions}>
            <Link className={styles.primaryCta} href={`/ai-academy/lekcije/${continueLesson.slug}`}>
              {completed.length ? "Nastavi program" : "Počni program"} <span>→</span>
            </Link>
            <a className={styles.secondaryCta} href="#program">Pregled kurikuluma</a>
          </div>
          <div className={styles.heroMetrics}>
            <div><strong>{academyLessons.length}</strong><span>lekcija i projekata</span></div>
            <div><strong>{academyPhases.length}</strong><span>programskih celina</span></div>
            <div><strong>5</strong><span>završnih projekata</span></div>
            <div><strong>4</strong><span>nivoa sertifikacije</span></div>
          </div>
        </div>

        <aside className={styles.architecturePanel} aria-label="Arhitektura programa">
          <header><span>PROGRAM / ARCHITECTURE</span><strong>AI Systems Builder Track</strong><small>v1 · Serbian curriculum</small></header>
          <div className={styles.architectureFlow}>
            {["RAZUMI", "IZGRADI", "POVEŽI", "PROVERI"].map((label, index) => (
              <motion.div key={label} initial={reduced ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .08 }}>
                <span>0{index + 1}</span><b>{label}</b><i />
              </motion.div>
            ))}
          </div>
          <div className={styles.systemMatrix}>
            <div><span>FOUNDATIONS</span><b>Digital systems</b><small>Terminal · Git · HTTP · JSON</small></div>
            <div><span>AGENTS</span><b>Agent operations</b><small>Codex · Claude · Hermes · OpenClaw</small></div>
            <div><span>INTEGRATION</span><b>Connected systems</b><small>n8n · MCP · APIs · Voice</small></div>
            <div><span>PRODUCTION</span><b>Reliable delivery</b><small>Deploy · Debug · Security · Verify</small></div>
          </div>
          <footer><span>PRINCIP</span><strong>Dokaz &gt; tvrdnja.</strong><small>Svaka akcija završava readback-om, testom ili realnim outputom.</small></footer>
        </aside>
      </section>

      <section className={styles.progressBand}>
        <div className={styles.progressCopy}><span>TVOJ NAPREDAK</span><strong>{percent}%</strong><small>{completed.length} / {academyLessons.length} položeno</small></div>
        <div className={styles.progressTrack}><i style={{ width: `${percent}%` }} /></div>
        <div className={styles.progressNext}><span>SLEDEĆE</span><b>{continueLesson.title}</b></div>
      </section>

      <section id="principi" className={styles.principles}>
        <div className={styles.sectionLead}><span>OPERATIVNI PRINCIPI</span><h2>Način razmišljanja pre alata.</h2><p>Brendovi i framework-i se menjaju. Ovi mentalni modeli ostaju korisni.</p></div>
        <div className={styles.principleGrid}>
          {academyMentalModels.map((item, index) => (
            <motion.article key={item} whileHover={reduced ? undefined : { y: -3 }}>
              <span>{String(index + 1).padStart(2, "0")}</span><p>{item}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section id="program" className={styles.curriculumSection}>
        <div className={styles.curriculumHeader}>
          <div><span>KURIKULUM</span><h2>Kompletan program.</h2><p>Od prvog briefa do produkcionog AI sistema i završnih projekata.</p></div>
          <label className={styles.searchBox}><span>SEARCH</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="n8n, OAuth, Codex, MCP..." /></label>
        </div>

        <div className={styles.phaseStack}>
          {filtered.map((phase) => {
            const phaseDone = phase.lessons.filter((lesson) => completed.includes(lesson.slug)).length;
            const phasePercent = Math.round((phaseDone / phase.lessons.length) * 100);
            return (
              <section key={phase.id} className={styles.phase} style={{ "--phase": phase.color } as React.CSSProperties}>
                <header className={styles.phaseHeader}>
                  <div className={styles.phaseIndex}><span>{phase.number}</span><i /></div>
                  <div className={styles.phaseTitle}><h3>{phase.title}</h3><p>{phase.subtitle}</p></div>
                  <div className={styles.phaseProgress}><b>{phaseDone}/{phase.lessons.length}</b><span>{phasePercent}%</span></div>
                </header>
                <div className={styles.lessonList}>
                  {phase.lessons.map((lesson, index) => {
                    const done = completed.includes(lesson.slug);
                    return (
                      <Link key={lesson.slug} className={`${styles.lessonRow} ${done ? styles.lessonDone : ""}`} href={`/ai-academy/lekcije/${lesson.slug}`}>
                        <span className={styles.lessonIndex}>{String(index + 1).padStart(2, "0")}</span>
                        <div><h4>{lesson.title}</h4><p>{lesson.summary}</p></div>
                        <div className={styles.lessonMeta}><span>{lesson.minutes} min</span><span>{lesson.topics.length} tema</span>{done && <b>POLOŽENO</b>}</div>
                        <span className={styles.lessonArrow}>↗</span>
                      </Link>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </section>

      <section id="sertifikati" className={styles.certSection}>
        <div className={styles.sectionLead}><span>SERTIFIKACIONI PUT</span><h2>Merimo sposobnost da isporučiš sistem.</h2><p>Nivo nije dekoracija. Svaki podrazumeva konkretnu tehničku i operativnu odgovornost.</p></div>
        <div className={styles.certGrid}>
          {academyCertificates.map((cert, index) => (
            <article key={cert.title} className={styles.certCard}>
              <span>LEVEL {String(index + 1).padStart(2, "0")}</span><h3>{cert.title}</h3><p>{cert.description}</p><footer>{index < 3 ? "NAPREDOVANJE" : "FINALNI NIVO"}<b>→</b></footer>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
