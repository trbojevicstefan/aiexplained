# AI Academy — Serbian track progress

`[x]` znači da je stvarno implementirano u `main`. QA stavke ostaju otvorene dok za njih nemamo stvaran dokaz.

## Platforma
- [x] poseban `/ai-academy` route unutar `trbojevicstefan/aiexplained`.
- [x] srpski Academy art direction na postojećem living `AiMascot` sistemu.
- [x] Academy home: hero, global progress, continue-last-lesson, pretraga, faze, mentalni modeli i sertifikacioni nivoi.
- [x] data-driven curriculum registry.
- [x] dynamic `/ai-academy/lekcije/[slug]` route za kompletan program.
- [x] lesson drawer kroz kompletan program.
- [x] per-lesson `localStorage` progress.
- [x] section-read tracking preko Intersection Observer-a.
- [x] click/reveal concept cards.
- [x] drag/reorder praktični workflow sa touch-friendly ↑/↓ fallback-om.
- [x] namerno izazvana greška + debugging task.
- [x] verification checklist.
- [x] typed explain-back zadatak.
- [x] quiz zaključan dok svi obavezni delovi i zadaci nisu završeni.
- [x] signature lab je dodatni obavezni task i mora biti završen pre quiz-a.
- [x] 5-question lesson quiz sa minimum 4/5 za prolaz.
- [x] previous/next navigation zaključan napred dok lekcija nije položena.
- [x] glavni AI Explained homepage linkuje Serbian Academy track.

## Curriculum
- [x] A0 — Osnove komunikacije sa AI agentom.
- [x] A1 — Hermes Basic, OpenClaw Basic, Codex Basic, Claude Code Basic, coding ecosystem i izbor agenta.
- [x] A2 — Hermes Advanced, OpenClaw Advanced, coding agents advanced i framework mapa.
- [x] A3 — Vibe Website, Automation, Product i Marketing.
- [x] Faza 1 — Digitalna osnova.
- [x] Faza 2 — GitHub i repozitorijumi.
- [x] Faza 3 — Vibe coding i AI coding alati.
- [x] Faza 4 — HTTP, API, JSON, auth i OAuth.
- [x] Faza 5 — API/webhook automatizacija i debugging.
- [x] Faza 6 — n8n, AI Agent node i multi-agent sistemi.
- [x] Faza 7 — MCP, Composio, custom MCP i tool security.
- [x] Faza 8 — Voice agenti, tools, Calendar booking i ElevenLabs.
- [x] Faza 9 — Local vs production, Firebase, Vercel, Tailscale i Cloudflare.
- [x] Faza 10 — Debugging metod, logovi i realna verifikacija.
- [x] Faza 11 — Task design, tim + agenti i dokumentacija.
- [x] Faza 12 — Secrets/security i AI agent safety.
- [x] 5 završnih projekata.
- [x] 4 sertifikaciona nivoa.
- [x] 5 glavnih mentalnih modela.

## Coverage
- [x] 67 konkretnih lekcija/capstone projekata postoji u registry-ju i otvara se kroz Academy UI.
- [x] Signature Batch 1 — agent brief, terminal, Git, API, webhook, n8n, MCP, Calendar, debugging i secret incident.
- [x] Signature Batch 2 — browser/server, JSON, OAuth, n8n agent, multi-agent, Composio, voice pipeline, Firestore, Cloudflare i log correlation.
- [x] Signature Batch 3 — Hermes/OpenClaw/Codex/Claude basic, GitHub teamwork/CLI, auth, webhook debugging, n8n API i custom MCP.
- [x] Signature Batch 4 — tool permissions, voice tools, ElevenLabs, Firebase App Hosting, Vercel, Tailscale, task design, human+agent teamwork, docs i agent safety.
- [x] Signature Batch 5 — coding ecosystem, agent choice, Hermes/OpenClaw advanced, coding advanced, framework map i Vibe production labs.
- [x] Signature Batch 6 — digital layers, project structure, Git vs GitHub, coding brief, Codex team loop, Vibe lifecycle, dev-agent architecture, HTTP headers, n8n anatomy i MCP anatomy.
- [x] Signature Batch 7 — local→production, evidence/readback discipline i svih 5 završnih capstone simulatora.
- [x] Sve Academy lekcije sada imaju temu-specifičan signature lab pored generic lesson interakcija.

## Repo/CI popravke urađene tokom Academy build-a
- [x] dodat GitHub Actions `npm ci → typecheck → production build` workflow.
- [x] dodat `concurrency/cancel-in-progress` da zastareli CI runovi ne prave backlog.
- [x] uklonjen root JSX type collision koji je `active` props pretvarao u `never`.
- [x] vraćen neutralni legacy `active?: unknown` compatibility shim bez sužavanja pravih component prop tipova.
- [x] `TraceTimeline.active` ponovo optional za read-only trace prikaze.

## QA
- [ ] GitHub Actions typecheck zelen na finalnom Academy commit-u.
- [ ] GitHub Actions production build zelen na finalnom Academy commit-u.
- [ ] desktop browser visual QA kompletne Academy putanje.
- [ ] mobile/touch visual QA.
- [ ] Playwright course navigation/progress/gating tests.
- [ ] cloud account/progress sync — nije deo local-first v1.
