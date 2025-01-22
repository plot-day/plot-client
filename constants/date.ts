export const YEARS = Array.from({ length: 2000 }, (v, i) => 2000 + i);

export const MONTHS = Array.from({ length: 12 }, (v, i) => new Date(0, i)).map((month) =>
  month.toLocaleDateString('en-US', { month: 'long' })
);
