import { v4 as uuidv4 } from 'uuid';

export const DEFAULT_CATEGORIES_GROUP = 'Lifestyle';

export const DEFAULT_CATEGORIES = [
  {
    title: 'Todo',
    icon: '✅',
    enableTodo: true,
    fields: [],
    isDefault: true,
  },
  {
    title: 'Schedule',
    icon: '📆',
    enableTodo: true,
    fields: [],
    isDefault: false,
  },
  {
    title: 'Sleep',
    enableTodo: false,
    icon: '🌙',
    fields: [
      {
        id: uuidv4(),
        icon: 'FaClock',
        label: 'Duration',
        type: 'timestamp',
        option: [],
      },
    ],
    isDefault: false,
  },
  {
    title: 'Expense',
    icon: '💸',
    enableTodo: false,
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
        icon: 'FaSackDollar',
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
    enableTodo: false,
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
