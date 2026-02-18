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
  description: "Variedad de Productos, Regalos y Detalles.",
  openGraph: {
    title: "Variedades San Sebastián",
    description: "Encuentra gran variedad de productos, peluches y detalles que necesitas para el regalo perfecto hoy mismo.",
    images: ["/image.png"], // Una foto linda de tu tienda
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
