import Loader from '@/components/loader/Loader';
import { TodoType } from '@/store/todo';
import { cn } from '@/util/cn';
import { AnimatePresence, motion } from 'framer-motion';
import { Dispatch, SetStateAction } from 'react';
import TodoList from '../../_components/TodoList';
import { HomeViewType } from '../page';

interface OverdueViewProps {
  overdues: TodoType[];
  isFetching: boolean;
  view: HomeViewType;
  setView: Dispatch<SetStateAction<HomeViewType>>;
  pathname: string;
  height: string;
}

const OverdueView = ({
  overdues,
  isFetching,
  view,
  setView,
  pathname,
  height,
}: OverdueViewProps) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        layout
        key={pathname}
        initial={{ y: 300 }}
        animate={{ y: 0 }}
        exit={{ y: 300 }}
        transition={{ duration: 0.4 }}
        className={`absolute bottom-0 w-full py-4 px-6 bg-red-50 rounded-tl-3xl rounded-tr-3xl cursor-pointer`}
        onClick={setView.bind(null, 'overdue')}
      >
        <h5 className="font-extrabold text-sm text-red-400">Overdue Tasks</h5>
        {view === 'overdue' ? (
          <div className={cn('overflow-scroll', height)}>
            {isFetching && (
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
          <div className={height} />
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default OverdueView;
