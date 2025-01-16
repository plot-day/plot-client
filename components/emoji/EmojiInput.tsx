import { emojiAtom } from '@/store/emoji';
import { ClassNameProps } from '@/types/className';
import { cn } from '@/util/cn';
import { useAtomValue } from 'jotai';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PropsWithChildren } from 'react';
import { FieldValues, Path, UseFormRegisterReturn, UseFormReturn } from 'react-hook-form';

interface EmojiInputProps<T extends FieldValues> extends ClassNameProps {
  id: string;
  params?: string;
  isCircle?: boolean;
  register?: UseFormRegisterReturn<Path<T>>;
  disabled?: boolean;
}

const EmojiInput = <T extends FieldValues>({
  id,
  params,
  isCircle,
  register,
  disabled,
  className,
  children,
}: PropsWithChildren<EmojiInputProps<T>>) => {
  const pathname = usePathname();
  
  const emoji = useAtomValue(emojiAtom);

  return (
    <Link
      className={cn(
        'w-24 h-24 bg-gray-100 rounded-xl flex justify-center items-center text-5xl shrink-0',
        isCircle ? 'rounded-full' : '',
        disabled ? 'pointer-events-none' : '',
        className
      )}
      href={`${pathname}?${params ? params + '&' : ''}emoji-select=show&emoji-id=${id}`}
    >
      {emoji.get(id)}
      {children}
      <input {...register} hidden />
    </Link>
  );
};

export default EmojiInput;
