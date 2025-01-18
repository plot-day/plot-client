import { cn } from '@/util/cn';
import React, { useEffect, useRef } from 'react'

const AutoHeightTextarea = (props: React.HTMLAttributes<HTMLTextAreaElement> | any) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const resize = () => {
    if (textareaRef?.current) {
      // We need to reset the height momentarily to get the correct scrollHeight for the textarea
      textareaRef.current.style.height = "0px";
      const scrollHeight = textareaRef.current.scrollHeight;

      // We then set the height directly, outside of the render loop
      // Trying to set this with state or a ref will product an incorrect value.
      textareaRef.current.style.height = scrollHeight + "px";
    }
    console.log(textareaRef?.current?.value);
  };

  return (
      <textarea ref={textareaRef} {...props} className={cn('max-h-[500px] scrollbar-hide', props.className)} onKeyUp={resize} />
  )
}

export default AutoHeightTextarea