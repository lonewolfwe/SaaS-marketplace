import { type LucideIcon } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface AdminStatsCardProps {
    title: string;
    value: string;
    icon: LucideIcon;
    change?: string;
    trend?: 'up' | 'down' | 'neutral';
}

export default function AdminStatsCard({ title, value, icon: Icon, change, trend = 'neutral' }: AdminStatsCardProps) {
    return (
        <div className="rounded-xl border border-border bg-card text-card-foreground shadow-sm">
            <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="tracking-tight text-sm font-medium text-muted-foreground">{title}</h3>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="p-6 pt-0">
                <div className="text-2xl font-bold">{value}</div>
                {change && (
                    <p className={cn(
                        "text-xs mt-1",
                        trend === 'up' ? "text-green-600" : trend === 'down' ? "text-red-600" : "text-muted-foreground"
                    )}>
                        {change}
                    </p>
                )}
            </div>
        </div>
    );
}
