import { DollarSign, CreditCard, Activity, ShoppingBag, Package, Zap, Plus, BarChart3, Settings as SettingsIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { API_URL } from '@/config';
import { ListingCard, type Listing } from '@/components/features/listings/ListingCard';
import PurchaseModal from '@/components/modals/PurchaseModal';

export default function DashboardOverview() {
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const role = user?.roles?.[0] || 'buyer';

    // Shared State
    const [isLoading, setIsLoading] = useState(true);

    // Buyer State
    const [buyerStats, setBuyerStats] = useState({ spent: 0, purchases: 0, activeSubscriptions: 0 });
    const [recommendedListings, setRecommendedListings] = useState<Listing[]>([]);


    // Seller State
    const [sellerStats, setSellerStats] = useState({ revenue: 0, mrr: 0, totalOrders: 0, activeSubscribers: 0, activeListings: 0 });
    const [recentOrders, setRecentOrders] = useState<any[]>([]);
    const [topListings, setTopListings] = useState<Listing[]>([]);

    // Admin State (Placeholder)


    // Modal State
    const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
    const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

    const fetchData = async () => {
        if (!token) return;
        setIsLoading(true);

        try {
            if (role === 'buyer') {
                // ... (Existing Buyer Fetch Logic)
                const [statsRes, recommendedRes] = await Promise.all([
                    fetch(`${API_URL}/orders/my-orders`, { headers: { 'Authorization': `Bearer ${token}` } }),
                    fetch(`${API_URL}/listings?status=approved&limit=2`),
                    fetch(`${API_URL}/listings?status=approved&limit=2`)
                ]);

                const statsData = await statsRes.json();
                const recData = await recommendedRes.json();

                if (statsData.status === 'success') {
                    const orders = statsData.data.orders;
                    setBuyerStats({
                        spent: orders.reduce((acc: number, o: any) => acc + o.amount, 0),
                        purchases: orders.length,
                        activeSubscriptions: orders.filter((o: any) => o.type === 'subscription' && o.status === 'active').length
                    });
                }
                if (recData.status === 'success') setRecommendedListings(recData.data.listings);

            } else if (role === 'seller') {
                // 1. Fetch Revenue Stats
                // 2. Fetch Subscription Stats
                // 3. Fetch Recent Sales
                // 4. Fetch My Listings
                try {
                    const [revRes, subRes, salesRes, listingsRes] = await Promise.all([
                        fetch(`${API_URL}/orders/revenue-stats`, { headers: { 'Authorization': `Bearer ${token}` } }),
                        fetch(`${API_URL}/subscriptions/seller-stats`, { headers: { 'Authorization': `Bearer ${token}` } }),
                        fetch(`${API_URL}/orders/sales?limit=5`, { headers: { 'Authorization': `Bearer ${token}` } }),
                        fetch(`${API_URL}/listings/my-listings`, { headers: { 'Authorization': `Bearer ${token}` } })
                    ]);

                    const revData = revRes.ok ? await revRes.json() : {};
                    const subData = subRes.ok ? await subRes.json() : {};
                    const salesData = salesRes.ok ? await salesRes.json() : {};
                    const listingsData = listingsRes.ok ? await listingsRes.json() : {};

                    const revenueStats = revData.data?.stats || { totalRevenue: 0, totalOrders: 0 };
                    const subStats = subData.data?.stats || { mrr: 0, activeSubscribers: 0 };
                    const listings = listingsData.data?.listings || [];

                    setSellerStats({
                        revenue: revenueStats.totalRevenue || 0,
                        totalOrders: revenueStats.totalOrders || 0,
                        mrr: subStats.mrr || 0,
                        activeSubscribers: subStats.activeSubscribers || 0,
                        activeListings: Array.isArray(listings) ? listings.filter((l: any) => l.status === 'approved').length : 0
                    });

                    if (salesData.status === 'success' && Array.isArray(salesData.data?.orders)) {
                        setRecentOrders(salesData.data.orders.slice(0, 5));
                    }

                    // Safe Sort
                    if (Array.isArray(listings)) {
                        setTopListings([...listings].sort((a: any, b: any) => (b.stats?.salesCount || 0) - (a.stats?.salesCount || 0)).slice(0, 3));
                    }
                } catch (innerErr) {
                    console.error("Partial fetch error in seller dashboard", innerErr);
                }
            }
            else if (role === 'admin') {
                // Placeholder admin stats
            }

        } catch (err) {
            console.error("Failed to fetch dashboard data", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [role, token]);

    // Handlers
    const handleQuickBuy = (e: React.MouseEvent, listing: Listing) => {
        e.preventDefault(); e.stopPropagation();
        setSelectedListing(listing);
        setIsPurchaseModalOpen(true);
    };
    const handlePurchaseSuccess = () => fetchData();
    const handleLike = (e: React.MouseEvent, id: string) => {
        e.preventDefault(); e.stopPropagation();
        navigate(`/listing/${id}`);
    };

    // --- RENDER HELPERS ---

    const renderSellerDashboard = () => (
        <div className="space-y-8 animate-fade-in">
            {/* Stats Overview */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-display font-bold tracking-tight">${(sellerStats.revenue || 0).toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground mt-1">+20.1% from last month</p>
                    </CardContent>
                </Card>
                <Card className="rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">MRR</CardTitle>
                        <Activity className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-display font-bold tracking-tight">${(sellerStats.mrr || 0).toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground mt-1">{sellerStats.activeSubscribers} Active Subscribers</p>
                    </CardContent>
                </Card>
                <Card className="rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Orders</CardTitle>
                        <ShoppingBag className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-display font-bold tracking-tight">{sellerStats.totalOrders}</div>
                        <p className="text-xs text-muted-foreground mt-1">+12 this week</p>
                    </CardContent>
                </Card>
                <Card className="rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Listings</CardTitle>
                        <Package className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-display font-bold tracking-tight">{sellerStats.activeListings}</div>
                        <p className="text-xs text-muted-foreground mt-1">Active on marketplace</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Content: Orders & Performance */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Recent Orders */}
                    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
                        <div className="p-6 border-b border-border/50 flex justify-between items-center bg-secondary/5">
                            <h3 className="font-display font-bold text-lg">Recent Orders</h3>
                            <Link to="/dashboard/seller/orders">
                                <Button variant="ghost" size="sm" className="text-xs">View All</Button>
                            </Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-secondary/20">
                                    <tr className="text-left text-xs text-muted-foreground uppercase tracking-wider border-b border-border/50">
                                        <th className="px-6 py-3 font-medium">Product</th>
                                        <th className="px-6 py-3 font-medium">Customer</th>
                                        <th className="px-6 py-3 font-medium">Amount</th>
                                        <th className="px-6 py-3 font-medium">Status</th>
                                        <th className="px-6 py-3 font-medium text-right">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/50">
                                    {recentOrders.length > 0 ? (
                                        recentOrders.map((order) => (
                                            <tr key={order._id} className="hover:bg-muted/10 transition-colors">
                                                <td className="px-6 py-4 font-medium">{order.listingId?.title}</td>
                                                <td className="px-6 py-4 text-muted-foreground">{order.buyerId?.profile?.firstName || 'Guest'}</td>
                                                <td className="px-6 py-4 font-mono">${order.amount.toFixed(2)}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${order.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                        order.status === 'refunded' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                                                        }`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No orders yet.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Top Performing Listings */}
                    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
                        <div className="p-6 border-b border-border/50 bg-secondary/5">
                            <h3 className="font-display font-bold text-lg">Top Performing Listings</h3>
                        </div>
                        <div className="p-6">
                            {topListings.length > 0 ? (
                                <div className="space-y-4">
                                    {topListings.map(listing => (
                                        <div key={listing._id} className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:bg-muted/10 transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-lg bg-secondary/20 flex items-center justify-center">
                                                    {listing.images?.[0] ? <img src={listing.images[0]} alt="" className="h-full w-full object-cover rounded-lg" /> : <Package className="h-6 w-6 text-muted-foreground" />}
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-foreground">{listing.title}</h4>
                                                    <p className="text-xs text-muted-foreground">{listing.pricingModel.replace('_', ' ')} • ${listing.price}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-bold font-mono text-lg">{listing.stats?.salesCount || 0}</div>
                                                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Sales</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">No listings found with sales data.</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar: Quick Actions & Alerts */}
                <div className="space-y-6">
                    {/* Quick Actions */}
                    <Card className="rounded-xl shadow-sm border-border">
                        <CardHeader>
                            <CardTitle className="text-lg">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Link to="/dashboard/seller/new" className="block">
                                <Button className="w-full justify-start" variant="primary">
                                    <Plus className="mr-2 h-4 w-4" /> Create New Listing
                                </Button>
                            </Link>
                            <Link to="/dashboard/seller/analytics" className="block">
                                <Button className="w-full justify-start" variant="outline">
                                    <BarChart3 className="mr-2 h-4 w-4" /> View Analytics
                                </Button>
                            </Link>
                            <Link to="/dashboard/seller/settings" className="block">
                                <Button className="w-full justify-start" variant="ghost">
                                    <SettingsIcon className="mr-2 h-4 w-4" /> Edit Profile
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    {/* Alerts / Tips */}
                    <Card className="rounded-xl shadow-sm border-border bg-blue-50/30 border-blue-100">
                        <CardHeader>
                            <CardTitle className="text-sm font-bold text-blue-800 flex items-center gap-2">
                                <Zap className="h-4 w-4" /> Seller Tips
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-blue-900/80 space-y-2">
                            <p>• Add high-quality screenshots to boost conversion by 30%.</p>
                            <p>• Respond to refunds within 24 hours to maintain a high rating.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );

    // --- MAIN RENDER ---

    return (
        <div className="space-y-8 font-sans max-w-7xl animate-fade-in pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-8">
                <div>
                    <h2 className="font-display font-bold text-3xl tracking-tight leading-none mb-2">Welcome, {user?.profile?.firstName || 'User'}.</h2>
                    <p className="text-muted-foreground">
                        Here's your {role} command center overview.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm">Help & Docs</Button>
                    <Link to={role === 'seller' ? '/dashboard/seller/new' : '/marketplace'}>
                        <Button size="sm">
                            {role === 'seller' ? 'Create Listing' : role === 'admin' ? 'View Logs' : 'Browse Market'}
                        </Button>
                    </Link>
                </div>
            </div>

            {isLoading ? (
                <div className="grid gap-6 md:grid-cols-3">
                    <Skeleton className="h-32 w-full rounded-xl" />
                    <Skeleton className="h-32 w-full rounded-xl" />
                    <Skeleton className="h-32 w-full rounded-xl" />
                </div>
            ) : role === 'seller' ? (
                renderSellerDashboard()
            ) : (
                // Return original Buyer View (simplified for brevity here, but conceptually the same)
                <div className="grid gap-6 md:grid-cols-3">
                    {/* Buyer Stats Cards */}
                    <Card className="rounded-xl shadow-sm bg-background">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Spent</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent><div className="text-3xl font-display font-bold">${buyerStats.spent.toLocaleString()}</div></CardContent>
                    </Card>
                    <Card className="rounded-xl shadow-sm bg-background">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Purchases</CardTitle>
                            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent><div className="text-3xl font-display font-bold">{buyerStats.purchases}</div></CardContent>
                    </Card>
                    <Card className="rounded-xl shadow-sm bg-background">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Subscriptions</CardTitle>
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent><div className="text-3xl font-display font-bold">{buyerStats.activeSubscriptions} Active</div></CardContent>
                    </Card>

                    <div className="md:col-span-3 lg:col-span-2 space-y-8 mt-4">
                        {/* Buyer Recommended Logic */}
                        {recommendedListings.length > 0 && (
                            <div>
                                <h3 className="font-display font-bold text-xl mb-4 flex items-center gap-2"><Zap className="h-5 w-5 text-yellow-500 fill-current" /> Recommended</h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    {recommendedListings.map(l => (
                                        <ListingCard key={l._id} listing={l} onClick={id => navigate(`/listing/${id}`)} onLike={(e) => handleLike(e, l._id)} isLiked={false} actionSlot={<Button size="sm" className="w-full mt-2" onClick={(e) => handleQuickBuy(e, l)}>Buy Now</Button>} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Purchase Modal Helper */}
            {selectedListing && (
                <PurchaseModal
                    isOpen={isPurchaseModalOpen}
                    onClose={() => setIsPurchaseModalOpen(false)}
                    listingTitle={selectedListing.title}
                    price={selectedListing.price}
                    listingId={selectedListing._id}
                    onSuccess={handlePurchaseSuccess}
                    pricingModel={selectedListing.pricingModel}
                />
            )}
        </div>
    );
}
