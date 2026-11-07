"use client";

import { motion } from "motion/react";
import Formula from "@/components/Formula";

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function TheoryCard({ icon, title, description, formula, tags = [], index }) {
  return (
    <motion.article
      variants={fadeUp}
      className="group relative border-t border-[#d6d1c4] pt-6"
    >
      {index !== undefined && (
        <span className="absolute -top-3 right-0 font-mono text-xs text-[#a39c8b]">
          {String(index + 1).padStart(2, "0")}
        </span>
      )}

      <div className="flex items-start gap-3">
        {icon && (
          <span className="mt-1 text-[#8a3b12] [&>svg]:h-5 [&>svg]:w-5">{icon}</span>
        )}
        <h3 className="font-display text-2xl text-[#1c1b19]">{title}</h3>
      </div>

      <p className="mt-3 text-base leading-relaxed text-[#4a463c]">{description}</p>

      {formula && <Formula tex={formula} className="mt-5" />}

      {tags.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs uppercase tracking-wider text-[#7a7466]">
          {tags.map((t) => (
            <li key={t}>· {t}</li>
          ))}
        </ul>
      )}
    </motion.article>
  );
}

export function CardGrid({ children }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      transition={{ staggerChildren: 0.06 }}
      className="grid grid-cols-1 gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3"
    >
      {children}
    </motion.div>
  );
}