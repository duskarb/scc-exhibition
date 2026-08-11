import { useEffect, useRef, useState } from "react";

const S = [
  "soft", "super", "sour", "sudden", "secret", "silent", "sunny", "stellar", "sweet", "sleepy", "smart", "sacred", "salty", "savage", "scarlet", "serene", "shy", "sizzling", "slick", "smooth", "sonic", "spicy", "spooky", "stormy", "sugar", "sunset", "swift", "synthetic", "saffron", "scarce", "seaside", "shadow", "shimmering", "sparkling", "spring", "starlit", "steady", "stubborn", "subtle", "sultry", "sapphire", "satin", "scenic", "scrappy", "seismic", "sentimental", "serious", "shaggy", "shameless", "sharp", "sheer", "shining", "shivering", "silky", "silver", "simple", "sincere", "sizzle", "skeptic", "sketchy", "skyward", "slender", "sleek", "slippery", "slothful", "sluggish", "snappy", "snowy", "solar", "solemn", "solid", "somber", "soulful", "spacey", "spartan", "spectral", "speedy", "spineless", "spiral", "splendid", "spotless", "sprightly", "sprinkled", "stainless", "stale", "static", "steamy", "sterling", "sticky", "stoic", "stony", "stray", "strict", "striking", "stringy", "stubby", "stunning", "sturdy", "suave", "sublime", "sullen", "summer", "sunlit", "superb", "supreme", "surreal", "suspicious", "svelte", "swampy", "sweaty", "swirling", "syrupy", "sorry", "salted", "strawberry", "sesame", "slightly", "system", "strange", "seven", "stay", "something", "semi"
];

const C1 = [
  "coding", "cannon", "crispy", "calm", "coffee", "cosmic", "cotton", "cloud", "crimson", "crystal", "cozy", "crazy", "chocolate", "cherry", "cyber", "candid", "caramel", "cascading", "celestial", "ceramic", "chaotic", "charcoal", "cheerful", "chilly", "chrome", "cinnamon", "citrus", "classic", "clever", "cobalt", "colossal", "copper", "coral", "creamy", "curious", "cursed", "custom", "cactus", "cadmium", "candied", "caffeine", "cambric", "canary", "candle", "canyon", "capital", "captive", "cardinal", "carefree", "careless", "carnal", "carousel", "carbon", "casual", "catchy", "caustic", "cavalier", "celadon", "cellular", "cement", "central", "cerebral", "champagne", "chalk", "charming", "cheeky", "cheesy", "chestnut", "chiffon", "chime", "china", "chivalrous", "chunky", "cider", "cliffside", "climactic", "clingy", "clockwork", "closet", "clumsy", "coastal", "cocoa", "coded", "coffin", "coherent", "coiled", "colorful", "comic", "compact", "complex", "concave", "concrete", "condensed", "conic", "copious", "cordial", "corny", "cottony", "crackling", "crafty", "cranky", "creaky", "credible", "creeping", "cricket", "crinkled", "crisp", "crooked", "crumbly", "crunchy", "cryptic", "cubic", "cuddly", "cunning", "cupric", "curly", "cream", "cash", "cannot", "cheap", "corn", "chicken", "cheese", "coca", "cold", "creative", "completely", "cats", "crying", "confused", "can", "controlled", "code"
];

const C2 = [
  "club", "chaos", "company", "cookie", "cat", "cake", "candy", "corner", "code", "canvas", "carnival", "castle", "cavern", "charm", "choir", "circuit", "city", "clan", "clash", "cliff", "coast", "comet", "command", "compass", "concept", "cosmos", "cottage", "council", "country", "crew", "crown", "cult", "current", "cycle", "crush", "cabin", "cable", "cactus", "cadence", "cafe", "cage", "caldera", "calendar", "camp", "canal", "candle", "cannon", "canoe", "canopy", "canyon", "cap", "cape", "capsule", "caravan", "cardinal", "cargo", "carnation", "carousel", "carpet", "cart", "cascade", "casino", "catalog", "catcher", "cathedral", "cauldron", "cavalcade", "cellar", "cello", "cemetery", "census", "cereal", "chalice", "chamber", "channel", "chapel", "charter", "chateau", "checkpoint", "chef", "chemistry", "cherub", "chessboard", "chestnut", "chevron", "chimney", "choice", "chord", "chorus", "chronicle", "cipher", "circle", "circus", "citadel", "clarinet", "classroom", "clearing", "climax", "cloak", "clover", "cluster", "coalition", "cobweb", "cocoon", "collage", "collar", "colony", "column", "comb", "comedy", "commotion", "commune", "concert", "condor", "confetti", "constellation", "continent", "contour", "convoy", "copper", "corridor", "cove", "coven", "crater", "crayon", "creature", "creek", "crescent", "crest", "crevice", "crossing", "cruise", "crypt", "crystal", "cube", "cupboard", "curtain", "cyclone", "cylinder", "cymbal", "chicken", "coffee", "crunch", "compete", "chips", "cutlet", "crackers", "coke", "cola", "carbonara", "crisis", "crashed", "corrupted", "coding", "contest", "create", "change"
];

