import { customAlphabet } from 'nanoid';

export const newid = customAlphabet(
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789',
  8,
);
