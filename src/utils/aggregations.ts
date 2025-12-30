import { SalesRecord } from '../types/salesRecord';

type Totals = {
    totalSales: number;
    totalOrders: number;
    aov: number;
    minDate: string;
    maxDate: string;
    daysCount: number;
};

export function getTotals(records: SalesRecord[]): Totals {
    if (records.length === 0) {
        return {
            totalSales: 0,
            totalOrders: 0,
            aov: 0,
            minDate: '-',
            maxDate: '-',
            daysCount: 0
        };
    }

    const totalSales = records.reduce((sum, record) => sum + record.sum_sales, 0);
    const totalOrders = records.reduce((sum, record) => sum + record.count_orders, 0);
    const dates = records.map((record) => record.date).sort();
    const minDate = dates[0];
    const maxDate = dates[dates.length - 1];
    const min = new Date(minDate);
    const max = new Date(maxDate);
    const daysCount = Math.max(1, Math.round((max.getTime() - min.getTime()) / 86400000) + 1);

    return {
        totalSales,
        totalOrders,
        aov: totalOrders === 0 ? 0 : totalSales / totalOrders,
        minDate,
        maxDate,
        daysCount
    };
}

export function groupByDate(records: SalesRecord[]) {
    const map = new Map<string, { date: string; sales: number; orders: number }>();
    records.forEach((record) => {
        const existing = map.get(record.date) ?? { date: record.date, sales: 0, orders: 0 };
        existing.sales += record.sum_sales;
        existing.orders += record.count_orders;
        map.set(record.date, existing);
    });

    return Array.from(map.values())
        .sort((a, b) => (a.date > b.date ? 1 : -1))
        .map((item) => ({
            ...item,
            aov: item.orders === 0 ? 0 : item.sales / item.orders
        }));
}

export function groupByChannel(records: SalesRecord[]) {
    const map = new Map<string, { channel: string; sales: number; orders: number }>();
    records.forEach((record) => {
        const channel = record.channel_name || 'unknown';
        const existing = map.get(channel) ?? { channel, sales: 0, orders: 0 };
        existing.sales += record.sum_sales;
        existing.orders += record.count_orders;
        map.set(channel, existing);
    });

    const totalSales = records.reduce((sum, record) => sum + record.sum_sales, 0);
    return Array.from(map.values())
        .map((item) => ({
            ...item,
            share: totalSales === 0 ? 0 : item.sales / totalSales
        }))
        .sort((a, b) => b.sales - a.sales);
}

export function groupByStatus(records: SalesRecord[]) {
    const map = new Map<number, { status: number; sales: number; orders: number }>();
    records.forEach((record) => {
        const existing = map.get(record.order_status_id) ?? {
            status: record.order_status_id,
            sales: 0,
            orders: 0
        };
        existing.sales += record.sum_sales;
        existing.orders += record.count_orders;
        map.set(record.order_status_id, existing);
    });

    const totalSales = records.reduce((sum, record) => sum + record.sum_sales, 0);
    return Array.from(map.values())
        .map((item) => ({
            ...item,
            share: totalSales === 0 ? 0 : item.sales / totalSales
        }))
        .sort((a, b) => b.sales - a.sales);
}

export type Insight =
    | { type: 'message'; text: string }
    | { type: 'top-channel'; channel: string; share: number }
    | { type: 'best-day'; date: string; sales: number }
    | { type: 'best-status'; status: number | null; sales: number };

export function getInsights(records: SalesRecord[]): Insight[] {
    if (records.length === 0) {
        return [
            { type: 'message', text: 'No data available for analysis.' },
            { type: 'message', text: 'Add more sales records to get insights.' },
            { type: 'message', text: 'Metrics will appear after import.' }
        ];
    }

    const channels = groupByChannel(records);
    const statuses = groupByStatus(records);
    const byDate = groupByDate(records);
    const topChannel = channels[0];
    const bestDay = [...byDate].sort((a, b) => b.sales - a.sales)[0];
    const bestStatus = statuses[0];

    return [
        { type: 'top-channel', channel: topChannel?.channel ?? 'unknown', share: topChannel?.share ?? 0 },
        { type: 'best-day', date: bestDay?.date ?? 'n/a', sales: bestDay?.sales ?? 0 },
        { type: 'best-status', status: bestStatus?.status ?? null, sales: bestStatus?.sales ?? 0 }
    ];
}
