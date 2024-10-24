import Nav from '@/components/layout/Nav';
import LogInputOverlay from './home/_components/LogInputOverlay';
import EmojiOverlay from '@/components/emoji/EmojiOverlay';
import CategorySelectOverlay from './home/_components/CategorySelectOverlay';
import CategoryInputOverlay from './home/_components/CategoryInputOverlay';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative max-w-[1280px] mx-auto">
      {/* content */}
      <main className="w-full h-[calc(100dvh-6rem)] overflow-scroll">{children}</main>
      {/* nav */}
      <Nav className="h-[6rem]" />
      {/* overlays */}
      <div id="overlay-container" className="absolute sm:bottom-0" />
      <LogInputOverlay />
      <CategorySelectOverlay />
      <CategoryInputOverlay />
      <EmojiOverlay />
    </div>
  );
}
