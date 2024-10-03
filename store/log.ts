import { getDashDate } from '@/util/date';
import { atomWithQuery } from 'jotai-tanstack-query';
import { todayAtom } from './ui';

export interface LogType {
  id: number;
  icon: string;
  thumbnail?: string;
  isIcon: boolean;
  title: string;
  category: string;
  isDone?: boolean;
  isTask: boolean;
  startTime: Date;
  endTime: Date;
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
          id: 1,
          icon: '🎸',
          thumbnail: '',
          isIcon: true,
          title: 'Rio Funk (Slap practice)',
          category: 'Bass',
          isTask: true,
          isDone: false,
          startTime: new Date(),
          endTime: new Date(),
          customFields: [
            { icon: 'fa6/FaItunesNote', label: 'Song', value: 'Rio Funk' },
            { icon: 'gi/GiMetronome', label: 'bpm', value: '85' },
          ],
        },
        {
          id: 2,
          icon: '🎸',
          thumbnail: '',
          isIcon: true,
          title: 'Hysteria (85bpm)',
          category: 'Bass',
          isTask: true,
          isDone: false,
          startTime: new Date(),
          endTime: new Date(),
          customFields: [
            { icon: 'fa6/FaItunesNote', label: 'Song', value: 'Hysteria' },
            { icon: 'gi/GiMetronome', label: 'bpm', value: '85' },
          ],
        },
        {
          id: 3,
          icon: '💪',
          thumbnail: '',
          isIcon: true,
          title: 'Morning Stretching',
          category: 'Home Training',
          isTask: true,
          isDone: false,
          startTime: new Date(),
          endTime: new Date(),
          customFields: [{ icon: 'io5/IoBarbell', label: 'Excercise', value: 'Stretching' }],
        },
        {
          id: 4,
          icon: '🌙',
          thumbnail: '',
          isIcon: true,
          title: 'Woke up early',
          category: 'Sleep',
          isTask: false,
          startTime: new Date(),
          endTime: new Date(),
          customFields: [
            { icon: 'fa6/FaClock', label: 'Time', value: 'Stretching' }
          ],
        },
      ];
    },
  };
});

const convertLogData = (logs: LogType[]) => {
  return logs;
};
