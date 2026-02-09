import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { API_URL } from '@/config';
import { Package, Search, Filter, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function SellerOrders() {
    const { token } = useAuth();
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            if (!token) return;
            try {
                const res = await fetch(`${API_URL}/orders/sales`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.status === 'success') {
                    setOrders(data.data.orders);
                }
            } catch (err) {
                console.error("Failed to load orders", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrders();
    }, [token]);

    const filteredOrders = orders.filter(order =>
        order.listingId?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order._id.includes(searchTerm) ||
        order.buyerId?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            {/* Header */}
            <div>
                <h2 className="font-display font-bold text-3xl tracking-tight leading-none mb-2">Orders</h2>
                <p className="text-muted-foreground">Manage and track your incoming orders and subscriptions.</p>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search orders, emails, or IDs..."
                        className="pl-9 bg-background"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button variant="outline"><Filter className="h-4 w-4 mr-2" /> Filter Status</Button>
                <Button variant="outline">Export CSV</Button>
            </div>

            {/* Orders Table */}
            <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-secondary/20 border-b border-border/50">
                            <tr className="text-left text-xs text-muted-foreground uppercase tracking-wider">
                                <th className="px-6 py-4 font-medium">Order ID</th>
                                <th className="px-6 py-4 font-medium">Product</th>
                                <th className="px-6 py-4 font-medium">Customer</th>
                                <th className="px-6 py-4 font-medium">Date</th>
                                <th className="px-6 py-4 font-medium">Amount</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {isLoading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i}><td colSpan={7} className="px-6 py-8"><div className="h-4 bg-muted rounded w-full animate-pulse"></div></td></tr>
                                ))
                            ) : filteredOrders.length > 0 ? (
                                filteredOrders.map((order) => (
                                    <tr key={order._id} className="hover:bg-muted/10 transition-colors">
                                        <td className="px-6 py-4 font-mono text-xs text-muted-foreground">#{order._id.slice(-6)}</td>
                                        <td className="px-6 py-4 font-medium">{order.listingId?.title}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] text-primary font-bold">
                                                    {order.buyerId?.profile?.firstName?.[0] || 'G'}
                                                </div>
                                                <div>
                                                    <div className="text-foreground">{order.buyerId?.profile?.firstName} {order.buyerId?.profile?.lastName}</div>
                                                    <div className="text-xs text-muted-foreground">{order.buyerId?.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 font-medium">${order.amount.toFixed(2)}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${order.status === 'completed' ? 'bg-green-50 text-green-700 border-green-200' :
                                                    order.status === 'refunded' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-gray-50 text-gray-700 border-gray-200'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><ArrowRight size={14} /></Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                                        <div className="flex flex-col items-center justify-center gap-3">
                                            <div className="h-12 w-12 bg-secondary/50 rounded-full flex items-center justify-center"><Package className="h-6 w-6 text-muted-foreground" /></div>
                                            <p>No orders found matching your search.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
