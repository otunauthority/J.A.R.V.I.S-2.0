# J.A.R.V.I.S. — Questions & Commands Note

Built for **Otun Authority**. You are addressed as **Epidexios** (sometimes Sir / Master Epidexios).

**Category · Example triggers · What you get**

---

## Holographic reports (Iron Man style)

| Category | Example triggers | What you get |
|----------|------------------|--------------|
| **Status hologram** | status report, status, systems | Full holographic status panel — integrity, device power, CPU, network, threat level, voice mode |
| **Power hologram** | power levels, power, reactor, energy, check battery | Amber energy matrix. Uses **live battery %** when the browser allows it; on most phones the Battery API is blocked for privacy — still shows the matrix with a clear “estimated / API blocked” note |
| **Diagnostics hologram** | run diagnostics, diagnostics, system scan | System integrity scan with pass/fail rows and meters |
| **Secure hologram** | secure mode, lockdown | Red defensive posture panel |
| **Combat mode** | combat mode, engage combat, combat protocol, weapons hot, battle mode | Full tactical HUD — spinning radar, targeting reticle, weapons status, threat board |
| **Suit report** | suit report, armour report, armor report, suit scan, suit status, mark suit, deploy suit, initiate suit | Full Iron Man–style armour schematic with scanning beam, lit suit parts, and sequential subsystem checklist |

**Close a hologram** with **×**, backdrop click, **Escape**, or by voice:  
`close hologram` · `dismiss report` · `close report` · `hide panel` · `clear hologram`

Panels auto-dismiss after ~14–22 seconds (suit report lasts longer).

---

## Greetings & identity

| Category | Example triggers | What you get |
|----------|------------------|--------------|
| Hello | hello, hey | Greeting |
| Hi | hi | Short greeting |
| Good morning | good morning | Morning greeting |
| Good afternoon | good afternoon | Afternoon greeting |
| Good evening | good evening | Evening greeting |
| How are you? | how are you | Status + offer to help |
| Name | what's your name, who are you | JARVIS introduction |
| Creator | who made you | Origin reply |
| Capabilities | what can you do, help | What JARVIS can do |
| Human? | are you human | AI identity |
| Help me | can you help me | Affirmation |
| How you work | how do you work | Module explanation |
| Learning | can you learn | Session limits |
| Internet | are you connected to the internet | Online behaviour |
| Privacy | are my conversations private | Privacy notes |
| Presence | are you there | Online confirmation |
| Thanks | thank you | Acknowledgment |
| Bye | goodbye, good night | Sign-off |

---

## Time & calendar

| Category | Example triggers | What you get |
|----------|------------------|--------------|
| Time | what time is it | Live time |
| Date | what's today's date | Full date |
| Day | what day is today | Weekday |
| Month | what month is this | Month + year |
| Year | what year is it | Year |
| Days left | how many days left this year | Days remaining |
| Weekend | is today a weekend | Yes/no |

---

## Calculator

| Category | Example triggers | What you get |
|----------|------------------|--------------|
| Math | calculate 12+5*3, what is 100/4 | Numeric result |

---

## Knowledge

| Category | Example triggers | What you get |
|----------|------------------|--------------|
| Nigeria | who is the president of Nigeria | Built-in answer |
| Ghana | capital of Ghana | Accra |
| Computer | who invented the computer | History summary |
| AI | what is AI, what does AI mean | Definition |
| HTML | what is HTML, write HTML | Definition / template |
| CSS | explain CSS | Definition |
| JavaScript | what is JavaScript | Definition |
| Python | explain Python | Definition |
| React / Git / SQL | what is React, explain Git, explain SQL | Definitions |
| Science | photosynthesis, gravity, water cycle | Explanations |
| Civics / math / grammar | democracy, algebra, noun | Definitions |

---

## Health

| Category | Example triggers | What you get |
|----------|------------------|--------------|
| Water | how much water should I drink | Guidance |
| Headache | what causes headaches | Common causes |
| Fever | what is a fever | Definition |
| Sleep | how many hours should I sleep | 7–9 hours typical |
| Breakfast | healthy breakfast ideas | Food ideas |

---

## Faith, quotes & language

| Category | Example triggers | What you get |
|----------|------------------|--------------|
| Bible | give me a Bible verse | Verse |
| Quote | today's quote | Quote |
| Meaning | meaning of X, define X | Dictionary-style entry |
| Synonym | synonym of happy | Synonyms |
| Antonym | antonym of rich | Antonyms |
| Spell | spell accommodation | Spelling |

---

## Writing & ideas

| Category | Example triggers | What you get |
|----------|------------------|--------------|
| Letter | write a letter, letter template | Letter templates |
| Email | write an email, email template | Email templates |
| Summarise | summarize | Tips |
| Grammar | improve grammar | Tips |
| Ideas | generate ideas | Idea lists |
| Coding tips | coding help, debug | Advice |
| Life advice | life advice, motivate me | Advice |

---

## System tools

