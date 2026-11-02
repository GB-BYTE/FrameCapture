# FrameCapture — Guided Stage local recorder

A browser-based Windows recorder with screen/window/tab capture, narration, optional webcam, screenshots, fixed video/image cropping, macOS-style framing and local exports.

## Open

With Node.js installed, double-click **Start-FrameCapture.cmd**. It starts the local server in the background when needed, reuses an existing server, and opens **http://127.0.0.1:4318** in your default browser. Use Chrome or Edge for capture. You no longer need to keep a terminal window open; keep the recorder browser tab open during recording. After restarting Windows, double-click the launcher again. Startup errors appear in the launcher and `server.log`. For development, `node serve.cjs` still works. The server listens only on this computer. No account, API keys or media-upload service is used. An internet connection is only used for the optional Google Fonts stylesheet; system fonts work offline.

The original clickable prototype remains in `prototype/` and is separate from the working app in `app/`.

## Record Antigravity with narration

1. Open the Antigravity window and prepare the project.
2. Select Screen video and enable Narration. Enable the camera only if wanted.
3. Choose what to share, then select **Window → Antigravity** in the browser prompt. Select the source audio option if offered and needed. Microphone narration is independent of source audio.
4. Allow the microphone and camera when requested. Review the actual source dimensions and input meter.
5. Start recording and switch to Antigravity during the countdown. Keep the source window open rather than minimized. The browser continues recording in the background.
6. Return to FrameCapture to pause, resume or finish. The browser's Stop sharing action also finalizes an active recording.
7. In Style, choose **Crop source**. Drag corners or enter removed edges in pixels. Keyboard users can focus a corner and use arrow keys (Shift for larger changes). The crop is fixed for the whole clip, and Reset crop restores the full source.
8. Use Trim start & end below the preview to enter the start/end seconds, or seek with the playback slider and use Set start/end at playhead. Preview plays the kept range; Keep full recording resets it. Trim affects styled exports only and can have small frame/encoder timing differences. Switch to Styled preview. Set the frame, title, background, padding, output ratio and recorded camera overlay.
9. Continue to Export, choose Small file, Balanced, or High quality, prepare the file, review it, then Save as. Choose Desktop in the file dialog. If unavailable, use the browser's normal download flow.

For screenshots, choose Screenshot, then Choose screenshot source. Pick a source once in the browser dialog. The three-second countdown starts automatically, allowing you to switch to the source. FrameCapture freezes the image and releases sharing, then opens area selection directly. Drag a rectangle, adjust its corners, or choose Keep whole image, then Download PNG. This quick download keeps the selected pixels at their original size without a frame, padding, or resolution cap. Add frame & background is optional and carries the selection into Style.

Selection happens on the captured image inside FrameCapture, not as an overlay on another Windows application. The browser's source picker remains required. Previously saved screenshots also open in the quick selection view.

## Export and storage

- MP4 with H.264/AAC is offered only when MediaRecorder reports support; WebM is the fallback. Resource or encoder failures remain possible even after format detection. If an MP4 render fails, select WebM and retry.
- Native source recording is independent of canvas rendering, so working in another application does not depend on foreground canvas animation.
- Screen and webcam are recorded separately; narration and available source audio are mixed. Webcam positioning happens after recording. Independent microphone/source-audio editing is not included.
- Styled export redraws frames locally at playback speed and encodes them again. Keep the FrameCapture tab visible. Hiding it cancels the render, preserving the original. A failed or cancelled export can be retried. Long recordings require enough RAM and disk space.
- The default output height is capped at 1080 pixels and at source crop height. Source mode allows up to 2160 pixels high and 3840 pixels wide. Dimensions are even for codec compatibility. Content is fitted without stretching or upscaling, so padding can reduce the displayed content size.
- Actual resolution and frame rate depend on browser, source and hardware. A requested 60 fps is not a guarantee of 60 captured frames per second.
- Originals and style settings are stored in IndexedDB after capture. If storage fails, the session retains the recording and prompts you to download it. During video capture, chunks are additionally saved to a local recovery database. On reopening the same browser/address after interruption, Recover recording restores the saved portion when it can be decoded. Recent data may be missing, and recovery can fail if storage is cleared, full, unavailable, or partial media cannot be decoded. Save important work to disk. Clearing browser storage removes local captures.
- Download original saves the unstyled screen recording with its mixed audio. The webcam track is retained in the local capture for styled export.
- The Mac-style traffic-light dots are decorative export framing. They do not hide Windows chrome; use Window capture and Crop source.

## Validation

Run `node tests/core.test.mjs` for crop bounds, layout, aspect-ratio, MIME fallback and Windows filename checks.

