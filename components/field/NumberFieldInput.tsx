import React from 'react';
import AutoSizeInput, {
  AutoSizeInputProps,
} from '@/components/input/AutoSizeInput';

interface NumberFieldInputProps extends AutoSizeInputProps {
  label: string;
  min?: number;
  max?: number;
  unit?: string;
  step?: number;
  showSlider?: boolean;
  stepLabels?: string[];
}

const NumberFieldInput = (props: NumberFieldInputProps) => {
  return (
    <AutoSizeInput
      {...props}
      placeholder={props.label && `No ${props.label}`}
      type="number"
      min={props.min}
      max={props.max}
    />
  );
};

export default NumberFieldInput;
