import fs from 'fs';

export async function saveTheData(filename: string, text: string) {
  await fs.writeFile(`./${filename}`, text, err => {
    if (err) {
      // eslint-disable-next-line no-console
      console.error(`Error writing file: ${err}`);
    }
  });
}
