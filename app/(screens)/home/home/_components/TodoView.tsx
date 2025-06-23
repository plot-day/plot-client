import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { HomeViewType } from '../page';
import ContentView from '../../_components/ContentView';
import DayNav from '@/components/date/DayNav';
import { todoMutation, todosTodayAtom, TodoType } from '@/store/todo';
import { cn } from '@/util/cn';
import { todayAtom } from '@/store/ui';
import { useAtomValue } from 'jotai';
import dayjs from 'dayjs';
import DraggableList from '@/components/draggable/DraggableList';
import Loader from '@/components/loader/Loader';
import { IoCheckmarkSharp } from 'react-icons/io5';
import {
  DraggableItem,
  DragHandle,
} from '@/components/draggable/DraggableItem';
import TodoItem from '../../_components/TodoItem';

interface TodoViewProps {
  pathname: string;
  view: HomeViewType;
  setView: Dispatch<SetStateAction<HomeViewType>>;
  height: string;
}

const TodoView = ({ pathname, view, setView, height }: TodoViewProps) => {
  const { data, isFetching } = useAtomValue(todosTodayAtom);
  const today = useAtomValue(todayAtom);
  const { mutate: updateTodo } = useAtomValue(todoMutation);

  const [showDone, setShowDone] = useState(false);

  const todos = useMemo(
    () => data?.filter((item) => item.status === 'todo'),
    [data]
  );

  const updateChangeHandler = ({ id, rank, categoryRank }: any) => {
    updateTodo({ id, rank, categoryRank });
  };

  useEffect(() => {
    if (dayjs().isAfter(dayjs(today), 'date')) {
      setShowDone(true);
    } else {
      setShowDone(false);
    }
  }, [today]);

  return (
    <ContentView
      className={cn(
        'flex flex-col gap-6 items-center',
        view === 'todo' ? 'h-full' : '',
        height
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
          {data ? data?.length - (todos || [])?.length : 0}
        </button>
      </div>
      {isFetching ? (
        <div
          className={cn(
            'w-full h-full flex justify-center items-center',
            data?.length ? 'py-10' : 'py-40'
          )}
        >
          <Loader />
        </div>
      ) : (
        view === 'todo' && (
          <DraggableList
            className="space-y-6 w-full h-full overflow-scroll scrollbar-hide"
            items={
              showDone
                ? [...(data || [])].sort((a, b) => a.rank?.compareTo(b.rank)) ||
                  []
                : (todos &&
                    [...todos].sort((a, b) => a.rank?.compareTo(b.rank))) ||
                  []
            }
            rankKey="rank"
            updateChange={updateChangeHandler}
            renderItem={(item) => (
              <DraggableItem id={item.id} className="flex items-center gap-2">
                <DragHandle />
                <TodoItem key={item.id} {...item} />
              </DraggableItem>
            )}
          />
        )
      )}
    </ContentView>
  );
};

export default TodoView;
