import { atomWithQuery } from 'jotai-tanstack-query';
// import { LexoRank } from 'lexorank';

export interface GroupType {
  id: string;
  title: string;
  userId?: string;
}

export const groupsAtom = atomWithQuery<GroupType[]>(() => {
  return {
    queryKey: ['groups'],
    queryFn: async () => {
      //   const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/api/group');
      return [
        {
          title: 'Work',
          id: '1',
        },
        {
          title: 'Study',
          id: '2',
        },
        {
          title: 'Project',
          id: '3',
        },
        {
          title: 'Hobby',
          id: '4',
        },
        {
          title: 'Fitness',
          id: '5',
        },
        {
          title: 'LifeStyle',
          id: '6',
        },
      ];
      //   const categories = await res.json();

      //   return categories.map((category: any) => ({
      //     ...category,
      //     rank: LexoRank.parse(category.rank),
      //   }));
    },
  };
});
