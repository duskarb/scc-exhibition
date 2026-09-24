# SCC: Free Exhibition

**Web identity for the Soft Coding Club Free Exhibition** - KAIST N25 1st Floor, 2026 Sept. 01-03.
**소프트코딩클럽(SCC) 자유 전시의 웹 아이덴티티.**

**[Live Site](https://duskarb.github.io/scc-exhibition/)**

<!-- TODO(여남규): 포스터 화면 스크린샷 또는 움직이는 GIF 추가 -->

The club name is treated as a moving system. Three rows of marquee words run across the screen, each built around one letter: **S**oft, **C**oding, **C**lub. The anchor word stays in every loop while its alternatives rotate in minute-long segments (soft / sweet / sonic..., coding / cosmic / crystal..., club / chaos / canvas...), so the name keeps reading as "Soft Coding Club" while never quite repeating.

## Interaction

- **Scroll or wheel** speeds the marquees up; they ease back to normal speed on their own
- **Space** or **click** pauses and resumes the animation
- **Click the wordmark** to reset everything to the beginning
- Respects `prefers-reduced-motion`, with screen-reader labels for the animated rows

## Artists

Junghun Kim, Jimin Park, Taewoo Park, Eunji Shin, Namkyu Yeo, Jeanyoon Choi, Intae Hwang

## Run locally

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
```

Pushes to `main` deploy to GitHub Pages through `.github/workflows/deploy-pages.yml`.

## Built With

React 19 · Vite
