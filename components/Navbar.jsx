"use client";

import { useEffect, useState } from "react";
import { MotionConfig, motion } from "motion/react";

const LINKS = [
  { href: "#concepto", label: "Concepto", num: "01" },
  { href: "#simulador", label: "Simulador", num: "02" },
  { href: "#aplicaciones", label: "Aplicaciones", num: "03" },
  { href: "#detalles", label: "Detalles", num: "04" },
];

export default function Navbar() {
  const [active, setActive] = useState("");

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => e.isIntersecting && setActive(`#${e.target.id}`)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    LINKS.forEach(({ href }) => {
      const el = document.getElementById(href.slice(1));
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <header className="sticky top-0 z-40 border-b border-[#d6d1c4] bg-[#f4f1ea]/90 backdrop-blur">
        <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <a href="#inicio" className="flex items-baseline gap-2 font-display text-lg italic">
            Flujo pistón
            <span className="font-mono text-[10px] not-italic uppercase tracking-widest text-[#7a7466]">
              / hidráulica
            </span>
          </a>

          <ul className="flex items-center gap-1 text-sm">
            {LINKS.map(({ href, label, num }) => {
              const isActive = active === href;
              return (
                <li key={href}>
                  <a
                    href={href}
                    className={`group inline-flex items-baseline gap-1.5 px-3 py-1.5 transition-colors ${
                      isActive ? "text-[#8a3b12]" : "text-[#4a463c] hover:text-[#1c1b19]"
                    }`}
                  >
                    <span className="font-mono text-[10px] text-[#a39c8b]">{num}</span>
                    <span>{label}</span>
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute inset-x-0 -bottom-[15px] h-px bg-[#8a3b12]"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </header>
    </MotionConfig>
  );
}