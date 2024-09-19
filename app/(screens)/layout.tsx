import Nav from '@/components/layout/Nav';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <body className="relative max-w-[1280px] mx-auto">
        {/* content */}
        <main className="w-full h-[calc(100dvh-6rem)] overflow-scroll">
        {children}
        </main>
        {/* nav */}
        <Nav className="h-[6rem]" />
        {/* overlays */}
        <div id="overlay-container" className="absolute sm:bottom-0" />
    </body>
  );
}