const makeMinuteSegments = (items, anchor, targetSegmentSize = 12) => {
  const fillers = items.filter((item) => item !== anchor);
  const preferredLead = fillers.shift();
  const segmentCount = Math.max(1, Math.ceil(fillers.length / targetSegmentSize));
  const groups = Array.from({ length: segmentCount }, () => []);
  const weights = Array.from({ length: segmentCount }, () => 0);

  [...fillers]
    .sort((a, b) => b.length - a.length)
    .forEach((word) => {
      const lightest = weights.indexOf(Math.min(...weights));
      groups[lightest].push(word);
      weights[lightest] += word.length + 1;
    });

  groups[0].unshift(preferredLead);

  return groups.map((group) => [group[0], anchor, ...group.slice(1)]);
};

const S_MINUTE_SEGMENTS = makeMinuteSegments(S, "soft");
const C1_MINUTE_SEGMENTS = makeMinuteSegments(C1, "coding");
const C2_MINUTE_SEGMENTS = makeMinuteSegments(C2, "club");

const NAMES = [
  "Junghun Kim", "Jimin Park", "Taewoo Park", "Eunji Shin",
  "Namkyu Yeo", "Jeanyoon Choi", "Intae Hwang"
];

function Marquee({ items, segments, speed = 66, segmentSeconds, label, className = "", paused, resetSignal, speedMultiplierRef }) {
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const loopRef = useRef(null);
  const offsetRef = useRef(0);
  const pausedRef = useRef(paused);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    offsetRef.current = 0;
    if (trackRef.current) {
      trackRef.current.style.transform = "translate3d(0, 0, 0)";
    }
  }, [resetSignal]);

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    const loop = loopRef.current;
    if (!viewport || !track || !loop) return undefined;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let previous = performance.now();
    let loopWidth = loop.scrollWidth;
    let segmentWidths = [];
    let segmentEnds = [];
    let active = null;

    const activateSecondVisible = () => {
      const edge = viewport.getBoundingClientRect().left;
      const candidates = track.querySelectorAll("[data-marquee-word]");
      const visible = [];

      for (const candidate of candidates) {
        if (candidate.getBoundingClientRect().right > edge + 1) {
          visible.push(candidate);
          if (visible.length === 2) break;
        }
      }

      const next = visible[1] ?? visible[0] ?? null;

      if (active !== next) {
        active?.classList.remove("is-leading");
        next?.classList.add("is-leading");
        active = next;
      }
    };

    const tick = (now) => {
      const delta = Math.min((now - previous) / 1000, 0.05);
      previous = now;

      if (!reduceMotion.matches && !pausedRef.current && loopWidth > 0) {
        const multiplier = speedMultiplierRef.current;
        let pixelsPerSecond = speed;

        if (segmentSeconds && segmentWidths.length) {
          const phase = offsetRef.current % loopWidth;
          const segmentIndex = segmentEnds.findIndex((end) => phase < end);
          const activeSegment = segmentIndex === -1
            ? segmentWidths.length - 1
            : segmentIndex;
          pixelsPerSecond = segmentWidths[activeSegment] / segmentSeconds;
        }

        offsetRef.current = (offsetRef.current + pixelsPerSecond * multiplier * delta) % loopWidth;
        track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
      }

      activateSecondVisible();
      frame = requestAnimationFrame(tick);
    };

    const resize = new ResizeObserver(() => {
      const segmentNodes = loop.querySelectorAll("[data-marquee-segment]");

      if (segmentNodes.length) {
        segmentNodes.forEach((segment) => segment.style.removeProperty("width"));
        segmentWidths = Array.from(segmentNodes, (segment) => (
          segment.getBoundingClientRect().width
        ));
        let cumulativeWidth = 0;
        segmentEnds = segmentWidths.map((width) => {
          cumulativeWidth += width;
          return cumulativeWidth;
        });
      }

      loopWidth = loop.scrollWidth;
      offsetRef.current %= Math.max(loopWidth, 1);
    });

    resize.observe(viewport);
    activateSecondVisible();
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      active?.classList.remove("is-leading");
    };
  }, [items, segmentSeconds, segments, speed, speedMultiplierRef]);

  const renderWords = (copy = false) => {
    if (segments) {
      return segments.map((segment, segmentIndex) => (
        <div className="marquee__segment" data-marquee-segment key={`${copy ? "copy-" : ""}segment-${segmentIndex}`}>
          {segment.map((item, itemIndex) => (
            <span className="marquee__word" data-marquee-word key={`${copy ? "copy-" : ""}${segmentIndex}-${item}-${itemIndex}`}>{item}</span>
          ))}
        </div>
      ));
    }

    return items.map((item, index) => (
      <span className="marquee__word" data-marquee-word key={`${copy ? "copy-" : ""}${item}-${index}`}>{item}</span>
    ));
  };

  return (
    <div className={`marquee ${className}`} ref={viewportRef} aria-label={label}>
      <div className="marquee__track" ref={trackRef} aria-hidden="true">
        <div className="marquee__loop" ref={loopRef}>
          {renderWords()}
        </div>
        <div className="marquee__loop">
          {renderWords(true)}
        </div>
      </div>
    </div>
  );
}

