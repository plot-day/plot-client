'use client';

import DayNav from '@/components/date/DayNav';
import YearMonth from '@/components/date/YearMonth';
import {
  DraggableItem,
  DragHandle,
} from '@/components/draggable/DraggableItem';
import DraggableList from '@/components/draggable/DraggableList';
import Loader from '@/components/loader/Loader';
import { todoMutation, todosOverdueAtom, todosTodayAtom } from '@/store/todo';
import { todayAtom } from '@/store/ui';
import { cn } from '@/util/cn';
import dayjs from 'dayjs';
import { AnimatePresence, motion } from 'framer-motion';
import { useAtomValue } from 'jotai';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { IoCheckmarkSharp } from 'react-icons/io5';
import ContentBox from '../_components/ContentBox';
import TodoItem from '../_components/TodoItem';
import TodoList from '../_components/TodoList';

const Page = () => {
  const pathname = usePathname();

  const { data: todos, isFetching } = useAtomValue(todosTodayAtom);
  const { data: overdues, isFetching: isOverdueFetching } =
    useAtomValue(todosOverdueAtom);
  const { mutate: updateTodo } = useAtomValue(todoMutation);
  const today = useAtomValue(todayAtom);

  const [view, setView] = useState<'todo' | 'overdue' | 'filter'>('todo');
  const [filter, setFilter] = useState(null);
  const [showDone, setShowDone] = useState(false);

  const undone = useMemo(
    () => todos?.filter((item) => item.status === 'todo'),
    [todos]
  );

  const updateChangeHandler = ({ id, rank, categoryRank }: any) => {
    updateTodo({ id, rank, categoryRank });
  };

  useEffect(() => {
    if (overdues?.length === 0) {
      setView('todo');
    }
  }, [overdues]);

  useEffect(() => {
    if (dayjs().isAfter(dayjs(today), 'date')) {
      setShowDone(true);
    } else {
      setShowDone(false);
    }
  }, [today]);

  return (
    <div>
      <div>
        <YearMonth date={new Date()} className="p-8" />
        {/* Filter */}
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ y: 320 }}
            animate={{ y: 0 }}
            exit={{ y: 320 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className={`"absolute bottom-0 w-full h-[calc(100dvh-14rem)] p-6 bg-primary rounded-tl-3xl rounded-tr-3xl`}
            onClick={setView.bind(null, 'filter')}
          ></motion.div>
        </AnimatePresence>
        {/* Overdue */}
        {!!overdues?.length && (
          <AnimatePresence mode="wait">
            <motion.div
              layout
              key={pathname}
              initial={{ y: 300 }}
              animate={{ y: 0 }}
              exit={{ y: 300 }}
              transition={{ duration: 0.4 }}
              className={`absolute bottom-0 w-full p-6 bg-red-50 rounded-tl-3xl rounded-tr-3xl cursor-pointer`}
              onClick={setView.bind(null, 'overdue')}
            >
              <h5 className="font-extrabold text-sm text-red-400">
                Overdue Tasks
              </h5>
              {view === 'overdue' ? (
                <div className="h-[33rem] overflow-scroll ">
                  {isOverdueFetching && (
                    <div
                      className={cn(
                        'w-full h-full flex justify-center items-center transform -translate-y-[4rem] py-4'
                      )}
                    >
                      <Loader />
                    </div>
                  )}
                  <TodoList
                    className="[&_.icon-holder]:bg-white [&_.todo-item]:pr-1 box-content w-full mt-4 -ml-2 [&_li]:text-base [&_svg]:text-xs p-3 bg-red-50 rounded-xl text-red-400 [&_svg]:text-red-200 [&>div>svg]:text-red-400"
                    items={overdues}
                  />
                </div>
              ) : (
                <div
                  className={
                    view === 'filter' ? 'h-[6.75rem]' : 'h-[calc(100dvh-23rem)]'
                  }
                />
              )}
            </motion.div>
          </AnimatePresence>
        )}
        {/* Todo */}
        <ContentBox
          className={cn(
            'flex flex-col gap-6 items-center',
            view === 'todo' ? 'h-full' : '',
            overdues?.length
              ? 'max-h-[calc(100dvh-23rem)]'
              : 'max-h-[calc(100dvh-19rem)]'
          )}
          onClick={setView.bind(null, 'todo')}
        >
          <div className="relative w-full flex justify-center">
            <DayNav />
            <button
              type="button"
              className={cn(
                'absolute top-[50%] -translate-y-[50%] right-0 flex gap-1 items-center text-sm font-semibold',
                showDone ? '' : 'text-gray-400'
              )}
              onClick={() => {
                setShowDone((prev) => !prev);
              }}
            >
              <IoCheckmarkSharp /> Done{' '}
              {todos ? todos?.length - (undone || [])?.length : 0}
            </button>
          </div>
          {isFetching ? (
            <div
              className={cn(
                'w-full h-full flex justify-center items-center',
                todos?.length ? 'py-10' : 'py-40'
              )}
            >
              <Loader />
            </div>
          ) : (
            view === 'todo' && (
              <DraggableList
                className="space-y-6 h-full overflow-scroll"
                items={
                  showDone
                    ? [...(todos || [])].sort((a, b) =>
                        a.rank?.compareTo(b.rank)
                      ) || []
                    : (undone &&
                        [...undone].sort((a, b) =>
                          a.rank?.compareTo(b.rank)
                        )) ||
                      []
                }
                rankKey="rank"
                updateChange={updateChangeHandler}
                renderItem={(item) => (
                  <DraggableItem
                    id={item.id}
                    className="flex items-center gap-2"
                  >
                    <DragHandle />
                    <TodoItem key={item.id} {...item} />
                  </DraggableItem>
                )}
              />
            )
          )}
        </ContentBox>
      </div>
    </div>
  );
};
export default Page;
