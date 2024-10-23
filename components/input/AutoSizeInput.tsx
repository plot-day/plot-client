import React, { useState } from 'react';

interface AutoSizeInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  minWidth: string;
}

const AutoSizeInput = ({ minWidth, ...props }: AutoSizeInputProps) => {
  const [value, setValue] = useState('');
  return (
    <input
      {...props}
      style={{ width: value.length + 1 + 'ch', minWidth: value ? undefined : minWidth }}
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
      }}
    />
  );
};

export default AutoSizeInput;
