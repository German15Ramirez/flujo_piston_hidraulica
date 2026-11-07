import "./globals.css";
import "katex/dist/katex.min.css";
import { Fraunces, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "600", "700"],
});

const sans = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600"],
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

export const metadata = {
  title: "Flujo Pistón",
  description:
    "Flujo pistón: definición, ecuaciones, simulador y aplicaciones.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${display.variable} ${sans.variable} ${mono.variable} text-[18px] sm:text-[19px] lg:text-[20px]`}>
  <body className="min-h-screen bg-[#f4f1ea] text-[#1c1b19] antialiased">
    {children}
  </body>
</html>
  );
}