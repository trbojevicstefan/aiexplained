import styles from "./page.module.css";

export const metadata = {
  title: "AI Academy — 4-satni kurs",
  description: "Prezentacija na srpskom za netehničke polaznike: AI agenti, GitHub, API, n8n, MCP, deployment i debugging.",
};

const sections = [
  {
    time: "00:00–00:10",
    title: "Uvod: šta učimo, a šta ne učimo danas",
    goal: "Da svi imaju isti rečnik pre nego što krenemo u alate.",
    analogy: "Kao kad pre vožnje prvo objasnimo volan, gas i kočnicu — ne rastavljamo motor.",
    points: [
      "Ne učimo programiranje duboko.",
      "Učimo kako da razumemo AI alate i da ih vodimo.",
      "Najvažnije pravilo: ne verujemo tvrdnji dok ne vidimo dokaz.",
    ],
    say: "Danas ne pokušavamo da od netehničke osobe napravimo senior developera. Cilj je da osoba razume šta se dešava, zna šta da traži od agenta i ume da proveri rezultat.",
  },
  {
    time: "00:10–00:30",
    title: "Digitalna osnova: računar, server, browser i produkcija",
    goal: "Da polaznik razlikuje šta radi kod njega na računaru, a šta radi online za sve korisnike.",
    analogy: "Lokalno je tvoja radionica. Produkcija je izlog u ulici. Nije isto kada nešto radi kod tebe i kada radi javno za druge ljude.",
    points: [
      "Browser je prozor kroz koji gledaš web, nije sam internet.",
      "Server je računar negde online koji je stalno uključen i prima zahteve.",
      "Deployment znači: iz radionice prebacujemo stvar u javni izlog.",
    ],
    say: "Kada kažemo ‘radi lokalno’, to znači: radi na mom laptopu. Kada kažemo ‘radi u produkciji’, to znači: može stvarni korisnik da otvori i koristi.",
  },
  {
    time: "00:30–00:55",
    title: "Šta je AI agent bez magije",
    goal: "Da polaznik razume agenta kao radnika sa ciljem, kontekstom, alatima i proverom.",
    analogy: "Agent je kao junior zaposleni. Ako mu kažeš ‘sredi ovo’, nagađa. Ako mu daš cilj, materijal, granice i proveru — može mnogo da pomogne.",
    points: [
      "Model je deo koji razume i piše.",
      "Kontekst je ono što agent trenutno vidi.",
      "Alati su stvari koje agent može da koristi: fajlovi, browser, GitHub, kalendar, n8n.",
      "Provera je dokaz da posao stvarno radi.",
    ],
    say: "Agent nije završen kada kaže ‘gotovo’. Završen je kada pokaže dokaz: build je prošao, email je poslat, event postoji, workflow ima uspešan run.",
  },
  {
    time: "00:55–01:20",
    title: "Kako dati dobar zadatak agentu",
    goal: "Da polaznik nauči da piše dobar brief umesto nejasne poruke.",
    analogy: "Brief je kao narudžbenica. Ako krojaču kažeš ‘napravi nešto lepo’, ne možeš da se ljutiš ako ne pogodi. Ako daš meru, materijal i namenu — mnogo je veća šansa da dobiješ šta želiš.",
    points: [
      "Cilj: šta tačno treba da postoji na kraju?",
      "Kontekst: koji fajlovi, linkovi, podaci i pravila su važni?",
      "Granice: šta agent sme, šta ne sme i šta ne dira?",
      "Output: u kom obliku želiš rezultat?",
      "Provera: kako znamo da je stvarno završeno?",
    ],
    say: "Loš zadatak je: ‘sredi mi sajt’. Dobar zadatak je: ‘dodaj sekciju X na homepage, stil neka bude ozbiljan, ne diraj postojeći AI Explained deo, posle toga pokreni build’. To je ogromna razlika.",
  },
  {
    time: "01:20–01:50",
    title: "GitHub prostim jezikom",
    goal: "Da polaznik razume repository, commit, push, pull, branch i pull request bez učenja komandi napamet.",
    analogy: "GitHub je kao neki server tamo negde u 3 pm koji čuva tvoj kod. Ti radiš kod sebe, a kada pushuješ, šalješ novu verziju tamo. On pamti šta se promenilo i kada.",
    points: [
      "Repository je folder projekta na GitHub-u.",
      "Commit je snimak stanja projekta u jednom trenutku.",
      "Push znači: pošalji moje lokalne promene na GitHub server.",
      "Pull znači: povuci najnoviju verziju sa GitHub-a kod sebe.",
      "Branch je probna kopija da ne polomiš glavni projekat.",
      "Pull request je zahtev da neko pregleda i spoji promene.",
    ],
    say: "Ako agent menja kod, mi ne gledamo samo njegov tekst. Gledamo diff, commit, branch, build i da li je promena stvarno otišla u repo.",
  },
  {
    time: "01:50–02:00",
    title: "Pauza",
    goal: "Deset minuta da se resetuje pažnja pre API/n8n dela.",
    analogy: "Kao restart računara — ne zato što je pokvaren, nego da nastavimo sveže.",
    points: ["10 minuta pauze", "Posle pauze prelazimo sa mentalnog modela na sisteme koji pričaju međusobno."],
    say: "Do sada smo objasnili čovek → agent → kod. Posle pauze objašnjavamo kako aplikacije pričaju jedna sa drugom.",
  },
  {
    time: "02:00–02:20",
    title: "API: kako sistemi pričaju",
    goal: "Da polaznik shvati request, response, status i autentifikaciju bez dubokog programiranja.",
    analogy: "API je konobar. Ti ne ideš u kuhinju restorana. Kažeš konobaru šta želiš; on odnese zahtev kuhinji i vrati odgovor.",
    points: [
      "Request je pitanje ili zahtev koji šalješ drugom sistemu.",
      "Response je odgovor koji se vrati.",
      "Status kaže da li je zahtev uspeo ili gde je problem.",
      "Auth/token/API key su dokaz da imaš pravo da tražiš nešto.",
    ],
    say: "Ako API kaže 401, problem je identitet. Ako kaže 403, zna ko si, ali nemaš dozvolu. Ako kaže 500, često je problem na serveru. Ne popravljamo nasumično — prvo čitamo status.",
  },
  {
    time: "02:20–02:35",
    title: "Webhook: zvono koje pokreće workflow",
    goal: "Da polaznik razlikuje stalno proveravanje od event-driven sistema.",
    analogy: "Webhook je zvono na vratima. Ne ideš svaka dva minuta do vrata da vidiš da li je neko došao. Kada neko dođe — zvono te obavesti.",
    points: [
      "Webhook se desi kada se dogodi događaj: forma, uplata, booking, novi lead.",
      "On šalje podatke nekom drugom sistemu.",
      "Važno je da isti webhook ne napravi dupli posao ako se ponovi.",
    ],
    say: "Primer: korisnik popuni formu. Webhook odmah pošalje podatke u n8n. n8n onda može da validira lead, pozove AI, upiše u tabelu i pošalje Slack poruku.",
  },
  {
    time: "02:35–02:55",
    title: "n8n: automatizacija kao tabla sa koracima",
    goal: "Da polaznik razume workflow kao niz malih koraka, a ne kao čarobnu kutiju.",
    analogy: "n8n je kao LEGO tabla ili vodovodne cevi. Jedan deo primi podatak, drugi ga obradi, treći ga pošalje dalje.",
    points: [
      "Trigger pokreće workflow.",
      "Node je jedan korak u procesu.",
      "AI node nije magija — dobija input, instrukciju i vraća output.",
      "Run history je dokaz šta se stvarno desilo.",
    ],
    say: "Ako workflow ne radi, ne menjamo sve. Gledamo koji node je prvi pukao, koji podatak je ušao, koji je izašao i koji error se pojavio.",
  },
  {
    time: "02:55–03:10",
    title: "MCP, alati i dozvole",
    goal: "Da polaznik razume zašto agentu trebaju alati, ali i zašto mu ne dajemo sve dozvole.",
    analogy: "MCP je kao univerzalni adapter za utičnice. Ne pravi struju, ali pomaže da se uređaji spoje na dogovoren način.",
    points: [
      "Tool calling znači da model predloži akciju, a sistem je izvrši.",
      "Read akcije samo čitaju podatke.",
      "Write akcije menjaju stvarni svet: šalju email, prave event, menjaju fajl.",
      "Rizične write akcije traže approval.",
    ],
    say: "Najgora greška je dati agentu preširoke dozvole bez loga i provere. Najbolje pravilo: daj mu najmanju dozvolu koja mu treba da završi konkretan posao.",
  },
  {
    time: "03:10–03:25",
    title: "Voice agenti",
    goal: "Da polaznik razume glasovnog agenta kao pipeline, ne kao jednu AI magiju.",
    analogy: "Voice agent je telefonista koji sluša, razume nameru, proverava sistem i tek onda odgovara glasom.",
    points: [
      "STT pretvara govor u tekst.",
      "AI razume nameru korisnika.",
      "Tool/API proverava stvarne podatke, npr. kalendar.",
      "TTS pretvara odgovor nazad u glas.",
    ],
    say: "Ako voice agent kaže ‘termin je zakazan’ pre nego što kalendar stvarno vrati potvrdu, to je opasan dizajn. Prvo tool result, pa tek onda glasovni odgovor.",
  },
  {
    time: "03:25–03:40",
    title: "Deployment i monitoring",
    goal: "Da polaznik razume kada je nešto stvarno live i kako se proverava da radi.",
    analogy: "Deployment je iznošenje proizvoda iz radionice u izlog. Monitoring je kamera i alarm koji ti kažu da li izlog radi.",
    points: [
      "Lokalno znači: radi kod mene.",
      "Production znači: radi za stvarne korisnike.",
      "Build sprema aplikaciju za produkciju.",
      "Monitoring i logovi govore šta se dešava kada nisi tu.",
    ],
    say: "Nemoj prihvatiti ‘radi kod mene’ kao završetak. Traži javni URL, uspešan deployment, osnovni test i log/monitoring signal.",
  },
  {
    time: "03:40–03:55",
    title: "Debugging i sigurnost",
    goal: "Da polaznik ume mirno da pronađe gde je problem i da zna osnovna security pravila.",
    analogy: "Debugging je detektivski posao. Kada nema struje, ne rušiš kuću — proveravaš sijalicu, osigurač, kabl i račun.",
    points: [
      "Ne menjaš pet stvari odjednom.",
      "Gledaš input, log, status, permission, output.",
      "API key je kao ključ od kancelarije — ne ide javno u kod.",
      "Agentu ne daješ write dozvole bez razloga i approval-a.",
    ],
    say: "Najbolji netehnički operator AI sistema nije onaj koji zna sve komande, nego onaj koji zna da pita: gde je dokaz, gde je log, koji sloj je pukao i šta agent sme da uradi.",
  },
  {
    time: "03:55–04:00",
    title: "Završni model: kako sve spajamo",
    goal: "Da polaznik ode sa jednom jasnom slikom celog sistema.",
    analogy: "Kao mala fabrika: ideja ulazi, agent planira, alati izvršavaju, GitHub pamti kod, n8n povezuje korake, deployment stavlja u izlog, a logovi dokazuju šta se desilo.",
    points: [
      "Brief → agent → alat → GitHub/n8n/API → deployment → dokaz.",
      "Ne moraš sve znati duboko da bi vodio proces.",
      "Moraš znati šta je cilj, šta je dozvoljeno i kako se proverava rezultat.",
    ],
    say: "Ako polaznik može običnim jezikom da objasni agent, GitHub, API, webhook, n8n, MCP i deployment — kurs je uspeo.",
  },
];

