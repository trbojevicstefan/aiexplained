import Link from "next/link";

export default function Home() {
  return (
    <main className="home-shell">
      <section className="home-card">
        <span className="eyebrow">AI EXPLAINED · PROTOTYPE COURSE</span>
        <h1>Don&apos;t memorize AI.<br />Take it apart.</h1>
        <p>Touch the parts. Train tiny machines. Break them. Fix them. Then explain what happened.</p>
        <Link className="hero-cta tactile" href="/lessons/what-is-ai">Start lesson 01 <span>→</span></Link>
      </section>
    </main>
  );
}
