import CheckButton from '@/components/button/CheckButton';
import Loader from '@/components/loader/Loader';
import {
  goalLogFormDataAtom,
  goalLogMutation,
  goalLogsTodayAtom,
  GoalLogType,
  GoalType,
} from '@/store/goal';
import { todayAtom } from '@/store/ui';
import { cn } from '@/util/cn';
import { getDashDate } from '@/util/date';
import { motion } from 'framer-motion';
import { useAtomValue, useSetAtom } from 'jotai';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const GoalItem = ({ id, icon, title, group }: GoalType) => {
  const pathname = usePathname();
  const setFormData = useSetAtom(goalLogFormDataAtom);

  const {
    data: goalLogs,
    isFetching,
    isPending,
    isLoading,
    isRefetching,
  } = useAtomValue(goalLogsTodayAtom);
  const { mutate: goalLogMutate } = useAtomValue(goalLogMutation);
  const today = useAtomValue(todayAtom);

  const [goalLog, setGoalLog] = useState<GoalLogType | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const target = goalLogs?.find((item) => item.goalId === id);
    setGoalLog(target || null);
    setChecked(target?.status === 'done');
  }, [goalLogs]);

  const updateStatus = () => {
    if (goalLog) {
      goalLogMutate({
        id: goalLog.id,
        date: getDashDate(today),
        goalId: id,
        status: checked ? 'todo' : 'done',
      });
    } else {https://www.youtube.com/watch?v=1fzqiA13YmUhttps://www.youtube.com/watch?v=1fzqiA13YmU
      goalLogMutate({
        goalId: id,
        status: 'done',
      });
    }
  };

  return (
    <motion.li
      layout
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className={cn(
        'w-full flex items-center font-extrabold rounded-full overflow-hidden bg-gray-100 text-gray-400'
      )}
    >
      <Link
        className={cn(
          'w-full flex items-center gap-2 p-2 transition-all duration-500 rounded-full',
          checked ? 'bg-primary text-white' : 'flex-row-reverse'
        )}
        href={`${pathname}?goal-log-input=show&goalId=${id}`}
        onClick={setFormData.bind(null, goalLog)}
      >
        <motion.div
          layout
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className={cn('w-full', checked ? 'px-4' : '')}
        >
          <p className="text-xs font-semibold">{group?.title}</p>
          <p className="text-lg">{title}</p>
        </motion.div>
        <motion.span
          layout
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="text-4xl bg-white rounded-full p-2 shrink-0"
        >
          {icon}
        </motion.span>
      </Link>

      <div className="p-6 pr-7" onClick={updateStatus}>
        <CheckButton
          checked={checked}
          onChecked={() => {}}
          uncheckedClass="bg-white"
        />
      </div>
    </motion.li>
  );
};

export default GoalItem;
