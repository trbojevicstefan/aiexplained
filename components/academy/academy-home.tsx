"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { AiMascot } from "@/components/mascots/ai-mascot";
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
  const continueLesson = academyLessons.find((lesson) => lesson.slug === lastVisited) ?? academyLessons[0];

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.kicker}>AI EXPLAINED · SRPSKI PROGRAM</span>
          <h1>AI Academy za ljude koji žele da <em>prave stvari</em>.</h1>
          <p>
            Ne učiš komande napamet. Učiš da vodiš AI agenta, povežeš alate, razumeš gde putuju podaci,
            pronađeš grešku i dokažeš da rezultat stvarno radi.
          </p>
          <div className={styles.heroStats}>
            <span><b>{academyPhases.length}</b> celina</span>
            <span><b>{academyLessons.length}</b> lekcija</span>
            <span><b>5</b> završnih projekata</span>
            <span><b>4</b> sertifikaciona nivoa</span>
          </div>
          <div className={styles.heroActions}>
            <Link className={styles.primaryCta} href={`/ai-academy/lekcije/${continueLesson.slug}`}>
              {completed.length ? "Nastavi gde si stao" : "Kreni od početka"} <span>→</span>
            </Link>
            <a className={styles.secondaryCta} href="#program">Pogledaj ceo program</a>
          </div>
          <div className={styles.overallProgress}>
            <div><span>Ukupan napredak</span><strong>{percent}%</strong></div>
            <div className={styles.progressTrack}><i style={{ width: `${percent}%` }} /></div>
            <small>{completed.length}/{academyLessons.length} položenih lekcija</small>
          </div>
        </div>

        <div className={styles.heroStage} aria-label="Živi AI Academy vodiči">
          <div className={styles.stageGrid} />
          <motion.div className={styles.mainMascot} animate={reduced ? undefined : { y: [0, -12, 0] }} transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}>
            <AiMascot variant="bot" mood="excited" accent="#61c9ff" size={180} label="MENTOR" />
          </motion.div>
          <div className={`${styles.sideMascot} ${styles.sideOne}`}><AiMascot variant="briefcase" mood="happy" accent="#82e9ad" size={104} label="BUILD" /></div>
          <div className={`${styles.sideMascot} ${styles.sideTwo}`}><AiMascot variant="tile" mood="thinking" accent="#a68bff" size={106} label="SYSTEM" /></div>
          <div className={`${styles.sideMascot} ${styles.sideThree}`}><AiMascot variant="star" mood="happy" accent="#ffd75b" size={92} label="IDEA" /></div>
          <span className={`${styles.stagePill} ${styles.pillOne}`}>AGENT-FIRST</span>
          <span className={`${styles.stagePill} ${styles.pillTwo}`}>LEARN BY DOING</span>
          <span className={`${styles.stagePill} ${styles.pillThree}`}>DOKAZ &gt; TVRDNJA</span>
        </div>
      </section>

      <section className={styles.principleBand}>
        <div>
          <span>OSNOVNI LOOP</span>
          <strong>Objasni cilj</strong><i>→</i><strong>Daj kontekst</strong><i>→</i><strong>Postavi granice</strong><i>→</i><strong>Pusti agenta</strong><i>→</i><strong>Proveri rezultat</strong>
        </div>
      </section>

      <section className={styles.mentalSection}>
        <div className={styles.sectionIntro}>
          <span className={styles.kicker}>MENTALNI MODELI</span>
          <h2>Pet stvari koje treba da postanu refleks.</h2>
        </div>
        <div className={styles.mentalGrid}>
          {academyMentalModels.map((item, index) => (
            <motion.article key={item} className={styles.mentalCard} whileHover={reduced ? undefined : { y: -7, rotate: index % 2 ? .7 : -.7 }}>
              <b>0{index + 1}</b><p>{item}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section id="program" className={styles.curriculumSection}>
        <div className={styles.curriculumHeader}>
          <div>
            <span className={styles.kicker}>CEO PROGRAM</span>
            <h2>Od prvog AI briefa do produkcionog sistema.</h2>
          </div>
          <label className={styles.searchBox}>
            <span>⌕</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Traži: n8n, OAuth, Codex, MCP..." />
          </label>
        </div>

        <div className={styles.phaseStack}>
          {filtered.map((phase) => {
            const phaseDone = phase.lessons.filter((lesson) => completed.includes(lesson.slug)).length;
            return (
              <section key={phase.id} className={styles.phase} style={{ "--phase": phase.color } as React.CSSProperties}>
                <header className={styles.phaseHeader}>
                  <span className={styles.phaseNumber}>{phase.number}</span>
                  <div><h3>{phase.title}</h3><p>{phase.subtitle}</p></div>
                  <div className={styles.phaseProgress}><b>{phaseDone}/{phase.lessons.length}</b><small>završeno</small></div>
                </header>
                <div className={styles.lessonGrid}>
                  {phase.lessons.map((lesson, index) => {
                    const done = completed.includes(lesson.slug);
                    return (
                      <Link key={lesson.slug} className={`${styles.lessonCard} ${done ? styles.lessonDone : ""}`} href={`/ai-academy/lekcije/${lesson.slug}`}>
                        <div className={styles.lessonTop}><span>{String(index + 1).padStart(2, "0")}</span>{done && <b>✓</b>}</div>
                        <h4>{lesson.title}</h4>
                        <p>{lesson.summary}</p>
                        <div className={styles.lessonMeta}><span>{lesson.minutes} min</span><span>{lesson.topics.length} tema</span></div>
                        <div className={styles.lessonArrow}>→</div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </section>

      <section className={styles.certSection}>
        <div className={styles.sectionIntro}>
          <span className={styles.kicker}>SERTIFIKACIONI PUT</span>
          <h2>Ne skupljaš lekcije. Gradiš operativnu sposobnost.</h2>
        </div>
        <div className={styles.certGrid}>
          {academyCertificates.map((cert, index) => (
            <article key={cert.title} className={styles.certCard}>
              <span>{cert.level}</span><b>{index + 1}</b><h3>{cert.title}</h3><p>{cert.description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