| Category | Example triggers | What you get |
|----------|------------------|--------------|
| Password | generate a password | Random password |
| Battery | check battery, battery level | Real % + **power hologram** |
| Storage | show storage | Browser storage estimate |
| Open site | open YouTube, open Google | New tab |
| Status | status report, status, systems | Spoken reply **+ status hologram** |
| Power | power levels, power, reactor, energy | Spoken reply **+ power hologram** (real battery when available) |
| Diagnostics | run diagnostics, diagnostics, system scan | Spoken reply **+ diagnostics hologram** |
| Suit report | suit report, armour report, suit scan, mark suit, deploy suit | Spoken reply **+ Iron Man suit schematic hologram** |
| Combat mode | combat mode, engage combat, combat protocol, weapons hot, battle mode | Spoken reply **+ tactical combat HUD** (radar, weapons, threat board) |
| Secure | secure mode, lockdown | Spoken reply **+ secure/red hologram** |
| Close hologram | close hologram, dismiss report, close report, hide panel, clear hologram | Dismisses any open holographic panel |
| Show panel (mobile) | show schedule, show weather, show actions, show media, show diagnostics, show data system, show modules, show network, show all | Summons that UI sheet over ambient mode |
| Hide panel (mobile) | hide schedule, hide weather, hide modules, hide all, ambient mode, minimal mode | Dismisses sheets; ambient core-only view |
| Hands-free | hands-free mode / hands-free off | Continuous voice on/off |

---

## Media (select any file + play)

| Category | Example triggers / action | What you get |
|----------|---------------------------|--------------|
| **Select files** | Button **Select files**, dock **Media**, or say `select files` / `pick files` / `load media` | File picker — any audio/video on device |
| **Open folder** | Button **Open folder**, or `open media folder` | Folder of media files |
| **Project media** | Files in `media/audio` & `media/video` + `manifest.json` | Auto-loaded on startup |
| **Click to play** | Tap a file in the Media Library list | Plays that file |
| **Play music / video** | `play music`, `play video` | First audio or video |
| **Play by number** | `play track 1`, `play track 3` | That item in the list |
| **Play by name** | `play songname` | Match by filename |
| **Shuffle** | `shuffle`, `play random` | Random file |
| **Pause / resume** | `pause`, `resume` | Control playback |
| **Next / previous** | `next`, `previous` | Skip |
| **Stop** | `stop media`, `stop` | Stop |
| **Volume** | `volume up`, `volume 50`, `mute` | Volume |

Supported types: mp3, wav, ogg, m4a, aac, flac, mp4, webm, mov, mkv (browser-dependent).

---

## UI controls

| Action | How |
|--------|-----|
| Type | Bottom console + Enter |
| Voice | Mic button, dock Voice, **V** key, or **Space** (desktop) |
| Close hologram | × · backdrop · Escape · voice (`close hologram`, `dismiss report`, `hide panel`) |
| Mobile menu | Dock **Menu** — grouped command buttons |
| Media card | Select files / Open folder / filter / tap track |
| Now Playing | Play, pause, next, prev, stop, seek |
| **Holograms** | status · power · diagnostics · **suit report** · **combat mode** · secure — close with ×, backdrop, Escape, or voice |
| **Mobile panels** | `show schedule` · `show weather` · `show media` · `show modules` · `show data system` · `hide all` (ambient) |

---

## Mobile

- **Ambient mode by default** — only top status bar, holographic core animation, command bar, and bottom dock. No floating cards or side panels until you summon them.
- Bottom **dock**: Status · Media · Voice · Menu · Help  
- Slide-up **command menu** with grouped shortcuts  
- Holograms scale to the screen; decorative rings hide on small displays for performance  
- Soft UI tones when a hologram opens (Web Audio)  

### Show / hide panels (mobile)

| Command | Result |
|---------|--------|
| `show schedule` / `show calendar` / `show agenda` | Schedule card |
| `show weather` / `show forecast` | Weather card |
| `show actions` / `show quick actions` | Quick Actions card |
| `show media` / `show media library` | Media Library card |
| `show now playing` | Now Playing card |
| `show diagnostics` / `show data stream` / `show data system` | System diagnostics + data stream panel |
| `show modules` / `show network` / `show network activity` | Modules + network activity panel |
| `show all` / `show everything` / `show full ui` | All panels and cards |
| `hide schedule` / `hide calendar` | Hide schedule |
| `hide weather` | Hide weather |
| `hide actions` / `hide quick actions` | Hide quick actions |
| `hide media` | Hide media library |
| `hide now playing` | Hide now playing |
| `hide diagnostics` / `hide data stream` / `hide data system` | Hide diagnostics panel |
| `hide modules` / `hide network` | Hide modules / network panel |
| `hide all` / `hide panels` / `hide cards` / `ambient mode` / `minimal mode` | Clear everything — pure core animation |

One card or side panel at a time (a new **show** replaces the previous sheet of the same type). Desktop keeps the full layout always visible.

---

## How to run

```bash
python -m http.server 8080
```

Open `http://localhost:8080` or your GitHub Pages HTTPS URL.

> Microphone and Battery Status API work best on **HTTPS** or **localhost** in Chrome / Edge.

---

*J.A.R.V.I.S. · Epidexios*
