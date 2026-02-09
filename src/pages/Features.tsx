import { Zap, Shield, Globe, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const FadeIn = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
        className={className}
    >
        {children}
    </motion.div>
);

export default function Features() {
    return (
        <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary/10">

            {/* Header */}
            <header className="pt-32 pb-24 px-6 border-b border-border/40">
                <div className="container mx-auto max-w-5xl text-center">
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="font-display font-bold text-5xl md:text-7xl mb-8 tracking-tighter"
                    >
                        The Operating System <br />
                        <span className="text-muted-foreground">for SaaS Acquisition.</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light"
                    >
                        We rebuilt the acquisition stack from the ground up.
                        Identity verification, escrow, and legal transfer in one unified platform.
                    </motion.p>
                </div>
            </header>

            {/* Core Pillars - Narrative Blocks */}
            <div className="divide-y divide-border/40">

                {/* 1. Global Marketplace */}
                <section className="py-32 px-6">
                    <div className="container mx-auto max-w-6xl">
                        <div className="grid md:grid-cols-2 gap-16 md:gap-32 items-center">
                            <FadeIn>
                                <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-8">
                                    <Globe size={24} />
                                </div>
                                <h2 className="font-display font-bold text-4xl mb-6">Global reach, local compliance.</h2>
                                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                                    Access a highly liquid market of verified buyers from 140+ countries. Our platform automatically handles currency conversion, tax compliance, and identity verification, so you can focus on the deal.
                                </p>
                                <ul className="space-y-4">
                                    {['KYC/AML Automation', 'Multi-currency Escrow', 'Cross-border Legal Templates'].map(item => (
                                        <li key={item} className="flex items-center gap-3 font-medium">
                                            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </FadeIn>
                            <FadeIn delay={0.2}>
                                <div className="aspect-square bg-secondary/20 rounded-3xl border border-border/60 overflow-hidden relative group">
                                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-50" />
                                    {/* Abstract UI Map */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-3/4 h-3/4 bg-background rounded-2xl shadow-2xl border border-border/80 p-6 flex flex-col gap-4 group-hover:scale-105 transition-transform duration-700">
                                            <div className="flex justify-between items-center border-b border-border/50 pb-4">
                                                <div className="flex gap-2">
                                                    <div className="h-3 w-3 rounded-full bg-red-400" />
                                                    <div className="h-3 w-3 rounded-full bg-yellow-400" />
                                                    <div className="h-3 w-3 rounded-full bg-green-400" />
                                                </div>
                                                <div className="text-xs font-mono text-muted-foreground">compliance_check.ts</div>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="h-2 w-full bg-secondary rounded-full" />
                                                <div className="h-2 w-2/3 bg-secondary rounded-full" />
                                                <div className="h-2 w-5/6 bg-secondary rounded-full" />
                                            </div>
                                            <div className="mt-auto flex justify-between items-center bg-green-500/10 p-3 rounded-lg border border-green-500/20 text-green-600 text-sm font-mono font-bold">
                                                <span>STATUS</span>
                                                <span>VERIFIED</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </FadeIn>
                        </div>
                    </div>
                </section>

                {/* 2. Security First */}
                <section className="py-32 px-6 bg-secondary/5">
                    <div className="container mx-auto max-w-6xl">
                        <div className="grid md:grid-cols-2 gap-16 md:gap-32 items-center">
                            <FadeIn className="order-2 md:order-1">
                                <div className="aspect-square bg-background rounded-3xl border border-border/60 overflow-hidden relative group">
                                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent opacity-50" />
                                    {/* Abstract UI Shield */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="h-48 w-48 rounded-full border-[20px] border-secondary/50 flex items-center justify-center relative">
                                            <Shield size={64} className="text-foreground/80" />
                                            <div className="absolute -top-2 -right-2 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg">SECURE</div>
                                        </div>
                                    </div>
                                </div>
                            </FadeIn>
                            <FadeIn delay={0.2} className="order-1 md:order-2">
                                <div className="h-12 w-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-600 mb-8">
                                    <Shield size={24} />
                                </div>
                                <h2 className="font-display font-bold text-4xl mb-6">Institutional grade security.</h2>
                                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                                    We don't just facilitate payments. We secure the entire asset transfer. From domain escrow to AWS account migration, our automated workflows ensure you never lose control.
                                </p>
                                <ul className="space-y-4">
                                    {['SOC 2 Compliant Infrastructure', 'Encrypted Data Rooms', 'Role-Based Access Control'].map(item => (
                                        <li key={item} className="flex items-center gap-3 font-medium">
                                            <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </FadeIn>
                        </div>
                    </div>
                </section>

                {/* 3. Valuation & Data */}
                <section className="py-32 px-6">
                    <div className="container mx-auto max-w-6xl">
                        <div className="grid md:grid-cols-2 gap-16 md:gap-32 items-center">
                            <FadeIn>
                                <div className="h-12 w-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-600 mb-8">
                                    <Zap size={24} />
                                </div>
                                <h2 className="font-display font-bold text-4xl mb-6">Valuation based on truth.</h2>
                                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                                    Stop guessing. Connect your Stripe and App Store accounts to get an instant, data-driven valuation range based on real-time churn, LTV, and MRR metrics.
                                </p>
                                <ul className="space-y-4">
                                    {['Real-time Stripe Integration', 'Churn & LTV Analysis', 'Comparable Market Data'].map(item => (
                                        <li key={item} className="flex items-center gap-3 font-medium">
                                            <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </FadeIn>
                            <FadeIn delay={0.2}>
                                <div className="aspect-square bg-secondary/20 rounded-3xl border border-border/60 overflow-hidden relative group">
                                    {/* Abstract Chart */}
                                    <div className="absolute inset-0 p-12 flex items-end gap-2">
                                        {[30, 45, 40, 60, 55, 75, 90, 85, 100].map((h, i) => (
                                            <div key={i} className="flex-1 bg-foreground rounded-t-sm opacity-20 group-hover:opacity-100 transition-opacity duration-500" style={{ height: `${h}%`, transitionDelay: `${i * 50}ms` }} />
                                        ))}
                                    </div>
                                </div>
                            </FadeIn>
                        </div>
                    </div>
                </section>
            </div>

            {/* Final CTA */}
            <section className="py-32 px-6 border-t border-border/40">
                <div className="container mx-auto max-w-4xl text-center">
                    <h2 className="font-display font-bold text-4xl md:text-5xl mb-8 tracking-tight">Ready to close the deal?</h2>
                    <div className="flex gap-4 justify-center">
                        <Link to="/marketplace">
                            <Button size="lg" className="rounded-full h-14 px-8 text-base">
                                View Marketplace <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
