// https://www.codespeedy.com/display-an-image-from-base64-code-in-html/
// magick identify -format "%wx%h"  ../2023/originals/O-15.jpg

import fs from 'fs';
import { XmasCardData } from '../../src/components/card-type';
import { readCSV } from './readCSV';
import { saveTheData } from './saveTheData';
import { processSizes } from './readSizes';

const frontPrefix = 'O-';
const backPrefix = 'B-';
const sizesFile = 'sizes.txt';
const lSize = '1024x1024';
const sSize = '320x320';
const wSize = '80@';
const destDir = 'ximages';

function processImage(
  tagImage: string,
  sourceImage: string,
  destImageL: string,
  destImageS: string,
  destImageW: string
) {
  let text = `magick ${sourceImage} -resize ${lSize} ${destImageL}\n`;
  text += `magick ${sourceImage} -resize ${sSize} ${destImageS}\n`;
  text += `magick ${sourceImage} -resize ${wSize} ${destImageW}\n`;
  text += `magick identify -format "${tagImage},%%w,%%h" ${destImageL} >>${sizesFile}\n`;
  text += `echo: >>${sizesFile}\n`;

  return text;
}

async function createTheScript(data: XmasCardData) {
  const { front } = data!;
  const { back } = data!;
  const { year } = data!;
  let text = `del ${sizesFile}\n`;
  // Write header
  text += `echo tag,width,height>>${sizesFile}\n`;
  front.cardData.forEach(card => {
    const sourceImage = fs.existsSync(
      `../${year}/originals/${frontPrefix}${card.i}.jpg`
    )
      ? `../${year}/originals/${frontPrefix}${card.i}.jpg`
      : `../${year}/originals/${frontPrefix}${card.i}.png`;

    const tagImage = `l-${card.i}`;
    const destImageL = `../${year}/${destDir}/l-${card.i}.webp`;
    const destImageS = `../${year}/${destDir}/s-${card.i}.webp`;
    const destImageW = `../${year}/${destDir}/t-${card.i}.webp`;
    text += processImage(
      tagImage,
      sourceImage,
      destImageL,
      destImageS,
      destImageW
    );
  });

  back.cardData.forEach(card => {
    const sourceImage = fs.existsSync(
      `../${year}/originals/${backPrefix}${card.i}.jpg`
    )
      ? `../${year}/originals/${backPrefix}${card.i}.jpg`
      : `../${year}/originals/${backPrefix}${card.i}.png`;

    const tagImage = `b-${card.i}`;
    const destImageL = `../${year}/${destDir}/b-${card.i}.webp`;
    const destImageS = `../${year}/${destDir}/c-${card.i}.webp`;
    const destImageW = `../${year}/${destDir}/d-${card.i}.webp`;
    text += processImage(
      tagImage,
      sourceImage,
      destImageL,
      destImageS,
      destImageW
    );
  });

  // Front
  text += processImage(
    front.cardGrid.i,
    `../${year}/originals/${front.cardGrid.i}`,
    `../${year}/${destDir}/a-${front.cardGrid.i}.webp`,
    `../${year}/${destDir}/b-${front.cardGrid.i}.webp`,
    `../${year}/${destDir}/c-${front.cardGrid.i}.webp`
  );
  // Back
  text += processImage(
    back.cardGrid.i,
    `../${year}/originals/${back.cardGrid.i}`,
    `../${year}/${destDir}/a-${back.cardGrid.i}.webp`,
    `../${year}/${destDir}/b-${back.cardGrid.i}.webp`,
    `../${year}/${destDir}/c-${back.cardGrid.i}.webp`
  );

  await saveTheData('script.cmd', text);
}

async function doTheWork() {
  const cardData = await readCSV('D:/demos/Christmas-Card/2023/xmas-2023.csv');
  await saveTheData('file.json', JSON.stringify(cardData));
  await createTheScript(cardData);
  await processSizes(destDir);
}

function main() {
  doTheWork();
}

main();
