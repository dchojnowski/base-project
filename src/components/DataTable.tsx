import { SalesRecord } from '../types/salesRecord';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { ChannelIcon } from './ChannelIcon';

type SortKey = 'date' | 'sum_sales' | 'count_orders';

type DataTableProps = {
    records: SalesRecord[];
    sortKey: SortKey;
    sortDirection: 'asc' | 'desc';
    onSortChange: (key: SortKey) => void;
};

const numberFormatter = new Intl.NumberFormat('en-US');
const salesFormatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 });

export function DataTable({ records, sortKey, sortDirection, onSortChange }: DataTableProps) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>
                        <button type="button" className="font-medium" onClick={() => onSortChange('date')}>
                            Date {sortKey === 'date' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                        </button>
                    </TableHead>
                    <TableHead>Channel</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">
                        <button type="button" className="font-medium" onClick={() => onSortChange('sum_sales')}>
                            Sales {sortKey === 'sum_sales' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                        </button>
                    </TableHead>
                    <TableHead className="text-right">
                        <button type="button" className="font-medium" onClick={() => onSortChange('count_orders')}>
                            Orders {sortKey === 'count_orders' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                        </button>
                    </TableHead>
                    <TableHead className="text-right">Average Order Value</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {records.map((record) => (
                    <TableRow key={`${record.date}-${record.channel_name}-${record.order_status_id}`}>
                        <TableCell className="font-medium">{record.date}</TableCell>
                        <TableCell>
                            <ChannelIcon channel={record.channel_name} />
                        </TableCell>
                        <TableCell>
                            <Badge>#{record.order_status_id}</Badge>
                        </TableCell>
                        <TableCell className="text-right">{salesFormatter.format(record.sum_sales)}</TableCell>
                        <TableCell className="text-right">{numberFormatter.format(record.count_orders)}</TableCell>
                        <TableCell className="text-right">
                            {record.count_orders === 0
                                ? salesFormatter.format(0)
                                : salesFormatter.format(record.sum_sales / record.count_orders)}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
