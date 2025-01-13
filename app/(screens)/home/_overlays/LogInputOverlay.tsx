'use client';

import EmojiInput from '@/components/emoji/EmojiInput';
import { ReactIcon } from '@/components/icon/ReactIcon';
import AutoSizeInput from '@/components/input/AutoSizeInput';
import OverlayForm from '@/components/overlay/OverlayForm';
import { selectedCategoryAtom } from '@/store/category';
import { emojiAtom, emojiIdMemoryAtom } from '@/store/emoji';
import { logsTodayAtom } from '@/store/log';
import { todayAtom } from '@/store/ui';
import { getDateTimeStr } from '@/util/date';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const EMOJI_ID = 'log-emoji';

const formSchema = z.object({
  title: z.string().min(1, 'Please enter the title.'),
  content: z.string().optional(),
  date: z.string().optional(),
});

type formSchemaType = z.infer<typeof formSchema>;

const LogInputOverlay = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [emoji, setEmoji] = useAtom(emojiAtom);
  const setEmojiIdMemeory = useSetAtom(emojiIdMemoryAtom);
  const [category, setCategory] = useAtom(selectedCategoryAtom);
  const today = useAtomValue(todayAtom);
  const { refetch: refetchLogs } = useAtomValue(logsTodayAtom);

  const [type, setType] = useState('');
  const [error, setError] = useState('');

  const params = useSearchParams();
  const logId = params.get('logId') || '';
  const showLogInput = params.get('log-input');

  const form = useForm<formSchemaType>({
    resolver: zodResolver(formSchema),
  });

  const submitHandler = async (values: formSchemaType) => {
    setError('');

    const url = process.env.NEXT_PUBLIC_BASE_URL + '/api/log';
    try {
      // const fieldInputs = document.getElementsByClassName('field-input') || [];
      // for (let i = 0; i < fieldInputs.length; i++) {
      //   if (category?.fields) {
      //     category.fields[i].value = (fieldInputs[i] as HTMLInputElement).value;
      //   }
      // }

      const body = JSON.stringify({
        ...values,
        icon: emoji.get(EMOJI_ID) || '',
        categoryId: category?.id,
        // fields: category?.fields,
        type,
      });

      alert(body);

      if (logId) {
        // const response = await fetch(`${url}/${logId}`, { method: 'PATCH', body });
        // if (!response.ok) {
        //   throw new Error(response.status + ' ' + response.statusText);
        // }
      } else {
        // const response = await fetch(url, { method: 'POST', body });
        // if (!response.ok) {
        //   throw new Error(response.status + ' ' + response.statusText);
        // }
      }
      refetchLogs();
      router.back();
      form.reset();
      setCategory(null);
    } catch (error) {
      console.error(error);
      if (typeof error === 'string') {
        setError(error);
      } else if ((error as Error)?.message) {
        setError((error as Error).message);
      }
      return;
    }
  };

  useEffect(() => {
    if (showLogInput) {
      setEmojiIdMemeory((prev) => [...prev, EMOJI_ID]);
      if (!logId) {
        setEmoji(EMOJI_ID, '');
        setCategory(null);
      }
    } else {
      setEmojiIdMemeory((prev) => prev.length && [...prev].slice(0, prev.length - 1) || []);
      form.reset();
    }
  }, [showLogInput]);

  useEffect(() => {
    const categoryEmoji = category?.icon;
    setEmoji(EMOJI_ID, categoryEmoji || '');
    setType(category?.defaultLogType || 'task');
  }, [category]);

  return (
    <OverlayForm<formSchemaType>
      id="log-input"
      form={form}
      onSubmit={submitHandler}
      isRight={true}
      disableReset={true}
      disalbeBackOnSubmit={true}
      className="flex flex-col gap-4 text-sm"
    >
      <div className="flex gap-2 items-center">
        <EmojiInput<formSchemaType>
          id={EMOJI_ID}
          className="w-12 h-12 text-2xl rounded-lg"
          params={params.toString()}
        />
        <div className="w-full font-bold">
          <Link href={`${pathname}?${params.toString() + '&'}category-select=show&has-prev=true`}>
            <p className="text-sm">
              {category?.title || (
                <span className="text-gray-300">Select category</span>
              )}
            </p>
          </Link>
          <input
            className="text-lg w-full font-light"
            placeholder="Enter the title"
            {...form.register('title')}
          />
        </div>
      </div>
      <textarea
        className="font-extralight"
        placeholder="Enter the content"
        {...form.register('content')}
      />
      <div className="flex flex-col gap-2">
        <div className="flex gap-3 items-center">
          <div
            className={`w-[1rem] h-[1rem] border-black ${
              type === 'note'
                ? 'border-t border-black mt-[1rem]'
                : type === 'event'
                ? 'border rounded-full'
                : 'border rounded-[0.25rem]'
            }`}
          />
          <div className="flex gap-1 items-center">
            <input
              type="datetime-local"
              className="text-sm"
              {...form.register('date')}
              defaultValue={getDateTimeStr(today)}
            />
          </div>
        </div>
        <ul className="flex gap-3">
          {category?.fields?.map((field, i) => (
            <li key={i} className="flex gap-1 items-center">
              <ReactIcon nameIcon={field.icon} />
              <AutoSizeInput
                className="field-input"
                minWidth={`No ${field.label}`.length + 'ch'}
                placeholder={`No ${field.label}`}
              />
            </li>
          ))}
        </ul>
      </div>
      {error && (
        <div className="w-full p-2 text-sm bg-red-50 text-red-400 font-bold text-center rounded-lg">
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

export default LogInputOverlay;
