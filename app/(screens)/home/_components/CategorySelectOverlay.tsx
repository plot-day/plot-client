'use client';

import Button from '@/components/button/Button';
import IconHolder from '@/components/icon/IconHolder';
import Loader from '@/components/loader/Loader';
import Overlay from '@/components/overlay/Overlay';
import { categoriesAtom, CategoryType } from '@/store/category';
import { groupsAtom } from '@/store/group';
import { useAtomValue } from 'jotai';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { FaPencil, FaPlus } from 'react-icons/fa6';

const CategorySelectOverlay = () => {
  const { data: categories } = useAtomValue(categoriesAtom);

  return (
    <Overlay id="category-select" title="Select category" isRight={true}>
      <Suspense fallback={<Loader />}>
        <ul className="mb-8 space-y-2">
          {categories?.map((category) => (
            <CategorySelectItem {...category} />
          ))}
        </ul>
      </Suspense>
      <div className="flex gap-6 mb-4">
        <Link
          href="/home/list?category-input=show"
          className="w-full p-4 flex gap-1 justify-center items-center text-xs text-center font-extrabold"
        >
          <FaPlus />
          Add category
        </Link>
        <Link
          href="/home/list?category-list=show"
          className="w-full p-4 flex gap-1 justify-center items-center text-xs text-center font-extrabold"
        >
          <FaPencil />
          Edit categories
        </Link>
      </div>
    </Overlay>
  );
};

const CategorySelectItem = ({ id, title, icon, group }: Partial<CategoryType>) => {
  const router = useRouter();

  const params = useSearchParams();
  const hasPrev = params.get('has-prev') || '';

  const selectCategoryHandler = () => {
    setTimeout(() => {
      router.replace(`/home/list?log-input=show&categoryId=${id}`);
    }, 100);

    if (hasPrev) {
      router.back();
    }
  };

  return (
    <li key={title} className="w-full flex items-center justify-between cursor-pointer">
      <div className="w-full flex gap-2 items-center" onClick={selectCategoryHandler}>
        <IconHolder isCircle={true}>{icon}</IconHolder>
        <div className="text-left w-full">
          <p className="text-xs font-semibold">{group}</p>
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
