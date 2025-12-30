import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { fetchSales } from '../data/fetchSales';
import { SalesRecord } from '../types/salesRecord';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { ErrorState } from '../components/ErrorState';
import { FiltersBar } from '../components/FiltersBar';
import { LoadingState } from '../components/LoadingState';
import { DataTable } from '../components/DataTable';

const PAGE_SIZE = 20;

export function RecordsPage() {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['sales'],
        queryFn: () => fetchSales()
    });
    const [searchParams, setSearchParams] = useSearchParams();

    const [filters, setFilters] = useState({
        from: searchParams.get('from') ?? '',
        to: searchParams.get('to') ?? '',
        channel: searchParams.get('channel') ?? 'all',
        status: searchParams.get('status') ?? 'all'
    });

    const [sortKey, setSortKey] = useState<'date' | 'sum_sales' | 'count_orders'>('date');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [page, setPage] = useState(1);

    const handleFiltersChange = (next: typeof filters) => {
        setFilters(next);
        setPage(1);
        const params = new URLSearchParams();
        if (next.from) params.set('from', next.from);
        if (next.to) params.set('to', next.to);
        if (next.channel && next.channel !== 'all') params.set('channel', next.channel);
        if (next.status && next.status !== 'all') params.set('status', next.status);
        setSearchParams(params, { replace: true });
    };

    const channelOptions = useMemo(() => {
        const unique = new Set<string>();
        (data ?? []).forEach((record) => unique.add(record.channel_name));
        return Array.from(unique).sort();
    }, [data]);

    const statusOptions = useMemo(() => {
        const unique = new Set<number>();
        (data ?? []).forEach((record) => unique.add(record.order_status_id));
        return Array.from(unique).sort((a, b) => a - b);
    }, [data]);

    const filteredRecords = useMemo(() => {
        const records = (data ?? []).filter((record) => matchesFilters(record, filters));
        records.sort((a, b) => {
            const direction = sortDirection === 'asc' ? 1 : -1;
            if (sortKey === 'date') {
                return a.date > b.date ? direction : -direction;
            }
            if (sortKey === 'sum_sales') {
                return (a.sum_sales - b.sum_sales) * direction;
            }
            return (a.count_orders - b.count_orders) * direction;
        });
        return records;
    }, [data, filters, sortKey, sortDirection]);

    const totalPages = Math.max(1, Math.ceil(filteredRecords.length / PAGE_SIZE));
    const pageRecords = filteredRecords.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const handleSortChange = (key: typeof sortKey) => {
        if (key === sortKey) {
            setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
            return;
        }
        setSortKey(key);
        setSortDirection('desc');
    };

    if (isLoading) {
        return <LoadingState />;
    }

    if (error instanceof Error) {
        return <ErrorState message={error.message} onRetry={() => refetch()} />;
    }

    return (
        <div className="space-y-6">
            <FiltersBar
                from={filters.from}
                to={filters.to}
                channel={filters.channel}
                status={filters.status}
                channelOptions={channelOptions}
                statusOptions={statusOptions}
                onChange={handleFiltersChange}
            />

            <Card>
                <CardContent className="pt-6">
                    {pageRecords.length === 0 ? (
                        <div className="rounded-md border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                            No records match the selected filters.
                        </div>
                    ) : (
                        <DataTable
                            records={pageRecords}
                            sortKey={sortKey}
                            sortDirection={sortDirection}
                            onSortChange={handleSortChange}
                        />
                    )}
                </CardContent>
            </Card>

            <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
                <p className="text-sm text-muted-foreground">
                    Page {page} of {totalPages} ({filteredRecords.length} records)
                </p>
                <div className="flex gap-2">
                    <Button type="button" disabled={page <= 1} onClick={() => setPage((prev) => Math.max(1, prev - 1))}>
                        Prev
                    </Button>
                    <Button
                        type="button"
                        disabled={page >= totalPages}
                        onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}

function matchesFilters(record: SalesRecord, filters: { from: string; to: string; channel: string; status: string }) {
    if (filters.from && record.date < filters.from) return false;
    if (filters.to && record.date > filters.to) return false;
    if (filters.channel !== 'all' && record.channel_name !== filters.channel) return false;
    if (filters.status !== 'all' && String(record.order_status_id) !== filters.status) return false;
    return true;
}
