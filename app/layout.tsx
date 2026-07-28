import type { Metadata } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import './globals.css';

// Variable font. Beyond the default wght axis, this pulls in the optional
// opsz (optical size), SOFT (softness of terminals) and WONK (wonky/alternate
// forms) axes so the headline can be pushed to a sharp, display-tuned
// rendering via font-variation-settings — see Hero.tsx.
const fraunces = Fraunces({
  subsets: ['latin'],
  axes: ['opsz', 'SOFT', 'WONK'],
  variable: '--font-display',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Built to Outlast | Premium Roofing',
  description:
    "Precision roofing for homeowners and builders who don't compromise on materials or craft.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
