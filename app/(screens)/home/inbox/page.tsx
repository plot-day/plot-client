'use client';
import {
  DraggableItem,
  DragHandle,
} from '@/components/draggable/DraggableItem';
import DraggableList from '@/components/draggable/DraggableList';
import Loader from '@/components/loader/Loader';
import { todoMutation } from '@/store/todo';
import { cn } from '@/util/cn';
import { useAtomValue } from 'jotai';
import { useMemo, useState } from 'react';
import { IoCheckmarkSharp } from 'react-icons/io5';
import TodoItem from '../_components/TodoItem';

const Page = () => {
  // const { data: todos, isFetching } = useAtomValue(todosInboxAtom);
  // const { mutate } = useAtomValue(todoMutation);

  // const todoList = useMemo(
  //   () => todos?.filter((item) => item.status === 'todo' && !item.date),
  //   [todos]
  // );

  // const [showDone, setShowDone] = useState(false);

  // const updateChangeHandler = (item: any) => {
  //   mutate(item);
  // };

  // return (
  //   <div className="p-8">
  //     {/* Header */}
  //     <div className="my-2 flex justify-between items-center">
  //       <h2 className="text-3xl font-extrabold">Inbox</h2>
  //       <button
  //         type="button"
  //         className={cn(
  //           'flex gap-1 items-center text-sm font-semibold',
  //           showDone ? '' : 'text-gray-400'
  //         )}
  //         onClick={() => {
  //           setShowDone((prev) => !prev);
  //         }}
  //       >
  //         <IoCheckmarkSharp /> Done{' '}
  //         {todos && todoList ? todos?.length - todoList?.length : 0}
  //       </button>
  //     </div>
  //     {isFetching ? (
  //       <div
  //         className={cn(
  //           'w-full h-full flex justify-center items-center',
  //           todos?.length ? 'py-10' : 'py-60'
  //         )}
  //       >
  //         <Loader />
  //       </div>
  // ) : <DraggableList
  //   className="space-y-6 mt-8"
  //   items={
  //     showDone
  //       ? (todos &&
  //           [...todos].sort((a, b) =>
  //             a.todayRank?.compareTo(b.todayRank)
  //           )) ||
  //         []
  //       : (todoList &&
  //           [...todoList].sort((a, b) =>
  //             a.todayRank?.compareTo(b.todayRank)
  //           )) ||
  //         []
  //   }
  //   rankKey="inboxRank"
  //   updateChange={updateChangeHandler}
  //   renderItem={(item) => (
  //     <DraggableItem id={item.id} className="flex items-center gap-2">
  //       <DragHandle />
  //       <TodoItem key={item.id} {...item} />
  //     </DraggableItem>
  //   )}
  // />
  null;
};
// </div>
//   );
// };

export default Page;
