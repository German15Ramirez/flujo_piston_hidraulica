"use client";

import { useId, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";

export default function Accordion({ items, defaultOpen = [] }) {
  const [openIds, setOpenIds] = useState(defaultOpen);
  const uid = useId();

  const toggle = (id) =>
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [id]
    );

  return (
    <MotionConfig reducedMotion="user">
      <div className="border-t border-[#d6d1c4]">
        {items.map((item, i) => {
          const isOpen = openIds.includes(item.id);
          const btnId = `${uid}-b-${item.id}`;
          const panelId = `${uid}-p-${item.id}`;

          return (
            <div key={item.id} className="border-b border-[#d6d1c4]">
              <h3>
                <button
                  id={btnId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggle(item.id)}
                  className="flex w-full items-baseline gap-4 py-5 text-left"
                >
                  <span className="w-8 shrink-0 font-mono text-xs text-[#a39c8b]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 font-display text-lg text-[#1c1b19]">
                    {item.title}
                  </span>
                  {item.badge && (
                    <span className="hidden font-mono text-[10px] uppercase tracking-wider text-[#8a3b12] sm:inline">
                      {item.badge}
                    </span>
                  )}
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="font-mono text-lg text-[#8a3b12]"
                    aria-hidden
                  >
                    +
                  </motion.span>
                </button>
              </h3>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={panelId}
                    role="region"
                    aria-labelledby={btnId}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-3 pb-6 pl-12 pr-8 text-sm leading-relaxed text-[#4a463c]">
                      {item.content}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </MotionConfig>
  );
}