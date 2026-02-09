import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShieldCheck, Globe, Activity, Layers, Heart, Bookmark, Share2, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { useAuth } from '@/context/AuthContext';
import PurchaseModal from '@/components/modals/PurchaseModal';
import { API_URL } from '@/config';

interface Listing {
    _id: string;
    title: string;
    description: string;
    price: number;
    pricingModel: string;
    images: string[];
    category: string;
    sellerId: {
        _id: string;
        profile: {
            companyName?: string;
            firstName: string;
            lastName: string;
        };
    };
    stats: {
        likes: number;
        rating: number;
    };
    tags?: string[];
    createdAt: string;
}

export default function ListingDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token, user } = useAuth();

    const [listing, setListing] = useState<Listing | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // Interaction States
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);

    // Initial Fetch
    useEffect(() => {
        const fetchListing = async () => {
            try {
                const res = await fetch(`${API_URL}/listings/${id}`);
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || 'Failed to fetch listing');

                setListing(data.data.listing);
                setLikesCount(data.data.listing.stats?.likes || 0);

                // Check if user has liked/saved (requires fetching user profile or passing state)
                // For MVP optimization, we might skip checking initial state if not provided by getListing
                // But ideally we should check properly. 
                // Let's rely on local optimistic checks if we had user object populated
                if (user && user.savedListings?.includes(id || '')) setIsSaved(true);
                if (user && user.likedListings?.includes(id || '')) setIsLiked(true);

            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchListing();
    }, [id, user]);

    const handleBack = () => navigate(-1);

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
    };

    const handleLike = async () => {
        if (!token) return navigate('/login');

        // Optimistic UI
        const newIsLiked = !isLiked;
        setIsLiked(newIsLiked);
        setLikesCount(prev => newIsLiked ? prev + 1 : prev - 1);

        try {
            const res = await fetch(`${API_URL}/users/liked/${id}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to like');
        } catch (err) {
            // Revert
            setIsLiked(!newIsLiked);
            setLikesCount(prev => !newIsLiked ? prev + 1 : prev - 1);
        }
    };

    const handleSave = async () => {
        if (!token) return navigate('/login');

        const newIsSaved = !isSaved;
        setIsSaved(newIsSaved);

        try {
            const res = await fetch(`${API_URL}/users/saved/${id}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to save');
        } catch (err) {
            setIsSaved(!newIsSaved);
        }
    };

    const handleAcquire = () => {
        if (!token) return navigate('/login');
        setIsPurchaseModalOpen(true);
    };

    const handleMessage = () => {
        if (!token) return navigate('/login');
        alert(`Starting chat with ${listing?.sellerId.profile.firstName}...`);
    };

    if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (error || !listing) return <div className="min-h-screen flex items-center justify-center text-red-500">Error: {error || 'Listing not found'}</div>;

    const sellerName = listing.sellerId.profile.companyName || `${listing.sellerId.profile.firstName} ${listing.sellerId.profile.lastName}`;

    return (
        <div className="min-h-screen bg-background pb-20 font-sans">
            {/* Header */}
            <div className="border-b border-border bg-background sticky top-0 z-20">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <button onClick={handleBack} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                        <span>← Back to Marketplace</span>
                    </button>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={handleShare}>
                            <Share2 className="w-4 h-4 mr-2" /> Share
                        </Button>
                        <Button variant="ghost" size="sm" onClick={handleSave} className={isSaved ? "text-primary" : ""}>
                            <Bookmark className={`w-4 h-4 mr-2 ${isSaved ? "fill-current" : ""}`} />
                            {isSaved ? 'Saved' : 'Save'}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-12">
                <div className="grid lg:grid-cols-[1fr_400px] gap-12 lg:gap-24">

                    {/* Main Content */}
                    <div className="space-y-12">
                        {/* Title Block */}
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="bg-primary/10 text-primary text-[10px] font-mono uppercase tracking-widest px-2 py-1 rounded-full">{listing.category}</span>
                                <span className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-widest text-green-600 bg-green-500/10 px-2 py-1 rounded-full">
                                    <ShieldCheck size={12} /> Verified Listing
                                </span>
                            </div>
                            <h1 className="font-display font-bold text-4xl md:text-5xl tracking-tight text-foreground mb-4 leading-[1.1]">
                                {listing.title}
                            </h1>
                            {/* Assuming description first line or truncated is tagline since we don't have tagline in schema */}
                            <p className="text-xl text-muted-foreground leading-relaxed">
                                {listing.description.substring(0, 150)}...
                            </p>
                        </div>

                        {/* Image */}
                        <div className="aspect-video w-full rounded-2xl overflow-hidden border border-border/50 bg-secondary shadow-sm">
                            {listing.images && listing.images.length > 0 ? (
                                <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-muted">No Image</div>
                            )}
                        </div>

                        {/* Key Metrics Grid - Mocked for now since not in schema fully */}
                        <div className="grid grid-cols-3 gap-6 py-8 border-y border-border">
                            <div>
                                <div className="text-sm text-muted-foreground font-mono uppercase tracking-wider mb-1">Price</div>
                                <div className="text-2xl font-display font-bold">${listing.price}</div>
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground font-mono uppercase tracking-wider mb-1">Likes</div>
                                <div className="text-2xl font-display font-bold">{likesCount}</div>
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground font-mono uppercase tracking-wider mb-1">Created</div>
                                <div className="text-2xl font-display font-bold">{new Date(listing.createdAt).getFullYear()}</div>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <h3 className="font-display font-bold text-2xl mb-6">About the Product</h3>
                            <div className="prose prose-neutral dark:prose-invert max-w-none text-muted-foreground leading-loose whitespace-pre-wrap">
                                {listing.description}
                            </div>
                        </div>

                        {/* Tech Stack - Using Tags */}
                        {listing.tags && listing.tags.length > 0 && (
                            <div>
                                <h3 className="font-display font-bold text-2xl mb-6">Tags / Tech Stack</h3>
                                <div className="flex flex-wrap gap-4">
                                    {listing.tags.map(tech => (
                                        <div key={tech} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card">
                                            <Layers size={16} className="text-muted-foreground" />
                                            <span className="font-medium">{tech}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sticky Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-8">
                            <Card className="border-border shadow-xl">
                                <CardHeader className="pb-4 border-b border-border/50">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="text-sm text-muted-foreground font-mono uppercase tracking-wider mb-1">Asking Price</div>
                                            <div className="text-4xl font-display font-bold text-primary">${listing.price}</div>
                                            <div className="text-xs text-muted-foreground mt-1 capitalize">{listing.pricingModel?.replace('_', ' ')}</div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={handleLike}
                                            className={`rounded-full ${isLiked ? "bg-red-50 text-red-500 hover:bg-red-100" : ""}`}
                                        >
                                            <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-4">
                                    <Button size="lg" className="w-full text-lg h-12" onClick={handleAcquire}>Acquire Asset</Button>
                                    <Button variant="outline" className="w-full" onClick={handleMessage}>
                                        <MessageCircle className="w-4 h-4 mr-2" /> Message Seller
                                    </Button>

                                    <div className="pt-4 space-y-3">
                                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                            <ShieldCheck size={16} className="text-green-500" />
                                            <span>Escrow protection included</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                            <Globe size={16} className="text-blue-500" />
                                            <span>Global asset transfer</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                            <Activity size={16} className="text-orange-500" />
                                            <span>Due diligence reports enabled</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Seller Info */}
                            <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-secondary/20">
                                <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                                    {sellerName.charAt(0)}
                                </div>
                                <div>
                                    <div className="font-bold">{sellerName}</div>
                                    <div className="text-xs text-muted-foreground">Verified Seller • Joined 2023</div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Purchase Modal */}
            <PurchaseModal
                isOpen={isPurchaseModalOpen}
                onClose={() => setIsPurchaseModalOpen(false)}
                listingTitle={listing.title}
                price={listing.price}
                listingId={listing._id}
                pricingModel={listing.pricingModel}
            />
        </div>
    );
}
