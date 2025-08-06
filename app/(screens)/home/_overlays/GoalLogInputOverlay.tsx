'use client';

import Button from '@/components/button/Button';
import CheckButton from '@/components/button/CheckButton';
import DateFieldInput from '@/components/field/DateFieldInput';
import NumberFieldInput from '@/components/field/NumberFieldInput';
import TagFieldInput from '@/components/field/TagFieldInput';
import TextFieldInput from '@/components/field/TextFieldInput';
import TimestampFieldInput from '@/components/field/TimestampFieldInput';
import AutoHeightTextarea from '@/components/input/AutoHeightTextarea';
import Loader from '@/components/loader/Loader';
import OverlayForm from '@/components/overlay/OverlayForm';
import {
  goalLogFormDataAtom,
  goalLogMutation,
  goalsAtom,
  GoalType,
} from '@/store/goal';
import { todayAtom } from '@/store/ui';
import { getDashDate } from '@/util/date';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAtom, useAtomValue } from 'jotai';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { IconPickerItem } from 'react-icons-picker-more';
import { FaCheckSquare } from 'react-icons/fa';

import { toCamelCase } from '@/util/convert';
import { FaCheck } from 'react-icons/fa6';
import * as z from 'zod';

const formSchema = z.object({
  id: z.string().optional(),
  date: z.string(),
  goalId: z.string().optional().nullable(),
  fieldValues: z.any().optional(),
  description: z.string().optional().nullable(),
  status: z.string().optional(),
});

export type goalLogFormSchemaType = z.infer<typeof formSchema>;

const GoalLogInputOverlay = () => {
  const router = useRouter();

  const [defaultValue, setDefaultValue] = useAtom(goalLogFormDataAtom);

  const { mutate, isPending } = useAtomValue(goalLogMutation);
  const { data: goals, isFetching: isFetchingGoals } = useAtomValue(goalsAtom);
  const today = useAtomValue(todayAtom);

  const [goal, setGoal] = useState<GoalType | null>(null);
  const [error, setError] = useState('');

  const params = useSearchParams();
  const showGoalLogInput = params.get('goal-log-input');
  const goalId = params.get('goalId');

  const form = useForm<goalLogFormSchemaType>({
    resolver: zodResolver(formSchema),
  });

  const fieldInputHandler = (key: string) => {
    const setFieldFunc = (v: string | number | boolean) => {
      form.setValue('fieldValues', { ...form.watch('fieldValues'), [key]: v });
    };
    return setFieldFunc;
  };

  const submitHandler = async (values: goalLogFormSchemaType) => {
    setError('');

    try {
      await mutate({
        ...values,
        id: defaultValue?.id || undefined,
        date: getDashDate(values.date),
        goalId,
      });

      router.back();

      form.setValue('description', '');
      form.setValue('fieldValues', null);
      form.setValue('status', 'done');
      form.setValue('date', getDashDate(today) || getDashDate(new Date()));
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
    if (showGoalLogInput) {
      setError('');
      form.reset();

      if (!defaultValue) {
        form.reset();

        form.setValue('fieldValues', null);
        form.setValue('status', 'done');

        form.setValue('date', getDashDate(today) || getDashDate(new Date()));
      } else {
        for (const keyStr in defaultValue) {
          const key = keyStr as keyof goalLogFormSchemaType;
          const value = (defaultValue as Partial<goalLogFormSchemaType>)[key];
          if (key.toLowerCase().includes('rank') && value) {
            form.setValue(key, value.toString());
          } else if (key === 'date' && value) {
            form.setValue(key, getDashDate(value));
          } else {
            form.setValue(key, value);
          }
          form.setValue('status', 'done');
        }
      }
    } else {
      setDefaultValue(null);
    }
  }, [showGoalLogInput]);

  const updateStatus = (status: string) => {
    form.setValue('status', status);
  };

  useEffect(() => {
    const goal = goals?.find((item) => item.id === goalId);
    setGoal(goal || null);
  }, [goalId]);

  return (
    <OverlayForm<goalLogFormSchemaType>
      id="goal-log-input"
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
        <span className="w-12 h-12 text-2xl rounded-lg p-6 bg-gray-100 rounded-xl flex justify-center items-center">
          {goal?.icon}
        </span>
        <div className="w-full font-bold">
          {/* <span className="text-sm">{goal?.group?.title}</span */}
          <input
            type="date"
            className="text-xs p-0 m-0 bg-transparent"
            {...form.register('date')}
            disabled={true}
            value={getDashDate(form.watch('date') || '')}
          />
          <input
            className="text-lg w-full font-light bg-transparent"
            placeholder="Enter the title"
            value={goal?.title}
            disabled={true}
          />
        </div>
        <Button
          type="submit"
          className={`px-2 py-1 w-[3.75rem] flex justify-center items-center text-xs ${
            isPending ? 'opacity-25' : ''
          }`}
          disabled={isPending}
        >
          {isPending ? (
            <Loader isDark={true} className="w-4 h-4" />
          ) : defaultValue && defaultValue.status === 'done' ? (
            'Update'
          ) : (
            'Check'
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
        {!!goal?.fields.length && (
          <ul
            className={`flex gap-4 flex-wrap ${
              isPending ? 'pointer-events-none' : ''
            }`}
          >
            {goal?.fields?.map(({ id, icon, type, label, option }, i) => {
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
                  {type === 'checkbox' && (
                    <div
                      className="flex items-center gap-1"
                      onClick={() => {
                        const prev = form.getValues('fieldValues')
                          ? form.getValues('fieldValues')[key]
                          : false;
                        fieldInputHandler(key)(!prev);
                      }}
                    >
                      <span className="font-extrabold">{label}</span>
                      <CheckButton
                        checked={
                          form.watch('fieldValues')
                            ? form.watch('fieldValues')[key]
                            : false
                        }
                        onChecked={() => {}}
                        {...option}
                      />
                    </div>
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
                  {type === 'tag' && (
                    <TagFieldInput
                      fieldId={id}
                      categoryId={goal.id}
                      value={
                        form.watch('fieldValues')
                          ? form.watch('fieldValues')[key]
                          : ''
                      }
                      setValue={fieldInputHandler(key)}
                      name={key}
                      option={option}
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
                form.formState.errors[key as keyof goalLogFormSchemaType]
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
      {
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
      }
    </OverlayForm>
  );
};

export default GoalLogInputOverlay;
