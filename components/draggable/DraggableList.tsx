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
import React, { useMemo, useState } from 'react';

import { ClassNameProps } from '@/types/className';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';

interface BaseItem {
  id: UniqueIdentifier;
}

interface Props<T extends BaseItem> extends ClassNameProps {
  items: T[];
  onChange(items: T[]): void;
  renderItem(item: T, i: number): ReactNode;
}

const DraggableList = <T extends BaseItem>({
  className,
  items,
  onChange,
  renderItem,
}: Props<T>) => {
  const [active, setActive] = useState<Active | null>(null);

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
      onDragEnd={({ active, over }) => {
        if (over && active.id !== over?.id) {
          const activeIndex = items.findIndex(({ id }) => id === active.id);
          const overIndex = items.findIndex(({ id }) => id === over.id);

          onChange(arrayMove(items, activeIndex, overIndex));
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

export default DraggableList;
