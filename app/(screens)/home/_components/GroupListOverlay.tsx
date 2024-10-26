'use client';

import { DraggableItem, DragHandle } from '@/components/draggable/DraggableItem';
import DraggableList from '@/components/draggable/DraggableList';
import Overlay from '@/components/overlay/Overlay';
import SaveCancelButton from '@/components/overlay/SaveCancelButton';
import { groupsAtom } from '@/store/group';
import { useAtomValue } from 'jotai';
import React, { useEffect, useState } from 'react';
import { FaTrashCan } from 'react-icons/fa6';

const GroupListOverlay = () => {
  const { data } = useAtomValue(groupsAtom);
  const [groups, setGroups] = useState(data || []);

  useEffect(() => {
    setGroups(data || []);
  }, [data]);

  return (
    <Overlay title="Edit Groups" id="group-list" isRight={true} hideX={true}>
      <DraggableList
        className="space-y-2"
        items={groups}
        onChange={setGroups}
        renderItem={({ id, title }) => (
          <DraggableItem id={id} className="flex items-center">
            <input
              onChange={(event) => {
                // changeHandler(event.target.value, i);
              }}
              value={title}
              className="w-full font-medium bg-gray-100 px-3 py-2.5 rounded-lg"
            />
            <button
              className="p-4 text-xs"
              onClick={() => {
                // removeHandler(i);
              }}
            >
              <FaTrashCan />
            </button>
            <DragHandle />
          </DraggableItem>
        )}
      />
      <SaveCancelButton />
    </Overlay>
  );
};

export default GroupListOverlay;
