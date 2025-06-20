'use client';

import Nav from '@/app/_layout/Nav';
import TodoInputOverlay from './home/_overlays/TodoInputOverlay';
import EmojiOverlay from '@/components/emoji/EmojiOverlay';
import CategorySelectOverlay from './home/_overlays/CategorySelectOverlay';
import CategoryInputOverlay from './home/_overlays/CategoryInputOverlay';
import CategoryListOverlay from './home/_overlays/CategoryListOverlay';
import GroupListOverlay from './home/_overlays/GroupListOverlay';
import { Suspense, useEffect, useState } from 'react';
import TodoDeleteConformOverlay from './home/_overlays/TodoDeleteConfirmOverlay';
import YearMonthNavOverlay from '@/components/date/YearMonthNavOverlay';
import FieldInputOverlay from './home/_overlays/FieldInputOverlay';
import InformOverlay from './home/_overlays/InformOverlay';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  return (
    <div className="relative max-w-[1280px] mx-auto">
      {/* content */}
      <main className="w-full h-[calc(100dvh-6rem)] overflow-scroll relative">
        <AnimatePresence mode="wait">
          <motion.div key={pathname} transition={{ duration: 0.4 }}>
            {children}
          </motion.div>
        </AnimatePresence>
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
          <TodoInputOverlay />
          <CategorySelectOverlay />
          <CategoryListOverlay />
          <CategoryInputOverlay />
          <FieldInputOverlay />
          <GroupListOverlay />
          <EmojiOverlay />
          <TodoDeleteConformOverlay />
          <InformOverlay />
        </Suspense>
      </div>
    </div>
  );
}
