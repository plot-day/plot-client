import { ClassNameProps } from '@/types/className';
import { cn } from '@/util/cn';
import { useEffect, useState } from 'react';

export interface CheckButtonProps extends ClassNameProps {
  checked: boolean;
  onChecked: (checked: boolean) => void;
  checkedCheckClass?: string;
  uncheckedClass?: string;
  checkedClass?: string;
}

const CheckButton = ({
  checked,
  onChecked,

  checkedCheckClass,
  className,
  uncheckedClass,
  checkedClass,
}: CheckButtonProps) => {
  const checkHandler = () => {
    onChecked(!checked);
  };

  return (
    <button
      type="button"
      className={cn(
        'flex justify-center items-center font-extrabold w-4 h-4 text-xs rounded-[0.25rem] shrink-0',
        checked
          ? `${checkedCheckClass || 'text-white'} bg-primary`
          : 'text-gray-300 bg-gray-100',
        checked ? checkedClass || '' : uncheckedClass || '',
        className
      )}
      onClick={checkHandler}
    >
      ✓
    </button>
  );
};

export default CheckButton;
