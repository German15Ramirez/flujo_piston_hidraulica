"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";

const LINKS = [
  { href: "#concepto", label: "Concepto", num: "01" },
  { href: "#simulador", label: "Simulador", num: "02" },
  { href: "#aplicaciones", label: "Aplicaciones", num: "03" },
  { href: "#detalles", label: "Detalles", num: "04" },
];

export default function Navbar() {
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

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
      <header className="sticky top-0 z-50 border-b border-[#d6d1c4] bg-[#f4f1ea]/95 backdrop-blur">
        <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <a
            href="#inicio"
            onClick={() => setOpen(false)}
            className="flex items-baseline gap-2 font-display text-lg italic text-[#1c1b19] sm:text-xl"
          >
            Flujo pistón
            <span className="hidden font-mono text-[10px] not-italic uppercase tracking-widest text-[#7a7466] sm:inline">
              / notas
            </span>
          </a>

          <ul className="hidden items-center gap-1 text-base md:flex">
            {LINKS.map(({ href, label, num }) => {
              const isActive = active === href;
              return (
                <li key={href} className="relative">
                  <a
                    href={href}
                    className={`group inline-flex items-baseline gap-1.5 px-3 py-1.5 transition-colors ${
                      isActive
                        ? "text-[#8a3b12]"
                        : "text-[#4a463c] hover:text-[#1c1b19]"
                    }`}
                  >
                    <span className="font-mono text-[10px] text-[#a39c8b]">{num}</span>
                    <span>{label}</span>
                  </a>
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute inset-x-3 -bottom-[1px] h-px bg-[#8a3b12]"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </li>
              );
            })}
          </ul>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            aria-controls="menu-movil"
            className="relative z-50 flex h-10 w-10 items-center justify-center border border-[#d6d1c4] md:hidden"
          >
            <span className="flex w-5 flex-col gap-[5px]" aria-hidden="true">
              <motion.span
                className="block h-px w-full bg-[#1c1b19]"
                animate={open ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.25 }}
              />
              <motion.span
                className="block h-px w-full bg-[#1c1b19]"
                animate={{ opacity: open ? 0 : 1 }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="block h-px w-full bg-[#1c1b19]"
                animate={open ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.25 }}
              />
            </span>
          </button>
        </nav>

        <AnimatePresence>
          {open && (
            <motion.div
              id="menu-movil"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-0 top-full border-b border-[#d6d1c4] bg-[#f4f1ea] md:hidden"
            >
              <ul className="flex flex-col px-4 py-2">
                {LINKS.map(({ href, label, num }) => {
                  const isActive = active === href;
                  return (
                    <li key={href}>
                      <a
                        href={href}
                        onClick={() => setOpen(false)}
                        className={`flex items-baseline gap-3 border-b border-[#e4dfd1] py-3 transition-colors last:border-0 ${
                          isActive
                            ? "text-[#8a3b12]"
                            : "text-[#4a463c] hover:text-[#1c1b19]"
                        }`}
                      >
                        <span className="font-mono text-[11px] text-[#a39c8b]">
                          {num}
                        </span>
                        <span className="font-display text-xl">{label}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </MotionConfig>
  );
}