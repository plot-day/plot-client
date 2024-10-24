'use client';

import Button from '@/components/button/Button';
import IconHolder from '@/components/icon/IconHolder';
import Overlay from '@/components/overlay/Overlay';
import { categoriesAtom, CategoryType } from '@/store/category';
import { groupsAtom } from '@/store/group';
import { useAtomValue } from 'jotai';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaPencil, FaPlus } from 'react-icons/fa6';

const CategorySelectOverlay = () => {
  const { data: groups } = useAtomValue(groupsAtom);
  const { data: categories } = useAtomValue(categoriesAtom);

  return (
    <Overlay id="category-select" title="Select category" isRight={true}>
      {groups?.map(({ id, title }) => {
        const filteredCategories = categories?.filter(
          (category) => category.groupId === id
        );
        return (
          <ul className="mb-8 space-y-2">
            {!!filteredCategories?.length && (
              <h6 key={id} className="text-sm font-extrabold">
                {title}
              </h6>
            )}
            {filteredCategories?.map((category) => (
              <CategorySelectItem {...category} />
            ))}
          </ul>
        );
      })}
      <div className="mb-4">
        <Link
          href="/home/list?category-input=show"
          className="w-full p-4 flex gap-1 justify-center items-center text-xs text-center font-extrabold"
        >
          <FaPlus />
          Add category
        </Link>
        {/* <Link
          href="/home/list?category-list=show"
          className="w-full p-4 flex gap-1 justify-center items-center text-xs text-center font-extrabold"
        >
          <FaPencil />
          Edit categories
        </Link> */}
      </div>
    </Overlay>
  );
};

const CategorySelectItem = ({ id, title, icon, group }: Partial<CategoryType>) => {
  const router = useRouter();

  const selectCategoryHandler = () => {
    router.replace(`/home/list?log-input=show&categoryId=${id}`);
  };

  return (
    <li key={title} className="w-full flex items-center justify-between cursor-pointer">
      <div className="w-full flex gap-2 items-center" onClick={selectCategoryHandler}>
        <IconHolder isCircle={true}>{icon}</IconHolder>
        <div className="text-left w-full">
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
