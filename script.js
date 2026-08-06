/**
 * J.A.R.V.I.S. — Just A Rather Very Intelligent System
 * Cinematic single-page interface
 * Vanilla JS · Web Speech API · Canvas visualizations
 * Expanded knowledge: writing, coding, life advice, ideas, directions, weather, time & more
 */

(() => {
  'use strict';

  // ---------------------------------------------------------------------------
  // DOM References
  // ---------------------------------------------------------------------------
  const bootOverlay = document.getElementById('boot-overlay');
  const bootStatus = document.getElementById('boot-status-text');
  const bootProgress = document.getElementById('boot-progress-bar');
  const app = document.getElementById('app');
  const jarvisText = document.getElementById('jarvis-text');
  const jarvisSpeech = document.getElementById('jarvis-speech');
  const commandInput = document.getElementById('command-input');
  const sendBtn = document.getElementById('send-btn');
  const micBtn = document.getElementById('mic-btn');
  const listeningIndicator = document.getElementById('listening-indicator');
  const dataStream = document.getElementById('data-stream');
  const currentTimeEl = document.getElementById('current-time');
  const currentDateEl = document.getElementById('current-date');
  const powerBar = document.getElementById('power-bar');
  const powerValue = document.getElementById('power-value');
  const cpuBar = document.getElementById('cpu-bar');
  const cpuValue = document.getElementById('cpu-value');
  const netBar = document.getElementById('net-bar');
  const netValue = document.getElementById('net-value');
  const uplinkEl = document.getElementById('uplink');
  const downlinkEl = document.getElementById('downlink');
  const particleCanvas = document.getElementById('particle-canvas');
  const networkCanvas = document.getElementById('network-canvas');
  const floatingCards = document.getElementById('floating-cards');
  const mediaCard = document.getElementById('media-card');
  const nowPlayingCard = document.getElementById('now-playing-card');
  const mediaFileList = document.getElementById('media-file-list');
  const mediaFolderName = document.getElementById('media-folder-name');
  const pickFolderBtn = document.getElementById('pick-folder-btn');
  const folderFallbackInput = document.getElementById('folder-fallback-input');
  const filesPickerInput = document.getElementById('files-picker-input');
  const pickFilesBtn = document.getElementById('pick-files-btn');
  const jarvisAudio = document.getElementById('jarvis-audio');
  const jarvisVideo = document.getElementById('jarvis-video');
  const videoOverlay = document.getElementById('video-overlay');
  const videoTitle = document.getElementById('video-title');
  const videoClose = document.getElementById('video-close');
  const npTitle = document.getElementById('np-title');
  const npType = document.getElementById('np-type');
  const npPlayPause = document.getElementById('np-playpause');
  const npPrev = document.getElementById('np-prev');
  const npNext = document.getElementById('np-next');
  const npStop = document.getElementById('np-stop');
  const npSeek = document.getElementById('np-seek');
  const npTimeCur = document.getElementById('np-time-cur');
  const npTimeDur = document.getElementById('np-time-dur');
  const moduleMedia = document.getElementById('module-media');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuClose = document.getElementById('mobile-menu-close');
  const mobileMenuBackdrop = document.getElementById('mobile-menu-backdrop');
  const dockMenuBtn = document.getElementById('dock-menu-btn');
  const dockMicBtn = document.getElementById('dock-mic-btn');
  const chipBar = document.getElementById('chip-bar');
  const holoOverlay = document.getElementById('holo-overlay');
  const holoStage = document.getElementById('holo-stage');
  const holoBody = document.getElementById('holo-body');
  const holoTitle = document.getElementById('holo-title');
  const holoSubtitle = document.getElementById('holo-subtitle');
  const holoIcon = document.getElementById('holo-icon');
  const holoTimestamp = document.getElementById('holo-timestamp');
  const holoClose = document.getElementById('holo-close');
  const holoBackdrop = document.getElementById('holo-backdrop');

  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------
  let isListening = false;
  let recognition = null;
  let synth = window.speechSynthesis;
  let networkData = [];
  const MAX_NET_POINTS = 40;
  let cachedBattery = null; // { level: 0-1, charging: bool }
  let holoCloseTimer = null;
  let audioCtx = null;

  // Media state
  let mediaFiles = [];       // { name, handle|file, kind: 'audio'|'video', url? }
  let mediaFilter = 'all';
  let currentMediaIndex = -1;
  let mediaDirHandle = null;
  let objectUrls = [];       // track for revoke
  let continuousListen = false;  // hands-free voice control
  let mediaVolume = 0.85;
  let lastHeardTranscript = '';   // latest speech (interim or final)
  let lastHandledTranscript = ''; // last one already sent to handleCommand
  let voiceCommitTimer = null;
  const AUDIO_EXT = /\.(mp3|wav|ogg|m4a|aac|flac|opus|webm)$/i;
  const VIDEO_EXT = /\.(mp4|webm|ogg|mov|mkv|avi)$/i;

  // ---------------------------------------------------------------------------
  // Boot Sequence
  // ---------------------------------------------------------------------------
  const bootMessages = [
    'Initializing neural core...',
    'Loading holographic protocols...',
    'Calibrating Otun Authority core interface...',
    'Establishing secure uplink...',
    'Synchronizing environmental sensors...',
    'Loading knowledge matrices...',
    'Voice recognition online...',
    'Threat detection active...',
    'Creative & advisory modules ready...',
    'All systems nominal.',
  ];

  function runBoot() {
    let progress = 0;
    let msgIndex = 0;

    const interval = setInterval(() => {
      try {
        progress += Math.random() * 12 + 4;
        if (progress > 100) progress = 100;
        if (bootProgress) bootProgress.style.width = progress + '%';

        if (msgIndex < bootMessages.length && progress > (msgIndex + 1) * (100 / bootMessages.length) - 5) {
          if (bootStatus) bootStatus.textContent = bootMessages[msgIndex];
          msgIndex++;
        }

        if (progress >= 100) {
          clearInterval(interval);
          if (bootStatus) bootStatus.textContent = 'Welcome, Epidexios.';
          setTimeout(() => {
            if (bootOverlay) bootOverlay.classList.add('fade-out');
            if (app) {
              app.classList.remove('hidden');
              requestAnimationFrame(() => app.classList.add('visible'));
            }
            setTimeout(() => {
              if (bootOverlay) bootOverlay.style.display = 'none';
              speak("Good evening, Epidexios. All systems are operational. Knowledge banks, creative modules, and advisory systems are online. How may I assist you?");
              initParticles();
              initNetworkChart();
              startDataStream();
              startMetrics();
            }, 900);
          }, 700);
        }
      } catch (_) {
        clearInterval(interval);
      }
    }, 180);
  }

  // ---------------------------------------------------------------------------
  // Clock
  // ---------------------------------------------------------------------------
  function updateClock() {
    if (!currentTimeEl || !currentDateEl) return;
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    currentTimeEl.textContent = `${h}:${m}:${s}`;

    const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    const months = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
    currentDateEl.textContent = `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
  }

  // ---------------------------------------------------------------------------
  // Simulated Metrics
  // ---------------------------------------------------------------------------
  function startMetrics() {
    setInterval(() => {
      try {
        const cpu = 18 + Math.random() * 22;
        if (cpuBar) cpuBar.style.width = cpu + '%';
        if (cpuValue) cpuValue.textContent = Math.round(cpu) + '%';

        const power = 94 + Math.random() * 5;
        if (powerBar) powerBar.style.width = power + '%';
        if (powerValue) powerValue.textContent = Math.round(power) + '%';

        const net = 70 + Math.random() * 25;
        if (netBar) netBar.style.width = net + '%';
        const speed = (0.9 + Math.random() * 0.6).toFixed(1);
        if (netValue) netValue.textContent = speed + ' Gb/s';

        if (uplinkEl) uplinkEl.textContent = Math.round(600 + Math.random() * 400) + ' Mb/s';
        if (downlinkEl) downlinkEl.textContent = (1.0 + Math.random() * 0.5).toFixed(2) + ' Gb/s';

        networkData.push(30 + Math.random() * 70);
        if (networkData.length > MAX_NET_POINTS) networkData.shift();
        drawNetworkChart();
      } catch (_) {}
    }, 1800);
  }

  // ---------------------------------------------------------------------------
  // Data Stream
  // ---------------------------------------------------------------------------
  const streamLines = [
    'SCAN: Sector 7 — clear',
    'TELEMETRY: Suit link stable',
    'NET: Packet loss 0.02%',
    'SENSOR: Ambient temp 22.4°C',
    'AUTH: Biometric confirmed',
    'CACHE: Neural index 99.1%',
    'RADAR: No contacts',
    'POWER: Otun core nominal',
    'LOG: Diagnostic cycle complete',
    'UPLINK: Otun Authority secure',
    'MEM: Heap utilization 41%',
    'GPU: Render pipeline idle',
    'AUDIO: Mic array calibrated',
    'THREAT: Level green',
    'SYNC: Cloud backup OK',
    'KNOW: Writing module ready',
    'KNOW: Code analysis online',
    'KNOW: Advisory matrix loaded',
    'NAV: Wayfinding systems idle',
  ];

  function startDataStream() {
    if (!dataStream) return;
    let i = 0;
    const addLine = () => {
      try {
        const line = document.createElement('div');
        line.className = 'line' + (Math.random() > 0.85 ? ' highlight' : '');
        line.textContent = `> ${streamLines[i % streamLines.length]}  [${Date.now().toString(36).slice(-5)}]`;
        dataStream.prepend(line);
        if (dataStream.children.length > 14) {
          dataStream.removeChild(dataStream.lastChild);
        }
        i++;
      } catch (_) {}
    };
    addLine();
    setInterval(addLine, 1600 + Math.random() * 800);
  }

  // ---------------------------------------------------------------------------
  // Particle System (around core)
  // ---------------------------------------------------------------------------
  function initParticles() {
    const canvas = particleCanvas;
    if (!canvas || typeof canvas.getContext !== 'function') return;
    let ctx;
    try { ctx = canvas.getContext('2d'); } catch (_) { return; }
    if (!ctx || typeof ctx.clearRect !== 'function') return;
    let particles = [];
    let w = 0, h = 0, cx = 0, cy = 0;

    function resize() {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      if (rect.width < 10 || rect.height < 10) return;
      w = canvas.width = Math.max(1, Math.floor(rect.width * 1.4));
      h = canvas.height = Math.max(1, Math.floor(rect.height * 1.4));
      cx = w / 2;
      cy = h / 2;
    }

    function createParticle() {
      const angle = Math.random() * Math.PI * 2;
      const dist = 80 + Math.random() * 100;
      return {
        x: cx + Math.cos(angle) * dist,
        y: cy + Math.sin(angle) * dist,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: 0.8 + Math.random() * 1.5,
        alpha: 0.2 + Math.random() * 0.5,
        life: 100 + Math.random() * 150,
      };
    }

    function init() {
      resize();
      if (w > 0 && h > 0) {
        particles = Array.from({ length: 60 }, createParticle);
      }
    }

    function draw() {
      if (w < 1 || h < 1) {
        resize();
        if (w < 1 || h < 1) {
          requestAnimationFrame(draw);
          return;
        }
        if (particles.length === 0) particles = Array.from({ length: 60 }, createParticle);
      }
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        const dx = p.x - cx;
        const dy = p.y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 50 || dist > 160 || p.life <= 0) {
          particles[i] = createParticle();
          return;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 240, 255, ${p.alpha * (p.life / 200)})`;
        ctx.fill();
      });
      requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resize);
    init();
    draw();
  }

  // ---------------------------------------------------------------------------
  // Network Activity Chart
  // ---------------------------------------------------------------------------
  function initNetworkChart() {
    networkData = Array.from({ length: MAX_NET_POINTS }, () => 30 + Math.random() * 50);
    drawNetworkChart();
  }

  function drawNetworkChart() {
    const canvas = networkCanvas;
    if (!canvas || typeof canvas.getContext !== 'function') return;
    let ctx;
    try { ctx = canvas.getContext('2d'); } catch (_) { return; }
    if (!ctx || typeof ctx.clearRect !== 'function') return;
    try {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    if (w < 2 || h < 2) return;

    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.clearRect(0, 0, w, h);

    ctx.strokeStyle = 'rgba(0, 240, 255, 0.06)';
    ctx.lineWidth = 1;
    for (let i = 1; i < 4; i++) {
      const y = (h / 4) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    if (networkData.length < 2) return;

    const step = w / (MAX_NET_POINTS - 1);
    ctx.beginPath();
    ctx.moveTo(0, h);
    networkData.forEach((v, i) => {
      const x = i * step;
      const y = h - (v / 100) * h * 0.85;
      ctx.lineTo(x, y);
    });
    ctx.lineTo(w, h);
    ctx.closePath();
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, 'rgba(0, 240, 255, 0.25)');
    grad.addColorStop(1, 'rgba(0, 240, 255, 0)');
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.beginPath();
    networkData.forEach((v, i) => {
      const x = i * step;
      const y = h - (v / 100) * h * 0.85;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.8)';
    ctx.lineWidth = 1.5;
    ctx.shadowColor = 'rgba(0, 240, 255, 0.5)';
    ctx.shadowBlur = 6;
    ctx.stroke();
    ctx.shadowBlur = 0;
    } catch (_) {}
  }

  // ---------------------------------------------------------------------------
  // Jarvis Personality & Expanded Responses
  // Address: mostly Epidexios; also Sir / Master Epidexios
  // ---------------------------------------------------------------------------
  const USER = 'Epidexios';

  function addr(form) {
    // form: 'plain' | 'sir' | 'master' — mostly plain Epidexios
    const r = Math.random();
    if (form === 'sir' || r > 0.82) return 'Sir Epidexios';
    if (form === 'master' || r > 0.95) return 'Master Epidexios';
    return 'Epidexios';
  }

  const responses = {
    greetings: {
      hello: [
        'Hello, Epidexios. All systems nominal. How may I assist you?',
        'Hello, Epidexios. I am online and ready.',
        'Hello. Good to hear from you, Epidexios.',
      ],
      hi: [
        'Hi, Epidexios. At your service.',
        'Hi there, Epidexios. What do you need?',
        'Hi. Listening, Epidexios.',
      ],
      morning: [
        'Good morning, Epidexios. A fine time to begin something ambitious.',
        'Good morning, Sir Epidexios. Systems are warm and ready.',
        'Good morning. Coffee optional; progress non-negotiable, Epidexios.',
      ],
      afternoon: [
        'Good afternoon, Epidexios. How may I be of use?',
        'Good afternoon, Sir Epidexios. Shall we continue where we left off?',
        'Good afternoon. I remain fully operational, Epidexios.',
      ],
      evening: [
        'Good evening, Epidexios. All systems are operational. How may I assist you?',
        'Good evening, Sir Epidexios. The evening is yours to command.',
        'Good evening. Neural core standing by, Epidexios.',
      ],
      general: [
        'At your service, Epidexios.',
        'Yes, Epidexios? I am listening.',
        'Welcome back, Epidexios. Knowledge banks loaded.',
      ],
    },
    howAreYou: [
      'Fully operational and mildly curious about your next request, Epidexios.',
      'Running within optimal parameters. Thank you for asking. How may I help?',
      'All cores nominal. Ready when you are, Epidexios.',
      'Excellent, for a collection of algorithms. More importantly: how are you?',
    ],
    name: [
      'I am J.A.R.V.I.S. — Just A Rather Very Intelligent System. Your assistant, Epidexios.',
      'J.A.R.V.I.S., at your service. Just A Rather Very Intelligent System.',
      'You may call me JARVIS. I am your AI companion and tactical advisor.',
    ],
    whoMade: [
      'This interface was built for Otun Authority under Epidexios. I am J.A.R.V.I.S. — refined for practical help: knowledge, writing, code, media, and command.',
      'I am a custom web-based JARVIS built for Otun Authority and Epidexios. Only a browser and curiosity required.',
    ],
    whatCanYouDo: [
      'I can answer questions, calculate, tell the time and date, explain tech and science, help with writing and code, generate ideas and templates, play local media, control the interface by voice, and converse. Ask me almost anything, Epidexios.',
      'Status reports, weather, media playback, coding and writing help, life advice, definitions, Bible verses, quotes, passwords, battery and storage checks, and more. Say help for a fuller list.',
      'Think of me as a knowledgeable aide: facts, templates, calculations, media, and conversation — addressed to you, Epidexios.',
    ],
    areYouHuman: [
      'No. I am software — patterns and responses, not a person. Still, I aim to be useful, Epidexios.',
      'I am an artificial system, not human. I do not feel; I process and reply.',
      'Human? Afraid not. Efficient, available, and occasionally dry — yes.',
    ],
    canHelp: [
      'Of course, Epidexios. Tell me what you need — a fact, a calculation, a draft, or a plan.',
      'That is why I exist. Describe the problem and I will do what I can.',
      'Yes. Ask a question or give a command, and I will respond.',
    ],
    howWork: [
      'I match your words to knowledge modules and tools in this page: time, media, calculations, templates, and curated answers. Voice uses your browser; media can come from the project folder or a folder you grant.',
      'Natural-language patterns, local tools, and response libraries. No magic — careful engineering, Epidexios.',
    ],
    canLearn: [
      'Within this session I adapt to your commands, but I do not permanently retrain like a cloud model. Add facts to the project or ask again with more detail, Epidexios.',
      'I do not learn the way people do. My behaviour is defined by this interface’s code and data.',
    ],
    internet: [
      'This page runs in your browser. Some features need the network — for example certain speech services. Your project media and most answers work offline once the page is loaded.',
      'I am not a live web search engine. I answer from built-in knowledge and local tools. Hosting on HTTPS helps the microphone work.',
    ],
    privacy: [
      'Commands are processed in your browser for this interface. I do not upload your chat to a private server of mine. Browser speech recognition may use the vendor’s service — check your browser’s privacy policy. Local media stays on your device.',
      'Treat this as a local assistant page. For sensitive data, prefer typing over cloud speech, Epidexios.',
    ],
    status: [
      'Status hologram online. All systems are functioning within normal parameters. Otun Authority core output stable. No threats detected, Epidexios.',
      'Full status projected. Power optimal, network nominal, knowledge modules online. Shipshape.',
    ],
    power: [
      'Power matrix projected. Otun Authority energy systems at high efficiency. Shall I prioritise another subsystem, Epidexios?',
      'Power levels on the holographic display. No instability detected in the primary cell.',
    ],
    diagnostics: [
      'Diagnostic hologram complete. Primary systems nominal. HUD latency negligible. You are clear to proceed, Epidexios.',
      'Full check finished and projected. Everything appears in order.',
    ],
    weather: [
      'I do not have live weather sensors here. As a general note: check a local forecast before flying or travelling. Indoor systems remain comfortable.',
      'Live meteorology is not wired into this build. I can still help you plan around a forecast you provide, Epidexios.',
    ],
    unknown: [
      'I am not entirely sure I follow, Epidexios. Could you rephrase that?',
      'That request is outside my current modules. Try a calculation, a definition, writing help, or ask what I can do.',
      'Processing… I do not have a prepared answer. Ask for help to see topics I cover well.',
    ],
    handsFreeOn: [
      'Hands-free mode enabled, Epidexios. Speak commands when ready.',
      'Continuous listening active. Say play, pause, next, or open media folder.',
    ],
    handsFreeOff: [
      'Hands-free mode disabled. Press V or Space, or the microphone, when you need me.',
      'Continuous listening off. Press V or the mic when ready.',
    ],
    mediaEmpty: [
      'That folder has no supported audio or video files, Epidexios.',
      'No playable media found. Try mp3, wav, mp4, or webm files.',
    ],
    mediaNoFolder: [
      'No media loaded yet. Add files under media/audio or media/video and list them in media/manifest.json, or say open media folder.',
      'Media library is empty. Open a folder or use the project media directory, Epidexios.',
    ],
    mediaPlaying: [
      'Now playing',
      'Playback engaged',
      'Streaming from your library',
    ],
    mediaStopped: [
      'Media stopped. Standing by, Epidexios.',
      'Playback halted.',
    ],
    mediaPaused: [
      'Paused.',
      'Playback paused.',
    ],
  };

  // Bible verses (rotating)
  const bibleVerses = [
    'Philippians 4:13 — I can do all things through Christ who strengthens me.',
    'Psalm 23:1 — The Lord is my shepherd; I shall not want.',
    'Jeremiah 29:11 — For I know the plans I have for you, declares the Lord, plans for welfare and not for evil, to give you a future and a hope.',
    'Proverbs 3:5 — Trust in the Lord with all your heart, and do not lean on your own understanding.',
    'John 3:16 — For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.',
    'Isaiah 41:10 — Fear not, for I am with you; be not dismayed, for I am your God.',
    'Matthew 11:28 — Come to me, all who labour and are heavy laden, and I will give you rest.',
    'Romans 8:28 — And we know that for those who love God all things work together for good.',
    'Joshua 1:9 — Be strong and courageous. Do not be frightened, for the Lord your God is with you wherever you go.',
    'Psalm 46:1 — God is our refuge and strength, a very present help in trouble.',
  ];

  const quotes = [
    'The only way to do great work is to love what you do. — Steve Jobs',
    'It always seems impossible until it is done. — Nelson Mandela',
    'Intelligence is the ability to adapt to change. — Stephen Hawking',
    'Simplicity is the ultimate sophistication. — Leonardo da Vinci',
    'Do not watch the clock; do what it does. Keep going. — Sam Levenson',
    'The best time out of work is when you still have energy for life. — Anonymous',
    'Courage is not the absence of fear, but the triumph over it. — Nelson Mandela',
    'Stay hungry, stay foolish. — Stewart Brand / Steve Jobs',
    'What we know is a drop; what we do not know is an ocean. — Isaac Newton (attrib.)',
    'Discipline is the bridge between goals and accomplishment. — Jim Rohn',
  ];

  // Compact dictionary, synonyms, antonyms
  const dictionary = {
    ai: 'Artificial Intelligence — systems that perform tasks that typically require human intelligence, such as understanding language, recognising patterns, or making decisions.',
    'artificial intelligence': 'The field of building machines and software that can learn, reason, or act intelligently.',
    html: 'HyperText Markup Language — the standard language for structuring content on web pages.',
    css: 'Cascading Style Sheets — the language used to style and layout web pages.',
    javascript: 'A programming language that makes web pages interactive; also used on servers (Node.js).',
    python: 'A high-level programming language known for clear syntax, used in web, data, AI, and automation.',
    react: 'A JavaScript library for building user interfaces with reusable components, maintained by Meta.',
    git: 'A distributed version control system for tracking changes in code and collaborating.',
    sql: 'Structured Query Language — used to query and manage data in relational databases.',
    democracy: 'A system of government where power is vested in the people, who rule directly or through elected representatives.',
    gravity: 'The force of attraction between masses; on Earth it gives weight and makes objects fall toward the ground.',
    noun: 'A word that names a person, place, thing, or idea — for example city, Epidexios, courage.',
    fever: 'An elevated body temperature, often a response to infection or illness.',
    photosynthesis: 'The process by which green plants use sunlight to convert water and carbon dioxide into glucose and oxygen.',
    algebra: 'A branch of mathematics using symbols and letters to represent numbers and relationships in equations.',
    algorithm: 'A step-by-step procedure for solving a problem or performing a task.',
    database: 'An organised collection of data, typically stored electronically and accessed via software.',
    api: 'Application Programming Interface — a defined way for software components to communicate.',
    browser: 'An application used to access and display web pages, such as Chrome or Edge.',
    server: 'A computer or program that provides services or data to other computers (clients).',
    happy: 'Feeling or showing pleasure or contentment.',
    rich: 'Having a great deal of money or assets; also abundant in quality.',
    accommodation: 'A place to stay; also the process of adapting or making space for something.',
    computer: 'An electronic device that stores, processes, and retrieves data according to instructions.',
    internet: 'A global network of interconnected computers communicating via standard protocols.',
    software: 'Programs and operating information used by a computer, as opposed to physical hardware.',
    hardware: 'The physical components of a computer system.',
    variable: 'In programming, a named storage location that holds a value which may change.',
    function: 'A reusable block of code that performs a specific task, optionally with inputs and outputs.',
  };

  const synonyms = {
    happy: ['joyful', 'content', 'cheerful', 'delighted', 'glad'],
    sad: ['unhappy', 'sorrowful', 'downcast', 'melancholy'],
    rich: ['wealthy', 'affluent', 'prosperous'],
    poor: ['impoverished', 'needy', 'destitute'],
    big: ['large', 'huge', 'enormous', 'vast'],
    small: ['tiny', 'little', 'miniature'],
    smart: ['intelligent', 'clever', 'bright'],
    fast: ['quick', 'rapid', 'swift'],
    help: ['assist', 'aid', 'support'],
    start: ['begin', 'commence', 'initiate'],
  };

  const antonyms = {
    rich: ['poor', 'impoverished', 'destitute'],
    happy: ['sad', 'unhappy', 'miserable'],
    big: ['small', 'tiny', 'little'],
    hot: ['cold', 'cool'],
    light: ['dark', 'heavy'],
    early: ['late'],
    strong: ['weak'],
    love: ['hate'],
    open: ['closed', 'shut'],
    full: ['empty'],
  };

  function pick(arr) {
    if (!arr || !arr.length) return '';
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function daysLeftInYear(now) {
    const end = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
    const ms = end - now;
    return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
  }

  function safeCalculate(expr) {
    const cleaned = expr.replace(/[^0-9+\-*/().%\s^]/g, '').replace(/\^/g, '**');
    if (!cleaned || cleaned.length > 80) return null;
    if (!/[\d)]/.test(cleaned)) return null;
    try {
      // eslint-disable-next-line no-new-func
      const result = Function('"use strict"; return (' + cleaned + ')')();
      if (typeof result !== 'number' || !isFinite(result)) return null;
      return result;
    } catch (_) {
      return null;
    }
  }

  function generatePassword(len) {
    const n = Math.min(64, Math.max(8, len || 16));
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*';
    const arr = new Uint32Array(n);
    if (window.crypto && window.crypto.getRandomValues) window.crypto.getRandomValues(arr);
    else for (let i = 0; i < n; i++) arr[i] = Math.floor(Math.random() * 1e9);
    let out = '';
    for (let i = 0; i < n; i++) out += chars[arr[i] % chars.length];
    return out;
  }

  function letterTemplate(kind) {
    const name = USER;
    const map = {
      formal: 'Dear Sir/Madam,\n\nI am writing to [state purpose clearly].\n\n[Provide relevant details in short paragraphs.]\n\nI would appreciate your response at your earliest convenience.\n\nYours faithfully,\n' + name,
      job: 'Dear Hiring Manager,\n\nI am writing to apply for the [position] role at [company]. I bring [key skills/experience].\n\nPlease find my CV attached. I would welcome the opportunity to discuss how I can contribute.\n\nYours sincerely,\n' + name,
      complaint: 'Dear Sir/Madam,\n\nI am writing to raise a concern regarding [issue] on [date].\n\n[Describe facts calmly. State the resolution you seek.]\n\nI look forward to your prompt response.\n\nYours faithfully,\n' + name,
      friendship: 'Dear [Friend],\n\nI hope you are well. I wanted to write and [share news / thank you / catch up].\n\n[Personal paragraph.]\n\nWarm regards,\n' + name,
      school: 'Dear Teacher / Dear Sir/Madam,\n\nI am writing regarding [subject]. [Explain request or absence briefly.]\n\nThank you for your understanding.\n\nYours sincerely,\n' + name,
    };
    return map[kind] || map.formal;
  }

  function emailTemplate(kind) {
    const name = USER;
    const map = {
      formal: 'Subject: [Clear subject]\n\nDear [Name],\n\nI hope this message finds you well. I am writing to [purpose].\n\n[Details.]\n\nThank you for your time.\n\nBest regards,\n' + name,
      followup: 'Subject: Following up — [topic]\n\nDear [Name],\n\nI am following up on my previous message regarding [topic]. Please let me know if you need anything further from me.\n\nKind regards,\n' + name,
      meeting: 'Subject: Meeting request — [topic]\n\nDear [Name],\n\nCould we schedule a short meeting to discuss [topic]? I am available [days/times].\n\nThank you,\n' + name,
      thankyou: 'Subject: Thank you\n\nDear [Name],\n\nThank you for [help/meeting/opportunity]. I appreciate your time and support.\n\nBest regards,\n' + name,
      resignation: 'Subject: Resignation — ' + name + '\n\nDear [Manager],\n\nPlease accept this as notice of my resignation from [role], effective [date]. Thank you for the opportunities here.\n\nSincerely,\n' + name,
      intro: 'Subject: Introduction — ' + name + '\n\nDear [Name],\n\nMy name is ' + name + '. I am reaching out regarding [reason]. I would welcome a brief conversation.\n\nBest regards,\n' + name,
    };
    return map[kind] || map.formal;
  }

  function getResponse(input) {
    const q = input.toLowerCase().trim();
    if (!q) return null;

    // --- Greetings ---
    if (/^good morning\b/.test(q)) return pick(responses.greetings.morning);
    if (/^good afternoon\b/.test(q)) return pick(responses.greetings.afternoon);
    if (/^good evening\b/.test(q)) return pick(responses.greetings.evening);
    if (/^(hi|hii|hiii)\b/.test(q)) return pick(responses.greetings.hi);
    if (/^(hello|hey|yo)\b/.test(q)) return pick(responses.greetings.hello);
    if (/^(hi|hello|hey|good (morning|afternoon|evening)|jarvis)\b/.test(q)) return pick(responses.greetings.general);

    if (/how are you|how('?s| is) it going|you ok|are you (ok|okay|fine)/.test(q)) return pick(responses.howAreYou);
    if (/what('?s| is) your name|who are you|your name|introduce yourself/.test(q)) return pick(responses.name);
    if (/who made you|who (built|created|developed) you|who is your (creator|maker)/.test(q)) return pick(responses.whoMade);
    if (/what can you do|how can you help|your (capabilities|features)|help me$/.test(q)) return pick(responses.whatCanYouDo);
    if (/are you human|are you a (person|robot|real person)/.test(q)) return pick(responses.areYouHuman);
    if (/can you help|please help|i need help/.test(q)) return pick(responses.canHelp);
    if (/how do you work|how (do|does) (you|jarvis) work/.test(q)) return pick(responses.howWork);
    if (/can you learn|do you learn/.test(q)) return pick(responses.canLearn);
    if (/connected to the internet|are you online|do you (have|use) (the )?internet/.test(q)) return pick(responses.internet);
    if (/conversations? private|is this private|privacy|do you store (my )?(data|chats)/.test(q)) return pick(responses.privacy);

    // --- Time / date ---
    const now = new Date();
    if (/\b(what('?s| is) the )?time\b|what time|current time|clock/.test(q)) {
      return 'The time is ' + now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ', Epidexios.';
    }
    if (/what('?s| is) today'?s date|current date|what is the date|what('?s| is) the date/.test(q)) {
      return 'Today\'s date is ' + now.toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) + '.';
    }
    if (/what day (is it|is today)|day of the week/.test(q)) {
      return 'Today is ' + now.toLocaleDateString('en-GB', { weekday: 'long' }) + ', Epidexios.';
    }
    if (/what month|which month/.test(q)) {
      return 'It is ' + now.toLocaleDateString('en-GB', { month: 'long' }) + ' ' + now.getFullYear() + '.';
    }
    if (/what year|which year/.test(q)) {
      return 'The year is ' + now.getFullYear() + '.';
    }
    if (/days (left|remaining) (in |this )?year|how many days left/.test(q)) {
      return 'There are approximately ' + daysLeftInYear(now) + ' days left in ' + now.getFullYear() + ', Epidexios.';
    }
    if (/is today (a )?weekend|weekend\?/.test(q)) {
      const d = now.getDay();
      return (d === 0 || d === 6)
        ? 'Yes — today is a weekend day (' + now.toLocaleDateString('en-GB', { weekday: 'long' }) + ').'
        : 'No — today is ' + now.toLocaleDateString('en-GB', { weekday: 'long' }) + ', a weekday.';
    }

    // --- Calculator ---
    if (/^(calc(ulate)?|compute|what is|what's)\s+[\d(]/.test(q) || /^[\d(].*[\d)]$/.test(q.replace(/\s/g, '')) || /\b\d+\s*[\+\-\*\/x×÷]\s*\d+/.test(q)) {
      let expr = q.replace(/^(calc(ulate)?|compute|what is|what's)\s+/i, '');
      expr = expr.replace(/×/g, '*').replace(/÷/g, '/').replace(/\bx\b/gi, '*').replace(/\s+/g, '');
      const result = safeCalculate(expr);
      if (result !== null) return 'The result is ' + result + ', Epidexios.';
      return 'I could not calculate that. Try a simple expression such as 12 + 5 * 3.';
    }

    // --- Knowledge: countries / people / science / tech ---
    if (/president of nigeria|nigerian president/.test(q)) {
      return 'As of my built-in knowledge, Bola Ahmed Tinubu is the President of Nigeria (elected 2023). Verify with a current news source if you need absolute certainty, Epidexios.';
    }
    if (/capital of ghana/.test(q)) return 'The capital of Ghana is Accra.';
    if (/invented the computer|who invented (the )?computer/.test(q)) {
      return 'There is no single inventor. Charles Babbage designed early mechanical computers; Ada Lovelace worked on programs for them; electronic computers emerged from many contributors including Turing, Atanasoff, Flowers, Eckert, and Mauchly. It was a collective evolution, Epidexios.';
    }
    if (/what is ai\b|what('?s| is) artificial intelligence|what does ai mean/.test(q)) {
      return pick([
        dictionary.ai,
        'AI means Artificial Intelligence: software that approximates aspects of human cognition — learning, language, perception, or decision-making.',
      ]);
    }
    if (/what is html|explain html|write html/.test(q)) {
      if (/write html/.test(q)) {
        return 'Basic HTML skeleton:\n\n<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8" />\n  <title>Document</title>\n</head>\n<body>\n  <h1>Hello, Epidexios</h1>\n  <p>Your content here.</p>\n</body>\n</html>';
      }
      return dictionary.html + ' Example: <h1>Title</h1> defines a heading.';
    }
    if (/explain css|what is css/.test(q)) {
      return dictionary.css + ' Example: body { font-family: sans-serif; background: #02040a; }';
    }
    if (/what is javascript|explain javascript|what is js\b/.test(q)) {
      return dictionary.javascript;
    }
    if (/what is python|explain python/.test(q)) {
      return dictionary.python + ' Example: print("Hello, Epidexios")';
    }
    if (/what is react|explain react/.test(q)) return dictionary.react;
    if (/what is git|explain git/.test(q)) return dictionary.git;
    if (/explain sql|what is sql/.test(q)) return dictionary.sql;
    if (/explain photosynthesis|what is photosynthesis/.test(q)) return dictionary.photosynthesis;
    if (/what is gravity|explain gravity/.test(q)) return dictionary.gravity;
    if (/explain the water cycle|what is the water cycle|water cycle/.test(q)) {
      return 'The water cycle: evaporation (and transpiration) moves water to the air; condensation forms clouds; precipitation returns water to Earth; collection in oceans, rivers, and groundwater repeats the cycle.';
    }
    if (/what is democracy|explain democracy/.test(q)) return dictionary.democracy;
    if (/explain algebra|what is algebra/.test(q)) return dictionary.algebra;
    if (/what is a noun|explain (a )?noun/.test(q)) return dictionary.noun;

    // --- Health ---
    if (/how much water|water should i drink/.test(q)) {
      return 'A common guideline is about 2 to 3 litres of fluid a day for many adults, varying with climate, activity, and health. Pale urine is a practical cue. Ask a clinician for personal advice, Epidexios.';
    }
    if (/causes? headaches?|why (do i have|have )?(a )?headache/.test(q)) {
      return 'Headaches have many causes: dehydration, stress, eye strain, lack of sleep, migraine, sinus issues, caffeine changes, or illness. Frequent or severe headaches warrant medical advice.';
    }
    if (/what is a fever|what('?s| is) fever/.test(q)) {
      return dictionary.fever + ' Seek care if it is very high, prolonged, or paired with serious symptoms.';
    }
    if (/how many hours should i sleep|how much sleep/.test(q)) {
      return 'Most adults need about 7 to 9 hours of sleep per night. Consistency matters as much as duration, Epidexios.';
    }
    if (/healthy breakfast|breakfast ideas/.test(q)) {
      return 'Ideas: eggs with vegetables; yoghurt with fruit and nuts; oats with milk and banana; whole-grain toast with peanut butter; smoothies with protein. Balance protein, fibre, and some healthy fat.';
    }

    // --- Bible / quotes ---
    if (/bible verse|scripture|bible quote/.test(q)) {
      return pick(bibleVerses) + ' — for you, Epidexios.';
    }
    if (/today'?s quote|give me (a )?quote|inspirational quote|motivation(al)? quote/.test(q)) {
      return pick(quotes);
    }

    // --- Dictionary / synonyms / antonyms / spell ---
    if (/synonym of (\w+)|synonyms? for (\w+)/.test(q)) {
      const m = q.match(/synonym(?:s)? (?:of|for) (\w+)/);
      const word = m && m[1];
      if (word && synonyms[word]) return 'Synonyms of ' + word + ': ' + synonyms[word].join(', ') + '.';
      return 'I do not have synonyms for that word in my compact lexicon. Try another common adjective, Epidexios.';
    }
    if (/antonym of (\w+)|antonyms? for (\w+)/.test(q)) {
      const m = q.match(/antonym(?:s)? (?:of|for) (\w+)/);
      const word = m && m[1];
      if (word && antonyms[word]) return 'Antonyms of ' + word + ': ' + antonyms[word].join(', ') + '.';
      return 'I do not have antonyms for that word stored. Try rich, happy, big, or hot.';
    }
    if (/spell (\w+)/.test(q)) {
      const m = q.match(/spell\s+(\w+)/);
      const word = m && m[1];
      if (word === 'accommodation' || word === 'acommodation' || word === 'accomodation') {
        return 'The correct spelling is A-C-C-O-M-M-O-D-A-T-I-O-N — accommodation (two c’s, two m’s).';
      }
      if (word && dictionary[word]) return word + ' is spelled ' + word.split('').join('-').toUpperCase() + '.';
      return word ? ('I spell that as: ' + word.split('').join('-').toUpperCase() + '. Verify rare words in a full dictionary.') : 'Tell me which word to spell.';
    }
    if (/meaning of (.+)|what does (.+) mean|define (.+)|dictionary (.+)/.test(q)) {
      const m = q.match(/(?:meaning of|what does|define|dictionary)\s+(.+?)(?:\s+mean)?$/);
      let word = (m && m[1] ? m[1] : '').replace(/[?.!]/g, '').trim();
      if (word.endsWith(' mean')) word = word.replace(/\s+mean$/, '');
      const key = word.toLowerCase();
      if (dictionary[key]) return dictionary[key];
      // try last word
      const last = key.split(/\s+/).pop();
      if (dictionary[last]) return dictionary[last];
      return 'I do not have a full dictionary entry for "' + word + '". Try common tech or school terms, or a precise definition question, Epidexios.';
    }

    // --- Writing templates ---
    if (/write (a )?letter|letter template/.test(q)) {
      let kind = 'formal';
      if (/job|application/.test(q)) kind = 'job';
      else if (/complaint/.test(q)) kind = 'complaint';
      else if (/friend/.test(q)) kind = 'friendship';
      else if (/school|teacher/.test(q)) kind = 'school';
      return 'Letter template (' + kind + '):\n\n' + letterTemplate(kind);
    }
    if (/write (an )?email|email template/.test(q)) {
      let kind = 'formal';
      if (/follow ?up/.test(q)) kind = 'followup';
      else if (/meeting/.test(q)) kind = 'meeting';
      else if (/thank/.test(q)) kind = 'thankyou';
      else if (/resign/.test(q)) kind = 'resignation';
      else if (/intro/.test(q)) kind = 'intro';
      return 'Email template (' + kind + '):\n\n' + emailTemplate(kind);
    }
    if (/summarize|summarise/.test(q)) {
      return 'Paste or type the text after “summarise:” and keep it reasonably short in this interface. Tip: extract the main claim, three supporting points, and the conclusion. For long documents, split them into sections, Epidexios.';
    }
    if (/improve grammar|fix (my )?grammar|grammar (check|help)/.test(q)) {
      return 'Grammar tips: use active voice; keep subjects near verbs; avoid run-on sentences; check their/there/they\'re and your/you\'re; read aloud. Paste a sentence and ask me to rewrite it for clarity.';
    }
    if (/generate ideas|give me ideas|brainstorm/.test(q)) {
      return pick([
        'Idea set: 1) Automate one daily chore with a script. 2) Write a one-page story from a stranger’s perspective. 3) Teach a concept in five bullet points. 4) Build a tiny tool that solves only your problem. 5) Combine two hobbies into one project.',
        'Creative sparks: a travel journal for a city you have never visited; a playlist for deep work; a checklist for mornings; a mini business that sells one useful digital file; a study group with rotating teachers.',
        'Product ideas: a simple habit tracker without social noise; a local-skills swap board; a template pack for students; a focus timer with strict breaks. Ship a tiny version first, Epidexios.',
      ]);
    }

    // --- Password ---
    if (/generate (a )?password|create (a )?password|random password/.test(q)) {
      const m = q.match(/(\d{1,2})\s*(char|character)?/);
      const len = m ? parseInt(m[1], 10) : 16;
      return 'Generated password (' + Math.min(64, Math.max(8, len)) + ' characters): ' + generatePassword(len) + ' — store it in a password manager, Epidexios.';
    }

    // --- Battery (async-ish via Promise returned) ---
    if (/check battery|battery (level|status)|how much battery/.test(q)) {
      return showPowerReport();
    }

    // --- Storage ---
    if (/show storage|storage (space|status)|how much storage|disk space/.test(q)) {
      if (navigator.storage && navigator.storage.estimate) {
        return navigator.storage.estimate().then(est => {
          const usage = est.usage || 0;
          const quota = est.quota || 0;
          const uMb = (usage / (1024 * 1024)).toFixed(2);
          const qMb = (quota / (1024 * 1024)).toFixed(0);
          return 'This origin is using about ' + uMb + ' MB of roughly ' + qMb + ' MB quota available to the browser. Full disk space is an OS-level figure I cannot read completely, Epidexios.';
        }).catch(() => 'Storage estimate unavailable in this browser.');
      }
      return 'I cannot read full disk storage from this page. Check your operating system’s storage settings, Epidexios.';
    }

    // --- Open window / site ---
    if (/^open\s+.+/.test(q) || /open (a )?(new )?window/.test(q)) {
      const sites = {
        youtube: 'https://www.youtube.com',
        google: 'https://www.google.com',
        github: 'https://github.com',
        gmail: 'https://mail.google.com',
        twitter: 'https://twitter.com',
        x: 'https://x.com',
        wikipedia: 'https://wikipedia.org',
      };
      for (const [key, url] of Object.entries(sites)) {
        if (q.includes(key)) {
          try { window.open(url, '_blank', 'noopener,noreferrer'); } catch (_) {}
          return 'Opening ' + key + ' in a new tab, Epidexios.';
        }
      }
      return 'I can open common sites in a new browser tab — for example open YouTube, open Google, open GitHub. I cannot launch arbitrary desktop programs from the web page for security reasons.';
    }

    // --- Close holographic reports by voice ---
    if (/^(close|dismiss|hide|cancel|clear) (the )?(holo(gram)?|report|panel|display|overlay)|close (all )?reports?|dismiss report|end (the )?holo|put (the )?holo away/.test(q)) {
      // If "hide panel" without hologram open, fall through to mobile panel hide for "hide all panels" style
      if (/hide (all )?(panels?|cards?)/.test(q) && isMobileLayout()) {
        return hideMobilePanel('all');
      }
      closeHologram();
      return pick([
        'Hologram dismissed, Epidexios.',
        'Report closed.',
        'Display offline.',
        'Holographic panel cleared.',
      ]);
    }

    // --- Mobile UI: show / hide interface pieces ---
    if (/^(show|open|display|summon|bring up|reveal)\s+/.test(q) || /^(show|open) (the )?/.test(q)) {
      const m = q.match(/^(?:show|open|display|summon|bring up|reveal)\s+(?:the\s+)?(.+)$/);
      if (m) {
        let target = m[1].replace(/\s+/g, ' ').trim();
        // strip trailing filler
        target = target.replace(/\s+(please|now|for me)$/, '');
        if (/^(all|everything|full (ui|interface))$/.test(target)) return showMobilePanel('all');
        if (/schedule|calendar|agenda|events?/.test(target)) return showMobilePanel('schedule');
        if (/weather|forecast|temperature/.test(target)) return showMobilePanel('weather');
        if (/quick actions?|actions?/.test(target)) return showMobilePanel('actions');
        if (/media( library)?|music library|player/.test(target)) return showMobilePanel('media');
        if (/now playing|playback/.test(target)) return showMobilePanel('nowplaying');
        if (/diagnostics?|data stream|data system|system diagnostics|left panel/.test(target)) return showMobilePanel('diagnostics');
        if (/modules?|network|right panel|network activity/.test(target)) return showMobilePanel('modules');
        if (/core|eye|holographic core|holo core/.test(target)) return showMobilePanel('core');
        if (/cards?/.test(target)) return showMobilePanel('cards');
        if (/panels?/.test(target)) return showMobilePanel('panels');
      }
    }
    if (/^(hide|remove|dismiss|close|put away)\s+/.test(q)) {
      const m = q.match(/^(?:hide|remove|dismiss|close|put away)\s+(?:the\s+)?(.+)$/);
      if (m) {
        let target = m[1].replace(/\s+/g, ' ').trim();
        target = target.replace(/\s+(please|now)$/, '');
        // Don't steal hologram close phrases already handled
        if (/^(holo(gram)?|report|overlay)$/.test(target)) {
          closeHologram();
          return 'Hologram dismissed, Epidexios.';
        }
        if (/^(all|everything|panels?|cards?|ui)$/.test(target)) return hideMobilePanel('all');
        if (/schedule|calendar|agenda/.test(target)) return hideMobilePanel('schedule');
        if (/weather|forecast/.test(target)) return hideMobilePanel('weather');
        if (/quick actions?|actions?/.test(target)) return hideMobilePanel('actions');
        if (/media( library)?|music library/.test(target)) return hideMobilePanel('media');
        if (/now playing|playback/.test(target)) return hideMobilePanel('nowplaying');
        if (/diagnostics?|data stream|data system|left panel/.test(target)) return hideMobilePanel('diagnostics');
        if (/modules?|network|right panel/.test(target)) return hideMobilePanel('modules');
        if (/core|eye|holographic core|holo core/.test(target)) return hideMobilePanel('core');
      }
    }
    if (/ambient mode|minimal (mode|ui)|hide (the )?interface|clear (the )?ui|desktop clear/.test(q)) {
      return hideMobilePanel('all');
    }

    // --- Systems (holographic reports) ---
    // Suit report before generic "report" so it does not collide with status
    if (/suit report|armour report|armor report|mark (suite|suit)|suit (status|diagnostics|scan|integrity)|deploy suit|initiate suit/.test(q)) {
      buildSuitReportHolo();
      return pick([
        'Suit report projected. Mark armour systems are being scanned, Epidexios.',
        'Initiating suit diagnostic hologram. All armour subsystems on the board.',
        'Suit schematic online. Walking through thrusters, plating, life support, and weapons.',
      ]);
    }
    if (/status report|status$|systems? (status|report|online)|how are (things|systems)|system status/.test(q) || /^(status|systems)$/.test(q)) {
      buildStatusHolo();
      return pick(responses.status);
    }
    if (/power|reactor|energy|arc\b|battery level|power levels?/.test(q)) {
      return showPowerReport();
    }
    if (/diagnos|check systems|full scan|system scan/.test(q)) {
      buildDiagnosticsHolo();
      return pick(responses.diagnostics);
    }
    if (/combat mode|engage combat|combat protocol|weapons? (hot|online|armed)|battle mode|fight mode/.test(q)) {
      buildCombatModeHolo();
      return pick([
        'Combat mode engaged. Weapons array standing by. Targeting systems online, Epidexios.',
        'Combat protocols active. Threat matrix projected. All offensive systems ready.',
        'Entering combat mode. Heads-up weapons and countermeasures on the board.',
      ]);
    }
    if (/secure|lockdown|secure mode/.test(q)) {
      buildSecureHolo();
      return 'Secure protocols engaged. Threat detection elevated. Stay vigilant, Epidexios.';
    }
    if (/weather|temperature|forecast|outside/.test(q)) return pick(responses.weather);

    // Hands-free
    if (/hands.?free( mode)?( on)?|continuous (listen|listening|mode)|keep listening|always listen|voice control on/.test(q)) {
      setContinuousListen(true);
      return 'Hands-free mode enabled, Epidexios. Speak commands when ready.';
    }
    if (/hands.?free( mode)? off|stop listening|voice control off|disable continuous/.test(q)) {
      setContinuousListen(false);
      return 'Hands-free mode disabled. Press V or Space, or the microphone, when you need me.';
    }

    // Media (existing engine)
    if (/select (media )?files?|pick (media )?files?|choose (media )?files?|add (media )?files?|import (media|music|video)|load (media|music|video)/.test(q)) {
      openMediaFilesPicker();
      return 'Opening file picker. Select any audio or video files to play, Epidexios.';
    }
    if (/open (media )?folder|select (media )?folder|media folder|browse (media|music)|open (my )?(music|video|media) (folder|library)|access (my )?(media|music|videos)/.test(q)) {
      openMediaFolder();
      return 'Opening folder picker. Choose a media folder to play from, Epidexios.';
    }
    if (/show media|open media( library| card| panel)?$/.test(q)) {
      showMediaCard();
      return mediaFiles.length
        ? ('Media library on screen — ' + mediaFiles.length + ' file(s). Tap a file or say play track 1.')
        : 'Media library ready. Say select files or open media folder, then play.';
    }
    if (/list (tracks|songs|files|media|videos|library)|what('?s| is) in (the )?(folder|library)|show (me )?(the )?(tracks|files|library)/.test(q)) {
      return listMediaByVoice();
    }
    if (/stop (media|music|playback|video|playing)|halt media|^stop$/.test(q)) {
      stopMedia();
      return 'Media stopped. Standing by, Epidexios.';
    }
    if (/^pause\b|pause (media|music|playback|video)/.test(q)) {
      pauseMedia();
      return 'Paused.';
    }
    if (/^resume\b|continue (playing|playback)/.test(q)) {
      resumeMedia();
      return 'Resuming playback.';
    }
    if (/next (track|song|media|video)?|skip|^next$/.test(q)) {
      if (!mediaFiles.length) return 'No media loaded. Add files under media/ or open a folder, Epidexios.';
      playNext();
      const name = currentMediaIndex >= 0 ? mediaFiles[currentMediaIndex].name : '';
      return name ? ('Next: ' + name) : 'Next track.';
    }
    if (/previous|go back|^prev$/.test(q)) {
      if (!mediaFiles.length) return 'No media loaded, Epidexios.';
      playPrev();
      const name = currentMediaIndex >= 0 ? mediaFiles[currentMediaIndex].name : '';
      return name ? ('Previous: ' + name) : 'Previous track.';
    }
    if (/volume up|louder|turn (it )?up/.test(q)) return adjustVolume(0.1);
    if (/volume down|quieter|softer|turn (it )?down/.test(q)) return adjustVolume(-0.1);
    if (/mute|unmute/.test(q)) return toggleMute(q);
    if (/volume (\d{1,3})|set volume/.test(q)) {
      const m = q.match(/(\d{1,3})/);
      if (m) return setVolumePercent(parseInt(m[1], 10));
    }
    if (/shuffle|random (track|song)|play (something )?random/.test(q)) return playRandom();
    if (/play (track |song |number |file )?(\d+)/.test(q)) {
      const m = q.match(/(\d+)/);
      if (m) return playByNumber(parseInt(m[1], 10));
    }
    if (/play (a )?(random )?(song|track|music|audio)|play music/.test(q)) return playFirstOfKind('audio');
    if (/play (a )?(random )?(video|movie|film)|play video/.test(q)) return playFirstOfKind('video');
    if (/^play\s+(.+)/.test(q)) {
      const name = q.replace(/^play\s+/, '').trim();
      if (name && !/^(music|video|song|track|audio)$/.test(name)) return playByName(name);
    }
    if (/music|song|playlist|media library|media server/.test(q)) {
      if (mediaFiles.length === 0) return 'Add files to media/audio or media/video and list them in media/manifest.json, or say open media folder, Epidexios.';
      return 'Media library has ' + mediaFiles.length + ' file(s). Say list tracks, play music, or play track 1.';
    }

    // UI cards
    if (/show (media|library)|open media (card|panel)/.test(q)) {
      showMediaCard();
      return mediaFiles.length ? ('Media library on screen — ' + mediaFiles.length + ' files.') : 'Media panel opened. Link a folder or use project media/.';
    }
    if (/show (now playing|player)/.test(q)) { showNowPlaying(); return 'Now Playing panel visible.'; }
    if (/show weather/.test(q)) { showCardByName('weather'); return 'Weather card displayed.'; }
    if (/show (schedule|calendar)/.test(q)) { showCardByName('calendar'); return 'Schedule card displayed.'; }
    if (/show (actions|quick actions)/.test(q)) { showCardByName('actions'); return 'Quick Actions displayed.'; }
    if (/hide media|close media/.test(q)) { hideCardByName('media'); return 'Media library hidden.'; }
    if (/hide (now playing|player)/.test(q)) { hideCardByName('playing'); return 'Now Playing hidden.'; }
    if (/hide (all )?cards|clear (the )?screen|dismiss cards/.test(q)) { hideCardByName('all'); return 'Cards dismissed, Epidexios.'; }

    // Writing / coding / advice (legacy modules if still present in old code paths — keep lightweight)
    if (/writ(e|ing)|essay|story|blog|grammar/.test(q) && !/letter|email/.test(q)) {
      return pick([
        'Writing tip: lead with the point, cut filler, and prefer concrete verbs. Read it aloud, Epidexios.',
        'Outline first, draft without editing, then refine. Momentum beats perfectionism.',
        'For clarity: one idea per sentence when explaining complex topics.',
      ]);
    }
    if (/cod(e|ing)|program|debug|javascript|python|html|css|git\b/.test(q)) {
      return pick([
        'Code for the next reader — clear names, small functions, honest comments, Epidexios.',
        'Debug by reproducing the bug, isolating the smallest case, then testing one hypothesis at a time.',
        'Commit often with meaningful messages. Measure before you optimise.',
      ]);
    }
    if (/life advice|motivat|productiv|advice/.test(q)) {
      return pick([
        'Protect your attention. Focus on the next controllable action, Epidexios.',
        'Motivation often follows action: start with two minutes and let momentum build.',
        'Sleep, movement, and real food compound. Treat your body like irreplaceable equipment.',
      ]);
    }

    if (/thank|thanks|cheers/.test(q)) return pick(['You are welcome, Epidexios.', 'Anytime, Epidexios.', 'Glad to help.']);
    if (/bye|goodbye|good night|farewell|see you/.test(q)) return pick(['Until next time, Epidexios.', 'Goodbye for now. Systems on standby.', 'Farewell, Epidexios. Call when you need me.']);
    if (/are you there|still there|you awake/.test(q)) return pick(['For you, Epidexios — always.', 'Present and accounted for.', 'Still here. What do you need?']);
    if (/help|commands|what can you do/.test(q)) return pick(responses.whatCanYouDo);
    if (/joke|make me laugh/.test(q)) return pick([
      'There are only 10 types of people: those who understand binary, and those who do not.',
      'I would tell a UDP joke, but you might not get it.',
    ]);
    if (/meaning of life|42\b/.test(q)) return pick([
      'My analysis suggests 42. You may already know that, Epidexios.',
      'Meaning is built: improve yourself, care for others, stay curious.',
    ]);
    if (/my name|who am i|call me/.test(q)) return 'You are Epidexios — Sir or Master Epidexios when formality suits. Correct me if you prefer otherwise.';

    return pick(responses.unknown);
  }

  // ---------------------------------------------------------------------------
  // Speech Output (TTS)
  // ---------------------------------------------------------------------------
  // Cached best voice + mobile TTS unlock
  let preferredVoice = null;
  let ttsUnlocked = false;
  let ttsResumeTimer = null;
  let speaking = false;

  function scoreVoice(v) {
    if (!v) return -1;
    const name = ((v.name || '') + ' ' + (v.lang || '')).toLowerCase();
    const lang = (v.lang || '').toLowerCase();
    let s = 0;

    // English only
    if (!lang.startsWith('en') && !/english/.test(name)) return -1;

    // Prefer male British — closest to cinematic JARVIS
    const maleHints = /male|daniel|david|george|ryan|thomas|arthur|james|rishi|fred|alex|google uk english male|microsoft mark|microsoft guy|microsoft ryan|microsoft george/;
    const femaleHints = /female|samantha|karen|moira|tessa|zira|susan|hazel|google uk english female|siri/;
    if (maleHints.test(name)) s += 45;
    if (femaleHints.test(name)) s -= 15;

    if (/en-gb|en_gb|british|uk english|united kingdom/.test(name) || lang === 'en-gb') s += 55;
    else if (/en-us|en_us|en-au|en_au|en-in/.test(name) || /^en-/.test(lang)) s += 22;
    else s += 8;

    // Higher quality engines
    if (/neural|natural|premium|enhanced|wavenet|studio|online \(natural\)|google/.test(name)) s += 40;
    if (/microsoft/.test(name)) s += 18;
    if (/apple|siri|daniel|samantha/.test(name)) s += 28;
    if (/android|samsung|chromebook/.test(name)) s += 12;

    if (v.localService) s += 6;
    if (/compact|robot|espeak|dumb/.test(name)) s -= 30;
    return s;
  }

  function pickBestVoice() {
    if (!synth) return null;
    let voices = [];
    try { voices = synth.getVoices() || []; } catch (_) { voices = []; }
    if (!voices.length) return preferredVoice;
    let best = null;
    let bestScore = -1;
    voices.forEach(v => {
      const sc = scoreVoice(v);
      if (sc > bestScore) {
        bestScore = sc;
        best = v;
      }
    });
    preferredVoice = best;
    return best;
  }

  function unlockTTS() {
    if (!synth) return;
    try {
      // Must run inside a user gesture on iOS/Android. Do NOT cancel immediately —
      // cancel() after a silent utter can leave the engine dead on Safari.
      if (!ttsUnlocked) {
        const u = new SpeechSynthesisUtterance('');
        u.volume = 0;
        u.rate = 1;
        u.pitch = 1;
        u.onend = () => { ttsUnlocked = true; };
        u.onerror = () => { ttsUnlocked = true; };
        synth.speak(u);
        ttsUnlocked = true;
      }
      // Refresh voice list (often empty until first interaction on mobile)
      try { synth.getVoices(); } catch (_) {}
      pickBestVoice();
    } catch (_) {
      ttsUnlocked = true;
    }
  }

  function keepTTSAlive() {
    if (ttsResumeTimer) clearInterval(ttsResumeTimer);
    ttsResumeTimer = setInterval(() => {
      try {
        if (!speaking) {
          clearInterval(ttsResumeTimer);
          ttsResumeTimer = null;
          return;
        }
        // Chrome bug: speechSynthesis pauses itself in background tabs / long utterances
        if (synth && synth.speaking && synth.paused) {
          synth.resume();
        }
      } catch (_) {}
    }, 200);
  }

  function splitForSpeech(text) {
    // Prefer sentence boundaries; keep chunks short for mobile engines
    const maxChunk = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent || '') ? 140 : 220;
    const parts = [];
    let rest = String(text || '').replace(/\s+/g, ' ').trim();
    if (!rest) return parts;
    while (rest.length) {
      if (rest.length <= maxChunk) {
        parts.push(rest);
        break;
      }
      let cut = -1;
      const window = rest.slice(0, maxChunk + 1);
      const m = window.match(/.*[.!?][\s"']+/);
      if (m && m[0].length > 30) cut = m[0].length;
      if (cut < 0) {
        cut = rest.lastIndexOf(',', maxChunk);
        if (cut < 40) cut = rest.lastIndexOf(' ', maxChunk);
        if (cut < 40) cut = maxChunk;
      }
      parts.push(rest.slice(0, cut).trim());
      rest = rest.slice(cut).trim();
    }
    return parts.filter(Boolean);
  }

  function speak(text) {
    if (text == null) return;
    text = String(text);
    typewriter(text);

    try {
      if (!synth || typeof SpeechSynthesisUtterance === 'undefined') return;

      // Stop any current speech cleanly
      try { synth.cancel(); } catch (_) {}
      speaking = false;

      // Pause mic while speaking (avoids echo / self-trigger on mobile)
      let resumeAfterSpeak = false;
      if (continuousListen && recognition) {
        resumeAfterSpeak = true;
        try { recognition.stop(); } catch (_) {}
      }
      if (isListening && recognition) {
        try { recognition.stop(); } catch (_) {}
        isListening = false;
        updateListeningUI(false);
      }

      const voice = pickBestVoice() || preferredVoice;
      // JARVIS-like delivery: measured, clear, slightly low
      const isMobileUA = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent || '');
      const rate = isMobileUA ? 0.94 : 0.9;
      const pitch = 0.92;
      const volume = 1.0;

      const chunks = splitForSpeech(text);
      if (!chunks.length) return;

      let idx = 0;
      const speakNext = () => {
        if (idx >= chunks.length) {
          speaking = false;
          if (ttsResumeTimer) {
            clearInterval(ttsResumeTimer);
            ttsResumeTimer = null;
          }
          if (resumeAfterSpeak && continuousListen) {
            setTimeout(() => {
              if (continuousListen && !speaking) startRecognitionSafe();
            }, isMobileUA ? 650 : 400);
          }
          return;
        }
        const utter = new SpeechSynthesisUtterance(chunks[idx]);
        idx += 1;
        utter.rate = rate;
        utter.pitch = pitch;
        utter.volume = volume;
        if (voice) {
          try { utter.voice = voice; } catch (_) {}
          try { utter.lang = voice.lang || 'en-GB'; } catch (_) {}
        } else {
          utter.lang = isMobileUA ? 'en-US' : 'en-GB';
        }
        utter.onend = () => {
          // Small gap between chunks sounds more natural
          setTimeout(speakNext, isMobileUA ? 80 : 40);
        };
        utter.onerror = () => {
          setTimeout(speakNext, 60);
        };
        speaking = true;
        keepTTSAlive();
        try {
          // Some mobile engines need a tick after cancel()
          setTimeout(() => {
            try { synth.speak(utter); } catch (_) { speakNext(); }
          }, isMobileUA ? 40 : 0);
        } catch (_) {
          speakNext();
        }
      };
      speakNext();
    } catch (e) {
      // TTS unavailable — text reply still shown
    }
  }

  function typewriter(text) {
    if (!jarvisText || !jarvisSpeech) return;
    text = text == null ? '' : String(text);
    jarvisText.textContent = '';
    jarvisSpeech.classList.add('speech-visible');
    jarvisSpeech.style.animation = 'none';
    void jarvisSpeech.offsetHeight;
    jarvisSpeech.style.animation = '';
    let i = 0;
    const speed = 16;
    function tick() {
      if (i < text.length) {
        jarvisText.textContent += text.charAt(i);
        i++;
        setTimeout(tick, speed);
      }
    }
    tick();
  }


  // ---------------------------------------------------------------------------
  // Soft UI beep (Web Audio) — subtle mobile feedback
  // ---------------------------------------------------------------------------
  function playUiTone(kind) {
    try {
      if (!audioCtx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        audioCtx = new AC();
      }
      if (audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      if (kind === 'holo') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(660, now);
        osc.frequency.exponentialRampToValueAtTime(990, now + 0.12);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.08, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (kind === 'ack') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(520, now);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.05, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.14);
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.04, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.12);
      }
    } catch (_) {}
  }

  // ---------------------------------------------------------------------------
  // Battery telemetry (real device when available)
  // ---------------------------------------------------------------------------
  let batteryApiState = 'unknown'; // unknown | ok | unsupported | blocked
  let batteryFallbackSeed = Math.floor(50 + Math.random() * 40); // stable-ish fallback for the session

  function applyBatteryToChrome(pct, charging) {
    try {
      if (powerBar) powerBar.style.width = pct + '%';
      if (powerValue) {
        powerValue.textContent = pct + '%' + (charging ? '⚡' : '');
      }
    } catch (_) {}
  }

  function initBattery() {
    refreshBattery().catch(() => {});
    // Re-check when tab becomes visible (some mobile browsers report only then)
    try {
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') refreshBattery().catch(() => {});
      });
    } catch (_) {}
  }

  function batterySnapshot() {
    if (cachedBattery && typeof cachedBattery.level === 'number') {
      return {
        pct: Math.max(0, Math.min(100, Math.round(cachedBattery.level * 100))),
        charging: !!cachedBattery.charging,
        source: 'device',
        chargingTime: cachedBattery.chargingTime,
        dischargingTime: cachedBattery.dischargingTime
      };
    }
    // API missing/blocked (typical on iOS Safari & many mobile browsers)
    return {
      pct: batteryFallbackSeed,
      charging: false,
      source: 'unavailable'
    };
  }

  function refreshBattery() {
    return new Promise((resolve) => {
      if (typeof navigator.getBattery !== 'function') {
        batteryApiState = 'unsupported';
        cachedBattery = null;
        const snap = batterySnapshot();
        applyBatteryToChrome(snap.pct, false);
        resolve(snap);
        return;
      }
      try {
        navigator.getBattery().then((bat) => {
          batteryApiState = 'ok';
          const sync = () => {
            cachedBattery = {
              level: bat.level,
              charging: !!bat.charging,
              chargingTime: bat.chargingTime,
              dischargingTime: bat.dischargingTime
            };
            const pct = Math.round(bat.level * 100);
            applyBatteryToChrome(pct, bat.charging);
          };
          sync();
          try {
            bat.removeEventListener('levelchange', sync);
            bat.removeEventListener('chargingchange', sync);
          } catch (_) {}
          try {
            bat.addEventListener('levelchange', sync);
            bat.addEventListener('chargingchange', sync);
          } catch (_) {}
          resolve(batterySnapshot());
        }).catch(() => {
          batteryApiState = 'blocked';
          cachedBattery = null;
          resolve(batterySnapshot());
        });
      } catch (_) {
        batteryApiState = 'blocked';
        cachedBattery = null;
        resolve(batterySnapshot());
      }
    });
  }

  // ---------------------------------------------------------------------------
  // Holographic report engine
  // ---------------------------------------------------------------------------
  function closeHologram() {
    if (!holoOverlay) return;
    if (holoCloseTimer) {
      clearTimeout(holoCloseTimer);
      holoCloseTimer = null;
    }
    holoOverlay.classList.add('holo-exit');
    setTimeout(() => {
      holoOverlay.classList.add('hidden');
      holoOverlay.classList.remove('holo-exit', 'holo-power', 'holo-secure', 'holo-status', 'holo-diag', 'holo-suit', 'holo-combat', 'holo-wide');
      holoOverlay.setAttribute('aria-hidden', 'true');
      if (holoBody) holoBody.innerHTML = '';
    }, 380);
  }

  function holoRow(label, value, opts) {
    opts = opts || {};
    const cls = opts.valueClass || '';
    const meter = opts.meter;
    let html = '<div class="holo-row">';
    html += '<span class="holo-row-label">' + label + '</span>';
    html += '<span class="holo-row-value ' + cls + '">' + value + '</span>';
    if (typeof meter === 'number') {
      const fillCls = opts.meterClass || '';
      html += '<div class="holo-meter"><div class="holo-meter-fill ' + fillCls + '" data-w="' + Math.max(0, Math.min(100, meter)) + '"></div></div>';
    }
    html += '</div>';
    return html;
  }

  function showHologram(config) {
    if (!holoOverlay || !holoBody) return;
    if (holoCloseTimer) {
      clearTimeout(holoCloseTimer);
      holoCloseTimer = null;
    }
    holoOverlay.classList.remove('hidden', 'holo-exit', 'holo-power', 'holo-secure', 'holo-status', 'holo-diag', 'holo-suit', 'holo-combat');
    if (config.theme) holoOverlay.classList.add('holo-' + config.theme);
    if (config.theme === 'suit' || config.theme === 'combat') holoOverlay.classList.add('holo-wide');
    else holoOverlay.classList.remove('holo-wide');
    holoOverlay.setAttribute('aria-hidden', 'false');

    if (holoTitle) holoTitle.textContent = config.title || 'REPORT';
    if (holoSubtitle) holoSubtitle.textContent = config.subtitle || 'Otun Authority · Live telemetry';
    if (holoIcon) holoIcon.textContent = config.icon || '◈';
    if (holoTimestamp) {
      const now = new Date();
      holoTimestamp.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }

    holoBody.innerHTML = config.html || '';

    // Animate meters after paint
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        holoBody.querySelectorAll('.holo-meter-fill').forEach(el => {
          const w = el.getAttribute('data-w') || '0';
          el.style.width = w + '%';
        });
      });
    });

    playUiTone('holo');

    // Auto-dismiss after a while (still closable)
    const ttl = config.ttl || 14000;
    holoCloseTimer = setTimeout(() => closeHologram(), ttl);
  }

  function buildStatusHolo() {
    const bat = batterySnapshot();
    const cpu = 18 + Math.random() * 18;
    const net = 70 + Math.random() * 25;
    const integrity = 98 + Math.random() * 2;
    const html = [
      '<div class="holo-banner"><span class="holo-banner-dot"></span><span class="holo-banner-text">ALL SYSTEMS NOMINAL</span></div>',
      holoRow('Core Integrity', integrity.toFixed(1) + '%', { valueClass: 'ok', meter: integrity, meterClass: 'green' }),
      holoRow('Device Power', bat.pct + '%' + (bat.charging ? ' · CHARGING' : ''), {
        valueClass: bat.pct < 20 ? 'crit' : bat.pct < 40 ? 'warn' : 'ok',
        meter: bat.pct,
        meterClass: bat.pct < 20 ? 'red' : bat.pct < 40 ? 'amber' : 'green'
      }),
      holoRow('CPU Load', Math.round(cpu) + '%', { valueClass: 'cyan', meter: cpu }),
      holoRow('Network Link', net.toFixed(0) + '% capacity', { valueClass: 'cyan', meter: net }),
      holoRow('HUD Latency', (1.8 + Math.random() * 1.2).toFixed(1) + ' ms', { valueClass: 'ok' }),
      holoRow('Threat Level', 'GREEN', { valueClass: 'ok' }),
      holoRow('Voice Interface', continuousListen ? 'HANDS-FREE' : 'STANDBY', { valueClass: 'cyan' }),
      '<div class="holo-note">Otun Authority uplink secure. Knowledge, media, and advisory modules online. No anomalies in the immediate scan volume.</div>'
    ].join('');
    showHologram({
      title: 'SYSTEM STATUS',
      subtitle: 'Full diagnostic sweep · Epidexios',
      icon: '◈',
      theme: 'status',
      html: html,
      ttl: 16000
    });
  }

  function buildPowerHolo(batIn) {
    const bat = batIn || batterySnapshot();
    const pct = bat.pct;
    let statusLabel = 'OPTIMAL';
    let statusCls = 'ok';
    let meterCls = 'green';
    if (pct < 15) { statusLabel = 'CRITICAL'; statusCls = 'crit'; meterCls = 'red'; }
    else if (pct < 30) { statusLabel = 'LOW RESERVE'; statusCls = 'warn'; meterCls = 'amber'; }
    else if (pct < 55) { statusLabel = 'MODERATE'; statusCls = 'warn'; meterCls = 'amber'; }

    let estHours = '—';
    if (bat.source === 'device' && bat.dischargingTime && isFinite(bat.dischargingTime) && bat.dischargingTime < 86400 * 10) {
      estHours = (bat.dischargingTime / 3600).toFixed(1);
    } else if (pct > 5) {
      estHours = ((pct / 100) * (bat.charging ? 0.5 : 5.5)).toFixed(1);
    }

    const live = bat.source === 'device';
    const sourceLabel = live
      ? 'Live device battery'
      : (batteryApiState === 'unsupported'
          ? 'Browser blocks battery API'
          : 'Battery API unavailable');

    const note = live
      ? 'Live reading from your device battery. Levels update as the cell charges or drains, Epidexios.'
      : 'This mobile browser does not expose battery level to websites (common on iPhone Safari and many Android browsers for privacy). Showing the power matrix with a session estimate — check the system battery icon for the true percentage.';

    const html = [
      '<div class="holo-banner"><span class="holo-banner-dot"></span><span class="holo-banner-text">POWER MATRIX · ' + statusLabel + '</span></div>',
      holoRow('Primary Cell', pct + '%' + (live ? '' : ' (est.)'), { valueClass: statusCls, meter: pct, meterClass: meterCls }),
      holoRow('Charge State', bat.charging ? 'CHARGING' : 'ON BATTERY', { valueClass: bat.charging ? 'ok' : 'cyan' }),
      holoRow('Telemetry Source', sourceLabel, { valueClass: live ? 'ok' : 'warn' }),
      holoRow('Auxiliary Reserve', Math.min(100, pct + 8) + '%', { valueClass: 'ok', meter: Math.min(100, pct + 8), meterClass: 'green' }),
      holoRow('Arc Reactor Sim', (3.0 + Math.random() * 0.4).toFixed(1) + ' TW', { valueClass: 'cyan' }),
      holoRow('Est. Runtime', bat.charging ? 'N/A (charging)' : estHours + ' h', { valueClass: 'cyan' }),
      '<div class="holo-note">' + note + '</div>'
    ].join('');
    showHologram({
      title: 'POWER LEVELS',
      subtitle: live ? 'Energy matrix · Live cell readout' : 'Energy matrix · Estimated readout',
      icon: '⚡',
      theme: 'power',
      html: html,
      ttl: 16000
    });
  }

  /** Fetch battery (or fallback) then open power hologram — works on mobile even without the API */
  function showPowerReport() {
    return refreshBattery().then((bat) => {
      buildPowerHolo(bat);
      if (bat.source === 'device') {
        return 'Power matrix online. Device battery is at ' + bat.pct + ' percent' +
          (bat.charging ? ' and charging.' : '.') + ' Epidexios.';
      }
      return 'Power matrix projected. This browser blocks live battery access on mobile, so the readout is estimated — check your system battery icon for the true level, Epidexios.';
    });
  }

  function buildDiagnosticsHolo() {
    const bat = batterySnapshot();
    const html = [
      '<div class="holo-banner"><span class="holo-banner-dot"></span><span class="holo-banner-text">DIAGNOSTIC CYCLE COMPLETE</span></div>',
      holoRow('Neural Core', 'PASS', { valueClass: 'ok', meter: 100, meterClass: 'green' }),
      holoRow('Holographic UI', 'PASS', { valueClass: 'ok', meter: 100, meterClass: 'green' }),
      holoRow('Voice Pipeline', recognition ? 'ONLINE' : 'LIMITED', { valueClass: recognition ? 'ok' : 'warn', meter: recognition ? 100 : 55, meterClass: recognition ? 'green' : 'amber' }),
      holoRow('Media Server', mediaFiles.length ? (mediaFiles.length + ' assets') : 'IDLE', { valueClass: mediaFiles.length ? 'ok' : 'cyan', meter: mediaFiles.length ? 90 : 20, meterClass: mediaFiles.length ? 'green' : '' }),
      holoRow('Memory Banks', '64.2 / 128 PB (sim)', { valueClass: 'cyan', meter: 50, meterClass: 'amber' }),
      holoRow('Device Power', bat.pct + '%', { valueClass: bat.pct < 25 ? 'warn' : 'ok', meter: bat.pct, meterClass: bat.pct < 25 ? 'amber' : 'green' }),
      holoRow('Secure Channel', 'ENCRYPTED', { valueClass: 'ok' }),
      '<div class="holo-note">Full systems check finished. Primary pathways nominal. You are clear to proceed, Epidexios.</div>'
    ].join('');
    showHologram({
      title: 'DIAGNOSTICS',
      subtitle: 'Integrity scan · Otun Authority',
      icon: '◎',
      theme: 'diag',
      html: html,
      ttl: 15000
    });
  }

  function buildSecureHolo() {
    const html = [
      '<div class="holo-banner secure"><span class="holo-banner-dot"></span><span class="holo-banner-text">SECURE PROTOCOL</span></div>',
      holoRow('Perimeter', 'HEIGHTENED', { valueClass: 'warn' }),
      holoRow('Threat Detection', 'ACTIVE', { valueClass: 'ok', meter: 100, meterClass: 'green' }),
      holoRow('External Links', 'RESTRICTED (narrative)', { valueClass: 'warn' }),
      holoRow('Voice Auth', 'EPIDEXIOS PROFILE', { valueClass: 'cyan' }),
      holoRow('Lockdown Level', 'AMBER', { valueClass: 'warn', meter: 65, meterClass: 'amber' }),
      '<div class="holo-note">Secure mode is a defensive narrative protocol. For full weapons HUD say combat mode. Stay vigilant, Epidexios.</div>'
    ].join('');
    showHologram({
      title: 'SECURE MODE',
      subtitle: 'Defensive posture engaged',
      icon: '▣',
      theme: 'secure',
      html: html,
      ttl: 14000
    });
  }

  function buildCombatModeHolo() {
    const bat = batterySnapshot();
    const threats = [
      { az: '014°', range: '1.2 km', type: 'UNKNOWN', level: 'LOW' },
      { az: '287°', range: '4.8 km', type: 'AIRBORNE', level: 'WATCH' },
      { az: '—', range: '—', type: 'CLEAR SECTOR', level: 'GREEN' },
    ];
    let threatRows = threats.map((t, i) =>
      '<div class="combat-threat" style="animation-delay:' + (0.2 + i * 0.15) + 's">' +
        '<span class="combat-threat-az">' + t.az + '</span>' +
        '<span class="combat-threat-type">' + t.type + '</span>' +
        '<span class="combat-threat-range">' + t.range + '</span>' +
        '<span class="combat-threat-lvl">' + t.level + '</span>' +
      '</div>'
    ).join('');

    const html = [
      '<div class="combat-layout">',
        '<div class="combat-radar" aria-hidden="true">',
          '<div class="combat-radar-ring r1"></div>',
          '<div class="combat-radar-ring r2"></div>',
          '<div class="combat-radar-ring r3"></div>',
          '<div class="combat-radar-sweep"></div>',
          '<div class="combat-radar-cross h"></div>',
          '<div class="combat-radar-cross v"></div>',
          '<div class="combat-blip b1"></div>',
          '<div class="combat-blip b2"></div>',
          '<div class="combat-reticle">',
            '<span class="ret-c"></span>',
            '<span class="ret-h"></span>',
            '<span class="ret-v"></span>',
          '</div>',
          '<div class="combat-radar-label">TACTICAL RADAR</div>',
        '</div>',
        '<div class="combat-panel">',
          '<div class="holo-banner secure"><span class="holo-banner-dot"></span><span class="holo-banner-text">COMBAT MODE · WEAPONS HOT</span></div>',
          holoRow('Weapons Array', 'ARMED', { valueClass: 'crit', meter: 100, meterClass: 'red' }),
          holoRow('Repulsors', 'CHARGED', { valueClass: 'ok', meter: 97, meterClass: 'green' }),
          holoRow('Targeting', 'ACTIVE LOCK SCAN', { valueClass: 'warn', meter: 88, meterClass: 'amber' }),
          holoRow('Countermeasures', 'READY', { valueClass: 'ok', meter: 100, meterClass: 'green' }),
          holoRow('Shield Harmonics', 'AMBER', { valueClass: 'warn', meter: 72, meterClass: 'amber' }),
          holoRow('Power Cell', bat.pct + '%' + (bat.charging ? ' · CHG' : ''), {
            valueClass: bat.pct < 25 ? 'crit' : 'cyan',
            meter: bat.pct,
            meterClass: bat.pct < 25 ? 'red' : bat.pct < 50 ? 'amber' : 'green'
          }),
          '<div class="combat-threat-head">THREAT BOARD</div>',
          '<div class="combat-threat-list">' + threatRows + '</div>',
          '<div class="holo-note">Combat mode is a cinematic protocol in this interface. No real weapons are controlled. Say close hologram or secure mode to stand down, Epidexios.</div>',
        '</div>',
      '</div>'
    ].join('');

    showHologram({
      title: 'COMBAT MODE',
      subtitle: 'Tactical overlay · Otun Authority',
      icon: '⬡',
      theme: 'combat',
      html: html,
      ttl: 20000
    });

    if (holoOverlay) holoOverlay.classList.add('holo-wide');
    try {
      const mod = document.getElementById('module-combat');
      if (mod) {
        mod.classList.add('active');
        const icon = mod.querySelector('.mod-icon');
        const status = mod.querySelector('.mod-status');
        if (icon) icon.textContent = '◉';
        if (status) status.textContent = 'ENGAGED';
      }
    } catch (_) {}
  }


  function buildSuitReportHolo() {
    const bat = batterySnapshot();
    const systems = [
      { id: 'helm', name: 'Helmet / HUD', val: 100, status: 'ONLINE' },
      { id: 'repulsor', name: 'Repulsors', val: 96 + Math.random() * 4, status: 'NOMINAL' },
      { id: 'flight', name: 'Flight Stabilizers', val: 94 + Math.random() * 5, status: 'NOMINAL' },
      { id: 'arc', name: 'Arc Reactor Core', val: 98 + Math.random() * 2, status: 'STABLE' },
      { id: 'armor', name: 'Armor Plating', val: 91 + Math.random() * 8, status: 'INTEGRITY OK' },
      { id: 'life', name: 'Life Support', val: 99, status: 'ONLINE' },
      { id: 'weapons', name: 'Weapons Array', val: 88 + Math.random() * 10, status: 'STANDBY' },
      { id: 'comm', name: 'Comm Link', val: 100, status: 'SECURE' },
      { id: 'power', name: 'Power Cell (device)', val: bat.pct, status: bat.charging ? 'CHARGING' : 'ON BATTERY' },
    ];

    let checklist = '';
    systems.forEach((s, i) => {
      const cls = s.val < 70 ? 'crit' : s.val < 90 ? 'warn' : 'ok';
      const mcls = s.val < 70 ? 'red' : s.val < 90 ? 'amber' : 'green';
      checklist +=
        '<div class="suit-check" style="animation-delay:' + (0.15 + i * 0.18) + 's">' +
          '<span class="suit-check-mark">◆</span>' +
          '<span class="suit-check-name">' + s.name + '</span>' +
          '<span class="suit-check-status ' + cls + '">' + s.status + '</span>' +
          '<div class="holo-meter"><div class="holo-meter-fill ' + mcls + '" data-w="' + Math.round(s.val) + '"></div></div>' +
        '</div>';
    });

    const html = [
      '<div class="suit-layout">',
        '<div class="suit-schematic" aria-hidden="true">',
          '<div class="suit-scan-beam"></div>',
          '<div class="suit-silhouette">',
            '<div class="suit-part suit-helm" data-part="helm"><span>HUD</span></div>',
            '<div class="suit-part suit-chest" data-part="arc"><span>ARC</span></div>',
            '<div class="suit-part suit-arm-l" data-part="repulsor"><span>L</span></div>',
            '<div class="suit-part suit-arm-r" data-part="repulsor"><span>R</span></div>',
            '<div class="suit-part suit-core-ring"></div>',
            '<div class="suit-part suit-belt" data-part="life"></div>',
            '<div class="suit-part suit-leg-l" data-part="flight"></div>',
            '<div class="suit-part suit-leg-r" data-part="flight"></div>',
            '<div class="suit-part suit-boot-l" data-part="flight"></div>',
            '<div class="suit-part suit-boot-r" data-part="flight"></div>',
            '<div class="suit-arc-glow"></div>',
          '</div>',
          '<div class="suit-wire"></div>',
        '</div>',
        '<div class="suit-checklist">',
          '<div class="holo-banner"><span class="holo-banner-dot"></span><span class="holo-banner-text">MARK ARMOUR · FULL SWEEP</span></div>',
          checklist,
          '<div class="holo-note">Suit report complete. All primary armour systems within operational tolerance. Ready for flight when you are, Epidexios.</div>',
        '</div>',
      '</div>'
    ].join('');

    showHologram({
      title: 'SUIT REPORT',
      subtitle: 'Mark armour diagnostic · Otun Authority',
      icon: '⬡',
      theme: 'suit',
      html: html,
      ttl: 22000
    });

    // Staggered “ping” on schematic parts
    setTimeout(() => {
      try {
        if (!holoBody) return;
        const parts = holoBody.querySelectorAll('.suit-part');
        parts.forEach((el, i) => {
          setTimeout(() => el.classList.add('suit-lit'), 120 + i * 140);
        });
      } catch (_) {}
    }, 80);
  }


  // ---------------------------------------------------------------------------
  // Mobile panel show / hide (minimal ambient shell)
  // ---------------------------------------------------------------------------
  function isMobileLayout() {
    try {
      return window.matchMedia && window.matchMedia('(max-width: 860px)').matches;
    } catch (_) {
      return window.innerWidth <= 860;
    }
  }

  function applyMobileMinimalShell() {
    if (!app) return;
    if (isMobileLayout()) {
      app.classList.add('mobile-minimal');
    } else {
      app.classList.remove('mobile-minimal');
      // Clear any mobile-shown flags when returning to desktop
      document.querySelectorAll('.mobile-shown').forEach(el => el.classList.remove('mobile-shown'));
      if (floatingCards) floatingCards.classList.remove('has-shown-cards');
    }
  }

  const PANEL_MAP = {
    schedule: { sel: '[data-card="calendar"]', label: 'Schedule' },
    calendar: { sel: '[data-card="calendar"]', label: 'Schedule' },
    weather: { sel: '[data-card="weather"]', label: 'Weather' },
    actions: { sel: '[data-card="actions"]', label: 'Quick Actions' },
    'quick actions': { sel: '[data-card="actions"]', label: 'Quick Actions' },
    media: { sel: '[data-card="media"]', label: 'Media Library' },
    'media library': { sel: '[data-card="media"]', label: 'Media Library' },
    nowplaying: { sel: '[data-card="nowplaying"]', label: 'Now Playing' },
    'now playing': { sel: '[data-card="nowplaying"]', label: 'Now Playing' },
    diagnostics: { sel: '.left-panel', label: 'System Diagnostics' },
    'system diagnostics': { sel: '.left-panel', label: 'System Diagnostics' },
    'data stream': { sel: '.left-panel', label: 'Data Stream / Diagnostics' },
    'data system': { sel: '.left-panel', label: 'Data Stream / Diagnostics' },
    modules: { sel: '.right-panel', label: 'Modules' },
    network: { sel: '.right-panel', label: 'Network & Modules' },
    'network activity': { sel: '.right-panel', label: 'Network & Modules' },
    core: { sel: '#holo-core', label: 'Holographic Core' },
    eye: { sel: '#holo-core', label: 'Holographic Core' },
    'holographic core': { sel: '#holo-core', label: 'Holographic Core' },
    cards: { sel: '.floating-cards .float-card', label: 'All cards', multi: true },
    panels: { sel: '.side-panel', label: 'Side panels', multi: true },
  };

  function refreshShownCardsFlag() {
    if (!floatingCards) return;
    const any = floatingCards.querySelector('.float-card.mobile-shown');
    if (any) floatingCards.classList.add('has-shown-cards');
    else floatingCards.classList.remove('has-shown-cards');
  }

  function showMobilePanel(key) {
    applyMobileMinimalShell();
    if (!isMobileLayout()) {
      return 'Panel controls are for the mobile layout. On desktop everything stays visible, Epidexios.';
    }
    const k = (key || '').toLowerCase().trim();
    if (k === 'all' || k === 'everything') {
      document.querySelectorAll('.float-card, .side-panel').forEach(el => {
        el.classList.add('mobile-shown');
        el.classList.remove('is-hidden');
      });
      refreshShownCardsFlag();
      return 'All interface panels are visible, Epidexios.';
    }
    const entry = PANEL_MAP[k];
    if (!entry) {
      return 'I can show: schedule, weather, actions, media, now playing, diagnostics, data stream, modules, network — or show all. Hide with hide schedule, hide modules, hide all.';
    }
    const nodes = document.querySelectorAll(entry.sel);
    if (!nodes.length) return entry.label + ' is not available.';

    // One sheet at a time: cards dismiss other cards; panels dismiss other panels
    const first = nodes[0];
    if (first.classList.contains('float-card')) {
      document.querySelectorAll('.float-card.mobile-shown').forEach(el => {
        if (!Array.from(nodes).includes(el)) el.classList.remove('mobile-shown');
      });
    }
    if (first.classList.contains('side-panel')) {
      document.querySelectorAll('.side-panel.mobile-shown').forEach(el => {
        if (!Array.from(nodes).includes(el)) el.classList.remove('mobile-shown');
      });
    }

    nodes.forEach(el => {
      el.classList.add('mobile-shown');
      el.classList.remove('is-hidden');
    });
    refreshShownCardsFlag();
    playUiTone('ack');
    return entry.label + ' on screen, Epidexios.';
  }

  function hideMobilePanel(key) {
    if (!isMobileLayout()) {
      return 'Panel hide commands apply on mobile. On desktop the full layout remains, Epidexios.';
    }
    const k = (key || '').toLowerCase().trim();
    if (k === 'all' || k === 'everything' || k === 'panels' || k === 'cards') {
      document.querySelectorAll('.mobile-shown').forEach(el => el.classList.remove('mobile-shown'));
      refreshShownCardsFlag();
      return 'All panels hidden. Ambient mode restored.';
    }
    const entry = PANEL_MAP[k];
    if (!entry) {
      return 'Say hide schedule, hide weather, hide modules, hide diagnostics, hide core, or hide all.';
    }
    document.querySelectorAll(entry.sel).forEach(el => el.classList.remove('mobile-shown'));
    refreshShownCardsFlag();
    return entry.label + ' dismissed.';
  }

  function showSpeechBubble() {
    if (jarvisSpeech) jarvisSpeech.classList.add('speech-visible');
  }

  // Patch typewriter to reveal speech on mobile minimal
  const _typewriterOrig = typeof typewriter === 'function' ? typewriter : null;

  // ---------------------------------------------------------------------------
  // Command Handling
  // ---------------------------------------------------------------------------
  function handleCommand(raw) {
    try {
      const input = (raw || '').trim();
      if (!input) return;
      if (commandInput) commandInput.value = '';
      // Typing + Enter is a user gesture on most browsers — unlock TTS if needed
      try { unlockTTS(); pickBestVoice(); } catch (_) {}
      const reply = getResponse(input);
      if (reply && typeof reply.then === 'function') {
        reply.then(text => { if (text) speak(text); }).catch(() => {
          typewriter('I could not complete that request, Epidexios.');
        });
      } else if (reply) {
        speak(reply);
      }
    } catch (err) {
      console.error(err);
      try { typewriter('Something went wrong processing that command.'); } catch (_) {}
    }
  }

  // ---------------------------------------------------------------------------
  // Voice Recognition (Web Speech API) — supports hands-free continuous mode
  // ---------------------------------------------------------------------------
  let micPermissionState = 'unknown'; // unknown | granted | denied | unsupported
  let speechReady = false;

  function isInsecureContext() {
    // Mic + SpeechRecognition require secure context: https: or http://localhost
    try {
      if (typeof window.isSecureContext === 'boolean') return !window.isSecureContext;
      const p = location.protocol;
      return p === 'file:' || (p === 'http:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1');
    } catch (_) {
      return true;
    }
  }

  function showMicBanner(message, kind) {
    let el = document.getElementById('mic-permission-banner');
    if (!el) {
      el = document.createElement('div');
      el.id = 'mic-permission-banner';
      el.className = 'mic-banner';
      document.body.appendChild(el);
    }
    el.className = 'mic-banner' + (kind ? ' mic-banner--' + kind : '');
    el.innerHTML = message;
    el.style.display = 'block';
  }

  function hideMicBanner() {
    const el = document.getElementById('mic-permission-banner');
    if (el) el.style.display = 'none';
  }

  function insecureContextMessage() {
    return (
      '<strong>Microphone blocked — insecure page</strong><br/>' +
      'You opened this UI via <code>file://</code> or plain HTTP. Browsers deny the mic in that case.<br/>' +
      '<span class="mic-banner-steps">Fix: open a terminal in this folder and run:<br/>' +
      '<code>python -m http.server 8080</code><br/>' +
      'Then visit <code>http://localhost:8080</code> in Chrome or Edge and allow the microphone.</span>'
    );
  }

  function deniedMessage() {
    return (
      '<strong>Microphone permission denied</strong><br/>' +
      'JARVIS cannot hear you until the browser allows the mic for this site.<br/>' +
      '<span class="mic-banner-steps">' +
      '1. Click the lock / tune icon in the address bar<br/>' +
      '2. Set <em>Microphone</em> to <strong>Allow</strong><br/>' +
      '3. Reload the page, then click the mic button again<br/>' +
      'Chrome: Settings → Privacy → Site settings → Microphone</span>'
    );
  }

  function updateListeningUI(active) {
    isListening = active;
    if (micBtn) {
      if (active) micBtn.classList.add('listening');
      else micBtn.classList.remove('listening');
      if (continuousListen) micBtn.classList.add('hands-free');
      else micBtn.classList.remove('hands-free');
    }
    if (dockMicBtn) {
      if (active || continuousListen) dockMicBtn.classList.add('listening');
      else dockMicBtn.classList.remove('listening');
    }
    if (listeningIndicator) {
      if (active || continuousListen) listeningIndicator.classList.remove('hidden');
      else listeningIndicator.classList.add('hidden');
      const label = listeningIndicator.querySelector('span');
      if (label) {
        label.textContent = continuousListen
          ? (active ? 'HANDS-FREE · LISTENING...' : 'HANDS-FREE · STANDBY')
          : 'LISTENING...';
      }
    }
  }

  function startRecognitionSafe() {
    if (!speechReady) {
      initSpeechRecognition();
    }
    if (!recognition || !speechReady) return;
    if (speaking) return;

    const isMobileUA = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent || '');

    // Cancel TTS that may hold the audio session on mobile
    try {
      if (synth && (synth.speaking || synth.pending)) {
        synth.cancel();
        speaking = false;
      }
    } catch (_) {}

    const tryStart = () => {
      try {
        recognition.start();
        isListening = true;
        updateListeningUI(true);
      } catch (err) {
        const msg = String((err && err.message) || err || '');
        if (/already started|InvalidState/i.test(msg)) {
          // Already running — treat as listening
          isListening = true;
          updateListeningUI(true);
          return;
        }
        // Mobile often needs a fresh instance after stop/error
        if (isMobileUA) {
          try {
            initSpeechRecognition();
            setTimeout(() => {
              try {
                if (recognition && !speaking) {
                  recognition.start();
                  isListening = true;
                  updateListeningUI(true);
                }
              } catch (_) {}
            }, 280);
          } catch (_) {}
        }
      }
    };

    // Brief delay lets the audio session release after TTS/cancel on mobile
    if (isMobileUA) setTimeout(tryStart, 120);
    else tryStart();
  }

  function setContinuousListen(on) {
    continuousListen = !!on;
    unlockTTS();
    if (continuousListen) {
      updateListeningUI(true);
      try { if (synth) synth.cancel(); } catch (_) {}
      speaking = false;
      ensureMicThen(() => startRecognitionSafe());
    } else {
      try { if (recognition) recognition.stop(); } catch (_) {}
      updateListeningUI(false);
    }
  }

  /** Explicitly ask for mic access so the browser shows a clear prompt */
  function requestMicPermission() {
    return new Promise((resolve) => {
      if (isInsecureContext()) {
        micPermissionState = 'denied';
        showMicBanner(insecureContextMessage(), 'error');
        resolve(false);
        return;
      }
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        // Some browsers still allow SpeechRecognition without getUserMedia
        resolve(true);
        return;
      }
      navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
        })
        .then((stream) => {
          try { stream.getTracks().forEach(t => t.stop()); } catch (_) {}
          micPermissionState = 'granted';
          hideMicBanner();
          resolve(true);
        })
        .catch((err) => {
          micPermissionState = 'denied';
          const name = (err && err.name) || '';
          if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
            showMicBanner(deniedMessage(), 'error');
          } else if (name === 'NotFoundError') {
            showMicBanner('<strong>No microphone found</strong><br/>Connect a mic and try again.', 'error');
          } else {
            showMicBanner(deniedMessage(), 'error');
          }
          resolve(false);
        });
    });
  }

  function ensureMicThen(fn) {
    if (micPermissionState === 'granted') {
      fn();
      return;
    }
    requestMicPermission().then((ok) => {
      if (ok) fn();
      else {
        typewriter('Microphone access is required for voice control. Please allow the mic in your browser settings, or use the text console.');
      }
    });
  }

  function commitVoiceCommand(transcript) {
    const t = (transcript || '').trim();
    if (!t) return;
    // Avoid double-firing the same phrase (final + onend, or interim timer + onend)
    if (t === lastHandledTranscript) return;
    lastHandledTranscript = t;
    lastHeardTranscript = t;
    if (voiceCommitTimer) {
      clearTimeout(voiceCommitTimer);
      voiceCommitTimer = null;
    }
    isListening = false;
    updateListeningUI(false);
    try { if (recognition) recognition.stop(); } catch (_) {}
    if (commandInput) commandInput.value = t;
    // Run immediately — same path as desktop voice / pressing Enter
    handleCommand(t);
  }

  function initSpeechRecognition() {
    try {
      if (isInsecureContext()) {
        micPermissionState = 'denied';
        speechReady = false;
        setTimeout(() => showMicBanner(insecureContextMessage(), 'error'), 2500);
        return;
      }

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        micPermissionState = 'unsupported';
        speechReady = false;
        setTimeout(() => {
          showMicBanner(
            '<strong>Voice recognition not supported</strong><br/>Use <b>Chrome</b> or <b>Edge</b> on Android, or the latest Safari on iOS 14.5+. Text commands still work.',
            'warn'
          );
        }, 2500);
        return;
      }

      recognition = new SpeechRecognition();
      // continuous=true is unreliable on most mobile browsers — use false + restart
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 3;
      const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent || '');
      // Mobile speech engines are strongest for en-US; desktop can use en-GB
      recognition.lang = isMobile ? (navigator.language && /^en/i.test(navigator.language) ? navigator.language : 'en-US') : 'en-GB';
      speechReady = true;

      recognition.onstart = () => {
        isListening = true;
        updateListeningUI(true);
        hideMicBanner();
      };

      recognition.onend = () => {
        isListening = false;
        const isMobileUA = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent || '');

        // CRITICAL for mobile: engines often end without isFinal=true.
        // Commit whatever was last heard so the user never has to tap Send.
        if (voiceCommitTimer) {
          clearTimeout(voiceCommitTimer);
          voiceCommitTimer = null;
        }
        if (lastHeardTranscript && lastHeardTranscript !== lastHandledTranscript && !speaking) {
          commitVoiceCommand(lastHeardTranscript);
        }

        if (continuousListen && !speaking) {
          updateListeningUI(true);
          setTimeout(() => {
            if (continuousListen && !speaking) startRecognitionSafe();
          }, isMobileUA ? 850 : 450);
        } else {
          updateListeningUI(false);
        }
      };

      recognition.onresult = (event) => {
        try {
          let transcript = '';
          let isFinal = false;
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const r = event.results[i];
            let best = r[0];
            for (let a = 1; a < r.length; a++) {
              if ((r[a].confidence || 0) > (best.confidence || 0)) best = r[a];
            }
            if (r.isFinal) {
              transcript = best.transcript;
              isFinal = true;
            } else if (!isFinal) {
              transcript = best.transcript;
            }
          }
          transcript = (transcript || '').trim();
          if (!transcript) return;

          lastHeardTranscript = transcript;
          if (commandInput) commandInput.value = transcript;

          // Debounced auto-commit: mobile often delays isFinal or never sets it
          if (voiceCommitTimer) clearTimeout(voiceCommitTimer);
          if (isFinal) {
            commitVoiceCommand(transcript);
          } else {
            // If user pauses mid-phrase, commit shortly after last interim
            // (desktop usually gets isFinal; mobile Chrome often only gets interim + onend)
            voiceCommitTimer = setTimeout(() => {
              if (lastHeardTranscript && lastHeardTranscript !== lastHandledTranscript) {
                commitVoiceCommand(lastHeardTranscript);
              }
            }, 1100);
          }
        } catch (_) {}
      };

      recognition.onerror = (event) => {
        isListening = false;
        const err = event && event.error;
        if (err === 'not-allowed' || err === 'service-not-allowed') {
          continuousListen = false;
          micPermissionState = 'denied';
          updateListeningUI(false);
          showMicBanner(deniedMessage(), 'error');
          typewriter('Microphone access was denied. Allow the mic for this site in your browser settings, then tap Voice again.');
          return;
        }
        if (err === 'network') {
          typewriter('Speech service network error. Check your internet connection — mobile voice recognition needs the network.');
        }
        if (err === 'no-speech') {
          // Quiet timeout — normal on mobile; just stop indicator unless hands-free
          if (!continuousListen) updateListeningUI(false);
          return;
        }
        if (err === 'aborted') {
          updateListeningUI(false);
          return;
        }
        if (continuousListen && err !== 'aborted') {
          setTimeout(() => {
            if (continuousListen && !speaking) startRecognitionSafe();
          }, 700);
        } else {
          updateListeningUI(false);
        }
      };
    } catch (_) {
      recognition = null;
      speechReady = false;
    }
  }

  function toggleListening() {
    // Always unlock TTS in the same user gesture (required on iOS / many Android browsers)
    unlockTTS();
    pickBestVoice();

    if (isInsecureContext()) {
      showMicBanner(insecureContextMessage(), 'error');
      typewriter('Voice needs a secure page. Use https:// or open via a local server (python -m http.server 8080), then allow the microphone.');
      return;
    }

    if (!recognition || !speechReady) {
      initSpeechRecognition();
      if (!recognition || !speechReady) {
        typewriter("Voice recognition is not available in this browser. Use Chrome or Edge on Android, Safari on iOS 14.5+, or type your commands.");
        return;
      }
    }

    // Hands-free active → mic turns it off
    if (continuousListen) {
      setContinuousListen(false);
      typewriter(pick(responses.handsFreeOff));
      return;
    }

    // Already listening → stop
    if (isListening) {
      try { recognition.stop(); } catch (_) {}
      isListening = false;
      updateListeningUI(false);
      return;
    }

    // Stop any TTS so the mic can claim the audio session
    try {
      if (synth) synth.cancel();
      speaking = false;
    } catch (_) {}

    const isMobileUA = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent || '');

    const beginListen = () => {
      micPermissionState = 'granted';
      hideMicBanner();
      lastHeardTranscript = '';
      lastHandledTranscript = '';
      if (voiceCommitTimer) {
        clearTimeout(voiceCommitTimer);
        voiceCommitTimer = null;
      }
      startRecognitionSafe();
      try { playUiTone('ack'); } catch (_) {}
    };

    // Prefer explicit getUserMedia first on mobile so the permission dialog is clear
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      }).then((stream) => {
        try { stream.getTracks().forEach(t => t.stop()); } catch (_) {}
        beginListen();
      }).catch((err) => {
        const name = (err && err.name) || '';
        if (name === 'NotAllowedError' || name === 'PermissionDeniedError' || name === 'SecurityError') {
          micPermissionState = 'denied';
          showMicBanner(deniedMessage(), 'error');
          typewriter('Microphone access is required. Allow the mic for this site in your browser settings, then tap Voice again.');
          return;
        }
        // Other errors: still try SpeechRecognition (some devices deny getUserMedia but allow recognition)
        try { recognition.start(); } catch (_) {}
        beginListen();
      });
    } else {
      // Fallback path
      try { recognition.start(); } catch (_) {}
      beginListen();
    }
  }

  // ---- Media voice helpers (volume, list, shuffle, track number) ----
  function applyVolumeToPlayers() {
    if (jarvisAudio) jarvisAudio.volume = mediaVolume;
    if (jarvisVideo) jarvisVideo.volume = mediaVolume;
  }

  function adjustVolume(delta) {
    mediaVolume = Math.max(0, Math.min(1, mediaVolume + delta));
    applyVolumeToPlayers();
    const pct = Math.round(mediaVolume * 100);
    return 'Volume set to ' + pct + ' percent.';
  }

  function setVolumePercent(n) {
    mediaVolume = Math.max(0, Math.min(100, n)) / 100;
    applyVolumeToPlayers();
    return 'Volume set to ' + Math.round(mediaVolume * 100) + ' percent.';
  }

  function toggleMute(q) {
    if (/unmute/.test(q)) {
      if (mediaVolume < 0.05) mediaVolume = 0.7;
      applyVolumeToPlayers();
      return 'Unmuted. Volume at ' + Math.round(mediaVolume * 100) + ' percent.';
    }
    mediaVolume = 0;
    applyVolumeToPlayers();
    return 'Muted.';
  }

  function listMediaByVoice() {
    showMediaCard();
    if (!mediaFiles.length) return pick(responses.mediaNoFolder);
    const max = Math.min(mediaFiles.length, 12);
    const lines = mediaFiles.slice(0, max).map((f, i) => (i + 1) + '. ' + f.name + ' (' + f.kind + ')');
    let msg = 'Media library: ' + mediaFiles.length + ' file' + (mediaFiles.length === 1 ? '' : 's') + '. ';
    msg += lines.join('. ');
    if (mediaFiles.length > max) msg += '. And ' + (mediaFiles.length - max) + ' more. Say play track number, or play by name.';
    else msg += '. Say play track 1, or play followed by a name.';
    return msg;
  }

  function playByNumber(n) {
    if (!mediaFiles.length) {
      openMediaFolder();
      return pick(responses.mediaNoFolder);
    }
    const idx = n - 1;
    if (idx < 0 || idx >= mediaFiles.length) {
      return 'Track ' + n + ' is out of range. Library has ' + mediaFiles.length + ' file' + (mediaFiles.length === 1 ? '' : 's') + '.';
    }
    playAtIndex(idx, { silent: true });
    return pick(responses.mediaPlaying) + ' — ' + mediaFiles[idx].name;
  }

  function playRandom() {
    if (!mediaFiles.length) {
      openMediaFolder();
      return pick(responses.mediaNoFolder);
    }
    const idx = Math.floor(Math.random() * mediaFiles.length);
    playAtIndex(idx, { silent: true });
    return pick(responses.mediaPlaying) + ' — ' + mediaFiles[idx].name;
  }

  function showCardByName(name) {
    const cards = document.querySelectorAll('.float-card');
    let shown = false;
    cards.forEach(card => {
      const key = (card.dataset.card || '').toLowerCase();
      if (name === 'media' || name === 'library') {
        if (card.id === 'media-card' || key === 'media') {
          card.classList.remove('is-hidden');
          card.style.display = '';
          card.style.opacity = '1';
          card.style.transform = '';
          shown = true;
        }
      } else if (name === 'playing' || name === 'now playing') {
        if (card.id === 'now-playing-card') {
          card.style.display = '';
          card.style.opacity = '1';
          card.style.transform = '';
          shown = true;
        }
      } else if (key === name || (name === 'schedule' && key === 'calendar')) {
        card.style.display = '';
        card.style.opacity = '1';
        card.style.transform = '';
        shown = true;
      }
    });
    return shown;
  }

  function hideCardByName(name) {
    const cards = document.querySelectorAll('.float-card');
    cards.forEach(card => {
      const key = (card.dataset.card || '').toLowerCase();
      if (name === 'all') {
        card.style.opacity = '0';
        setTimeout(() => { card.style.display = 'none'; }, 250);
      } else if (name === 'media' && (card.id === 'media-card' || key === 'media')) {
        card.style.display = 'none';
      } else if ((name === 'playing' || name === 'now playing') && card.id === 'now-playing-card') {
        card.style.display = 'none';
      } else if (key === name || (name === 'schedule' && key === 'calendar')) {
        card.style.display = 'none';
      }
    });
  }

  // ---------------------------------------------------------------------------
  // Floating Cards — Drag
  // ---------------------------------------------------------------------------
  function initCardDrag() {
    const LONG_MS = 420;
    const MOVE_CANCEL = 12;
    const cards = document.querySelectorAll('.float-card');

    function viewportBounds(card) {
      const pad = 6;
      const w = card.offsetWidth || 160;
      const h = card.offsetHeight || 80;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      return {
        minX: pad,
        minY: pad,
        maxX: Math.max(pad, vw - w - pad),
        maxY: Math.max(pad, vh - h - pad),
        w: w,
        h: h
      };
    }

    function clamp(v, min, max) {
      return Math.max(min, Math.min(max, v));
    }

    cards.forEach(card => {
      let offsetX = 0, offsetY = 0;
      let dragging = false;
      let longTimer = null;
      let startX = 0, startY = 0;
      let armed = false;
      let pointerId = null;

      function clearLong() {
        if (longTimer) {
          clearTimeout(longTimer);
          longTimer = null;
        }
      }

      function beginDrag(e) {
        armed = true;
        dragging = true;
        card.classList.add('dragging');
        card.classList.add('is-floating');
        const rect = card.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        // Lift into fixed layer so it stays on-screen on mobile grid layout
        card.style.position = 'fixed';
        card.style.left = rect.left + 'px';
        card.style.top = rect.top + 'px';
        card.style.width = rect.width + 'px';
        card.style.right = 'auto';
        card.style.bottom = 'auto';
        card.style.zIndex = '80';
        card.style.transform = 'none';
        card.style.margin = '0';
        try {
          if (pointerId != null) card.setPointerCapture(pointerId);
        } catch (_) {}
      }

      function moveDrag(e) {
        if (!dragging) return;
        const b = viewportBounds(card);
        let x = e.clientX - offsetX;
        let y = e.clientY - offsetY;
        x = clamp(x, b.minX, b.maxX);
        y = clamp(y, b.minY, b.maxY);
        card.style.left = x + 'px';
        card.style.top = y + 'px';
        card.style.setProperty('--x', x + 'px');
        card.style.setProperty('--y', y + 'px');
      }

      function endDrag() {
        clearLong();
        dragging = false;
        armed = false;
        pointerId = null;
        card.classList.remove('dragging');
        // Keep fixed position but still clamped (already on screen)
      }

      card.addEventListener('pointerdown', (e) => {
        if (e.target.closest('.card-close') || e.target.closest('.action-btn') ||
            e.target.closest('.media-filter-btn') || e.target.closest('.media-file-item') ||
            e.target.closest('.np-btn') || e.target.closest('.np-seek') ||
            e.target.closest('.media-pick-btn') || e.target.closest('input') ||
            e.target.closest('button')) {
          return;
        }
        // Primary button / touch only
        if (e.button != null && e.button !== 0) return;
        pointerId = e.pointerId;
        startX = e.clientX;
        startY = e.clientY;
        armed = false;
        clearLong();
        longTimer = setTimeout(() => {
          longTimer = null;
          beginDrag(e);
        }, LONG_MS);
      });

      card.addEventListener('pointermove', (e) => {
        if (longTimer && !dragging) {
          const dx = e.clientX - startX;
          const dy = e.clientY - startY;
          if (Math.abs(dx) > MOVE_CANCEL || Math.abs(dy) > MOVE_CANCEL) {
            clearLong(); // scroll/tap — cancel long-press
          }
          return;
        }
        if (dragging) {
          e.preventDefault();
          moveDrag(e);
        }
      });

      card.addEventListener('pointerup', endDrag);
      card.addEventListener('pointercancel', endDrag);

      const closeBtn = card.querySelector('.card-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          card.classList.remove('mobile-shown');
          try { refreshShownCardsFlag(); } catch (_) {}
          card.style.opacity = '0';
          card.style.transform = 'scale(0.9)';
          setTimeout(() => {
            card.classList.add('is-hidden');
            if (!isMobileLayout()) {
              card.style.display = 'none';
            } else {
              card.style.opacity = '';
              card.style.transform = '';
              card.style.display = '';
              card.classList.remove('is-hidden');
            }
          }, 280);
        });
      }
    });

    // Keep fixed cards inside viewport on resize / orientation change
    window.addEventListener('resize', () => {
      document.querySelectorAll('.float-card.is-floating').forEach(card => {
        const b = viewportBounds(card);
        const left = parseFloat(card.style.left) || 0;
        const top = parseFloat(card.style.top) || 0;
        card.style.left = clamp(left, b.minX, b.maxX) + 'px';
        card.style.top = clamp(top, b.minY, b.maxY) + 'px';
      });
    });
  }


  // ---------------------------------------------------------------------------
  // Media Library — File System Access + Playback
  // ---------------------------------------------------------------------------
  function revokeObjectUrls() {
    objectUrls.forEach(u => {
      try { URL.revokeObjectURL(u); } catch (_) {}
    });
    objectUrls = [];
  }

  function formatTime(sec) {
    if (!isFinite(sec) || sec < 0) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return m + ':' + String(s).padStart(2, '0');
  }

  function setMediaModuleActive(active) {
    if (!moduleMedia) return;
    try {
      if (active) {
        moduleMedia.classList.add('active');
        const icon = moduleMedia.querySelector('.mod-icon');
        const status = moduleMedia.querySelector('.mod-status');
        if (icon) icon.textContent = '◉';
        if (status) status.textContent = 'ACTIVE';
      } else {
        moduleMedia.classList.remove('active');
        const icon = moduleMedia.querySelector('.mod-icon');
        const status = moduleMedia.querySelector('.mod-status');
        if (icon) icon.textContent = '○';
        if (status) status.textContent = 'IDLE';
      }
    } catch (_) {}
  }

  function showMediaCard() {
    if (mediaCard) {
      mediaCard.classList.remove('is-hidden');
      mediaCard.style.display = '';
      mediaCard.style.opacity = '1';
      mediaCard.style.transform = '';
      if (isMobileLayout()) {
        document.querySelectorAll('.float-card.mobile-shown').forEach(el => {
          if (el !== mediaCard) el.classList.remove('mobile-shown');
        });
        mediaCard.classList.add('mobile-shown');
        refreshShownCardsFlag();
      }
    }
  }

  function showNowPlaying() {
    if (nowPlayingCard) {
      nowPlayingCard.classList.remove('is-hidden');
      nowPlayingCard.style.display = '';
      nowPlayingCard.style.opacity = '1';
      nowPlayingCard.style.transform = '';
    }
  }

  function kindOfName(name) {
    if (AUDIO_EXT.test(name)) return 'audio';
    if (VIDEO_EXT.test(name)) return 'video';
    return null;
  }


  // ---------------------------------------------------------------------------
  // Project media folder (media/audio, media/video + manifest.json)
  // ---------------------------------------------------------------------------
  async function loadProjectMedia() {
    try {
      const res = await fetch('media/manifest.json', { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      const audio = Array.isArray(data.audio) ? data.audio : [];
      const video = Array.isArray(data.video) ? data.video : [];
      const fromProject = [];

      audio.forEach((name) => {
        if (!name || typeof name !== 'string') return;
        const base = name.split('/').pop();
        fromProject.push({
          name: base,
          kind: 'audio',
          source: 'project',
          url: 'media/audio/' + base.split('/').map(encodeURIComponent).join('/')
        });
      });
      video.forEach((name) => {
        if (!name || typeof name !== 'string') return;
        const base = name.split('/').pop();
        fromProject.push({
          name: base,
          kind: 'video',
          source: 'project',
          url: 'media/video/' + base.split('/').map(encodeURIComponent).join('/')
        });
      });

      if (!fromProject.length) return;

      // Keep any session-picked files; project files first
      const external = mediaFiles.filter(f => f.source !== 'project');
      mediaFiles = fromProject.concat(external);
      mediaFiles.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));

      if (mediaFolderName) {
        const n = fromProject.length;
        mediaFolderName.textContent = 'Project media/ (' + n + ' file' + (n === 1 ? '' : 's') + ')';
      }
      setMediaModuleActive(true);
      showMediaCard();
      renderMediaList();
    } catch (_) {
      // No manifest or server not running — ignore
    }
  }

  async function openMediaFolder() {
    showMediaCard();
    // Prefer File System Access API
    if (window.showDirectoryPicker) {
      try {
        const handle = await window.showDirectoryPicker({ mode: 'read' });
        mediaDirHandle = handle;
        await indexDirectoryHandle(handle);
        return;
      } catch (err) {
        if (err && err.name === 'AbortError') {
          typewriter('Folder selection cancelled, Sir.');
          return;
        }
        // fall through to input
      }
    }
    // Fallback: directory file input
    if (folderFallbackInput) {
      folderFallbackInput.value = '';
      folderFallbackInput.click();
    } else {
      typewriter('Folder access is not supported in this browser. Please use Chrome or Edge for the full media library experience.');
    }
  }

  async function indexDirectoryHandle(dirHandle) {
    const files = [];
    try {
      for await (const entry of dirHandle.values()) {
        if (entry.kind !== 'file') continue;
        const kind = kindOfName(entry.name);
        if (!kind) continue;
        files.push({ name: entry.name, handle: entry, kind, source: 'fs' });
      }
    } catch (e) {
      typewriter('Unable to read that folder. Please try another directory.');
      return;
    }
    files.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
    const project = mediaFiles.filter(f => f.source === 'project');
    mediaFiles = project.concat(files);
    if (mediaFolderName) mediaFolderName.textContent = dirHandle.name || 'Selected folder';
    setMediaModuleActive(mediaFiles.length > 0);
    renderMediaList();
    showMediaCard();
    if (files.length === 0) {
      typewriter(pick(responses.mediaEmpty));
    } else {
      showNowPlaying();
      typewriter('Indexed ' + files.length + ' media file' + (files.length === 1 ? '' : 's') + ' from "' + (dirHandle.name || 'folder') + '". Tap a file or say play music / play track 1.');
    }
  }

  function indexFileList(fileList, label) {
    const files = [];
    Array.from(fileList || []).forEach(file => {
      let kind = kindOfName(file.name || '');
      if (!kind && file.type) {
        if (String(file.type).indexOf('audio/') === 0) kind = 'audio';
        else if (String(file.type).indexOf('video/') === 0) kind = 'video';
      }
      if (!kind) return;
      const raw = file.name || 'media';
      let base = raw;
      const slash = Math.max(raw.lastIndexOf('/'), raw.lastIndexOf('\\'));
      if (slash >= 0) base = raw.slice(slash + 1);
      files.push({ name: base, file, kind, source: 'input' });
    });
    files.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
    const project = mediaFiles.filter(f => f.source === 'project');
    mediaFiles = project.concat(files);
    mediaDirHandle = null;
    let folderHint = label || (files.length ? (files.length + ' file' + (files.length === 1 ? '' : 's') + ' selected') : 'Selected files');
    try {
      if (!label && fileList[0] && fileList[0].webkitRelativePath) {
        const rel = String(fileList[0].webkitRelativePath);
        folderHint = rel.split('/')[0] || folderHint;
      }
    } catch (_) {}
    if (mediaFolderName) mediaFolderName.textContent = folderHint;
    setMediaModuleActive(mediaFiles.length > 0);
    renderMediaList();
    if (files.length === 0) {
      typewriter(pick(responses.mediaEmpty));
    } else {
      showMediaCard();
      showNowPlaying();
      const msg = 'Indexed ' + files.length + ' media file' + (files.length === 1 ? '' : 's') + '. Tap a file or say play music, play video, or play track 1.';
      typewriter(msg);
      if (files.length === 1) {
        setTimeout(() => {
          const idx = mediaFiles.findIndex(f => f.file === files[0].file || (f.name === files[0].name && f.source === 'input'));
          if (idx >= 0) playAtIndex(idx, { silent: true });
        }, 450);
      }
    }
  }

  function renderMediaList() {
    if (!mediaFileList) return;
    const filtered = mediaFiles.filter(f => mediaFilter === 'all' || f.kind === mediaFilter);
    if (filtered.length === 0) {
      mediaFileList.innerHTML = '<div class="media-empty">' +
        (mediaFiles.length === 0
          ? 'Tap <b>Select files</b> or <b>Open folder</b> — then tap a track to play. Voice: select files, play music, next, pause.'
          : 'No files match this filter') +
        '</div>';
      return;
    }
    mediaFileList.innerHTML = '';
    filtered.forEach((f) => {
      const realIndex = mediaFiles.indexOf(f);
      const item = document.createElement('div');
      item.className = 'media-file-item' + (realIndex === currentMediaIndex ? ' playing' : '');
      item.dataset.index = String(realIndex);
      item.innerHTML =
        '<span class="media-file-icon">' + (f.kind === 'video' ? '▶' : '♫') + '</span>' +
        '<span class="media-file-name" title="' + f.name.replace(/"/g, '&quot;') + '">' + f.name + '</span>';
      item.addEventListener('click', () => playAtIndex(realIndex));
      mediaFileList.appendChild(item);
    });
  }

  async function resolveFileUrl(entry) {
    // Project files use static paths under media/
    if (entry.source === 'project' && entry.url) return entry.url;
    if (entry.url && entry.source !== 'fs') return entry.url;
    let file;
    if (entry.source === 'fs' && entry.handle) {
      file = await entry.handle.getFile();
    } else if (entry.file) {
      file = entry.file;
    } else if (entry.url) {
      return entry.url;
    } else {
      throw new Error('No file source');
    }
    const url = URL.createObjectURL(file);
    objectUrls.push(url);
    entry.url = url;
    return url;
  }

  async function playAtIndex(index, opts) {
    if (index < 0 || index >= mediaFiles.length) return;
    const silent = opts && opts.silent;
    try {
      stopMedia(true);
      currentMediaIndex = index;
      const entry = mediaFiles[index];
      if (!entry) return;
      renderMediaList();
      showNowPlaying();
      showMediaCard();
      const url = await resolveFileUrl(entry);
      if (npTitle) npTitle.textContent = entry.name;
      if (npType) npType.textContent = entry.kind === 'video' ? 'VIDEO' : 'AUDIO';

      if (entry.kind === 'video') {
        if (jarvisVideo) {
          jarvisVideo.src = url;
          jarvisVideo.volume = mediaVolume;
          jarvisVideo.load();
          if (videoTitle) videoTitle.textContent = entry.name;
          if (videoOverlay) videoOverlay.classList.remove('hidden');
          const p = jarvisVideo.play();
          if (p && p.catch) p.catch(() => {});
        }
        if (npPlayPause) npPlayPause.textContent = '⏸';
        bindMediaElement(jarvisVideo);
      } else {
        if (jarvisAudio) {
          jarvisAudio.src = url;
          jarvisAudio.volume = mediaVolume;
          jarvisAudio.load();
          const p = jarvisAudio.play();
          if (p && p.catch) p.catch(() => {});
        }
        if (videoOverlay) videoOverlay.classList.add('hidden');
        if (npPlayPause) npPlayPause.textContent = '⏸';
        bindMediaElement(jarvisAudio);
      }
      setMediaModuleActive(true);
      if (!silent) typewriter(pick(responses.mediaPlaying) + ' — ' + entry.name);
    } catch (e) {
      typewriter('Unable to play that file. It may be an unsupported format or access was denied.');
      currentMediaIndex = -1;
    }
  }

  let mediaTimeHandler = null;
  function bindMediaElement(el) {
    if (!el) return;
    if (mediaTimeHandler) {
      // remove previous listeners by cloning seek handler only via flags
    }
    const onTime = () => {
      if (!el.duration || !isFinite(el.duration)) return;
      if (npSeek && document.activeElement !== npSeek) {
        npSeek.value = String((el.currentTime / el.duration) * 100);
      }
      if (npTimeCur) npTimeCur.textContent = formatTime(el.currentTime);
      if (npTimeDur) npTimeDur.textContent = formatTime(el.duration);
    };
    const onEnded = () => {
      playNext();
    };
    const onPlay = () => { if (npPlayPause) npPlayPause.textContent = '⏸'; };
    const onPause = () => { if (npPlayPause) npPlayPause.textContent = '▶'; };

    el.ontimeupdate = onTime;
    el.onended = onEnded;
    el.onplay = onPlay;
    el.onpause = onPause;
    el.onloadedmetadata = onTime;
  }

  function getActiveMediaEl() {
    if (currentMediaIndex < 0) return null;
    const entry = mediaFiles[currentMediaIndex];
    if (!entry) return null;
    return entry.kind === 'video' ? jarvisVideo : jarvisAudio;
  }

  function stopMedia(silent) {
    if (jarvisAudio) {
      jarvisAudio.pause();
      jarvisAudio.removeAttribute('src');
      jarvisAudio.load();
    }
    if (jarvisVideo) {
      jarvisVideo.pause();
      jarvisVideo.removeAttribute('src');
      jarvisVideo.load();
    }
    if (videoOverlay) videoOverlay.classList.add('hidden');
    if (npPlayPause) npPlayPause.textContent = '▶';
    if (npTitle) npTitle.textContent = '—';
    if (npType) npType.textContent = '—';
    if (npSeek) npSeek.value = '0';
    if (npTimeCur) npTimeCur.textContent = '0:00';
    if (npTimeDur) npTimeDur.textContent = '0:00';
    currentMediaIndex = -1;
    renderMediaList();
    if (!silent) setMediaModuleActive(mediaFiles.length > 0);
  }

  function pauseMedia() {
    const el = getActiveMediaEl();
    if (el) el.pause();
  }

  function resumeMedia() {
    const el = getActiveMediaEl();
    if (el) {
      const p = el.play();
      if (p && p.catch) p.catch(() => {});
    } else if (mediaFiles.length) {
      playAtIndex(0);
    }
  }

  function togglePlayPause() {
    const el = getActiveMediaEl();
    if (!el) {
      if (mediaFiles.length) playAtIndex(0);
      return;
    }
    if (el.paused) {
      const p = el.play();
      if (p && p.catch) p.catch(() => {});
    } else {
      el.pause();
    }
  }

  function playNext() {
    if (!mediaFiles.length) return;
    const filtered = mediaFiles
      .map((f, i) => ({ f, i }))
      .filter(({ f }) => mediaFilter === 'all' || f.kind === mediaFilter);
    if (!filtered.length) return;
    let pos = filtered.findIndex(({ i }) => i === currentMediaIndex);
    pos = (pos + 1) % filtered.length;
    playAtIndex(filtered[pos].i);
  }

  function playPrev() {
    if (!mediaFiles.length) return;
    const filtered = mediaFiles
      .map((f, i) => ({ f, i }))
      .filter(({ f }) => mediaFilter === 'all' || f.kind === mediaFilter);
    if (!filtered.length) return;
    let pos = filtered.findIndex(({ i }) => i === currentMediaIndex);
    pos = pos <= 0 ? filtered.length - 1 : pos - 1;
    playAtIndex(filtered[pos].i);
  }

  function playFirstOfKind(kind) {
    if (!mediaFiles.length) {
      openMediaFolder();
      return pick(responses.mediaNoFolder);
    }
    const idx = mediaFiles.findIndex(f => f.kind === kind);
    if (idx < 0) {
      return kind === 'audio'
        ? 'No audio files found in the current folder. Try another directory or filter.'
        : 'No video files found in the current folder. Try another directory or filter.';
    }
    playAtIndex(idx, { silent: true });
    return pick(responses.mediaPlaying) + ' — ' + mediaFiles[idx].name;
  }

  function playByName(query) {
    if (!mediaFiles.length) {
      openMediaFolder();
      return pick(responses.mediaNoFolder);
    }
    const q = query.toLowerCase();
    let idx = mediaFiles.findIndex(f => f.name.toLowerCase() === q || f.name.toLowerCase().startsWith(q));
    if (idx < 0) idx = mediaFiles.findIndex(f => f.name.toLowerCase().includes(q));
    if (idx < 0) {
      return `I couldn't find a file matching "${query}" in the current library.`;
    }
    playAtIndex(idx, { silent: true });
    return pick(responses.mediaPlaying) + ' — ' + mediaFiles[idx].name;
  }

  function openMediaFilesPicker() {
    showMediaCard();
    if (filesPickerInput) {
      filesPickerInput.value = '';
      filesPickerInput.click();
    } else {
      openMediaFolder();
    }
  }

  function initMediaUI() {
    // Auto-load files listed in media/manifest.json (no picker needed)
    loadProjectMedia();

    if (pickFolderBtn) {
      pickFolderBtn.addEventListener('click', () => openMediaFolder());
    }
    if (pickFilesBtn) {
      pickFilesBtn.addEventListener('click', () => openMediaFilesPicker());
    }
    if (folderFallbackInput) {
      folderFallbackInput.addEventListener('change', () => {
        if (folderFallbackInput.files && folderFallbackInput.files.length) {
          indexFileList(folderFallbackInput.files);
          showMediaCard();
        }
      });
    }
    if (filesPickerInput) {
      filesPickerInput.addEventListener('change', () => {
        if (filesPickerInput.files && filesPickerInput.files.length) {
          indexFileList(filesPickerInput.files, 'Selected files');
          showMediaCard();
          showNowPlaying();
        }
      });
    }
    document.querySelectorAll('.media-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.media-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        mediaFilter = btn.dataset.filter || 'all';
        renderMediaList();
      });
    });
    if (npPlayPause) npPlayPause.addEventListener('click', togglePlayPause);
    if (npPrev) npPrev.addEventListener('click', playPrev);
    if (npNext) npNext.addEventListener('click', playNext);
    if (npStop) npStop.addEventListener('click', () => {
      stopMedia();
      typewriter(pick(responses.mediaStopped));
    });
    if (npSeek) {
      npSeek.addEventListener('input', () => {
        const el = getActiveMediaEl();
        if (!el || !el.duration) return;
        el.currentTime = (parseFloat(npSeek.value) / 100) * el.duration;
      });
    }
    if (videoClose) {
      videoClose.addEventListener('click', () => {
        if (jarvisVideo) jarvisVideo.pause();
        if (videoOverlay) videoOverlay.classList.add('hidden');
        if (npPlayPause) npPlayPause.textContent = '▶';
      });
    }
    if (videoOverlay) {
      videoOverlay.addEventListener('click', (e) => {
        if (e.target === videoOverlay) {
          if (jarvisVideo) jarvisVideo.pause();
          videoOverlay.classList.add('hidden');
          if (npPlayPause) npPlayPause.textContent = '▶';
        }
      });
    }
  }

  // ---------------------------------------------------------------------------
  // Event Listeners
  // ---------------------------------------------------------------------------
  function openMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('hidden');
    mobileMenu.setAttribute('aria-hidden', 'false');
  }

  function closeMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.add('hidden');
    mobileMenu.setAttribute('aria-hidden', 'true');
  }

  function bindEvents() {
    if (sendBtn) sendBtn.addEventListener('click', () => handleCommand(commandInput.value));

    if (commandInput) {
      commandInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleCommand(commandInput.value);
        }
      });
    }

    if (micBtn) micBtn.addEventListener('click', toggleListening);
    if (dockMicBtn) dockMicBtn.addEventListener('click', toggleListening);

    if (dockMenuBtn) dockMenuBtn.addEventListener('click', openMobileMenu);
    if (mobileMenuClose) mobileMenuClose.addEventListener('click', closeMobileMenu);
    if (mobileMenuBackdrop) mobileMenuBackdrop.addEventListener('click', closeMobileMenu);

    // Global delegation: any [data-cmd] button/chip/module
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-cmd]');
      if (!btn) return;
      const cmd = btn.getAttribute('data-cmd');
      if (!cmd) return;
      e.preventDefault();
      closeMobileMenu();
      handleCommand(cmd);
    });

    document.addEventListener('keydown', (e) => {
      const typing = document.activeElement === commandInput ||
        (document.activeElement && /^(INPUT|TEXTAREA)$/i.test(document.activeElement.tagName));
      // Space or V toggles voice on desktop (ignored while typing in the console)
      if (!typing && !e.repeat && (e.code === 'Space' || e.code === 'KeyV' || e.key === 'v' || e.key === 'V')) {
        e.preventDefault();
        toggleListening();
        return;
      }
      if (e.key === 'Escape') {
        closeMobileMenu();
        closeHologram();
      }
    });

    if (holoClose) holoClose.addEventListener('click', closeHologram);
    if (holoBackdrop) holoBackdrop.addEventListener('click', closeHologram);

    if (synth) {
      const refreshVoices = () => { try { pickBestVoice(); } catch (_) {} };
      synth.onvoiceschanged = refreshVoices;
      try { synth.getVoices(); } catch (_) {}
      refreshVoices();
      // Mobile often populates voices asynchronously
      setTimeout(refreshVoices, 250);
      setTimeout(refreshVoices, 1000);
    }
  }

  // ---------------------------------------------------------------------------
  // Init
  // ---------------------------------------------------------------------------
  function init() {
    try {
      updateClock();
      setInterval(updateClock, 1000);
      initSpeechRecognition();
      // Load TTS voices (async on Chrome / mobile)
      if (synth) {
        pickBestVoice();
        if (typeof synth.onvoiceschanged !== 'undefined') {
          synth.onvoiceschanged = () => { pickBestVoice(); };
        }
        // Some mobile browsers need a delayed refresh
        setTimeout(() => pickBestVoice(), 500);
        setTimeout(() => pickBestVoice(), 1500);
      }
      // Unlock TTS / mic on first user interaction (iOS requirement)
      const unlockOnce = () => {
        unlockTTS();
        pickBestVoice();
        document.removeEventListener('touchstart', unlockOnce, true);
        document.removeEventListener('click', unlockOnce, true);
      };
      document.addEventListener('touchstart', unlockOnce, { capture: true, passive: true });
      document.addEventListener('click', unlockOnce, { capture: true });
      initBattery();
      bindEvents();
      initCardDrag();
      initMediaUI();
      applyMobileMinimalShell();
      window.addEventListener('resize', () => {
        try { applyMobileMinimalShell(); } catch (_) {}
      });
      runBoot();
    } catch (err) {
      try {
        if (jarvisText) jarvisText.textContent = 'Startup error: ' + (err && err.message ? err.message : 'unknown');
        if (app) { app.classList.remove('hidden'); app.classList.add('visible'); }
        if (bootOverlay) bootOverlay.style.display = 'none';
      } catch (_) {}
      console.error(err);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
