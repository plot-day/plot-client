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
import {
  plotFormDataAtom,
  plotMutation,
  plotsInboxAtom,
  plotsOverdueAtom,
  plotsTodayAtom,
  PlotType,
} from '@/store/plot';
import { categoryPageAtom, todayAtom } from '@/store/ui';
import { parseRank, sortRank, toCamelCase } from '@/util/convert';
import { getDashDate, getDateTimeStr } from '@/util/date';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { LexoRank } from 'lexorank';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { IconPickerItem } from 'react-icons-picker-more';
import { FaCheckSquare } from 'react-icons/fa';
import {
  FaArrowRight,
  FaCheck,
  FaCopy,
  FaTrash,
  FaXmark,
} from 'react-icons/fa6';
import * as z from 'zod';

const EMOJI_ID = 'plot-emoji';

const formSchema = z.object({
  id: z.string().optional(),
  icon: z.string().optional(),
  title: z.string().min(1, 'Please enter the title.'),
  type: z.string().optional(),
  date: z.string().optional().nullable(),
  categoryId: z.string().optional(),
  fieldValues: z.any().optional(),
  description: z.string().optional().nullable(),
  status: z.string().optional(),
  todayRank: z.string().optional(),
  inboxRank: z.string().optional(),
  categoryRank: z.string().optional(),
});

export type plotFormSchemaType = z.infer<typeof formSchema>;

