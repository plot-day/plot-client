'use client';

import { DraggableItem, DragHandle } from '@/components/draggable/DraggableItem';
import DraggableList from '@/components/draggable/DraggableList';
import EmojiInput from '@/components/emoji/EmojiInput';
import IconPicker from '@/components/icon/IconPicker';
import Loader from '@/components/loader/Loader';
import OverlayForm from '@/components/overlay/OverlayForm';
import Tab from '@/components/tab/Tab';
import { FIELD_TYPES } from '@/constants/field';
import { categoryAtom, categoryMutation, FieldType } from '@/store/category';
import { emojiAtom, emojiIdMemoryAtom } from '@/store/emoji';
import { groupAtom } from '@/store/group';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { LexoRank } from 'lexorank';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaPencil, FaPlus, FaTrashCan } from 'react-icons/fa6';
import { v4 as uuidv4 } from 'uuid';
import * as z from 'zod';

const EMOJI_ID = 'category-emoji';

const formSchema = z.object({
  id: z.string().optional(),
  icon: z.string().min(1, 'Please select icon.'),
  title: z.string().min(1, 'Please enter the title.'),
  groupId: z.string().optional(),
  defaultPlotType: z.string().optional(),
  fields: z.array(z.any()).optional(),
  isDefault: z.boolean().optional(),
  rank: z.string().optional(),
});

export type categoryFormSchemaType = z.infer<typeof formSchema>;

