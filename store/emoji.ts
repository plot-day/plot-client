import { atom } from 'jotai';

const emoji = atom(new Map<string, string>());

export const emojiAtom = atom(
  (get) => get(emoji),
  (get, set, id: string, value: string) => {
    const next = new Map(get(emoji));
    next.set(id, value);
    set(emoji, next);
  }
);

export const emojiIdMemoryAtom = atom<string[]>([]);

