'use client';

import { MONTHS, YEARS } from '@/constants/date';
import { todayAtom } from '@/store/ui';
import { useAtom } from 'jotai';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Overlay from '../overlay/Overlay';
import { cn } from '@/util/cn';

const YearMonthNavOverlay = () => {
  const router = useRouter();
  const params = useSearchParams();

  const [today, setToday] = useAtom(todayAtom);
  const [year, setYear] = useState(today.getFullYear());

  const showOverlay = params.get('year-month-nav');

  const closeHandler = () => {
    router.back();
  };

  const todayHandler = (month: number) => {
    setToday((prev) => {
      const next = new Date(prev);
      next.setFullYear(year);
      next.setMonth(month);
      return next;
    });
    closeHandler();
  };

  useEffect(() => {
    if (showOverlay) {
        setYear(today.getFullYear());
    }
  }, [showOverlay]);

  return (
    <Overlay
      id="year-month-nav"
      fromTop={true}
      isLeft={true}
      title={
        <select
          className="content-box w-auto bg-transparent font-black text-3xl"
          onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
            setYear(+event.target.value);
          }}
          value={year}
        >
          {YEARS.map((year) => {
            return (
              <option key={year} value={year}>
                {year}
              </option>
            );
          })}
        </select>
      }
    >
      <div className="grid grid-cols-3 gap-4">
        {MONTHS.map((month, i) => (
          <button
            key={month}
            onClick={todayHandler.bind(null, i)}
            className={cn(
              'flex justify-center p-4 font-semibold border rounded-lg',
              today.getMonth() === i && today.getFullYear() === year
                ? 'bg-primary text-white border-none'
                : ''
            )}
          >
            {month}
          </button>
        ))}
      </div>
    </Overlay>
  );
};

export default YearMonthNavOverlay;
