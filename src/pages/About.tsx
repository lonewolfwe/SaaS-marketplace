import { motion } from 'framer-motion';

export default function About() {

    return (
        <div className="min-h-screen bg-background font-sans py-24 px-6 md:px-12">

            {/* Mission Header */}
            <div className="container mx-auto max-w-5xl mb-32 border-b border-border/40 pb-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-3xl"
                >
                    <h4 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-8">Our Mission</h4>
                    <h1 className="font-display font-medium text-4xl md:text-6xl md:leading-[1.1] tracking-tight mb-8">
                        To build the trust layer for the internet's GDP.
                    </h1>
                    <p className="text-xl text-muted-foreground font-light leading-relaxed max-w-2xl">
                        We believe buying a software business should be as safe, transparent, and simple as buying a share of stock. We are engineering the infrastructure to make that inevitable.
                    </p>
                </motion.div>
            </div>

            {/* Content Section */}
            <div className="container mx-auto max-w-5xl space-y-12 text-lg text-muted-foreground leading-relaxed">
                <p>
                    Our platform is engineered by a dedicated team of software architects and security experts committed to modernizing the way SaaS businesses are traded. We prioritize automation, verification, and absolute transparency in every transaction.
                </p>
                <p>
                    By combining real-time financial auditing with automated code quality reports, we provide both buyers and sellers with the data they need to exit with confidence.
                </p>
            </div>

            {/* Values Grid */}
            <div className="container mx-auto max-w-6xl mt-40 pt-24 border-t border-border/40">
                <div className="grid md:grid-cols-3 gap-12">
                    <div>
                        <h3 className="font-bold text-lg mb-4">Transparency</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            We believe in radical transparency. From our pricing to our code audits, we hide nothing.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg mb-4">Engineering First</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            We solve problems with code, not manual workflows. Scalability is our default state.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg mb-4">Long Term</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            We aren't optimizing for the quick flip. We are building the infrastructure for the next decade of digital commerce.
                        </p>
                    </div>
                </div>
            </div>

        </div>
    );
}
