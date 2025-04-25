'use client';

import { DraggableItem, DragHandle } from '@/components/draggable/DraggableItem';
import DraggableList from '@/components/draggable/DraggableList';
import Overlay from '@/components/overlay/Overlay';
import SaveCancelButton from '@/components/overlay/SaveCancelButton';
import { groupMutation, groupAtom } from '@/store/group';
import { removeAtom, updateAtom } from '@/util/query';
import { useAtomValue } from 'jotai';
import { LexoRank } from 'lexorank';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FaPlus, FaTrashCan } from 'react-icons/fa6';
import { v4 as uuidv4 } from 'uuid';

const GroupListOverlay = () => {
  const router = useRouter();
  const params = useSearchParams();

  const { data } = useAtomValue(groupAtom);
  const { mutate, isPending } = useAtomValue(groupMutation);

  const [groups, setGroups] = useState(data || []);
  const [removeIds, setRemoveIds] = useState<string[]>([]);

  const showOverlay = params.get('group-list');

  const submitHandler = async () => {
    // put
    await mutate(
      groups
        .filter((group) => group.title)
        .map((group) => ({
          ...group,
          id: group.isUuid ? undefined : group.id,
          isUuid: undefined,
          rank: group.rank.toString(),
        }))
    );

    // delete
    for (let i = 0; i < removeIds.length; i++) {
      const res = await fetch(
        `/api/group/${removeIds[i]}`,
        {
          method: 'DELETE',
        }
      );
      const data = await res.json();
      removeAtom(data.id, 'group');
    }

    // reset
    setRemoveIds([]);
    router.back();
  };

  const changeHandler = (title: string, id: string) => {
    setGroups((prev) => {
      const idx = prev.findIndex((item) => item.id === id);
      return [
        ...prev.slice(0, idx),
        { ...prev[idx], title },
        ...prev.slice(idx + 1, prev.length),
      ];
    });
  };

  const removeHandler = (id: string) => {
    const idx = groups.findIndex((item) => item.id === id);
    if (!groups[idx].isUuid && id) {
      setRemoveIds((prev) => [...prev, id]);
    }
    setGroups((prev) => [...prev.slice(0, idx), ...prev.slice(idx + 1, prev.length)]);
  };

  const addHandler = () => {
    const sortedGroup = groups.sort((a, b) => a.rank?.compareTo(b.rank));
    const lastGroup = sortedGroup[sortedGroup.length - 1];

    setGroups((prev) => [
      ...prev,
      {
        id: uuidv4(),
        title: '',
        isDefault: false,
        isUuid: true,
        rank: lastGroup?.rank.genNext() || LexoRank.middle(),
      },
    ]);
  };

  useEffect(() => {
    if (showOverlay) {
      setGroups(data || []);
      setRemoveIds([]);
    }
  }, [data, showOverlay]);

  return (
    <Overlay title="Edit Groups" id="group-list" isRight={true} hideX={true}>
      <DraggableList
        className="space-y-2"
        items={groups.sort((a, b) => a.rank?.compareTo(b.rank))}
        onChange={setGroups}
        rankKey="rank"
        renderItem={({ id, title }) => (
          <DraggableItem id={id} className="flex items-center">
            <input
              onChange={(event) => {
                changeHandler(event.target.value, id);
              }}
              value={title}
              className="w-full font-medium bg-gray-100 px-3 py-2.5 rounded-lg"
            />
            <button
              type="button"
              className="p-4 text-xs"
              onClick={() => {
                removeHandler(id);
              }}
            >
              <FaTrashCan />
            </button>
            <DragHandle />
          </DraggableItem>
        )}
      />
      <button
        type="button"
        onClick={addHandler}
        className="w-full pt-4 pb-0 flex gap-1 justify-center items-center text-xs text-center font-extrabold"
      >
        <FaPlus />
        Add group
      </button>
      <SaveCancelButton onSave={submitHandler} isPending={isPending} />
    </Overlay>
  );
};

export default GroupListOverlay;
