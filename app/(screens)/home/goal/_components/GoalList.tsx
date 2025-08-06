'use client';
import Loader from '@/components/loader/Loader';
import { goalsAtom } from '@/store/goal';
import { cn } from '@/util/cn';
import { useAtomValue } from 'jotai';
import GoalItem from './GoalItem';

const GoalList = () => {
  const {
    data: goals,
    isFetching,
    isPending,
    isLoading,
    isRefetching,
  } = useAtomValue(goalsAtom);
  return isFetching || isPending || isLoading || isRefetching ? (
    <div
      className={cn(
        'w-full h-full flex justify-center items-center',
        goals?.length ? 'py-10' : 'py-40'
      )}
    >
      <Loader />
    </div>
  ) : (
    <ul className="w-full py-6 space-y-2">
      {goals?.map((goal) => (
        <GoalItem key={goal.id} {...goal} />
      ))}
    </ul>
  );
};

export default GoalList;
