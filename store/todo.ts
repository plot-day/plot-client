import { todoFormSchemaType } from '@/app/(screens)/home/_overlays/TodoInputOverlay';
import { parseRank, sortRank } from '@/util/convert';
import { getDashDate, getDateTimeStr } from '@/util/date';
import { updateCategoryTodoAtom, updateTodoAtom } from '@/util/query';
import { atom } from 'jotai';
import { atomWithMutation, atomWithQuery } from 'jotai-tanstack-query';
import { LexoRank } from 'lexorank';
import { categoryAtom, CategoryType } from './category';
import { categoryPageAtom, todayAtom } from './ui';
import { filterAtom, filtersAtom, FilterType } from './filter';

export interface TodoType {
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
  rank: LexoRank;
  categoryRank: LexoRank;
}

export interface LogType {
  id: string;
  content: string;
  todoId: string;
  todo: TodoType;
}

export type StatusType = 'todo' | 'done' | 'dismiss';

export const todosTodayAtom = atomWithQuery<TodoType[]>((get) => {
  return {
    queryKey: ['todo', get(todayAtom)],
    queryFn: async ({ queryKey: [, today] }) => {
      const res = await fetch(`/api/todo?date=${getDashDate(today as Date)}`);
      const data = await res.json();
      return sortRank(
        data.map((item: any) => {
          const [year, month, day] = item.date.split('-');
          return {
            ...parseRank(item),
            date: item.date && new Date(year, month - 1, day),
          };
        }),
        'todayRank'
      );
    },
  };
});

export const filteredTodosAtom = atomWithQuery<TodoType[]>((get) => {
  return {
    queryKey: ['todo', get(filterAtom)],
    queryFn: async ({ queryKey: [, filter] }) => {
      console.log({ filter });
      let query = (filter as FilterType)?.query;
      if (!query) {
        query = get(filtersAtom)?.data?.[0]?.query;
        if (!query) {
          return [];
        }
      }

      const res = await fetch(`/api/todo?filter=${JSON.stringify(query)}`);
      const data = await res.json();
      return (
        sortRank(
          data.map((item: any) => parseRank(item)),
          'todayRank'
        ) || []
      );
    },
  };
});

export const todosCategoryAtom = atomWithQuery<TodoType[]>((get) => {
  return {
    queryKey: ['todo', get(categoryPageAtom)?.id],
    queryFn: async ({ queryKey: [, categoryId] }) => {
      if (categoryId) {
        const res = await fetch(`/api/todo?categoryId=${categoryId || ''}`);
        const data = await res.json();
        return sortRank(
          data.map((item: any) => {
            if (item.date) {
              const [year, month, day] = item.date.split('-');
              return {
                ...parseRank(item),
                date: item.date && new Date(year, month - 1, day),
              };
            } else {
              return parseRank(item);
            }
          }),
          'categoryRank'
        );
      } else {
        return [];
      }
    },
  };
});

export const todosOverdueAtom = atomWithQuery<TodoType[]>((get) => {
  return {
    queryKey: ['todo-overdue'],
    queryFn: async () => {
      const res = await fetch(
        `/api/todo?status=todo&before=${getDashDate(new Date())}`
      );
      const data = await res.json();
      return sortRank(
        data.map((item: any) => {
          const [year, month, day] = item.date.split('-');
          return {
            ...parseRank(item),
            date: item.date && new Date(year, month - 1, day),
          };
        }),
        'todayRank'
      );
    },
  };
});

export const todoMutation = atomWithMutation<
  TodoType,
  Partial<todoFormSchemaType>
>((get) => ({
  mutationKey: ['todo'],
  mutationFn: async (todo) => {
    try {
      const res = await fetch(`/api/todo${todo.id ? '/' + todo.id : ''}`, {
        method: todo.id ? 'PATCH' : 'POST',
        body: JSON.stringify({
          ...todo,
          date: todo.date && getDashDate(todo.date),
        }),
      });
      get(todosOverdueAtom).refetch();
      return await res.json();
    } catch (error) {
      throw error;
    }
  },
  onSuccess: (data) => {
    updateTodoAtom(data, ['todo', get(todayAtom)]);
    get(filteredTodosAtom).refetch();
    updateCategoryTodoAtom(data, ['todo', get(categoryPageAtom)?.id]);
  },
}));

export const currentTodoAtom = atom<Partial<TodoType> | null>(null);
export const todoFormDataAtom = atom(
  (get) => {
    const todo = get(currentTodoAtom);
    return (
      todo && {
        ...todo,
        categoryId: todo?.category?.id,
        date: getDateTimeStr(todo?.date),
        category: undefined,
      }
    );
  },
  (get, set, update: Partial<TodoType> | null) => {
    set(currentTodoAtom, update);
  }
);
