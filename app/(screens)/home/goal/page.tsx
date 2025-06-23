'use client';

import DayNav from '@/components/date/DayNav';
import YearMonth from '@/components/date/YearMonth';
import ContentView from '../_components/ContentView';

const Page = () => {
  return (
    <div className="w-full">
      <YearMonth date={new Date()} className="p-8" />
      <ContentView className="flex flex-col items-center">
        <DayNav />
      </ContentView>
    </div>
  );
};

export default Page;
