'use client';

import {
  DraggableItem,
  DragHandle,
} from '@/components/draggable/DraggableItem';
import DraggableList from '@/components/draggable/DraggableList';
import SaveCancelButton from '@/components/overlay/SaveCancelButton';
import { categoryAtom, fieldMutation, TagsOptionType } from '@/store/category';
import { parseRank } from '@/util/convert';
import { useAtomValue } from 'jotai';
import { LexoRank } from 'lexorank';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaTrashCan } from 'react-icons/fa6';

interface TagsFieldInputProps {
  fieldId: string;
}

interface TagItem {
  id: string;
  title: string;
  rank: LexoRank | string;
}

const TagsFieldInput = ({ fieldId }: TagsFieldInputProps) => {
  const router = useRouter();
  const params = useSearchParams();
  const categoryId = params.get('categoryId') || '';

  const [tags, setTags] = useState<TagItem[]>([]);
  const [tag, setTag] = useState<string>('');

  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState('');

  const { data: categories } = useAtomValue(categoryAtom);
  const field = categories
    ?.find((item) => item.id === categoryId)
    ?.fields.find((item) => item.id === fieldId);

  const { mutate } = useAtomValue(fieldMutation);

  const addTagHandler = () => {
    if (tag.trim() === '') return;

    const lastTag = tags[tags.length - 1];

    const rank =
      tags.length === 0
        ? LexoRank.middle()
        : typeof lastTag.rank === 'string'
        ? LexoRank.parse(lastTag.rank).genNext()
        : lastTag.rank.genNext();

    setTags((prev) => [
      ...prev,
      {
        id: tag + rank.toString(),
        title: tag,
        rank,
      },
    ]);

    setTag('');
  };

  const removeHandler = (id: string) => {
    setTags((prev) => prev.filter((item) => item.id !== id));
  };

  const changeHandler = (title: string, id: string) => {
    setTags((prev) => {
      const idx = prev.findIndex((item) => item.id === id);
      return [
        ...prev.slice(0, idx),
        { ...prev[idx], title },
        ...prev.slice(idx + 1, prev.length),
      ];
    });
  };

  const setTagsHandler = (items: TagItem[]) => {
    setTags(items);
  };

  const submitHandler = async () => {
    setIsPending(true);

    try {
      const submitTags = tags?.map((item) => ({
        id: item.id,
        title: item.title,
        rank: item.rank.toString(),
      }));

      await mutate({
        categoryId,
        fieldId,
        field: {
          option: { tags: submitTags },
        },
      });
      router.back();
      setIsPending(false);
    } catch (error) {
      if (typeof error === 'string') {
        setError(error);
      } else if ((error as Error)?.message) {
        setError((error as Error).message);
      }
      console.error(error);
      setIsPending(false);
    }
  };

  useEffect(() => {
    console.log(field?.option);
    setTags((field?.option as TagsOptionType)?.tags || []);
  }, [fieldId]);

  return (
    <>
      <DraggableList
        className="space-y-2"
        items={tags}
        onChange={setTagsHandler}
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
      <div className="relative my-2">
        <input
          className={`w-full bg-gray-100 px-3 py-2 
            pr-[4rem] rounded-md`}
          placeholder="Add new tag"
          value={tag}
          onChange={(e) => {
            setTag(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              addTagHandler();
            }
          }}
        />
        <button
          className={`block bg-primary text-white rounded-md font-extrabold absolute top-[50%] transform translate-y-[-50%] right-[0.5rem] p-1 
              w-[3rem] text-center text-xs `}
          onClick={addTagHandler}
          disabled={tag.trim() === ''}
        >
          Add
        </button>
      </div>
      {error && (
        <div className="w-full p-2 text-sm bg-red-50 text-red-400 font-bold text-center rounded-lg">
          {error.split('\n').map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      )}
      <SaveCancelButton onSave={submitHandler} isPending={isPending} />
    </>
  );
};

export default TagsFieldInput;
