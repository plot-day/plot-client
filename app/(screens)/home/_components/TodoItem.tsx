import PlayButton from '@/components/button/PlayButton';
import IconHolder from '@/components/icon/IconHolder';
import { TagOptionType } from '@/store/category';
import {
  todoFormDataAtom,
  todoMutation,
  TodoType,
  StatusType,
} from '@/store/todo';
import { getTimestampStr, toCamelCase } from '@/util/convert';
import { useAtomValue, useSetAtom } from 'jotai';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconPickerItem } from 'react-icons-picker-more';
import { FaCheck, FaXmark } from 'react-icons/fa6';

const TodoItem = (todo: TodoType) => {
  const pathname = usePathname();
  const setFormData = useSetAtom(todoFormDataAtom);
  const { mutate } = useAtomValue(todoMutation);

  const updateStatus = async (statusStr: StatusType) => {
    try {
      mutate({ id: todo.id, status: statusStr });
    } catch (error) {
      console.error(error);
    }
  };

  const { title, category, icon, fieldValues, date, status } = todo;

  return (
    <div className="todo-item w-full flex justify-between items-center">
      <Link
        href={`${pathname}?todo-input=show`}
        className="w-full flex items-center gap-4"
        onClick={() => {
          setFormData(todo);
        }}
      >
        {/* <PlayButton /> */}
        <IconHolder>{icon}</IconHolder>
        <div>
          <p className="category text-xs font-extrabold">{category.title}</p>
          {date && (
            <p className="date hidden text-xs font-extrabold">
              {(typeof date === 'string'
                ? new Date(
                    +date.split('-')[0],
                    +date.split('-')[1] - 1,
                    +date.split('-')[2]
                  )
                : date
              ).toLocaleDateString(undefined, {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </p>
          )}
          <p>{title}</p>
          <ul className="flex flex-wrap gap-2 text-xs font-light mt-2">
            {category.fields.map(
              ({ icon, type, label, option }, i) =>
                fieldValues &&
                (fieldValues[toCamelCase(label)] === 0 ||
                  fieldValues[toCamelCase(label)]) && (
                  <li key={i} className="flex gap-1 items-center">
                    <IconPickerItem value={icon} />
                    <span>
                      {type === 'timestamp'
                        ? getTimestampStr(fieldValues[toCamelCase(label)])
                        : type === 'tag'
                        ? (option as TagOptionType)?.tags?.find(
                            (item) =>
                              item.id === fieldValues[toCamelCase(label)]
                          )?.title || fieldValues[toCamelCase(label)]
                        : fieldValues[toCamelCase(label)]}
                    </span>
                  </li>
                )
            )}
          </ul>
        </div>
      </Link>
      <div
        className={`w-[1rem] h-[1rem] border-black flex justify-center items-center text-white text-xs border rounded-[0.25rem] ${
          status === 'done' || status === 'dismiss' ? 'bg-primary' : ''
        }`}
        onClick={
          status === 'todo'
            ? updateStatus.bind(null, 'done')
            : updateStatus.bind(null, 'todo')
        }
      >
        {status === 'done' && <FaCheck />}
        {status === 'dismiss' && <FaXmark />}
      </div>
    </div>
  );
};

export default TodoItem;