For actual browser encoding tests, run `node serve.cjs --test` and open `/media-test.html`. Click Run media checks. Tests use generated moving pixels and generated audio, never real screen/camera/microphone input. They exercise recording, pause/resume, decoding, IndexedDB, crop pixel output, PNG, every offered video format, exported audio and cancellation. Optional UI fixtures can be removed with the test page cleanup button.

## Current limits

This is a first local beta, not a full multitrack editor. It does not include captions, automatic zoom, variable crops over time, a system-wide pause shortcut, background export, or guaranteed MP4 conversion on browsers without an MP4 encoder. Full Windows permission/device testing still requires the user to choose a real source and microphone in Chrome or Edge.

Export timeout update: renders are monitored for 45 seconds without playback progress instead of being stopped by an estimated total duration. Run node tests/export-health.test.mjs to check long-running progress and stall detection.

## Screenshot and export regression checks

With the test server running, `/screenshot-flow.html` exercises the real application with a generated screen source. Choose Screenshot and Choose screenshot source: expect the selection screen automatically after the countdown, exactly one source-picker call, and source stopped: true. Microphone/camera requests deliberately fail in this fixture. Test pages are unavailable without `--test`.

The media-test page also has Run 35-second export regression. It records generated frames for 35 seconds, then exports with intentionally incorrect duration metadata. Keep the tab visible during the approximately 70-second check. It must complete beyond the former timeout rather than stop early.

For an isolated test server and separate browser storage, PowerShell: `$env:PORT='4319'` then `node serve.cjs --test`. Normal launches use port 4318 unless PORT is set.

Before calling the beta production-ready, manually verify a longer Antigravity recording with narration in Windows Chrome and Edge, audio sync, device permissions, source closure, and successful saving. Synthetic checks do not substitute for those device checks. Recovery is best effort, not a substitute for saving to disk. Native device testing and long-session resource testing remain necessary.

## Export size presets

Balanced is the default for styled video exports. At 30 fps, target video bitrates are Small file 2.5 Mbps, Balanced 5 Mbps, High quality 10 Mbps; at 60 fps these targets increase by 1.6x. Audio targets are 96, 128 and 192 kbps respectively. Estimates use the kept duration and target bitrate; the browser may produce a substantially different size. Small files can soften fine text. These controls do not reduce original recording quality or apply to PNG.

## Recovery details

New recordings prefer WebM internally when available, while MP4 remains an export option. Saved chunks include screen/mixed audio and the separate webcam track. Active recordings are excluded from recovery using browser locks; a heartbeat timeout is used where locks are unavailable. Recovery copies are removed only after the finished or recovered recording is saved to the normal capture library. If restoration fails, Download saved portion preserves the partial original for external recovery attempts. No automatic upload is involved. Power loss can still lose uncommitted browser writes.

## Upgrade verification

Run `node tests/editing.test.mjs` for trim bounds and size calculations. With `node serve.cjs --test`, `/upgrade-test.html` verifies trimmed MP4/WebM exports with generated audio, encoder preset settings, and recovery after reloading an unfinalized generated recording. It also checks that an active recording is not offered for recovery. `node launch.cjs --check` starts/reuses the background server without opening a browser.

## Automatic video cleanup and library storage

Videos in My captures expire 20 days after their first automatic save. Editing, trimming, renaming, or reopening does not extend this time. Older captures without a saved-at field use their original creation timestamp. Screenshots and downloaded files are excluded. Overdue video copies are removed on startup, on opening the library, and periodically while the app is open and idle. A closed browser cannot run cleanup: the next app visit catches up. Inactive recovery copies also expire after 20 days. An already-open expired video may remain temporarily in memory so it can still be downloaded; it cannot be saved back into the library with its expired ID.

My captures shows each video's deletion date, capture storage total, and the browser's approximate site-storage usage where available. Cards appear in batches of 24. The library reads metadata with a cursor and loads full media only when a capture is opened. No online storage service is used.

## Visual trimming

In Style, drag the left and right gold handles on the thumbnail strip. Watch the main preview as you move either end. Play selection previews the kept section. Keyboard users can focus either handle and use Left/Right arrows (0.1 second), Shift+arrows (1 second), or Home/End. Exact time fields and playhead buttons remain available. Keep full recording resets the trim. Thumbnail decoding uses a separate muted preview and falls back to the main video preview if thumbnails cannot be generated.

Retention tests: `node tests/retention.test.mjs` checks the 20-day boundary and screenshot exclusion. The isolated browser fixture `/retention-test.html` (test server only) verifies database deletion, legacy dates, editing not resetting expiry, rejection of expired re-saves, and metadata-only listing. Never run fixture tests against a personal library; use a separate test port.
