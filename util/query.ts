import { queryClient } from '@/lib/query';
import { parseRank, sortRank } from './convert';
import { getDashDate } from './date';

export const updateAtom = (data: any, key: string | any[]) => {
  queryClient.setQueryData(typeof key === 'string' ? [key] : key, (prev: any) => {
    return [...prev.filter((item: any) => item.id !== data.id), parseRank(data)];
  });
};

export const updateTodayPlotAtom = (data: any, key: string | any[]) => {
  if (getDashDate(key[1]) === getDashDate(data.date)) {
    queryClient.setQueryData(typeof key === 'string' ? [key] : key, (prev: any) => {
      return sortRank([...prev.filter((item: any) => item.id !== data.id), parseRank(data)], 'todayRank');
    });
  } else {
    removeAtom(data.id, key);
  }
};

export const updateInboxPlotAtom = (data: any, key: string | any[]) => {
  if (!data.date) {
    queryClient.setQueryData(typeof key === 'string' ? [key] : key, (prev: any) => {
      return sortRank([...prev.filter((item: any) => item.id !== data.id), parseRank(data)], 'inboxRank');
    });
  } else {
    removeAtom(data.id, key);
  }
};

export const updateCategoryPlotAtom = (data: any, key: string | any[]) => {
  if (data.categoryId === key[1]) {
    queryClient.setQueryData(typeof key === 'string' ? [key] : key, (prev: any) => {
      return sortRank([...prev.filter((item: any) => item.id !== data.id), parseRank(data)], 'categoryRank');
    });
  } else {
    removeAtom(data.id, key);
  }
};

export const replaceAtom = (data: any, key: string | any[]) => {
  queryClient.setQueryData(
    typeof key === 'string' ? [key] : key,
    data.map((item: any) => item && parseRank(item))
  );
};

export const removeAtom = (id: string, key: string | any[]) => {
  queryClient.setQueryData(
    typeof key === 'string' ? [key] : key,
    (prev: any) => prev?.filter((item: any) => item.id !== id));
}
