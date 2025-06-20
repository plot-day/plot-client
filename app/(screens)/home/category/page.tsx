'use client';
import {
  DraggableItem,
  DragHandle,
} from '@/components/draggable/DraggableItem';
import DraggableList from '@/components/draggable/DraggableList';
import IconHolder from '@/components/icon/IconHolder';
import Loader from '@/components/loader/Loader';
import { categoryAtom } from '@/store/category';
import { todoMutation, todosCategoryAtom } from '@/store/todo';
import { categoryPageAtom } from '@/store/ui';
import { cn } from '@/util/cn';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { IoCheckmarkSharp } from 'react-icons/io5';
import GroupTab from '../_components/GroupTab';
import TodoItem from '../_components/TodoItem';
import CategoryItem from './_components/CategoryItem';
import dayjs from 'dayjs';
import { getDashDate } from '@/util/date';

const Page = () => {
  const pathname = usePathname();

  const [currentCategory, setCurrentCategory] = useAtom(categoryPageAtom);
  const {
    data: todos,
    isFetching: isFetchingTodos,
    refetch,
  } = useAtomValue(todosCategoryAtom);
  const { data: allCategories, isFetching: isFetchingCategories } =
    useAtomValue(categoryAtom);
  const setCategoryPageAtom = useSetAtom(categoryPageAtom);
  const { mutate } = useAtomValue(todoMutation);

  const [group, setGroup] = useState('all');

  // TASK
  const todoList = useMemo(
    () => (todos || []).filter((item) => item.status === 'todo' && !item.date),
    [todos]
  );

  const scheduled = useMemo(
    () => (todos || []).filter((item) => item.status === 'todo' && item.date),
    [todos]
  );

  const done = useMemo(
    () => (todos || []).filter((item) => item.status === 'done'),
    [todos]
  );

  const [view, setView] = useState('default');

  const updateChangeHandler = (item: any) => {
    mutate(item);
  };

  const categories = useMemo(() => {
    const filtered = (allCategories || []).filter(
      (item) => group === 'all' || item.groupId === group
    );
    setCategoryPageAtom(filtered.length ? filtered[0] : null);
    return filtered;
  }, [allCategories, group]);

  useEffect(() => {
    if (!currentCategory) {
      const defaultCategory = categories?.find((item) => item.isDefault);
      if (defaultCategory) {
        setCurrentCategory(defaultCategory);
      }
    }
  }, [currentCategory, categories]);

  return (
    <div className="p-8 flex flex-col justify-between h-full">
      {currentCategory && (
        <>
          <div className="my-2 flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <IconHolder className="w-20 h-20 text-3xl" isCircle={true}>
                {currentCategory?.icon}
              </IconHolder>
              <div>
                <p className="text-sm font-medium">
                  {currentCategory?.group?.title}
                </p>
                <h2 className="block text-3xl font-extrabold">
                  {currentCategory?.title}
                </h2>
              </div>
            </div>
            <Link
              className="text-xs px-2 py-1 bg-primary text-white rounded-md font-extrabold"
              href={`${pathname}?category-input=show&categoryId=${
                currentCategory?.id || ''
              }&rank=${currentCategory?.rank}`}
            >
              Edit Category
            </Link>
          </div>
          <div className="w-full flex justify-between gap-4">
            <div className="flex gap-2 items-center">
              <>
                <button
                  type="button"
                  className={cn(
                    'flex gap-1 items-center text-sm font-semibold',
                    view === 'scheduled' ? '' : 'text-gray-400'
                  )}
                  onClick={() => {
                    setView((prev) =>
                      prev === 'scheduled' ? 'default' : 'scheduled'
                    );
                  }}
                >
                  <IoCheckmarkSharp /> Scheduled{' '}
                  {scheduled ? scheduled?.length : 0}
                </button>
                <button
                  type="button"
                  className={cn(
                    'flex gap-1 items-center text-sm font-semibold',
                    view === 'done' ? '' : 'text-gray-400'
                  )}
                  onClick={() => {
                    setView((prev) => (prev === 'done' ? 'default' : 'done'));
                  }}
                >
                  <IoCheckmarkSharp /> Done {todos && done ? done?.length : 0}
                </button>
              </>
            </div>
          </div>
        </>
      )}

      {/* Todos */}
      <div>
        {isFetchingTodos && isFetchingCategories ? (
          <div
            className={cn(
              'w-full h-full flex justify-center items-center',
              todos?.length ? 'py-10' : 'py-72'
            )}
          >
            <Loader />
          </div>
        ) : (
          <DraggableList
            className="space-y-6 mt-4 h-[50dvh] pb-10 overflow-y-scroll scrollbar-hide"
            items={
              // Todo
              view === 'done'
                ? (done &&
                    todoList &&
                    [...done, ...todoList].sort((a, b) =>
                      a.categoryRank?.compareTo(b.categoryRank)
                    )) ||
                  []
                : view === 'scheduled'
                ? [...scheduled, ...todoList].sort((a, b) =>
                    a.categoryRank?.compareTo(b.categoryRank)
                  ) || []
                : (todoList &&
                    [...todoList].sort((a, b) =>
                      a.categoryRank?.compareTo(b.categoryRank)
                    )) ||
                  []
            }
            rankKey="categoryRank"
            updateChange={updateChangeHandler}
            renderItem={(item) => (
              <DraggableItem
                id={item.id}
                className="flex items-center gap-2 [&_.date]:block [&_.category]:hidden"
              >
                <DragHandle />
                <TodoItem key={item.id} {...item} />
              </DraggableItem>
            )}
          />
        )}
      </div>

      {/* Categories */}
      <div>
        <GroupTab
          id="category-page-group-tab"
          group={group}
          setGroup={setGroup}
        />
        <ul className="flex gap-2 overflow-x-scroll scrollbar-hide mt-4">
          {categories?.map((category) => (
            <div
              key={category.id}
              className={cn(
                'flex flex-col items-center',
                category.id !== currentCategory?.id ? 'opacity-30' : ''
              )}
            >
              <CategoryItem
                {...category}
                onClick={() => {
                  setCurrentCategory(category);
                }}
              />
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Page;
