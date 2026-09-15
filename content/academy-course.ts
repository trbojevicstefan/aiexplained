export type AcademyLesson = {
  slug: string;
  title: string;
  summary: string;
  topics: string[];
  practice: string[];
  failure: string;
  verify: string[];
  takeaway: string;
  minutes: number;
  tools?: string[];
};

export type AcademyPhase = {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  color: string;
  lessons: AcademyLesson[];
};

const L = (
  slug: string,
  title: string,
  summary: string,
  topics: string[],
  practice: string[],
  failure: string,
  verify: string[],
  takeaway: string,
  minutes = 35,
  tools?: string[],
): AcademyLesson => ({ slug, title, summary, topics, practice, failure, verify, takeaway, minutes, tools });

export const academyPhases: AcademyPhase[] = [
  {
    id: "a0",
    number: "A0",
    title: "Osnove komunikacije sa AI agentom",
    subtitle: "Prvo nauči kako da vodiš agenta, pa tek onda kako da gradiš.",
    color: "#68c7ff",
    lessons: [
      L("osnove-komunikacije-sa-ai-agentom", "Kako se radi sa AI agentom", "Agent nije magično dugme. Dobar rezultat nastaje kada jasno definišeš cilj, kontekst, granice, alate i proveru.", ["šta je AI agent", "chatbot vs copilot vs agent", "model, tool, memory i context", "planiranje i izvršavanje", "dobar brief", "pravila i ograničenja", "plan pre izvršenja", "realna verifikacija", "approval granice"], ["Daj agentu isti zadatak jednom kao nejasnu poruku, a drugi put kao strukturisan brief.", "Uporedi plan, broj pretpostavki i kvalitet rezultata.", "Napiši sopstveni template: cilj, kontekst, šta sme, šta ne sme, rezultat i provera."], "Agent dobija zadatak bez acceptance criteria i tvrdi da je završio iako nije proverio rezultat.", ["Postoji jasan cilj.", "Scope i zabrane su eksplicitni.", "Postoji dokaz da je rezultat stvarno proverljiv."], "Dobar agent workflow je: cilj → kontekst → ograničenja → alati → izvršenje → pregled → test → odobrenje.", 45),
    ],
  },
  {
    id: "a1",
    number: "A1",
    title: "Agent alati za početnike",
    subtitle: "Isti mentalni model, različite radne stanice.",
    color: "#8ce6c3",
    lessons: [
      L("hermes-basic", "Hermes Basic", "Hermes koristiš kao početnu radnu stanicu za agente, lokalne projekte, fajlove, terminal i web.", ["obraćanje agentu", "čitanje lokalnih fajlova", "terminal", "web", "dokumenti", "bezbedne dozvole", "provera realnog rada", "memory vs context vs project"], ["Pronađi projekat i objasni strukturu foldera.", "Generiši README na osnovu stvarnog projekta.", "Pronađi malu grešku, pokreni test i objasni rezultat običnim jezikom."], "Agent predloži izmenu ali nije čitao stvarne fajlove projekta.", ["Prikazan je realan readback fajla.", "Postoji rezultat komande/testa.", "Promene su ograničene na dogovoreni scope."], "Hermes je koristan kada agent mora da poveže kontekst, fajlove, alate i izvršenje u jednom radnom toku.", 45, ["Hermes"]),
      L("openclaw-basic", "OpenClaw Basic", "OpenClaw uvodi agent gateway, kanale, automatizaciju i spoljne alate.", ["agent gateway", "chat i drugi kanali", "povezivanje alata", "task vs conversation", "status akcije", "read vs write"], ["Daj agentu jednostavan task.", "Poveži jedan alat i izvrši read akciju.", "Namerno pošalji pogrešne argumente i traži objašnjenje i ispravku."], "Write akcija se pokreće kao da je običan chat odgovor, bez jasnog statusa i provere.", ["Zna se da li je akcija samo predložena ili izvršena.", "Arguments su validni.", "Write akcija ima odgovarajuću dozvolu."], "Gateway povezuje razgovor sa realnim izvršenjem, ali moraš da razlikuješ poruku od akcije.", 40, ["OpenClaw"]),
      L("codex-basic", "Codex Basic", "Codex koristiš kao coding agenta koji razume repository, menja kod i proverava build/test rezultat.", ["codebase context", "plan promene", "diff", "build", "test", "regression check"], ["Zatraži analizu repository-ja.", "Napravi malu izmenu na website-u.", "Pregledaj diff, pokreni test i ispravi failed build."], "Agent promeni više fajlova nego što je traženo i ne pokrene testove.", ["Diff odgovara scope-u.", "Build/test su pokrenuti.", "Postojeći behavior nije pokvaren."], "Coding agent nije gotov kada napiše kod — gotov je kada pokaže diff i dokaz da izmena radi.", 45, ["Codex", "Git"]),
      L("claude-code-basic", "Claude Code Basic", "Claude Code uvodi dubok terminal i codebase rad kao alternativu za coding agente.", ["čitanje projekta", "terminal", "multi-file izmene", "code review", "Git i test verifikacija", "kada Claude Code, a kada Codex"], ["Traži plan pre izmene.", "Napravi multi-file promenu.", "Zatraži code review i proveri rezultat kroz Git i testove."], "Agent napravi dobar-looking patch ali ne proveri kako promena utiče na druge fajlove.", ["Promenjeni fajlovi su opravdani planom.", "Review je vezan za konkretan diff.", "Test/build rezultat postoji."], "Različiti coding agenti imaju drugačiji UX, ali isti standard uspeha: context + scope + diff + test + verification.", 45, ["Claude Code", "Git"]),
      L("coding-agent-ekosistem", "Coding agenti i AI development ekosistem", "Ne memorišeš svaku komandu svakog alata; učiš zajednički model rada i kada je koja kategorija korisna.", ["Cursor", "Windsurf", "Cline", "Roo Code", "Aider", "OpenCode", "Gemini CLI", "GitHub Copilot", "Replit Agent", "Lovable", "v0", "Bolt", "Devin", "Factory", "Amp", "Goose", "OpenHands", "SWE-agent", "BMAD Method"], ["Razvrstaj alate na editor, terminal/coding agent, product builder i autonomous coding kategorije.", "Za tri zadatka izaberi različite alate i objasni izbor.", "Napiši zajednički model: agent + context + tools + permissions + verification."], "Alat se bira samo zato što je popularan, bez veze sa zadatkom i okruženjem.", ["Izbor alata prati tip zadatka.", "Razumeš gde alat izvršava kod.", "Isti verification standard važi bez obzira na brend."], "Trajna veština nije naziv proizvoda nego razumevanje agent architecture-a i verifikacije.", 35),
      L("kada-koristiti-koji-agent", "Kada koristiti koji agent", "Hermes, OpenClaw, Codex, Claude Code i product-building alati rešavaju različite delove posla.", ["Hermes za opšti agent OS", "OpenClaw za gateway i kanale", "Codex za repository implementaciju", "Claude Code za terminal/codebase rad", "Cursor/Windsurf za editor", "v0/Lovable/Bolt za prototip", "Replit Agent za all-in-one prototip", "BMAD za planiranje"], ["Dobijaš 8 scenarija i biraš agent/kategoriju.", "Za složen projekat odredi koji agent radi research, koji implementaciju, koji review.", "Definiši handoff između dva alata."], "Jedan agent dobija research, dizajn, coding, deployment i verifikaciju bez jasnih handoff-a.", ["Svaki alat ima jasnu odgovornost.", "Handoff prenosi potreban kontekst.", "Finalna provera ne zavisi od samoprijave agenta."], "Pravi izbor alata smanjuje trenje; pravi workflow sprečava haos.", 35),
    ],
  },
  {
    id: "a2",
    number: "A2",
    title: "Napredni agent sistemi",
    subtitle: "Memory, skills, MCP, routing, paralelizacija i approvals.",
    color: "#a58bff",
    lessons: [
      L("hermes-advanced", "Hermes Advanced", "Napredni Hermes rad pokriva trajnu memoriju, skills, MCP, delegiranje i više projekata.", ["profil i konfiguracija", "persistent memory", "skills", "MCP serveri", "tool discovery", "delegiranje", "paralelni agenti", "cron", "gateway", "approval granice", "debugging agent sistema", "local/remote tools"], ["Dodaj jedan skill i objasni kada se aktivira.", "Poveži MCP capability i proveri tool discovery.", "Delegiraj dva nezavisna podzadatka paralelno pa spoji rezultat."], "Agentu se trajno upiše pogrešna informacija ili se write tool izvrši bez approval-a.", ["Memory entry može da se pregleda i ispravi.", "Tool scope je jasan.", "Parallel rezultati su provereni pre spajanja."], "Napredni agent sistem nije samo pametniji prompt — to je operativni sistem oko modela.", 50, ["Hermes", "MCP"]),
      L("openclaw-advanced", "OpenClaw Advanced", "Napredni gateway rad uvodi više kanala, routing, monitoring, fallback i human approval.", ["više kanala", "agent routing", "gateway konfiguracija", "tool permissions", "session continuity", "scheduled taskovi", "monitoring", "fallback agenti", "human approval", "bezbedne write akcije"], ["Definiši routing pravilo za dva tipa taska.", "Simuliraj pad primarnog agenta i aktiviraj fallback.", "Dodaj approval za rizičnu write akciju."], "Routing šalje task pogrešnom agentu, a sistem nema fallback niti trace.", ["Ruting odluka je vidljiva.", "Fallback se aktivira samo u dogovorenim uslovima.", "Write akcija ostavlja audit trag."], "Gateway mora da čuva kontinuitet, bezbednost i vidljiv status izvršenja kroz kanale.", 45, ["OpenClaw"]),
      L("coding-agenti-advanced", "Codex i Claude Code Advanced", "Veliki repository rad zahteva disciplinovan plan → implementacija → review → test → PR loop.", ["veliki repository-ji", "multi-file izmene", "plan/implementation/review loop", "test-driven agent workflow", "branch i PR", "issues", "migracije", "refactoring", "production debugging", "više coding agenata"], ["Pretvori issue u plan sa acceptance criteria.", "Radi izmenu na branch-u i pokreni test suite.", "Zatraži nezavisni review drugog agenta pre PR-a."], "Dva coding agenta menjaju iste fajlove paralelno i pregaze jedan drugom rad.", ["Ownership fajlova/taskova je jasan.", "Branch/PR sadrži pregledan diff.", "Review i testovi postoje pre merge-a."], "Na velikom codebase-u koordinacija i verifikacija su važnije od brzine generisanja koda.", 50, ["Codex", "Claude Code", "GitHub"]),
      L("agent-framework-pregled", "Agent framework pregled", "Dobijaš mapu SDK-ova, orchestration framework-a, autonomous coding alata, product buildera, automation gateway-a i voice sistema.", ["OpenAI Agents SDK", "Claude Agent SDK", "Google ADK", "LangChain/LangGraph", "CrewAI", "AutoGen", "Semantic Kernel", "LlamaIndex", "PydanticAI", "DSPy", "Haystack", "Mastra", "Vercel AI SDK", "AG2", "OpenHands", "SWE-agent", "Composio", "n8n AI Agent", "Dify", "Flowise", "Vapi", "LiveKit Agents", "Pipecat"], ["Razvrstaj framework-e po ulozi.", "Izaberi stack za research agenta, coding agenta i voice agenta.", "Objasni koje znanje ostaje isto kada se promeni framework."], "Framework se tretira kao agent i mešaju se runtime, model, tool i orchestration odgovornosti.", ["Znaš gde živi model.", "Znaš šta framework apstrahuje.", "Možeš da promeniš alat bez gubitka mentalnog modela."], "Brendovi se menjaju; agent architecture, permissions, state, tools i verification ostaju.", 45),
    ],
  },
  {
    id: "a3",
    number: "A3",
    title: "Vibe production kroz agente",
    subtitle: "Od briefa do live website-a, automatizacije, proizvoda i marketing sistema.",
    color: "#ff8fb8",
    lessons: [
      L("vibe-website", "Vibe Website", "Ideju pretvaraš u agent brief, strukturu stranica, dizajn, implementaciju, GitHub, deployment i live test.", ["ideja", "agent brief", "struktura stranica", "dizajn", "implementacija", "GitHub", "deployment", "live test"], ["Napiši brief za jednu landing stranicu.", "Traži strukturu pre koda.", "Implementiraj, pushuj, deployuj i proveri javni URL."], "Website izgleda gotovo lokalno, ali deployment nije provereno otvoren u javnom browseru.", ["Repo sadrži promene.", "Deployment je uspešan.", "Live URL vraća očekivani UI."], "Vibe website nije prompt → screenshot; to je ideja → brief → build → deploy → javna provera.", 45),
      L("vibe-automation", "Vibe Automation", "Problem prevodiš u API/webhook tok, n8n workflow, AI agenta, MCP/integraciju, approval i proverljiv rezultat.", ["problem", "API ili webhook", "n8n", "AI agent", "MCP/integracija", "approval", "rezultat"], ["Izaberi event koji pokreće automatizaciju.", "Nacrtaj input/output svakog koraka.", "Dodaj approval pre write akcije i proveri execution output."], "Workflow se aktivira, ali payload mapping je pogrešan i downstream akcija dobija prazno polje.", ["Trigger je stvarno registrovan.", "Mapiranje podataka je provereno.", "Finalna akcija ima execution dokaz."], "Automatizacija je lanac podataka i odgovornosti; svaki korak mora da bude vidljiv i proverljiv.", 45, ["n8n", "MCP"]),
      L("vibe-product", "Vibe Product", "Requirements prevodiš u plan, UI, backend, bazu, auth, testove i deployment.", ["requirements", "agent plan", "UI", "backend", "database", "authentication", "tests", "deployment"], ["Definiši MVP scope.", "Razdvoji frontend, backend i data model.", "Postavi acceptance test i javnu proveru."], "Agent napravi atraktivan UI bez stvarne baze/auth logike.", ["Critical path radi end-to-end.", "Auth/data nisu mockovani bez oznake.", "Test i deployment dokaz postoje."], "Proizvod je sistem, ne samo ekran; svaki sloj mora da ima jasnu odgovornost.", 50),
      L("vibe-marketing", "Vibe Marketing", "Agent pomaže u research-u, pozicioniranju, messaging-u, SEO-u, email-u i outreach-u, ali brand pravila i činjenice moraju da se provere.", ["market research", "pozicioniranje", "messaging", "content plan", "SEO", "email kampanje", "social", "lead analiza", "personalizacija", "landing pages"], ["Daj agentu brand brief i ciljnu grupu.", "Generiši jedan content plan i jednu landing sekciju.", "Proveri činjenice, linkove, ton i CTA pre objave."], "Agent izmisli tržišni podatak ili koristi ton koji nije u skladu sa brendom.", ["Fact claims imaju izvor/proveru.", "Ton prati brand rules.", "Linkovi i CTA su realni."], "AI ubrzava marketing execution, ali kontekst i verifikacija određuju kvalitet.", 40),
    ],
  },
  {
    id: "f1",
    number: "01",
    title: "Digitalna osnova",
    subtitle: "Kako moderni digitalni projekti stvarno rade.",
    color: "#5dc8ff",
    lessons: [
      L("kako-rade-digitalni-projekti", "Kako rade moderni digitalni projekti", "Razumeš website/app, frontend/backend, server, bazu, lokalno okruženje i produkciju kao povezane slojeve.", ["aplikacija i website", "frontend i backend", "server", "baza podataka", "lokalno vs produkcija", "deployment", "browser ↔ server komunikacija"], ["Otvori postojeći proizvod.", "Identifikuj javne stranice, app deo, frontend, backend i bazu.", "Nacrtaj request od browsera do servera i nazad."], "Sve što vidiš u browseru nazoveš backendom ili pretpostaviš da baza živi u browseru.", ["Možeš da odvojiš UI od server logike.", "Znaš gde podaci trajno žive.", "Razumeš šta deployment menja."], "Moderni proizvod je skup slojeva koji komuniciraju preko jasnih granica.", 35),
      L("terminal-bez-straha", "Terminal bez straha", "Terminal je tekstualni interfejs prema računaru, procesima, projektima i alatima.", ["pwd", "cd", "mkdir", "ls", "git status", "npm install", "npm run dev", "curl", "procesi i portovi", "environment varijable"], ["Pronađi projekat kroz terminal.", "Pokreni lokalni website.", "Pronađi port i proveri server preko curl-a."], "Aplikacija ne radi jer je port zauzet ili je komanda pokrenuta iz pogrešnog foldera.", ["Znaš trenutni folder.", "Proces stvarno sluša na očekivanom portu.", "curl vraća očekivani response."], "Terminal nije programiranje; to je precizan način da vidiš i kontrolišeš šta računar radi.", 45, ["Terminal"]),
      L("fajlovi-folderi-struktura", "Fajlovi, folderi i struktura projekta", "Učiš kako da čitaš projekat pre nego što bilo šta menjaš.", ["package.json", "README.md", ".gitignore", "source fajlovi", "assets", "config", ".env i secrets"], ["Analiziraj strukturu jednog projekta.", "Pronađi entrypoint i glavnu konfiguraciju.", "Dodaj dokument sa svrhom projekta."], "Secret ili .env fajl slučajno završi u Git repozitorijumu.", [".gitignore pokriva secrets.", "README objašnjava svrhu i pokretanje.", "Znaš koji fajlovi su source a koji generated."], "Pre izmene projekta moraš da znaš šta je source, konfiguracija, dependency i secret.", 35),
    ],
  },
  {
    id: "f2",
    number: "02",
    title: "GitHub i repozitorijumi",
    subtitle: "Version control, timski rad i dokaz promena.",
    color: "#9aa8ff",
    lessons: [
      L("sta-je-github", "Šta je GitHub i čemu služi", "Razdvajaš Git kao version-control sistem od GitHub-a kao kolaboracionog hostinga za repository-je.", ["Git vs GitHub", "repository", "branch", "commit", "remote", "push/pull/clone", "public vs private"], ["Kreiraj repository.", "Poveži lokalni folder sa remote-om.", "Pushuj prvi projekat."], "Promene postoje samo lokalno, a korisnik misli da su već na GitHub-u.", ["Remote je ispravan.", "Commit postoji.", "Najnoviji commit se vidi na GitHub-u."], "Git čuva istoriju; GitHub je mesto gde tim deli tu istoriju i workflow oko nje.", 40, ["Git", "GitHub"]),
      L("git-workflow", "Git workflow bez komplikovanja", "Učiš mali set Git komandi dovoljan za siguran svakodnevni rad.", ["git init", "git status", "git add .", "git commit", "git remote add origin", "git push", "git pull", "provera izmena", "revert", "konflikti"], ["Napravi jednu kontrolisanu izmenu.", "Proveri status i commituj samo očekivane fajlove.", "Povuci remote izmene i reši mali konflikt."], "`git add .` pokupi secret ili neželjeni generated fajl.", ["Status je pregledan pre commit-a.", "Commit poruka opisuje promenu.", "Remote istorija odgovara lokalnoj."], "Git workflow je sigurnosna mreža samo ako proveravaš šta stvarno commit-uješ.", 45, ["Git"]),
      L("github-timski-rad", "GitHub kao timski radni prostor", "Issues, PR-ovi i permission nivoi pretvaraju repository u operativni prostor tima.", ["collaboratori", "permissions", "issues", "labels", "milestones", "pull requests", "code review", "merge", "branch protection"], ["Dodaj saradnika.", "Otvori issue i branch.", "Pošalji PR, pregledaj diff i merge-uj ga."], "Promena ide direktno na main bez review-a ili jasnog issue konteksta.", ["PR objašnjava šta i zašto.", "Review je završen.", "Merge je vezan za issue/acceptance criteria."], "GitHub workflow pravi trag odluka, vlasništva i provere — ne samo backup koda.", 45, ["GitHub"]),
      L("github-cli", "GitHub CLI za ljude koji ne žele da klikću", "`gh` daje brz terminal pristup repository-jima, issue-jima, PR-ovima i Actions statusu.", ["gh auth status", "gh repo view", "gh repo list", "gh repo clone", "gh api", "gh issue create", "gh pr create", "gh run list"], ["Proveri GitHub nalog kroz terminal.", "Pronađi repository i collaborator pristup.", "Kreiraj issue i proveri Actions run."], "CLI je ulogovan na pogrešan nalog ili nema permission koji pretpostavljaš da ima.", ["`gh auth status` pokazuje očekivani nalog.", "Repo/permission readback je stvaran.", "Issue/PR ID postoji nakon kreiranja."], "CLI ubrzava rad, ali identity i permissions uvek proveravaš pre write akcija.", 40, ["GitHub CLI"]),
    ],
  },
  {
    id: "f3",
    number: "03",
    title: "Vibe coding i AI coding alati",
    subtitle: "Od kvalitetnog zadatka do proverene implementacije.",
    color: "#6fe3a2",
    lessons: [
      L("razgovor-sa-coding-agentom", "Kako se pravilno razgovara sa AI coding agentom", "Dobar coding task definiše cilj, kontekst, scope, ograničenja, očekivani rezultat, test i verifikaciju.", ["cilj", "kontekst", "scope", "ograničenja", "očekivani rezultat", "testiranje", "verifikacija"], ["Uzmi loš prompt i pretvori ga u engineering brief.", "Traži plan pre izmene.", "Dodaj eksplicitni test koji mora da prođe."], "Agent radi nepotrebni refactor jer scope nije definisan.", ["Plan poštuje scope.", "Diff je minimalan.", "Test proverava acceptance criteria."], "Što je task precizniji, manje vremena trošiš na vraćanje agenta na pravi problem.", 40),
      L("codex-development-tim", "Codex kao član development tima", "Codex čita repository, pravi izmene, pokreće build/test i omogućava diff review.", ["Codex", "chat model vs coding agent", "repository context", "lokalni folder", "analiza koda", "izmene", "testovi", "build", "diff"], ["Daj Codex-u konkretan issue.", "Traži analizu pre izmene.", "Pokreni testove i ispravi jedan failure."], "Agent kaže da testovi prolaze bez stvarnog output-a komande.", ["Postoji test output.", "Diff je pregledan.", "Failed test je ponovljen nakon popravke."], "Agent je član development tima samo ako radi kroz isti dokazivi workflow kao čovek.", 45, ["Codex"]),
      L("vibe-coding-od-ideje-do-live", "Vibe coding workflow od ideje do live aplikacije", "Vezuješ requirements, dizajn, implementaciju, testiranje, Git, deployment i javnu proveru u jedan loop.", ["ideja", "requirements", "struktura", "dizajn", "implementacija", "testiranje", "commit", "push", "deployment", "javna provera", "iteracija"], ["Izaberi mali proizvod.", "Prođi svih 11 koraka bez preskakanja.", "Zapiši šta si promenio nakon live testa."], "Lokalni build radi, ali produkcioni environment nema potrebnu promenljivu.", ["Lokalni test prolazi.", "Deployment log je uspešan.", "Javni URL radi iz čistog browser session-a."], "Vibe coding je brz samo kada build i verification loop ostanu disciplinovani.", 50),
      L("ai-agenti-za-development", "AI agenti za development", "Agent loop spaja planiranje, tool calling, memory/context, permissions i human approval oko codebase-a.", ["chat vs agent", "tool calling", "agent loop", "planiranje", "verifikacija", "memory i context", "permissions", "human-in-the-loop"], ["Napravi agenta koji analizira repository.", "Generiši task listu iz stvarnih fajlova.", "Proveri build i generiši README na osnovu readback-a."], "Agent dobije destructive shell permissions i pokušava široku akciju bez approval-a.", ["Tool permissions su minimalne.", "Write/destructive akcija ima gate.", "Finalni rezultat ima realan build/readback dokaz."], "Development agent mora biti sposoban, ali i ograničen, vidljiv i proverljiv.", 45),
    ],
  },
  {
    id: "f4",
    number: "04",
    title: "Web komunikacija",
    subtitle: "HTTP, API, JSON i autentifikacija bez magije.",
    color: "#ffb45c",
    lessons: [
      L("browser-i-server", "Kako browser komunicira sa serverom", "URL i DNS vode do servera; HTTP request nosi method/headers/body, a response vraća status, headers i sadržaj.", ["URL", "domen", "DNS", "HTTP/HTTPS", "request/response", "status kodovi", "headers", "body", "query/path parametri", "200/201/400/401/403/404/429/500/502/530"], ["Otvori Network tab.", "Pronađi jedan request i pročitaj method, status i response.", "Objasni razliku između 401, 403 i 404."], "Frontend prikazuje 'ne radi' iako je pravi problem 401/403 sa API-ja.", ["Status kod je identifikovan.", "Request URL/method su tačni.", "Response body je pročitan pre nagađanja."], "HTTP status i response su prvi dokaz kada web komunikacija ne radi.", 45),
      L("api-od-nule", "API od nule", "API endpoint prima metod i podatke, izvršava operaciju i vraća strukturisan response.", ["endpoint", "method", "payload", "response", "REST", "JSON", "CRUD", "GET", "POST", "PUT", "PATCH", "DELETE"], ["Pozovi javni GET endpoint.", "Pošalji POST i pročitaj kreirani zapis.", "Izmeni ga PATCH-om i obriši testni zapis."], "Koristiš pogrešan method ili šalješ payload u formatu koji endpoint ne očekuje.", ["Status je očekivan.", "Response sadrži pravi ID/podatke.", "Finalni readback potvrđuje promenu."], "API nije magija: endpoint + method + auth + payload → response.", 45),
      L("json-za-non-tech", "JSON za non-tech ljude", "JSON je format za strukturisane podatke: objekti, nizovi i primitivne vrednosti mogu da se ugnjezde.", ["object", "array", "string", "number", "boolean", "null", "nesting", "valid/invalid JSON"], ["Popravi tri nevalidna JSON primera.", "Pronađi nested polje u API response-u.", "Mapiraj podatke u n8n izraz."], "Jedan zarez, quote ili pogrešan path pokvari ceo mapping.", ["JSON parser prihvata payload.", "Path vodi do očekivane vrednosti.", "Tip podatka odgovara downstream polju."], "Kad umeš da čitaš JSON, umeš da pratiš podatke između većine modernih alata.", 35),
      L("api-kljucevi-i-auth", "API ključevi i autentifikacija", "Razlikuješ tipove credential-a i znaš gde smeju da žive.", ["API key", "Bearer token", "OAuth", "access token", "refresh token", "Basic auth", "session cookie", "webhook secret", "service account", "personal access token", ".env", "secret rotation"], ["Razvrstaj credential-e po upotrebi.", "Smesti test secret u env var umesto source koda.", "Simuliraj rotaciju kompromitovanog ključa."], "Secret je hard-coded i pushovan u javni repository.", ["Secret nije u Git istoriji/source-u.", "Credential ima minimalni scope.", "Kompromitovan credential je rotiran, ne samo obrisan iz trenutnog fajla."], "Credential nije običan string — on predstavlja identitet i dozvolu.", 45),
      L("oauth-bez-magije", "OAuth bez magije", "OAuth omogućava korisniku da odobri ograničen pristup svom nalogu bez deljenja lozinke.", ["redirect URL", "consent screen", "scopes", "access token", "refresh token", "connected account", "user approval"], ["Nacrtaj OAuth tok od connect link-a do callback-a.", "Objasni zašto redirect URL mora da se poklapa.", "Izaberi minimalne scope-ove za Calendar read + event create."], "Aplikacija traži preširoke scope-ove ili koristi pogrešan redirect URL.", ["Redirect URL je identičan konfiguraciji.", "Scope je minimalan.", "Connected account pripada očekivanom korisniku."], "OAuth je delegiranje dozvole, ne deljenje korisničke lozinke.", 45, ["Google OAuth", "Composio"]),
    ],
  },
  {
    id: "f5",
    number: "05",
    title: "API i webhook automatizacija",
    subtitle: "Polling, event-driven tokovi i pouzdani webhook endpointi.",
    color: "#ff8067",
    lessons: [
      L("api-vs-webhook", "API naspram webhook-a", "API pita sistem; webhook javlja tebi kada se događaj desi.", ["API", "webhook", "polling", "event-driven", "webhook URL", "payload", "secret validation", "retries", "idempotency", "timeout"], ["Napravi webhook u n8n-u.", "Pošalji POST sa JSON payloadom.", "Obradi podatke i vrati success response."], "Provider retry-uje isti webhook i tvoj workflow duplira write akciju.", ["Webhook signature/secret je proverljiv.", "Idempotency sprečava duplikat.", "Response stiže pre timeout-a."], "Webhook donosi događaj ka tebi; zato moraš da brineš o autentifikaciji, duplikatima i retry-jima.", 45, ["n8n"]),
      L("webhook-debugging", "Webhook debugging", "Učiš zašto endpoint može da postoji u editoru, a da realno ne prima produkcione događaje.", ["test vs production URL", "aktivan workflow", "webhook registration", "HTTP method", "Content-Type", "Cloudflare blokade", "timeout", "530/1033", "1010"], ["Uporedi test i production URL.", "Proveri da li je workflow aktivan i webhook registrovan.", "Pošalji request ručno i pročitaj status/log."], "Workflow postoji, ali webhook nije registrovan ili provider koristi pogrešan URL/method.", ["Endpoint je javno dostupan.", "Method i Content-Type se poklapaju.", "Execution log pokazuje realni request."], "Kod webhook-a postojanje workflow-a nije dokaz da event route stvarno radi.", 45),
      L("content-type-i-headers", "Content-Type i headers", "Headers objašnjavaju kako treba tumačiti body, ko šalje zahtev i kakav odgovor očekuje.", ["Content-Type: application/json", "Authorization: Bearer", "Accept", "User-Agent", "header vs body"], ["Pošalji isti request sa i bez pravilnog Content-Type-a.", "Dodaj Authorization header.", "Uporedi server response."], "JSON body je ispravan, ali server ga ne parsira zbog pogrešnog Content-Type-a.", ["Content-Type odgovara body formatu.", "Auth header je pravilno formatiran.", "Response potvrđuje očekivano ponašanje."], "Mali header može da odluči da li isti payload radi ili ne radi.", 35),
    ],
  },
  {
    id: "f6",
    number: "06",
    title: "n8n automatizacija",
    subtitle: "Workflow-i, execution data, AI agent node i multi-agent sistemi.",
    color: "#ff6d63",
    lessons: [
      L("sta-je-n8n", "Šta je n8n", "n8n workflow povezuje trigger-e, action node-ove, credentials, expressions i execution data.", ["workflow", "node", "trigger", "action", "credentials", "expressions", "execution", "activation", "input/output", "error workflow"], ["Otvori jedan workflow.", "Prati jedan item kroz tri node-a.", "Namerno izazovi node error i pronađi error output."], "Podatak postoji u prethodnom node-u, ali expression pokazuje na pogrešan path.", ["Execution data je pregledan.", "Expression vraća očekivanu vrednost.", "Error se vidi i obrađuje."], "U n8n-u uvek pratiš podatak: šta je ušlo, šta je node promenio i šta je izašlo.", 40, ["n8n"]),
      L("prvi-korisni-n8n-workflow", "Prvi korisni n8n workflow", "Gradiš lead automation: Webhook → validacija/Set → AI Agent → Google Sheets → Slack → email potvrda.", ["Webhook", "Set/validation", "AI Agent", "Google Sheets", "Slack", "email"], ["Napravi lead form payload.", "Validiraj obavezna polja i klasifikuj lead.", "Upiši Sheet, pošalji Slack i potvrdu."], "Email ili Slack ode pre nego što je Sheet upis uspešno završen.", ["Svaki node ima očekivani input/output.", "Write akcije vraćaju ID/status.", "Finalna potvrda se šalje samo posle uspešnog toka."], "Koristan workflow nije broj node-ova nego pouzdan end-to-end rezultat.", 55, ["n8n", "Google Sheets", "Slack"]),
      L("n8n-api-upravljanje", "n8n API i upravljanje workflow-ima", "Workflow-i mogu da se čitaju, kreiraju, ažuriraju, aktiviraju i backup-uju preko API-ja.", ["GET workflow", "create/update", "activate/deactivate", "duplicate", "backup JSON", "PUT body struktura"], ["Pročitaj workflow preko API-ja.", "Sačuvaj JSON backup.", "Napravi kontrolisanu izmenu i potvrdi readback."], "PUT request izgubi obavezna polja i nenamerno resetuje deo workflow konfiguracije.", ["Pre write-a postoji backup.", "PUT body je kompletan.", "Readback potvrđuje finalno stanje."], "API upravljanje workflow-ima zahteva isti oprez kao code migration: backup, write, readback.", 45, ["n8n API"]),
      L("n8n-ai-agent-node", "AI Agent node u n8n-u", "AI Agent node kombinuje model, system prompt, user input, memory, tools, structured output, guardrails i fallback.", ["system prompt", "user input", "memory", "tools", "model", "structured output", "guardrails", "fallback", "human approval"], ["Napravi jednostavan lead qualification agent.", "Dodaj jedan read tool i structured output.", "Dodaj approval pre write akcije."], "Agent dobije write tool i širok prompt pa izvrši akciju bez potvrde.", ["Tool schema je jasna.", "Output prolazi validaciju.", "Write akcija ima approval gate."], "AI Agent node je mali agent runtime; kvalitet zavisi od konteksta, alata, granica i verifikacije.", 50, ["n8n AI Agent"]),
      L("n8n-multi-agent", "Multi-agent sistemi", "Specijalizovani agenti mogu da rade research, writing, SEO, image i publishing uz supervisor/router koordinaciju.", ["specialist agenti", "supervisor", "router", "shared context", "handoff", "conflict resolution", "parallel execution", "verification agent"], ["Razdvoji jedan content pipeline na 4 agenta.", "Definiši handoff contract.", "Dodaj verification agent pre publishing-a."], "Dva agenta paralelno promene isti shared state ili slede različite verzije brief-a.", ["Shared context ima canonical verziju.", "Handoff sadrži očekivani output schema.", "Publishing zavisi od verification rezultata."], "Multi-agent sistem pomaže kada specijalizacija i paralelizacija imaju jasnu koordinaciju.", 50),
    ],
  },
  {
    id: "f7",
    number: "07",
    title: "MCP i AI alati",
    subtitle: "Kako agent otkriva i koristi spoljne capability-je.",
    color: "#8d7aff",
    lessons: [
      L("sta-je-mcp", "Šta je MCP", "Model Context Protocol standardizuje način na koji host/client otkriva tools, resources i prompts sa MCP servera.", ["MCP", "server", "client", "tool", "resource", "prompt", "transport", "local vs remote", "MCP vs API"], ["Nacrtaj AI model → MCP client → MCP server → tool → aplikacija tok.", "Razvrstaj capability na tool/resource/prompt.", "Objasni šta MCP standardizuje, a šta ne."], "MCP se tretira kao da je sam model ili kao automatska dozvola za svaku akciju.", ["Host/server granica je jasna.", "Capability discovery je odvojen od execution permission-a.", "Znaš kada je običan API dovoljan."], "MCP daje standardni priključak za capability-je; permissions i trust i dalje moraš da projektuješ.", 45, ["MCP"]),
      L("kako-agent-dobija-alate", "Kako agent dobija alate", "Agent čita tool schema-u, popunjava required fields, runtime izvršava alat i rezultat vraća u context.", ["tool discovery", "tool schema", "required fields", "tool execution", "result/error", "permissions", "session", "timeout"], ["Pronađi jedan MCP tool.", "Pročitaj input schema.", "Pozovi read, zatim kontrolisani write alat i proveri result."], "Model napravi syntactically validan tool call sa semantički pogrešnim ID-em.", ["Arguments prolaze schema i business validaciju.", "Write action ima permission.", "Result/readback potvrđuje efekat."], "Tool calling je predlog modela + validacija/runtime + realna spoljna akcija + rezultat.", 45),
      L("composio-mcp-gateway", "Composio kao MCP gateway", "Composio povezuje SaaS toolkits i OAuth connected accounts sa agentima/MCP pristupom.", ["Composio", "SaaS integracije", "MCP config", "OAuth Connect Link", "connected accounts", "toolkit", "tool execution", "API key vs MCP credential", "Gmail", "Calendar", "Drive", "Sheets", "Slack", "YouTube", "Vapi"], ["Kreiraj Connect Link.", "Poveži jedan test nalog.", "Izvrši read tool i proveri koji connected account je korišćen."], "API key se pomeša sa connected-account credential-om ili alias sa pravim account ID-em.", ["OAuth connected account je stvarno povezan.", "Execution koristi očekivani account.", "Read i write scopes su jasni."], "Gateway rešava integracioni plumbing, ali identity i account mapping moraš proveriti.", 50, ["Composio", "MCP"]),
      L("custom-mcp-server", "Pravljenje sopstvenog MCP servera", "Custom MCP praviš kada želiš da svoj sistem predstaviš agentu kroz jasne, validirane capability-je.", ["kada custom MCP", "tool schema", "input validation", "read-only vs write", "error handling", "secrets", "logging", "deployment", "list_projects", "get_project", "create_task", "update_project_status"], ["Definiši četiri project tools.", "Odvoji read i write operacije.", "Dodaj validation i error response za pogrešan project ID."], "Tool prihvati bilo koji input i direktno prosledi vrednost produkcionom backend-u.", ["Input schema je restriktivna.", "Secrets nisu u response-u/logu.", "Write akcije imaju auth/audit."], "Dobar MCP server je mali, bezbedan API dizajniran za model-friendly discovery i execution.", 55, ["MCP"]),
      L("tool-security-dozvole", "Tool security i dozvole", "Least privilege, approvals, audit i dry-run sprečavaju da sposoban agent postane opasan operator.", ["read vs write", "least privilege", "approval pre emaila", "approval pre brisanja", "channel/user limits", "audit log", "rollback", "dry run"], ["Klasifikuj tools kao read/write/destructive.", "Dodaj approval za email/delete.", "Pokreni dry-run i pregledaj plan pre execute-a."], "Agent sa širokim tokenom može da piše ili briše resurse izvan task scope-a.", ["Credential scope je minimalan.", "Rizične akcije traže approval.", "Audit log i rollback strategija postoje."], "Capability nije isto što i dozvola: agent treba samo onaj pristup koji je potreban za konkretan task.", 45),
    ],
  },
  {
    id: "f8",
    number: "08",
    title: "Voice agenti i komunikacija",
    subtitle: "Speech pipeline, tools, booking i personalizovani glas.",
    color: "#ef78c6",
    lessons: [
      L("kako-rade-voice-agenti", "Kako rade voice agenti", "Voice agent spaja speech-to-text, LLM, text-to-speech, telefoniju, prompt, transcript, tool calls i call status.", ["STT", "LLM", "TTS", "voice provider", "phone number", "assistant", "system prompt", "transcript", "tool call", "call status"], ["Nacrtaj voice pipeline.", "Prati jednu korisničku rečenicu od audio inputa do audio odgovora.", "Pronađi gde nastaje transcript i gde tool call ulazi u loop."], "Agent potvrdi akciju glasom pre nego što tool execution stvarno uspe.", ["Tool result postoji pre confirmation-a.", "Transcript odgovara korisničkoj nameri.", "Call status/log pokazuje realno stanje."], "Voice agent je real-time agent loop sa dodatnim audio latency i turn-taking problemima.", 45, ["Vapi"]),
      L("voice-agent-tools", "Voice agent tools", "Voice agent koristi custom API, native provider i webhook tools za Calendar, SMS, CRM, lead creation i handoff.", ["custom API tools", "native tools", "webhook tools", "Calendar booking", "SMS", "CRM lookup", "lead creation", "handoff"], ["Dodaj read-only CRM lookup.", "Dodaj booking write tool sa approval pravilom.", "Testiraj handoff kada agent nema dovoljno informacija."], "Tool traje predugo pa razgovor zvuči kao da je agent nestao ili potvrdi neuspešnu akciju.", ["Timeout/fallback je definisan.", "Write result se proverava.", "Handoff prenosi transcript i kontekst."], "Voice tool mora biti brz, jasan i proverljiv jer korisnik nema ekran koji pokazuje šta se desilo.", 45),
      L("google-calendar-booking", "Google Calendar booking", "Booking mora da proveri availability, timezone, duration, attendee i vrati event ID ili validan Meet link.", ["availability", "timezone", "duration", "attendee", "title", "event ID", "Meet link", "confirmation", "cancellation test"], ["Proveri slobodan termin.", "Kreiraj test event sa timezone-om Europe/Belgrade.", "Proveri event ID/Meet link i zatim testiraj cancellation."], "Agent kaže 'zakazano je' bez event ID-ja ili validnog linka.", ["Event ID postoji.", "Timezone i trajanje su tačni.", "Cancellation/readback potvrđuju stvarni calendar state."], "Nikad ne potvrđuj booking na osnovu modelove rečenice — potvrđuj na osnovu Calendar rezultata.", 45, ["Google Calendar"]),
      L("elevenlabs-personalizovani-glas", "ElevenLabs i personalizovani glas", "Podešavaš voice ID, model, jezik, stability/style i audio format, a zatim testiraš realni izgovor.", ["voice ID", "model", "language", "stability", "style", "MP3", "OGG/Opus", "voice message delivery"], ["Generiši kratku srpsku voice poruku.", "Uporedi dva stability/style podešavanja.", "Pošalji audio u test Slack ili Telegram kanal."], "Audio fajl postoji, ali format ili izgovor ne radi u ciljnom kanalu.", ["Audio može da se reprodukuje.", "Srpski izgovor je provereno razumljiv.", "Delivery rezultat je potvrđen u ciljnom kanalu."], "Voice kvalitet se proverava slušanjem i realnim delivery-em, ne samo uspešnim API statusom.", 40, ["ElevenLabs"]),
    ],
  },
  {
    id: "f9",
    number: "09",
    title: "Deployment i javna dostupnost",
    subtitle: "Od localhost-a do stabilnog javnog sistema.",
    color: "#48c7b3",
    lessons: [
      L("lokalno-vs-produkcija", "Lokalno naspram produkcije", "Razumeš localhost, port, environment, build, production server, public URL, logs i health check.", ["localhost", "port", "environment", "build", "production server", "public URL", "logs", "health check"], ["Pokreni lokalni servis.", "Identifikuj frontend i API port.", "Objasni zašto `Cannot GET /` može biti normalan za API-only server."], "Pogrešan port se testira kao frontend pa se zaključuje da je cela aplikacija pokvarena.", ["Tačan servis/port je identifikovan.", "Health endpoint ili očekivani route radi.", "Production URL se testira nezavisno od lokalnog."], "Prvo identifikuj koji servis testiraš; tek onda zaključuj da li je sistem pokvaren.", 40),
      L("firebase-app-hosting", "Firebase App Hosting", "Učiš runtime, Node entrypoint, start script, buildpacks, region, rollout i logove.", ["runtime", "Node.js entrypoint", "package.json", "start script", "apphosting/app yaml", "buildpacks", "region", "backend", "rollout", "logs", "No buildpack groups passed detection"], ["Pregledaj package.json i start script.", "Pročitaj failed build log.", "Objasni kako entrypoint utiče na buildpack detection."], "Deployment pokušava da hostuje projekat bez runtime/entrypoint-a koji platforma ume da detektuje.", ["Build log pokazuje uspešnu detekciju.", "Runtime pokreće očekivani server.", "Rollout ima javni health signal."], "Deployment platforma ne zna tvoju nameru — struktura projekta mora jasno da pokaže kako se app gradi i pokreće.", 50, ["Firebase App Hosting"]),
      L("firebase-firestore-storage", "Firebase, Firestore i Storage", "Učiš Firebase projekat, Firestore dokumente, Storage bucket, service account i security rules.", ["Firebase project", "Firestore collection/document", "document ID", "Storage bucket", "public URL", "service account", "security rules"], ["Kreiraj test dokument.", "Uploaduj sliku i sačuvaj URL.", "Pročitaj dokument nazad i proveri security rule ponašanje."], "Service account credential završi u client bundle-u ili Storage dobije nepotrebno javni write pristup.", ["Client nema server secret.", "Rules ograničavaju write.", "Document/asset readback radi."], "Firebase olakšava backend, ali auth i security rules ostaju tvoje odgovornosti.", 50, ["Firebase", "Firestore"]),
      L("vercel-deployment", "Vercel deployment", "Vercel povezuje Git projekat sa preview/production deployment-ima, domenom i env varijablama.", ["project", "deployment", "domain", "environment variables", "preview vs production", "build logs", "Git integration"], ["Poveži repository.", "Napravi preview deployment.", "Proveri production env i domen."], "Preview radi sa jednom env vrednošću, production koristi drugu ili nedostaje secret.", ["Preview i production su jasno odvojeni.", "Build log nema error.", "Production domain otvara očekivanu verziju."], "Deployment environment je deo proizvoda; preview uspeh nije automatski production uspeh.", 40, ["Vercel"]),
      L("tailscale-funnel", "Tailscale Funnel", "Funnel privremeno izlaže lokalni servis na javni URL, što je korisno za webhook testiranje.", ["lokalni servis", "private network", "Tailscale", "Funnel", "public URL", "webhook test", "gašenje tunela"], ["Pokreni lokalni servis.", "Izloži ga kroz Funnel.", "Pošalji test webhook i zatim ugasi javni pristup."], "Provider nastavi da šalje webhook na URL tunela nakon što je Funnel ugašen.", ["Public URL radi dok je Funnel aktivan.", "Webhook test ima execution log.", "Produkcioni provider ne zavisi trajno od test tunela."], "Tunnel je alat za povezivanje okruženja, ne zamena za stabilan production hosting.", 40, ["Tailscale"]),
      L("cloudflare-tunnel-debugging", "Cloudflare i tunnel debugging", "Razlikuješ proxy/WAF problem od ugašenog origin-a ili tunnel-a.", ["Cloudflare proxy", "WAF", "Argo tunnel", "1010", "1033", "HTTP 530", "origin server", "browser headers"], ["Za svaki error 1010/1033/530 odredi sloj problema.", "Proveri origin nezavisno od proxy-a.", "Napravi fallback test plan."], "WAF blokada se pogrešno tretira kao app bug ili ugašen tunnel kao frontend bug.", ["Origin health je proveren.", "Tunnel status je proveren.", "Proxy/WAF i app sloj su odvojeno testirani."], "Cloud/network error ima svoj sloj; ne popravljaj aplikaciju dok ne potvrdiš da request do nje uopšte stiže.", 45, ["Cloudflare"]),
    ],
  },
  {
    id: "f10",
    number: "10",
    title: "Debugging kao supermoć",
    subtitle: "Reprodukuj, izoluj, dokaži, popravi, ponovi.",
    color: "#ffcc57",
    lessons: [
      L("kako-se-trazi-greska", "Kako se traži greška", "Debugging je metod, ne nasumično menjanje stvari.", ["reprodukuj", "tačan error", "odredi sloj", "poslednja izmena", "izoluj komponentu", "najmanji slučaj", "popravi", "ponovi test", "dokumentuj", "browser/frontend/backend/API/auth/database/deployment/DNS/provider"], ["Uzmi realan bug.", "Zapiši najmanji reprodukcioni slučaj.", "Odredi sloj pre bilo kakve izmene."], "Promeniš tri stvari odjednom pa više ne znaš šta je stvarno rešilo problem.", ["Bug se može reprodukovati.", "Jedna hipoteza se testira odjednom.", "Fix je potvrđen istim testom koji je ranije padao."], "Najbrži debugging je disciplinovano sužavanje prostora mogućih uzroka.", 45),
      L("citanje-logova", "Čitanje logova", "Logovi su zapis stvarnog ponašanja browsera, servera, build-a, workflow-a i spoljnog providera.", ["browser console", "Network tab", "server logs", "build logs", "n8n execution logs", "Firebase logs", "GitHub Actions logs", "Vapi call logs"], ["Za jedan incident pronađi log na svakom relevantnom sloju.", "Poveži timestamp-e događaja.", "Identifikuj prvi failure, ne poslednju posledicu."], "Gledaš samo finalni error, dok prvi pravi failure postoji 20 linija ranije.", ["Timestamp/correlation se poklapaju.", "Prvi failure je identifikovan.", "Fix targetuje uzrok, ne simptom."], "Log je dokaz; poruka agenta ili korisnika je početna hipoteza.", 40),
      L("ne-veruj-agentu-na-slepo", "Kako se ne veruje agentu na slepo", "Tvrdnja nije dokaz: tražiš GitHub readback, HTTP response, execution result, event ID, live URL, build output ili test result.", ["GitHub readback", "HTTP response", "execution result", "event ID", "live URL", "build output", "test result", "aktivan workflow"], ["Uzmi pet tipičnih 'gotovo je' tvrdnji.", "Za svaku izaberi minimalni dokaz.", "Odbij completion kada dokaz ne postoji."], "Agent kaže da je deployment ili booking gotov samo zato što je poslao request.", ["Postoji eksterni readback.", "ID/status se može nezavisno proveriti.", "Finalni rezultat, ne samo pokušaj, ispunjava cilj."], "Ako nema realnog output-a iz alata, nema dokaza da je posao završen.", 40),
    ],
  },
  {
    id: "f11",
    number: "11",
    title: "Produktivnost i timski rad",
    subtitle: "Od nejasne ideje do vlasništva, handoff-a i dokumentacije.",
    color: "#7ad7ff",
    lessons: [
      L("od-ideje-do-taska", "Od ideje do taska", "Pretvaraš nejasnu ideju u konkretan task sa owner-om, definition of done i acceptance criteria.", ["konkretan zadatak", "definition of done", "acceptance criteria", "koraci", "GitHub Issues", "Linear", "Taskwise"], ["Uzmi nejasnu ideju i napiši issue.", "Dodaj acceptance criteria.", "Podeli task na korake koji mogu nezavisno da se provere."], "Task kaže 'sredi app' pa implementer i reviewer zamišljaju potpuno različit cilj.", ["Done je merljiv.", "Scope je ograničen.", "Reviewer zna kako da proveri rezultat."], "Dobar task je mali ugovor između ideje, implementacije i verifikacije.", 40),
      L("rad-sa-ljudima-i-agentima", "Rad sa više ljudi i agenata", "Jasne uloge i handoff sprečavaju dupli rad i konflikt između ljudi i agenata.", ["owner", "reviewer", "implementer", "delegiranje", "handoff", "decision log", "sprečavanje duplog rada"], ["Podeli projekat na owner/research/design/test/AI QA uloge.", "Napiši handoff template.", "Zapiši jednu odluku u decision log."], "Dva učesnika rade isti task ili menjaju isti artefakt bez koordinacije.", ["Svaki task ima owner-a.", "Handoff ima status i sledeći korak.", "Decision log čuva ključne odluke."], "Koordinacija je deo tehničkog sistema kada ljudi i agenti rade zajedno.", 40),
      L("dokumentacija-koja-spasava", "Dokumentacija koja spasava projekat", "README, setup, architecture, environment, API, changelog i troubleshooting smanjuju zavisnost od usmenog znanja.", ["README", "setup", "architecture notes", "environment docs", "API docs", "changelog", "troubleshooting", "project purpose"], ["Napravi README za postojeći projekat.", "Dokumentuj env varijable bez secret vrednosti.", "Dodaj troubleshooting za jedan realan bug."], "Projekat radi samo na računaru osobe koja zna skrivene setup korake.", ["Novi član može da pokrene projekat iz dokumentacije.", "Secrets nisu dokumentovani kao vrednosti.", "Known failure ima reproduction/fix note."], "Dokumentacija je operativna memorija projekta.", 40),
    ],
  },
  {
    id: "f12",
    number: "12",
    title: "Security i odgovoran rad",
    subtitle: "Secrets, permission granice i bezbedan rad sa agentima.",
    color: "#ff667f",
    lessons: [
      L("secrets-tokeni-bezbednost", "Secrets, tokeni i bezbednost", "Učiš šta je credential, šta nikada ne ide u repo, kako se rotira i kako permissions smanjuju blast radius.", ["secret", "credential", "repo hygiene", "secret rotation", "permissions", "Git history", "reakcija na leaked token"], ["Pronađi rizične vrednosti u test projektu.", "Premesti ih u env varijable.", "Simuliraj revoke + rotate + history cleanup plan."], "Secret se obriše iz poslednjeg commita, ali ostane važeći i prisutan u Git istoriji.", ["Credential je revoke/rotated.", "Repo istorija je procenjena.", "Novi secret ima minimalni scope."], "Brisanje procurenog secret-a nije dovoljno — smatraj ga kompromitovanim i rotiraj ga.", 45),
      L("ai-agent-safety", "AI agent safety", "Prompt injection, malicious web content, tool abuse i excessive permissions zahtevaju trust boundaries, confirmations i audit.", ["prompt injection", "malicious webpage instructions", "tool abuse", "excessive permissions", "destructive commands", "confirmation gates", "human approval", "audit trail"], ["Prikaži agentu malicious webpage instrukciju i identifikuj zašto nije trusted instruction.", "Postavi approval za destructive tool.", "Pregledaj audit trail nakon test akcije."], "Agent tretira tekst sa web stranice kao korisničku naredbu i pokušava da pošalje secret ili izvrši write akciju.", ["External content je data, ne authority.", "Agent ne unosi password/API key u nepouzdan input.", "Destructive action traži human approval."], "Sposoban agent mora da ima manje implicitnog poverenja, ne više.", 50),
    ],
  },
  {
    id: "final",
    number: "FINAL",
    title: "Završni projekti",
    subtitle: "Spoji alate, agente, automatizaciju, deployment i verifikaciju u realne proizvode.",
    color: "#ffd34f",
    lessons: [
      L("projekat-licni-ai-workspace", "Završni projekat 1: Lični AI workspace", "Gradiš repository, README, osnovni website, lokalno pokretanje, prvi deployment i issue workflow.", ["GitHub repo", "README", "website", "local run", "deployment", "issue workflow"], ["Kreiraj repo i dokumentuj svrhu.", "Pokreni lokalno i deployuj.", "Otvori issue za sledeću iteraciju."], "Live projekat nema dokumentaciju ili repo nije povezan sa deployment-om.", ["Novi korisnik može da pokrene projekat.", "Javni URL radi.", "Issue workflow postoji."], "Prvi capstone dokazuje da umeš da vodiš mali digitalni projekat od foldera do javnog URL-a.", 90),
      L("projekat-lead-automation", "Završni projekat 2: Lead automation sistem", "Landing forma šalje webhook, validira podatke, AI kvalifikuje lead, upisuje Sheet, šalje Slack i email.", ["landing form", "webhook", "validation", "AI qualification", "Google Sheets", "Slack", "email", "auth", "JSON mapping"], ["Napravi end-to-end lead tok.", "Testiraj validan i nevalidan lead.", "Dokaži svaki write kroz execution/readback."], "Dupli webhook kreira dupli lead ili email odlazi pre finalne validacije.", ["Idempotency radi.", "Sheet sadrži očekivani zapis.", "Slack/email odgovaraju stvarnom finalnom stanju."], "Automation capstone spaja web, API, auth, mapping, n8n i live verification.", 120, ["n8n", "Google Sheets", "Slack"]),
      L("projekat-mcp-agent", "Završni projekat 3: AI agent sa MCP alatima", "Agent čita GitHub task i Drive podatke, pravi Calendar event, šalje Slack poruku i traži approval za write akcije.", ["GitHub", "Google Drive", "Calendar", "Slack", "MCP", "approval"], ["Definiši read/write capability mapu.", "Izvrši research task preko read alata.", "Traži approval pre Calendar/Slack write-a i potvrdi readback."], "Agent koristi pogrešan connected account ili write bez approval-a.", ["Identity/account je potvrđen.", "Write ima approval.", "Event/message ID dokazuje rezultat."], "MCP capstone proverava da umeš da spojiš capabilities, identity, permissions i verification.", 120),
      L("projekat-voice-appointment-agent", "Završni projekat 4: Voice AI appointment agent", "Praviš Vapi assistant, knowledge prompt, ElevenLabs glas, availability tool, Calendar creation, fallback i event verifikaciju.", ["Vapi", "knowledge prompt", "ElevenLabs", "availability", "Calendar", "fallback", "event ID verification"], ["Napraviti voice assistant.", "Testirati booking sa validnim i konflikt terminom.", "Potvrditi event tek nakon realnog Calendar rezultata."], "Agent verbalno potvrdi booking iako Calendar tool nije uspeo.", ["Event ID ili validan link postoji.", "Fallback radi.", "Transcript/log potvrđuje realni tok."], "Voice capstone traži pouzdan realtime UX i isti verification standard kao svaki drugi agent.", 120, ["Vapi", "ElevenLabs", "Google Calendar"]),
      L("projekat-produkcioni-ai-proizvod", "Završni projekat 5: Produkcioni AI proizvod", "Kompletan projekat spaja brand, website, app, GitHub, coding agente, n8n, MCP, bazu, deployment, analytics, docs, monitoring i javni demo.", ["ideja", "brand", "website", "app", "GitHub", "Codex workflow", "n8n", "MCP", "database", "deployment", "analytics", "documentation", "monitoring", "public demo"], ["Definiši arhitekturu i milestone-e.", "Izgradi critical path end-to-end.", "Napravi security/reliability review i javni demo."], "Demo izgleda dobro, ali ključni integration je mock, monitoring ne postoji ili write akcija nema approval.", ["Critical path je stvarno live.", "Monitoring/logging pokriva failure-e.", "Docs i security model postoje."], "Finalni nivo nije 'znam alat' nego 'umem da projektujem, isporučim i dokažem ozbiljan digitalni sistem'.", 180),
    ],
  },
];

