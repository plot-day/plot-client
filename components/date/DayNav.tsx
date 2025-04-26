'use client';

import { todayAtom } from '@/store/ui';
import { useAtom } from 'jotai';
import DayDate from './DayDate';
import { cn } from '@/util/cn';
import { ClassNameProps } from '@/types/className';
import { useRef } from 'react';
import { getDashDate } from '@/util/date';

interface DayNavProps extends ClassNameProps {
  isVertical?: boolean;
}

const DayNav = ({ isVertical, className }: DayNavProps) => {
  const dateInput = useRef<HTMLInputElement>(null);
  const [today, setToday] = useAtom(todayAtom);

  const showDatepickerHandler = (event: React.MouseEvent<HTMLElement>) => {
    dateInput.current?.showPicker();
  };

  const dateChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const [year, month, day] = event.target.value.split('-');
    setToday(new Date(+year, +month - 1, +day));
  };

  // NOTE: 24 hour to milliseconds - 8.64e+7
  const goPrevDay = () => {
    setToday((prevDay) => {
      const [year, month, day] = prevDay.toISOString().split('T')[0].split('-');
      return new Date(+year, +month - 1, +day - 1);
    });
  };

  const goNextDay = () => {
    setToday((prevDay) => {
      const [year, month, day] = prevDay.toISOString().split('T')[0].split('-');
      return new Date(+year, +month - 1, +day + 1);
    });
  };

  return (
    <div
      className={cn(
        `daynav relative flex ${isVertical ? 'flex-col' : ''} gap-4 items-center font-extrabold`,
        className
      )}
    >
      <button type="button" className="text-sm" onClick={goPrevDay}>
        {isVertical ? '↑' : '<'}
      </button>
      <DayDate date={today} onClick={showDatepickerHandler} />
      <button type="button" className="text-sm" onClick={goNextDay}>
        {isVertical ? '↓' : '>'}
      </button>
      <input
        ref={dateInput}
        type="date"
        onChange={dateChangeHandler}
        value={getDashDate(today)}
        className="absolute invisible left-1 w-16"
        required
      />
    </div>
  );
};

export default DayNav;
