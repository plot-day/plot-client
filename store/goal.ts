import { goalFormSchemaType } from '@/app/(screens)/home/_overlays/GoalInputOverlay';
import { parseRank } from '@/util/convert';
import { getDashDate, getDateTimeStr } from '@/util/date';
import { removeAtom, updateAtom } from '@/util/query';
import { atomWithMutation, atomWithQuery } from 'jotai-tanstack-query';
import { LexoRank } from 'lexorank';
import { FieldType } from './category';
import { GroupType } from './group';
import { todayAtom } from './ui';
import { atom } from 'jotai';
import { goalLogFormSchemaType } from '@/app/(screens)/home/_overlays/GoalLogInputOverlay';

export interface GoalType {
  id: string;
  icon: string;
  title: string;
  group: GroupType;
  groupId: string;
  fields: FieldType[]; // defined in category.ts
  isActive: boolean;
  rank: LexoRank;
  userId?: string;
}

export interface GoalLogType {
  id: string;
  goal: GoalType;
  goalId: string;
  description: string;
  date: Date | string;
  fieldValues: any; // defined in category.ts
  status: 'todo' | 'done';
  userId?: string;
}

export const goalsAtom = atomWithQuery<GoalType[]>(() => {
  return {
    queryKey: ['goals'],
    queryFn: async () => {
      const res = await fetch('/api/goal');
      const data = await res.json();
      return data.map((item: any) => parseRank(item));
    },
  };
});

export const goalMutation = atomWithMutation<
  GoalType,
  Partial<goalFormSchemaType>
>((get) => ({
  mutationKey: ['goal'],
  mutationFn: async (goal) => {
    try {
      const res = await fetch(`/api/goal${goal.id ? '/' + goal.id : ''}`, {
        method: goal.id ? 'PATCH' : 'POST',
        body: JSON.stringify(goal),
      });
      return await res.json();
    } catch (error) {
      throw error;
    }
  },
  onSuccess: (data) => {
    updateAtom(data, 'goals');
  },
}));

export const goalLogsTodayAtom = atomWithQuery<GoalLogType[]>((get) => {
  return {
    queryKey: ['goalLogs', get(todayAtom)],
    queryFn: async ({ queryKey: [, today] }) => {
      const res = await fetch(
        `/api/goal-log?date=${getDashDate(today as Date)}`
      );
      const data = await res.json();
      return data.map((item: any) => {
        const [year, month, day] = item.date.split('-');
        return {
          ...item,
          date: new Date(year, month - 1, day),
        };
      });
    },
  };
});

export const goalLogMutation = atomWithMutation<
  GoalLogType,
  Partial<goalLogFormSchemaType>
>((get) => ({
  mutationKey: ['goalLog'],
  mutationFn: async (goalLog) => {
    try {
      const res = await fetch(
        `/api/goal-log${goalLog.id ? '/' + goalLog.id : ''}`,
        {
          method: goalLog.id ? 'PATCH' : 'POST',
          body: JSON.stringify({
            ...goalLog,
            date: getDashDate(goalLog.date),
          }),
        }
      );
      return await res.json();
    } catch (error) {
      throw error;
    }
  },
  onSuccess: (data) => {
    if ((data as any).deleted) {
      const { updated, deleted } = data as any; // { updated: GoalLogType; deleted: string[] }
      updateAtom(updated, ['goalLogs', get(todayAtom)], true);
      deleted.forEach((id: string) => {
        removeAtom(id, ['goalLogs', get(todayAtom)]);
      });
    } else {
      updateAtom(data, ['goalLogs', get(todayAtom)], true);
    }
  },
}));

export const currentGoalLogAtom = atom<Partial<GoalLogType> | null>(null);
export const goalLogFormDataAtom = atom(
  (get) => {
    const goalLog = get(currentGoalLogAtom);
    return (
      goalLog && {
        ...goalLog,
        goalId: goalLog?.goal?.id,
        date: getDateTimeStr(goalLog?.date),
      }
    );
  },
  (get, set, update: Partial<GoalType> | null) => {
    set(currentGoalLogAtom, update);
  }
);
