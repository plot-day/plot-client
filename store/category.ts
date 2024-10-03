import { atomWithQuery } from 'jotai-tanstack-query';
// import { LexoRank } from 'lexorank';

export interface CategoryType {
  id: string | number;
  title: string;
  userId?: string;
}

export const categoriesAtom = atomWithQuery<CategoryType[]>(() => {
  return {
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/api/category');
      return [
        { title: 'Bass', group: 'Hobby', icon: '🎸', id: 1 },
        { title: 'Home Training', group: 'Fitness', icon: '💪', id: 2 },
        { title: 'Schedule', group: 'Lifestyle', icon: '📆', id: 3 },
        { title: 'Sleep', group: 'Lifestyle', icon: '🌙', id: 5 },
        { title: 'Expense', group: 'Lifestyle', icon: '💸', id: 6 },
        { title: 'Mood', group: 'Lifestyle', icon: '🙂', id: 7 },
      ];
      //   const categories = await res.json();

      //   return categories.map((category: any) => ({
      //     ...category,
      //     rank: LexoRank.parse(category.rank),
      //   }));
    },
  };
});
