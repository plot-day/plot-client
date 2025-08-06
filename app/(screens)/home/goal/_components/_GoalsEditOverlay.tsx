'use client';
import Loader from '@/components/loader/Loader';
import { goalMutation, goalsAtom } from '@/store/goal';
import { cn } from '@/util/cn';
import { useAtomValue } from 'jotai';
import GoalItem from './GoalItem';
import DraggableList from '@/components/draggable/DraggableList';
import {
  DraggableItem,
  DragHandle,
} from '@/components/draggable/DraggableItem';
import { useState } from 'react';

const GoalList = () => {
  const { data: goals, isFetching } = useAtomValue(goalsAtom);
  const { mutate: updateGoal } = useAtomValue(goalMutation);

  const [isEdit, setIsEdit] = useState(false);

  const updateChangeHandler = ({ id, rank }: any) => {
    updateGoal({ id, rank });
  };

  return isFetching ? (
    <div
      className={cn(
        'w-full h-full flex justify-center items-center',
        goals?.length ? 'py-10' : 'py-40'
      )}
    >
      <Loader />
    </div>
  ) : (
    <DraggableList
      className="w-full py-6 space-y-2"
      items={goals || []}
      rankKey="rank"
      updateChange={updateChangeHandler}
      renderItem={(item) => (
        <DraggableItem id={item.id} className="flex items-center gap-2">
          <DragHandle />
          <GoalItem key={item.id} {...item} />
        </DraggableItem>
      )}
    />
  );
};

export default GoalList;
