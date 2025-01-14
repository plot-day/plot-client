import { getDashDate } from '@/util/date';
import { atomWithQuery } from 'jotai-tanstack-query';
import { todayAtom } from './ui';

export interface LogType {
  id: string;
  icon: string;
  thumbnail?: string;
  isIcon: boolean;
  title: string;
  content?: string;
  category: string;
  type: string;
  isDone?: boolean;
  date: Date;
  endDate?: Date;
  customFields: { icon: any; label: string; value: string }[];
}

export const logsTodayAtom = atomWithQuery<LogType[]>((get) => {
  return {
    queryKey: ['logs', get(todayAtom)],
    queryFn: async ({ queryKey: [, today] }) => {
      //     const res = await fetch(
      //       process.env.NEXT_PUBLIC_BASE_URL + `/api/log?date=${getDashDate(today as Date)}`
      //     );
      //     const logs = await res.json();

      //   return convertLogData(logs);
      return [
        {
          id: '1',
          icon: '🎸',
          thumbnail: '',
          isIcon: true,
          title: 'Rio Funk (Slap practice)',
          category: 'Bass',
          type: 'task',
          isDone: false,
          date: new Date(),
          customFields: [
            { icon: 'FaItunesNote', label: 'Song', value: 'Rio Funk' },
            { icon: 'GiMetronome', label: 'bpm', value: '85' },
          ],
        },
        {
          id: '2',
          icon: '🎸',
          thumbnail: '',
          isIcon: true,
          title: 'Hysteria (85bpm)',
          category: 'Bass',
          type: 'task',
          isDone: false,
          date: new Date(),
          customFields: [
            { icon: 'FaItunesNote', label: 'Song', value: 'Hysteria' },
            { icon: 'GiMetronome', label: 'bpm', value: '85' },
          ],
        },
        {
          id: '3',
          icon: '💪',
          thumbnail: '',
          isIcon: true,
          title: 'Morning Stretching',
          category: 'Home Training',
          type: 'task',
          isDone: false,
          date: new Date(),
          customFields: [
            { icon: 'IoBarbell', label: 'Excercise', value: 'Stretching' },
          ],
        },
        {
          id: '4',
          icon: '🌙',
          thumbnail: '',
          isIcon: true,
          title: 'Woke up early',
          category: 'Sleep',
          type: 'note',
          date: new Date(),
          customFields: [{ icon: 'FaClock', label: 'Time', value: 'Stretching' }],
        },
      ];
    },
  };
});

const convertLogData = (logs: LogType[]) => {
  return logs;
};
