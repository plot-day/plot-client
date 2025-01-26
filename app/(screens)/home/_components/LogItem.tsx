import PlayButton from '@/components/button/PlayButton';
import IconHolder from '@/components/icon/IconHolder';
import { logFormDataAtom, logMutation, LogType, StatusType } from '@/store/log';
import { getTimestampStr, toCamelCase } from '@/util/convert';
import { useAtomValue, useSetAtom } from 'jotai';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconPickerItem } from 'react-icons-picker-more';
import { FaCheck, FaXmark } from 'react-icons/fa6';

const LogItem = (log: LogType) => {
  const pathname = usePathname();
  const setFormData = useSetAtom(logFormDataAtom);
  const { mutate } = useAtomValue(logMutation);

  const updateStatus = async (statusStr: StatusType) => {
    try {
      mutate({ id: log.id, status: statusStr });
    } catch (error) {
      console.error(error);
    }
  };

  const {
    title,
    category,
    icon,
    fieldValues,
    type,
    status,
  } = log;

  return (
    <div className="w-full flex justify-between items-center">
      <Link
        href={`${pathname}?log-input=show`}
        className="flex items-center gap-4"
        onClick={() => {
          setFormData(log);
        }}
      >
        {/* <PlayButton /> */}
        <IconHolder>{icon}</IconHolder>
        <div>
          <p className="text-xs font-extrabold">{category.title}</p>
          <p>{title}</p>
          <ul className="flex gap-2 text-xs font-light mt-2">
            {category.fields.map(
              ({ icon, type, label }, i) =>
                fieldValues &&
                fieldValues[toCamelCase(label)] && (
                  <li key={i} className="flex gap-1 items-center">
                    <IconPickerItem value={icon} />
                    <span>
                      {type === 'timestamp'
                        ? getTimestampStr(fieldValues[toCamelCase(label)])
                        : fieldValues[toCamelCase(label)]}
                    </span>
                  </li>
                )
            )}
          </ul>
        </div>
      </Link>
      <div
        className={`w-[1rem] h-[1rem] border-black flex justify-center items-center text-white text-xs ${
          type === 'task'
            ? 'border rounded-[0.25rem]'
            : type === 'event'
            ? 'border rounded-full'
            : 'border-t border-black mt-[1rem]'
        } ${status === 'done' || status === 'dismiss' ? 'bg-primary' : ''}`}
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

export default LogItem;
