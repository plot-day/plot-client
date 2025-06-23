import { parseRank } from '@/util/convert';
import { replaceAtom } from '@/util/query';
import { atom } from 'jotai';
import { atomWithMutation, atomWithQuery } from 'jotai-tanstack-query';
import { LexoRank } from 'lexorank';

export interface FilterType {
  id: string;
  title: string;
  icon: string;
  userId?: string;
  isActive: boolean;
  hideTodos: boolean;
  hideIfZero: boolean;
  query: any;
  rank: LexoRank;
}

export const filtersAtom = atomWithQuery<FilterType[]>(() => {
  return {
    queryKey: ['filters'],
    queryFn: async () => {
      const res = await fetch('/api/filter');
      const data = await res.json();
      return data.map((item: any) => parseRank(item));
    },
  };
});

export const filterAtom = atom<FilterType | undefined>();

export const filterMutation = atomWithMutation<FilterType, any>(() => ({
  mutationKey: ['filter'],
  mutationFn: async (filters) => {
    try {
      const res = await fetch(`/api/filter`, {
        method: 'PUT',
        body: JSON.stringify(filters),
      });
      return await res.json();
    } catch (error) {
      throw error;
    }
  },
  onSuccess: (data) => {
    replaceAtom(data, 'filter');
  },
}));
