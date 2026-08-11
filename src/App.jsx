import { useCallback, useEffect, useRef, useState } from "react";

const LINES = [
  "소프트 코딩 클럽",
  "무료 전시회",
  "KAIST N25",
  "산업디자인학과동",
  "1층에서",
  "9월 1일부터",
  "3일까지",
  "김정훈",
  "박지민",
  "박태우",
  "신은지",
  "여남규",
  "최정윤",
  "황인태",
];

export function App() {
  const [index, setIndex] = useState(0);
  const storyRef = useRef(null);

  const moveTo = useCallback((next) => {
    const story = storyRef.current;
    if (!story) return;

    const clamped = Math.max(0, Math.min(LINES.length - 1, next));
    const scrollRange = story.offsetHeight - window.innerHeight;
    const top = story.offsetTop + (scrollRange * clamped) / (LINES.length - 1);

    window.scrollTo({
      top,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  }, []);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      const story = storyRef.current;
      if (!story) return;

      const scrollRange = story.offsetHeight - window.innerHeight;
      const progress = scrollRange > 0
        ? Math.min(1, Math.max(0, (window.scrollY - story.offsetTop) / scrollRange))
        : 0;
      const next = Math.round(progress * (LINES.length - 1));
      setIndex((current) => (current === next ? current : next));
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const onKeyDown = (event) => {
    if (["ArrowDown", "ArrowRight", "PageDown", " "].includes(event.key)) {
      event.preventDefault();
      moveTo(index + 1);
    } else if (["ArrowUp", "ArrowLeft", "PageUp"].includes(event.key)) {
      event.preventDefault();
      moveTo(index - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      moveTo(0);
    } else if (event.key === "End") {
      event.preventDefault();
      moveTo(LINES.length - 1);
    }
  };

  return (
    <main
      className="story"
      ref={storyRef}
      tabIndex={0}
      onKeyDown={onKeyDown}
      aria-label="소프트 코딩 클럽 무료 전시회 안내"
    >
      <section className="poster" aria-live="polite">
        <h1 className="sr-only">
          소프트 코딩 클럽 무료 전시회 — KAIST N25 산업디자인학과동
          1층, 9월 1일부터 3일까지
        </h1>

        <ul className="list">
          {LINES.map((line, lineIndex) => (
            <li
              key={line}
              className={lineIndex === index ? "line is-on" : "line"}
            >
              <button
                type="button"
                tabIndex={-1}
                className="hit"
                aria-current={lineIndex === index ? "step" : undefined}
                onClick={(event) => {
                  event.currentTarget.blur();
                  moveTo(lineIndex);
                }}
              >
                <span className="mark">{line}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
