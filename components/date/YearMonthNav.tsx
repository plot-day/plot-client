'use client';

import { todayAtom } from '@/store/ui';
import { ClassNameProps } from '@/types/className';
import { cn } from '@/util/cn';
import { useAtomValue } from 'jotai';
import Link from 'next/link';
import YearMonth from './YearMonth';

interface yearMonthNavProps extends ClassNameProps {
  disabled?: boolean;
}

const YearMonthNav = ({ disabled, className }: yearMonthNavProps) => {
  const today = useAtomValue(todayAtom);

  return (
    <div>
      <Link
        className={cn('inline-block', disabled ? 'pointer-events-none' : '', className)}
        href={`?year-month-nav=show`}
      >
        <YearMonth date={today} />
      </Link>
    </div>
  );
};

export default YearMonthNav;
