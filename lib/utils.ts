import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const deepCompare = <T extends Record<string, any>>(
  obj1: T,
  obj2: T
): boolean => {
  if (
    typeof obj1 !== "object" ||
    obj1 === null ||
    typeof obj2 !== "object" ||
    obj2 === null
  ) {
    return obj1 === obj2;
  }

  const keys1 = Object.keys(obj1) as (keyof T)[];
  const keys2 = Object.keys(obj2) as (keyof T)[];

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (let key of keys1) {
    if (!obj2.hasOwnProperty(key) || !deepCompare(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
};
