import { plotFormSchemaType } from '@/app/(screens)/home/_overlays/PlotInputOverlay';
import { parseRank, sortRank } from '@/util/convert';
import { getDashDate, getDateTimeStr } from '@/util/date';
import { updateCategoryPlotAtom, updateInboxPlotAtom, updateTodayPlotAtom } from '@/util/query';
import { atom } from 'jotai';
import { atomWithMutation, atomWithQuery } from 'jotai-tanstack-query';
import { LexoRank } from 'lexorank';
import { categoryAtom, CategoryType } from './category';
import { categoryPageAtom, todayAtom } from './ui';

export interface PlotType {
  id: string;
  icon: string;
  title: string;
  description?: string;
  logs?: LogType[];
  categoryId: string;
  category: CategoryType;
  type: string;
  status?: StatusType;
  date?: Date | string;
  dueDate?: Date;
  fieldValues: any;
  todayRank: LexoRank;
  inboxRank: LexoRank;
  categoryRank: LexoRank;
}

export interface LogType {
  id: string;
  content: string;
  plotId: string;
  plot: PlotType;
}

export type StatusType = 'todo' | 'done' | 'dismiss';

export const plotsTodayAtom = atomWithQuery<PlotType[]>((get) => {
  return {
    queryKey: ['plot', get(todayAtom)],
    queryFn: async ({ queryKey: [, today] }) => {
      const res = await fetch(`/api/plot?date=${getDashDate(today as Date)}`
      );
      const data = await res.json();
      return sortRank(data.map((item: any) => {
        const [year, month, day] = item.date.split('-');
        return { 
          ...parseRank(item),
          date: item.date && new Date(year, month - 1, day) 
        }
      }), 'todayRank');
    },
  };
});


export const plotsInboxAtom = atomWithQuery<PlotType[]>((get) => {
  return {
    queryKey: ['plot', null],
    queryFn: async () => {
      const res = await fetch(`/api/plot?date=null`);
      const data = await res.json();
      return sortRank(data.map((item: any) => {
        if (item.date) {
          const [year, month, day] = item.date.split('-');
          return { 
            ...parseRank(item),
            date: item.date && new Date(year, month - 1, day) 
          }
        } else {
          return parseRank(item);
        }
      }), 'inboxRank');
    },
  };
});

export const plotsCategoryAtom = atomWithQuery<PlotType[]>((get) => {
  return {
    queryKey: ['plot', get(categoryPageAtom)?.id],
    queryFn: async ({ queryKey: [, categoryId] }) => {
      if (categoryId) {
        const res = await fetch(`/api/plot?categoryId=${categoryId || ''}`);
        const data = await res.json();
        return sortRank(data.map((item: any) => {
          if (item.date) {
            const [year, month, day] = item.date.split('-');
            return { 
              ...parseRank(item),
              date: item.date && new Date(year, month - 1, day) 
            }
          } else {
            return parseRank(item);
          }
        }), 'categoryRank');
      } else {
        return [];
      }
    },
  };
});

export const plotsOverdueAtom = atomWithQuery<PlotType[]>((get) => {
  return {
    queryKey: ['plot-overdue'],
    queryFn: async () => {
      const res = await fetch(`/api/plot?status=todo&before=${getDashDate(new Date())}`
      );
      const data = await res.json();
      return sortRank(data.map((item: any) => {
        const [year, month, day] = item.date.split('-');
        return { 
          ...parseRank(item),
          date: item.date && new Date(year, month - 1, day) 
        }
      }), 'todayRank');
    },
  };
});

export const plotMutation = atomWithMutation<PlotType, Partial<plotFormSchemaType>>((get) => ({
  mutationKey: ['plot'],
  mutationFn: async (plot) => {
    try {
      const res = await fetch(
        `/api/plot${plot.id ? '/' + plot.id : ''}`,
        {
          method: plot.id ? 'PATCH' : 'POST',
          body: JSON.stringify({
            ...plot,
            date: plot.date && getDashDate(plot.date),
          }),
        }
      );
      get(plotsOverdueAtom).refetch();
      return await res.json();
    } catch (error) {
      throw error;
    }
  },
  onSuccess: (data) => {
    updateTodayPlotAtom(data, ['plot', get(todayAtom)]);
    updateCategoryPlotAtom(data, ['plot', get(categoryPageAtom)?.id]);
    updateInboxPlotAtom(data, ['plot', null]);
  },
}));


export const currentPlotAtom = atom<Partial<PlotType> | null>(null);
export const plotFormDataAtom = atom(
  (get) => {
    const plot = get(currentPlotAtom);
    return plot && {
      ...plot,
      categoryId: plot?.category?.id,
      date: getDateTimeStr(plot?.date),
      category: undefined,
    };
  },
  (get, set, update: Partial<PlotType> | null) => {
    set(currentPlotAtom, update);
  }
);

