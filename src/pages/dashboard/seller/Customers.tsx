import { useState, useEffect } from 'react';
import { Search, Filter, Mail, MoreHorizontal, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '../../../lib/utils';
import { useAuth } from '@/context/AuthContext';
import { API_URL } from '@/config';

export default function SellerCustomers() {
    const { token } = useAuth();
    const [customers, setCustomers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchCustomers = async () => {
            if (!token) return;
            try {
                const res = await fetch(`${API_URL}/subscriptions/seller-subscribers`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.status === 'success') {
                    setCustomers(data.data.subscribers);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCustomers();
    }, [token]);

    const filteredCustomers = customers.filter(c =>
        c.buyerId?.profile?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.buyerId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.listingId?.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) return <div className="h-64 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

    return (
        <div className="space-y-6 font-sans text-sm animate-fade-in">
            <div className="flex items-center justify-between border-b border-border/40 pb-6">
                <div>
                    <h2 className="font-display font-bold text-2xl tracking-tight">Subscribers</h2>
                    <p className="text-muted-foreground mt-1">Manage your active subscriptions and members.</p>
                </div>
                <Button>
                    <Mail className="h-4 w-4 mr-2" /> Broadcast Message
                </Button>
            </div>

            <div className="flex items-center gap-4 bg-card border border-border p-2 rounded-lg">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                        className="flex h-9 w-full rounded-md bg-muted/20 border border-border/50 px-3 pl-9 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        placeholder="Search subscribers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="h-6 w-px bg-border mx-2" />
                <Button variant="ghost" size="sm" className="h-9 gap-2">
                    <Filter className="h-4 w-4" /> Filter
                </Button>
            </div>

            <div className="rounded-lg border border-border bg-card overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-muted/30 border-b border-border text-xs uppercase text-muted-foreground font-medium">
                        <tr>
                            <th className="px-6 py-3">Subscriber</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Plan</th>
                            <th className="px-6 py-3">Revenue</th>
                            <th className="px-6 py-3">Next Billing</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                        {filteredCustomers.map((sub) => (
                            <tr key={sub._id} className="hover:bg-muted/20 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                            {sub.buyerId?.profile?.firstName?.charAt(0) || 'U'}
                                        </div>
                                        <div>
                                            <div className="font-medium text-foreground">
                                                {sub.buyerId?.profile?.firstName} {sub.buyerId?.profile?.lastName}
                                            </div>
                                            <div className="text-xs text-muted-foreground">{sub.buyerId?.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={cn(
                                        "inline-flex items-center px-2 py-1 rounded-full text-[10px] font-medium uppercase tracking-wide",
                                        sub.subscription?.status === 'active' ? "bg-green-500/10 text-green-700" : "bg-red-500/10 text-red-700"
                                    )}>
                                        {sub.subscription?.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-medium">{sub.listingId?.title}</td>
                                <td className="px-6 py-4 font-mono font-medium">${sub.amount} / {sub.subscription?.interval}</td>
                                <td className="px-6 py-4 text-muted-foreground text-xs">
                                    {new Date(sub.subscription?.nextBillingDate).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MoreHorizontal className="h-4 w-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredCustomers.length === 0 && (
                    <div className="p-12 text-center text-muted-foreground">
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
                            <Search className="h-6 w-6 opacity-30" />
                        </div>
                        <p>No subscribers found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
