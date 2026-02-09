import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    ShoppingBag,
    Settings,
    LogOut,
    Menu,
    Package,
    Users,
    LineChart,
    CreditCard,
    Bell,
    Search,
    Shield
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/Button';

export default function DashboardLayout() {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const location = useLocation();
    const { user, logout } = useAuth();

    // Fallback if no user
    const role = user?.roles?.[0] || 'buyer';

    const getNavItems = (role: string) => {
        switch (role) {
            case 'buyer':
                return [
                    { icon: LayoutDashboard, label: 'Overview', path: '/dashboard/buyer/overview' },
                    { icon: ShoppingBag, label: 'Purchases', path: '/dashboard/buyer/purchases' },
                    { icon: CreditCard, label: 'Subscriptions', path: '/dashboard/buyer/subscriptions' },
                    { icon: Settings, label: 'Settings', path: '/dashboard/buyer/settings' },
                ];
            case 'seller':
                return [
                    { icon: LayoutDashboard, label: 'Overview', path: '/dashboard/seller/overview' },
                    { icon: Package, label: 'Listings', path: '/dashboard/seller/listings' },
                    { icon: ShoppingBag, label: 'Orders', path: '/dashboard/seller/orders' },
                    { icon: LineChart, label: 'Analytics', path: '/dashboard/seller/analytics' },
                    { icon: Settings, label: 'Settings', path: '/dashboard/seller/settings' },
                ];
            case 'admin':
                return [
                    { icon: LayoutDashboard, label: 'Overview', path: '/dashboard/admin/overview' },
                    { icon: Users, label: 'Users', path: '/dashboard/admin/users' },
                    { icon: ShoppingBag, label: 'Orders', path: '/dashboard/admin/orders' },
                    { icon: Package, label: 'Listings', path: '/dashboard/admin/listings' },
                    { icon: LineChart, label: 'Platform Stats', path: '/dashboard/admin/stats' },
                    { icon: Settings, label: 'Settings', path: '/dashboard/admin/settings' },
                ];
            default:
                return [];
        }
    };

    const navItems = getNavItems(role);

    return (
        <div className="min-h-screen bg-background flex font-sans text-foreground">
            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-40 w-64 bg-background border-r border-border transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static flex flex-col",
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="h-16 flex items-center px-6 border-b border-border/40">
                    <Link to={`/dashboard/${role}`} className="font-display font-bold text-lg tracking-tighter">
                        Marketplace<span className="text-primary">.</span>
                    </Link>
                </div>

                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                    {/* User Profile Snippet */}
                    <div className="px-2 py-2 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-muted-foreground border border-border">
                                {role === 'admin' ? <Shield className="h-4 w-4" /> : user?.profile?.firstName?.[0] || 'U'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">
                                    {user?.profile?.firstName ? `${user.profile.firstName} ${user.profile.lastName}` : 'Guest User'}
                                </p>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{role}</p>
                            </div>
                        </div>
                    </div>

                    <div className="px-2 pb-2">
                        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-2">Platform</p>
                    </div>

                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname.startsWith(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={cn(
                                    "group flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-200",
                                    isActive
                                        ? "bg-secondary text-foreground font-medium"
                                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                                )}
                            >
                                <Icon className={cn("h-4 w-4 transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                                {item.label}
                            </Link>
                        )
                    })}
                </div>

                <div className="p-4 border-t border-border/40">
                    <button
                        onClick={logout}
                        className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                    >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-secondary/10">
                {/* Topbar */}
                <header className="h-16 bg-background border-b border-border/40 flex items-center justify-between px-6 sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <button
                            className="lg:hidden p-2 -ml-2 rounded-md hover:bg-secondary text-muted-foreground"
                            onClick={() => setSidebarOpen(!isSidebarOpen)}
                        >
                            <Menu className="h-5 w-5" />
                        </button>

                        <div className="hidden md:flex items-center gap-2 w-64">
                            <Search className="h-4 w-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="bg-transparent border-none outline-none text-sm w-full placeholder:text-muted-foreground font-medium"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground relative">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background"></span>
                        </Button>
                    </div>
                </header>

                <main className="flex-1 p-6 lg:p-10 overflow-y-auto w-full max-w-[1600px] mx-auto">
                    <Outlet />
                </main>
            </div>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
}
