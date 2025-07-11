import JotaiProvider from '@/app/_provider/JotaiProvider';
import type { Metadata, Viewport } from 'next';
import './globals.css';
import JotaiQueryClientProvider from './_provider/JotaiQueryClientProvider';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: 'PLOT',
  description: 'Play, List, Organize your Time',
  manifest: '/manifest.json',
  icons: [{ rel: 'icon', url: '/logo-192x192.png', sizes: '192x192' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body className="bg-gray-100">
        <JotaiQueryClientProvider>
          <JotaiProvider>{children}</JotaiProvider>
        </JotaiQueryClientProvider>
      </body>
    </html>
  );
}
