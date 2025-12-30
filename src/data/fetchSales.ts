import salesData from './sales.json';
import { normalizeSalesRecords } from '../utils/normalize';
import { SalesRecord } from '../types/salesRecord';

export async function fetchSales(shouldFail = false): Promise<SalesRecord[]> {
  const delay = 2000 + Math.round(Math.random() * 300);

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail || Math.random() < 0.01) {
        reject(new Error('Failed to fetch sales data.'));
        return;
      }

      const normalized = normalizeSalesRecords(salesData as SalesRecord[]);
      resolve(normalized);
    }, delay);
  });
}
