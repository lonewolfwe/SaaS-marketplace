import { useState, useEffect, useCallback } from 'react';
import { Check, X, AlertOctagon, ExternalLink, Eye, RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/context/AuthContext';
import { API_URL } from '@/config';
import type { Listing } from '@/components/features/listings/ListingCard';

// Extend Listing type or assume it matches but with extra moderation fields if needed
type FlaggedListing = Listing;

export default function ListingModeration() {
    const { token } = useAuth();
    const [listings, setListings] = useState<FlaggedListing[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [confirmingId, setConfirmingId] = useState<string | null>(null);

    const fetchPendingListings = useCallback(async () => {
        setIsLoading(true);
        try {
            // Admin route to get all pending listings. 
            // Note: We might need to adjust the backend to support simpler filtering for admins, 
            // but usually admins can see all. 
            // However, listingController.getAllListings usually filters by 'approved'.
            // We need a specific query for pending.
            const res = await fetch(`${API_URL}/listings?status=pending`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.status === 'success') {
                setListings(data.data.listings);
            }
        } catch (err) {
            console.error("Failed to load moderation queue", err);
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchPendingListings();
    }, [token, fetchPendingListings]);

    const handleModeration = async (id: string, action: 'approve' | 'reject') => {
        try {
            const status = action === 'approve' ? 'approved' : 'rejected';
            const res = await fetch(`${API_URL}/listings/${id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status })
            });

            if (res.ok) {
                // Remove from local list
                setListings(prev => prev.filter(l => l._id !== id));
                setConfirmingId(null);
            }
        } catch (err) {
            console.error(`Failed to ${action} listing`, err);
        }
    };

    return (
        <div className="space-y-4 font-sans text-sm animate-fade-in">
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
                <div>
                    <h2 className="font-bold text-lg leading-none">Content Moderation</h2>
                    <p className="text-xs text-muted-foreground font-mono mt-0.5">Queue Size: {listings.length} Pending</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-8 text-xs" onClick={fetchPendingListings}>
                        <RefreshCw className={`h-3 w-3 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* List Pane */}
                <div className="lg:col-span-2 space-y-4">
                    {listings.length === 0 && !isLoading && (
                        <div className="text-center py-12 text-muted-foreground">
                            <Check className="h-12 w-12 mx-auto mb-3 text-green-500/50" />
                            <p>All caught up! No pending listings.</p>
                        </div>
                    )}

                    {listings.map((listing) => (
                        <Card key={listing._id} className="rounded-sm border-border shadow-none p-4 flex gap-4 bg-background hover:bg-muted/10 transition-colors">
                            <div className="mt-1 h-8 w-8 rounded flex items-center justify-center shrink-0 bg-yellow-100 text-yellow-600">
                                <AlertOctagon className="h-4 w-4" />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                                            {listing.title}
                                            {listing.visibility === 'public' && <a href={`/listing/${listing._id}`} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary"><ExternalLink size={10} /></a>}
                                        </h3>
                                        <div className="text-xs font-mono text-muted-foreground mt-0.5">
                                            Seller: {listing.sellerId?.profile?.firstName || 'Unknown'} • ${listing.price}
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded border bg-yellow-50 text-yellow-700 border-yellow-200">
                                        Pending Review
                                    </span>
                                </div>

                                <div className="bg-muted/30 p-2 rounded mt-3 text-xs border border-border/50 line-clamp-2">
                                    <span className="font-semibold text-foreground">Desc:</span> {listing.description?.substring(0, 100)}...
                                </div>

                                <div className="flex items-center gap-2 mt-4">
                                    {confirmingId === listing._id ? (
                                        <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2">
                                            <span className="text-xs font-semibold text-red-600 mr-2">Reject?</span>
                                            <Button size="sm" onClick={() => setConfirmingId(null)} variant="outline" className="h-7 text-xs">
                                                Cancel
                                            </Button>
                                            <Button size="sm" onClick={() => handleModeration(listing._id, 'reject')} className="h-7 text-xs bg-red-600 hover:bg-red-700 text-white border-none gap-1">
                                                Confirm Reject
                                            </Button>
                                        </div>
                                    ) : (
                                        <>
                                            <Button
                                                size="sm"
                                                onClick={() => handleModeration(listing._id, 'approve')}
                                                className="h-7 text-xs bg-green-600 hover:bg-green-700 text-white border-none gap-1"
                                            >
                                                <Check size={12} /> Approve
                                            </Button>
                                            <Button
                                                size="sm"
                                                onClick={() => setConfirmingId(listing._id)}
                                                className="h-7 text-xs bg-red-600 hover:bg-red-700 text-white border-none gap-1"
                                            >
                                                <X size={12} /> Reject
                                            </Button>
                                        </>
                                    )}

                                    <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 ml-auto">
                                        <Eye size={12} /> Details
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Sidebar Guidelines */}
                <div className="space-y-4">
                    <Card className="rounded-sm border-border shadow-none bg-blue-50/10 p-4">
                        <h3 className="font-bold text-sm mb-2">Moderation Guidelines</h3>
                        <ul className="text-xs text-muted-foreground space-y-2 list-disc pl-4">
                            <li>Check for complete descriptions and valid working URLs.</li>
                            <li>Ensure pricing model matches the category norms.</li>
                            <li>Approve legitimate SaaS tools to populate the marketplace.</li>
                        </ul>
                    </Card>
                </div>
            </div>
        </div>
    );
}
