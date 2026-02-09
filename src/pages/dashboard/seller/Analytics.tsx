import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { API_URL } from '@/config';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { DollarSign, TrendingUp, Users, ShoppingCart } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';

// Manual simple chart component since we are avoiding big libs for now
const SimpleBarChart = ({ data, color = "bg-primary" }: { data: number[], color?: string }) => {
    const max = Math.max(...data, 1);
    return (
        <div className="h-40 flex items-end gap-2 w-full pt-4">
            {data.map((val, i) => (
                <div key={i} className="flex-1 flex flex-col justify-end group relative">
                    <div
                        className={`w-full rounded-t-sm ${color} opacity-80 hover:opacity-100 transition-all`}
                        style={{ height: `${(val / max) * 100}%` }}
                    ></div>
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow pointer-events-none whitespace-nowrap">
                        {val}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default function SellerAnalytics() {
    const { token } = useAuth();
    const [stats, setStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            if (!token) return;
            try {
                // Fetch actual stats - reusing existing endpoints
                const [revRes, subRes] = await Promise.all([
                    fetch(`${API_URL}/orders/revenue-stats`, { headers: { 'Authorization': `Bearer ${token}` } }),
                    fetch(`${API_URL}/subscriptions/seller-stats`, { headers: { 'Authorization': `Bearer ${token}` } })
                ]);
                const revData = await revRes.json();
                const subData = await subRes.json();

                setStats({
                    revenue: revData.data?.stats?.totalRevenue || 0,
                    orders: revData.data?.stats?.totalOrders || 0,
                    avgOrderValue: revData.data?.stats?.avgOrderValue || 0,
                    mrr: subData.data?.stats?.mrr || 0,
                    activeSubscribers: subData.data?.stats?.activeSubscribers || 0,
                    // Mock trend data for visualization since we don't have historical timeline API yet
                    monthlyRevenue: [450, 670, 890, 1200, 1100, 1350, 1500, 1400, 1600, 1800, 2100, revData.data?.stats?.totalRevenue || 2200],
                    dailyOrders: [2, 4, 1, 5, 3, 6, 2, 8, 4, 5, 3, 7, 5, 6]
                });

            } catch (err) {
                console.error("Failed to load analytics", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, [token]);

    if (isLoading) {
        return <div className="space-y-6"><Skeleton className="h-64 w-full" /><div className="grid grid-cols-2 gap-6"><Skeleton className="h-32" /><Skeleton className="h-32" /></div></div>;
    }

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            {/* Header */}
            <div>
                <h2 className="font-display font-bold text-3xl tracking-tight leading-none mb-2">Analytics</h2>
                <p className="text-muted-foreground">Deep dive into your revenue and performance metrics.</p>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-6 md:grid-cols-4">
                <Card className="rounded-xl shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${stats.revenue.toLocaleString()}</div>
                    </CardContent>
                </Card>
                <Card className="rounded-xl shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase">MRR</CardTitle>
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${stats.mrr.toLocaleString()}</div>
                    </CardContent>
                </Card>
                <Card className="rounded-xl shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Avg Order Value</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${stats.avgOrderValue.toFixed(2)}</div>
                    </CardContent>
                </Card>
                <Card className="rounded-xl shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Active Subs</CardTitle>
                        <Users className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.activeSubscribers}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Section */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card className="rounded-xl shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg">Revenue Growth (Last 12 Months)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="border border-border/50 rounded-lg p-4 bg-secondary/5">
                            <SimpleBarChart data={stats.monthlyRevenue} color="bg-green-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-xl shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg">Order Volume (Last 14 Days)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="border border-border/50 rounded-lg p-4 bg-secondary/5">
                            <SimpleBarChart data={stats.dailyOrders} color="bg-blue-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="rounded-xl shadow-sm border-yellow-200 bg-yellow-50/30">
                <CardContent className="p-6">
                    <h3 className="font-bold text-yellow-800 mb-2">Detailed Reports</h3>
                    <p className="text-sm text-yellow-800/80">Exportable CSV reports with granular transaction data will be available in the next update.</p>
                </CardContent>
            </Card>
        </div>
    );
}
