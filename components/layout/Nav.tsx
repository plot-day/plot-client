'use client';

import { ClassNameProps } from '@/types/className';
import { cn } from '@/util/cn';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaList, FaPlus } from 'react-icons/fa6';

const NAV_DATA: { [key: string]: any }[] = [
  { path: 'list', icon: <FaList />, title: 'List' },
  // { path: 'calendar', icon: <FaRegClock />, title: 'Schedule' },
  // { path: 'cateogries', icon: <FaRegCalendar />, title: 'Calendar' },
  // { path: 'tracker', icon: <FaChartBar />, title: 'Statistics' },
  {
    plus: (pathname: string) => (
      <Link
        href={`${pathname}?profile-select=show`}
        key="add"
        className="bg-primary w-9 h-9 mb-2 rounded-md"
      >
        <FaPlus className="text-base text-white" />
      </Link>
    ),
  },
];

const Nav = ({ className }: ClassNameProps) => {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        'flex justify-center items-center gap-6 text-xl text-gray-300 bg-white',
        '[&>a]:flex [&>a]:flex-col [&>a]:justify-center [&>a]:items-center',
        '[&>div]:flex [&>div]:flex-col [&>div]:justify-center [&>div]:items-center',
        '[&_span]:text-[0.625rem] [&_span]:font-bold',
        className
      )}
    >
      {NAV_DATA.map(({ path, icon, title, plus }) =>
        path ? (
          <Link
            href={path}
            key={path}
            className={pathname.split('/')[1] === path ? 'text-primary' : undefined}
          >
            {icon}
            <span>{title}</span>
          </Link>
        ) : plus ? (
          plus(pathname)
        ) : (
          icon
        )
      )}
    </nav>
  );
};

export default Nav;
