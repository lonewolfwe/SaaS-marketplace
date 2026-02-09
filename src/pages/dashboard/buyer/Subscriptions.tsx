import { useState, useEffect } from 'react';
import { CreditCard, Calendar, AlertCircle, CheckCircle2, MoreVertical, Loader2 } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { useAuth } from '@/context/AuthContext';
import { API_URL } from '@/config';
import { Button } from '@/components/ui/Button';

export default function BuyerSubscriptions() {
    const { token } = useAuth();
    const [subscriptions, setSubscriptions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    useEffect(() => {
        const fetchSubs = async () => {
            if (!token) return;
            try {
                const res = await fetch(`${API_URL}/subscriptions/my-subscriptions`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.status === 'success') {
                    setSubscriptions(data.data.subscriptions);
                }
            } catch (err) {
                console.error("Failed to fetch subscriptions", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSubs();
    }, [token]);

    const handleCancel = async (id: string) => {
        if (!confirm('Are you sure you want to cancel? You will retain access until the end of the billing period.')) return;
        setProcessingId(id);
        try {
            const res = await fetch(`${API_URL}/subscriptions/${id}/cancel`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                // Refresh list or update local state
                const data = await res.json();
                setSubscriptions(prev => prev.map(sub => sub._id === id ? data.data.subscription : sub));
            }
        } catch (error) {
            console.error(error);
        } finally {
            setProcessingId(null);
        }
    };

    const handleResume = async (id: string) => {
        setProcessingId(id);
        try {
            const res = await fetch(`${API_URL}/subscriptions/${id}/resume`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setSubscriptions(prev => prev.map(sub => sub._id === id ? data.data.subscription : sub));
            }
        } catch (error) {
            console.error(error);
        } finally {
            setProcessingId(null);
        }
    };

    if (isLoading) {
        return <div className="h-64 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Subscriptions</h2>
                    <p className="text-muted-foreground">Manage your active subscriptions and billing.</p>
                </div>
                <button className="h-9 px-4 rounded-md border border-input bg-background hover:bg-accent text-sm font-medium transition-colors">
                    Billing Settings
                </button>
            </div>

            <div className="grid gap-6">
                {subscriptions.length === 0 ? (
                    <div className="text-center py-12 border rounded-xl bg-card">
                        <p className="text-muted-foreground">No active subscriptions found.</p>
                    </div>
                ) : subscriptions.map((sub) => {
                    const status = sub.subscription.status;
                    const isCancelled = status === 'cancelled';
                    const isActive = status === 'active';
                    const endDate = sub.subscription.endDate ? new Date(sub.subscription.endDate).toLocaleDateString() : null;
                    const nextBilling = new Date(sub.subscription.nextBillingDate).toLocaleDateString();

                    return (
                        <div key={sub._id} className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 rounded-xl border border-border bg-card hover:border-primary/30 transition-all shadow-sm gap-6 relative">
                            {/* Status Line */}
                            <div className={cn(
                                "absolute left-0 top-0 bottom-0 w-1 rounded-l-xl",
                                isActive ? "bg-green-500" : isCancelled ? "bg-orange-500" : "bg-red-500"
                            )} />

                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 w-full">
                                <div className="h-20 w-20 rounded-xl overflow-hidden border border-border bg-muted flex-shrink-0 shadow-sm relative">
                                    {sub.listingId?.images?.[0] ? (
                                        <img src={sub.listingId.images[0]} alt={sub.listingId.title} className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center bg-secondary text-xs font-bold text-muted-foreground">NO IMG</div>
                                    )}
                                </div>

                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center gap-3">
                                        <h3 className="font-bold text-lg">{sub.listingId?.title || 'Unknown Plan'}</h3>
                                        <span className={cn(
                                            "text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 capitalize",
                                            isActive ? "bg-green-500/10 text-green-700" : isCancelled ? "bg-orange-500/10 text-orange-700" : "bg-red-500/10 text-red-700"
                                        )}>
                                            {isActive ? <CheckCircle2 className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                                            {status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-foreground/80 font-medium">
                                        <span className="capitalize">{sub.subscription.interval}ly Plan</span>
                                        <span className="text-muted-foreground">•</span>
                                        <span>${sub.amount} / {sub.subscription.interval}</span>
                                    </div>
                                    {isCancelled && (
                                        <div className="text-xs text-orange-600 font-medium pt-1">
                                            Access valid until {endDate}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col sm:items-end gap-1 text-sm min-w-[200px] border-l border-border pl-6 sm:h-full justify-center">
                                {!isCancelled && (
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Calendar className="h-4 w-4" />
                                        <span>Renews on</span>
                                        <span className="text-foreground font-medium">{nextBilling}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <CreditCard className="h-4 w-4" />
                                    <span>Visa ending in 4242</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-border">
                                {isActive ? (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={processingId === sub._id}
                                        onClick={() => handleCancel(sub._id)}
                                        className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20"
                                    >
                                        {processingId === sub._id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Cancel"}
                                    </Button>
                                ) : isCancelled ? (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={processingId === sub._id}
                                        onClick={() => handleResume(sub._id)}
                                        className="text-primary hover:text-primary hover:bg-primary/10 border-primary/20"
                                    >
                                        {processingId === sub._id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Resume"}
                                    </Button>
                                ) : null}
                                <button className="h-9 w-9 flex items-center justify-center rounded-md hover:bg-muted text-muted-foreground">
                                    <MoreVertical className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
