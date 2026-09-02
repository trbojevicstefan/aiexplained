import Link from "next/link";
import { AiMascot } from "@/components/mascots/ai-mascot";
import { courseModules } from "@/content/course-registry";

export default function Home() {
  const lessonCount = courseModules.reduce((sum, module) => sum + module.lessons.filter((lesson) => lesson.status === "available").length, 0);
  return (
    <main className="home-shell home-v2">
      <section className="home-card home-card-v2">
        <div className="home-copy-v2">
          <span className="eyebrow home-eyebrow-v2">AI EXPLAINED · INTERACTIVE AI SCHOOL</span>
          <h1>Don&apos;t memorize AI.<br /><em>Take it apart.</em></h1>
          <p>Touch the parts. Move the weights. Break the agent. Fix the memory. Learn by making the machine react to you.</p>
          <div className="home-proof-row">
            <span><b>{courseModules.length}</b> modules</span>
            <span><b>{lessonCount}</b> interactive lessons</span>
            <span><b>3</b> depth levels</span>
          </div>
          <div className="home-actions-v2">
            <Link className="hero-cta tactile" href="/lessons/what-is-ai">Start from zero <span>→</span></Link>
            <span className="home-small-note">Simple → Real → Expert</span>
          </div>
        </div>

        <div className="home-mascot-stage" aria-label="A crew of animated AI learning guides">
          <div className="home-orbit home-orbit-a" />
          <div className="home-orbit home-orbit-b" />
          <div className="home-mascot-main"><AiMascot variant="bot" accent="#55bcff" mood="excited" size={174} label="GUIDE" /></div>
          <div className="home-mascot-side home-mascot-star"><AiMascot variant="star" accent="#ffdf3f" mood="happy" size={104} label="IDEA" /></div>
          <div className="home-mascot-side home-mascot-code"><AiMascot variant="tile" accent="#79df96" mood="thinking" size={112} label="BUILD" /></div>
          <span className="home-stage-chip chip-a">CLICK ME</span>
          <span className="home-stage-chip chip-b">EYES FOLLOW YOU</span>
          <span className="home-stage-chip chip-c">LEARN BY DOING</span>
        </div>
      </section>
    </main>
  );
}
