'use client';

import OverlayForm from '@/components/overlay/OverlayForm';
import { filterAtom } from '@/store/filter';
import { filteredTodosAtom, todosTodayAtom } from '@/store/todo';
import { todoFormDataAtom } from '@/store/todo';
import { categoryPageAtom, todayAtom } from '@/store/ui';
import { removeAtom } from '@/util/query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAtomValue } from 'jotai';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaCircleExclamation } from 'react-icons/fa6';
import * as z from 'zod';
const formSchema = z.object({});

type schemaType = z.infer<typeof formSchema>;

const TodoDeleteConformOverlay = () => {
  const router = useRouter();

  const defaultValues = useAtomValue(todoFormDataAtom);
  const today = useAtomValue(todayAtom);
  const { refetch: refetchFilteredTodo } = useAtomValue(filteredTodosAtom);
  const categoryPage = useAtomValue(categoryPageAtom);

  const [isPending, setIsPending] = useState(false);

  const form = useForm<schemaType>({
    resolver: zodResolver(formSchema),
  });

  const submitHandler = async () => {
    try {
      setIsPending(true);
      const response = await fetch(`/api/todo/${defaultValues?.id}`, {
        method: 'DELETE',
      });

      router.back();

      if (!response.ok) {
        throw new Error(response.status + ' ' + response.statusText);
      }

      defaultValues?.id && removeAtom(defaultValues?.id, ['todo', today]);
      defaultValues?.id && removeAtom(defaultValues?.id, ['todo', null]);
      defaultValues?.id && removeAtom(defaultValues?.id, ['todo-overdue']);
      defaultValues?.id &&
        removeAtom(defaultValues?.id, ['todo', categoryPage?.id]);
      refetchFilteredTodo();
      setIsPending(false);
    } catch (error) {
      setIsPending(false);
      console.error(error);
    }
  };

  return (
    <OverlayForm<schemaType>
      id="delete-confirm"
      form={form}
      onSubmit={submitHandler}
      isPending={isPending}
      onClose={() => {
        setIsPending(false);
      }}
      saveStr="Delete"
      className="flex flex-col items-center text-center py-6"
    >
      <FaCircleExclamation className="text-3xl" />
      <h3 className="text-2xl font-extrabold mb-3">Are you sure?</h3>
      <p className="leading-tight">
        Are you sure you want to delete this? <br />
        This process cannot be undone.
      </p>
    </OverlayForm>
  );
};

export default TodoDeleteConformOverlay;
