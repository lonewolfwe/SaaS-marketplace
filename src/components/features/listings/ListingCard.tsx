import React from 'react';
import { Heart, ArrowUpRight } from 'lucide-react';

export interface Listing {
    _id: string;
    title: string;
    description: string;
    price: number;
    pricingModel: string;
    images: string[];
    ratingsAverage?: number;
    ratingsQuantity?: number;
    category: string;
    sellerId: {
        profile: {
            firstName: string;
            lastName: string;
            companyName?: string;
            avatarUrl?: string;
        }
    };
    stats?: {
        likes: number;
        salesCount?: number;
        rating?: number;
    };
    status: 'approved' | 'pending' | 'rejected' | 'draft';
    visibility: 'public' | 'private' | 'unlisted';
}

interface ListingCardProps {
    listing: Listing;
    onClick?: (id: string) => void;
    onLike?: (e: React.MouseEvent, id: string) => void;
    isLiked?: boolean;
    className?: string;
    actionSlot?: React.ReactNode;
    isPurchased?: boolean;
    isHot?: boolean;
    isNew?: boolean;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing, onClick, onLike, isLiked, className, actionSlot, isPurchased, isHot, isNew }) => {
    const displayImage = listing.images && listing.images.length > 0 ? listing.images[0] : null;

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick?.(listing._id);
        }
    };

    return (
        <div
            onClick={() => onClick?.(listing._id)}
            role="button"
            tabIndex={0}
            onKeyDown={handleKeyDown}
            className={`group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card transition-all duration-500 hover:shadow-xl hover:border-border/80 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${className || ''}`}
        >
            {/* Image Container */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-secondary/30">
                {displayImage ? (
                    <img
                        src={displayImage}
                        alt={listing.title}
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        loading="lazy"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground/40 text-[10px] uppercase tracking-widest font-mono">
                        No Preview
                    </div>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                    <div className="rounded-full bg-background/95 px-3 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border border-border/20 shadow-sm text-foreground">
                        {listing.category}
                    </div>
                    {isNew && (
                        <div className="rounded-full bg-blue-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                            New
                        </div>
                    )}
                    {isHot && (
                        <div className="rounded-full bg-orange-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                            Trending
                        </div>
                    )}
                </div>

                {isPurchased && (
                    <div className="absolute top-4 right-14 rounded-full bg-green-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm z-20">
                        Owned
                    </div>
                )}

                {onLike && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onLike(e, listing._id);
                        }}
                        className={`absolute top-3 right-3 p-2.5 rounded-full bg-background/60 backdrop-blur-md border border-white/10 transition-all duration-300 hover:bg-background z-10 ${isLiked ? "text-red-500" : "text-foreground/60 hover:text-foreground"}`}
                    >
                        <Heart size={16} className={isLiked ? "fill-current" : ""} />
                    </button>
                )}
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col p-6">
                <div className="mb-4">
                    <div className="flex justify-between items-start gap-4">
                        <h3 className="font-display text-xl font-bold text-foreground leading-tight group-hover:text-primary transition-colors duration-300">
                            {listing.title}
                        </h3>
                        <ArrowUpRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0" />
                    </div>

                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground leading-relaxed h-[2.5em]">
                        {listing.description}
                    </p>
                </div>

                {/* Footer */}
                <div className="mt-auto border-t border-border/40 pt-4 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase text-muted-foreground/60 font-bold tracking-widest">Pricing</span>
                        <div className="font-mono text-base font-medium text-foreground">
                            ${listing.price.toLocaleString()}
                            <span className="text-xs text-muted-foreground font-normal ml-1">/ {listing.pricingModel}</span>
                        </div>
                    </div>

                    {actionSlot ? (
                        <div onClick={e => e.stopPropagation()}>
                            {actionSlot}
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            {listing.sellerId?.profile?.avatarUrl ? (
                                <img src={listing.sellerId.profile.avatarUrl} alt="" className="h-6 w-6 rounded-full border border-border" />
                            ) : (
                                <div className="h-6 w-6 rounded-full bg-gradient-to-br from-secondary to-muted border border-border" />
                            )}
                            <span className="text-xs font-medium text-muted-foreground">
                                {listing.sellerId?.profile?.companyName || listing.sellerId?.profile?.firstName || 'Verified Seller'}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
