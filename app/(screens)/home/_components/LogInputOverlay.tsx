'use client';

import EmojiInput from '@/components/emoji/EmojiInput';
import { ReactIcon } from '@/components/icon/ReactIcon';
import AutoSizeInput from '@/components/input/AutoSizeInput';
import OverlayForm from '@/components/overlay/OverlayForm';
import { categoriesAtom } from '@/store/category';
import { emojiAtom, isAutoEmojiAtom } from '@/store/emoji';
import { logsTodayAtom } from '@/store/log';
import { todayAtom } from '@/store/ui';
import { getDateTimeStr } from '@/util/date';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAtom, useAtomValue } from 'jotai';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const formSchema = z.object({
  title: z.string(),
  content: z.string().optional(),
  date: z.string().optional(),
});

type formSchemaType = z.infer<typeof formSchema>;

const LogInputOverlay = () => {
  const router = useRouter();

  const [emoji, setEmoji] = useAtom(emojiAtom);
  const [isAutoEmoji, setIsAutoEmoji] = useAtom(isAutoEmojiAtom);
  const today = useAtomValue(todayAtom);
  const { refetch: refetchLogs } = useAtomValue(logsTodayAtom);
  const { data: categories } = useAtomValue(categoriesAtom);

  const [type, setType] = useState('');
  const [error, setError] = useState('');

  const params = useSearchParams();
  const logId = params.get('logId') || '';
  const categoryId = params.get('categoryId') || '';
  const showEmojiInput = params.get('');

  const fields = categories?.find((category) => category.id === categoryId)?.fields;

  const form = useForm<formSchemaType>({
    resolver: zodResolver(formSchema),
  });

  const submitHandler = async (values: formSchemaType) => {
    setError('');

    const url = process.env.NEXT_PUBLIC_BASE_URL + '/api/log';
    try {
      const fieldInputs = document.getElementsByClassName('field-input') || [];
      for (let i = 0; i < fieldInputs.length; i++) {
        if (fields) {
          fields[i].value = (fieldInputs[i] as HTMLInputElement).value;
        }
      }

      const body = JSON.stringify({
        ...values,
        icon: emoji,
        categoryId,
        fields,
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
    if (showEmojiInput) {
      setIsAutoEmoji(!logId);
    } else {
      form.reset();
    }
  }, [showEmojiInput]);

  useEffect(() => {
    if (isAutoEmoji) {
      const categoryEmoji = categories?.find(
        (category) => category.id === categoryId
      )?.icon;
      setEmoji(categoryEmoji || '');
    }
  }, [categoryId, categories]);

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
        <EmojiInput
          className="w-12 h-12 text-2xl rounded-lg"
          params={`&log-input=show${logId ? `&categoryId=${categoryId}` : ''}${
            logId ? `&logId=${logId}` : ''
          }`}
        />
        <div className="w-full font-bold">
          <Link href="?category-select=show">
            <p className="text-sm">
              {categories?.find((category) => category.id === categoryId)?.title || (
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
              type === 'task'
                ? 'border rounded-[0.25rem]'
                : type === 'event'
                ? 'border rounded-full'
                : 'border-t border-black mt-[1rem]'
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
          {fields?.map((field, i) => (
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
    </OverlayForm>
  );
};

export default LogInputOverlay;
