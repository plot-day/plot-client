import { atomWithQuery } from 'jotai-tanstack-query';
// import { LexoRank } from 'lexorank';

export interface CategoryType {
  id: string;
  icon: string;
  title: string;
  userId?: string;
  fields: { icon: string; label: string; value?: string }[];
}

export const categoriesAtom = atomWithQuery<CategoryType[]>(() => {
  return {
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/api/category');
      return [
        {
          title: 'Bass',
          group: 'Hobby',
          icon: '🎸',
          fields: [
            { icon: 'fa6/FaItunesNote', label: 'Song', value: '' },
            { icon: 'gi/GiMetronome', label: 'bpm', value: '' },
          ],
          id: '1',
        },
        {
          title: 'Home Training',
          group: 'Fitness',
          icon: '💪',
          fields: [{ icon: 'io5/IoBarbell', label: 'Excercise', value: '' }],
          id: '2',
        },
        { title: 'Schedule', group: 'Lifestyle', icon: '📆', fields: [], id: '3' },
        {
          title: 'Sleep',
          group: 'Lifestyle',
          icon: '🌙',
          fields: [{ icon: 'fa6/FaClock', label: 'Time' }],
          id: '5',
        },
        { title: 'Expense', group: 'Lifestyle', icon: '💸', fields: [], id: '6' },
        { title: 'Mood', group: 'Lifestyle', icon: '🙂', fields: [], id: '7' },
      ];
      //   const categories = await res.json();

      //   return categories.map((category: any) => ({
      //     ...category,
      //     rank: LexoRank.parse(category.rank),
      //   }));
    },
  };
});
