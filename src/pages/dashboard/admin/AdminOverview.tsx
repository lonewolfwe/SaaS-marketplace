import { DollarSign, Users, Package, Activity, TrendingUp, Server, CreditCard, RefreshCw } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { API_URL } from '@/config';
import { Link } from 'react-router-dom';

interface DashboardStats {
    users: {
        totalUsers: number;
        totalSellers: number;
        activeUsers: number;
    };
    revenue: {
        total: number;
        mrr: number;
        activeSubs: number;
    };
    listings: {
        total: number;
        pending: number;
        approved: number;
        rejected: number;
    };
}

interface ActivityItem {
    id: string;
    type: string;
    message: string;
    time: string;
}

interface ChartData {
    name: string;
    date: string;
    value: number;
}

interface ApiResponse<T> {
    status: string;
    data: T;
}

export default function AdminOverview() {
    const { token } = useAuth();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [activity, setActivity] = useState<ActivityItem[]>([]);
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = useCallback(async () => {
        if (!token) return;
        setIsLoading(true);
        try {
            // Fetch Overview Stats
            const statsRes = await fetch(`${API_URL}/admin/stats/overview`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const statsData = await statsRes.json() as ApiResponse<DashboardStats>;
            if (statsData.status === 'success') {
                setStats(statsData.data);
            }

            // Fetch Activity Feed
            const activityRes = await fetch(`${API_URL}/admin/activity`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const activityData = await activityRes.json() as ApiResponse<{ activity: ActivityItem[] }>;
            if (activityData.status === 'success') {
                // Transform date to time string
                const formattedActivity = activityData.data.activity.map((item: ActivityItem) => ({
                    ...item,
                    time: new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }));
                setActivity(formattedActivity);
            }

            // Fetch Chart Data
            const chartRes = await fetch(`${API_URL}/admin/analytics/charts`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const chartDataRes = await chartRes.json() as ApiResponse<{ revenueOverTime: ChartData[] }>;
            if (chartDataRes.status === 'success') {
                setChartData(chartDataRes.data.revenueOverTime);
            }

        } catch (err) {
            console.error("Failed to fetch admin dashboard data", err);
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchData();
    }, [token, fetchData]);

    return (
        <div className="space-y-6 font-sans text-sm animate-fade-in">
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-foreground text-background flex items-center justify-center rounded font-bold">
                        AD
                    </div>
                    <div>
                        <h2 className="font-bold text-lg leading-none">Admin Console</h2>
                        <p className="text-xs text-muted-foreground font-mono mt-0.5">v2.4.0 • System Operational</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-xs font-mono text-green-600 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                        <Activity className="h-3 w-3" />
                        <span>ALL SYSTEMS NORMAL</span>
                    </div>
                    <Button variant="outline" size="sm" className="h-8 text-xs bg-background" onClick={fetchData}>
                        <RefreshCw className={`h-3 w-3 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-4 gap-4">
                <Card className="rounded-sm shadow-none border border-border">
                    <CardHeader className="p-4 pb-2">
                        <div className="flex justify-between items-start">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Total Revenue</span>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-bold font-mono tracking-tight">
                            ${stats?.revenue.total.toLocaleString() ?? '0'}
                        </div>
                        <div className="text-[10px] mt-1 font-medium text-green-600">
                            Lifetime
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-sm shadow-none border border-border">
                    <CardHeader className="p-4 pb-2">
                        <div className="flex justify-between items-start">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Active Users</span>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-bold font-mono tracking-tight">
                            {stats?.users.activeUsers.toLocaleString() ?? '0'}
                        </div>
                        <div className="text-[10px] mt-1 font-medium text-muted-foreground">
                            of {stats?.users.totalUsers.toLocaleString() ?? '0'} Total
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-sm shadow-none border border-border">
                    <CardHeader className="p-4 pb-2">
                        <div className="flex justify-between items-start">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">MRR</span>
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-bold font-mono tracking-tight">
                            ${stats?.revenue.mrr.toLocaleString() ?? '0'}
                        </div>
                        <div className="text-[10px] mt-1 font-medium text-muted-foreground">
                            {stats?.revenue.activeSubs.toLocaleString() ?? '0'} Active Subs
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-sm shadow-none border border-border">
                    <CardHeader className="p-4 pb-2">
                        <div className="flex justify-between items-start">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Listings</span>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-bold font-mono tracking-tight">
                            {stats?.listings.total.toLocaleString() ?? '0'}
                        </div>
                        <div className="text-[10px] mt-1 font-medium text-muted-foreground">
                            {stats?.listings.pending ?? 0} Pending Review
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-3 gap-6">
                {/* Main Chart */}
                <Card className="col-span-2 rounded-sm border-border shadow-none">
                    <CardHeader className="border-b border-border/40 p-4 py-3 bg-muted/10">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-xs font-semibold uppercase tracking-wider flex items-center gap-2">
                                <TrendingUp className="h-3 w-3" /> Revenue Velocity
                            </CardTitle>
                            <div className="flex gap-2">
                                <span className="text-[10px] bg-background border px-2 py-0.5 rounded text-muted-foreground">7D</span>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0 h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="adminChart" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(var(--foreground))" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="hsl(var(--foreground))" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} dx={-10} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', fontSize: '11px', borderRadius: '0px' }}
                                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                                />
                                <Area type="step" dataKey="value" stroke="hsl(var(--foreground))" strokeWidth={1} fill="url(#adminChart)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* System Activity Log */}
                <Card className="col-span-1 rounded-sm border-border shadow-none bg-background">
                    <CardHeader className="border-b border-border/40 p-4 py-3 bg-muted/10">
                        <CardTitle className="text-xs font-semibold uppercase tracking-wider flex items-center gap-2">
                            <Server className="h-3 w-3" /> Recent Activity
                        </CardTitle>
                    </CardHeader>
                    <div className="divide-y divide-border/40 text-xs font-mono h-[300px] overflow-auto">
                        {activity.length === 0 ? (
                            <div className="p-4 text-center text-muted-foreground">No recent activity</div>
                        ) : (
                            activity.map((log) => (
                                <div key={log.id} className="p-3 hover:bg-muted/20 transition-colors flex items-start gap-3">
                                    <div className={`mt-0.5 h-2 w-2 rounded-full shrink-0 ${log.type.includes('create') ? 'bg-green-500' :
                                        log.type.includes('error') ? 'bg-red-500' : 'bg-blue-500'
                                        }`} />
                                    <div>
                                        <div className="font-bold flex justify-between w-full gap-4">
                                            <span>[{log.time}] {log.type}</span>
                                        </div>
                                        <div className="text-muted-foreground mt-0.5">
                                            {log.message}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </Card>
            </div>

            {/* Quick Mod Queue */}
            <Card className="rounded-sm border-border shadow-none">
                <CardHeader className="border-b border-border/40 p-4 py-3 bg-muted/10 flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-xs font-semibold uppercase tracking-wider">Moderation Queue</CardTitle>
                    {stats?.listings.pending ? (
                        <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded font-bold">{stats.listings.pending} PENDING</span>
                    ) : (
                        <span className="text-[10px] bg-green-100 text-green-600 px-2 py-0.5 rounded font-bold">ALL CLEAR</span>
                    )}
                </CardHeader>
                <div className="p-4">
                    {stats?.listings.pending ? (
                        <div className="flex flex-col gap-2 items-center justify-center p-4">
                            <p className="text-sm text-muted-foreground mb-2">There are listings waiting for approval.</p>
                            <Link to="/dashboard/admin/moderation">
                                <Button size="sm">Go to Moderation</Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="p-8 text-center text-xs text-muted-foreground italic">
                            No listings requiring immediate review.
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}
