import fs from 'fs';
import Papa from 'papaparse';
import { Buffer } from 'buffer';
import { saveTheData } from './saveTheData';
import { cardData } from './cardData';

interface CsvSizeData {
  tag: string;
  width: number;
  height: number;
}

const { front } = cardData;
const { back } = cardData;
const { year } = cardData;

async function base64EncodeImage(filename: string) {
  const file = await fs.readFileSync(filename, 'utf8');
  return Buffer.from(file, 'utf8').toString('base64');
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

export async function processSizes(distDir: string) {
  const sizes = await readSizes('sizes.txt');

  // Front Image
  let size = sizes.filter(s => s.tag === front.cardGrid.i);
  front.cardGrid.m = size[0].width;
  front.cardGrid.n = size[0].height;
  front.cardGrid.d = await base64EncodeImage(
    `../${year}/${distDir}/c-${front.cardGrid.i}.webp`
  );

  // Back Image
  size = sizes.filter(s => s.tag === back.cardGrid.i);
  back.cardGrid.m = size[0].width;
  back.cardGrid.n = size[0].height;
  back.cardGrid.d = await base64EncodeImage(
    `../${year}/${distDir}/c-${back.cardGrid.i}.webp`
  );

  for (const item of front.cardData) {
    const itemTag = `l-${item.i}`;
    size = sizes.filter(s => s.tag === itemTag);
    item.m = size[0].width;
    item.n = size[0].height;
    // eslint-disable-next-line no-await-in-loop
    item.d = await base64EncodeImage(`../${year}/${distDir}/t-${item.i}.webp`);
  }
  for (const item of back.cardData) {
    const itemTag = `l-${item.i}`;
    size = sizes.filter(s => s.tag === itemTag);
    item.m = size[0].width;
    item.n = size[0].height;
    // eslint-disable-next-line no-await-in-loop
    item.d = await base64EncodeImage(`../${year}/${distDir}/d-${item.i}.webp`);
  }

  saveTheData('test.json', JSON.stringify(cardData));
}
