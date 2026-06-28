"use client";

import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "framer-motion";
import ReactLenis from "lenis/react";
import React, { useRef } from "react";

const Skiper28 = () => {
  const targetRef = useRef<HTMLDivElement | null>(null);

  /*
   * scrollYProgress goes 0→1 as the user scrolls through the
   * full height of `targetRef`.  With h-[300vh] there is plenty
   * of scroll distance so the animation plays smoothly.
   */
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  /* Start the text pushed down 500 px and rise to its natural position */
  const yMotionValue = useTransform(scrollYProgress, [0, 1], [500, 0]);
  const transform = useMotionTemplate`rotateX(30deg) translateY(${yMotionValue}px) translateZ(10px)`;

  return (
    <ReactLenis root>
      {/*
       * Tall container — gives the browser scroll room so
       * scrollYProgress actually changes.
       */}
      <div
        ref={targetRef}
        className="relative z-0 h-[300vh] w-screen bg-[#F7F7F7] text-zinc-900"
      >
        {/* sticky panel — stays in view for the whole scroll */}
        <div
          className="sticky top-0 flex h-screen items-center justify-center overflow-hidden bg-[#F7F7F7]"
          style={{
            transformStyle: "preserve-3d",
            perspective: "300px",
          }}
        >
          <motion.div
            style={{
              transformStyle: "preserve-3d",
              transform,
            }}
            className="w-full max-w-4xl px-6 text-center text-5xl font-bold leading-snug tracking-tighter md:text-6xl"
          >
            <span className="text-zinc-950">I am Aryan</span>{" "}
            <span className="text-zinc-800">...</span>
            {" "}just a student with a laptop ...{" "}
            way too many ideas ...{" "}
            and absolutely no plans to stop building ...{" "}
            every bug teaches something ...{" "}
            every project starts with &ldquo;what if?&rdquo; ...{" "}
            every late night ends with one more commit ...{" "}
            <span className="text-black">AI</span> ...{" "}
            <span className="text-black">design</span> ...{" "}
            <span className="text-black">code</span> ...{" "}
            creativity ...{" "}
            all mixed into one obsession ...{" "}
            if it can be imagined ...{" "}
            I&apos;ll probably try to build it ...{" "}
            welcome aboard ...{" "}
            <span className="text-black">let&apos;s create something unforgettable</span> ...
          </motion.div>
        </div>
      </div>
    </ReactLenis>
  );
};

export { Skiper28 };