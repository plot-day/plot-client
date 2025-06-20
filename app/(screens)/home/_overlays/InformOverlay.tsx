'use client';

import Overlay from '@/components/overlay/Overlay';
import SaveCancelButton from '@/components/overlay/SaveCancelButton';
import { informAtom } from '@/store/ui';
import { useAtom, useAtomValue } from 'jotai';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaCircleExclamation } from 'react-icons/fa6';

const InformOverlay = () => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const [
    { isOpen, title, description, confirmStr, onConfirm, onCancle },
    setInform,
  ] = useAtom(informAtom);

  const [isPending, setIsPending] = useState(false);

  const submitHandler = async () => {
    try {
      setIsPending(true);

      onConfirm && (await onConfirm());

      setIsPending(false);
      setInform((prev) => ({ ...prev, isOpen: false }));

      router.back();
    } catch (error) {
      console.error(error);
      setIsPending(false);
      setInform((prev) => ({ ...prev, isOpen: false }));
    }
  };

  const cancleHandler = () => {
    onCancle && onCancle();
    setInform((prev) => ({ ...prev, isOpen: false }));
    router.back();
  };

  useEffect(() => {
    if (isOpen) {
      router.push(`${pathname}?${params.toString()}&inform-overlay=show`);
    }
  }, [isOpen]);

  return (
    <Overlay
      id="inform-overlay"
      hideX={true}
      onClose={() => {
        setInform((prev) => ({ ...prev, isOpen: false }));
        setIsPending(false);
      }}
      className="flex flex-col items-center text-center py-6"
    >
      <FaCircleExclamation className="text-3xl" />
      <h3 className="text-2xl font-extrabold mb-3">{title}</h3>
      <p className="leading-tight">{description}</p>
      <SaveCancelButton
        saveStr={confirmStr}
        onSave={submitHandler}
        onCancel={cancleHandler}
        isPending={isPending}
      />
    </Overlay>
  );
};

export default InformOverlay;
