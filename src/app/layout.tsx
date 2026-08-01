import type { Metadata } from "next";
import { Barlow_Condensed, Inter, Space_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-barlow-condensed",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
});

export const metadata: Metadata = {
  title: "Bikers Demand — Motorcycle Accessories & Parts | Bangladesh",
  description:
    "Shop motorcycle gear, genuine parts, electronics, and accessories tailored specifically for your bike in Bangladesh. Fast nationwide cash on delivery.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${barlowCondensed.variable} ${inter.variable} ${spaceMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("bd_theme")||"dark";document.documentElement.setAttribute("data-theme",t);}catch(e){}})();`,
          }}
        />
      </head>
      <body className="bg-asphalt text-off-white min-h-screen antialiased flex flex-col">
        {children}
      </body>
    </html>
  );
}
