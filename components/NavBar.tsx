"use client";

import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { TextRoll } from "@/components/ui/skiper-ui/skiper58";

if (typeof window !== "undefined") {
  gsap.registerPlugin(SplitText);
}

export default function Navbar() {
  const containerRef = useRef<HTMLDivElement>(null);
  const navbarRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const menuLabelRef = useRef<HTMLSpanElement>(null);
  const closeLabelRef = useRef<HTMLSpanElement>(null);
  const iconRef = useRef<HTMLSpanElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const menuTl = useRef<gsap.core.Timeline | null>(null);

  useGSAP(() => {
    if (!overlayRef.current || !menuLabelRef.current || !closeLabelRef.current || !iconRef.current) return;

    gsap.set(overlayRef.current, {
      clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)",
      autoAlpha: 0,
      pointerEvents: "none"
    });

    gsap.set(closeLabelRef.current, { yPercent: 100, opacity: 0 });
    gsap.set(menuLabelRef.current, { yPercent: 0, opacity: 1 });
    gsap.set(iconRef.current, { rotate: 0 });

    const menuItems = gsap.utils.toArray(".menu-item");
    const infoItems = gsap.utils.toArray(".info-item");
    const footerItems = gsap.utils.toArray(".footer-item");

    gsap.set(menuItems, { y: 50, autoAlpha: 0 });
    gsap.set(infoItems, { y: 30, autoAlpha: 0 });
    gsap.set(footerItems, { autoAlpha: 0 });

    const tl = gsap.timeline({ paused: true });

    tl.to(overlayRef.current, {
      clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
      autoAlpha: 1,
      pointerEvents: "auto",
      duration: 0.85,
      ease: "power4.inOut"
    })
    .to(menuLabelRef.current, {
      yPercent: -100,
      opacity: 0,
      duration: 0.2,
      ease: "power2.in"
    }, 0)
    .to(closeLabelRef.current, {
      yPercent: 0,
      opacity: 1,
      duration: 0.2,
      ease: "power2.out"
    }, 0.2)
    .to(iconRef.current, {
      rotate: 45,
      duration: 0.4,
      ease: "power2.inOut"
    }, 0)
    .to(menuItems, {
      y: 0,
      autoAlpha: 1,
      duration: 0.6,
      stagger: 0.08,
      ease: "power3.out"
    }, "-=0.35")
    .to(infoItems, {
      y: 0,
      autoAlpha: 1,
      duration: 0.6,
      stagger: 0.06,
      ease: "power3.out"
    }, "-=0.45")
    .to(footerItems, {
      autoAlpha: 1,
      duration: 0.5,
      ease: "power2.out"
    }, "-=0.3");

    menuTl.current = tl;
  }, { scope: containerRef });

  useGSAP(() => {
    if (navbarRef.current) {
      gsap.fromTo(
        navbarRef.current,
        { y: -100, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 1.2, ease: "power3.out" }
      );
    }
  }, { scope: containerRef });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      menuTl.current?.play();
    } else {
      document.body.style.overflow = "";
      menuTl.current?.reverse();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div ref={containerRef}>
      <header className="fixed inset-x-0 top-0 z-50 pointer-events-none" ref={navbarRef}>
        <div className="mx-auto flex h-28 max-w-[1700px] items-center justify-between px-10 w-full">
          <Link
            href="/"
            className="navbar-logo text-[1.1rem] font-black uppercase leading-tight tracking-[-0.04em] text-black pointer-events-auto"
          >
            ARYAN
          </Link>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="navbar-contact flex items-center gap-3 border-b pb-0.5 text-[13px] uppercase tracking-[0.18em] transition-opacity hover:opacity-60 cursor-pointer text-black border-black pointer-events-auto"
          >
            <span className="relative overflow-hidden inline-flex h-[1.2em] w-[45px] items-center">
              <span ref={menuLabelRef} className="absolute left-0">
                MENU
              </span>
              <span ref={closeLabelRef} className="absolute left-0">
                CLOSE
              </span>
            </span>
            <span ref={iconRef} className="relative w-3.5 h-3.5 flex items-center justify-center">
              <span className="absolute h-[1.5px] w-3.5 bg-black" />
              <span className="absolute h-3.5 w-[1.5px] bg-black" />
            </span>
          </button>
        </div>
      </header>

      <div
        ref={overlayRef}
        className="fixed inset-0 z-40 bg-[#F7F7F7] text-black px-10 pt-36 pb-12 flex flex-col justify-between overflow-y-auto invisible opacity-0"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center flex-1 max-w-[1700px] mx-auto w-full my-auto">
          <div className="flex flex-col justify-center">
            <span className="text-[0.65rem] uppercase tracking-[0.45em] text-black/40 mb-6 block menu-item">
              NAVIGATION
            </span>
            <ul className="flex flex-col gap-6">
              {[
                { name: "Home", href: "/" },
                { name: "About", href: "#about" },
                { name: "Projects", href: "#projects" },
                { name: "Services", href: "#services" },
                { name: "Contact", href: "#contact" }
              ].map((item) => (
                <li key={item.name} className="menu-item">
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="inline-block text-4xl md:text-6xl font-black uppercase leading-none tracking-tight hover:text-black/80 transition-colors"
                  >
                    <TextRoll className="text-4xl md:text-6xl font-black uppercase tracking-tight text-black">
                      {item.name}
                    </TextRoll>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col justify-center md:pl-20 border-t md:border-t-0 md:border-l border-black/10 pt-8 md:pt-0">
            <div className="space-y-8">
              <div className="info-item flex items-center gap-3">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs uppercase tracking-[0.3em] text-black/50">
                  AVAILABLE FOR FREELANCE
                </span>
              </div>

              <div className="info-item">
                <span className="text-[0.65rem] uppercase tracking-[0.45em] text-black/40 block mb-2">
                  SAY HELLO
                </span>
                <a
                  href="mailto:xparyan68@gmail.com"
                  className="text-lg md:text-2xl font-black uppercase tracking-wide hover:opacity-60 transition-opacity text-black"
                >
                  xparyan68@gmail.com
                </a>
              </div>

              <div className="info-item">
                <span className="text-[0.65rem] uppercase tracking-[0.45em] text-black/40 block mb-4">
                  SOCIALS
                </span>
                <div className="flex flex-wrap gap-6">
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-black/60 hover:text-black transition-colors"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                    </svg>
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-black/60 hover:text-black transition-colors"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-black/60 hover:text-black transition-colors"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-black/60 hover:text-black transition-colors"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-[1700px] mx-auto w-full flex flex-col sm:flex-row justify-between items-center border-t border-black/10 pt-6 footer-item">
          <span className="text-[0.65rem] tracking-[0.3em] text-black/30 uppercase">
            © 2026 ARYAN. ALL RIGHTS RESERVED.
          </span>
          <span className="text-[0.65rem] tracking-[0.3em] text-black/30 uppercase mt-2 sm:mt-0">
            BASED IN INDIA
          </span>
        </div>
      </div>
    </div>
  );
}
