'use client';

import { emojiAtom, emojiIdMemoryAtom } from '@/store/emoji';
import data from '@emoji-mart-kr/data';
import Picker from '@emoji-mart/react';
import { useAtomValue, useSetAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import Overlay from '../overlay/Overlay';

interface EmojiValueType {
  id: string;
  keywords: string[];
  name: string;
  native: string;
  shortcodes: string;
  unified: string;
}

const EmojiOverlay = () => {
  const router = useRouter();

  const emojiIdMemory = useAtomValue(emojiIdMemoryAtom);

  const setEmoji = useSetAtom(emojiAtom);

  const emojiSelectHandler = (value: EmojiValueType) => {
    emojiIdMemory.length && setEmoji(emojiIdMemory[emojiIdMemory.length - 1], value.native);
    router.back();
  };

  return (
    <Overlay
      id="emoji-select"
      isRight={true}
      backdropOpacity={0.2}
      className="z-[102] p-4 flex flex-col items-center [&_em-emoji-picker]:w-full [&_em-emoji-picker]:shadow-none [&>div]:w-full"
      hideX={true}
    >
      <Picker
        data={data}
        onEmojiSelect={emojiSelectHandler}
        emojiVersion={14}
        set="native"
        navPosition="bottom"
        previewPosition="none"
        skinTonePosition="search"
        dynamicWidth={true}
      />
    </Overlay>
  );
};

export default EmojiOverlay;
