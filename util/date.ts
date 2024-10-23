import dayjs from "dayjs";

export const getDashDate = (date: Date) => {
  return dayjs(date).format('YYYY-MM-DD');
};
 
export const getDateTimeStr = (date: Date) => {
  return dayjs(date).format('YYYY-MM-DDTHH:mm');
};
  