import { LexoRank } from 'lexorank';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense } from 'react';
import { FaPencil } from 'react-icons/fa6';

interface TagFieldInputProps {
  value: number;
  setValue: (v: string) => void;
  name: string;
  option: any;
  fieldId: string;
  categoryId: string;
}

const TagFieldInput = ({
  fieldId,
  categoryId,
  value,
  setValue,
  name,
  option,
}: TagFieldInputProps) => {
  const pathname = usePathname();
  const params = useSearchParams();
  const router = useRouter();

  return (
    <Suspense>
      <div className="flex items-center">
        <select
          name={name}
          value={value}
          className="appearance-none"
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            const value = e.target.value;

            if (value.startsWith(pathname)) {
              router.push(value);
            } else {
              setValue(value);
            }
          }}
        >
          <option value="">Select {name}</option>
          {option?.tags
            .toSorted((a: any, b: any) =>
              LexoRank.parse(a.rank).compareTo(LexoRank.parse(b.rank))
            )
            .map((item: any) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          <option
            value={`${pathname}?${params.toString()}&categoryId=${categoryId}&field-input=show&fieldId=${fieldId}&type=tag`}
          >
            === Add ===
          </option>
        </select>
      </div>
    </Suspense>
  );
};

export default TagFieldInput;
