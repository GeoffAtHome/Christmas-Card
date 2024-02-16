// left => pos_x, top => pos_y, right => width, bottom => height
export interface CardItem {
  i: number; // imageNumber
  x: number; // posX
  y: number; // posY
  w: number; // width
  h: number; // height
  t: string; // title
  d: string; // Base64 encoded Image
  m: number; // Large height
  n: number; // Large width
}

export interface CardGrid {
  i: string; // image
  t: string; // title
  l: string; // largeImagePrefix
  s: string; // smallImagePrefix
  w: number; // width
  h: number; // height
  x: number; // xGrid
  y: number; // yGrid
  d: string; // Base64 encoded Image
  m: number; // Large height
  n: number; // Large width
}

export interface CardData {
  cardGrid: CardGrid;
  cardData: Array<CardItem>;
}

export type XmasCardData =
  | {
      year: number;
      images: string;
      front: CardData;
      back: CardData;
    }
  | undefined;

export type CardSide = 'front' | 'back';
export type Pages = 'card' | 'image' | 'large' | 'view404';

export const destLarge = `l`;
export const destSmall = `s`;
export const destVerySmall = `m`;
