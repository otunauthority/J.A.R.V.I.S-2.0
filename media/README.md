# Media folder

Drop your files here so JARVIS can play them without using the folder picker.

## Layout

```
media/
├── manifest.json   ← list your filenames here
├── audio/          ← put .mp3 .wav .ogg .m4a etc.
└── video/          ← put .mp4 .webm .mov etc.
```

## How to add files

1. Copy audio into `media/audio/`
2. Copy video into `media/video/`
3. Edit `manifest.json` and list the **exact filenames**:

```json
{
  "audio": ["song1.mp3", "song2.wav"],
  "video": ["demo.mp4"]
}
```

4. Refresh the page (served via `http://localhost:8080`).

JARVIS loads this library automatically on startup.

You can still say **open media folder** to add files from anywhere else on your computer for that session.
