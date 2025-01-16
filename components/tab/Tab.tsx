import { ClassNameProps } from '@/types/className';
import { cn } from '@/util/cn';
import React, { ReactElement } from 'react';
import { FieldValues } from 'react-hook-form';

interface TabItemType {
  icon?: ReactElement;
  label: string;
  value: string;
}

interface TabProps<T extends FieldValues> extends ClassNameProps {
  id: string;
  value: string;
  setValue: any;
  tabs: (TabItemType | React.ReactNode)[];
}
const Tab = <T extends FieldValues>({
  id,
  value,
  setValue,
  tabs,
  className,
}: TabProps<T>) => {
  return (
    <ul className={cn('flex justify-center flex-wrap gap-x-4', className)}>
      {tabs.map((tab) => {
        if (!tab) {
          return;
        }

        if (React.isValidElement(tab)) {
          return tab;
        }

        const tabData = tab as TabItemType;

        const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
          setValue && setValue(event.target.value);
        };

        return (
          <li
            key={`${id}-${tabData.value}`}
            className="font-extrabold [&_label]:opacity-20 [&>input:checked+label]:opacity-100"
          >
            <input
              id={`${id}-${tabData.value}`}
              type="radio"
              value={tabData.value}
              name={id}
              checked={value === tabData.value}
              onChange={changeHandler}
              hidden
            />
            <label
              htmlFor={`${id}-${tabData.value}`}
              className="flex h-full gap-1 items-center cursor-pointer"
            >
              {tabData.icon}
              {tabData.label}
            </label>
          </li>
        );
      })}
    </ul>
  );
};

export default Tab;
