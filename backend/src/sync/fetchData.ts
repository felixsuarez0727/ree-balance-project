import fetch, { Response } from 'node-fetch';

export interface EnergyApiResponse {
  included: any[]; 
}

export type FetchFunction = (url: string) => Promise<Response>;

export const wait = async (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export async function fetchData(
  startDate: Date, 
  endDate: Date, 
  options = {
    fetchFn: fetch as FetchFunction, 
    waitFn: wait,
    reeUri: process.env.REE_URI
  }
): Promise<EnergyApiResponse> {
  const start = startDate.toISOString().slice(0, 16); 
  const end = endDate.toISOString().slice(0, 16);   

  const url = options.reeUri?.replace("{start}", start).replace("{end}", end) || "";

  let attempts = 0;
  const maxAttempts = 4;

  while (attempts < maxAttempts) {
    try {
      console.log(`🚀 Fetching data from ${url}`);
      const response = await options.fetchFn(url);

      if (!response.ok) {
        throw new Error(`❌ API responded with status ${response.status}`);
      }

      const data = await response.json() as EnergyApiResponse;

      return data;
    } catch (error) {
      attempts++;
      if (attempts >= maxAttempts) {
        throw new Error('❌ Failed to fetch data after multiple attempts.');
      }
      
      const delay = Math.pow(2, attempts) * 1000;
      console.warn(`⚠️ Attempt ${attempts} failed. Retrying in ${delay / 1000} seconds...`);
      await options.waitFn(delay);
    }
  }

  throw new Error('❌ Failed to fetch data after multiple attempts.');
}