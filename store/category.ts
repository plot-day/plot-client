import { atom } from 'jotai';
import { atomWithMutation, atomWithQuery } from 'jotai-tanstack-query';
import { GroupType } from './group';
import { parseRank, sortRank } from '@/util/convert';
import { categoryFormSchemaType } from '@/app/(screens)/home/_overlays/CategoryInputOverlay';
import { LexoRank } from 'lexorank';
import { replaceAtom, updateAtom } from '@/util/query';
import { plotsCategoryAtom, plotsInboxAtom, plotsTodayAtom } from './plot';

export interface CategoryType {
  id: string;
  icon: string;
  title: string;
  group: GroupType;
  groupId: string;
  userId?: string;
  defaultPlotType: string;
  fields: FieldType[];
  isDefault: boolean;
  rank: LexoRank;
}

export interface FieldType {
  id: string;
  icon: string;
  label: string;
  type: string;
  option: any[];
}

export const categoryAtom = atomWithQuery<CategoryType[]>(() => {
  return {
    queryKey: ['category'],
    queryFn: async () => {
      const res = await fetch('/api/category');
      const data = await res.json();
      return sortRank(data.map((item: any) => parseRank(item)), 'rank');
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
        `/api/category${
          category.id ? '/' + category.id : ''
        }`,
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
    const {refetch: refetchTodayPlots} = get(plotsTodayAtom);
    const {refetch: refetchInboxPlots} = get(plotsInboxAtom);
    const {refetch: refetchCategoryPlots} = get(plotsCategoryAtom);
    refetchTodayPlots();
    refetchInboxPlots();
    refetchCategoryPlots();
  },
}));


export const categoriesMutation = atomWithMutation<CategoryType, any>(() => ({
  mutationKey: ['categories'],
  mutationFn: async (categories) => {
    try {
      const res = await fetch(
        `/api/category`,
        {
          method: 'PUT',
          body: JSON.stringify(categories),
        }
      );
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