const PlotInputOverlay = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [emoji, setEmoji] = useAtom(emojiAtom);
  const setEmojiIdMemeory = useSetAtom(emojiIdMemoryAtom);

  const { data: categories, isFetching: isCategoryFetching } =
    useAtomValue(categoryAtom);
  const [category, setCategory] = useAtom(selectedCategoryAtom);
  const defaultCategory = useAtomValue(defaultCategoryAtom);
  const { refetch: refetchOverduePlots } = useAtomValue(plotsOverdueAtom);

  const [defaultValue, setDefaultValue] = useAtom(plotFormDataAtom);

  const { data: todayPlots, isFetching: isFetchingTodayPlots } =
    useAtomValue(plotsTodayAtom);
  const { data: inboxPlots, isFetching: isFetchingInboxPlots } =
    useAtomValue(plotsInboxAtom);
  const { mutate, isPending } = useAtomValue(plotMutation);
  const today = useAtomValue(todayAtom);
  const categoryPage = useAtomValue(categoryPageAtom);

  const [showType, setShowType] = useState(false);
  const [error, setError] = useState('');

  const params = useSearchParams();
  const showPlotInput = params.get('plot-input');

  const form = useForm<plotFormSchemaType>({
    resolver: zodResolver(formSchema),
  });

  const fieldInputHandler = (key: string) => {
    const setFieldFunc = (v: string | number) => {
      form.setValue('fieldValues', { ...form.watch('fieldValues'), [key]: v });
    };
    return setFieldFunc;
  };

  const submitHandler = async (values: plotFormSchemaType) => {
    setError('');
    if (isCategoryFetching) {
      return;
    }

    try {
      const ranks = defaultValue?.id
        ? {}
        : await getRanks(
            pathname,
            values.date,
            inboxPlots || [],
            category?.id || defaultCategory?.id || '',
            undefined
          );
      await mutate({
        ...values,
        id: defaultValue?.id || undefined,
        icon: emoji.get(EMOJI_ID) || '',
        date: values.date && getDashDate(values.date),
        categoryId: category?.id || defaultCategory?.id,
        ...ranks,
      });

      if (defaultValue) {
        router.back();
      }

      form.setValue('title', '');
      form.setValue('description', '');
      form.setValue('fieldValues', null);
      form.setValue('status', 'todo');
      form.setValue(
        'date',
        pathname.includes('inbox') || pathname.includes('category')
          ? null
          : getDateTimeStr(today)
      );
      setEmoji(EMOJI_ID, category?.icon || defaultCategory?.icon || '');
      form.setValue('type', category?.defaultPlotType || 'task');
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
    if (showPlotInput) {
      setError('');
      form.reset();
      setEmojiIdMemeory((prev) => [...prev, EMOJI_ID]);
      if (!defaultValue) {
        form.reset();

        if (pathname.includes('category')) {
          setCategory(categoryPage);
        } else {
          setCategory(null);
        }

        setEmoji(EMOJI_ID, category?.icon || defaultCategory?.icon || '');

        form.setValue('fieldValues', null);
        form.setValue('type', 'task');
        form.setValue('status', 'todo');

        if (pathname.includes('inbox') || pathname.includes('category')) {
          form.setValue('date', null);
        } else {
          form.setValue('date', getDateTimeStr(today));
        }
      } else {
        const defaultCategory = categories?.find(
          (item) => item.id === defaultValue?.categoryId
        );

        setCategory(defaultCategory || null);
        setEmoji(EMOJI_ID, defaultValue?.icon || '');

        for (const keyStr in defaultValue) {
          const key = keyStr as keyof plotFormSchemaType;
          if (key.toLowerCase().includes('rank') && defaultValue[key]) {
            form.setValue(key, defaultValue[key].toString());
          } else {
            form.setValue(key, defaultValue[key]);
          }
        }
      }
    } else {
      setEmojiIdMemeory(
        (prev) => (prev.length && [...prev].slice(0, prev.length - 1)) || []
      );
      setDefaultValue(null);
    }
  }, [showPlotInput]);

  const updateStatus = (status: string) => {
    form.setValue('status', status);
  };

  useEffect(() => {
    setEmoji(
      EMOJI_ID,
      defaultValue && defaultValue?.categoryId === category?.id
        ? defaultValue?.icon || ''
        : category?.icon || defaultCategory?.icon || ''
    );
    form.setValue(
      'type',
      category?.defaultPlotType || defaultCategory?.defaultPlotType || 'task'
    );
  }, [category, defaultCategory]);

  useEffect(() => {
    const updatedCategory = categories?.find(
      (item) => item.id === category?.id
    );
    setCategory(updatedCategory || defaultCategory || null);
    setEmoji(EMOJI_ID, updatedCategory?.icon || defaultCategory?.icon || '');
    form.setValue(
      'type',
      updatedCategory?.defaultPlotType ||
        defaultCategory?.defaultPlotType ||
        'task'
    );
  }, [categories]);

  const typeChangeHandler = (type: string) => {
    if (type === form.getValues('type')) {
      setShowType((prev) => !prev);
    } else {
      setShowType(false);
      form.setValue('type', type);
    }
  };

  return (
    <OverlayForm<plotFormSchemaType>
      id="plot-input"
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
        <EmojiInput<plotFormSchemaType>
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
          className={`px-2 py-1 w-[3.75rem] flex justify-center items-center text-xs ${
            isPending ? 'opacity-25' : ''
          }`}
          disabled={isPending || isCategoryFetching}
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
        placeholder="Enter the description"
        {...form.register('description')}
        disabled={isPending}
      />
      <div className="flex flex-col gap-2">
        <div className="flex gap-3 items-center">
          <div className="flex gap-2 items-center">
            <div
              className={`w-[1rem] h-[1rem] ${
                form.watch('type') === 'task'
                  ? 'border-black border rounded-[0.25rem]'
                  : showType
                  ? 'border-gray-300 border rounded-[0.25rem]'
                  : 'hidden'
              }`}
              onClick={typeChangeHandler.bind(null, 'task')}
            />
            <div
              className={`w-[1rem] h-[1rem] ${
                form.watch('type') === 'event'
                  ? 'border-black border rounded-full'
                  : showType
                  ? 'border-gray-300 border rounded-full'
                  : 'hidden'
              }`}
              onClick={typeChangeHandler.bind(null, 'event')}
            />
            <div
              className={`w-[1rem] h-[1rem] ${
                form.watch('type') === 'note'
                  ? 'border-t border-black mt-[1rem]'
                  : showType
                  ? 'border-t border-gray-300 mt-[1rem]'
                  : 'hidden'
              }`}
              onClick={typeChangeHandler.bind(null, 'note')}
            />
          </div>
          <div className="flex gap-1 items-center">
            <input
              type="date"
              className="text-sm"
              {...form.register('date')}
              disabled={isPending}
              value={getDashDate(form.watch('date') || '')}
            />
          </div>
        </div>
        {!!category?.fields.length && (
          <ul
            className={`flex gap-3 flex-wrap ${
              isPending ? 'pointer-events-none' : ''
            }`}
          >
            {category?.fields?.map(({ icon, type, label, option }, i) => {
              const key = toCamelCase(label);
              return (
                <li key={i} className="flex gap-1 items-center">
                  <IconPickerItem value={icon} />
                  {(type === 'text' || type === 'url') && (
                    <TextFieldInput
                      label={label}
                      value={
                        form.watch('fieldValues')
                          ? (form.watch('fieldValues')[key] as string)
                          : ''
                      }
                      setValue={fieldInputHandler(key)}
                    />
                  )}
                  {type === 'number' && (
                    <NumberFieldInput
                      value={
                        form.watch('fieldValues')
                          ? (form.watch('fieldValues')[key] as string)
                          : ''
                      }
                      setValue={fieldInputHandler(key)}
                      label={label}
                      {...option}
                    />
                  )}
                  {type === 'date' && (
                    <DateFieldInput
                      value={
                        form.watch('fieldValues')
                          ? (form.watch('fieldValues')[key] as string)
                          : ''
                      }
                      setValue={fieldInputHandler(key)}
                      {...option}
                    />
                  )}
                  {type === 'timestamp' && (
                    <TimestampFieldInput
                      value={
                        form.watch('fieldValues')
                          ? (form.watch('fieldValues')[key] as number)
                          : 0
                      }
                      setValue={fieldInputHandler(key)}
                      {...option}
                    />
                  )}
                </li>
              );
            })}
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
              {(
                form.formState.errors[key as keyof plotFormSchemaType]
                  ?.message as string
              )
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
      {/* type & status */}
      {(form.watch('type') === 'task' || form.watch('type') === 'event') && (
        <div className="flex justify-center gap-1 bg-gray-100 rounded-md items-center p-[0.2rem] font-extrabold text-xs">
          <button
            type="button"
            className={`w-full py-[0.375rem] flex justify-center items-center gap-2 rounded-md ${
              form.watch('status') === 'todo'
                ? 'text-primary bg-white'
                : 'text-gray-400'
            }`}
            disabled={form.watch('status') === 'todo' || isPending}
            onClick={updateStatus.bind(null, 'todo')}
          >
            <FaCheckSquare />
            <span>Todo</span>
          </button>
          <button
            type="button"
            className={`w-full py-[0.375rem] flex justify-center items-center gap-2 rounded-md ${
              form.watch('status') === 'dismiss'
                ? 'text-primary bg-white'
                : 'text-gray-400'
            }`}
            disabled={form.watch('status') === 'dismiss' || isPending}
            onClick={updateStatus.bind(null, 'dismiss')}
          >
            <FaXmark />
            <span>Dismiss</span>
          </button>
          <button
            type="button"
            className={`w-full py-[0.375rem] flex justify-center items-center gap-2 rounded-md ${
              form.watch('status') === 'done'
                ? 'text-primary bg-white'
                : 'text-gray-400'
            }`}
            disabled={form.watch('status') === 'done' || isPending}
            onClick={updateStatus.bind(null, 'done')}
          >
            <FaCheck />
            <span>Done</span>
          </button>
        </div>
      )}
      {/* delete, move next, duplicate */}
      {defaultValue && !isPending && (
        <div className="flex justify-between items-center gap-1 [&>*]:w-full [&>*]:py-2 font-extrabold text-xs text-gray-400">
          <Link
            href={`${pathname}?${params.toString()}&delete-confirm=show`}
            className="flex justify-center items-center gap-2"
          >
            <FaTrash /> <span>Delete</span>
          </Link>
          {form.watch('type') === 'task' &&
            !isFetchingTodayPlots &&
            !isFetchingInboxPlots && (
              <>
                {defaultValue.status === 'todo' &&
                  defaultValue.type !== 'note' &&
                  (!defaultValue.date ? (
                    <button
                      type="button"
                      className="flex justify-center items-center gap-2"
                      onClick={async () => {
                        const ranks = await getRanks(
                          pathname,
                          defaultValue.date,
                          inboxPlots || [],
                          category?.id || defaultCategory?.id || ''
                        );
                        mutate({
                          id: defaultValue.id,
                          date: getDashDate(new Date()),
                          ...ranks,
                        });
                        router.back();
                      }}
                    >
                      <FaArrowRight /> <span>Move today</span>
                    </button>
                  ) : (
                    !(defaultValue.date && !pathname.includes('today')) && (
                      <button
                        type="button"
                        className="flex justify-center items-center gap-2"
                        onClick={async () => {
                          const ranks = await getRanks(
                            pathname,
                            getDateTimeStr(
                              dayjs(defaultValue.date).add(1, 'day')
                            ),
                            inboxPlots || [],
                            category?.id || defaultCategory?.id || '',
                            today
                          );
                          const date = pathname.includes('today')
                            ? dayjs(getDashDate(defaultValue.date)) <
                              dayjs(getDashDate(new Date()))
                              ? getDashDate(today)
                              : dayjs(defaultValue.date)
                                  .add(1, 'day')
                                  .format('YYYY-MM-DD')
                            : getDashDate(new Date());
                          mutate({
                            id: defaultValue.id,
                            date,
                            ...ranks,
                          });
                          refetchOverduePlots();
                          router.back();
                        }}
                      >
                        <FaArrowRight />{' '}
                        <span>
                          {pathname.includes('today')
                            ? dayjs(getDashDate(defaultValue.date)) <
                              dayjs(getDashDate(new Date()))
                              ? getDashDate(defaultValue.date) ===
                                getDashDate(today)
                                ? 'Move today'
                                : 'Move here'
                              : 'Move next'
                            : 'Move today'}
                        </span>
                      </button>
                    )
                  ))}
                <button
                  type="button"
                  className="flex justify-center items-center gap-2"
                  onClick={async () => {
                    const ranks = await getRanks(
                      pathname,
                      defaultValue.date,
                      inboxPlots || [],
                      category?.id || defaultCategory?.id || ''
                    );
                    mutate({ ...defaultValue, id: undefined, ...ranks });
                  }}
                >
                  <FaCopy /> <span>Duplicate</span>
                </button>
              </>
            )}
        </div>
      )}
    </OverlayForm>
  );
};

const getRanks = async (
  pathname: string,
  date: string | null | undefined,
  inboxPlots: PlotType[],
  categoryId: string,
  today?: Date
) => {
  let todayRank = null;
  if (date) {
    const todayRes = await fetch(`/api/plot?date=${getDashDate(date)}`);
    const todayPlots = await todayRes.json();
    const sortedTodayPlots = sortRank(
      todayPlots.map((item: any) => parseRank(item)) || [],
      'todayRank',
      true
    );
    todayRank = sortedTodayPlots.length
      ? sortedTodayPlots[0].todayRank?.genNext()
      : LexoRank.middle();
  }

  let inboxRank = null;
  if (pathname.includes('inbox') || date === null) {
    const sortedInboxPlots = sortRank(inboxPlots, 'inboxRank', true);
    inboxRank = sortedInboxPlots.length
      ? sortedInboxPlots[0]?.inboxRank?.genNext()
      : LexoRank.middle();
  }

  let categoryRank = null;
  if (categoryId) {
    const categoryRes = await fetch(`/api/plot?categoryId=${categoryId}`);
    const categoryPlots = await categoryRes.json();
    const sortedCategoryPlots = sortRank(
      categoryPlots.map((item: any) => parseRank(item)) || [],
      'categoryRank',
      true
    );
    categoryRank = sortedCategoryPlots.length
      ? sortedCategoryPlots[0]?.categoryRank?.genNext()
      : LexoRank.middle();
  }

  return {
    todayRank: todayRank && todayRank.toString(),
    inboxRank: inboxRank && inboxRank.toString(),
    categoryRank: categoryRank && categoryRank.toString(),
  };
};

export default PlotInputOverlay;