export function App() {
  const [paused, setPaused] = useState(false);
  const [resetSignal, setResetSignal] = useState(0);
  const speedMultiplierRef = useRef(1);

  useEffect(() => {
    const togglePause = (event) => {
      const target = event.target;
      const isInteractive = target instanceof Element
        && target.closest("button, a, input, textarea, select, [contenteditable='true']");

      if (event.code !== "Space" || event.repeat || isInteractive) return;

      event.preventDefault();
      setPaused((current) => !current);
    };

    window.addEventListener("keydown", togglePause);
    return () => window.removeEventListener("keydown", togglePause);
  }, []);

  useEffect(() => {
    let frame = 0;
    let lastScrollY = window.scrollY;

    const addSpeed = (amount) => {
      speedMultiplierRef.current = Math.min(
        4,
        Math.max(speedMultiplierRef.current, 1 + Math.abs(amount) / 70),
      );
    };

    const handleWheel = (event) => addSpeed(event.deltaY || event.deltaX);
    const handleScroll = () => {
      const nextScrollY = window.scrollY;
      addSpeed(nextScrollY - lastScrollY);
      lastScrollY = nextScrollY;
    };

    const settleSpeed = () => {
      speedMultiplierRef.current += (1 - speedMultiplierRef.current) * 0.065;
      if (Math.abs(speedMultiplierRef.current - 1) < 0.005) {
        speedMultiplierRef.current = 1;
      }
      frame = requestAnimationFrame(settleSpeed);
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    frame = requestAnimationFrame(settleSpeed);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const resetExperience = () => {
    speedMultiplierRef.current = 1;
    setPaused(false);
    setResetSignal((current) => current + 1);
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  };

  const toggleOnCanvasClick = (event) => {
    if (event.target.closest?.("button, a, input, textarea, select")) return;
    setPaused((current) => !current);
  };

  return (
    <main className="poster" data-paused={paused} aria-keyshortcuts="Space" onClick={toggleOnCanvasClick}>
      <h1 className="sr-only">Soft Coding Club Free Exhibition</h1>
      <p className="sr-only" aria-live="polite">{paused ? "Animation paused" : "Animation playing"}</p>

      <section className="word-field" aria-label="Soft Coding Club word variations">
        <Marquee segments={S_MINUTE_SEGMENTS} segmentSeconds={60} label="Soft word variations" paused={paused} resetSignal={resetSignal} speedMultiplierRef={speedMultiplierRef} />
        <Marquee segments={C1_MINUTE_SEGMENTS} segmentSeconds={60} label="Coding word variations" paused={paused} resetSignal={resetSignal} speedMultiplierRef={speedMultiplierRef} />
        <Marquee segments={C2_MINUTE_SEGMENTS} segmentSeconds={60} label="Club word variations" paused={paused} resetSignal={resetSignal} speedMultiplierRef={speedMultiplierRef} />
      </section>

      <section className="exhibition-info" aria-label="Exhibition details">
        <p>(SCC)</p>
        <p>:Free Exhibition</p>
        <p>KAIST N25 1st Floor</p>
        <p>2026 Sept. 01–03</p>
      </section>

      <section className="artists" aria-label="Participating artists">
        <Marquee items={NAMES} speed={48} label={`Artists: ${NAMES.join(", ")}`} className="artists__marquee" paused={paused} resetSignal={resetSignal} speedMultiplierRef={speedMultiplierRef} />
      </section>

      <button className="wordmark" type="button" onClick={resetExperience} aria-label="Return animation to the beginning">
        <span>Soft</span><span>Coding</span><span>Club</span>
      </button>
    </main>
  );
}
