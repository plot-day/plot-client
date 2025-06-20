import { atom } from 'jotai';
import { categoryAtom, CategoryType } from './category';

export const todayAtom = atom(new Date());
export const categoryPageAtom = atom<CategoryType | null>(null);
export const groupTabAtom = atom('all');
export const informAtom = atom({
  title: '',
  description: '',
  isOpen: false,
  confirmStr: 'Confirm',
  onConfirm: (...args: any) => {},
  onCancle: (...args: any) => {},
});
