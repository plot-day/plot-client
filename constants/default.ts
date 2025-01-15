import { v4 as uuidv4 } from 'uuid';

export const DEFAULT_CATEGORIES_GROUP = 'Lifestyle';

export const DEFAULT_CATEGORIES = [
  {
    title: 'Todo',
    icon: '✅',
    defaultLogType: 'task',
    fields: [],
    isDefault: true,
  },
  {
    title: 'Schedule',
    defaultLogType: 'event',
    icon: '📆',
    fields: [],
    isDefault: false,
  },
  {
    title: 'Sleep',
    defaultLogType: 'note',
    icon: '🌙',
    fields: [
      { id: uuidv4(), icon: 'FaClock', label: 'Duration', type: 'timestamp', option: [] },
    ],
    isDefault: false,
  },
  {
    title: 'Expense',
    icon: '💸',
    defaultLogType: 'note',
    fields: [
      {
        id: uuidv4(),
        icon: 'FaDollarSign',
        label: 'Expense',
        type: 'number',
        option: { unit: '$', isPrefix: true },
      },
      {
        id: uuidv4(),
        icon: 'FaStackDollar',
        label: 'Income',
        type: 'number',
        option: { unit: '$', isPrefix: true },
      },
    ],
    isDefault: false,
  },
  {
    title: 'Mood',
    icon: '🙂',
    defaultLogType: 'note',
    fields: [
      {
        id: uuidv4(),
        icon: 'FaChartColumn',
        label: 'Score',
        type: 'number',
        option: { min: -5, max: 5, step: 1 },
      },
    ],
    isDefault: false,
  },
];

export const DEFAULT_GROUPS = [
  {
    title: 'Work',
    isDefault: false,
  },
  {
    title: 'Study',
    isDefault: false,
  },
  {
    title: 'Project',
    isDefault: false,
  },
  {
    title: 'Hobby',
    isDefault: false,
  },
  {
    title: 'Fitness',
    isDefault: false,
  },
  {
    title: DEFAULT_CATEGORIES_GROUP,
    isDefault: false,
  },
  {
    title: 'etc.',
    isDefault: true,
  },
];
