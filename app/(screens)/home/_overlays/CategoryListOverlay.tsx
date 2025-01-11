'use client';

import IconHolder from '@/components/icon/IconHolder';
import Overlay from '@/components/overlay/Overlay';
import SaveCancelButton from '@/components/overlay/SaveCancelButton';
import { categoriesAtom } from '@/store/category';
import { useAtomValue } from 'jotai';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { FaPencil, FaPlus, FaTrashCan } from 'react-icons/fa6';
import DraggableList from '@/components/draggable/DraggableList';
import { DraggableItem, DragHandle } from '@/components/draggable/DraggableItem';
import { usePathname, useSearchParams } from 'next/navigation';

const CategoryListOverlay = () => {
  const pathname = usePathname();
  const params = useSearchParams();

  const { data } = useAtomValue(categoriesAtom);
  const [categories, setCategories] = useState(data || []);

  useEffect(() => {
    setCategories(data || []);
  }, [data]);

  return (
    <Overlay title="Edit category list" id="category-list" isRight={true} hideX={true}>
      <DraggableList
        className="space-y-2"
        items={categories}
        onChange={setCategories}
        renderItem={({ id, title, icon, group }) => (
          <DraggableItem id={id} className="flex gap-2">
            <DragHandle />
            <div className="w-full flex gap-2 items-center">
              <IconHolder isCircle={true}>{icon}</IconHolder>
              <div className="text-left w-full">
                <p className="text-xs font-semibold">{group}</p>
                <p className="font-bold leading-tight">{title}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Link
                href={`${pathname}?${
                  params.toString() + '&'
                }category-input=show&categoryId=${id}`}
                className="p-2"
              >
                <FaPencil />
              </Link>
              <div
                className="p-2"
                onClick={() => {
                  // removeHandler(i);
                }}
              >
                <FaTrashCan />
              </div>
            </div>
          </DraggableItem>
        )}
      />
      <Link
        href={`${pathname}?${params.toString() + '&'}category-input=show`}
        className="w-full p-4 flex gap-1 justify-center items-center text-xs text-center font-extrabold"
      >
        <FaPlus />
        Add category
      </Link>
      <SaveCancelButton saveStr="Save the order" />
    </Overlay>
  );
};

export default CategoryListOverlay;
