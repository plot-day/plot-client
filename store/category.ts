import { atom } from 'jotai';
import { atomWithMutation, atomWithQuery } from 'jotai-tanstack-query';
import { GroupType } from './group';
import { parseRank, sortRank } from '@/util/convert';
import { categoryFormSchemaType } from '@/app/(screens)/home/_overlays/CategoryInputOverlay';
import { LexoRank } from 'lexorank';
import { replaceAtom, updateAtom } from '@/util/query';
import { todosCategoryAtom, todosTodayAtom } from './todo';

export interface CategoryType {
  id: string;
  icon: string;
  title: string;
  group: GroupType;
  groupId: string;
  userId?: string;
  fields: FieldType[];
  isDefault: boolean;
  rank: LexoRank;
}

export interface FieldType {
  id: string;
  icon: string;
  label: string;
  type: string;
  option?: TagOptionType | NumberOptionType | DateOptionType;
}

export interface TagOptionType {
  tags: TagType[];
}

export interface TagType {
  id: string;
  title: string;
  rank: LexoRank | string;
}

export interface NumberOptionType {
  min: number;
  max: number;
  step: number;
  prefix: string;
  suffix: string;
  alias: string[];
}

export interface DateOptionType {
  enableTime: boolean;
  enableDate: boolean;
  enableYear: boolean;
  enableMonth: boolean;
  enableDay: boolean;
  enableHour: boolean;
  enableMinute: boolean;
  enableSecond: boolean;
}

export const categoryAtom = atomWithQuery<CategoryType[]>(() => {
  return {
    queryKey: ['category'],
    queryFn: async () => {
      const res = await fetch('/api/category');
      const data = await res.json();
      return sortRank(
        data.map((item: any) => parseRank(item)),
        'rank'
      );
    },
  };
});

export const categoryMutation = atomWithMutation<
  CategoryType,
  Partial<categoryFormSchemaType>
>((get) => ({
  mutationKey: ['category'],
  mutationFn: async (category) => {
    try {
      const res = await fetch(
        `/api/category${category.id ? '/' + category.id : ''}`,
        {
          method: category.id ? 'PATCH' : 'POST',
          body: JSON.stringify(category),
        }
      );
      return await res.json();
    } catch (error) {
      throw error;
    }
  },
  onSuccess: (data) => {
    updateAtom(data, 'category');
    const { refetch: refetchTodayTodos } = get(todosTodayAtom);
    const { refetch: refetchCategoryTodos } = get(todosCategoryAtom);
    refetchTodayTodos();
    refetchCategoryTodos();
  },
}));

export const categoriesMutation = atomWithMutation<CategoryType, any>(() => ({
  mutationKey: ['categories'],
  mutationFn: async (categories) => {
    try {
      const res = await fetch(`/api/category`, {
        method: 'PUT',
        body: JSON.stringify(categories),
      });
      return await res.json();
    } catch (error) {
      throw error;
    }
  },
  onSuccess: (data) => {
    replaceAtom(data, 'category');
  },
}));

export const selectedCategoryAtom = atom<CategoryType | null>(null);

export const defaultCategoryAtom = atom<CategoryType | undefined>((get) => {
  const { data } = get(categoryAtom);
  return data?.find((item) => item.isDefault);
});

export const fieldInputAtom = atom<FieldType | null>(null);

export const fieldMutation = atomWithMutation<
  { categoryId: string; fieldId: string; field: FieldType },
  any
>(() => ({
  mutationKey: ['fields'],
  mutationFn: async ({ categoryId, fieldId, field }) => {
    try {
      const res = await fetch(`/api/category/${categoryId}/field/${fieldId}`, {
        method: 'PUT',
        body: JSON.stringify(field),
      });
      return await res.json();
    } catch (error) {
      throw error;
    }
  },
  onSuccess: (data) => {
    updateAtom(data, 'category');
  },
}));
