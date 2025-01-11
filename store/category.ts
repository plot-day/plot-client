import { atom } from 'jotai';
import { atomWithQuery } from 'jotai-tanstack-query';
// import { LexoRank } from 'lexorank';

export interface CategoryType {
  id: string;
  icon: string;
  title: string;
  group: string;
  groupId: string;
  userId?: string;
  defaultLogType: string;
  fields: FieldType[];
}

export interface FieldType {
  icon: string; 
  label: string; 
  value?: string 
}

export const categoriesAtom = atomWithQuery<CategoryType[]>(() => {
  return {
    queryKey: ['categories'],
    queryFn: async () => {
      // const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/api/category');
      return [
        {
          title: 'Todo',
          group: 'Lifestyle',
          groupId: '6',
          icon: '✅',
          defaultLogType: 'task',
          fields: [],
          id: '8',
        },
        {
          title: 'Bass',
          group: 'Hobby',
          groupId: '4',
          defaultLogType: 'task',
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
          groupId: '5',
          defaultLogType: 'task',
          icon: '💪',
          fields: [{ icon: 'io5/IoBarbell', label: 'Excercise', value: '' }],
          id: '2',
        },
        {
          title: 'Schedule',
          group: 'Lifestyle',
          groupId: '6',
          defaultLogType: 'event',
          icon: '📆',
          fields: [],
          id: '3',
        },
        {
          title: 'Sleep',
          group: 'Lifestyle',
          groupId: '6',
          defaultLogType: 'note',
          icon: '🌙',
          fields: [{ icon: 'fa6/FaClock', label: 'Time' }],
          id: '5',
        },
        {
          title: 'Expense',
          group: 'Lifestyle',
          groupId: '6',
          icon: '💸',
          defaultLogType: 'note',
          fields: [],
          id: '6',
        },
        {
          title: 'Mood',
          group: 'Lifestyle',
          groupId: '6',
          icon: '🙂',
          defaultLogType: 'note',
          fields: [],
          id: '7',
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

export const selectedCategoryAtom = atom<CategoryType | null>(null);
