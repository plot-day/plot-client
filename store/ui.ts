import { atom } from "jotai";
import { categoryAtom } from "./category";

export const todayAtom = atom(new Date());
export const categoryPageAtom = atom((get) => get(categoryAtom).data?.find((item) => item.isDefault));