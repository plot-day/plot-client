import { logFormSchemaType } from '@/app/(screens)/home/_overlays/LogInputOverlay';
import { parseRank } from '@/util/convert';
import { getDashDate, getDateTimeStr } from '@/util/date';
import { atomWithMutation, atomWithQuery } from 'jotai-tanstack-query';
import { CategoryType } from './category';
import { todayAtom } from './ui';
import { LexoRank } from 'lexorank';
import { updateTodayLogAtom } from '@/util/query';
import { atom } from 'jotai';
import dayjs from 'dayjs';

export interface LogType {
  id: string;
  icon: string;
  title: string;
  content?: string;
  categoryId: string;
  category: CategoryType;
  type: string;
  status?: StatusType;
  date?: Date;
  dueDate?: Date;
  fieldValues: any;
  todayRank: LexoRank;
}

export type StatusType = 'todo' | 'done' | 'dismiss';

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


export const logsNextAtom = atomWithQuery<LogType[]>((get) => {
  return {
    queryKey: ['log', dayjs(get(todayAtom) as Date).add(1, 'day')],
    queryFn: async ({ queryKey: [, today] }) => {
      const next = dayjs(today as Date).add(1, 'day');
      const res = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL + `/api/log?date=${getDashDate(next)}`
      );
      const data = await res.json();
      return data.map((item: any) => ({ 
        ...parseRank(item),
        date: item.date && new Date(item.date) 
      }));
      return [];
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


export const currentLogAtom = atom<Partial<LogType> | null>(null);
export const logFormDataAtom = atom(
  (get) => {
    const log = get(currentLogAtom);
    return log && {
      ...log,
      categoryId: log?.category?.id,
      date: getDateTimeStr(log?.date),
      category: undefined,
    };
  },
  (get, set, update: Partial<LogType> | null) => {
    set(currentLogAtom, update);
  }
);