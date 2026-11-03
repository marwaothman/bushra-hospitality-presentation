# Navigation and performance audit

Date: 2026-11-03. Baseline: production commit 138aa159.
Scope: preserve approved layout, copy, branding and toolbar appearance.

## Root cause

History previously pushed only when section, selected package, outer modal or
meeting slide changed. Nusuk achievement, report and film are inner states of
the same outer modal, so they created no browser entries. Back skipped them.
Photo/language updates also left stale snapshots. A restoration flag could
remain set when a popstate changed only an unobserved field.

## Fix

- Screen identity now includes Nusuk intro/film, achievement and report layers.
- A single shared history synchronizer pushes only a changed screen identity.
- Photo, language and media selection changes replace the current snapshot.
- Popstate restores all tracked fields; restoring the same identity replaces,
  never pushes. Forward entries are retained.
- Toolbar Back, Close, Escape and Nusuk overlay dismissals use the same traversal.
- Repeated Back clicks are guarded until popstate arrives.
- Refresh uses the same persisted state, including the selected photo and overlays.

## Measured build comparison

Same checkout, dependencies, Vite production build and gzip reporting:

| Metric | Before | After |
| --- | ---: | ---: |
| Initial JS, raw | 465.40 kB | 443.54 kB |
| Initial JS, gzip | 140.11 kB | 132.46 kB |
| Deferred QR chunk, gzip | included initially | 8.85 kB |
| CSS, gzip | 67.92 kB | 67.92 kB |
| Artificial delay before navigation state change | 380 ms | 0 ms |

Initial compressed JS reduced by approximately 5.5%. The QR chunk is deferred,
not removed; total JS after opening QR is not lower. Build sizes are not network
or interaction timings and do not establish Core Web Vitals compliance.

## Other performance changes

- QR generation/import runs only when its dialog opens.
- Decorative modal videos retain their existing posters but have no video source,
  avoiding duplicate metadata requests for a film which was not playing.
- Main background film removes its source while a modal is open and honours
  reduced-motion preference. It pauses in hidden tabs.
- All videos pause when the document is hidden. Actual user films remain mounted
  only in their active modal and retain their controls.
- Nusuk thumbnail decoding is asynchronous with native lazy loading.
- Hashed assets receive immutable caching; fonts use a one-day cache.
- No CSS, approved copy, images, toolbar markup order, font or layout change.

## Verification

Four automated Node tests pass for nested layers, film return, refresh/language
replacement and Forward-loop prevention. Run:

    node --test tests/navigation.test.mjs

Desktop browser checks:

- Reproduced the production bug: Back from achievement skipped to sectors.
- Fixed preview: report Back returns to achievement; closing achievement returns
  to photo 4, not photo 1.
- Film toolbar Back restores introduction and photo 4.
- Browser refresh restores introduction and photo 4.
- English language switch, nested report Escape, toolbar Back and browser Forward
  all return one level and retain the selected photo.
- DOM media inspection with intro open: background source absent, video paused.
- Production build and whitespace validation pass.

## Verification limits / follow-up

This browser interface does not expose Lighthouse, performance-entry timings,
viewport emulation or network throttling. LCP, INP, CLS, mobile/4K visual QA and
constrained-network performance are NOT measured or certified by this audit.
No 90+ Lighthouse score is claimed. Do not infer real-user p75 compliance.

Targets remain LCP <= 2.5s, INP <= 200ms and CLS <= 0.1 at real-user p75.
Next verification: cold-cache mobile and desktop Lighthouse runs under identical
throttling before/after, device-size visual review, and consent-appropriate
real-user measurement if required. No external analytics was added.
