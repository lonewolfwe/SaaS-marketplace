import { useState, useEffect, useCallback } from 'react';
import { Search, Download, ArrowUpRight, DollarSign, Calendar, CreditCard, RefreshCw } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { Button } from '@/components/ui/Button';
import AdminStatsCard from '../../../components/dashboard/admin/AdminStatsCard';
import { useAuth } from '@/context/AuthContext';
import { API_URL } from '@/config';

interface Order {
    _id: string;
    buyerId: {
        profile: {
            firstName: string;
            lastName: string;
            avatarUrl: string;
        };
    };
    amount: number;
    status: string;
    type: string;
    createdAt: string;
    // ...other fields if needed
}

export default function AdminOrders() {
    const { token } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchOrders = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${API_URL}/orders`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.status === 'success') {
                setOrders(data.data.orders);
            }
        } catch (err) {
            console.error("Failed to fetch orders", err);
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (token) fetchOrders();
    }, [token, fetchOrders]);

    const filteredOrders = orders.filter(order => {
        const name = order.buyerId?.profile?.firstName + ' ' + order.buyerId?.profile?.lastName;
        return name.toLowerCase().includes(search.toLowerCase()) ||
            order._id.toLowerCase().includes(search.toLowerCase());
    });

    const stats = {
        totalRevenue: orders.reduce((acc, order) => order.status === 'completed' ? acc + order.amount : acc, 0),
        avgOrderValue: orders.length > 0 ? (orders.reduce((acc, order) => order.status === 'completed' ? acc + order.amount : acc, 0) / orders.filter(o => o.status === 'completed').length) || 0 : 0,
        refundRate: orders.length > 0 ? ((orders.filter(o => o.status === 'refunded').length / orders.length) * 100).toFixed(1) : '0'
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Orders & Transactions</h2>
                    <p className="text-muted-foreground">Monitor platform revenue and transaction history.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={fetchOrders} className="h-9 px-4 gap-2">
                        <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </Button>
                    <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 gap-2">
                        <Calendar className="h-4 w-4" /> Date Range
                    </button>
                    <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 gap-2">
                        <Download className="h-4 w-4" /> Export CSV
                    </button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <AdminStatsCard title="Total Revenue" value={`$${stats.totalRevenue.toLocaleString()}`} icon={DollarSign} change="+12.5% this month" trend="up" />
                <AdminStatsCard title="Avg. Order Value" value={`$${stats.avgOrderValue.toFixed(2)}`} icon={CreditCard} change="+$2.00 from last month" trend="up" />
                <AdminStatsCard title="Refund Rate" value={`${stats.refundRate}%`} icon={ArrowUpRight} change="-0.5% improvement" trend="up" />
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search orders, users, items..."
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-9 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm text-left">
                            <thead className="[&_tr]:border-b bg-muted/30">
                                <tr className="border-b transition-colors hover:bg-muted/50">
                                    <th className="h-12 px-6 align-middle font-medium text-muted-foreground w-[150px]">Order ID</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">User</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Type</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Amount</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Status</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0 divide-y divide-border">
                                {filteredOrders.length > 0 ? (
                                    filteredOrders.map((order) => (
                                        <tr key={order._id} className="transition-colors hover:bg-muted/30 bg-card">
                                            <td className="p-4 pl-6 font-mono text-xs text-muted-foreground">
                                                #{order._id.slice(-6).toUpperCase()}
                                                <div className="text-[10px] text-muted-foreground/60 mt-0.5">{new Date(order.createdAt).toLocaleDateString()}</div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary overflow-hidden">
                                                        {order.buyerId?.profile?.avatarUrl ? (
                                                            <img src={order.buyerId.profile.avatarUrl} alt="" className="h-full w-full object-cover" />
                                                        ) : (
                                                            (order.buyerId?.profile?.firstName?.[0] || '?') + (order.buyerId?.profile?.lastName?.[0] || '?')
                                                        )}
                                                    </div>
                                                    <span className="font-medium text-sm">{order.buyerId?.profile?.firstName} {order.buyerId?.profile?.lastName}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-sm">
                                                <div className="text-xs text-muted-foreground capitalize">{order.type.replace('_', ' ')}</div>
                                            </td>
                                            <td className="p-4 font-bold text-sm text-mono">${order.amount.toFixed(2)}</td>
                                            <td className="p-4">
                                                <span className={cn(
                                                    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors uppercase",
                                                    order.status === 'completed' ? "border-transparent bg-green-500/10 text-green-700" :
                                                        order.status === 'refunded' ? "border-transparent bg-red-500/10 text-red-700" :
                                                            order.status === 'pending' ? "border-transparent bg-blue-500/10 text-blue-700" :
                                                                "border-transparent bg-gray-500/10 text-gray-700"
                                                )}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right pr-6">
                                                <button className="text-primary hover:text-primary/80 text-xs font-medium hover:underline flex items-center justify-end w-full gap-1">
                                                    View Receipt <ArrowUpRight className="h-3 w-3" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="h-32 text-center text-muted-foreground">
                                            <div className="flex flex-col items-center justify-center">
                                                {isLoading ? (
                                                    <RefreshCw className="h-8 w-8 mb-2 animate-spin opacity-20" />
                                                ) : (
                                                    <>
                                                        <Search className="h-8 w-8 mb-2 opacity-20" />
                                                        <p>No orders found.</p>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
