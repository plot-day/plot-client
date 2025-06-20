import type { Active, UniqueIdentifier } from '@dnd-kit/core';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import type { ReactNode } from 'react';
import React, { useEffect, useMemo, useState } from 'react';

import { ClassNameProps } from '@/types/className';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { LexoRank } from 'lexorank';
import { sortRank } from '@/util/convert';

interface BaseItem {
  id: string;
}

interface Props<T extends BaseItem> extends ClassNameProps {
  items: T[];
  onChange?: (items: T[]) => void;
  updateChange?: (item: any) => void;
  rankKey?: string;
  renderItem: (item: T, i: number) => ReactNode;
}

const DraggableList = <T extends BaseItem>({
  className,
  items: originalItems,
  rankKey,
  onChange,
  updateChange,
  renderItem,
}: Props<T>) => {
  const [active, setActive] = useState<Active | null>(null);
  const [items, setItems] = useState(originalItems);

  useEffect(() => {
    setItems(
      originalItems.map((item) => {
        if (rankKey && typeof (item as any)[rankKey] === 'string') {
          return { ...item, [rankKey]: LexoRank.parse((item as any)[rankKey]) };
        } else {
          return item;
        }
      })
    );
  }, [originalItems]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <DndContext
      sensors={sensors}
      onDragStart={({ active }) => {
        setActive(active);
      }}
      onDragEnd={async ({ active, over }) => {
        if (over && active.id !== over?.id) {
          const activeIndex = items.findIndex(({ id }) => id === active.id);
          const overIndex = items.findIndex(({ id }) => id === over.id);

          try {
            const newRank = getRank(
              overIndex,
              items,
              rankKey,
              activeIndex < overIndex
            );
            const newItem = rankKey && {
              ...items[activeIndex],
              [rankKey]: newRank,
            };
            updateChange &&
              newItem &&
              updateChange({ id: newItem.id, [rankKey]: newRank?.toString() });

            const newArray = arrayMove(items, activeIndex, overIndex);
            onChange &&
              onChange(
                newItem
                  ? [
                      ...newArray.slice(0, overIndex),
                      newItem,
                      ...newArray.slice(overIndex + 1, newArray.length),
                    ]
                  : newArray
              );
          } catch (error) {
            if ((error as Error).message.includes('same rank')) {
              // Reassign rank
              if (rankKey) {
                let rank = LexoRank.middle();
                const sortedItems = sortRank(items, rankKey);
                for (let i = 0; i < sortedItems.length; i++) {
                  if (updateChange) {
                    await updateChange({
                      id: sortedItems[i].id,
                      [rankKey]: rank.toString(),
                    });
                    rank = rank.genNext();
                  } else {
                    throw error;
                  }
                }
              } else {
                throw error;
              }
            } else {
              throw error;
            }
          }
        }
        setActive(null);
      }}
      onDragCancel={() => {
        setActive(null);
      }}
      modifiers={[restrictToVerticalAxis]}
    >
      <SortableContext items={items}>
        <ul className={className}>
          {items.map((item, i) => (
            <React.Fragment key={item.id}>{renderItem(item, i)}</React.Fragment>
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
};

const getRank = (
  to: number,
  items: any[],
  key: string | number | symbol | undefined,
  isNext: boolean
) => {
  if (!key) {
    return;
  }

  if (to === 0) {
    if (items.length !== 1) {
      return (items[to][key] as LexoRank)?.genPrev() || LexoRank.middle();
    }
  } else if (to === items.length - 1) {
    return (items[to][key] as LexoRank)?.genNext() || LexoRank.middle();
  } else {
    return (
      (items[to][key] as LexoRank)?.between(
        items[to + (isNext ? 1 : -1)][key] as LexoRank
      ) || LexoRank.middle()
    );
  }
};

export default DraggableList;
