export interface Listing {
    id: string;
    title: string;
    description: string;
    price: number;
    imageUrl: string;
    category: string;
    seller: {
        id: string;
        name: string;
        avatarUrl?: string; // Optional since not all users might have avatars
    };
    rating?: number;
    reviewCount?: number;
}
