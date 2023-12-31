import { XmasCardData } from './card-type';

// Define an async function to read the file
export async function readFile(year: string) {
  const filename = `${year}/${year}.json`;
  const x = await fetch(filename);
  if (!x.ok) return {};

  const y = await x.text();
  return JSON.parse(y) as XmasCardData;
}
