# FrameCapture — Guided Stage design prototype

This is a local, clickable design prototype. It does not access the screen, microphone or camera, save recordings, or export media. All projects and recording states are samples. The format selector is illustrative, not a browser capability check.

Run `node serve.cjs` from this directory and open http://127.0.0.1:4317. Alternatively, open index.html directly in your browser. Manrope is loaded from Google Fonts when online; Segoe UI is the fallback.

Review flows:
- Video: select a mode, choose a simulated source, adjust inputs, countdown, pause/resume, finish, style and preview the save flow.
- Screenshot: choose a source, capture, crop preview, style and preview PNG export.
- Library: filter sample captures and open a sample project.
- Edge states: simulate permission denial from the source dialog, and MP4 fallback from Export.

Presentation options include macOS-style decorative dots, title, background, padding, aspect ratio, and sample webcam placement. Crop and playback are demonstrations, not media editing. No application capture engine has been implemented.
