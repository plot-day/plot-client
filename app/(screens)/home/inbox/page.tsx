'use client';
import { DraggableItem, DragHandle } from '@/components/draggable/DraggableItem';
import DraggableList from '@/components/draggable/DraggableList';
import Loader from '@/components/loader/Loader';
import { plotMutation, plotsInboxAtom } from '@/store/plot';
import { cn } from '@/util/cn';
import { useAtomValue } from 'jotai';
import { useMemo, useState } from 'react';
import { IoCheckmarkSharp } from 'react-icons/io5';
import PlotItem from '../_components/PlotItem';

const Page = () => {
  const { data: plots, isFetching } = useAtomValue(plotsInboxAtom);
    const { mutate } = useAtomValue(plotMutation);

  const todos = useMemo(() => plots?.filter((item) => item.status === 'todo' && !item.date), [plots]);

  const [showDone, setShowDone] = useState(false);

  const updateChangeHandler = (item: any) => {
    mutate(item);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="my-2 flex justify-between items-center"> 
        <h2 className='text-3xl font-extrabold'>Inbox</h2>
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
        <IoCheckmarkSharp /> Done {plots && todos ? plots?.length - todos?.length : 0}
      </button>
    </div>
      {isFetching ? (
          <div
            className={cn(
              'w-full h-full flex justify-center items-center',
              plots?.length ? 'py-10' : 'py-60'
            )}
          >
            <Loader />
          </div>
        ) : (
          <DraggableList
            className="space-y-6 mt-8"
            items={
              showDone
                ? (plots &&
                    [...plots].sort((a, b) => a.todayRank?.compareTo(b.todayRank))) ||
                  []
                : (todos &&
                    [...todos].sort((a, b) => a.todayRank?.compareTo(b.todayRank))) ||
                  []
            }
            rankKey="inboxRank"
            updateChange={updateChangeHandler}
            renderItem={(item) => (
              <DraggableItem id={item.id} className="flex items-center gap-2">
                <DragHandle />
                <PlotItem key={item.id} {...item} />
              </DraggableItem>
            )}
          />
        )}
    </div>
  );
};

export default Page;
