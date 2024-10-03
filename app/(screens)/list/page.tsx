'use client';
import DayNav from '@/components/date/DayNav';
import YearMonthNav from '@/components/date/YearMonthNav';
import IconHolder from '@/components/icon/IconHolder';
import { ReactIcon } from '@/components/icon/ReactIcon';
import { logsTodayAtom, LogType } from '@/store/log';
import { useAtomValue } from 'jotai';
import React from 'react';

const page = () => {
  const { data: logs } = useAtomValue(logsTodayAtom);
  return (
    <div className="p-8">
      {/* Header */}
      <div className="my-12 flex justify-between">
        <YearMonthNav />
        <DayNav />
      </div>
      <ul className="space-y-6">
        {logs
          ?.filter((item) => item.isTask)
          .map((item) => (
            <LogItem key={item.id} {...item} />
          ))}
      </ul>
      <hr className="my-6" />
      <ul className="space-y-6">
        {logs
          ?.filter((item) => !item.isTask)
          .map((item) => (
            <LogItem key={item.id} {...item} />
          ))}
      </ul>
    </div>
  );
};

const LogItem = ({ title, category, icon, customFields, isTask, isDone }: LogType) => {
  return (
    <div className="flex gap-4">
      <IconHolder>{icon}</IconHolder>
      <div>
        <p className="text-xs font-extrabold">{category}</p>
        <p>{title}</p>
        <ul className="flex gap-2 text-xs font-light mt-2">
          {customFields.map(({ icon, value }, i) => (
            <li key={i} className="flex gap-1 items-center">
              <ReactIcon nameIcon={icon} />
              <span>{value}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default page;
