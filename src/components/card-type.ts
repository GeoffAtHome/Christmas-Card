// left => pos_x, top => pos_y, right => width, bottom => height
export interface CardItem {
  i: string; // imageNumber
  x: number; // posX
  y: number; // posY
  w: number; // width
  h: number; // height
  t: string; // title
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
}

export interface CardData {
  cardGrid: CardGrid;
  cardData: Array<CardItem>;
}

export type XmasCardData =
  | {
      year: string;
      images: string;
      front: CardData;
      back: CardData;
    }
  | undefined;

export type CardSide = 'front' | 'back';
export type Pages = 'card' | 'image' | 'large' | 'view404';
