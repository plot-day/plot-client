import {
  goalLogMutation,
  goalLogsTodayAtom,
  goalsAtom,
  GoalType,
} from '@/store/goal';
import { cn } from '@/util/cn';
import { useAtomValue } from 'jotai';

const GoalIconList = () => {
  const { data: goals } = useAtomValue(goalsAtom);

  return (
    <ul className="flex flex-wrap gap-2 mb-2">
      {goals?.map((goal) => (
        <GoalIcon {...goal} />
      ))}
    </ul>
  );
};

const GoalIcon = ({ icon, id }: GoalType) => {
  const { data: goalLogs } = useAtomValue(goalLogsTodayAtom);
  const goalLog = goalLogs?.find((log) => log.goalId === id);
  const { mutate } = useAtomValue(goalLogMutation);

  const toggleGoalStatus = () => {
    mutate({
      id: goalLog?.id,
      status: goalLog?.status === 'done' ? 'todo' : 'done',
      goalId: id,
    });
  };

  return (
    <li
      className={cn(
        'cursor-pointer text-2xl p-1 w-10 flex justify-center items-center aspect-square rounded-full bg-gray-100',
        goalLog?.status === 'done' ? 'bg-primary' : undefined
      )}
      onClick={toggleGoalStatus}
    >
      {icon}
    </li>
  );
};

export default GoalIconList;
