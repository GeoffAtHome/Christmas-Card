import fs from 'fs';
import { Card2023 } from './xmas-2023';

async function saveTheData(filename: string, text: string) {
  console.log('save the data');
  await fs.writeFile(`./${filename}`, text, err => {
    console.log('writing');
    if (err) {
      console.log(`Error writing file: ${err}`);
    }
  });
}

async function doTheWork() {
  const data = Card2023;
  await saveTheData('file.json', JSON.stringify(data));
}

function main() {
  console.log('Start');
  doTheWork();
}

main();
