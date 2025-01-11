'use client';

import EmojiInput from '@/components/emoji/EmojiInput';
import Loader from '@/components/loader/Loader';
import OverlayForm from '@/components/overlay/OverlayForm';
import Tab from '@/components/tab/Tab';
import { categoriesAtom } from '@/store/category';
import { emojiAtom, emojiIdMemoryAtom } from '@/store/emoji';
import { groupsAtom } from '@/store/group';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaPencil } from 'react-icons/fa6';
import * as z from 'zod';

const EMOJI_ID = 'category-emoji';

const formSchema = z.object({
  icon: z.string().min(1, 'Please select icon.'),
  title: z.string().min(1, 'Please enter the title.'),
  groupId: z.string(),
  type: z.string(),
});

type formSchemaType = z.infer<typeof formSchema>;

const CategoryInputOverlay = () => {
  const pathname = usePathname();
  
  const { data: groups, isPending, isError } = useAtomValue(groupsAtom);
  const { data: categories, refetch: refetchCategories } = useAtomValue(categoriesAtom);
  const [emoji, setEmoji] = useAtom(emojiAtom);
  const setEmojiIdMemeory = useSetAtom(emojiIdMemoryAtom);

  const [type, setType] = useState('task');
  const [group, setGroup] = useState('');

  const params = useSearchParams();
  const categoryId = params.get('categoryId') || '';
  const showOverlay = params.get('category-input') || '';

  const form = useForm<formSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      icon: '',
      title: '',
      groupId: group,
      type,
    },
  });

  const submitHandler = async (values: formSchemaType) => {
    const url = process.env.NEXT_PUBLIC_BASE_URL + '/api/profile';

    const body = JSON.stringify({ ...values });

    alert(body);

    if (categoryId) {
      //   await fetch(`${url}/${categoryId}`, { method: 'PATCH', body });
    } else {
      //   await fetch(url, { method: 'POST', body });
    }

    setGroup('');
    refetchCategories();
  };

  useEffect(() => {
    if (showOverlay) {
      setEmojiIdMemeory((prev) => [...prev, EMOJI_ID]);
      if (categoryId) {
        const category = categories?.find((category) => category.id === categoryId);
        setEmoji(EMOJI_ID, category?.icon || '');
        setGroup(category?.groupId || '');
        form.setValue('title', category?.title || '');
      } else {
        setEmoji(EMOJI_ID, '');
        form.reset();
      }
    } else {
      setEmojiIdMemeory((prev) => prev.length && [...prev].slice(0, prev.length - 1) || []);
    }
  }, [showOverlay, categoryId]);

  useEffect(() => {
    if (emoji.get(EMOJI_ID)) {
      form.setValue('icon', emoji.get(EMOJI_ID) || '', { shouldValidate: true });
    }
  }, [emoji.get(EMOJI_ID)]);

  useEffect(() => {
    form.setValue('groupId', group);
  }, [group]);

  useEffect(() => {
    form.setValue('type', type);
  }, [type]);

  return (
    <OverlayForm
      id="category-input"
      className="[&>form]:flex [&>form]:flex-col [&>form]:px-8 [&>form]:items-center [&>form]:gap-4"
      title={categoryId ? 'Edit category' : 'Add category'}
      form={form}
      onSubmit={submitHandler}
      isRight={true}
    >
      <div className="my-4 flex flex-col gap-4 items-center">
        {/* Emoji */}
        <EmojiInput
          id={EMOJI_ID}
          params={`${params.toString()}&category-input=show${group ? '&groupId=' + group : ''}`}
          isCircle={true}
          register={form.register('icon')}
        >
        </EmojiInput>
        {/* Title */}
        <input
          placeholder="Enter the title"
          {...form.register('title')}
          className="text-center font-medium bg-gray-100 px-3 py-2.5 rounded-lg"
        />
        {/* Type */}
        <Tab
          id="category-input-type"
          value={type}
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
      <div className="w-full flex flex-col items-center">
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
            ...(groups?.map((group) => ({
              label: group.title,
              value: group.id.toString(),
            })) || []),
            {
              label: 'etc.',
              value: '',
            },
          ]}
        />
      </div>
      {/* Fields */}
      {/* <div className="w-full flex flex-col items-center">
        <div className="w-full pb-1 mb-2 flex justify-between items-center border-b-2 border-black">
          <h6 className="font-extrabold">Fields</h6>
          <Link href={`${pathname}?${params.toString() + '&'}group-list=show`}>
            <FaPencil className="text-xs" />
          </Link>
        </div>
      </div> */}
      {/* Errors */}
      <div className="space-y-2 my-2">
        {Object.keys(form.formState.errors).map((key) => (
          <div
            key={key}
            className="w-full p-2 text-sm bg-red-50 text-red-400 font-bold text-center rounded-lg"
          >
            {form.formState.errors[key as keyof formSchemaType]?.message
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

export default CategoryInputOverlay;
