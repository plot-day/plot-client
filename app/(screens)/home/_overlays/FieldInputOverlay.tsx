'use client';

import Overlay from '@/components/overlay/Overlay';
import { useSearchParams } from 'next/navigation';
import TagFieldInputOverlay from './TagFieldInputOverlay';

const FieldInputOverlay = () => {
  const params = useSearchParams();
  const fieldId = params.get('fieldId') || '';
  const type = params.get('type');

  return (
    <Overlay id="field-input" hideX={true}>
      {type === 'number' && <NumberFieldInput />}
      {type === 'text' && <TextFieldInput />}
      {type === 'date' && <DateFieldInput />}
      {type === 'timestamp' && <TimestampFieldInput />}
      {type === 'tag' && <TagFieldInputOverlay fieldId={fieldId} />}
      {type === 'image' && <ImageFieldInput />}
      {type === 'url' && <UrlFieldInput />}
    </Overlay>
  );
};

const NumberFieldInput = () => {
  return <div>NumberFieldInput</div>;
};

const TextFieldInput = () => {
  return <div>TextFieldInput</div>;
};

const DateFieldInput = () => {
  return <div>DateFieldInput</div>;
};

const TimestampFieldInput = () => {
  return <div>TimestampFieldInput</div>;
};

const ImageFieldInput = () => {
  return <div>ImageFieldInput</div>;
};

const UrlFieldInput = () => {
  return <div>FileFieldInput</div>;
};

export default FieldInputOverlay;
