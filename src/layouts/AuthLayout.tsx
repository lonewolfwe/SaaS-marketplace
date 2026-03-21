import { Outlet, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export default function AuthLayout() {
    return (
        <div className="min-h-screen bg-background flex flex-col justify-center items-center p-6 relative font-sans">
            <Link to="/" className="absolute top-8 left-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ChevronLeft className="h-4 w-4" />
                Back to Home
            </Link>

            <div className="w-full max-w-md">
                <div className="mb-10 text-center">
                    <Link to="/" className="font-display font-bold text-2xl tracking-tighter">
                        Marketplace<span className="text-primary">.</span>
                    </Link>
                </div>

                <Outlet />
            </div>

            <div className="absolute bottom-6 text-center text-[10px] text-muted-foreground">
                All rights reserved.
            </div>
        </div>
    );
}
