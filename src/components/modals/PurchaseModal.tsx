import { X, ShieldCheck, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '@/config';

interface PurchaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    listingTitle: string;
    price: number;
    listingId: string;
    onSuccess?: () => void;
    pricingModel?: string; // Add this
}

export default function PurchaseModal({ isOpen, onClose, listingTitle, price, listingId, onSuccess, pricingModel }: PurchaseModalProps) {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const isSubscription = pricingModel && pricingModel.includes('subscription');
    const interval = pricingModel === 'subscription_yearly' ? 'year' : 'month';

    const handlePurchase = async () => {
        setIsLoading(true);
        try {
            let res;
            if (isSubscription) {
                res = await fetch(`${API_URL}/subscriptions`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        listingId,
                        interval
                    })
                });
            } else {
                res = await fetch(`${API_URL}/orders`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        listingId,
                        amount: price,
                        type: 'one_time'
                    })
                });
            }

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Payment failed');

            alert(isSubscription ? 'Subscription activated!' : 'Purchase successful!');
            onClose();

            if (onSuccess) {
                onSuccess();
            } else {
                navigate(isSubscription ? '/dashboard/buyer/subscriptions' : '/dashboard/buyer/purchases');
            }

        } catch (err: any) {
            alert(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative w-full max-w-md bg-card border border-border rounded-xl shadow-2xl overflow-hidden"
                >
                    <div className="p-6 border-b border-border flex items-center justify-between bg-secondary/20">
                        <h3 className="font-display font-bold text-xl">{isSubscription ? 'Confirm Subscription' : 'Confirm Purchase'}</h3>
                        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="flex items-start gap-4 p-4 bg-primary/5 rounded-lg border border-primary/10">
                            <ShieldCheck className="text-primary shrink-0 mt-1" size={24} />
                            <div>
                                <h4 className="font-semibold text-sm mb-1">{isSubscription ? 'Recurring Billing' : 'Escrow Protected'}</h4>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    {isSubscription
                                        ? `You will be billed $${price.toLocaleString()} every ${interval}. Cancel anytime.`
                                        : "Your funds will be held in a secure escrow account until you confirm the asset transfer is complete."
                                    }
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Item</span>
                                <span className="font-medium truncate max-w-[200px]">{listingTitle}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Price</span>
                                <span className="font-medium">
                                    ${price.toLocaleString()}
                                    {isSubscription && <span className="text-xs text-muted-foreground"> / {interval}</span>}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Service Fee (0%)</span>
                                <span className="font-medium text-green-600">FREE</span>
                            </div>
                            <div className="border-t border-border pt-4 flex justify-between items-center">
                                <span className="font-bold">Total Due Today</span>
                                <span className="font-display font-bold text-2xl text-primary">${price.toLocaleString()}</span>
                            </div>
                        </div>

                        <Button size="lg" className="w-full" onClick={handlePurchase} disabled={isLoading}>
                            {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</> : (isSubscription ? 'Subscribe Now' : 'Confirm Payment')}
                        </Button>

                        <div className="text-center">
                            <button onClick={onClose} className="text-xs text-muted-foreground hover:underline" disabled={isLoading}>
                                Cancel transaction
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
