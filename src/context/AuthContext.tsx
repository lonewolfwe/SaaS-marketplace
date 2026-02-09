import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { API_URL } from '@/config';

// Define User type based on backend standard
interface User {
    _id: string; // Adjusted to match mongo
    id?: string; // fallback
    email: string;
    roles: string[];
    profile: {
        firstName: string;
        lastName: string;
        avatarUrl?: string;
        companyName?: string;
        bio?: string;
    };
    savedListings?: string[]; // Array of IDs
    likedListings?: string[]; // Array of IDs
    purchasedListingIds?: string[]; // Derived from orders
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login'; // Force redirect
    };

    const fetchUserData = async (currentToken: string) => {
        try {
            // 1. Fetch User Profile (Refresh stats/likes/saves)
            const userRes = await fetch(`${API_URL}/auth/me`, {
                headers: { 'Authorization': `Bearer ${currentToken}` }
            });

            if (!userRes.ok) throw new Error('Failed to fetch user');
            const userData = await userRes.json();
            const freshUser = userData.data.user;

            // 2. Fetch Orders (to derive purchased items)
            // Only for buyers/sellers, admin might have different flow but safe to call
            const ordersRes = await fetch(`${API_URL}/orders/my-orders`, {
                headers: { 'Authorization': `Bearer ${currentToken}` }
            });

            const purchasedIds: string[] = [];
            if (ordersRes.ok) {
                const ordersData = await ordersRes.json();
                if (ordersData.status === 'success') {
                    ordersData.data.orders.forEach((o: any) => {
                        if (o.listingId && o.status === 'completed') {
                            purchasedIds.push(typeof o.listingId === 'string' ? o.listingId : o.listingId._id);
                        }
                    });
                }
            }

            // Merge
            const mergedUser = {
                ...freshUser,
                purchasedListingIds: purchasedIds
            };

            setUser(mergedUser);
            localStorage.setItem('user', JSON.stringify(mergedUser));
        } catch (error) {
            console.error("Failed to refresh user data", error);
            // If 401, logout?
            // logout(); // Be careful not to loop
        }
    };

    const refreshUser = async () => {
        if (token) {
            await fetchUserData(token);
        }
    };

    useEffect(() => {
        const initAuth = async () => {
            const storedToken = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (storedToken) {
                // Check expiry first
                try {
                    const payload = JSON.parse(atob(storedToken.split('.')[1]));
                    if (payload.exp * 1000 < Date.now()) {
                        logout();
                        return;
                    }
                } catch (e) {
                    logout();
                    return;
                }

                setToken(storedToken);

                // Hydrate from storage first for immediate UI
                if (storedUser) {
                    try {
                        setUser(JSON.parse(storedUser));
                    } catch (e) { /* ignore */ }
                }

                // Async fetch fresh data
                await fetchUserData(storedToken);
            }
            setIsLoading(false);
        };
        initAuth();

        // Interval Check
        const interval = setInterval(() => {
            const currentToken = localStorage.getItem('token');
            if (currentToken) {
                try {
                    const payload = JSON.parse(atob(currentToken.split('.')[1]));
                    if (payload.exp * 1000 < Date.now()) {
                        logout();
                    }
                } catch (e) { }
            }
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    const login = (newToken: string, newUser: User) => {
        setToken(newToken);
        setUser(newUser);
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(newUser));

        fetchUserData(newToken);
    };

    const isAuthenticated = !!token;

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout, isLoading, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
