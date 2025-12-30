import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

type KpiCardProps = {
    title: string;
    value: string;
    subtitle?: string;
};

export function KpiCard({ title, value, subtitle }: KpiCardProps) {
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-semibold">{value}</div>
                {subtitle ? <p className="mt-2 text-xs text-muted-foreground">{subtitle}</p> : null}
            </CardContent>
        </Card>
    );
}