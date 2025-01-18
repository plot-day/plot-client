import React, { useEffect, useState } from 'react';
import AutoSizeInput from '../input/AutoSizeInput';

interface TimestampFieldInputProps {
  value: number;
  setValue: (v: number) => void;
}

const TimestampFieldInput = ({ value, setValue }: TimestampFieldInputProps) => {
  const [timestamp, setTimeStamp] = useState({ hour: '00', min: '00', sec: '00' });

  const changeHandler = (key: string) => {
    const setTimestampHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
      const timeValue = new Date(value);
      const input =
        e.target.value.length > 2 ? e.target.value.slice(1, 3) : e.target.value;

      switch (key) {
        case 'hour':
          if (+input >= 24) {
            timeValue.setHours(23);
          } else {
            timeValue.setHours(+input);
          }
          break;
        case 'min':
          if (+input >= 60) {
            timeValue.setMinutes(+input[input.length - 1]);
          } else {
            timeValue.setMinutes(+input);
          }
          break;
        case 'sec':
          if (+input >= 60) {
            timeValue.setSeconds(+input[input.length - 1]);
          } else {
            timeValue.setSeconds(+input);
          }
          break;
      }

      setValue(timeValue.getTime());
    };
    return setTimestampHandler;
  };

  useEffect(() => {
    if (value) {
      const timeValue = new Date(value);

      const hour = timeValue.getHours();
      const min = timeValue.getMinutes();
      const sec = timeValue.getSeconds();

      setTimeStamp({
        hour: hour >= 10 ? hour.toString() : '0' + hour,
        min: min >= 10 ? min.toString() : '0' + min,
        sec: sec >= 10 ? sec.toString() : '0' + sec,
      });
    }
  }, [value]);

  return (
    <div className="flex">
      <input
        type="number"
        value={timestamp.hour}
        maxLength={2}
        className="w-[2ch] text-right"
        onChange={changeHandler('hour')}
      />
      :
      <input
        type="number"
        value={timestamp.min}
        maxLength={2}
        className="w-[2ch] text-right"
        onChange={changeHandler('min')}
      />
      :
      <input
        type="number"
        value={timestamp.sec}
        maxLength={2}
        className="w-[2ch] text-right"
        onChange={changeHandler('sec')}
      />
    </div>
  );
};

export default TimestampFieldInput;