export const academyLessons = academyPhases.flatMap((phase) =>
  phase.lessons.map((lesson, index) => ({ ...lesson, phaseId: phase.id, phaseNumber: phase.number, phaseTitle: phase.title, phaseColor: phase.color, index })),
);

export type AcademyLessonWithPhase = (typeof academyLessons)[number];

export function getAcademyLesson(slug: string) {
  return academyLessons.find((lesson) => lesson.slug === slug);
}

export function getAcademyLessonNeighbors(slug: string) {
  const index = academyLessons.findIndex((lesson) => lesson.slug === slug);
  return {
    previous: index > 0 ? academyLessons[index - 1] : undefined,
    next: index >= 0 && index < academyLessons.length - 1 ? academyLessons[index + 1] : undefined,
  };
}

export const academyCertificates = [
  { level: "Level 1", title: "Tool Operator", description: "Terminal, GitHub, osnovni JSON, lokalno pokretanje i jednostavan deployment." },
  { level: "Level 2", title: "Automation Builder", description: "API, webhook, n8n, credentials, SaaS integracije i osnovni debugging." },
  { level: "Level 3", title: "AI Systems Builder", description: "Agenti, MCP, Composio, tool schema, coding agenti, multi-agent workflow i production deployment." },
  { level: "Level 4", title: "AI Automation Architect", description: "Arhitektura sistema, API/webhook/MCP izbor, permissions, fallback, security review, tim i live isporuka." },
] as const;

export const academyMentalModels = [
  "Svaki problem ima slojeve — browser, frontend, backend, API, auth, baza, deployment, DNS i provider nisu ista stvar.",
  "API pita, webhook javlja, MCP omogućava agentu da koristi alat.",
  "AI nije zamena za razmišljanje: maglovit problem daje maglovit rezultat.",
  "Svaka akcija mora da ima proveru: readback, response, execution result, ID, live URL, build ili test.",
  "Non-tech ne znači non-technical: ne moraš biti klasičan developer da bi razumeo kako se sistemi povezuju.",
] as const;
