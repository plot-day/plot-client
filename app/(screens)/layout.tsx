import Nav from '@/app/_layout/Nav';
import PlotInputOverlay from './home/_overlays/PlotInputOverlay';
import EmojiOverlay from '@/components/emoji/EmojiOverlay';
import CategorySelectOverlay from './home/_overlays/CategorySelectOverlay';
import CategoryInputOverlay from './home/_overlays/CategoryInputOverlay';
import CategoryListOverlay from './home/_overlays/CategoryListOverlay';
import GroupListOverlay from './home/_overlays/GroupListOverlay';
import { Suspense } from 'react';
import PlotDeleteConformOverlay from './home/_overlays/PlotDeleteConfirmOverlay';
import YearMonthNavOverlay from '@/components/date/YearMonthNavOverlay';
import FieldInputOverlay from './home/_overlays/FieldInputOverlay';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative max-w-[1280px] mx-auto">
      {/* content */}
      <main className="w-full h-[calc(100dvh-6rem)] overflow-scroll">
        {children}
      </main>
      {/* nav */}
      <Nav className="h-[6rem]" />
      {/* overlays */}
      <div id="overlay-container" className="absolute top-0 w-full">
        <Suspense>
          <YearMonthNavOverlay />
        </Suspense>
      </div>
      <div id="overlay-container" className="absolute bottom-0 w-full">
        <Suspense>
          <PlotInputOverlay />
          <CategorySelectOverlay />
          <CategoryListOverlay />
          <CategoryInputOverlay />
          <FieldInputOverlay />
          <GroupListOverlay />
          <EmojiOverlay />
          <PlotDeleteConformOverlay />
        </Suspense>
      </div>
    </div>
  );
}
