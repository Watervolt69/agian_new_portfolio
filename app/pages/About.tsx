"use client";

import React, {
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─── Types ────────────────────────────────────────────────────────────────────

interface CharMeta {
  el: HTMLSpanElement;
  index: number;
  originX: number;
  originY: number;
  currentX: number;
  currentY: number;
  velocityX: number;
  velocityY: number;
  accelerationX: number;
  accelerationY: number;
  rotation: number;
  released: boolean;
  locked: boolean;
  mass: number;
  springStrength: number;
  damping: number;
  looseX: number;
  looseY: number;
}

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const LINES = [
  "I BUILD DIGITAL PRODUCTS,",
  "NOT JUST WEBSITES THAT",
  "LOOK GOOD.",
];

const PRIMARY_WORDS = new Set([
  "I", "BUILD", "DIGITAL", "PRODUCTS,", "LOOK", "GOOD.",
]);

const About: React.FC = () => {
  const sectionRef   = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const charRefs     = useRef<HTMLSpanElement[]>([]);
  const charMetas    = useRef<CharMeta[]>([]);

  const mousePos     = useRef({ x: -9999, y: -9999 });
  const isMouseActive = useRef(false);

  const scrollProgress = useRef(0);
  const isPinned       = useRef(false);

  // Build JSX
  const lineElements = useMemo(() => {
    let charIdx = 0;
    return LINES.map((line, li) => {
      const words = line.split(" ");
      const wordEls: React.ReactElement[] = [];

      words.forEach((word, wi) => {
        const isPrimary = PRIMARY_WORDS.has(word);
        const charEls = word.split("").map((ch, ci) => {
          const idx = charIdx++;
          return (
            <span
              key={`ch-${li}-${wi}-${ci}`}
              data-char={ch}
              data-index={idx}
              ref={(el) => { if (el) charRefs.current[idx] = el; }}
              style={{ display: "inline-block", willChange: "transform" }}
              aria-hidden="true"
            >
              {ch}
            </span>
          );
        });

        wordEls.push(
          <span
            key={`w-${li}-${wi}`}
            style={{
              display: "inline-block",
              color: isPrimary ? "rgb(250 250 250)" : "rgb(161 161 170)",
            }}
          >
            {charEls}
          </span>
        );

        if (wi < words.length - 1) {
          wordEls.push(
            <span
              key={`sp-${li}-${wi}`}
              style={{ display: "inline-block", width: "0.28em" }}
            />
          );
        }
      });

      return (
        <div key={`line-${li}`} style={{ display: "block", lineHeight: 1.0 }}>
          {wordEls}
        </div>
      );
    });
  }, []);

  const buildMeta = useCallback(() => {
    if (!sectionRef.current) return;
    const sectionRect = sectionRef.current.getBoundingClientRect();
    const r = mulberry32(101);
    const metas: CharMeta[] = [];

    charRefs.current.forEach((el, i) => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const ox = rect.left - sectionRect.left + rect.width * 0.5;
      const oy = rect.top  - sectionRect.top  + rect.height * 0.5;

      metas.push({
        el,
        index: i,
        originX: ox,
        originY: oy,
        currentX: 0,
        currentY: 0,
        velocityX: 0,
        velocityY: 0,
        accelerationX: 0,
        accelerationY: 0,
        rotation: 0,
        released: false,
        locked: true,
        mass: 0.9 + r() * 0.6,
        springStrength: 0.05 + r() * 0.04,
        damping: 0.91 + r() * 0.03, // smooth physics damping
        looseX: (r() - 0.5) * 32,
        looseY: (r() - 0.5) * 20,
      });
    });

    charMetas.current = metas;
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;

    charRefs.current = charRefs.current.filter(Boolean);
    buildMeta();

    const scrollTriggerRef = { current: null as ScrollTrigger | null };

    const tick: gsap.TickerCallback = () => {
      const progress = scrollProgress.current;
      const pinned = isPinned.current;
      const mouseActive = isMouseActive.current;

      let sectionRect: DOMRect | null = null;
      if (sectionRef.current) {
        sectionRect = sectionRef.current.getBoundingClientRect();
      }

      const sectionWidth = sectionRect?.width || 1200;
      const sectionHeight = sectionRect?.height || 800;

      const REPULSION_RADIUS = 220;
      const REPULSION_RADIUS_SQ = REPULSION_RADIUS * REPULSION_RADIUS;
      const REPULSION_FORCE = 1600.0; // Higher base force to counter distance dropoff

      charMetas.current.forEach((m) => {
        m.accelerationX = 0;
        m.accelerationY = 0;

        const charAbsX = m.originX + m.currentX;
        const charAbsY = m.originY + m.currentY;

        // 1. Mouse influence
        if (pinned && mouseActive && sectionRect) {
          const mx = mousePos.current.x - sectionRect.left;
          const my = mousePos.current.y - sectionRect.top;

          const dx = charAbsX - mx;
          const dy = charAbsY - my;
          const distSq = dx * dx + dy * dy;

          if (distSq < REPULSION_RADIUS_SQ && distSq > 9) {
            m.released = true;
            m.locked = false;

            const dist = Math.sqrt(distSq);
            // Exponential falloff based on inverse distance
            const pct = 1 - dist / REPULSION_RADIUS;
            const exponentialFalloff = pct * pct * pct; // cubic
            const force = (exponentialFalloff * REPULSION_FORCE) / (dist + 8);

            m.accelerationX += (dx / dist) * force / m.mass;
            m.accelerationY += (dy / dist) * force / m.mass;
          }
        }

        // 2. Integration
        if (m.locked) {
          m.currentX = 0;
          m.currentY = 0;
          m.rotation = 0;
          m.velocityX = 0;
          m.velocityY = 0;
        } else if (m.released) {
          // Free particle state
          m.velocityX += m.accelerationX;
          m.velocityY += m.accelerationY;

          // Damping
          m.velocityX *= m.damping;
          m.velocityY *= m.damping;

          m.currentX += m.velocityX;
          m.currentY += m.velocityY;

          // Rotation mapped to velocity (max 15 deg)
          const targetRot = Math.max(-15, Math.min(15, m.velocityX * 0.8));
          m.rotation += (targetRot - m.rotation) * 0.12;

          // Clamp inside pinned section (keep inside screen boundaries)
          const buffer = 20;
          if (charAbsX < buffer) {
            m.currentX = buffer - m.originX;
            m.velocityX *= -0.5;
          } else if (charAbsX > sectionWidth - buffer) {
            m.currentX = sectionWidth - buffer - m.originX;
            m.velocityX *= -0.5;
          }

          if (charAbsY < buffer) {
            m.currentY = buffer - m.originY;
            m.velocityY *= -0.5;
          } else if (charAbsY > sectionHeight - buffer) {
            m.currentY = sectionHeight - buffer - m.originY;
            m.velocityY *= -0.5;
          }
        } else {
          // Loose state (spring pulling to drift target)
          const driftX = m.looseX * progress;
          const driftY = m.looseY * progress;

          const springForceX = (driftX - m.currentX) * m.springStrength;
          const springForceY = (driftY - m.currentY) * m.springStrength;

          m.accelerationX += springForceX / m.mass;
          m.accelerationY += springForceY / m.mass;

          m.velocityX += m.accelerationX;
          m.velocityY += m.accelerationY;

          m.velocityX *= 0.84;
          m.velocityY *= 0.84;

          m.currentX += m.velocityX;
          m.currentY += m.velocityY;

          const targetRot = Math.max(-8, Math.min(8, m.velocityX * 0.8));
          m.rotation += (targetRot - m.rotation) * 0.15;
        }

        gsap.set(m.el, {
          x: m.currentX,
          y: m.currentY,
          rotation: m.rotation,
        });
      });
    };

    const ctx = gsap.context(() => {
      scrollTriggerRef.current = ScrollTrigger.create({
        trigger: sectionRef.current!,
        start: "top top",
        end: "+=200%",
        pin: true,
        pinSpacing: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          scrollProgress.current = self.progress;
        },
        onEnter: () => { isPinned.current = true; },
        onEnterBack: () => { isPinned.current = true; },
        onLeave: () => { isPinned.current = false; },
        onLeaveBack: () => { isPinned.current = false; },
      });

      gsap.ticker.add(tick);
    }, sectionRef);

    const onMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      isMouseActive.current = true;
    };

    const onLeave = () => {
      isMouseActive.current = false;
      charMetas.current.forEach((m) => {
        m.released = false;
        m.locked = false;
      });
    };

    const el = sectionRef.current;
    if (el) {
      el.addEventListener("mousemove", onMove, { passive: true });
      el.addEventListener("mouseleave", onLeave, { passive: true });
    }

    return () => {
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
        scrollTriggerRef.current = null;
      }
      gsap.ticker.remove(tick);
      if (el) {
        el.removeEventListener("mousemove", onMove);
        el.removeEventListener("mouseleave", onLeave);
      }
      ctx.revert();
    };
  }, [buildMeta]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-zinc-900 overflow-hidden"
      style={{ minHeight: "100vh" }}
      aria-label="About"
    >
      <p className="sr-only">
        I build digital products, not just websites that look good.
      </p>

      <div
        ref={containerRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "min(88vw, 1200px)",
          textAlign: "center",
          userSelect: "none",
          fontFamily: "inherit",
          fontWeight: 900,
          fontSize: "clamp(2.6rem, 8vw, 8.5rem)",
          letterSpacing: "-0.03em",
          lineHeight: 1.0,
          textTransform: "uppercase",
        }}
      >
        {lineElements}
      </div>

      <div
        className="absolute bottom-10 right-10 text-zinc-600"
        style={{
          fontSize: "0.6rem",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          fontWeight: 500,
          pointerEvents: "none",
        }}
      >
        Full Stack · Gen AI
      </div>
    </section>
  );
};

export default About;