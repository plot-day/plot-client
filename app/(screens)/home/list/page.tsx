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

  const logsNotDone = logs?.filter((item) => !item.isDone);
  const dones = logs?.filter((item) => item.isDone);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="my-12 flex justify-between">
        <YearMonthNav />
        <DayNav />
      </div>
      <ul className="space-y-6">
        {logsNotDone?.map((item) => (
          <LogItem key={item.id} {...item} />
        ))}
      </ul>
      {!!dones?.length && <hr className="my-6" />}
      {/* Done */}
      {!!dones?.length && (
        <ul className="space-y-6">
          {dones
            ?.filter((item) => item.isDone)
            .map((item) => (
              <LogItem key={item.id} {...item} />
            ))}
        </ul>
      )}
    </div>
  );
};

const LogItem = ({ title, category, icon, customFields, type, isDone }: LogType) => {
  return (
    <div className="flex justify-between items-center">
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
      <div
        className={`w-[1rem] h-[1rem] border-black ${
          type === 'task'
            ? 'border rounded-[0.25rem]'
            : type === 'event'
            ? 'border rounded-full'
            : 'border-t border-black mt-[1rem]'
        }`}
      />
    </div>
  );
};

export default page;
