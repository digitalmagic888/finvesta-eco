# Wix clone asset manifest

This folder contains a static copy of `finvesta-home.html` with Wix-hosted image references rewritten to local files.

- `index.html`: static Wix-exported homepage shell with local image/favicon references.
- `favicon.png`: reusable 192x192 favicon symlinked to `../favicon.png`.
- `assets/`: symlinked local image aliases that point at the already-committed files in `public/assets/`, avoiding duplicate binary files in this PR.
- `public/favicon.png`: repository-level favicon symlinked to `public/assets/087371ebd736.png` for reuse by Next metadata and static HTML.

Note: `static.parastorage.com` and `browser.sentry-cdn.com` script/style downloads returned HTTP 403 through the current proxy during localization, so those third-party runtime URLs remain in `index.html`.
