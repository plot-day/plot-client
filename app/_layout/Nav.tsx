'use client';

import { ClassNameProps } from '@/types/className';
import { cn } from '@/util/cn';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaClock, FaInbox, FaPlus, FaRegCalendar } from 'react-icons/fa6';
import { IoGrid } from "react-icons/io5";

const NAV_DATA: { [key: string]: any }[] = [
  { path: '/home/today', icon: <FaRegCalendar />, title: 'Today' },
  // { path: '/home/now', icon: <FaClock />, title: 'Now' },
  { path: '/home/category', icon: <IoGrid />, title: 'Category' },
  { path: '/home/inbox', icon: <FaInbox />, title: 'Inbox' },
  {
    plus: (pathname: string) => (
      <Link
        href={`${pathname}?log-input=show`}
        key="add"
        className="shrink-0 bg-primary w-9 h-9 mb-2 rounded-md"
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
        'mx-12 flex gap-6 justify-center items-center text-xl text-gray-300 bg-white',
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
            className={pathname === path ? 'text-primary w-full' : 'w-full'}
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
