import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select } from '../components/ui/select';
import { getChannelInfo } from './ChannelIcon';

type FiltersBarProps = {
    from: string;
    to: string;
    channel: string;
    status: string;
    channelOptions: string[];
    statusOptions: number[];
    onChange: (next: { from: string; to: string; channel: string; status: string }) => void;
};

export function FiltersBar({
    from,
    to,
    channel,
    status,
    channelOptions,
    statusOptions,
    onChange
}: FiltersBarProps) {
    const formatChannelOption = (option: string) => {
        if (option === 'unknown') {
            return '(no channel)';
        }

        const info = getChannelInfo(option);
        return info ? info.label : option;
    };

    return (
        <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 lg:flex-row lg:items-end">
            <div className="flex flex-1 flex-col gap-1">
                <label className="text-xs font-medium text-muted-foreground">From</label>
                <Input
                    type="date"
                    value={from}
                    onChange={(event) => onChange({ from: event.target.value, to, channel, status })}
                />
            </div>
            <div className="flex flex-1 flex-col gap-1">
                <label className="text-xs font-medium text-muted-foreground">To</label>
                <Input
                    type="date"
                    value={to}
                    onChange={(event) => onChange({ from, to: event.target.value, channel, status })}
                />
            </div>
            <div className="flex flex-1 flex-col gap-1">
                <label className="text-xs font-medium text-muted-foreground">Channel</label>
                <Select value={channel} onChange={(event) => onChange({ from, to, channel: event.target.value, status })}>
                    <option value="all">All channels</option>
                    {channelOptions.map((option) => (
                        <option key={option} value={option}>
                            {formatChannelOption(option)}
                        </option>
                    ))}
                </Select>
            </div>
            <div className="flex flex-1 flex-col gap-1">
                <label className="text-xs font-medium text-muted-foreground">Status</label>
                <Select value={status} onChange={(event) => onChange({ from, to, channel, status: event.target.value })}>
                    <option value="all">All statuses</option>
                    {statusOptions.map((option) => (
                        <option key={option} value={String(option)}>
                            {option}
                        </option>
                    ))}
                </Select>
            </div>
            <div className="flex">
                <Button
                    type="button"
                    className="w-full lg:w-auto"
                    onClick={() => onChange({ from: '', to: '', channel: 'all', status: 'all' })}
                >
                    Reset filters
                </Button>
            </div>
        </div>
    );
}
