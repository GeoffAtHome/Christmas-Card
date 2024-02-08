import fs from 'fs';
import Papa from 'papaparse';
import { XmasCardData, CardGrid } from '../../src/components/card-type';

interface CsvData {
  ImageName: string;
  Title: string;
  Width: number;
  Height: number;
  X: number;
  Y: number;
  Prefixes: string;
}

export async function readCSV(filename: string) {
  const cardData: XmasCardData = {
    year: 0,
    images: '',
    front: {
      cardGrid: {
        i: '',
        t: ``,
        l: '',
        s: '',
        w: 0,
        h: 0,
        x: 0,
        y: 0,
        d: '',
        m: 0,
        n: 0,
      },
      cardData: [],
    },
    back: {
      cardGrid: {
        i: '',
        t: ``,
        l: '',
        s: '',
        w: 0,
        h: 0,
        x: 0,
        y: 0,
        d: '',
        m: 0,
        n: 0,
      },
      cardData: [],
    },
  };
  try {
    const file = await fs.readFileSync(filename, 'utf8');
    const { data } = Papa.parse<CsvData>(file, {
      header: true,
      dynamicTyping: true,
    });
    let part: 'front' | 'back' | 'grid' | 'blank' = 'grid';
    let thisYear = '';
    let gridFront: CardGrid | undefined;
    let gridBack: CardGrid | undefined;

    for (const row of data) {
      if (row.ImageName === 'Front') part = 'front';
      if (row.ImageName === 'Back') part = 'back';
      if (row.ImageName === '') part = 'blank';
      switch (part) {
        case 'front':
          if (row.ImageName === null || row.ImageName === 'Front') break;
          cardData.front.cardData.push({
            i: Number(row.ImageName), // imageNumber
            x: row.X, // posX
            y: row.Y, // posY
            w: row.Width, // width
            h: row.Height, // height
            t: row.Title, // title
            d: '',
            m: 0,
            n: 0,
          });

          break;

        case 'back':
          if (row.ImageName === null || row.ImageName === 'Back') break;
          cardData.back.cardData.push({
            i: Number(row.ImageName), // imageNumber
            x: row.X, // posX
            y: row.Y, // posY
            w: row.Width, // width
            h: row.Height, // height
            t: row.Title, // title
            d: '',
            m: 0,
            n: 0,
          });

          break;

        case 'grid':
          if (thisYear === '') {
            thisYear = row.Title;
            cardData.year = Number(thisYear);
            cardData.images = `${thisYear}/images`;
            break;
          }
          if (gridFront === undefined) {
            gridFront = {
              i: row.ImageName, // image
              t: row.Title, // title
              l: row.Prefixes, // largeImagePrefix
              s: 's-', // smallImagePrefix
              w: row.Width, // width
              h: row.Height, // height
              x: row.X, // xGrid
              y: row.Y, // yGrid
              d: '',
              m: 0,
              n: 0,
            };
            cardData.front.cardGrid = { ...gridFront! };
            break;
          }

          if (gridBack === undefined) {
            gridBack = {
              i: row.ImageName, // image
              t: row.Title, // title
              l: row.Prefixes, // largeImagePrefix
              s: 's-', // smallImagePrefix
              w: row.Width, // width
              h: row.Height, // height
              x: row.X, // xGrid
              y: row.Y, // yGrid
              d: '',
              m: 0,
              n: 0,
            };
            cardData.back.cardGrid = { ...gridBack! };
            break;
          }
          break;

        case 'blank':
        default:
          break;
      }
    }

    const text = `import { XmasCardData, CardGrid } from '../../src/components/card-type';\n\nexport const cardData = ${JSON.stringify(
      cardData
    )}`;
    // await saveTheData('./src/cardData.ts', text);
  } catch (err: any) {
    console.error(JSON.stringify(err));
  }
  return cardData;
}
