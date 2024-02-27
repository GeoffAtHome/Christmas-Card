// https://www.codespeedy.com/display-an-image-from-base64-code-in-html/
// magick identify -format "%wx%h"  ../2023/originals/O-15.jpg

import fs, { PathLike } from 'fs';
import {
  CardItem,
  CardSide,
  XmasCardData,
  destLarge,
  destSmall,
  destVerySmall,
} from '../../src/components/card-type';
import { readCSV } from './readCSV';
import { saveTheData } from './saveTheData';
import { processSizes } from './readSizes';

const year = '2022';
const frontPrefix = 'O-';
const backPrefix = 'B-';
const sizesFile = 'sizes.txt';
const lSize = '1024x1024';
const sSize = '320x320';
const wSize = '80@';
const destDirRoot = `../${year}/images`;
const destDirFront = `${destDirRoot}/front`;
const destDirBack = `${destDirRoot}/back`;

async function createDirectories() {
  if (!(await fs.existsSync(`${destDirRoot}`)))
    await fs.mkdirSync(`${destDirRoot}`);

  if (!(await fs.existsSync(`${destDirFront}`)))
    await fs.mkdirSync(`${destDirFront}`);
  if (!(await fs.existsSync(`${destDirFront}/${destLarge}`)))
    await fs.mkdirSync(`${destDirFront}/${destLarge}`);
  if (!(await fs.existsSync(`${destDirFront}/${destSmall}`)))
    await fs.mkdirSync(`${destDirFront}/${destSmall}`);
  if (!(await fs.existsSync(`${destDirFront}/${destVerySmall}`)))
    await fs.mkdirSync(`${destDirFront}/${destVerySmall}`);

  if (!(await fs.existsSync(`${destDirBack}`)))
    await fs.mkdirSync(`${destDirBack}`);
  if (!(await fs.existsSync(`${destDirBack}/${destLarge}`)))
    await fs.mkdirSync(`${destDirBack}/${destLarge}`);
  if (!(await fs.existsSync(`${destDirBack}/${destSmall}`)))
    await fs.mkdirSync(`${destDirBack}/${destSmall}`);
  if (!(await fs.existsSync(`${destDirBack}/${destVerySmall}`)))
    await fs.mkdirSync(`${destDirBack}/${destVerySmall}`);
}

function processImage(
  side: CardSide,
  tagImage: string,
  sourceImage: string,
  destImageL: string,
  destImageS: string,
  destImageW: string
) {
  let text = `magick ${sourceImage} -resize ${lSize} ${destImageL}\n`;
  text += `magick ${sourceImage} -resize ${sSize} ${destImageS}\n`;
  text += `magick ${sourceImage} -resize ${wSize} ${destImageW}\n`;
  text += `magick identify -format "${side},${tagImage},%%w,%%h" ${destImageL} >>${sizesFile}\n`;
  text += `echo: >>${sizesFile}\n`;

  return text;
}

function writeImage(
  card: CardItem,
  index: number,
  side: CardSide,
  sidePrefix: string,
  dirRoot: string
) {
  let text = '';
  const sourceImage = fs.existsSync(
    `../${year}/originals/${sidePrefix}${card.i}.jpg`
  )
    ? `../${year}/originals/${sidePrefix}${card.i}.jpg`
    : `../${year}/originals/${sidePrefix}${card.i}.png`;

  const destImageL = `${dirRoot}/${destLarge}/${index}.webp`;
  const destImageS = `${dirRoot}/${destSmall}/${index}.webp`;
  const destImageW = `${dirRoot}/${destVerySmall}/${index}.webp`;
  text += processImage(
    side,
    index.toString(),
    sourceImage,
    destImageL,
    destImageS,
    destImageW
  );
  return text;
}

async function createTheScript(data: XmasCardData) {
  const { front } = data!;
  const { back } = data!;
  // const { year } = data!;
  let text = `del ${sizesFile}\n`;
  // Write header
  text += `echo side,tag,width,height>>${sizesFile}\n`;
  front.cardData.forEach((card, index) => {
    text += writeImage(card, index, 'front', frontPrefix, destDirFront);
  });

  back.cardData.forEach((card, index) => {
    text += writeImage(card, index, 'back', backPrefix, destDirBack);
  });

  // Front
  text += processImage(
    'front',
    'm',
    `../${year}/originals/${front.cardGrid.i}`,
    `${destDirFront}/${destLarge}.webp`,
    `${destDirFront}/${destSmall}.webp`,
    `${destDirFront}/${destVerySmall}.webp`
  );
  // Back
  text += processImage(
    'back',
    'm',
    `../${year}/originals/${back.cardGrid.i}`,
    `${destDirBack}/${destLarge}.webp`,
    `${destDirBack}/${destSmall}.webp`,
    `${destDirBack}/${destVerySmall}.webp`
  );

  await saveTheData('script.cmd', text);
}

async function doTheWork() {
  const cardData = await readCSV(`../${year}/xmas-${year}.csv`);
  await createDirectories();
  await createTheScript(cardData);
  await processSizes(cardData, year, sizesFile, destDirFront, destDirBack);
}

function main() {
  doTheWork();
}

main();
