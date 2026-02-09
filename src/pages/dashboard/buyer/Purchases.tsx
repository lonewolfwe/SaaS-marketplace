import { Download, ExternalLink, Package, Search, Filter } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { API_URL } from '@/config';

export default function BuyerPurchases() {
    const { token } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [purchases, setPurchases] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (token) {
            const fetchPurchases = async () => {
                try {
                    const res = await fetch(`${API_URL}/orders/my-orders`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    const data = await res.json();
                    if (data.status === 'success') {
                        setPurchases(data.data.orders);
                    }
                } catch (err) {
                    console.error("Failed to fetch purchases", err);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchPurchases();
        }
    }, [token]);

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Purchase History</h2>
                    <p className="text-muted-foreground">View and download invoices for your orders.</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search orders..."
                            className="h-9 w-[200px] lg:w-[300px] rounded-md border border-input bg-background pl-9 px-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="h-9 w-9 inline-flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent text-muted-foreground hover:text-foreground">
                        <Filter className="h-4 w-4" />
                    </button>
                    <button className="h-9 px-4 inline-flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent text-sm font-medium transition-colors">
                        Export
                    </button>
                </div>
            </div>

            <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm text-left">
                        <thead className="bg-muted/50 [&_tr]:border-b">
                            <tr className="border-b border-border transition-colors">
                                <th className="h-12 px-6 align-middle font-medium text-muted-foreground w-[120px]">Order ID</th>
                                <th className="h-12 px-6 align-middle font-medium text-muted-foreground">Product</th>
                                <th className="h-12 px-6 align-middle font-medium text-muted-foreground">Seller</th>
                                <th className="h-12 px-6 align-middle font-medium text-muted-foreground">Date</th>
                                <th className="h-12 px-6 align-middle font-medium text-muted-foreground">Amount</th>
                                <th className="h-12 px-6 align-middle font-medium text-muted-foreground">Status</th>
                                <th className="h-12 px-6 align-middle font-medium text-muted-foreground text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0 bg-card">
                            {isLoading ? (
                                <tr><td colSpan={7} className="p-8 text-center">Loading purchases...</td></tr>
                            ) : purchases.length === 0 ? (
                                <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">No purchases found.</td></tr>
                            ) : (
                                purchases.map((purchase) => (
                                    <tr key={purchase._id} className="border-b border-border transition-colors hover:bg-muted/30">
                                        <td className="p-6 font-medium text-xs font-mono text-muted-foreground">#{purchase._id.slice(-6).toUpperCase()}</td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                                                    <Package className="h-5 w-5" />
                                                </div>
                                                <span className="font-medium max-w-[200px] truncate" title={purchase.listingId?.title}>{purchase.listingId?.title || 'Deleted Item'}</span>
                                            </div>
                                        </td>
                                        <td className="p-6 text-muted-foreground">{purchase.sellerId?.profile?.companyName || purchase.sellerId?.profile?.firstName}</td>
                                        <td className="p-6 text-muted-foreground">{new Date(purchase.createdAt).toLocaleDateString()}</td>
                                        <td className="p-6 font-medium">${purchase.amount.toLocaleString()}</td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-2">
                                                <span className={cn(
                                                    "h-2 w-2 rounded-full",
                                                    purchase.status === "completed" ? "bg-green-500" : "bg-yellow-500"
                                                )} />
                                                <span className="capitalize">{purchase.status}</span>
                                            </div>
                                        </td>
                                        <td className="p-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="h-8 w-8 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors" title="Download Invoice">
                                                    <Download className="h-4 w-4" />
                                                </button>
                                                {/* Cancel Button */}
                                                {purchase.status !== 'cancelled' && purchase.type !== 'subscription' && (
                                                    <button
                                                        onClick={async () => {
                                                            if (!confirm('Are you sure you want to cancel this order?')) return;
                                                            try {
                                                                const res = await fetch(`${API_URL}/orders/${purchase._id}/cancel`, {
                                                                    method: 'PATCH',
                                                                    headers: { 'Authorization': `Bearer ${token}` }
                                                                });
                                                                if (res.ok) {
                                                                    // Refresh
                                                                    setPurchases(prev => prev.map(p => p._id === purchase._id ? { ...p, status: 'cancelled' } : p));
                                                                }
                                                            } catch (e) { console.error(e); }
                                                        }}
                                                        className="h-8 px-2 inline-flex items-center justify-center rounded-md text-red-500 hover:bg-red-50 text-xs font-medium transition-colors"
                                                        title="Cancel Order"
                                                    >
                                                        Cancel
                                                    </button>
                                                )}
                                                <button className="h-8 w-8 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors" title="View Order Details">
                                                    <ExternalLink className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground mt-4 px-2">
                <div>Showing {purchases.length} order{purchases.length !== 1 && 's'}</div>
                <div className="flex gap-2">
                    <button className="hover:text-foreground" disabled>Previous</button>
                    <button className="hover:text-foreground" disabled>Next</button>
                </div>
            </div>
        </div>
    );
}
