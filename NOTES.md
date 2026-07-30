# J.A.R.V.I.S. — Command Reference Note

Address: mostly **Epidexios** (also Sir / Master Epidexios).

Format: **Category** · **Example triggers** · **What you get**

---

## Greetings & identity

| Category | Example triggers | What you get |
|----------|------------------|--------------|
| Hello | hello, hey | Greeting + readiness |
| Hi | hi | Short greeting |
| Good morning | good morning | Morning greeting |
| Good afternoon | good afternoon | Afternoon greeting |
| Good evening | good evening | Evening greeting |
| How are you? | how are you, how's it going | Status + offer to help |
| What's your name? | what's your name, who are you | JARVIS introduction |
| Who made you? | who made you, who built you | Creator / origin reply |
| What can you do? | what can you do, help | Capability overview |
| Are you human? | are you human, are you a robot | Clear AI identity |
| Can you help me? | can you help, I need help | Affirmation + invite request |
| How do you work? | how do you work | Explanation of modules |
| Can you learn? | can you learn | Session vs permanent learning |
| Internet? | are you connected to the internet | Online / offline behaviour |
| Privacy? | are my conversations private | Browser-local privacy notes |
| Presence | are you there, still there | Online confirmation |
| Thanks | thank you, thanks | Acknowledgment |
| Farewell | goodbye, bye, good night | Sign-off |

---

## Time & calendar

| Category | Example triggers | What you get |
|----------|------------------|--------------|
| Time | what time is it, current time | Live clock (en-GB) |
| Date | what's today's date, what is the date | Full date |
| Day | what day is today, day of the week | Weekday name |
| Month | what month is this | Current month + year |
| Year | what year is it | Current year |
| Days left | how many days left this year | Approx. days remaining |
| Weekend? | is today a weekend | Yes/no + weekday |

---

## Calculator

| Category | Example triggers | What you get |
|----------|------------------|--------------|
| Calculate | calculate 12 + 5 * 3, what is 100/4, 8*7 | Numeric result |

---

## Knowledge & education

| Category | Example triggers | What you get |
|----------|------------------|--------------|
| Nigeria president | who is the president of Nigeria | Built-in knowledge answer |
| Ghana capital | capital of Ghana | Accra |
| Computer history | who invented the computer | Multi-contributor summary |
| AI | what is AI, what does AI mean | Definition |
| HTML | what is HTML, write HTML | Definition or basic template |
| CSS | explain CSS, what is CSS | Definition + example |
| JavaScript | what is JavaScript, explain JS | Definition |
| Python | what is Python, explain Python | Definition + example |
| React | what is React | Definition |
| Git | what is Git, explain Git | Definition |
| SQL | explain SQL | Definition |
| Photosynthesis | explain photosynthesis | Science explanation |
| Gravity | what is gravity | Science explanation |
| Water cycle | explain the water cycle | Cycle stages |
| Democracy | what is democracy | Civic definition |
| Algebra | explain algebra | Math definition |
| Noun | what is a noun | Grammar definition |

---

## Health

| Category | Example triggers | What you get |
|----------|------------------|--------------|
| Water | how much water should I drink | General fluid guidance |
| Headache | what causes headaches | Common causes + caution |
| Fever | what is a fever | Definition + when to seek care |
| Sleep | how many hours should I sleep | Adult sleep range |
| Breakfast | healthy breakfast ideas | Practical food ideas |

---

## Faith, quotes & language

| Category | Example triggers | What you get |
|----------|------------------|--------------|
| Bible verse | give me a Bible verse, scripture | Rotating verse |
| Quote | today's quote, give me a quote | Inspirational quote |
| Meaning | meaning of AI, what does gravity mean, define noun | Dictionary-style entry |
| Synonym | synonym of happy | List of synonyms |
| Antonym | antonym of rich | List of antonyms |
| Spelling | spell accommodation | Correct spelling |

---

## Writing & ideas

| Category | Example triggers | What you get |
|----------|------------------|--------------|
| Letter | write a letter, letter template, job letter | Letter templates (formal, job, complaint, school, friendship) |
| Email | write an email, email template, follow up email | Email templates (formal, follow-up, meeting, thanks, resignation, intro) |
| Summarise | summarize, summarise | How to summarise / tips |
| Grammar | improve grammar, grammar help | Practical grammar tips |
| Ideas | generate ideas, brainstorm | Creative / product idea sets |
| Writing tips | writing tips, essay help | Structure & clarity advice |
| Coding tips | coding help, debug, python help | Software craft advice |
| Life advice | life advice, motivate me, productivity | Personal / focus guidance |

---

## System tools

| Category | Example triggers | What you get |
|----------|------------------|--------------|
| Password | generate a password, password 20 | Random strong password |
| Battery | check battery, battery level | % + charging (if browser allows) |
| Storage | show storage, storage status | Origin usage / quota estimate |
| Open site | open YouTube, open Google, open GitHub, open Gmail | New browser tab |
| Status | status report, systems | JARVIS systems narrative |
| Power | power levels, arc reactor | Power narrative |
| Diagnostics | run diagnostics | Diagnostics narrative |
| Secure | secure mode, lockdown | Lockdown narrative |

---

## Local media library

| Category | Example triggers | What you get |
|----------|------------------|--------------|
| Project folder | (automatic) | Loads `media/manifest.json` + `media/audio` + `media/video` |
| Open folder | open media folder | System folder picker |
| List | list tracks, what's in the library | Numbered file list |
| Play music / video | play music, play video | First matching file |
| Play by number / name | play track 1, play songname | Specific file |
| Shuffle | shuffle, play random | Random file |
| Pause / resume | pause, resume | Playback control |
| Next / previous | next, previous, skip | Skip tracks |
| Stop | stop media, stop | Stop playback |
| Volume | volume up, volume 50, mute | Volume control |

---

## Voice automation

| Category | Example triggers | What you get |
|----------|------------------|--------------|
| Hands-free on | hands-free mode, continuous listening | Continuous mic listening |
| Hands-free off | hands-free off, stop listening | Push-to-talk only |
| Push-to-talk | Mic button or Space | One-shot listen |
| Show / hide UI | show media, show weather, hide all cards | Card visibility |

---

## Mobile use

- Side diagnostic panels hide on narrow screens; centre core + command bar stay usable.
- Command input, mic, and speech bubble are prioritised.
- Floating cards scale down; media library remains reachable via commands (`show media`, `list tracks`).
- Use **Chrome or Edge** over **HTTPS** or **localhost** for microphone access.

---

## How to run

```bash
python -m http.server 8080
```

Open `http://localhost:8080` (or your GitHub Pages HTTPS URL).

Project media:

```
media/manifest.json
media/audio/   ← your files
media/video/
```

---

*J.A.R.V.I.S. — Just A Rather Very Intelligent System · Epidexios*
