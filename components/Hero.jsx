"use client";

import { MotionConfig, motion } from "motion/react";

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function Hero() {
  return (
    <MotionConfig reducedMotion="user">
      <section id="inicio" className="border-b border-[#d6d1c4]">
        <div className="mx-auto max-w-5xl px-6 pb-20 pt-16 sm:pt-24">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          >
            <motion.p
              variants={fadeUp}
              className="font-mono text-xs uppercase tracking-[0.2em] text-[#7a7466]"
            >
              Web concisa e interactiva
            </motion.p>

            <motion.h1
              variants={fadeUp}
              className="mt-6 font-display text-6xl leading-[0.92] tracking-tight text-[#1c1b19] sm:text-8xl"
            >
              Flujo
              <br />
              <span className="italic">Pistón</span>
            </motion.h1>

            <motion.div variants={fadeUp} className="mt-10 grid gap-10 sm:grid-cols-[1fr_auto]">
              <p className="max-w-xl text-lg leading-relaxed text-[#4a463c]">
                Es un modelo idealizado en el que cada porción de fluido viaja a la
                misma velocidad y conserva su posición. Sirve para calcular
                tiempos de tránsito y rastrear sustancias disueltas.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-12 flex flex-wrap gap-x-8 gap-y-3">
              <a
                href="#simulador"
                className="group inline-flex items-baseline gap-2 border-b border-[#1c1b19] pb-1 text-sm font-medium text-[#1c1b19] transition-colors hover:text-[#8a3b12] hover:border-[#8a3b12]"
              >
                Abrir simulador
                <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
              </a>
              <a
                href="#concepto"
                className="inline-flex items-baseline gap-2 text-sm text-[#4a463c] hover:text-[#1c1b19]"
              >
                Ver definiciones
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </MotionConfig>
  );
}