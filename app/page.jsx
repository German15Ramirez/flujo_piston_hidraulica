import { Activity, Droplets, FlaskConical, Gauge, Timer, Waves } from "lucide-react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TheoryCard, { CardGrid } from "@/components/TheoryCard";
import PistonAnimation from "@/components/PistonAnimation";
import Accordion from "@/components/Accordion";
import Formula from "@/components/Formula";

const CONCEPTS = [
  {
    icon: <Waves />,
    title: "Definición",
    description: "Este es un modelo idealizado en el que el fluido se mueve longitudinalmente por una tubería o canal, en porciones consecutivas que no se mezclan entre sí.",
    tags: ["Plug flow", "Idealizado"],
  },
  {
    icon: <Gauge />,
    title: "Continuidad y velocidad",
    description: "Para flujo permanente e incompresible, el caudal es el producto del área transversal por la velocidad media.",
    formula: "Q = A \\cdot V \\qquad V = \\dfrac{Q}{A}",
  },
  {
    icon: <Timer />,
    title: "Tiempo de tránsito",
    description: "Todas las partículas tardan lo mismo en recorrer el conducto.",
    formula: "t = \\dfrac{L}{V} = \\dfrac{\\mathcal{V}}{Q}",
  },
  {
    icon: <FlaskConical />,
    title: "Transporte de sustancias",
    description: "Sin dispersión y con velocidad constante, una sustancia disuelta viaja con el agua sin deformarse.",
    formula: "\\dfrac{\\partial C}{\\partial t} + V\\,\\dfrac{\\partial C}{\\partial x} = 0",
  },
  {
    icon: <Activity />,
    title: "Dispersión longitudinal",
    description: "En sistemas reales la turbulencia ensancha la sustancia.",
    formula: "\\dfrac{\\partial C}{\\partial t} + V\\,\\dfrac{\\partial C}{\\partial x} = D_L\\,\\dfrac{\\partial^2 C}{\\partial x^2}",
  },
  {
    icon: <Droplets />,
    title: "Número de Péclet",
    description: "Compara advección y dispersión.",
    formula: "\\mathrm{Pe} = \\dfrac{V \\cdot L}{D_L}",
  },
];

const APPLICATIONS = [
  ["Canales", "Estima cuánto tarda el agua en ir de un punto a otro."],
  ["Contaminantes", "Sigue el desplazamiento de sustancias por ríos y tuberías."],
  ["Sistemas de conducción", "Analiza el agua durante su transporte."],
  ["Aguas residuales", "Representa el avance del agua en canales y reactores."],
  ["Sedimentos", "Aproxima el movimiento de material suspendido."],
  ["Calidad del agua", "Calcula el tiempo desde una descarga hasta un punto de control."],
];

const Code = ({ children }) => (
  <pre className="overflow-x-auto border-l-2 border-[#8a3b12] bg-[#ece7db] px-3 py-2 font-mono text-xs text-[#1c1b19]">
    {children}
  </pre>
);

const DETAILS = [
  {
    id: "ejemplo",
    title: "Ejemplo resuelto: canal de 200 m",
    badge: "Cálculo",
    content: (
      <>
        <p>Canal rectangular con b = 0,80 m, y = 0,40 m, Q = 0,16 m³/s y L = 200 m.</p>
        <Formula tex="A = 0{,}80 \cdot 0{,}40 = 0{,}32\ \mathrm{m^2}" block />
        <Formula tex="V = \dfrac{0{,}16}{0{,}32} = 0{,}50\ \mathrm{m/s}" block />
        <Formula tex="t = \dfrac{200}{0{,}50} = 400\ \mathrm{s} \approx 6{,}67\ \mathrm{min}" block />
      </>
    ),
  },
  {
    id: "manning",
    title: "Relación con la ecuación de Manning",
    badge: "Canales abiertos",
    content: (
      <>
        <p>
          Manning entrega la velocidad media que luego se usa para estimar el tiempo
          de tránsito.
        </p>
        <Formula tex="V = \dfrac{1}{n}\,R_h^{2/3}\,S^{1/2}" block />
        <Formula tex="R_h = \dfrac{A}{P_m}" block />
      </>
    ),
  },
  {
    id: "regimenes",
    title: "Flujo pistón y regímenes de flujo",
    content: (
      <p>
        El flujo pistón describe cómo se transporta el fluido, no si es laminar o
        turbulento.
      </p>
    ),
  },
  {
    id: "limites",
    title: "Ventajas y limitaciones",
    content: (
      <ul className="list-disc space-y-1 pl-5">
        <li>Simplifica el cálculo del tiempo de tránsito.</li>
        <li>Útil para modelos matemáticos y simulaciones hidráulicas.</li>
        <li>No considera dispersión longitudinal.</li>
        <li>No representa recirculación ni zonas muertas.</li>
      </ul>
    ),
  },
];

function Section({ id, num, title, intro, children }) {
  return (
    <section id={id} className="mx-auto max-w-5xl scroll-mt-20 px-6 py-16 sm:py-24">
      <header className="mb-10 grid gap-2 border-b border-[#d6d1c4] pb-4 sm:grid-cols-[auto_1fr] sm:items-baseline sm:gap-6">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#a39c8b]">
          § {num}
        </span>
        <div>
          <h2 className="font-display text-3xl tracking-tight text-[#1c1b19] sm:text-4xl">
            {title}
          </h2>
          {intro && <p className="mt-2 max-w-xl text-[#4a463c]">{intro}</p>}
        </div>
      </header>
      {children}
    </section>
  );
}

export default function Page() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />

        <Section id="concepto" num="01" title="Conceptos" intro="Definiciones básicas que describen el flujo pistón.">
          <CardGrid>
            {CONCEPTS.map((c, i) => <TheoryCard key={c.title} {...c} index={i} />)}
          </CardGrid>
        </Section>

        <Section id="simulador" num="02" title="Simulador" intro="Para observar claramente el comportamiento de la teoría.">
          <PistonAnimation />
        </Section>

        <Section id="aplicaciones" num="03" title="Aplicaciones">
          <CardGrid>
            {APPLICATIONS.map(([title, description], i) => (
              <TheoryCard key={title} title={title} description={description} index={i} />
            ))}
          </CardGrid>
        </Section>

        <Section id="detalles" num="04" title="Detalles técnicos" intro="Ejemplo resuelto, Manning y límites del modelo.">
          <Accordion items={DETAILS} defaultOpen={["ejemplo"]} />
        </Section>
      </main>

      <footer className="border-t border-[#d6d1c4] py-8 text-center font-mono text-xs text-[#7a7466]">
        © {new Date().getFullYear()} · Gérman Alex Ramírez Limatuj
      </footer>
    </div>
  );
}