import { ClassNameProps } from '@/types/className';
import { cn } from '@/util/cn';
import { motion } from 'framer-motion';
import React, { MouseEventHandler, PropsWithChildren } from 'react';

interface ContentViewInterface extends ClassNameProps {
  onClick?: MouseEventHandler<HTMLDivElement>;
}

const ContentView = ({
  onClick,
  className,
  children,
}: PropsWithChildren<ContentViewInterface>) => {
  return (
    <motion.div
      layoutId="content-box"
      className={cn(
        'absolute bottom-0 w-full max-h-[calc(100dvh-23rem)] p-8 bg-white rounded-tl-3xl rounded-tr-3xl',
        className
      )}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

export default ContentView;
