import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/components/Providers';

export const metadata: Metadata = {
  title: 'GIGADROP — Your next world. Ready to drop. | PC Games by the GB in Cairo',
  description:
    'Pick the PC games you want. Pay only 1 EGP per gigabyte. We load them safely onto your hard drive and get you playing in 1–2 days across Cairo, Egypt.',
  keywords: [
    'GIGADROP',
    'PC Games Cairo',
    'Games by the Gigabyte Egypt',
    '1 EGP per GB games',
    'PC Games Marketplace Egypt',
  ],
  openGraph: {
    title: 'GIGADROP — Your next world. Ready to drop.',
    description: '192+ handpicked PC games loaded onto your hard drive at 1 EGP per GB across Cairo.',
    type: 'website',
    locale: 'en_US',
    siteName: 'GIGADROP',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] antialiased selection:bg-[#CCFF00] selection:text-black">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
