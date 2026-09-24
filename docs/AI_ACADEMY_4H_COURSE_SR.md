# AI Academy — 4-satni kurs na srpskom

Ovo je prezentacioni kurs za netehničke ljude. Nema kvizova. Cilj je da polaznik razume mentalne modele, analogije i praktičan redosled rada.

Ruta u aplikaciji: `/ai-academy/4h-kurs`

## Princip

- Ne objašnjavati preduboko.
- Koristiti prost srpski.
- Svaku tehničku stvar objasniti kroz analogiju.
- Stalno ponavljati: **tvrdnja nije dokaz**.
- AI agent nije magija: to je model + kontekst + alati + dozvole + provera.

## Agenda 4 sata

| Vreme | Sekcija | Cilj |
|---|---|---|
| 00:00–00:10 | Uvod | Objasniti šta učimo i šta ne učimo. |
| 00:10–00:30 | Digitalna osnova | Lokalno, server, browser, produkcija. |
| 00:30–00:55 | AI agent bez magije | Agent kao radnik sa ciljem, kontekstom i alatima. |
| 00:55–01:20 | Dobar brief | Kako dati zadatak agentu. |
| 01:20–01:50 | GitHub | Repository, commit, push, pull, branch, PR. |
| 01:50–02:00 | Pauza | 10 minuta. |
| 02:00–02:20 | API | API kao konobar između sistema. |
| 02:20–02:35 | Webhook | Webhook kao zvono kada se događaj desi. |
| 02:35–02:55 | n8n | Automatizacija kao tabla sa koracima. |
| 02:55–03:10 | MCP i dozvole | MCP kao univerzalni adapter; read/write/approval. |
| 03:10–03:25 | Voice agenti | Govor → tekst → namera → alat → glas. |
| 03:25–03:40 | Deployment | Iz radionice u javni izlog. |
| 03:40–03:55 | Debugging i sigurnost | Detektivski proces + osnovne granice. |
| 03:55–04:00 | Završni model | Kako se sve spaja u jedan workflow. |

## Ključne analogije

### GitHub

GitHub je kao neki server tamo negde koji čuva tvoj kod. Ti radiš lokalno na svom računaru. Kada uradiš `push`, šalješ novu verziju na GitHub. On pamti šta je promenjeno, kada i u kojoj verziji.

- Repository = folder projekta na GitHub-u.
- Commit = snimak stanja projekta.
- Push = pošalji moje promene na server.
- Pull = povuci najnoviju verziju sa servera.
- Branch = probna kopija.
- Pull Request = zahtev da neko pregleda i spoji promene.

### API

API je kao konobar. Ne ulaziš u kuhinju restorana. Kažeš konobaru šta želiš; on odnese zahtev kuhinji i vrati odgovor.

### Webhook

Webhook je zvono. Ne proveravaš stalno da li se nešto desilo; sistem ti javi kada se događaj desi.

### n8n

n8n je kao LEGO tabla ili sistem cevi. Jedan node primi podatak, drugi ga obradi, treći ga pošalje dalje.

### MCP

MCP je kao univerzalni adapter. Ne pravi struju, nego omogućava da se agent i alat spoje na dogovoren način.

### Deployment

Deployment je iznošenje proizvoda iz radionice u izlog. Ako radi kod tebe, to još nije javno. Mora da radi na javnom URL-u.

### Debugging

Debugging je detektivski posao. Kada nema struje, ne rušiš celu kuću. Proveriš sijalicu, osigurač, kabl i račun.

## Standard uspeha

Polaznik na kraju treba da ume da objasni:

1. Šta je AI agent.
2. Kako dati dobar brief.
3. Šta GitHub radi sa kodom.
4. Šta su API i webhook.
5. Zašto n8n spaja korake.
6. Šta MCP rešava.
7. Zašto read i write dozvole nisu isto.
8. Šta znači deployment.
9. Kako dokazujemo da je nešto stvarno završeno.

Jedna završna rečenica kursa:

> AI sistem je dobar tek kada znamo šta mu je cilj, šta sme da koristi, šta je uradio i kako dokazujemo rezultat.
