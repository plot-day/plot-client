'use client';

import DayNav from '@/components/date/DayNav';
import YearMonth from '@/components/date/YearMonth';
import ContentBox from '../_components/ContentBox';

const Page = () => {
  return (
    <div className="w-full">
      <YearMonth date={new Date()} className="p-8" />
      <ContentBox className="flex flex-col items-center">
        <DayNav />
      </ContentBox>
    </div>
  );
};

export default Page;
