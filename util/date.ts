import dayjs from "dayjs";

export const getDashDate = (date: Date | string | undefined) => {
  return date && dayjs(date).format('YYYY-MM-DD');
};
 
export const getDateTimeStr = (date: Date | string | undefined) => {
  return date && dayjs(date).format('YYYY-MM-DDTHH:mm');
};
  
export const getHourInMs = (value: number) => {
  return Math.floor(value / 1000 / 60 / 60) * 1000 * 60 * 60;
}