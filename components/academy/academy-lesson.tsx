"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { AiMascot } from "@/components/mascots/ai-mascot";
import { AcademySignatureLab, hasAcademySignatureLab } from "@/components/academy/academy-signature-lab";
import { academyPhases, type AcademyLessonWithPhase } from "@/content/academy-course";
import styles from "./academy-lesson.module.css";

type Props = {
  lesson: AcademyLessonWithPhase;
  previous?: AcademyLessonWithPhase;
  next?: AcademyLessonWithPhase;
};

type Persisted = {
  visited: string[];
  revealed: number[];
  practiceOrder: string[];
  labComplete: boolean;
  debugSolved: boolean;
  explanation: string;
  verified: boolean[];
  passed: boolean;
  score: number;
};

const baseSections = ["start", "concepts", "practice", "debug", "verify", "explain"];
const keyFor = (slug: string) => `ai-academy:lesson:${slug}`;

function sameOrder(a: string[], b: string[]) {
  return a.length === b.length && a.every((item, index) => item === b[index]);
}

function rotate<T>(items: T[]) {
  if (items.length < 2) return [...items];
  return [...items.slice(1), items[0]];
}

export function AcademyLesson({ lesson, previous, next }: Props) {
  const reduced = useReducedMotion();
  const hasLab = hasAcademySignatureLab(lesson.slug);
  const requiredSections = hasLab ? ["start", "concepts", "lab", "practice", "debug", "verify", "explain"] : baseSections;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [visited, setVisited] = useState<string[]>([]);
  const [revealed, setRevealed] = useState<number[]>([]);
  const [practiceOrder, setPracticeOrder] = useState<string[]>(() => rotate(lesson.practice));
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [labComplete, setLabComplete] = useState(false);
  const [debugChoice, setDebugChoice] = useState<number | null>(null);
  const [debugSolved, setDebugSolved] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [verified, setVerified] = useState<boolean[]>(() => lesson.verify.map(() => false));
  const [quizAnswers, setQuizAnswers] = useState<(number | null)[]>([null, null, null, null, null]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [passed, setPassed] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    setVisited([]);
    setRevealed([]);
    setPracticeOrder(rotate(lesson.practice));
    setLabComplete(false);
    setDebugChoice(null);
    setDebugSolved(false);
    setExplanation("");
    setVerified(lesson.verify.map(() => false));
    setQuizAnswers([null, null, null, null, null]);
    setQuizSubmitted(false);
    setPassed(false);
    setScore(0);
    try {
      const raw = window.localStorage.getItem(keyFor(lesson.slug));
      if (raw) {
        const saved = JSON.parse(raw) as Partial<Persisted>;
        if (Array.isArray(saved.visited)) setVisited(saved.visited);
        if (Array.isArray(saved.revealed)) setRevealed(saved.revealed);
        if (Array.isArray(saved.practiceOrder) && saved.practiceOrder.length === lesson.practice.length) setPracticeOrder(saved.practiceOrder);
        if (typeof saved.labComplete === "boolean") setLabComplete(saved.labComplete);
        if (typeof saved.debugSolved === "boolean") setDebugSolved(saved.debugSolved);
        if (typeof saved.explanation === "string") setExplanation(saved.explanation);
        if (Array.isArray(saved.verified) && saved.verified.length === lesson.verify.length) setVerified(saved.verified);
        if (typeof saved.passed === "boolean") setPassed(saved.passed);
        if (typeof saved.score === "number") setScore(saved.score);
      }
      window.localStorage.setItem("ai-academy:last-lesson", lesson.slug);
    } finally {
      setHydrated(true);
    }
  }, [lesson]);

  useEffect(() => {
    if (!hydrated) return;
    const state: Persisted = { visited, revealed, practiceOrder, labComplete, debugSolved, explanation, verified, passed, score };
    window.localStorage.setItem(keyFor(lesson.slug), JSON.stringify(state));
  }, [debugSolved, explanation, hydrated, labComplete, lesson.slug, passed, practiceOrder, revealed, score, verified, visited]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const section = (entry.target as HTMLElement).dataset.section;
        if (!section) continue;
        setVisited((current) => current.includes(section) ? current : [...current, section]);
      }
    }, { threshold: .42 });
    const nodes = document.querySelectorAll(`[data-academy-lesson="${lesson.slug}"] [data-section]`);
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [lesson.slug]);

  const workflowSolved = sameOrder(practiceOrder, lesson.practice);
  const explainWords = explanation.trim().split(/\s+/).filter(Boolean).length;
  const explainSolved = explainWords >= 14;
  const conceptsSolved = revealed.length === lesson.topics.length;
  const verifySolved = verified.length > 0 && verified.every(Boolean);
  const tasks = hasLab
    ? [conceptsSolved, labComplete, workflowSolved, debugSolved, verifySolved, explainSolved]
    : [conceptsSolved, workflowSolved, debugSolved, verifySolved, explainSolved];
  const taskDone = tasks.filter(Boolean).length;
  const allRead = requiredSections.every((section) => visited.includes(section));
  const quizUnlocked = allRead && taskDone === tasks.length;
  const progress = Math.min(100, Math.round((visited.length / requiredSections.length) * 35 + (taskDone / tasks.length) * 45 + (passed ? 20 : 0)));

  const quiz = useMemo(() => [
    {
      q: "Koja rečenica najbolje hvata glavnu poentu ove lekcije?",
      options: ["Dovoljno je zapamtiti naziv alata.", lesson.takeaway, "Ako nema error poruke, posao je sigurno završen."], answer: 1,
    },
    {
      q: "Koji problem je realno povezan sa ovom lekcijom?",
      options: [lesson.failure, "Korisnik je izabrao pogrešnu boju dugmeta.", "Logo ima premalo animacije."], answer: 0,
    },
    {
      q: "Koji pojam pripada ovoj lekciji?",
      options: ["Generički vizuelni trend bez veze sa sistemom", "Nasumičan growth hack", lesson.topics[0] ?? lesson.title], answer: 2,
    },
    {
      q: "Koji je dobar dokaz da je posao zaista završen?",
      options: ["Agent je rekao: gotovo.", lesson.verify[0] ?? "Postoji realan readback.", "Deluje kao da bi trebalo da radi."], answer: 1,
    },
    {
      q: "Koji način rada najbolje prati Academy princip?",
      options: ["Promeni sve odjednom pa vidi šta će se desiti.", "Preskoči proveru ako je rezultat lep.", "Razumi cilj → izvedi kontrolisano → proveri stvarni rezultat."], answer: 2,
    },
  ], [lesson]);

  function movePractice(from: number, to: number) {
    if (from === to || from < 0 || to < 0 || from >= practiceOrder.length || to >= practiceOrder.length) return;
    setPracticeOrder((current) => {
      const copy = [...current];
      const [moved] = copy.splice(from, 1);
      copy.splice(to, 0, moved);
      return copy;
    });
  }

  function submitQuiz() {
    if (!quizUnlocked || quizAnswers.some((answer) => answer === null)) return;
    const result = quiz.reduce((sum, item, index) => sum + (quizAnswers[index] === item.answer ? 1 : 0), 0);
    setScore(result);
    setPassed(result >= 4);
    setQuizSubmitted(true);
  }

  const mascotMood = passed ? "excited" : progress > 65 ? "happy" : progress > 30 ? "thinking" : "neutral";

  return (
    <main className={styles.page} data-academy-lesson={lesson.slug} style={{ "--accent": lesson.phaseColor } as React.CSSProperties}>
      <header className={styles.topbar}>
        <button className={styles.menuButton} onClick={() => setDrawerOpen(true)} aria-label="Otvori program"><span /> <span /> <span /></button>
        <Link className={styles.brand} href="/ai-academy"><b>AI</b><span>ACADEMY</span><small>SR</small></Link>
        <div className={styles.topIdentity}><span>{lesson.phaseNumber} · {lesson.phaseTitle}</span><strong>{lesson.title}</strong></div>
        <div className={styles.topProgress}><div><span>{progress}%</span><small>{taskDone}/{tasks.length} zadataka</small></div><i><b style={{ width: `${progress}%` }} /></i></div>
        <div className={styles.topMascot}><AiMascot variant="bot" accent={lesson.phaseColor} mood={mascotMood} size={52} label="MENTOR" /></div>
      </header>

      {drawerOpen && <button className={styles.drawerBackdrop} onClick={() => setDrawerOpen(false)} aria-label="Zatvori program" />}
      <aside className={`${styles.drawer} ${drawerOpen ? styles.drawerOpen : ""}`}>
        <header><div><span>AI ACADEMY</span><b>Program</b></div><button onClick={() => setDrawerOpen(false)}>×</button></header>
        <div className={styles.drawerProgress}><span>Tvoj napredak u lekciji</span><strong>{progress}%</strong><i><b style={{ width: `${progress}%` }} /></i></div>
        <nav>
          {academyPhases.map((phase) => (
            <section key={phase.id}>
              <h3><span style={{ background: phase.color }}>{phase.number}</span>{phase.title}</h3>
              {phase.lessons.map((item, index) => (
                <Link key={item.slug} href={`/ai-academy/lekcije/${item.slug}`} onClick={() => setDrawerOpen(false)} className={item.slug === lesson.slug ? styles.drawerActive : ""}>
                  <small>{String(index + 1).padStart(2, "0")}</small>{item.title}
                </Link>
              ))}
            </section>
          ))}
        </nav>
      </aside>

      <section className={styles.hero} data-section="start">
        <div className={styles.heroCopy}>
          <span className={styles.kicker}>{lesson.phaseNumber} · {lesson.phaseTitle}</span>
          <h1>{lesson.title}</h1>
          <p>{lesson.summary}</p>
          <div className={styles.heroMeta}><span>{lesson.minutes} min</span><span>{lesson.topics.length} ključnih tema</span><span>{lesson.practice.length} praktična koraka</span></div>
          <div className={styles.takeaway}><b>MENTALNI MODEL</b><p>{lesson.takeaway}</p></div>
        </div>
        <div className={styles.heroStage}>
          <AiMascot variant="bot" accent={lesson.phaseColor} mood="happy" size={150} label="MENTOR" />
          <div className={styles.orbitOne} /><div className={styles.orbitTwo} />
          <span className={styles.floatChip}>CILJ</span><span className={styles.floatChip}>ALATI</span><span className={styles.floatChip}>DOKAZ</span>
        </div>
      </section>

      <section className={styles.section} data-section="concepts">
        <div className={styles.sectionHead}><span>01</span><div><small>RAZUMI</small><h2>Otvori koncept deo po deo.</h2><p>Klikni svaku karticu. Ne pokušavaj da zapamtiš termin — objasni sebi čemu služi u stvarnom sistemu.</p></div></div>
        <div className={styles.topicGrid}>
          {lesson.topics.map((topic, index) => {
            const open = revealed.includes(index);
            return <motion.button key={topic} className={`${styles.topicCard} ${open ? styles.topicOpen : ""}`} onClick={() => setRevealed((current) => current.includes(index) ? current : [...current, index])} whileTap={{ scale: .96 }} whileHover={reduced ? undefined : { y: -5 }}>
              <span>{String(index + 1).padStart(2, "0")}</span><strong>{topic}</strong><p>{open ? `Ovaj pojam je deo lekcije „${lesson.title}“. Poveži ga sa ciljem: ${lesson.takeaway}` : "Klikni da otvoriš"}</p><b>{open ? "✓" : "+"}</b>
            </motion.button>;
          })}
        </div>
        <div className={styles.taskStatus} data-done={conceptsSolved}>{conceptsSolved ? "✓ Svi koncepti otvoreni" : `${revealed.length}/${lesson.topics.length} koncepta otvoreno`}</div>
      </section>

      {hasLab && <section className={styles.signatureSection} data-section="lab">
        <AcademySignatureLab slug={lesson.slug} accent={lesson.phaseColor} onComplete={setLabComplete} />
      </section>}

      <section className={`${styles.section} ${styles.darkSection}`} data-section="practice">
        <div className={styles.sectionHead}><span>02</span><div><small>URADI</small><h2>Složi praktičan workflow.</h2><p>Koraci su namerno pomešani. Prevuci ih ili koristi strelice da vratiš logičan redosled.</p></div></div>
        <div className={styles.practiceBoard}>
          {practiceOrder.map((step, index) => (
            <motion.article key={step} draggable onDragStart={() => setDragIndex(index)} onDragOver={(event) => event.preventDefault()} onDrop={() => { if (dragIndex !== null) movePractice(dragIndex, index); setDragIndex(null); }} className={styles.practiceCard} layout>
              <span className={styles.dragHandle}>⠿</span><b>{index + 1}</b><p>{step}</p><div><button disabled={index === 0} onClick={() => movePractice(index, index - 1)}>↑</button><button disabled={index === practiceOrder.length - 1} onClick={() => movePractice(index, index + 1)}>↓</button></div>
            </motion.article>
          ))}
        </div>
        <div className={styles.taskStatus} data-done={workflowSolved}>{workflowSolved ? "✓ Workflow je u dobrom redosledu" : "Još nije tačan redosled"}</div>
      </section>

      <section className={styles.section} data-section="debug">
        <div className={styles.sectionHead}><span>03</span><div><small>POKVARI I POPRAVI</small><h2>Debugging scenario.</h2><p>Namerno izazvana greška je deo svake Academy lekcije. Cilj je da prvo pronađeš sloj problema, pa tek onda menjaš sistem.</p></div></div>
        <div className={styles.incident}>
          <div className={styles.incidentHeader}><AiMascot variant="tile" accent="#ff667f" mood={debugSolved ? "happy" : "thinking"} size={84} label="DEBUG" /><div><span>INCIDENT</span><h3>{lesson.failure}</h3></div></div>
          <p>Koji kriterijum treba prvo da proveriš?</p>
          {[lesson.verify[0] ?? "Proveri stvarni output.", "Promeni nekoliko stvari odjednom dok ne proradi.", "Ignoriši logove i pretpostavi da je alat kriv."].map((option, index) => (
            <button key={option} className={`${styles.debugOption} ${debugChoice === index ? styles.debugSelected : ""}`} onClick={() => { setDebugChoice(index); if (index === 0) setDebugSolved(true); }}><span>{String.fromCharCode(65 + index)}</span>{option}{debugChoice === index && <b>{index === 0 ? "TAČNO" : "PROBAJ OPET"}</b>}</button>
          ))}
        </div>
        <div className={styles.taskStatus} data-done={debugSolved}>{debugSolved ? "✓ Incident pravilno dijagnostikovan" : "Izaberi prvi dobar verification korak"}</div>
      </section>

      <section className={`${styles.section} ${styles.verifySection}`} data-section="verify">
        <div className={styles.sectionHead}><span>04</span><div><small>DOKAŽI</small><h2>Tvrdnja nije dokaz.</h2><p>Označi svaku proveru tek kada razumeš šta ona potvrđuje. Ovo je deo koji razlikuje demo od ozbiljnog sistema.</p></div></div>
        <div className={styles.verifyGrid}>
          {lesson.verify.map((item, index) => (
            <button key={item} onClick={() => setVerified((current) => current.map((value, i) => i === index ? !value : value))} className={verified[index] ? styles.verified : ""}>
              <span>{verified[index] ? "✓" : "○"}</span><p>{item}</p>
            </button>
          ))}
        </div>
        <div className={styles.taskStatus} data-done={verifySolved}>{verifySolved ? "✓ Verification checklist kompletan" : `${verified.filter(Boolean).length}/${verified.length} provera potvrđeno`}</div>
      </section>

      <section className={styles.section} data-section="explain">
        <div className={styles.sectionHead}><span>05</span><div><small>OBJASNI NAZAD</small><h2>Objasni kao kolegi koji nije tehnički.</h2><p>Ako možeš jasno da objasniš svojim rečima, verovatno si zaista razumeo. Minimum je 14 reči.</p></div></div>
        <div className={styles.explainBox}>
          <AiMascot variant="star" accent="#ffd75b" mood={explainSolved ? "excited" : "thinking"} size={98} label="IDEA" />
          <div><label>Šta je najvažnije što si naučio iz lekcije „{lesson.title}“?</label><textarea value={explanation} onChange={(event) => setExplanation(event.target.value)} placeholder="Objasni svojim rečima, bez kopiranja definicije..." /><div><span>{explainWords} reči</span><b>{explainSolved ? "Dovoljno jasno za quiz ✓" : "Još malo razradi objašnjenje"}</b></div></div>
        </div>
        <div className={styles.taskStatus} data-done={explainSolved}>{explainSolved ? "✓ Explain-back završen" : "Napiši najmanje 14 smislenih reči"}</div>
      </section>

      <section id="quiz" className={styles.quizSection}>
        <div className={styles.quizHeader}>
          <div><span>FINAL CHECK</span><h2>{quizUnlocked ? "Quiz je otključan." : "Quiz je još zaključan."}</h2><p>{quizUnlocked ? "Treba ti 4/5 za prolaz. Pogrešan odgovor nije kazna — vrati se na mentalni model." : `Pročitaj sve delove (${visited.filter((item) => requiredSections.includes(item)).length}/${requiredSections.length}) i završi sve zadatke (${taskDone}/${tasks.length}).`}</p></div>
          <div className={styles.quizLock}><AiMascot variant="briefcase" accent={quizUnlocked ? "#82e9ad" : "#7d8490"} mood={quizUnlocked ? "happy" : "neutral"} size={108} label={quizUnlocked ? "READY" : "LOCKED"} /><b>{quizUnlocked ? "UNLOCKED" : "LOCKED"}</b></div>
        </div>

        {quizUnlocked && <div className={styles.quizBody}>
          {quiz.map((item, qIndex) => (
            <article key={item.q} className={styles.quizQuestion}>
              <span>0{qIndex + 1}</span><h3>{item.q}</h3>
              <div>{item.options.map((option, optionIndex) => {
                const selected = quizAnswers[qIndex] === optionIndex;
                const correct = quizSubmitted && optionIndex === item.answer;
                const wrong = quizSubmitted && selected && optionIndex !== item.answer;
                return <button key={option} disabled={quizSubmitted && passed} data-correct={correct || undefined} data-wrong={wrong || undefined} className={selected ? styles.quizSelected : ""} onClick={() => { if (!quizSubmitted || !passed) { const copy = [...quizAnswers]; copy[qIndex] = optionIndex; setQuizAnswers(copy); setQuizSubmitted(false); } }}><i>{String.fromCharCode(65 + optionIndex)}</i>{option}</button>;
              })}</div>
            </article>
          ))}
          <button className={styles.submitQuiz} disabled={quizAnswers.some((answer) => answer === null)} onClick={submitQuiz}>Proveri odgovore</button>
          {quizSubmitted && <div className={`${styles.quizResult} ${passed ? styles.quizPassed : styles.quizFailed}`}><AiMascot variant={passed ? "star" : "bot"} accent={passed ? "#ffd75b" : "#ff8067"} mood={passed ? "excited" : "thinking"} size={92} label={passed ? "PASS" : "RETRY"} /><div><span>{score}/5</span><h3>{passed ? "Lekcija položena!" : "Još jedan prolaz."}</h3><p>{passed ? "Napredak je sačuvan. Možeš na sledeću lekciju." : "Vrati se na pogrešne mentalne modele, pa pokušaj ponovo."}</p></div></div>}
        </div>}
      </section>

      <footer className={styles.lessonFooter}>
        {previous ? <Link href={`/ai-academy/lekcije/${previous.slug}`}>← <span><small>PRETHODNA</small><b>{previous.title}</b></span></Link> : <Link href="/ai-academy">← <span><small>PROGRAM</small><b>AI Academy</b></span></Link>}
        {next ? <Link className={!passed ? styles.nextLocked : ""} href={passed ? `/ai-academy/lekcije/${next.slug}` : "#quiz"} onClick={(event) => { if (!passed) event.preventDefault(); }}><span><small>{passed ? "SLEDEĆA" : "POLOŽI QUIZ"}</small><b>{next.title}</b></span> →</Link> : <Link href="/ai-academy"><span><small>ZAVRŠENO</small><b>Nazad na program</b></span> →</Link>}
      </footer>
    </main>
  );
}
