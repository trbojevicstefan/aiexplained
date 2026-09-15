# AI Academy — Serbian track progress

`[x]` znači da je stvarno implementirano u `main`. Browser/runtime QA se vodi odvojeno i neće biti čekiran bez realne provere.

## Platforma
- [x] poseban `/ai-academy` route unutar `trbojevicstefan/aiexplained`.
- [x] poseban srpski art direction koji koristi isti living `AiMascot` sistem.
- [x] Academy home: hero, global progress, continue-last-lesson, pretraga, faze, mentalni modeli i sertifikacioni nivoi.
- [x] data-driven curriculum registry.
- [x] dynamic `/ai-academy/lekcije/[slug]` route za sve lekcije.
- [x] lesson drawer kroz kompletan program.
- [x] per-lesson `localStorage` progress.
- [x] section-read tracking preko Intersection Observer-a.
- [x] click/reveal concept cards.
- [x] drag/reorder praktični workflow sa touch-friendly ↑/↓ fallback-om.
- [x] namerno izazvana greška + debugging task.
- [x] verification checklist.
- [x] typed explain-back zadatak.
- [x] quiz zaključan dok svi obavezni delovi i zadaci nisu završeni.
- [x] custom signature lab se automatski dodaje kao dodatni obavezni task kada lekcija ima specifičan simulator.
- [x] 5-question lesson quiz sa minimum 4/5 za prolaz.
- [x] previous/next navigation zaključan napred dok lekcija nije položena.
- [x] glavni AI Explained homepage linkuje novi Serbian Academy track.

## Curriculum iz izvornog VibeCode Academy dokumenta
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

## Broj lekcija
- [x] 66 konkretnih lekcija/capstone projekata postoji u registry-ju i može da se otvori kroz Academy UI.

## Signature interaction batch 1
- [x] A0 Agent Brief Builder — loš vs dobar brief + structured task fields.
- [x] Terminal simulator — `pwd`, `ls`, `npm run dev`, `curl` i dokaz šta svaka komanda potvrđuje.
- [x] Git workflow mini lab — status → stage → commit → push → PR → review → merge.
- [x] API request builder — GET/POST/PATCH/DELETE sa request/response prikazom.
- [x] Webhook retry/idempotency simulator — dupli delivery vs jedan database write.
- [x] n8n visual workflow builder — Webhook → Validacija → AI Agent → Sheets → Slack → Email.
- [x] MCP capability lab — connect, discovery, read tool, write tool i human approval.
- [x] Calendar booking simulator — availability, timezone, event ID i cancellation verification.
- [x] Debugging layer isolation lab — browser/frontend/backend/API/auth/database/deployment/DNS/provider slojevi.
- [x] Secret incident response lab — revoke, rotate, scope-down, history plan, secret store i audit.

## Signature interaction batch 2 — sledeće
- [ ] HTTP request/response inspector sa status kodovima 200/201/400/401/403/404/429/500/502/530.
- [ ] JSON fixer + nested-path mapper.
- [ ] OAuth consent/scopes/redirect simulator.
- [ ] n8n AI Agent node assembler: model + prompt + memory + tools + guardrails + fallback + approval.
- [ ] Multi-agent handoff/router visualizer.
- [ ] Composio connected-account / toolkit / MCP credential mapper.
- [ ] Voice realtime pipeline STT → LLM → tool → TTS.
- [ ] Firebase data/rules mini lab.
- [ ] Cloudflare/tunnel diagnostic control room.
- [ ] GitHub Actions/log correlation lab.

## QA još otvoren
- [ ] fresh `npm ci` — pokušano, execution environment nema DNS pristup GitHub-u.
- [ ] `npm run typecheck`.
- [ ] `npm run build`.
- [ ] desktop browser visual QA.
- [ ] mobile/touch visual QA.
- [ ] Playwright course navigation/progress tests.
- [ ] cloud account/progress sync.
