import fs from 'fs';
import Papa from 'papaparse';
import { Buffer } from 'buffer';
import { saveTheData } from './saveTheData';
import {
  CardSide,
  XmasCardData,
  destVerySmall,
} from '../../src/components/card-type';

interface CsvSizeData {
  side: CardSide;
  tag: string;
  width: number;
  height: number;
}

async function base64EncodeImage(filename: string) {
  const file = await fs.readFileSync(filename);
  return Buffer.from(file).toString('base64');
}

async function readSizes(filename: string) {
  let sizes: Array<CsvSizeData> = [];
  try {
    const file = await fs.readFileSync(filename, 'utf8');
    const { data } = Papa.parse<CsvSizeData>(file, {
      header: true,
      dynamicTyping: true,
    });

    sizes = [...data];
  } catch (err: any) {
    console.error(JSON.stringify(err));
  }
  return sizes;
}

export async function processSizes(
  cardData: XmasCardData,
  year: string,
  sizesFile: string,
  distDirFront: string,
  distDirBack: string
) {
  const sizes = await readSizes(`../tool/${sizesFile}`);
  const { front } = cardData!;
  const { back } = cardData!;

  for (const size of sizes) {
    if (size.side !== null) {
      const index = Number(size.tag);
      if (Number.isNaN(index)) {
        // Front or back
        // Front Image
        if (size.side === 'front') {
          front.cardGrid.m = size.width;
          front.cardGrid.n = size.height;
          // eslint-disable-next-line no-await-in-loop
          front.cardGrid.d = await base64EncodeImage(
            `${distDirFront}/${size.tag}.webp`
          );
        } else {
          // Back Image
          back.cardGrid.m = size.width;
          back.cardGrid.n = size.height;
          // eslint-disable-next-line no-await-in-loop
          back.cardGrid.d = await base64EncodeImage(
            `${distDirBack}/${size.tag}.webp`
          );
        }
      } else if (size.side === 'front') {
        front.cardData[index].m = size.width;
        front.cardData[index].n = size.height;
        // eslint-disable-next-line no-await-in-loop
        front.cardData[index].d = await base64EncodeImage(
          `${distDirFront}/${destVerySmall}/${index}.webp`
        );
      } else {
        back.cardData[index].m = size.width;
        back.cardData[index].n = size.height;
        // eslint-disable-next-line no-await-in-loop
        back.cardData[index].d = await base64EncodeImage(
          `${distDirBack}/${destVerySmall}/${index}.webp`
        );
      }
    }
  }

  saveTheData(`../${year}/${year}.json`, JSON.stringify(cardData));
}
