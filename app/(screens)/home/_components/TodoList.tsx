import { ClassNameProps } from '@/types/className';
import { PropsWithChildren, useState } from 'react';
import { FaChevronDown, FaChevronRight, FaChevronUp } from 'react-icons/fa6';
import TodoItem from './TodoItem';
import { TodoType } from '@/store/todo';

interface TodoListProps extends ClassNameProps {
  title?: string;
  items: TodoType[];
  gap?: number;
  isFolded?: boolean;
  isRightSideArrow?: boolean;
}

const TodoList = ({
  title,
  items,
  isFolded,
  gap,
  isRightSideArrow,
  className,
}: TodoListProps) => {
  const [hide, setHide] = useState(isFolded);

  return (
    <ul className={className}>
      {!!title && !!items?.length && (
        <div
          className={`flex gap-2 items-center  ${
            hide ? '' : gap ? 'mb-' + gap : 'mb-4'
          } ${isRightSideArrow ? 'justify-between' : ''} cursor-pointer`}
          onClick={() => {
            setHide((prev) => !prev);
          }}
        >
          {isFolded !== undefined &&
            !isRightSideArrow &&
            (hide ? (
              <FaChevronRight className="text-[0.675rem]" />
            ) : (
              <FaChevronDown className="text-[0.675rem]" />
            ))}
          <h5 className="font-extrabold text-sm">{title}</h5>
          {isFolded !== undefined &&
            isRightSideArrow &&
            (hide ? (
              <FaChevronUp className="text-[0.675rem]" />
            ) : (
              <FaChevronDown className="text-[0.675rem]" />
            ))}
        </div>
      )}
      <li
        className={`space-y-6 text-lg font-light ${
          isFolded !== undefined && !isRightSideArrow ? 'ml-4' : ''
        }`}
      >
        {!hide && items?.map((item) => <TodoItem key={item.id} {...item} />)}
      </li>
    </ul>
  );
};

export default TodoList;
