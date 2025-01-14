'use client';
import React, { useRef } from 'react'

interface DateFieldInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    value: string;
    setValue: (v: string) => void;
}

const DateFieldInput = ({ value, setValue, ...props }: DateFieldInputProps) => {
  const dateRef = useRef<HTMLInputElement>(null);

  const openPicker = () => {
    dateRef?.current?.showPicker();
  }

  return (
    <input type="datetime-local" value={value}
    ref={dateRef}
    onClick={openPicker}
    onChange={(e) => {
      setValue(e.target.value);
    }} 
    {...props}
    />
  )
}

export default DateFieldInput