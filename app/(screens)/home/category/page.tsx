'use client';
import Button from '@/components/button/Button';
import { DraggableItem, DragHandle } from '@/components/draggable/DraggableItem';
import DraggableList from '@/components/draggable/DraggableList';
import IconHolder from '@/components/icon/IconHolder';
import Loader from '@/components/loader/Loader';
import { categoryAtom } from '@/store/category';
import { logMutation, logsCategoryAtom } from '@/store/log';
import { categoryPageAtom } from '@/store/ui';
import { cn } from '@/util/cn';
import { sortRank } from '@/util/convert';
import { useAtom, useAtomValue } from 'jotai';
import { useEffect, useMemo, useState } from 'react';
import { IoCheckmarkSharp } from 'react-icons/io5';
import GroupTab from '../_components/GroupTab';
import LogItem from '../_components/LogItem';
import CategoryItem from './_components/CategoryItem';

const Page = () => {
  const [currentCategory, setCurrentCategory] = useAtom(categoryPageAtom);
  const { data: logs, isFetching: isFetchingLogs } = useAtomValue(logsCategoryAtom);
  const { data: allCategories, isFetching: isFetchingCategories } =
    useAtomValue(categoryAtom);
  const { mutate } = useAtomValue(logMutation);

  const [group, setGroup] = useState('all');

  const todos = useMemo(() => sortRank(logs || [], 'categoryRank').filter((item) => item.status === 'todo'), [logs]);

  const [showDone, setShowDone] = useState(false);

  const updateChangeHandler = (item: any) => {
    mutate(item);
  };

  const categories = useMemo(
    () => allCategories?.filter((item) => group === 'all' || item.groupId === group),
    [allCategories, group]
  );

  useEffect(() => {
    if (!currentCategory) {
      const defaultCategory = categories?.find((item) => item.isDefault);
      if (defaultCategory) {
        setCurrentCategory(defaultCategory);
      }
    }
  }, [currentCategory, categories]);

  return (
    <div className="p-8">
      <GroupTab id="category-page-group-tab" group={group} setGroup={setGroup} />
      <ul className="flex gap-2 overflow-x-scroll scrollbar-hide mb-6">
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
            {currentCategory?.id === category.id && (
              <span className="text-3xl leading-none">﹒</span>
            )}
          </div>
        ))}
      </ul>
      {/* Header */}
      {currentCategory && (
        <>
          <div className="my-2 flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <IconHolder className="w-20 h-20 text-3xl" isCircle={true}>
                {currentCategory?.icon}
              </IconHolder>
              <div>
                <p className="text-sm font-medium">{currentCategory?.group?.title}</p>
                <h2 className="block text-3xl font-extrabold">
                  {currentCategory?.title}
                </h2>
              </div>
            </div>
            <Button className="text-xs px-2 py-1">Edit Category</Button>
          </div>
          <div className="w-full flex justify-end">
            <button
              type="button"
              className={cn(
                'flex gap-1 items-center text-sm font-semibold',
                showDone ? '' : 'text-gray-400'
              )}
              onClick={() => {
                setShowDone((prev) => !prev);
              }}
            >
              <IoCheckmarkSharp /> Done {logs && todos ? logs?.length - todos?.length : 0}
            </button>
          </div>
        </>
      )}
      {isFetchingLogs && isFetchingCategories ? (
        <div
          className={cn(
            'w-full h-full flex justify-center items-center',
            logs?.length ? 'py-10' : 'py-72'
          )}
        >
          <Loader />
        </div>
      ) : (
        <DraggableList
          className="space-y-6 mt-8"
          items={
            showDone
              ? (logs && [...logs].sort((a, b) => a.todayRank?.compareTo(b.todayRank))) ||
                []
              : (todos &&
                  [...todos].sort((a, b) => a.todayRank?.compareTo(b.todayRank))) ||
                []
          }
          rankKey="categoryRank"
          updateChange={updateChangeHandler}
          renderItem={(item) => (
            <DraggableItem id={item.id} className="flex items-center gap-2">
              <DragHandle />
              <LogItem key={item.id} {...item} />
            </DraggableItem>
          )}
        />
      )}
    </div>
  );
};

export default Page;
