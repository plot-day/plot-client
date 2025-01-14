import React, { useEffect, useState } from 'react'

interface TimestampFieldInputProps {
    value: string;
    setValue: (v: string) => void;
}

const TimestampFieldInput = ({value, setValue}: TimestampFieldInputProps) => {
    const [timestamp, setTimeStamp] = useState({hour: '00', min: '00', sec: '00'});

    const changeHandler = (key: string) => {
        const setTimestampHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
            setTimeStamp((prev) => ({...prev, [key]: (key !== 'hour' && +(e.target.value) >= 60) ? ('0' + e.target.value[1] || '00') : e.target.value}));
        }
        return setTimestampHandler;
    }

    useEffect(() => {
        const hour = +(timestamp.hour);
        const min = +(timestamp.min);
        const sec = +(timestamp.sec);

        const timestampStr = `${hour ? hour + 'h' : ''}${min ? (hour ? ' ' + min + 'm' : min + 'm') : ''}${sec ? (min ? ' ' + sec + 's' : sec + 's') : ''}`;
        setValue(timestampStr);
    }, [timestamp]);

    useEffect(() => {
        if (value) {
            const match = /(?:(\d+)h)?[ ]?(?:(\d+)m)?[ ]?(?:(\d+)s)?/g.exec(value);
            match && setTimeStamp({
                hour: match[1]?.toString().length === 1 ? '0' + match[1] : (match[1] ? match[1] : '00'),
                min: match[2]?.toString().length === 1 ? '0' + match[2] : (match[2] ? match[2] : '00'),
                sec: match[3]?.toString().length === 1 ? '0' + match[3] : (match[3] ? match[3] : '00'),
            });
        }
    }, [value]);

  return (
    <div className="flex">
        <input value={timestamp.hour} className="w-[2ch] text-right" onChange={changeHandler('hour')} />:<input value={timestamp.min} className="w-[2ch] text-right" onChange={changeHandler('min')} />:<input value={timestamp.sec} className="w-[2ch] text-right" onChange={changeHandler('sec')} />
    </div>
  )
}

export default TimestampFieldInput