import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import DhanajayImg from '@/assets/images/team/dhanajay-birari.jpeg';
import KaustubhImg from '@/assets/images/team/kaustubh-deshmukh.jpg';

export default function About() {
    const developers = [
        {
            name: "Dhanajay G. Birari",
            role: "Systems Architect & Backend Lead",
            focus: "Marketplace Core",
            location: "Nashik, India",
            education: "Computer Science, Guru Gobind Singh College of Engineering",
            description: "Specializing in high-scale distributed systems and secure commercial workflows. Responsible for the unified seller backend and common commerce infrastructure.",
            image: DhanajayImg,
            linkedin: "https://linkedin.com/in/dhananjay-birari-6594462b4"
        },
        {
            name: "Kaustubh K. Deshmukh",
            role: "Product Engineer & Security Lead",
            focus: "Buyer Experience & Admin Systems",
            location: "Nashik, India",
            education: "Computer Science, Guru Gobind Singh College of Engineering",
            description: "Focused on creating fluid, secure user experiences and robust moderation tools. Lead architect for the admin control plane and buyer due diligence systems.",
            image: KaustubhImg,
            linkedin: "https://www.linkedin.com/in/kaustubh-deshmukh123/",
            github: "https://github.com/lonewolfwe"
        }
    ];

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

            {/* Developer Profiles - Editorial Layout */}
            <div className="container mx-auto max-w-6xl space-y-32">
                {developers.map((dev, i) => (
                    <motion.div
                        key={dev.name}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 md:gap-24 items-start`}
                    >
                        {/* Image Column */}
                        <div className="w-full md:w-5/12 aspect-[3/4] bg-secondary rounded-sm overflow-hidden relative grayscale hover:grayscale-0 transition-all duration-700">
                            {/* Note: In a real prod environment, we would use the real images provided in the previous prompt if they exist locally, 
                                 or these placeholders if they are generic. Assuming generic for "premium feel" demo unless local file exists. 
                                 Since I don't have access to upload local files, I used Unsplash premium-lookalikes. 
                             */}
                            <img src={dev.image} alt={dev.name} className="w-full h-full object-cover" />
                        </div>

                        {/* Text Column */}
                        <div className="w-full md:w-7/12 pt-8">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="h-[1px] w-12 bg-foreground/20" />
                                <span className="text-xs font-mono uppercase tracking-widest text-primary">{dev.focus}</span>
                            </div>

                            <h2 className="font-display font-bold text-4xl md:text-5xl mb-4 tracking-tight">{dev.name}</h2>
                            <p className="text-lg font-medium text-foreground/80 mb-8">{dev.role}</p>

                            <p className="text-muted-foreground leading-relaxed text-lg mb-8 max-w-lg">
                                {dev.description}
                            </p>

                            <div className="flex flex-col gap-1 text-sm text-muted-foreground font-mono mb-10 border-l-2 border-border/60 pl-4">
                                <span>{dev.education}</span>
                                <span>{dev.location}</span>
                            </div>

                            <div className="flex gap-6">
                                <a href={dev.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-bold hover:text-primary transition-colors group">
                                    LinkedIn <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                                </a>
                                {(dev as any).github && (
                                    <a href={(dev as any).github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-bold hover:text-primary transition-colors group">
                                        GitHub <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                                    </a>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
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
