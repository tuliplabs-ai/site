# tuliplabs.ai

The company website for **Tulip Labs** — the control layer for AI agents
that act: the runtime, the platform, and the lab.

A static, no-build site: plain HTML + one CSS file + Google Fonts. Nothing
to install.

## Pages

| File | Purpose |
|---|---|
| `index.html` | Home — the company umbrella: one thesis, three areas, featured work |
| `open-source.html` | The runtime — `tulip-agents`, the open-source SDK (short version; docs live at tulipagents.ai) |
| `platform.html` | The platform — Tulip, the authorization control plane |
| `research.html` | The lab — Clusiana control models and the five research programs |
| `contact.html` | Contact form (formsubmit.co → info@) |
| `legal.html` | Legal, disclaimer, license provenance |
| `styles.css` | The whole design system |
| `assets/tulip-mark-pink.png` | Logo mark / favicon |

## Preview locally

```bash
python3 -m http.server 8000     # → http://localhost:8000
```

## CI

`.github/workflows/validate.yml` gates every push/PR:

- **html5validator** over the whole root — pages must be valid HTML5
- **lychee `--offline`** — every local `href`/`src` must resolve
- **Trivy** — HIGH/CRITICAL secret scan

## Deploy

Pushes to `main` publish to GitHub Pages via
`.github/workflows/deploy.yml`. The custom domain `tuliplabs.ai` is pinned
by [`CNAME`](CNAME); point the apex DNS at GitHub Pages and enable Pages
(source: GitHub Actions) in the repo settings.

## Brand notes

- **Voice:** measured, evidence-first, mechanism before slogan. State scope
  and limits as plainly as results. A claim the product cannot prove does
  not go on the site.
- **Naming:** "Clusiana" refers to the control-model family only. The GPU
  side-channel work is "the substrate program" (the work that gave Clusiana
  its name).
- **Type:** Fraunces (serif display), Inter (body), JetBrains Mono
  (findings / code). One accent — tulip red `#D6336C` — on warm paper.

## License

Site content © 2026 Tulip Labs. Code (HTML/CSS) is available under the MIT
License — see [`LICENSE`](LICENSE).
