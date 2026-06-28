"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const links = [
  { title: "ABOUT ME", href: "#about" },
  { title: "WORKS", href: "#projects" },
  { title: "SERVICES", href: "#services" },
  { title: "CONNECT", href: "#contact" },
];

export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex h-28 max-w-[1700px] items-center justify-between px-10">
        {/* Logo — two-line bold wordmark like reference */}
        <Link
          href="/"
          className="navbar-logo text-[1.1rem] font-black uppercase leading-tight tracking-[-0.04em] text-black"
        >
          ARYAN
          <br />
          DEV
        </Link>

        {/* Center Nav */}
        <nav className="hidden items-center gap-16 lg:flex">
          {links.map((link) => (
            <Link
              key={link.title}
              href={link.href}
              className="navbar-link group relative text-[13px] uppercase tracking-[0.22em] text-black/80 transition-colors hover:text-black"
            >
              <span className="opacity-60">[ </span>
              <span>{link.title}</span>
              <span className="opacity-60"> ]</span>
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-black transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <Link
          href="#contact"
          className="navbar-contact flex items-center gap-2 border-b border-black pb-0.5 text-[13px] uppercase tracking-[0.18em] text-black transition-opacity hover:opacity-60"
        >
          CONTACT ME
          <ArrowUpRight size={16} strokeWidth={1.5} />
        </Link>
      </div>
    </header>
  );
}