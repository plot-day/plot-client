import { atom } from 'jotai';
import { atomWithQuery } from 'jotai-tanstack-query';
import { GroupType } from './group';
// import { LexoRank } from 'lexorank';

export interface CategoryType {
  id: string;
  icon: string;
  title: string;
  group: GroupType;
  groupId: string;
  userId?: string;
  defaultLogType: string;
  fields: FieldType[];
  isDefault: boolean;
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
      const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/api/category');
      const data = await res.json();
      return data;
    }
  };
});

export const selectedCategoryAtom = atom<CategoryType | null>(null);

export const defaultCategoryAtom = atom<CategoryType | undefined>((get) => {
  const { data } = get(categoriesAtom);
  return data?.find((item) => item.isDefault);
});
