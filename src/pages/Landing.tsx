import { Link } from 'react-router-dom';
import { ArrowRight, Check, TrendingUp, ShieldCheck, PieChart, Users, Globe, Lock, Cpu, BarChart3, ArrowUpRight } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { useRef } from 'react';

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

export default function Landing() {
    const targetRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start end", "end start"]
    });

    const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
    const y = useTransform(scrollYProgress, [0, 0.5], [100, 0]);

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground overflow-x-hidden font-sans selection:bg-foreground/10 selection:text-foreground">

            {/* --- SECTION 1: HERO (High Impact) --- */}
            <section className="relative min-h-[90vh] flex flex-col justify-center px-6 pt-20">
                <div className="container mx-auto max-w-6xl relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="max-w-4xl"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 border border-border/50 text-xs font-mono mb-8 text-muted-foreground">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            v2.0 Now Live
                        </div>
                        <h1 className="font-display font-semibold text-6xl md:text-8xl lg:text-9xl tracking-tighter leading-[0.9] text-foreground mb-8">
                            The infrastructure <br />
                            <span className="text-muted-foreground/60">for digital exits.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-xl mb-12 font-light">
                            Buy and sell production-ready SaaS businesses with
                            enterprise-grade due diligence and instant escrow.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 items-start">
                            <Link to="/marketplace">
                                <Button size="lg" className="rounded-full h-14 px-8 text-base bg-foreground text-background hover:bg-foreground/90 transition-all">
                                    Explore Marketplace
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                            <Link to="/register">
                                <Button variant="ghost" size="lg" className="rounded-full h-14 px-8 text-base hover:bg-secondary/80">
                                    List Your Startup
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>

                {/* Abstract Background Elements */}
                <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-gradient-to-bl from-primary/5 via-transparent to-transparent blur-3xl rounded-full pointer-events-none -z-10" />
            </section>


            {/* --- SECTION 2: PRODUCT VALUE NARRATIVE --- */}
            <section className="py-32 px-6 border-t border-border/20">
                <div className="container mx-auto max-w-5xl">
                    <FadeIn>
                        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight mb-16 max-w-4xl">
                            Building a SaaS is hard. <br />
                            <span className="text-muted-foreground">Exiting shouldn't be a second job.</span>
                        </h2>
                    </FadeIn>

                    <div className="grid md:grid-cols-2 gap-16 md:gap-32">
                        <FadeIn delay={0.1}>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Most marketplaces are cluttered bulletin boards. We built an operating system that verifies metrics, audits code quality, and automates the legal transfer of assets.
                            </p>
                        </FadeIn>
                        <FadeIn delay={0.2}>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Whether you're a founder looking for liquidy or an acquirer seeking product-market fit, our platform removes the asymmetry of information.
                            </p>
                        </FadeIn>
                    </div>
                </div>
            </section>


            {/* --- SECTION 3: PRODUCT CAPABILITY SHOWCASE (Bento Grid) --- */}
            <section className="py-32 px-6 bg-secondary/20">
                <div className="container mx-auto max-w-7xl">
                    <div className="mb-20">
                        <h3 className="text-sm font-mono uppercase tracking-widest text-muted-foreground mb-4">Platform Capabilities</h3>
                        <h2 className="font-display text-4xl md:text-5xl tracking-tight">Everything you need to close.</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[400px]">

                        {/* Card 1: AI Discovery */}
                        <FadeIn className="md:col-span-2 group relative bg-background rounded-3xl border border-border/40 overflow-hidden p-8 flex flex-col justify-between hover:border-border/80 transition-colors">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative z-10">
                                <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
                                    <Cpu size={20} />
                                </div>
                                <h4 className="text-2xl font-bold mb-2">AI-Powered Due Diligence</h4>
                                <p className="text-muted-foreground max-w-md">Our engine analyzes Stripe data, GitHub repos, and traffic sources to generate an unbiased health score for every listing.</p>
                            </div>
                            {/* Visual Abstract */}
                            <div className="relative w-full h-32 mt-8 bg-secondary/30 rounded-xl border border-border/50 overflow-hidden flex items-center px-4 gap-4 mask-fade-right">
                                <div className="h-2 w-16 bg-primary/20 rounded-full" />
                                <div className="h-2 w-24 bg-primary/10 rounded-full" />
                                <div className="h-2 w-8 bg-primary/40 rounded-full" />
                            </div>
                        </FadeIn>

                        {/* Card 2: Analytics */}
                        <FadeIn delay={0.1} className="group relative bg-background rounded-3xl border border-border/40 overflow-hidden p-8 flex flex-col justify-between hover:border-border/80 transition-colors">
                            <div className="h-10 w-10 bg-green-500/10 rounded-full flex items-center justify-center text-green-600 mb-6">
                                <BarChart3 size={20} />
                            </div>
                            <div>
                                <h4 className="text-2xl font-bold mb-2">Live MRR</h4>
                                <p className="text-muted-foreground">Real-time revenue verification directly from payment processors.</p>
                            </div>
                            <div className="mt-8 flex items-end gap-1 h-32 opacity-50">
                                {[40, 65, 55, 80, 95, 120, 110].map((h, i) => (
                                    <div key={i} style={{ height: `${h}px` }} className="flex-1 bg-foreground/10 rounded-t-sm" />
                                ))}
                            </div>
                        </FadeIn>

                        {/* Card 3: Global Escrow */}
                        <FadeIn delay={0.2} className="group relative bg-background rounded-3xl border border-border/40 overflow-hidden p-8 flex flex-col justify-between hover:border-border/80 transition-colors">
                            <div className="h-10 w-10 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-600 mb-6">
                                <Globe size={20} />
                            </div>
                            <div>
                                <h4 className="text-2xl font-bold mb-2">Global Escrow</h4>
                                <p className="text-muted-foreground">Secure layout holding in 140+ currencies.</p>
                            </div>
                            <div className="mt-8 relative h-32 w-full flex items-center justify-center">
                                <div className="h-24 w-24 rounded-full border border-border/60 flex items-center justify-center">
                                    <div className="h-16 w-16 rounded-full border border-border flex items-center justify-center bg-secondary/20">
                                        <Lock size={16} className="text-muted-foreground" />
                                    </div>
                                </div>
                            </div>
                        </FadeIn>

                        {/* Card 4: Security */}
                        <FadeIn delay={0.3} className="md:col-span-2 group relative bg-background rounded-3xl border border-border/40 overflow-hidden p-8 flex flex-col justify-between hover:border-border/80 transition-colors">
                            <div className="absolute inset-0 bg-gradient-to-tl from-purple-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative z-10 text-right md:text-left">
                                <div className="h-10 w-10 bg-purple-500/10 rounded-full flex items-center justify-center text-purple-600 mb-6 ml-auto md:ml-0">
                                    <ShieldCheck size={20} />
                                </div>
                                <h4 className="text-2xl font-bold mb-2">Enterprise-Grade Transfer</h4>
                                <p className="text-muted-foreground max-w-md ml-auto md:ml-0">Automated asset migration for AWS, Vercel, and Cloudflare. We handle the DNS propagation and credential rotation.</p>
                            </div>
                            <div className="relative w-full h-32 mt-8 flex flex-col gap-2 opacity-60">
                                <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground border-b border-border/50 pb-2">
                                    <span className="text-green-500">✓</span> DNS Records verified
                                </div>
                                <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground border-b border-border/50 pb-2">
                                    <span className="text-green-500">✓</span> Repository access granted
                                </div>
                                <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                                    <span className="text-green-500">✓</span> Stripe ownership transferred
                                </div>
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </section>


            {/* --- SECTION 4: SOCIAL PROOF --- */}
            <section className="py-24 px-6 border-b border-border/40">
                <div className="container mx-auto max-w-6xl">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-12">
                        <div className="max-w-xs">
                            <h3 className="font-bold text-xl mb-2">Trusted by modern founders</h3>
                            <p className="text-sm text-muted-foreground">From indie hackers to VC-backed scalers.</p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-8 md:gap-16 grayscale opacity-40 hover:opacity-100 transition-opacity duration-500">
                            {/* Mock Logos */}
                            {['Acme Corp', 'Layers', 'Circool', 'Sisyphus', 'Catalog'].map(name => (
                                <span key={name} className="text-lg font-bold font-display tracking-tight">{name}</span>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-24">
                        {[
                            { label: 'Transaction Volume', value: '$140M+' },
                            { label: 'Active Buyers', value: '12k+' },
                            { label: 'Avg. Sale Time', value: '14 Days' },
                            { label: 'Success Rate', value: '98%' },
                        ].map(stat => (
                            <div key={stat.label} className="text-center md:text-left">
                                <div className="text-3xl md:text-4xl font-bold mb-1 tracking-tight">{stat.value}</div>
                                <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


            {/* --- SECTION 6: PRICING TEASER --- */}
            <section className="py-32 px-6">
                <div className="container mx-auto max-w-5xl">
                    <div className="text-center mb-20">
                        <h2 className="font-display text-4xl md:text-5xl mb-6">Simple, transparent pricing.</h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            No hidden fees. No retainer. You only pay when you succeed.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <div className="p-8 rounded-3xl border border-border/60 bg-secondary/10 flex flex-col">
                            <h3 className="text-xl font-bold mb-2">Buyers</h3>
                            <div className="text-4xl font-display font-bold mb-6">0% <span className="text-lg font-sans font-normal text-muted-foreground">platform fee</span></div>
                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex items-center gap-3 text-sm">
                                    <Check size={16} className="text-primary" /> Free access to marketplace
                                </li>
                                <li className="flex items-center gap-3 text-sm">
                                    <Check size={16} className="text-primary" /> Full due diligence reports
                                </li>
                                <li className="flex items-center gap-3 text-sm">
                                    <Check size={16} className="text-primary" /> Instant escrow setup
                                </li>
                            </ul>
                            <Link to="/register">
                                <Button className="w-full rounded-full" variant="outline">Create Buyer Account</Button>
                            </Link>
                        </div>

                        <div className="p-8 rounded-3xl border border-border bg-background shadow-xl scale-105 relative">
                            <div className="absolute top-0 right-0 bg-foreground text-background text-[10px] font-bold px-3 py-1 rounded-bl-xl rounded-tr-2xl uppercase tracking-widest">
                                Most Popular
                            </div>
                            <h3 className="text-xl font-bold mb-2">Sellers</h3>
                            <div className="text-4xl font-display font-bold mb-6">10% <span className="text-lg font-sans font-normal text-muted-foreground">success fee</span></div>
                            <p className="text-sm text-muted-foreground mb-6">Lower fees for deals over $100k.</p>
                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex items-center gap-3 text-sm">
                                    <Check size={16} className="text-green-600" /> Listing optimization
                                </li>
                                <li className="flex items-center gap-3 text-sm">
                                    <Check size={16} className="text-green-600" /> Private marketplace access
                                </li>
                                <li className="flex items-center gap-3 text-sm">
                                    <Check size={16} className="text-green-600" /> Dedicated exit advisor
                                </li>
                            </ul>
                            <Link to="/register">
                                <Button className="w-full rounded-full bg-foreground text-background hover:bg-foreground/90">Start Selling</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>


            {/* --- SECTION 7: FINAL CONVERSION --- */}
            <section className="py-32 px-6 border-t border-border">
                <div className="container mx-auto max-w-4xl text-center">
                    <FadeIn>
                        <h2 className="font-display font-bold text-6xl md:text-8xl tracking-tighter mb-12">
                            Ready to exit?
                        </h2>
                        <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
                            Join over 12,000 founders and acquirers on the most trusted marketplace for software.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to="/marketplace">
                                <Button size="lg" className="h-16 px-10 rounded-full text-lg bg-foreground text-background hover:bg-foreground/90 transition-all shadow-2xl shadow-foreground/20">
                                    Get Started Now
                                </Button>
                            </Link>
                        </div>
                        <p className="mt-8 text-xs text-muted-foreground">
                            No credit card required for browsing. Verification required for listing.
                        </p>
                    </FadeIn>
                </div>
            </section>


            {/* --- FOOTER --- */}
            <footer className="py-12 border-t border-border bg-secondary/5">
                <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="h-6 w-6 bg-foreground rounded text-background flex items-center justify-center font-bold text-xs">
                            S
                        </div>
                        <span className="font-bold text-sm tracking-tight">SaaS Marketplace</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                        © 2026 Kaustubh Deshmukh. All rights reserved.
                    </div>
                    <div className="flex gap-6 text-xs font-mono uppercase tracking-widest text-muted-foreground">
                        <Link to="#" className="hover:text-foreground transition-colors">Twitter</Link>
                        <Link to="#" className="hover:text-foreground transition-colors">LinkedIn</Link>
                        <Link to="#" className="hover:text-foreground transition-colors">Github</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
