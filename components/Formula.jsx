"use client";

import { InlineMath, BlockMath } from "react-katex";

export default function Formula({ tex, block = false, className = "" }) {
  return (
    <div
      className={`my-3 border-l-2 border-[#8a3b12] bg-[#ece7db] px-4 py-3 text-[#1c1b19] ${className}`}
    >
      {block ? (
        <BlockMath math={tex} />
      ) : (
        <div className="text-lg">
          <InlineMath math={tex} />
        </div>
      )}
    </div>
  );
}