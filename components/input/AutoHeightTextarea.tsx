import { cn } from '@/util/cn';
import React, { ForwardedRef, useRef } from 'react';

const AutoHeightTextarea = (
  props: React.HTMLAttributes<HTMLTextAreaElement> | any,
  ref: ForwardedRef<HTMLTextAreaElement>
) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const resize = () => {
    if (textareaRef?.current) {
      // We need to reset the height momentarily to get the correct scrollHeight for the textarea
      textareaRef.current.style.height = '0px';
      const scrollHeight = textareaRef.current.scrollHeight;

      // We then set the height directly, outside of the render loop
      // Trying to set this with state or a ref will product an incorrect value.
      textareaRef.current.style.height = scrollHeight + 'px';
    }
  };

  return (
    <textarea
      ref={(node) => {
        textareaRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      }}
      {...props}
      className={cn('max-h-[500px] scrollbar-hide', props.className)}
      onKeyUp={resize}
    />
  );
};

export default React.forwardRef(AutoHeightTextarea);
