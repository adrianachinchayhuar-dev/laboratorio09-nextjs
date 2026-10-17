
import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Laboratorio 09 - Next.js",
  description: "Ejercicios de CSR y SSR",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
