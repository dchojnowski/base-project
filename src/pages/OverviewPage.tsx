import { useQuery } from '@tanstack/react-query';
import { fetchSales } from '../data/fetchSales';
import { getInsights, getTotals, groupByChannel, groupByStatus } from '../utils/aggregations';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { ChannelIcon } from '../components/ChannelIcon';
import { ErrorState } from '../components/ErrorState';
import { KpiCard } from '../components/KpiCard';
import { LoadingState } from '../components/LoadingState';

const numberFormatter = new Intl.NumberFormat('en-US');
const salesFormatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 });
const percentFormatter = new Intl.NumberFormat('en-US', { style: 'percent', maximumFractionDigits: 1 });

export function OverviewPage() {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['sales'],
        queryFn: () => fetchSales()
    });

    if (isLoading) {
        return <LoadingState />;
    }

    if (error instanceof Error) {
        return <ErrorState message={error.message} onRetry={() => refetch()} />;
    }

    const totals = getTotals(data ?? []);
    const channels = groupByChannel(data ?? []);
    const statuses = groupByStatus(data ?? []);
    const insights = getInsights(data ?? []);

    return (
        <div className="space-y-8">
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <KpiCard title="Total Sales" value={salesFormatter.format(totals.totalSales)} />
                <KpiCard title="Total Orders" value={numberFormatter.format(totals.totalOrders)} />
                <KpiCard title="Average Order Value" value={salesFormatter.format(totals.aov)} />
                <KpiCard
                    title="Date Range"
                    value={`${totals.minDate} → ${totals.maxDate}`}
                    subtitle={`${totals.daysCount} days`}
                />
            </section>
            <section>
                <Card>
                    <CardHeader>
                        <CardTitle>Insights</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-none space-y-2 text-md text-muted-foreground">
                            {insights.map((insight, index) => {
                                if (insight.type === 'message') {
                                    return <li key={`message-${index}`}>{insight.text}</li>;
                                }

                                if (insight.type === 'top-channel') {
                                    return (
                                        <li className="inline-flex items-center gap-2" key={`top-channel-${insight.channel}`}>
                                            Top sales channel:{' '}
                                            <span className="inline-flex items-center text-black text-sm gap-2">
                                                <ChannelIcon channel={insight.channel} />
                                            </span>{' '}
                                            ({percentFormatter.format(insight.share)} share).
                                        </li>
                                    );
                                }

                                if (insight.type === 'best-day') {
                                    return (
                                        <li key={`best-day-${insight.date}`}>
                                            Best sales day: {insight.date} ({salesFormatter.format(insight.sales)}).
                                        </li>
                                    );
                                }

                                return (
                                    <li key={`best-status-${insight.status ?? index}`}>
                                        Strongest order status:{' '}
                                        {insight.status === null ? 'n/a' : `#${insight.status}`}{' '}
                                        ({salesFormatter.format(insight.sales)}).
                                    </li>
                                );
                            })}
                        </ul>
                    </CardContent>
                </Card>
            </section>
            <section className="grid gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Top Channels</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Channel</TableHead>
                                    <TableHead className="text-right">Sales</TableHead>
                                    <TableHead className="text-right">Orders</TableHead>
                                    <TableHead className="text-right">Share</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {channels.map((channel) => (
                                    <TableRow key={channel.channel}>
                                        <TableCell>
                                            <ChannelIcon channel={channel.channel} />
                                        </TableCell>
                                        <TableCell className="text-right">{salesFormatter.format(channel.sales)}</TableCell>
                                        <TableCell className="text-right">{numberFormatter.format(channel.orders)}</TableCell>
                                        <TableCell className="text-right">{percentFormatter.format(channel.share)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Sales by Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Sales</TableHead>
                                    <TableHead className="text-right">Orders</TableHead>
                                    <TableHead className="text-right">Share</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {statuses.map((status) => (
                                    <TableRow key={status.status}>
                                        <TableCell>
                                            <Badge>#{status.status}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">{salesFormatter.format(status.sales)}</TableCell>
                                        <TableCell className="text-right">{numberFormatter.format(status.orders)}</TableCell>
                                        <TableCell className="text-right">{percentFormatter.format(status.share)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </section>

        </div>
    );
}
