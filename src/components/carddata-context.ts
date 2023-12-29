import { createContext } from '@lit/context';
import type { XmasCardData } from './card-type';

export type { XmasCardData } from './card-type';
export const xmasCardContext = createContext<XmasCardData>(
  'XmasCardDataContext'
);
