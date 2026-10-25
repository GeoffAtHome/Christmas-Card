import { XmasCardData } from './card-type';

export async function readFile(year: string): Promise<XmasCardData> {
  const filename = `${encodeURIComponent(year)}/${encodeURIComponent(year)}.json`;

  try {
    const response = await fetch(filename, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Failed to load Christmas data for ${year}: ${response.status}`);
    }

    const text = await response.text();
    const parsed = JSON.parse(text) as XmasCardData;

    if (!parsed || typeof parsed !== 'object') {
      throw new Error(`Invalid Christmas data format for ${year}`);
    }

    return parsed;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Unable to read data for ${year}: ${message}`);
  }
}
