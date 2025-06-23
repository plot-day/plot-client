'use client';

import Loader from '@/components/loader/Loader';
import { filterAtom, filtersAtom } from '@/store/filter';
import { filteredTodosAtom } from '@/store/todo';
import { cn } from '@/util/cn';
import { AnimatePresence, motion } from 'framer-motion';
import { useAtom, useAtomValue } from 'jotai';
import { Dispatch, SetStateAction } from 'react';
import TodoList from '../../_components/TodoList';
import { HomeViewType } from '../page';

interface FilterViewProps {
  pathname: string;
  view: string;
  setView: Dispatch<SetStateAction<HomeViewType>>;
  height: string;
}

const FilterView = ({ pathname, height, view, setView }: FilterViewProps) => {
  const { data: filters, isFetching: isFetchingFilter } =
    useAtomValue(filtersAtom);
  const { data: todos, isFetching: isFetchingTodos } =
    useAtomValue(filteredTodosAtom);
  const [filter, setFilter] = useAtom(filterAtom);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ y: 320 }}
        animate={{ y: 0 }}
        exit={{ y: 320 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        className={cn(
          'absolute bottom-0 w-full p-[0.625rem] bg-primary rounded-tl-3xl rounded-tr-3xl overflow-hidden',
          height
        )}
        onClick={setView.bind(null, 'filter')}
      >
        {isFetchingFilter ? (
          <Loader isDark={true} className="w-6 h-6" />
        ) : (
          <div className="space-y-2">
            {/* filters */}
            <ul className="flex flex-wrap gap-2">
              {filters?.map((item) => (
                <li
                  key={item.id}
                  className={cn(
                    'w-fit px-4 py-[0.125rem] bg-white rounded-full font-bold',
                    view === 'filter' && filter
                      ? filter.id !== item.id
                        ? 'opacity-40'
                        : ''
                      : ''
                  )}
                  onClick={setFilter.bind(null, item)}
                >
                  {item.icon} {item.title}
                </li>
              ))}
            </ul>
            {/* todos */}
            <div
              className={cn('w-full overflow-scroll scrollbar-hide', height)}
            >
              {isFetchingTodos && (
                <div
                  className={cn(
                    'w-full h-full flex justify-center items-center transform -translate-y-[4rem] py-4'
                  )}
                >
                  <Loader />
                </div>
              )}
              <TodoList
                className="[&>li]:px-4 [&_.icon-holder]:bg-white box-content w-full mt-4 [&_li]:text-base [&_svg]:text-xs rounded-xl text-white [&_svg]:text-white [&>div>svg]:text-white [&_.border]:border-white [&_.bg-gray-200]:bg-gray-500"
                items={todos || []}
              />
              <div className="h-[15rem]" />
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default FilterView;
