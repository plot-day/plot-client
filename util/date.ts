import dayjs, { Dayjs } from "dayjs";

export const getDashDate = (inputDate: Date | Dayjs | string | undefined) => {
  let date;

  if (typeof inputDate === 'string') {
    const [dateStr, timeStr] = inputDate.split('T');
    const [yearStr, monthStr, dayStr] = dateStr.split('-');
    if (yearStr && monthStr && dayStr) {
      const year = parseInt(yearStr);
      const month = parseInt(monthStr) - 1;
      const day = parseInt(dayStr);
      date = dayjs(new Date(year, month, day));
    }
  }

  if (dayjs.isDayjs(inputDate)) {
    date = inputDate;
  } else {
    date = dayjs(inputDate);
  }

  return date?.format('YYYY-MM-DD');
};
 
export const getDateTimeStr = (date: Date | Dayjs | string | undefined) => {
  return date && dayjs(date).format('YYYY-MM-DDTHH:mm');
};
  
export const getHourInMs = (value: number) => {
  return Math.floor(value / 1000 / 60 / 60) * 1000 * 60 * 60;
}