'use client';
import DayNav from '@/components/date/DayNav';
import YearMonthNav from '@/components/date/YearMonthNav';
import {
  DraggableItem,
  DragHandle,
} from '@/components/draggable/DraggableItem';
import DraggableList from '@/components/draggable/DraggableList';
import Loader from '@/components/loader/Loader';
import { todoMutation, todosOverdueAtom, todosTodayAtom } from '@/store/todo';
import { cn } from '@/util/cn';
import { useAtomValue } from 'jotai';
import { useMemo, useState } from 'react';
import { IoCheckmarkSharp } from 'react-icons/io5';
import TodoItem from '../_components/TodoItem';
import TodoList from '../_components/TodoList';

const Page = () => {
  const { data: todos, isFetching } = useAtomValue(todosTodayAtom);
  const { data: overdues, isFetching: isOverdueFetching } =
    useAtomValue(todosOverdueAtom);
  const { mutate } = useAtomValue(todoMutation);

  const [showDone, setShowDone] = useState(false);

  const todoList = useMemo(
    () => todos?.filter((item) => item.status === 'todo'),
    [todos]
  );

  // const updateChangeHandler = ({
  //   id,
  //   todayRank,
  //   inboxRank,
  //   categoryRank,
  // }: any) => {
  //   mutate({ id, todayRank, inboxRank, categoryRank });
  // };

  return (
    <>
      <div className="p-8">
        {/* Header */}
        <YearMonthNav className="pb-4" disabled={isFetching} />
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
            <IoCheckmarkSharp /> Done{' '}
            {todos && todoList ? todos?.length - todoList?.length : 0}
          </button>
        </div>
        {isFetching ? (
          <div
            className={cn(
              'w-full h-full flex justify-center items-center',
              todos?.length ? 'py-10' : 'py-60'
            )}
          >
            <Loader />
          </div>
        ) : (
          <>
            {!isOverdueFetching && !!overdues?.length && (
              <TodoList
                className="[&_.icon-holder]:bg-white [&_.todo-item]:pr-1 box-content w-full mt-4 -ml-2 [&_li]:text-base [&_svg]:text-xs p-3 bg-red-50 rounded-xl text-red-400 [&_svg]:text-red-200 [&>div>svg]:text-red-400"
                title="Overdue Tasks"
                items={overdues}
                gap={2}
                isFolded={true}
              ></TodoList>
            )}
            {/* <DraggableList
              className="space-y-6 mt-8"
              items={
                showDone
                  ? (todos &&
                      [...todos].sort((a, b) =>
                        a.todayRank?.compareTo(b.todayRank)
                      )) ||
                    []
                  : (todoList &&
                      [...todoList].sort((a, b) =>
                        a.todayRank?.compareTo(b.todayRank)
                      )) ||
                    []
              }
              rankKey="todayRank"
              updateChange={updateChangeHandler}
              renderItem={(item) => (
                <DraggableItem id={item.id} className="flex items-center gap-2">
                  <DragHandle />
                  <TodoItem key={item.id} {...item} />
                </DraggableItem>
              )}
            /> */}
          </>
        )}
      </div>
    </>
  );
};

export default Page;
