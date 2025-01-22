'use client';

import Loader from '@/components/loader/Loader';
import Tab from '@/components/tab/Tab';
import { groupAtom } from '@/store/group';
import { ClassNameProps } from '@/types/className';
import { cn } from '@/util/cn';
import { useAtom } from 'jotai';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

interface GroupTabProps extends ClassNameProps {
  id: string;
  group: string;
  setGroup: React.Dispatch<string>;
}

const GroupTab = ({ id, group, setGroup, className }: GroupTabProps) => {
    const pathname = usePathname();
  const [{ data, isPending, isError }] = useAtom(groupAtom);

  return (
    <div className={cn('flex justify-center gap-4 text-xs', className)}>
      <Link href={`${pathname}?group-edit=show`} className="font-extrabold">
        =
      </Link>
      <Tab
        id={id}
        value={group}
        setValue={setGroup}
        tabs={[
          {
            label: 'All',
            value: 'all',
          },
          isPending ? (
            <Loader key="loader" isFit={true} className="w-4 h-4" />
          ) : undefined,
          ...(data?.sort((a, b) => a.rank?.compareTo(b.rank)).map((group, i) => ({
            label: group.title,
            value: group.id,
          })) || []),
        ]}
      />
    </div>
  );
};

export default GroupTab;
