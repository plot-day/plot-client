import { queryClient } from '@/lib/query';
import { parseRank } from './convert';

export const updateAtom = (data: any, key: string | any[]) => {
  queryClient.setQueryData(typeof key === 'string' ? [key] : key, (prev: any) => {
    return [...prev.filter((item: any) => item.id !== data.id), parseRank(data)];
  });
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
    (prev: any) => prev.filter((item: any) => item.id !== id));
}
