'use client';
import PlayButton from '@/components/button/PlayButton';
import DayNav from '@/components/date/DayNav';
import YearMonthNav from '@/components/date/YearMonthNav';
import IconHolder from '@/components/icon/IconHolder';
import { logFormDataAtom, logsTodayAtom, LogType } from '@/store/log';
import { getTimestampStr, toCamelCase } from '@/util/convert';
import { getDateTimeStr } from '@/util/date';
import { useAtomValue, useSetAtom } from 'jotai';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Suspense, useMemo } from 'react';
import { IconPickerItem } from 'react-icons-picker-more';

const page = () => {
  const { data: logs } = useAtomValue(logsTodayAtom);

  const todos = useMemo(() => logs?.filter((item) => item.status === 'todo'), [logs]);
  const dones = useMemo(() => logs?.filter((item) => item.status !== 'todo'), [logs]);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mt-4 mb-8 flex justify-between">
        <Suspense>
          <YearMonthNav />
        </Suspense>
        <DayNav />
      </div>
      <ul className="space-y-6">
        {todos?.map((item) => (
          <LogItem key={item.id} {...item} />
        ))}
      </ul>
      {!!dones?.length && <hr className="my-6" />}
      {/* Done */}
      {!!dones?.length && (
        <ul className="space-y-6">
          {dones.map((item) => (
              <LogItem key={item.id} {...item} />
            ))}
        </ul>
      )}
    </div>
  );
};

const LogItem = (log: LogType) => {
  const pathname = usePathname();
  const setFormData = useSetAtom(logFormDataAtom);

  const { title, category, icon, fieldValues, type, status } = log;

  return (
    <Link
      className="flex justify-between items-center"
      href={`${pathname}?log-input=show`}
      onClick={() => {
        setFormData(log);
      }}
    >
      <div className="flex items-center gap-4">
        <PlayButton />
        <IconHolder>{icon}</IconHolder>
        <div>
          <p className="text-xs font-extrabold">{category.title}</p>
          <p>{title}</p>
          <ul className="flex gap-2 text-xs font-light mt-2">
            {category.fields.map(
              ({ icon, type, label }, i) =>
                fieldValues[toCamelCase(label)] && (
                  <li key={i} className="flex gap-1 items-center">
                    <IconPickerItem value={icon} />
                    <span>
                      {type === 'timestamp'
                        ? getTimestampStr(fieldValues[toCamelCase(label)])
                        : fieldValues[toCamelCase(label)]}
                    </span>
                  </li>
                )
            )}
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
    </Link>
  );
};

export default page;
