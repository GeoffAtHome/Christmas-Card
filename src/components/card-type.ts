// left => pos_x, top => pos_y, right => width, bottom => height
export interface CardItem {
  imageNumber: string;
  posX: number;
  posY: number;
  width: number;
  height: number;
  title: string;
}

export interface CardGrid {
  image: string;
  title: string;
  largeImagePrefix: string;
  smallImagePrefix: string;
  width: number;
  height: number;
  xGrid: number;
  yGrid: number;
}

export interface CardData {
  cardGrid: CardGrid;
  cardData: Array<CardItem>;
}

export interface XmasCardData {
  year: string;
  images: string;
  front: CardData;
  back: CardData;
}

export type CardSide = 'front' | 'back';
