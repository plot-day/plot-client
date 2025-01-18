import { logFormSchemaType } from '@/app/(screens)/home/_overlays/LogInputOverlay';
import { parseRank } from '@/util/convert';
import { getDashDate } from '@/util/date';
import { atomWithMutation, atomWithQuery } from 'jotai-tanstack-query';
import { CategoryType } from './category';
import { todayAtom } from './ui';
import { LexoRank } from 'lexorank';
import { updateTodayLogAtom } from '@/util/query';
import { atom } from 'jotai';

export interface LogType {
  id: string;
  icon: string;
  title: string;
  content?: string;
  categoryId: string;
  category: CategoryType;
  type: string;
  isDone?: boolean;
  date?: Date;
  dueDate?: Date;
  fieldValues: any;
  rank: LexoRank;
}

export const logsTodayAtom = atomWithQuery<LogType[]>((get) => {
  return {
    queryKey: ['log', get(todayAtom)],
    queryFn: async ({ queryKey: [, today] }) => {
      const res = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL + `/api/log?date=${getDashDate(today as Date)}`
      );
      const data = await res.json();
      return data.map((item: any) => ({ 
        ...parseRank(item),
        date: item.date && new Date(item.date) 
      }));
    },
  };
});

export const logMutation = atomWithMutation<LogType, Partial<logFormSchemaType>>((get) => ({
  mutationKey: ['log'],
  mutationFn: async (log) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/log${log.id ? '/' + log.id : ''}`,
        {
          method: log.id ? 'PATCH' : 'POST',
          body: JSON.stringify({
            ...log,
            date: log.date && new Date(log.date),
          }),
        }
      );
      return await res.json();
    } catch (error) {
      throw error;
    }
  },
  onSuccess: (data) => {
    updateTodayLogAtom(data, ['log', get(todayAtom)]);
  },
}));

export const logFormDataAtom = atom<Partial<logFormSchemaType> | null>(null);
