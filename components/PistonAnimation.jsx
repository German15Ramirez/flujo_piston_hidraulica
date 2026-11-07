"use client";

import { useEffect, useState } from "react";
import {
  MotionConfig,
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { InlineMath } from "react-katex";

const SLICES = 10;
const SLUG = 0.22;
const TICKS = [0, 0.25, 0.5, 0.75, 1];

const sliceColor = (i) => {
  const t = i / (SLICES - 1);
  const r = Math.round(28 + (138 - 28) * t);
  const g = Math.round(27 + (59 - 27) * t);
  const b = Math.round(25 + (18 - 25) * t);
  return `rgb(${r} ${g} ${b})`;
};

const fmt = (n, d = 2) =>
  n.toLocaleString("es-GT", { minimumFractionDigits: d, maximumFractionDigits: d });

const clock = (s) => {
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}:${String(r).padStart(2, "0")}`;
};

function Slice({ index, centroid, stretch, concentration }) {
  const left = useTransform([centroid, stretch], ([c, s]) => {
    const w = SLUG * s;
    return `${(c - w / 2 + (index * w) / SLICES) * 100}%`;
  });
  const width = useTransform(stretch, (s) => `${((SLUG * s) / SLICES) * 100}%`);

  return (
    <motion.div
      aria-hidden="true"
      style={{
        left,
        width,
        opacity: concentration,
        backgroundColor: sliceColor(index),
        backgroundImage:
          "linear-gradient(180deg, rgba(255,255,255,0.18), transparent 40%, rgba(0,0,0,0.25))",
      }}
      className="absolute top-[18%] h-[64%]"
    />
  );
}

function Control({ id, label, unit, value, min, max, step, onChange }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="flex items-baseline justify-between font-mono text-xs uppercase tracking-wider text-[#7a7466]"
      >
        <span>{label}</span>
        <span className="text-[#1c1b19]">
          {fmt(value, step < 0.1 ? 2 : step < 1 ? 1 : 0)} {unit}
        </span>
      </label>
      <div className="relative mt-2">
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="relative z-10 h-1 w-full cursor-pointer appearance-none rounded-full bg-[#d6d1c4] accent-[#8a3b12]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-1.5 flex justify-between"
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} className="h-1.5 w-px bg-[#3a3833]" />
          ))}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, children, sub }) {
  return (
    <div className="border-t border-[#d6d1c4] pt-3">
      <p className="font-mono text-[11px] uppercase tracking-wider text-[#a39c8b]">{label}</p>
      <p className="mt-1 font-mono text-base text-[#f4f1ea] sm:text-lg">{children}</p>
      {sub && <p className="font-mono text-[11px] text-[#7a7466]">{sub}</p>}
    </div>
  );
}

export default function PistonAnimation() {
  const reduced = useReducedMotion();

  const [Q, setQ] = useState(0.16);
  const [b, setB] = useState(0.8);
  const [y, setY] = useState(0.4);
  const [L, setL] = useState(200);
  const [DL, setDL] = useState(5);
  const [mode, setMode] = useState("piston");
  const [playing, setPlaying] = useState(!reduced);

  const A = b * y;
  const V = Q / A;
  const t = L / V;
  const vol = A * L;
  const Pe = (V * L) / DL;

  const spread = mode === "dispersion" ? Math.min(0.9, 20 / Pe) : 0;
  const duration = Math.min(14, Math.max(3, 4 / V));

  const progress = useMotionValue(0);
  const spreadMV = useMotionValue(spread);
  const tMV = useMotionValue(t);
  useEffect(() => spreadMV.set(spread), [spread, spreadMV]);
  useEffect(() => tMV.set(t), [t, tMV]);

  useAnimationFrame((_, delta) => {
    if (!playing) return;
    progress.set((progress.get() + delta / 1000 / duration) % 1);
  });

  const centroid = useTransform(progress, (p) => -SLUG / 2 + p * (1 + SLUG));
  const stretch = useTransform([progress, spreadMV], ([p, s]) => 1 + s * 4 * Math.sqrt(p));
  const concentration = useTransform(stretch, (s) => 1 / s);
  const fade = useTransform(progress, [0, 0.04, 0.92, 1], [0, 1, 1, 0]);
  const streaks = useTransform(progress, (p) => `${p * 400}px 0`);
  const elapsed = useTransform([progress, tMV], ([p, total]) => clock(p * total));
  const barWidth = useTransform(progress, (p) => `${p * 100}%`);

  const frontX = useTransform([centroid, stretch], ([c, s]) => {
    const half = (SLUG * s) / 2;
    return `${(c + half) * 100}%`;
  });

  const timeCursor = useTransform(progress, (p) => `${Math.min(1, p) * 100}%`);

  const controlHit = useTransform([centroid, fade], ([c, f]) => {
    const dist = Math.abs(c - 0.94);
    return (1 - Math.min(1, dist * 20)) * f;
  });

  const [elapsedText, setElapsedText] = useState("0:00");
  useEffect(() => {
    const unsub = elapsed.on("change", (v) => setElapsedText(v));
    return () => unsub();
  }, [elapsed]);

  const peLevel = Pe >= 50 ? "alto" : Pe <= 5 ? "bajo" : "intermedio";
  const peText = {
    alto: "Predomina la advección: se parece mucho a un flujo pistón.",
    intermedio: "La advección y la dispersión influyen de forma importante.",
    bajo: "La dispersión longitudinal domina: la traza se ensancha.",
  }[peLevel];

  return (
    <MotionConfig reducedMotion="user">
      <div className="border border-[#1c1b19] bg-[#1c1b19] text-[#f4f1ea]">
        <header className="flex flex-col gap-4 border-b border-white/15 p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#a39c8b]">
              Canal de ensayo
            </p>
            <h3 className="mt-1 font-display text-3xl text-[#f4f1ea]">Simulador de canal</h3>
            <p className="mt-2 max-w-md text-base leading-relaxed text-[#a39c8b]">
              Una franja de colorante entra al canal, cada tono es una porción del fluido,
              es de ayuda para observar si conserva su orden y su forma.
            </p>
          </div>

          <div
            role="group"
            aria-label="Modelo de flujo"
            className="flex self-start border border-white/15 font-mono text-xs uppercase tracking-wider"
          >
            {[
              ["piston", "Pistón"],
              ["dispersion", "Dispersión"],
            ].map(([key, label], i) => (
              <button
                key={key}
                type="button"
                aria-pressed={mode === key}
                onClick={() => setMode(key)}
                className={`px-3 py-2 transition-colors ${
                  i === 0 ? "" : "border-l border-white/15"
                } ${
                  mode === key
                    ? "bg-[#f4f1ea] text-[#1c1b19]"
                    : "text-[#a39c8b] hover:text-[#f4f1ea]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </header>

        <div className="p-5 sm:p-6">
          <div className="mb-2 flex justify-between font-mono text-xs uppercase tracking-wider text-[#7a7466]">
            <span>Entrada</span>
            <span>Punto de control</span>
          </div>

          <div
            role="img"
            aria-label={
              mode === "piston"
                ? "Canal con una traza de colorante que avanza sin deformarse"
                : "Canal con una traza de colorante que avanza y se estira"
            }
            className="relative h-24 overflow-hidden border-y-2 border-[#3a3833] bg-[#151412] sm:h-32"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          >
            <motion.div
              aria-hidden="true"
              style={{
                backgroundPosition: streaks,
                backgroundImage:
                  "repeating-linear-gradient(90deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 48px)",
              }}
              className="absolute inset-0"
            />
            <motion.div
              aria-hidden="true"
              style={{ left: timeCursor }}
              className="absolute inset-y-0 w-px bg-white/20"
            />
            <motion.div style={{ opacity: fade }} className="absolute inset-0">
              {Array.from({ length: SLICES }, (_, i) => (
                <Slice
                  key={i}
                  index={i}
                  centroid={centroid}
                  stretch={stretch}
                  concentration={concentration}
                />
              ))}
            </motion.div>
            <motion.div
              aria-hidden="true"
              style={{ left: frontX, opacity: fade }}
              className="absolute inset-y-0 w-px bg-[#e8956b]"
            />
            <div aria-hidden="true" className="absolute inset-y-0 right-3 w-px bg-[#8a3b12]" />
            <div aria-hidden="true" className="absolute right-3 top-0 h-2 w-px bg-[#8a3b12]" />
            <div aria-hidden="true" className="absolute right-3 bottom-0 h-2 w-px bg-[#8a3b12]" />
            <motion.div
              aria-hidden="true"
              style={{ opacity: controlHit }}
              className="absolute inset-y-0 right-3 w-px bg-[#e8956b] shadow-[0_0_12px_#e8956b]"
            />
          </div>

          <div className="relative mt-3 h-7 font-mono text-[11px] text-[#7a7466]">
            <div aria-hidden="true" className="absolute inset-x-0 top-0 h-2">
              {Array.from({ length: 21 }, (_, i) => (
                <span
                  key={i}
                  className="absolute top-0 w-px bg-[#3a3833]"
                  style={{ left: `${i * 5}%`, height: i % 4 === 0 ? "100%" : "50%" }}
                />
              ))}
            </div>
            {TICKS.map((f) => (
              <span
                key={f}
                className="absolute top-3 -translate-x-1/2 first:translate-x-0 last:-translate-x-full"
                style={{ left: `${f * 100}%` }}
              >
                {fmt(L * f, 0)} m
              </span>
            ))}
          </div>

          <div className="mt-3 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/15">
              <motion.div style={{ width: barWidth }} className="h-px bg-[#8a3b12]" />
            </div>
            <p className="font-mono text-sm text-[#a39c8b]">
              <span className="text-lg text-[#f4f1ea]">{elapsedText}</span>
              <span className="mx-1">/</span>
              {clock(t)}
            </p>
          </div>
        </div>

        <div className="flex gap-2 px-5 pb-2 sm:px-6">
          <button
            type="button"
            onClick={() => setPlaying((v) => !v)}
            className="border border-[#f4f1ea] bg-[#f4f1ea] px-4 py-2 font-mono text-xs uppercase tracking-wider text-[#1c1b19] transition-colors hover:bg-[#8a3b12] hover:border-[#8a3b12] hover:text-[#f4f1ea]"
          >
            {playing ? "Pausar" : "Reproducir"}
          </button>
          <button
            type="button"
            onClick={() => progress.set(0)}
            className="border border-white/20 px-4 py-2 font-mono text-xs uppercase tracking-wider text-[#f4f1ea] transition-colors hover:border-[#8a3b12] hover:text-[#8a3b12]"
          >
            Reiniciar
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 px-5 pb-6 pt-4 sm:px-6 lg:grid-cols-4">
          <Stat label="Área A = b · y">{fmt(A)} m²</Stat>
          <Stat label="Velocidad V = Q / A">{fmt(V)} m/s</Stat>
          <Stat label="Tiempo t = L / V" sub={`${fmt(t / 60)} min`}>
            {fmt(t, 0)} s
          </Stat>
          <Stat label="Volumen 𝒱 = A · L">{fmt(vol, 1)} m³</Stat>
        </div>

        {mode === "dispersion" && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-5 mb-6 border-l-2 border-[#8a3b12] bg-white/[0.03] px-4 py-3 sm:mx-6"
          >
            <p className="text-base text-[#f4f1ea]">
              <span className="text-[#e8956b]">
                <InlineMath
                  math={`\\mathrm{Pe} = \\dfrac{V \\cdot L}{D_L} = ${fmt(Pe, 1).replace(",", "{,}")}`}
                />
              </span>{" "}
              <span className="text-[#a39c8b]">(Péclet {peLevel}). {peText}</span>
            </p>
            <p className="mt-1 font-mono text-xs text-[#7a7466]">
              Deformación ilustrativa; los umbrales de Péclet son una referencia.
            </p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 gap-x-8 gap-y-6 border-t border-white/15 px-5 py-6 sm:grid-cols-2 sm:px-6">
          <Control id="ctl-q" label="Caudal Q" unit="m³/s" value={Q} min={0.02} max={0.6} step={0.01} onChange={setQ} />
          <Control id="ctl-l" label="Longitud L" unit="m" value={L} min={50} max={500} step={10} onChange={setL} />
          <Control id="ctl-b" label="Ancho b" unit="m" value={b} min={0.4} max={2} step={0.05} onChange={setB} />
          <Control id="ctl-y" label="Profundidad y" unit="m" value={y} min={0.1} max={1} step={0.05} onChange={setY} />
          {mode === "dispersion" && (
            <Control id="ctl-d" label="Dispersión D_L" unit="m²/s" value={DL} min={0.1} max={50} step={0.1} onChange={setDL} />
          )}
        </div>
      </div>
    </MotionConfig>
  );
}