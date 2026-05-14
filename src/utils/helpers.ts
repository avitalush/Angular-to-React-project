import { v4 as uuidv4 } from "uuid";

export const generateId = (): string => uuidv4();

export const randomFrom = <T>(arr: readonly T[] | T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};
