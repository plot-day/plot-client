import { atomWithQuery } from 'jotai-tanstack-query';
// import { LexoRank } from 'lexorank';

export interface GroupType {
  id: string;
  title: string;
  userId?: string;
  isDefault: boolean;
}

export const groupsAtom = atomWithQuery<GroupType[]>(() => {
  return {
    queryKey: ['groups'],
    queryFn: async () => {
      const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/api/group');
      const data = await res.json();
      return data;
    },
  };
});