const CategoryInputOverlay = () => {
  const pathname = usePathname();

  const { data: groups, isPending, isError } = useAtomValue(groupAtom);
  const { data: categories } = useAtomValue(categoryAtom);
  const { mutate, isPending: isSubmitting } = useAtomValue(categoryMutation);
  const [emoji, setEmoji] = useAtom(emojiAtom);
  const setEmojiIdMemeory = useSetAtom(emojiIdMemoryAtom);

  const [defaultPlotType, setType] = useState('task');
  const [group, setGroup] = useState(groups?.find((item) => item.isDefault)?.id || '');
  const [fields, setFields] = useState<FieldType[]>([]);
  const [error, setError] = useState('');

  const params = useSearchParams();
  const categoryId = params.get('categoryId') || '';
  const title = params.get('title') || '';
  const rank = params.get('rank') || '';
  const showOverlay = params.get('category-input') || '';

  const form = useForm<categoryFormSchemaType>({
    resolver: zodResolver(formSchema),
  });

  const submitHandler = async (values: categoryFormSchemaType) => {
    setError('');

    try {
      fields.forEach(({ label }) => {
        if (!label) {
          throw new Error('Please enter the label of field');
        }
      });

      const sortedCategories = categories?.sort((a, b) => a.rank?.compareTo(b.rank));
      const lastCategory = sortedCategories && sortedCategories[sortedCategories.length - 1];

      await mutate({ 
        ...values,
        id: categoryId || undefined,
        groupId: group,
        fields,
        rank: categoryId ? undefined : lastCategory?.rank.genNext().toString() || LexoRank.middle().toString(),
        defaultPlotType,
        isDefault: categoryId ? undefined : false,
      });
    } catch (error: any) {
      setError(typeof error === 'string' ? error : error?.message || 'An Error occured.');
      throw error;
    }
  };

  const addFieldHandler = () => {
    const newField = {
      id: uuidv4(),
      icon: 'FaEllipsis',
      label: '',
      type: 'text',
      option: [],
    };
    setFields((prev) => [...prev, newField]);
  };

  useEffect(() => {
    if (showOverlay) {
      setError('');
      setEmojiIdMemeory((prev) => [...prev, EMOJI_ID]);
      if (categoryId) {
        const category = categories?.find((category) => category.id === categoryId);
        setEmoji(EMOJI_ID, category?.icon || '');
        form.setValue('icon', category?.icon || '');
        setGroup(category?.groupId || groups?.find((item) => item.isDefault)?.id || '');
        form.setValue('title', category?.title || '');
        form.setValue('fields', category?.fields);
        setFields(category?.fields || []);
        setType(category?.defaultPlotType || 'task');
      } else {
        setGroup(groups?.find((item) => item.isDefault)?.id || '');
        setEmoji(EMOJI_ID, '');
        form.reset();
        form.setValue('title', title);
      }
    } else {
      setEmojiIdMemeory(
        (prev) => (prev.length && [...prev].slice(0, prev.length - 1)) || []
      );
    }
  }, [showOverlay, categoryId]);

  useEffect(() => {
    if (!showOverlay) {
      setGroup(groups?.find((item) => item.isDefault)?.id || '');
      setFields([]);
    }
  }, [showOverlay]);

  useEffect(() => {
    if (emoji.get(EMOJI_ID)) {
      form.setValue('icon', emoji.get(EMOJI_ID) || '', { shouldValidate: true });
    }
  }, [emoji.get(EMOJI_ID)]);

  return (
    <OverlayForm
      id="category-input"
      className={`[&>form]:flex [&>form]:flex-col [&>form]:px-8 [&>form]:items-center [&>form]:gap-4 ${
        isSubmitting ? 'pointer-events-none' : ''
      }`}
      title={categoryId ? 'Edit category' : 'Add category'}
      form={form}
      onSubmit={submitHandler}
      isRight={true}
      isPending={isSubmitting}
    >
      <div className="my-6 flex flex-col gap-4 items-center">
        {/* Emoji */}
        <EmojiInput
          id={EMOJI_ID}
          params={`${params.toString()}&category-input=show${
            group ? '&groupId=' + group : ''
          }`}
          isCircle={true}
          register={form.register('icon')}
        ></EmojiInput>
        {/* Title */}
        <input
          placeholder="Enter the title"
          {...form.register('title')}
          className="text-center font-medium bg-gray-100 px-3 py-2.5 rounded-lg"
        />
        {/* Type */}
        <Tab
          id="category-input-type"
          value={defaultPlotType}
          setValue={setType}
          className="text-sm [&_label]:font-semibold w-full [&>li]:p-1"
          tabs={[
            {
              icon: (
                <div className="w-[1rem] h-[1rem] border-black border rounded-[0.25rem]" />
              ),
              label: 'task',
              value: 'task',
            },
            {
              icon: (
                <div className="w-[1rem] h-[1rem] border-black border rounded-full" />
              ),
              label: 'event',
              value: 'event',
            },
            {
              icon: <div className="w-[1rem] h-[1rem] border-black border-t mt-[1rem]" />,
              label: 'note',
              value: 'note',
            },
          ]}
        />
      </div>
      {/* Group */}
      <div className="w-full flex flex-col items-center mb-6">
        <div className="w-full pb-1 mb-2 flex justify-between items-center border-b-2 border-black">
          <h6 className="font-extrabold">Group</h6>
          <Link href={`${pathname}?${params.toString() + '&'}group-list=show`}>
            <FaPencil className="text-xs" />
          </Link>
        </div>
        <Tab
          id="category-input-group"
          value={group}
          setValue={setGroup}
          className="text-sm w-full [&_label]:font-semibold [&>li]:p-1"
          tabs={[
            isPending ? <Loader key="loader" className="w-4 h-4" /> : undefined,
            ...(groups?.sort((a, b) => a.rank?.compareTo(b.rank)).map((group) => ({
              label: group.title,
              value: group.id?.toString(),
            })) || []),
          ]}
        />
      </div>
      {/* Fields */}
      <div className="w-full flex flex-col items-center">
        <div className="w-full pb-1 mb-2 flex justify-between items-center border-b-2 border-black">
          <h6 className="font-extrabold">Fields</h6>
        </div>
        <DraggableList
          className="max-h-36 overflow-y-scroll"
          items={fields}
          onChange={setFields}
          renderItem={(field, i) => (
            <FieldItem
              key={field.id}
              {...field}
              idx={i}
              setFields={setFields}
              base={`${pathname}?${params.toString()}`}
            />
          )}
        ></DraggableList>
        <button
          type="button"
          onClick={addFieldHandler}
          className="w-full pt-4 pb-0 flex gap-1 justify-center items-center text-xs text-center font-extrabold"
        >
          <FaPlus />
          Add field
        </button>
      </div>
      {/* Errors */}
      {error && (
        <div className="w-full mt-6 p-2 text-sm bg-red-50 text-red-400 font-bold text-center rounded-lg">
          {error.split('\n').map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      )}
      <div className="space-y-2 my-2">
        {Object.keys(form.formState.errors).map((key) => (
          <div
            key={key}
            className="w-full p-2 text-sm bg-red-50 text-red-400 font-bold text-center rounded-lg"
          >
            {form.formState.errors[key as keyof categoryFormSchemaType]?.message
              ?.split('\n')
              .map((line, i) => (
                <p key={i}>
                  <strong>{key}: </strong>
                  {line}
                </p>
              ))}
          </div>
        ))}
      </div>
    </OverlayForm>
  );
};

const FieldItem = ({
  id,
  type,
  icon,
  label,
  option,
  idx,
  base,
  setFields,
}: FieldType & {
  base: string;
  idx: number;
  setFields: Dispatch<SetStateAction<FieldType[]>>;
}) => {
  const removeHandler = (i: number) => {
    setFields((prev) => [...prev.slice(0, i), ...prev.slice(i + 1, prev.length)]);
  };

  const labelChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    changeHandler('label', e.target.value);
  };

  const typeChangeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    changeHandler('type', e.target.value);
  };

  const iconChangeHandler = (v: string) => {
    changeHandler('icon', v);
  };

  const changeHandler = (key: string, value: string) => {
    setFields((prev) => {
      const newItem = { ...prev[idx], [key]: value };
      return [...prev.slice(0, idx), newItem, ...prev.slice(idx + 1, prev.length)];
    });
  };

  return (
    <DraggableItem
      id={id}
      className="w-full flex justify-between gap-2 items-center text-sm mb-2"
    >
      <DragHandle />
      <select onChange={typeChangeHandler} value={type}>
        {FIELD_TYPES.map(
          (item) =>
            item && (
              <option key={item.toLowerCase()} value={item.toLowerCase()}>
                {item}
              </option>
            )
        )}
      </select>
      <IconPicker value={icon} onChange={iconChangeHandler} />
      <input
        type="text"
        className="mr-1 w-full bg-gray-100 rounded-md py-[0.375rem] px-2 text-sm"
        placeholder="Enter the label"
        value={label}
        onChange={labelChangeHandler}
      />
      {/* <Link href={`${base + '&'}group-list=show`}>
        <FaPencil className="text-xs" />
      </Link> */}
      <button
        type="button"
        className="p-2 text-xs"
        onClick={() => {
          removeHandler(idx);
        }}
      >
        <FaTrashCan />
      </button>
    </DraggableItem>
  );
};

export default CategoryInputOverlay;
