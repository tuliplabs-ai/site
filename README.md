# tuliplabs.ai

The company website for **Tulip Labs** — an independent lab working at the
seam of agentic AI and security research.

A static, no-build site: plain HTML + one CSS file + Google Fonts. Nothing
to install.

## Pages

| File | Purpose |
|---|---|
| `index.html` | Home — positioning, the two pillars, featured work, principles |
| `research.html` | Security research — Clusiana, the research agenda, disclosure |
| `open-source.html` | Tulip, the open-source SDK |
| `styles.css` | The whole design system |
| `assets/tulip-mark.svg` | Logo mark / favicon |

## Preview locally

```bash
python3 -m http.server 8000     # → http://localhost:8000
```

## Deploy

Pushes to `main` publish to GitHub Pages via
`.github/workflows/deploy.yml`. The custom domain `tuliplabs.ai` is pinned
by [`CNAME`](CNAME); point the apex DNS at GitHub Pages and enable Pages
(source: GitHub Actions) in the repo settings.

## Brand notes

- **Voice:** measured, evidence-first. State scope and limits as plainly as
  results. No hype.
- **Type:** Fraunces (serif display), Inter (body), JetBrains Mono
  (findings / code). One accent — tulip red `#D6336C` — on warm paper.
- Email addresses (`hello@`, `security@`) are placeholders; wire up real
  inboxes before launch.

## License

Site content © 2026 Tulip Labs. Code (HTML/CSS) is available under the MIT
License — see [`LICENSE`](LICENSE).
