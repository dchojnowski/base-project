import { SalesRecord } from '../types/salesRecord';

export function normalizeSalesRecords(records: SalesRecord[]): SalesRecord[] {
    return records.map((record) => ({
        ...record,
        channel_name: record.channel_name === '' ? 'unknown' : record.channel_name
    }));
}