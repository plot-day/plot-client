import { logFormSchemaType } from '@/app/(screens)/home/_overlays/LogInputOverlay';
import { parseRank, sortRank } from '@/util/convert';
import { getDashDate, getDateTimeStr } from '@/util/date';
import { updateCategoryLogAtom, updateInboxLogAtom, updateTodayLogAtom } from '@/util/query';
import { atom } from 'jotai';
import { atomWithMutation, atomWithQuery } from 'jotai-tanstack-query';
import { LexoRank } from 'lexorank';
import { categoryAtom, CategoryType } from './category';
import { categoryPageAtom, todayAtom } from './ui';

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
  inboxRank: LexoRank;
  categoryRank: LexoRank;
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
      return sortRank(data.map((item: any) => ({ 
        ...parseRank(item),
        date: item.date && new Date(item.date) 
      })), 'todayRank');
    },
  };
});


export const logsInboxAtom = atomWithQuery<LogType[]>((get) => {
  return {
    queryKey: ['log', null],
    queryFn: async () => {
      const res = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL + `/api/log?date=null`
      );
      const data = await res.json();
      return sortRank(data.map((item: any) => ({ 
        ...parseRank(item),
        date: item.date && new Date(item.date) 
      })), 'inboxRank');
    },
  };
});

export const logsCategoryAtom = atomWithQuery<LogType[]>((get) => {
  return {
    queryKey: ['log', get(categoryPageAtom)?.id],
    queryFn: async ({ queryKey: [, categoryId] }) => {
      const res = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL + `/api/log?categoryId=${categoryId || ''}`
      );
      const data = await res.json();
      return sortRank(data.map((item: any) => ({ 
        ...parseRank(item),
        date: item.date && new Date(item.date) 
      })), 'categoryRank');
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
    updateCategoryLogAtom(data, ['log', get(categoryPageAtom)?.id]);
    updateInboxLogAtom(data, ['log', null]);
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