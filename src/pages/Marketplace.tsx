import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, ArrowDownUp } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { ListingCard, type Listing } from '@/components/features/listings/ListingCard';
import { API_URL } from '@/config';
import { motion } from 'framer-motion';

const CATEGORIES = ['All', 'Marketing', 'DevTools', 'Design', 'Productivity', 'Finance', 'E-commerce', 'AI'];

export default function Marketplace() {
    const navigate = useNavigate();
    const { token, user } = useAuth();

    // Filters
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    const [listings, setListings] = useState<Listing[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // Local State for Likes (Map of listingId -> boolean)
    const [likedListings, setLikedListings] = useState<Record<string, boolean>>({});

    useEffect(() => {
        // Initialize liked state from user profile if available
        if (user && user.likedListings) {
            const initialLikes: Record<string, boolean> = {};
            user.likedListings.forEach(id => initialLikes[id] = true);
            setLikedListings(initialLikes);
        }
    }, [user]);

    useEffect(() => {
        const fetchListings = async () => {
            setIsLoading(true);
            try {
                let url = `${API_URL}/listings?status=approved`;

                if (selectedCategory !== 'All') {
                    url += `&category=${selectedCategory}`;
                }

                if (searchQuery) {
                    url += `&search=${encodeURIComponent(searchQuery)}`;
                }

                if (minPrice) {
                    url += `&price[gte]=${minPrice}`;
                }

                if (maxPrice) {
                    url += `&price[lte]=${maxPrice}`;
                }

                const response = await fetch(url);
                const data = await response.json();

                if (!response.ok) throw new Error(data.message || 'Failed to fetch listings');

                // Sort listings: Newest first by default for now
                // In a real app we might have a sort dropdown
                const sortedListings = data.data.listings.sort((a: Listing, b: Listing) => {
                    // Mock sort for "Hot" or "New" could go here
                    return 0;
                });

                setListings(data.data.listings);
            } catch (err: any) {
                console.error(err);
                setError(err.message || 'Failed to load listings');
            } finally {
                setIsLoading(false);
            }
        };

        // Debounce all filter changes
        const timeoutId = setTimeout(() => {
            fetchListings();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [selectedCategory, searchQuery, minPrice, maxPrice]);

    const handleLike = async (e: React.MouseEvent, listingId: string) => {
        e.preventDefault(); // Prevent navigation
        if (!token) return navigate('/login');

        const isCurrentlyLiked = likedListings[listingId] || false;

        // Optimistic Update
        setLikedListings(prev => ({ ...prev, [listingId]: !isCurrentlyLiked }));

        try {
            const res = await fetch(`${API_URL}/users/liked/${listingId}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to like');
        } catch (err) {
            // Revert on error
            setLikedListings(prev => ({ ...prev, [listingId]: isCurrentlyLiked }));
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground font-sans">

            {/* Minimal Header */}
            <div className="border-b border-border/40 bg-background/50 backdrop-blur-xl sticky top-0 z-30">
                <div className="container mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-8 w-full md:w-auto">
                        <span className="font-display font-bold text-xl tracking-tight">Marketplace</span>

                        {/* Desktop Category Pills */}
                        <div className="hidden md:flex items-center gap-2 overflow-x-auto no-scrollbar">
                            {CATEGORIES.map(category => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 border ${selectedCategory === category
                                            ? "bg-foreground text-background border-foreground"
                                            : "bg-background text-muted-foreground border-border/60 hover:border-foreground/20 hover:text-foreground"
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search ecosystem..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 h-9 text-xs bg-secondary/30 border-border/60 focus:bg-background transition-all rounded-full"
                            />
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className={`h-9 px-3 gap-2 rounded-full text-xs ${showFilters ? 'bg-secondary text-foreground' : 'text-muted-foreground'}`}
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <SlidersHorizontal className="h-3.5 w-3.5" />
                            Filters
                        </Button>
                    </div>
                </div>

                {/* Expanded Filters Panel */}
                {showFilters && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-border/40 bg-secondary/10"
                    >
                        <div className="container mx-auto px-6 py-6">
                            <div className="flex flex-col md:flex-row gap-8 items-start">
                                <div>
                                    <h4 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3">Price Range</h4>
                                    <div className="flex items-center gap-2">
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">$</span>
                                            <Input
                                                type="number"
                                                placeholder="0"
                                                className="h-9 w-24 pl-6 text-xs bg-background"
                                                value={minPrice}
                                                onChange={(e) => setMinPrice(e.target.value)}
                                            />
                                        </div>
                                        <span className="text-muted-foreground text-xs">to</span>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">$</span>
                                            <Input
                                                type="number"
                                                placeholder="Unlimited"
                                                className="h-9 w-24 pl-6 text-xs bg-background"
                                                value={maxPrice}
                                                onChange={(e) => setMaxPrice(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                                {/* More filters can go here */}
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>

            <div className="container mx-auto px-6 py-12">

                {/* Hero / Header Section within Page */}
                <div className="mb-12">
                    <h1 className="font-display font-medium text-4xl md:text-5xl tracking-tighter mb-4">
                        Discover your next <br className="hidden md:block" />
                        <span className="text-muted-foreground">acquisition target.</span>
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl font-light">
                        Browse verified SaaS businesses, developer tools, and e-commerce platforms ready for transfer.
                    </p>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                            <div key={n} className="rounded-2xl border border-border/40 bg-card h-[400px] animate-pulse">
                                <div className="h-[60%] bg-secondary/30 rounded-t-2xl" />
                                <div className="p-6 space-y-4">
                                    <div className="h-6 w-3/4 bg-secondary/50 rounded" />
                                    <div className="h-4 w-full bg-secondary/30 rounded" />
                                    <div className="h-4 w-2/3 bg-secondary/30 rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="py-32 text-center">
                        <p className="text-red-500 mb-4">{error}</p>
                        <Button variant="outline" onClick={() => window.location.reload()}>Retry Connection</Button>
                    </div>
                )}

                {/* Listings Grid */}
                {!isLoading && !error && listings.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {listings.map((listing, index) => (
                            <motion.div
                                key={listing._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.05 }}
                            >
                                <ListingCard
                                    listing={listing}
                                    onClick={(id) => navigate(`/listing/${id}`)}
                                    onLike={handleLike}
                                    isLiked={!!likedListings[listing._id]}
                                    isPurchased={user?.purchasedListingIds?.includes(listing._id)}
                                    isNew={index < 2} // Just visual mocking for "New" badge based on order
                                    isHot={index === 2 || index === 5} // Visual mocking
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {!isLoading && !error && listings.length === 0 && (
                    <div className="py-40 text-center border border-dashed border-border/60 rounded-3xl bg-secondary/5">
                        <div className="h-16 w-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-6 text-muted-foreground">
                            <Search size={24} />
                        </div>
                        <h3 className="font-display font-medium text-xl mb-2">No listings found</h3>
                        <p className="text-muted-foreground max-w-sm mx-auto mb-8">
                            We couldn't find any results matching your filters. Try adjusting your search or category.
                        </p>
                        <Button
                            variant="outline"
                            onClick={() => { setSelectedCategory('All'); setSearchQuery(''); setMinPrice(''); setMaxPrice(''); }}
                        >
                            Clear all filters
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
