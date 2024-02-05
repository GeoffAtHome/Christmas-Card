// https://www.codespeedy.com/display-an-image-from-base64-code-in-html/
// magick identify -format "%wx%h"  ../2023/originals/O-15.jpg

import fs from 'fs';
import { Card2023, year } from '../../2023/xmas-2023';

const frontPrefix = 'O-';
const backPrefix = 'B-';
const sizesFile = 'sizes.txt';

async function saveTheData(filename: string, text: string) {
  await fs.writeFile(`./${filename}`, text, err => {
    if (err) {
      // eslint-disable-next-line no-console
      console.error(`Error writing file: ${err}`);
    }
  });
}

async function createTheScript() {
  const data = Card2023;
  const { front } = data!;
  const { back } = data!;
  let text = `del ${sizesFile}\n`;
  front.cardData.forEach(card => {
    const sourceImage = `../${year}/originals/${frontPrefix}${card.i}.jpg`;
    const lSize = '1024x1024';
    const sSize = '320x320';
    text = `${text}magick ${sourceImage} -resize ${lSize} ../${year}/ximages/${front.cardGrid.l}${card.i}.webp\n`;
    text = `${text}magick ${sourceImage} -resize ${sSize} ../${year}/ximages/${front.cardGrid.s}${card.i}.webp\n`;
    text = `${text}magick ${sourceImage} -resize 400@ ../${year}/ximages/fp-${card.i}.webp\n`;
    text = `${text}magick identify -format "${back.cardGrid.s}${card.i}.webp: %%wx%%h" ../${year}/ximages/${front.cardGrid.l}${card.i}.webp >>${sizesFile}\n`;
    text = `${text}echo: >>${sizesFile}\n`;
    text = `${text}magick identify -format "${back.cardGrid.s}${card.i}.webp: %%wx%%h" ../${year}/ximages/${front.cardGrid.s}${card.i}.webp >>${sizesFile}\n`;
    text = `${text}echo: >>${sizesFile}\n`;
  });

  back.cardData.forEach(card => {
    const lSize = '1024x1024';
    const sSize = '320x320';
    text = `${text}magick ../${year}/originals/${backPrefix}${card.i}.jpg -resize ${lSize} ../${year}/ximages/${back.cardGrid.l}${card.i}.webp\n`;
    text = `${text}magick ../${year}/originals/${backPrefix}${card.i}.jpg -resize ${sSize} ../${year}/ximages/${back.cardGrid.s}${card.i}.webp\n`;
    text = `${text}magick ../${year}/originals/${backPrefix}${card.i}.jpg -resize 400@ ../${year}/ximages/bp-${card.i}.webp\n`;
    text = `${text}magick identify -format "${back.cardGrid.s}${card.i}.webp: %%wx%%h" ../${year}/ximages/${back.cardGrid.l}${card.i}.webp >>${sizesFile}\n`;
    text = `${text}echo: >>${sizesFile}\n`;
    text = `${text}magick identify -format "${back.cardGrid.s}${card.i}.webp: %%wx%%h" ../${year}/ximages/${back.cardGrid.s}${card.i}.webp >>${sizesFile}\n`;
    text = `${text}echo: >>${sizesFile}\n`;
  });
  await saveTheData('script.cmd', text);
}

async function doTheWork() {
  const data = Card2023;
  await saveTheData('file.json', JSON.stringify(data));
  await createTheScript();
}

function main() {
  doTheWork();
}

main();
