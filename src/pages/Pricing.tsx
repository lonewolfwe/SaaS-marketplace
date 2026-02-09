import { Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Pricing() {
    return (
        <div className="min-h-screen bg-background font-sans text-foreground py-24 px-6">
            <div className="container mx-auto px-6 text-center mb-24 max-w-4xl">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-display font-bold text-5xl md:text-6xl mb-6 tracking-tighter"
                >
                    Pay only when you succeed.
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-xl text-muted-foreground font-light leading-relaxed"
                >
                    Zero upfront fees for listing. Simple, transparent commissions on successful transfers.
                </motion.p>
            </div>

            {/* Pricing Tiers */}
            <div className="container mx-auto max-w-6xl mb-32">
                <div className="grid md:grid-cols-3 gap-8 items-start">

                    {/* Free Tier */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="p-8 rounded-3xl border border-border/60 bg-card/50 backdrop-blur-sm"
                    >
                        <div className="mb-6">
                            <h3 className="font-bold text-xl mb-1">Buyer Access</h3>
                            <p className="text-muted-foreground text-sm">For individuals and micro-funds.</p>
                        </div>
                        <div className="mb-8 flex items-baseline gap-1">
                            <span className="text-4xl font-display font-bold">0%</span>
                            <span className="text-muted-foreground font-medium">platform fee</span>
                        </div>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-start gap-3 text-sm"><Check className="w-5 h-5 text-green-500 shrink-0" /> Full marketplace access</li>
                            <li className="flex items-start gap-3 text-sm"><Check className="w-5 h-5 text-green-500 shrink-0" /> Due diligence data rooms</li>
                            <li className="flex items-start gap-3 text-sm"><Check className="w-5 h-5 text-green-500 shrink-0" /> Instant escrow setup</li>
                            <li className="flex items-start gap-3 text-sm"><Check className="w-5 h-5 text-green-500 shrink-0" /> Basic legal templates</li>
                        </ul>
                        <Link to="/register"><Button variant="outline" className="w-full rounded-xl h-12">Create Account</Button></Link>
                    </motion.div>

                    {/* Pro Tier (Seller) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="p-8 rounded-3xl border border-primary/20 bg-primary/5 relative ring-1 ring-primary/10 shadow-xl"
                    >
                        <div className="absolute top-4 right-4 bg-primary/10 text-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-primary/20">
                            Most Popular
                        </div>
                        <div className="mb-6">
                            <h3 className="font-bold text-xl mb-1 text-foreground">Seller Success</h3>
                            <p className="text-muted-foreground text-sm">For founders exiting their business.</p>
                        </div>
                        <div className="mb-8 flex items-baseline gap-1">
                            <span className="text-4xl font-display font-bold">10%</span>
                            <span className="text-muted-foreground font-medium">success commission</span>
                        </div>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-start gap-3 text-sm"><Check className="w-5 h-5 text-primary shrink-0" /> No upfront listing fees</li>
                            <li className="flex items-start gap-3 text-sm"><Check className="w-5 h-5 text-primary shrink-0" /> Verified buyer matching</li>
                            <li className="flex items-start gap-3 text-sm"><Check className="w-5 h-5 text-primary shrink-0" /> Automated asset transfer</li>
                            <li className="flex items-start gap-3 text-sm"><Check className="w-5 h-5 text-primary shrink-0" /> Dedicated success manager</li>
                        </ul>
                        <Link to="/register"><Button className="w-full rounded-xl h-12 text-base">List Your Startup</Button></Link>
                    </motion.div>

                    {/* Enterprise Tier */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="p-8 rounded-3xl border border-border/60 bg-card/50 backdrop-blur-sm"
                    >
                        <div className="mb-6">
                            <h3 className="font-bold text-xl mb-1">M&A & Brokerage</h3>
                            <p className="text-muted-foreground text-sm">For high-volume partners.</p>
                        </div>
                        <div className="mb-8 flex items-baseline gap-1">
                            <span className="text-4xl font-display font-bold">Custom</span>
                        </div>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-start gap-3 text-sm"><Check className="w-5 h-5 text-foreground shrink-0" /> Private marketplace access</li>
                            <li className="flex items-start gap-3 text-sm"><Check className="w-5 h-5 text-foreground shrink-0" /> White-label deal rooms</li>
                            <li className="flex items-start gap-3 text-sm"><Check className="w-5 h-5 text-foreground shrink-0" /> Custom legal frameworks</li>
                            <li className="flex items-start gap-3 text-sm"><Check className="w-5 h-5 text-foreground shrink-0" /> API Access</li>
                        </ul>
                        <Link to="/about"><Button variant="ghost" className="w-full rounded-xl h-12 border border-border/40 hover:bg-secondary">Contact Sales</Button></Link>
                    </motion.div>
                </div>
            </div>

            {/* Minimal Comparison Table */}
            <div className="container mx-auto max-w-4xl border-t border-border/40 pt-24">
                <h3 className="font-display font-bold text-2xl mb-12 text-center">Feature Breakdown</h3>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px] text-sm text-left">
                        <thead className="bg-transparent border-b border-border/60">
                            <tr>
                                <th className="py-4 font-medium text-muted-foreground w-1/3">Feature</th>
                                <th className="py-4 font-bold text-center w-1/5">Free</th>
                                <th className="py-4 font-bold text-center w-1/5 text-primary">Seller</th>
                                <th className="py-4 font-bold text-center w-1/5">Enterprise</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/20">
                            {[
                                { name: 'Verified Listings', free: true, pro: true, ent: true },
                                { name: 'Escrow Protection', free: true, pro: true, ent: true },
                                { name: 'Identity Verified', free: true, pro: true, ent: true },
                                { name: 'Private Deal Rooms', free: false, pro: true, ent: true },
                                { name: 'Listing Optimization', free: false, pro: true, ent: true },
                                { name: 'API Access', free: false, pro: false, ent: true },
                                { name: 'White Label', free: false, pro: false, ent: true },
                            ].map((row) => (
                                <tr key={row.name} className="hover:bg-secondary/20 transition-colors">
                                    <td className="py-4 font-medium">{row.name}</td>
                                    <td className="py-4 text-center">
                                        {row.free ? <Check className="w-4 h-4 mx-auto text-green-500" /> : <span className="text-muted-foreground/30">—</span>}
                                    </td>
                                    <td className="py-4 text-center">
                                        {row.pro ? <Check className="w-4 h-4 mx-auto text-primary" /> : <span className="text-muted-foreground/30">—</span>}
                                    </td>
                                    <td className="py-4 text-center">
                                        {row.ent ? <Check className="w-4 h-4 mx-auto text-foreground" /> : <span className="text-muted-foreground/30">—</span>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
