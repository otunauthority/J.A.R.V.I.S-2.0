# J.A.R.V.I.S. — Questions & Commands Note

You are addressed as **Epidexios** (sometimes Sir / Master Epidexios).

**Category · Example triggers · What you get**

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
| Battery | check battery | Level if API allows |
| Storage | show storage | Browser storage estimate |
| Open site | open YouTube, open Google | New tab |
| Status / power / diagnostics | status report, power levels, run diagnostics | System replies |
| Secure | secure mode | Lockdown reply |
| Hands-free | hands-free mode / hands-free off | Continuous voice on/off |

---

## Media (select any file + play)

| Category | Example triggers / action | What you get |
|----------|---------------------------|--------------|
| **Select files** | Button **Select files**, or say `select files` / `pick files` | File picker — choose any audio/video |
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

## UI controls (still available)

| Action | How |
|--------|-----|
| Type | Bottom console + Enter |
| Voice | Mic button, dock Voice, or Space |
| Mobile menu | Dock **Menu** — grouped command buttons |
| Media card | Select files / Open folder / filter / tap track |
| Now Playing | Play, pause, next, prev, stop, seek |

*(The top chip bar — Hello, Time, Date, etc. — has been removed.)*

---

## How to run

```bash
python -m http.server 8080
```

Open `http://localhost:8080` or your GitHub Pages HTTPS URL.

---

*J.A.R.V.I.S. · Epidexios*
