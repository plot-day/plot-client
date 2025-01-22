import Nav from '@/app/_layout/Nav';
import LogInputOverlay from './home/_overlays/LogInputOverlay';
import EmojiOverlay from '@/components/emoji/EmojiOverlay';
import CategorySelectOverlay from './home/_overlays/CategorySelectOverlay';
import CategoryInputOverlay from './home/_overlays/CategoryInputOverlay';
import CategoryListOverlay from './home/_overlays/CategoryListOverlay';
import GroupListOverlay from './home/_overlays/GroupListOverlay';
import { Suspense } from 'react';
import LogDeleteConformOverlay from './home/_overlays/LogDeleteConfirmOverlay';
import YearMonthNavOverlay from '@/components/date/YearMonthNavOverlay';

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
      <div id="overlay-container" className="absolute top-0 w-full sm:bottom-0">
        <Suspense>
          <YearMonthNavOverlay />
          <LogInputOverlay />
          <CategorySelectOverlay />
          <CategoryListOverlay />
          <CategoryInputOverlay />
          <GroupListOverlay />
          <EmojiOverlay />
          <LogDeleteConformOverlay />
        </Suspense>
      </div>
    </div>
  );
}
