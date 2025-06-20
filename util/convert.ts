import { LexoRank } from 'lexorank';

export const parseRank = (values: any) => ({
  ...values,
  rank: values.rank
    ? typeof values.rank === 'string'
      ? LexoRank.parse(values.rank)
      : values.rank
    : undefined,
  categoryRank: values.categoryRank
    ? typeof values.categoryRank === 'string'
      ? LexoRank.parse(values.categoryRank)
      : values.categoryRank
    : undefined,
});

export const stringifyRank = (values: any) => ({
  ...values,
  rank: values.rank?.toString(),
  listRank: values.listRank?.toString(),
  timelineRank: values.timelineRank?.toString(),
});

export const sortRank = (arr: any[], rankKey: string, desc?: boolean) => {
  return [...arr].sort((a, b) =>
    desc ? b[rankKey]?.compareTo(a[rankKey]) : a[rankKey]?.compareTo(b[rankKey])
  );
};

export const toCamelCase = (str: string) => {
  const words = str.toLowerCase().split(' ');
  const camelCases = [
    words[0],
    ...words
      .slice(1, words.length)
      .map((word) => word[0].toUpperCase() + word.slice(1, word.length)),
  ];
  return camelCases.join('');
};

export const getTimestampStr = (time: number) => {
  const timeValue = new Date(time);

  const hour = timeValue.getHours();
  const min = timeValue.getMinutes();
  const sec = timeValue.getSeconds();

  return `${hour ? hour + (min || sec ? 'h ' : 'h') : ''}${
    min ? min + (sec ? 'm ' : 'm') : ''
  }${sec ? sec + 's' : ''}`;
};
