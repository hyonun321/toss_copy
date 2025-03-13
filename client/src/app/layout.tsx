import type { Metadata } from 'next';

// import './globals.css';
import { ResponsiveWrapper } from './components/ResponsiveWrapper';
import { ClientGlobalStyles } from './components/ClientGlobalStyles';
import { geistSans, geistMono } from './theme/fonts';
export const metadata: Metadata = {
  title: 'Doss',
  description: 'Use it like apps',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="kr">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ClientGlobalStyles />
        <ResponsiveWrapper>{children}</ResponsiveWrapper>
      </body>
    </html>
  );
}
