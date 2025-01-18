'use client';

import Button from '@/components/button/Button';
import EmojiInput from '@/components/emoji/EmojiInput';
import DateFieldInput from '@/components/field/DateFieldInput';
import NumberFieldInput from '@/components/field/NumberFieldInput';
import TextFieldInput from '@/components/field/TextFieldInput';
import TimestampFieldInput from '@/components/field/TimestampFieldInput';
import AutoHeightTextarea from '@/components/input/AutoHeightTextarea';
import Loader from '@/components/loader/Loader';
import OverlayForm from '@/components/overlay/OverlayForm';
import {
  categoryAtom,
  defaultCategoryAtom,
  selectedCategoryAtom,
} from '@/store/category';
import { emojiAtom, emojiIdMemoryAtom } from '@/store/emoji';
import { logFormDataAtom, logMutation } from '@/store/log';
import { todayAtom } from '@/store/ui';
import { toCamelCase } from '@/util/convert';
import { getDateTimeStr } from '@/util/date';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { IconPickerItem } from 'react-icons-picker-more';
import * as z from 'zod';

const EMOJI_ID = 'log-emoji';

const formSchema = z.object({
  id: z.string().optional(),
  icon: z.string().optional(),
  title: z.string().min(1, 'Please enter the title.'),
  type: z.string().optional(),
  date: z.string().optional(),
  categoryId: z.string().optional(),
  fieldValues: z.any().optional(),
  content: z.string().optional(),
  isDone: z.boolean().optional(),
});

export type logFormSchemaType = z.infer<typeof formSchema>;

