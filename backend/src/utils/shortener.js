import { nanoid } from 'nanoid';

export const generateShortId = () => {
  return nanoid(7);
};