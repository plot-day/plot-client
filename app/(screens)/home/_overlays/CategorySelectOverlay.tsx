'use client';

import Button from '@/components/button/Button';
import IconHolder from '@/components/icon/IconHolder';
import Loader from '@/components/loader/Loader';
import Overlay from '@/components/overlay/Overlay';
import { categoryAtom, CategoryType, selectedCategoryAtom } from '@/store/category';
import { groupAtom } from '@/store/group';
import { useAtomValue, useSetAtom } from 'jotai';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense, useState } from 'react';
import { FaPencil, FaPlus } from 'react-icons/fa6';
import GroupTab from '../_components/GroupTab';

const CategorySelectOverlay = () => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const { data: categories, isFetching } = useAtomValue(categoryAtom);

  const [group, setGroup] = useState('all');
  const [filter, setFilter] = useState('');

  const filterHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };

  const enterHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      router.push(
        `${pathname}?${params.toString() + '&'}category-input=show&title=${filter}`
      );
      setFilter('');
    }
  };

  return (
    <Overlay id="category-select" title="Select category" isRight={true}>
      <GroupTab
        id="category-select-group-tab"
        className="mb-4"
        group={group}
        setGroup={setGroup}
      />
      <Suspense fallback={<Loader />}>
        <ul className="mb-8 space-y-2 max-h-[500px] overflow-y-scroll scrollbar-hide">
          {isFetching ? (
            <Loader />
          ) : (
            categories
              ?.filter(
                (category) =>
                  (group === 'all' || category.group?.id === group) &&
                  (!filter || category.title.toLowerCase().includes(filter.toLowerCase()))
              )
              .map((category) => <CategorySelectItem key={category.id} {...category} />)
          )}
        </ul>
      </Suspense>
      <div className="relative my-2">
        <input
          className={`w-full bg-gray-100 px-3 py-2 
            pr-[4rem] rounded-md`}
          placeholder="Search Category"
          onChange={filterHandler}
          onKeyDown={enterHandler}
          value={filter}
        />
        <Link
          href={`${pathname}?${
            params.toString() + '&'
          }category-input=show&title=${filter}`}
          className={`block bg-primary text-white rounded-md font-extrabold absolute top-[50%] transform translate-y-[-50%] right-[0.5rem] p-1 
              w-[3rem] text-center text-xs `}
          onClick={() => {
            setFilter('');
          }}
        >
          Add
        </Link>
      </div>
      <div className="flex items-center gap-6 mb-4">
        <Link
          href={`${pathname}?${params.toString() + '&'}category-input=show`}
          className="w-full p-4 flex gap-1 justify-center items-center text-xs text-center font-extrabold"
        >
          <FaPlus />
          Add category
        </Link>
        <Link
          href={`${pathname}?${params.toString() + '&'}category-list=show`}
          className="w-full p-4 flex gap-1 justify-center items-center text-xs text-center font-extrabold"
        >
          <FaPencil className="mt-[0.05rem]" />
          Edit categories
        </Link>
      </div>
    </Overlay>
  );
};

const CategorySelectItem = ({ id, title, icon, group }: Partial<CategoryType>) => {
  const router = useRouter();

  const pathname = usePathname();
  const params = useSearchParams();

  const { data: categories } = useAtomValue(categoryAtom);
  const setCategory = useSetAtom(selectedCategoryAtom);

  const selectCategoryHandler = () => {
    const category = categories?.find((item) => item.id === id) || null;
    setCategory(category);

    setTimeout(() => {
      const currentPath = `${pathname}?${params.toString()}`;
      const currentSplit = currentPath.split('&category-select=show');
      currentSplit[0] && router.replace(currentSplit[0]);
    }, 100);

    router.back();
  };

  return (
    <li key={title} className="w-full flex items-center justify-between cursor-pointer">
      <div className="w-full flex gap-2 items-center" onClick={selectCategoryHandler}>
        <IconHolder isCircle={true}>{icon}</IconHolder>
        <div className="text-left w-full">
          <p className="text-xs font-semibold">{group?.title || 'etc.'}</p>
          <p className="font-bold leading-tight">{title}</p>
        </div>
      </div>
      <Button
        className="px-2 py-1 text-xs rounded-md shrink-0"
        onClick={selectCategoryHandler}
      >
        Add Log
      </Button>
    </li>
  );
};

export default CategorySelectOverlay;