const LogInputOverlay = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [emoji, setEmoji] = useAtom(emojiAtom);
  const setEmojiIdMemeory = useSetAtom(emojiIdMemoryAtom);

  const { data: categories } = useAtomValue(categoryAtom);
  const [category, setCategory] = useAtom(selectedCategoryAtom);
  const defaultCategory = useAtomValue(defaultCategoryAtom);

  const [defaultValue, setDefaultValue] = useAtom(logFormDataAtom);

  const { mutate, isPending } = useAtomValue(logMutation);
  const today = useAtomValue(todayAtom);

  const [type, setType] = useState('');
  const [error, setError] = useState('');
  const [field, setField] = useState<any>({});

  const params = useSearchParams();
  const showLogInput = params.get('log-input');

  const form = useForm<logFormSchemaType>({
    resolver: zodResolver(formSchema),
  });

  const fieldInputHandler = (key: string) => {
    const setFieldFunc = (v: string | number) => {
      setField((prev: any) => ({ ...prev, [key]: v }));
    };
    return setFieldFunc;
  };

  const submitHandler = async (values: logFormSchemaType) => {
    setError('');

    try {
      await mutate({
        ...values,
        id: defaultValue?.id || undefined,
        icon: emoji.get(EMOJI_ID) || '',
        categoryId: category?.id || defaultCategory?.id,
        fieldValues: field,
        type,
        isDone: false,
      });

      if (defaultValue) {
        router.back();
      }
    } catch (error) {
      if (typeof error === 'string') {
        setError(error);
      } else if ((error as Error)?.message) {
        setError((error as Error).message);
      }
      console.error(error);
      throw error;
    }
  };

  useEffect(() => {
    if (showLogInput) {
      form.reset();
      setEmojiIdMemeory((prev) => [...prev, EMOJI_ID]);
      if (!defaultValue) {
        setEmoji(EMOJI_ID, defaultCategory?.icon || '');
        setField([]);
        setCategory(null);
      } else {
        const defaultCategory = categories?.find(
          (item) => item.id === defaultValue?.categoryId
        );

        setCategory(defaultCategory || null);
        setEmoji(EMOJI_ID, defaultValue?.icon || '');
        setField(defaultValue?.fieldValues);
        setType(defaultValue?.type || '');

        for (const keyStr in defaultValue) {
          const key = keyStr as keyof logFormSchemaType;
          form.setValue(key, defaultValue[key]);
        }
      }
    } else {
      setEmojiIdMemeory(
        (prev) => (prev.length && [...prev].slice(0, prev.length - 1)) || []
      );
      form.reset();
      setDefaultValue(null);
    }
  }, [showLogInput]);

  useEffect(() => {
    setEmoji(EMOJI_ID, category?.icon || defaultCategory?.icon || '');
    setType(category?.defaultLogType || defaultCategory?.defaultLogType || 'task');
  }, [category, defaultCategory]);

  return (
    <OverlayForm<logFormSchemaType>
      id="log-input"
      form={form}
      onSubmit={submitHandler}
      isRight={true}
      disableReset={true}
      disalbeBackOnSubmit={true}
      hideButtons={true}
      className="flex flex-col gap-4 text-sm"
      isPending={isPending}
    >
      <div className="flex gap-2 items-center">
        <EmojiInput<logFormSchemaType>
          id={EMOJI_ID}
          className="w-12 h-12 text-2xl rounded-lg"
          params={params.toString()}
          disabled={isPending}
        />
        <div className="w-full font-bold">
          <Link
            href={`${pathname}?${params.toString() + '&'}category-select=show`}
            className={isPending ? 'pointer-events-none' : ''}
          >
            <p className="text-sm">
              {category?.title || defaultCategory?.title || (
                <span className="text-gray-300">Select category</span>
              )}
            </p>
          </Link>
          <input
            className="text-lg w-full font-light"
            placeholder="Enter the title"
            {...form.register('title')}
            disabled={isPending}
          />
        </div>
        <Button
          type="submit"
          className={`px-2 py-1 w-[3.75rem] flex justify-center items-center text-xs ${isPending ? 'opacity-25' : ''}`}
          disabled={isPending}
        >
          {isPending ? (
            <Loader isDark={true} className="w-4 h-4" />
          ) : defaultValue ? (
            'Update'
          ) : (
            'Add'
          )}
        </Button>
      </div>
      <AutoHeightTextarea
        className="font-extralight"
        placeholder="Enter the content"
        {...form.register('content')}
        disabled={isPending}
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
              disabled={isPending}
            />
          </div>
        </div>
        {!!category?.fields.length && (
          <ul
            className={`flex gap-3 flex-wrap ${isPending ? 'pointer-events-none' : ''}`}
          >
            {category?.fields?.map(({ icon, type, label, option }, i) => {
              const key = toCamelCase(label);
              return (
              <li key={i} className="flex gap-1 items-center">
                <IconPickerItem value={icon} />
                {(type === 'text' || type === 'url') && (
                  <TextFieldInput
                    label={label}
                    value={field[key] as string}
                    setValue={fieldInputHandler(key)}
                  />
                )}
                {type === 'number' && (
                  <NumberFieldInput
                    value={field[key] as string}
                    setValue={fieldInputHandler(key)}
                    label={label}
                    {...option}
                  />
                )}
                {type === 'date' && (
                  <DateFieldInput
                    value={field[key] as string}
                    setValue={fieldInputHandler(key)}
                    {...option}
                  />
                )}
                {type === 'timestamp' && (
                  <TimestampFieldInput
                    value={field[key] as number || 0}
                    setValue={fieldInputHandler(key)}
                    {...option}
                  />
                )}
              </li>
            )})}
          </ul>
        )}
      </div>
      {error && (
        <div className="w-full p-2 text-sm bg-red-50 text-red-400 font-bold text-center rounded-lg">
          {error.split('\n').map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      )}
      {!!Object.keys(form.formState.errors).length && (
        <div className="space-y-2 my-2">
          {Object.keys(form.formState.errors).map((key) => (
            <div
              key={key}
              className="w-full p-2 text-sm bg-red-50 text-red-400 font-bold text-center rounded-lg"
            >
              {(form.formState.errors[key as keyof logFormSchemaType]?.message as string)
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
      )}
    </OverlayForm>
  );
};

export default LogInputOverlay;
