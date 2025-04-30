'use client';

import OverlayForm from '@/components/overlay/OverlayForm';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
  title: z.string().min(1),
});

const FieldInputOverlay = () => {
  const params = useSearchParams();
  const fieldId = params.get('fieldId');
  const type = params.get('type');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log(data);
  };

  return (
    <OverlayForm<z.infer<typeof formSchema>>
      id="field-input"
      form={form}
      onSubmit={onSubmit}
    >
      {type === 'number' && <NumberFieldInput />}
      {type === 'text' && <TextFieldInput />}
      {type === 'date' && <DateFieldInput />}
      {type === 'timestamp' && <TimestampFieldInput />}
      {type === 'tags' && <TagsFieldInput />}
      {type === 'options' && <OptionsFieldInput />}
      {type === 'image' && <ImageFieldInput />}
      {type === 'url' && <UrlFieldInput />}
    </OverlayForm>
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

const TagsFieldInput = () => {
  return <div>TagsFieldInput</div>;
};

const OptionsFieldInput = () => {
  return <div>OptionsFieldInput</div>;
};

const ImageFieldInput = () => {
  return <div>ImageFieldInput</div>;
};

const UrlFieldInput = () => {
  return <div>FileFieldInput</div>;
};

export default FieldInputOverlay;
