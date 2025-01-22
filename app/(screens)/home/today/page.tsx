'use client';
import DayNav from '@/components/date/DayNav';
import YearMonthNav from '@/components/date/YearMonthNav';
import { DraggableItem, DragHandle } from '@/components/draggable/DraggableItem';
import DraggableList from '@/components/draggable/DraggableList';
import Loader from '@/components/loader/Loader';
import { logMutation, logsTodayAtom } from '@/store/log';
import { cn } from '@/util/cn';
import { useAtomValue } from 'jotai';
import { Suspense, useMemo, useState } from 'react';
import { IoCheckmarkSharp } from 'react-icons/io5';
import LogItem from '../_components/LogItem';

const Page = () => {
  const { data: logs, isFetching } = useAtomValue(logsTodayAtom);
  const { mutate } = useAtomValue(logMutation);

  const [showDone, setShowDone] = useState(false);

  const todos = useMemo(() => logs?.filter((item) => item.status === 'todo'), [logs]);

  const updateChangeHandler = (item: any) => {
    mutate(item);
  };

  return (
    <>
      <div className="p-8">
        {/* Header */}
        <YearMonthNav className="py-4" disabled={isFetching} />
        <div className="flex justify-between">
          <DayNav />
          <button
            type="button"
            className={cn(
              'flex gap-1 items-center text-sm font-semibold',
              showDone ? '' : 'text-gray-400'
            )}
            onClick={() => {
              setShowDone((prev) => !prev);
            }}
          >
            <IoCheckmarkSharp /> Done {logs && todos ? logs?.length - todos?.length : 0}
          </button>
        </div>
        {isFetching ? (
          <div
            className={cn(
              'w-full h-full flex justify-center items-center',
              logs?.length ? 'py-10' : 'py-60'
            )}
          >
            <Loader />
          </div>
        ) : (
          <DraggableList
            className="space-y-6 mt-8"
            items={
              showDone
                ? (logs &&
                    [...logs].sort((a, b) => a.todayRank?.compareTo(b.todayRank))) ||
                  []
                : (todos &&
                    [...todos].sort((a, b) => a.todayRank?.compareTo(b.todayRank))) ||
                  []
            }
            rankKey="todayRank"
            updateChange={updateChangeHandler}
            renderItem={(item) => (
              <DraggableItem id={item.id} className="flex items-center gap-2">
                <DragHandle />
                <LogItem key={item.id} {...item} />
              </DraggableItem>
            )}
          />
        )}
      </div>
    </>
  );
};

export default Page;
