"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(SplitText, ScrollTrigger);
}

export default function AboutText() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      if (!textRef.current || !containerRef.current) return;

      const split = new SplitText(textRef.current, {
        type: "words,chars",
        charsClass: "about-char inline-block will-change-transform",
      });

      gsap.fromTo(
        split.chars,
        {
          y: "-150%",
          opacity: 0,
        },
        {
          y: "0%",
          opacity: 1,
          ease: "power3.out",
          stagger: {
            each: 0.1,
            from: "center",
          },

          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 40%",
            end: "top 5%",
            scrub: 1.5,
          },
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="relative z-10 w-full bg-[#F7F7F7] flex items-center justify-center overflow-hidden py-16"
    >
      <h1
        ref={textRef}
        className="text-[12vw] font-black uppercase text-black tracking-tighter select-none leading-none"
      >
        ABOUT ME
      </h1>
    </div>
  );
}
