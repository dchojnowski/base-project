import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

type ErrorStateProps = {
    title?: string;
    message: string;
    onRetry: () => void;
};

export function ErrorState({ title = 'Something went wrong', message, onRetry }: ErrorStateProps) {
    return (
        <Card className="border-destructive/40">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <p className="text-sm text-muted-foreground">{message}</p>
                <div>
                    <Button onClick={onRetry}>Retry</Button>
                </div>
            </CardContent>
        </Card>
    );
}
