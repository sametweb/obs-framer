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

export function createThrottler<T extends any[]>(
  callback: (...args: T) => void,
  delay: number = 100
): (...args: T) => void {
  let lastCall = 0;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function throttledFunction(...args: T): void {
    const now = Date.now();
    const timeSinceLastCall = now - lastCall;

    if (timeSinceLastCall >= delay) {
      // Execute immediately if enough time has passed
      lastCall = now;
      callback(...args);
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    } else {
      // Schedule execution for the next available time slot
      if (timeoutId === null) {
        const remainingTime = delay - timeSinceLastCall;
        timeoutId = setTimeout(() => {
          lastCall = Date.now();
          callback(...args);
          timeoutId = null;
        }, remainingTime);
      }
    }
  };
}
