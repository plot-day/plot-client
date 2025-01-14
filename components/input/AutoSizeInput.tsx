import React, { useState } from 'react';

export interface AutoSizeInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
  value: string;
  setValue: (v: string) => void;
}

const AutoSizeInput = ({ placeholder, value, setValue, ...props }: AutoSizeInputProps) => {
  return (
    <input
      {...props}
      style={{ width: (value?.length || 0) + 1 + 'ch', minWidth: value ? undefined : placeholder?.length + 'ch' }}
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
      }}
      placeholder={placeholder}
    />
  );
};

export default AutoSizeInput;
