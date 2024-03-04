import type { Metadata } from "next";
import { Rasa, Open_Sans } from "next/font/google";
import "./globals.css";
import Link from "next/link";

export const dynamicParams = false;

const rasa = Rasa({
  subsets: ["latin"],
  variable: "--rasa",
  display: "swap",
});

const open_sans = Open_Sans({
  subsets: ["latin"],
  variable: "--open-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Zack R. Davis",
  description: "Personal site of Zack R. Davis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${rasa.variable} ${open_sans.variable}`}>
      <body>
        <header>
          <Link href="/">
            <h1>Zack R. Davis</h1>
          </Link>
        </header>
        {children}
      </body>
    </html>
  );
}
