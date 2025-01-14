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
  id: string;
  icon: string; 
  label: string; 
  type: string;
  option: any[];
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
            { id: 'a1', icon: 'FaItunesNote', label: 'Song', type: 'text', option: [] },
            { id: 'a2', icon: 'GiMetronome', label: 'bpm', type: 'number', option: [] },
          ],
          id: '1',
        },
        {
          title: 'Home Training',
          group: 'Fitness',
          groupId: '5',
          defaultLogType: 'task',
          icon: '💪',
          fields: [{ id: 'b1', icon: 'TbBarbellFilled', label: 'Excercise', type: 'text', option: [] }],
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
          fields: [{ id: 'c1', icon: 'FaClock', label: 'Duration',  type: "timestamp", option: [] }, ],
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
        {
          title: 'Test',
          group: '',
          groupId: '',
          icon: '🧪',
          defaultLogType: 'task',
          fields: [
            { id: 'd1', icon: 'MdTextFields', label: 'Text',  type: "text", option: [] },
            { id: 'd2', icon: 'GoNumber', label: 'Number',  type: "number", option: [] },
            { id: 'd3', icon: 'IoCalendarNumber', label: 'Date',  type: "date", option: [] },
            { id: 'd4', icon: 'MdTimer', label: 'Timestamp',  type: "timestamp", option: [] },
            { id: 'd5', icon: 'FaTag', label: 'Tags',  type: "tags", option: [] },
            { id: 'd6', icon: 'MdRadioButtonChecked', label: 'Options',  type: "options", option: [] },
            { id: 'd7', icon: 'FaLink', label: 'URL',  type: "url", option: [] },
          ],
          id: '9',
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
