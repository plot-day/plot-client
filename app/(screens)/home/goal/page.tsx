'use client';

import DayNav from '@/components/date/DayNav';
import YearMonth from '@/components/date/YearMonth';
import ContentView from '../_components/ContentView';
import GoalList from './_components/GoalList';
import Link from 'next/link';

const Page = () => {
  return (
    <div className="w-full h-full relative">
      {/* Calendar */}
      <YearMonth date={new Date()} className="p-8" />
      <ContentView className="absolute bottom-0 flex flex-col items-center h-full max-h-[calc(100dvh-14rem)]">
        <div className="relative w-full flex justify-center">
          <DayNav />
        </div>
        {/* Goals */}
        <GoalList />
      </ContentView>
    </div>
  );
};

export default Page;
