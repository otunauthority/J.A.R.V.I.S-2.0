# J.A.R.V.I.S. — Cinematic Holographic Interface

A production-ready, single-page web clone of Tony Stark’s AI assistant **J.A.R.V.I.S.** from the Iron Man / MCU films.

Deep navy backgrounds, electric cyan glows, holographic panels, scanlines, particle effects, voice interaction, and a witty British personality — now with expanded knowledge for writing, coding, life advice, ideas, directions, weather, time, and more.

## Features

- **Cinematic boot sequence** with progress and system messages
- **Full-screen immersive UI** — top status bar, left/right diagnostic panels, central holographic core
- **Central “eye”** with rotating rings, scan effect, and ambient particles
- **Voice input** via Web Speech API (click mic or press **Space**)
- **Text command console** with formal / witty Jarvis responses + optional TTS
- **Expanded knowledge modules**:
  - Writing & storytelling tips
  - Coding, debugging & software craft
  - Life advice & personal wisdom
  - Creative ideas & brainstorming prompts
  - Directions & navigation tips
  - Weather, time & date
  - Motivation, productivity, tech hygiene
  - Humor, philosophy, systems status
- **Live simulated metrics** — CPU, power, network, Arc Reactor, data stream
- **Animated network activity chart** (Canvas)
- **Draggable floating cards** — Weather, Schedule, Quick Actions (with Writing / Coding / Advice / Ideas)
- **Local media library** — grant folder access (File System Access API / directory picker), browse audio & video, play with on-screen controls or voice (`open media folder`, `play music`, `play video`, `stop`, `next`)
- **Easter eggs**: “What is the meaning of life?”, “Are you there?”, “Play music”, jokes, farewells, etc.
- **Responsive** (desktop-first, graceful mobile collapse)
- Pure **HTML + CSS + Vanilla JS** — no build step required

## Project media folder

Place audio in `media/audio/` and video in `media/video/`, then list filenames in `media/manifest.json`. JARVIS loads them on startup — no folder picker required. You can still use **open media folder** for other directories.

## File Structure

```
jarvis-ui/
├── index.html
├── styles.css
├── script.js
├── README.md
├── NOTES.md
└── media/
    ├── manifest.json   # list your filenames here
    ├── audio/          # .mp3 .wav .ogg .m4a ...
    └── video/          # .mp4 .webm .mov ...
```

## How to Run Locally

1. Open the folder in a terminal.
2. Serve with any static server (recommended for Speech API / microphone):

   ```bash
   # Python 3
   python -m http.server 8080

   # or Node (if you have npx)
   npx serve .
   ```

3. Open **http://localhost:8080** in Chrome, Edge, or Safari.

> **Note:** The Web Speech API (microphone) requires a secure context (HTTPS or localhost). Opening the HTML file directly via `file://` will disable voice input in most browsers. Text commands still work.

## Browser Support

| Feature              | Chrome | Edge | Firefox | Safari |
|----------------------|--------|------|---------|--------|
| Visuals & animations | ✅     | ✅   | ✅      | ✅     |
| Text commands       | ✅     | ✅   | ✅      | ✅     |
| Voice recognition    | ✅     | ✅   | ⚠️*    | ✅     |
| Speech synthesis     | ✅     | ✅   | ✅      | ✅     |

\*Firefox requires `media.webspeech.recognition.enable` flag.

## Controls

| Action                    | How                                      |
|---------------------------|------------------------------------------|
| Speak to Jarvis           | Click mic button **or** press **Space**  |
| Type a command            | Enter text in the bottom console + Enter |
| Drag floating cards       | Click and drag the card body             |
| Close a card              | Click the × on the card header           |
| Quick actions             | Use buttons on the Quick Actions card    |

### Example Commands

**Systems**
- `Status report`
- `Power levels`
- `Run diagnostics`
- `Secure mode`

**Everyday**
- `What's the weather?`
- `What time is it?`
- `What's today's date?`
- `Open media folder` / `Play music` / `Play video` / `Stop media` / `Next` / `Pause`
- `Are you there?`
- `Help`

**Writing & creative**
- `Writing tips`
- `Help me with storytelling`
- `Give me an idea`
- `I'm stuck / writer's block`
- `Creative prompt`

**Coding**
- `Coding help`
- `How do I debug?`
- `Best practices for code`
- `Git tips`

**Life & productivity**
- `Life advice`
- `Motivation`
- `Productivity tips`
- `How should I prioritise?`
- `I'm procrastinating`

**Navigation**
- `Directions`
- `Navigation tips`
- `I'm lost`

**Other**
- `What is the meaning of life?`
- `Tell me a joke`
- `Who are you?`
- `Thank you` / `Goodbye`

## Customisation Tips

- **Colours** — Edit CSS custom properties in `:root` (`styles.css`).
- **Personality** — Expand the `responses` object and matching rules in `script.js`.
- **Boot messages** — Edit the `bootMessages` array.
- **Voice** — TTS prefers British English voices when available; change `recognition.lang` and voice selection logic if desired.
- **Quick actions** — Add more `data-cmd` buttons in the Quick Actions card in `index.html`.

## Deployment

Any static host works:

- Netlify / Vercel / Cloudflare Pages — drop the folder or connect the repo
- GitHub Pages
- Classic Apache / Nginx

No environment variables or backend required.

---

*“Sometimes you gotta run before you can walk.”* — Tony Stark
