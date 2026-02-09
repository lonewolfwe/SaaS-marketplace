import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Menu, X, Github, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function MainLayout() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="min-h-screen flex flex-col bg-background font-sans text-foreground selection:bg-primary/20 selection:text-primary">
            {/* Navbar */}
            <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link to="/" className="font-display font-bold text-xl tracking-tighter">
                            Marketplace<span className="text-primary">.</span>
                        </Link>

                        {/* Desktop Nav */}
                        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
                            <Link to="/marketplace" className="transition-colors hover:text-foreground">Marketplace</Link>
                            <Link to="/features" className="transition-colors hover:text-foreground">Features</Link>
                            <Link to="/pricing" className="transition-colors hover:text-foreground">Pricing</Link>
                            <Link to="/about" className="transition-colors hover:text-foreground">About</Link>
                        </nav>
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                        <Link to="/login" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                            Log in
                        </Link>
                        <Link to="/register">
                            <Button size="sm">Get Started</Button>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 -mr-2 rounded-md hover:bg-secondary text-muted-foreground"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>

                {/* Mobile Nav */}
                {isMenuOpen && (
                    <div className="md:hidden border-b border-border bg-background">
                        <div className="container mx-auto px-6 py-4 flex flex-col gap-4 text-sm">
                            <Link to="/marketplace" className="font-medium hover:text-primary py-2">Marketplace</Link>
                            <Link to="/features" className="font-medium hover:text-primary py-2">Features</Link>
                            <Link to="/pricing" className="font-medium hover:text-primary py-2">Pricing</Link>
                            <Link to="/about" className="font-medium hover:text-primary py-2">About</Link>
                            <div className="flex flex-col gap-3 pt-4 border-t border-border">
                                <Link to="/login" className="text-center py-2 font-medium">Log in</Link>
                                <Link to="/register">
                                    <Button className="w-full">Get Started</Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="border-t border-border bg-background pt-16 pb-8">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                        <div className="col-span-2 md:col-span-1">
                            <Link to="/" className="font-display font-bold text-xl tracking-tighter mb-4 block">
                                Marketplace<span className="text-primary">.</span>
                            </Link>
                            <div className="flex gap-4 mt-6">
                                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors"><Twitter className="h-5 w-5" /></a>
                                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors"><Github className="h-5 w-5" /></a>
                            </div>
                        </div>
                        <div>
                            <h3 className="font-medium text-foreground mb-4">Platform</h3>
                            <ul className="space-y-3 text-sm text-muted-foreground">
                                <li><Link to="/marketplace" className="hover:text-foreground transition-colors">Browse</Link></li>
                                <li><Link to="/register" className="hover:text-foreground transition-colors">Sell</Link></li>
                                <li><Link to="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
                                <li><Link to="/features" className="hover:text-foreground transition-colors">Features</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-medium text-foreground mb-4">Support</h3>
                            <ul className="space-y-3 text-sm text-muted-foreground">
                                <li><Link to="#" className="hover:text-foreground transition-colors">Documentation</Link></li>
                                <li><Link to="#" className="hover:text-foreground transition-colors">API</Link></li>
                                <li><Link to="#" className="hover:text-foreground transition-colors">Contact</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-medium text-foreground mb-4">Legal</h3>
                            <ul className="space-y-3 text-sm text-muted-foreground">
                                <li><Link to="#" className="hover:text-foreground transition-colors">Privacy</Link></li>
                                <li><Link to="#" className="hover:text-foreground transition-colors">Terms</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-border pt-8 text-center md:text-left text-sm text-muted-foreground">
                        © 2026 SaaS Marketplace. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}
