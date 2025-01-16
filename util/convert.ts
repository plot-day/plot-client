import { LexoRank } from 'lexorank';

export const parseRank = (values: any) => ({
  ...values,
  rank: values.rank
    ? typeof values.rank === 'string'
      ? LexoRank.parse(values.rank)
      : values.rank
    : undefined,
  todayRank: values.todayRank
    ? typeof values.todayRank === 'string'
      ? LexoRank.parse(values.todayRank)
      : values.todayRank
    : undefined,
  inboxRank: values.inboxRank
    ? typeof values.inboxRank === 'string'
      ? LexoRank.parse(values.inboxRank)
      : values.inboxRank
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