const githubTerms = [
  ["Repository", "Folder projekta na GitHub-u."],
  ["Commit", "Snimak stanja projekta u jednom trenutku."],
  ["Push", "Pošalji moje promene na GitHub server."],
  ["Pull", "Povuci najnovije promene sa servera kod sebe."],
  ["Branch", "Probna kopija da ne polomiš glavni projekat."],
  ["Pull Request", "Zahtev da neko pregleda i spoji promenu."],
];

export default function FourHourAcademyCourse() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div>
          <p className={styles.kicker}>AI ACADEMY · PREZENTACIJA</p>
          <h1>4-satni kurs za netehničke ljude</h1>
          <p className={styles.lead}>
            Prosto objašnjenje AI agenata, GitHub-a, API-ja, webhook-a, n8n-a, MCP-a, deployment-a, debugging-a i sigurnosti.
            Bez kvizova. Bez dubokog programiranja. Sa analogijama koje ljudi mogu odmah da razumeju.
          </p>
          <div className={styles.heroActions}>
            <a href="#agenda">Agenda</a>
            <a href="#slides">Slajdovi / sekcije</a>
            <a href="#github">GitHub analogija</a>
          </div>
        </div>
        <aside className={styles.dossier}>
          <span>FORMAT</span>
          <b>4 sata</b>
          <p>14 sekcija · predavački ritam · bez quiz gating-a</p>
          <hr />
          <span>CILJ</span>
          <p>Da netehnička osoba može da vodi AI projekat, razume šta agent radi i zna kako da traži dokaz.</p>
        </aside>
      </section>

      <section id="agenda" className={styles.agenda}>
        <div className={styles.sectionIntro}>
          <p className={styles.kicker}>AGENDA</p>
          <h2>Ritam za 4 sata predavanja</h2>
        </div>
        <div className={styles.timeline}>
          {sections.map((section, index) => (
            <article key={section.title}>
              <time>{section.time}</time>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h3>{section.title}</h3>
                <p>{section.goal}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="github" className={styles.githubBox}>
        <p className={styles.kicker}>POSEBNA ANALOGIJA</p>
        <h2>GitHub kao server koji čuva kod i pamti istoriju</h2>
        <p>
          Najprostije: GitHub je online skladište. Kod radiš kod sebe, ali kada uradiš <b>push</b>, šalješ novu verziju u to skladište.
          GitHub pamti šta je promenjeno, kada i u kojoj verziji. Ako nešto pukne, istorija pomaže da vidiš gde se promena desila.
        </p>
        <div className={styles.termGrid}>
          {githubTerms.map(([term, explanation]) => (
            <div key={term}>
              <b>{term}</b>
              <span>{explanation}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="slides" className={styles.slides}>
        <div className={styles.sectionIntro}>
          <p className={styles.kicker}>PREZENTACIJA</p>
          <h2>Sekcija po sekcija</h2>
          <p>Svaka sekcija ima cilj, analogiju, tačke za slajd i tekst koji predavač može da kaže jednostavnim jezikom.</p>
        </div>
        {sections.map((section, index) => (
          <article key={section.title} className={styles.slideCard}>
            <header>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <time>{section.time}</time>
            </header>
            <h2>{section.title}</h2>
            <p className={styles.goal}>{section.goal}</p>
            <div className={styles.slideGrid}>
              <div>
                <h3>Šta objasniti</h3>
                <ul>
                  {section.points.map((point) => <li key={point}>{point}</li>)}
                </ul>
              </div>
              <div>
                <h3>Analogija</h3>
                <p>{section.analogy}</p>
              </div>
              <div className={styles.sayBox}>
                <h3>Kako reći pred grupom</h3>
                <p>{section.say}</p>
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
