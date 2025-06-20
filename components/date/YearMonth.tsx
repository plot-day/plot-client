import { ClassNameProps } from '@/types/className';
import { cn } from '@/util/cn';
import React from 'react';

interface YearMonthProps extends ClassNameProps {
  date: Date;
  onClick?: React.MouseEventHandler;
}

const YearMonth = ({ date, onClick, className }: YearMonthProps) => {
  return (
    <div
      className={cn(
        'flex flex-col items-start font-extrabold leading-tight',
        className
      )}
      onClick={onClick}
    >
      <div className="text-lg">{date.getFullYear()}</div>
      <div className="text-3xl">
        {date.toLocaleDateString('en-US', { month: 'long' })}
      </div>
    </div>
  );
};

export default YearMonth;
