'use client';

import YearMonth from '@/components/date/YearMonth';
import { todosOverdueAtom } from '@/store/todo';
import { useAtomValue } from 'jotai';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import FilterView from './_components/FilterView';
import OverdueView from './_components/OverdueView';
import TodoView from './_components/TodoView';

export type HomeViewType = 'todo' | 'overdue' | 'filter';

const DEFAULT_TODO_HEIGHT = 'max-h-[calc(100dvh-17rem)]';
const SHRINKED_TODO_HEIGHT = 'max-h-[calc(100dvh-20rem)]'; // view === 'overdue'

const DEFAULT_OVERDUE_HEIGHT = 'h-[38rem]';
const MINIMIZED_OVERDUE_HEIGHT = 'h-[6.75rem]'; // view === 'filter'

const DEFAULT_FILTER_HEIGHT = 'h-[calc(100dvh-14rem)]';

const Page = () => {
  const pathname = usePathname();

  const { data: overdues, isFetching: isOverdueFetching } =
    useAtomValue(todosOverdueAtom);

  const [view, setView] = useState<HomeViewType>('todo');
  const [todoHeight, setTodoHeight] = useState(DEFAULT_TODO_HEIGHT);
  const [overdueHeight, setOverdueHeight] = useState(DEFAULT_OVERDUE_HEIGHT);

  useEffect(() => {
    if (overdues?.length === 0) {
      setView('todo');
      setTodoHeight(DEFAULT_TODO_HEIGHT);
    } else {
      setTodoHeight(SHRINKED_TODO_HEIGHT);
    }
  }, [overdues]);

  useEffect(() => {
    switch (view) {
      case 'filter':
        setOverdueHeight(MINIMIZED_OVERDUE_HEIGHT);
        break;
      default:
        setOverdueHeight(DEFAULT_OVERDUE_HEIGHT);
        break;
    }
  }, [view]);

  return (
    <div>
      <div>
        <YearMonth date={new Date()} className="p-8" />
        {/* Filter */}
        <FilterView
          pathname={pathname}
          view={view}
          setView={setView}
          height={DEFAULT_FILTER_HEIGHT}
        />
        {/* Overdue */}
        {!!overdues?.length && (
          <OverdueView
            overdues={overdues}
            isFetching={isOverdueFetching}
            view={view}
            setView={setView}
            pathname={pathname}
            height={overdueHeight}
          />
        )}
        {/* Todo */}
        <TodoView
          pathname={pathname}
          view={view}
          setView={setView}
          height={todoHeight}
        />
      </div>
    </div>
  );
};
export default Page;
