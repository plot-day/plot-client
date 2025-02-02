import React, { useState } from 'react';

export interface AutoSizeInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
  value: string;
  setValue?: (v: string) => void;
}

const AutoSizeInput = ({ placeholder, value, setValue, onChange, ...props }: AutoSizeInputProps) => {
  return (
    <input
      {...props}
      style={{ width: (value?.length || 0) < 36 ? (value?.length || 0) + 'ch' : '35ch', minWidth: value ? undefined : placeholder?.length + 'ch', maxWidth: '100%' }}
      value={value}
      onChange={onChange ? onChange : (e) => {
        setValue && setValue(e.target.value);
      }}
      placeholder={placeholder}
    />
  );
};

export default AutoSizeInput;
