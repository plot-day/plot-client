import dayjs from "dayjs";

export const getDashDate = (date: Date) => {
    return dayjs(date).format('YYYY-MM-DD');
  };
  