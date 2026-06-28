"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import HeroImage from "./HeroImage";

/* ── Character-split component ─────────────────────────────────
   Wraps every character in its own inline-block <span> so GSAP
   can stagger them individually.  Spaces become non-breaking so
   they still render correctly as inline-block elements.
───────────────────────────────────────────────────────────────── */
function SplitChars({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <span className={className} aria-label={text} style={{ display: "block" }}>
      {text.split("").map((ch, i) => (
        <span
          key={i}
          className="hero-char"
          style={{ display: "inline-block" }}
        >
          {ch === " " ? "\u00A0" : ch}
        </span>
      ))}
    </span>
  );
}

/* ── Hero ────────────────────────────────────────────────────── */
const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      /* Master timeline — everything sequenced from page open */
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl
        /* 1. Heading chars rise from positive-Y, staggered from center out */
        .from(".hero-char", {
          y: 60,
          opacity: 0,
          duration: 1.2,
          stagger: { each: 0.03, from: "center" },
        })

        /* 2. Photo slides up gently */
        .from(
          ".hero-img-wrap",
          { y: 60, opacity: 0, duration: 1.1, ease: "power2.out" },
          "-=0.45"
        )

        /* 3. Services lines stagger in from below */
        .from(
          ".hero-service",
          { y: 24, opacity: 0, duration: 0.55, stagger: 0.1 },
          "-=0.75"
        )

        /* 4. Right-col top label */
        .from(
          ".hero-based",
          { y: 16, opacity: 0, duration: 0.45 },
          "-=0.55"
        )

        /* 5. Recent project block */
        .from(
          ".hero-project",
          { y: 16, opacity: 0, duration: 0.45 },
          "-=0.3"
        )

        /* 6. Description + footer fade */
        .from(
          ".hero-desc, .hero-footer",
          { opacity: 0, y: 10, duration: 0.5, stagger: 0.12 },
          "-=0.2"
        );
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="bg-[#F7F7F7] pt-28">

      {/* ── TITLE ─────────────────────────────────────────────── */}
      <div className="px-10">
        <h1
          className="select-none font-black uppercase leading-[0.88] tracking-[-0.04em] text-black"
          style={{ fontSize: "clamp(4.5rem, 14.5vw, 17rem)" }}
        >
          <SplitChars text="FULL STACK DEVELOPER" />
        </h1>
      </div>

      {/* ── CONTENT ROW ───────────────────────────────────────── */}
      {/*
        col-span-3  │  col-span-5  │  col-span-4
        services    │    photo     │  based-in / recent
      */}
      <div className="mt-6 grid grid-cols-12 px-10">

        {/* — Services — shifted right with pl, raised with justify-start pt */}
        <div className="col-span-3 flex flex-col justify-start pt-10 pl-8 pr-4">
          {[
            "/WEB DEVELOPMENT",
            "/AI APPLICATIONS",
            "/UI ENGINEERING",
            "/MOBILE APPS",
          ].map((item) => (
            <span
              key={item}
              className="hero-service block text-[1.2rem] font-black uppercase leading-[1.25] tracking-tight text-black"
            >
              {item}
            </span>
          ))}
        </div>

        {/* — Photo — aligned to the right of its col */}
        <div className="col-span-5 flex justify-end pr-4">
          <HeroImage />
        </div>

        {/* — Right: based-in top, recent project bottom — shifted right */}
        <div className="col-span-4 flex flex-col justify-between pl-16 pb-10 pt-4">
          <p className="hero-based text-xs uppercase tracking-[0.65em] text-black/50">
            BASED &nbsp; IN &nbsp; INDIA
          </p>

          <div className="hero-project flex flex-col items-start">
            <span className="text-[0.65rem] uppercase tracking-[0.45em] text-black/50">
              RECENT PROJECT ↘
            </span>
            <h2
              className="mt-2 font-black uppercase leading-none tracking-[-0.05em] text-black"
              style={{ fontSize: "clamp(2rem, 4vw, 3.75rem)" }}
            >
              ISTM
            </h2>
          </div>
        </div>

      </div>

      {/* ── DESCRIPTION ───────────────────────────────────────── */}
      <div className="hero-desc flex justify-center px-10 pb-8 pt-10">
        <p className="max-w-md text-center text-[0.72rem] font-semibold uppercase leading-loose tracking-[0.18em] text-black/55">
          I&apos;m Aryan — a full stack developer building modern digital
          experiences using React, Next.js, GSAP and AI.
        </p>
      </div>

      {/* ── FOOTER ────────────────────────────────────────────── */}
      <div className="hero-footer flex items-end justify-between px-10 pb-14 pt-2">
        <div>
          <p className="text-[0.65rem] uppercase tracking-[0.42em] text-black/50">
            AVAILABLE FOR COLLABORATION ↗
          </p>
          <p className="mt-3 text-xl font-black tracking-tight text-black">
            aryan.dev@gmail.com
          </p>
        </div>
        <span className="text-[0.62rem] uppercase tracking-[0.5em] text-black/40">
          SCROLL ↓
        </span>
      </div>

    </section>
  );
};

export default Hero;