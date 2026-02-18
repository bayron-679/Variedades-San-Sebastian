import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Variedades San Sebastián",
  description: "Regalos, peluches y detalles únicos para momentos especiales.",
  icons: {
    icon: "/image.png", // El iconito de la pestaña
  },
  openGraph: {
    title: "Variedades San Sebastián",
    description: "Descubre nuestra variedad de regalos y detalles.",
    url: "https://variedades-san-sebastian.vercel.app", // Reemplaza con tu link de Vercel
    siteName: "Variedades San Sebastián",
    images: [
      {
        url: "/image.png", // La imagen que creamos que aparecerá en WhatsApp
        width: 800,
        height: 600,
      },
    ],
    locale: "es_CO",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
