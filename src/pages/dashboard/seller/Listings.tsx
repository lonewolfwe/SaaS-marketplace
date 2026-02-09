import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { API_URL } from '@/config';
import { Package, Search, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';
import type { Listing } from '@/components/features/listings/ListingCard';

export default function SellerListings() {
    const { token } = useAuth();
    const [listings, setListings] = useState<Listing[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchListings = async () => {
            if (!token) return;
            try {
                const res = await fetch(`${API_URL}/listings/my-listings`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.status === 'success') {
                    setListings(data.data.listings);
                }
            } catch (err) {
                console.error("Failed to load listings", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchListings();
    }, [token]);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this listing?')) return;
        try {
            const res = await fetch(`${API_URL}/listings/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok || res.status === 204) {
                setListings(prev => prev.filter(l => l._id !== id));
            }
        } catch (err) {
            console.error("Failed to delete", err);
        }
    };

    const filteredListings = listings.filter(l =>
        l.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="font-display font-bold text-3xl tracking-tight leading-none mb-2">My Listings</h2>
                    <p className="text-muted-foreground">Manage your SaaS products and track performance.</p>
                </div>
                <Link to="/dashboard/seller/new">
                    <Button><Plus className="h-4 w-4 mr-2" /> Create New Listing</Button>
                </Link>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search listings..."
                        className="pl-9 bg-background"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Listings Grid/Table */}
            <div className="grid gap-4">
                {isLoading ? (
                    [...Array(3)].map((_, i) => (
                        <div key={i} className="h-24 bg-card border border-border rounded-xl animate-pulse"></div>
                    ))
                ) : filteredListings.length > 0 ? (
                    filteredListings.map(listing => (
                        <div key={listing._id} className="bg-card border border-border rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center group hover:border-primary/30 transition-all">

                            {/* Image */}
                            <div className="h-20 w-20 shrink-0 bg-secondary/20 rounded-lg overflow-hidden border border-border/50">
                                {listing.images?.[0] ? <img src={listing.images[0]} alt="" className="h-full w-full object-cover" /> : <Package className="h-8 w-8 m-auto text-muted-foreground mt-6" />}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0 text-center md:text-left">
                                <h3 className="font-bold text-lg leading-tight truncate">{listing.title}</h3>
                                <div className="flex items-center justify-center md:justify-start gap-3 mt-1 text-sm text-muted-foreground">
                                    <span className="capitalize bg-secondary/50 px-2 py-0.5 rounded text-xs">{listing.pricingModel.replace('_', ' ')}</span>
                                    <span>${listing.price}</span>
                                    <span>•</span>
                                    <span>{listing.stats?.salesCount || 0} Sales</span>
                                </div>
                            </div>

                            {/* Stats Pills */}
                            <div className="flex gap-4 text-sm text-center">
                                <div>
                                    <div className="font-bold">{listing.stats?.rating || '0.0'}</div>
                                    <div className="text-[10px] uppercase text-muted-foreground">Rating</div>
                                </div>
                                <div>
                                    <div className="font-bold">{listing.stats?.likes || 0}</div>
                                    <div className="text-[10px] uppercase text-muted-foreground">Likes</div>
                                </div>
                            </div>

                            {/* Status */}
                            <div className={`px-3 py-1 rounded-full text-xs font-bold border ${listing.status === 'approved' ? 'bg-green-100 text-green-700 border-green-200' :
                                listing.status === 'pending' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                                    'bg-gray-100 text-gray-700 border-gray-200'
                                }`}>
                                {listing.status.toUpperCase()}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                                <Link to={`/listing/${listing._id}`}><Button variant="ghost" size="icon" title="View Public Page"><Eye className="h-4 w-4" /></Button></Link>
                                <Button variant="ghost" size="icon" title="Edit Listing"><Edit className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50" title="Delete Listing" onClick={() => handleDelete(listing._id)}><Trash2 className="h-4 w-4" /></Button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-secondary/5 border-dashed border border-border rounded-xl">
                        <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="font-bold text-xl">No listings yet</h3>
                        <p className="text-muted-foreground mb-6">Create your first SaaS product listing to start selling.</p>
                        <Link to="/dashboard/seller/new">
                            <Button><Plus className="h-4 w-4 mr-2" /> Create Listing</Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
