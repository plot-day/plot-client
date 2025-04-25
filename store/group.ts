import { parseRank } from '@/util/convert';
import { replaceAtom } from '@/util/query';
import { atomWithMutation, atomWithQuery } from 'jotai-tanstack-query';
import { LexoRank } from 'lexorank';

export interface GroupType {
  id: string;
  title: string;
  userId?: string;
  isDefault: boolean;
  isUuid?: boolean;
  rank: LexoRank;
}

export const groupAtom = atomWithQuery<GroupType[]>(() => {
  return {
    queryKey: ['group'],
    queryFn: async () => {
      const res = await fetch('/api/group');
      const data = await res.json();
      return data.map((item: any) => parseRank(item));
    },
  };
});

export const groupMutation = atomWithMutation<GroupType, any>(() => ({
  mutationKey: ['group'],
  mutationFn: async (groups) => {
    try {
      const res = await fetch(
        `/api/group`,
        {
          method: 'PUT',
          body: JSON.stringify(groups),
        }
      );
      return await res.json();
    } catch (error) {
      throw error;
    }
  },
  onSuccess: (data) => {
    replaceAtom(data, 'group');
  },
}));
