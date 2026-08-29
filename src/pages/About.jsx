import React, { useState, useEffect } from 'react';
import { fetchTeamMembers, fetchStats, fetchTestimonials, fetchBenefits } from '../api';
import { Play, Trophy, Users, Target, Loader2, Cpu, ShieldCheck, Code, Layers, Star, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import picture from '../assets/pattern.png';
import SEO from '../components/SEO';
import LucideIcon from '../components/LucideIcon';

// Animation Variants
const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.2 }
    }
};

const scaleUp = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.6 } }
};

// New Animation for the infinite tech ticker
const marqueeVariants = {
    animate: {
        x: [0, -1035],
        transition: {
            x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 20,
                ease: "linear",
            },
        },
    },
};

const About = () => {
    const [team, setTeam] = useState([]);
    const [stats, setStats] = useState([]);
    const [testimonials, setTestimonials] = useState([]);
    const [benefits, setBenefits] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        Promise.all([fetchTeamMembers(), fetchStats(), fetchTestimonials(), fetchBenefits()])
            .then(([teamRes, statsRes, testimonialsRes, benefitsRes]) => {
                setTeam(teamRes.data);
                setStats(statsRes.data);
                setTestimonials(testimonialsRes.data);
                setBenefits(benefitsRes.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching about page data:", err);
                setLoading(false);
            });
    }, []);

    // Fallback stats
    const displayStats = stats.length > 0 ? stats : [
        { value: "200+", label: "Systems Deployed" },
        { value: "50+", label: "Enterprise Clients" },
        { value: "5+", label: "Years Engineering" }
    ];

    const techStack = ["React.js", "Flutter & Dart", "Python & Django", "Node.js", "Safaricom Daraja API", "PostgreSQL", "Framer Motion", "Firebase"];

    // Fallback Testimonials
    const displayTestimonials = testimonials.length > 0 ? testimonials : [
        { name: "Director of Operations", company: "Tech Logistics Africa", text: "Nexora didn't just build us a website; they architected a complete digital platform. Their deep understanding of backend systems and APIs completely transformed how we do business online.", rating: 5 },
        { name: "Lead Engineer", company: "FinTech Solutions", text: "Exceptional engineering and attention to detail. The integration with Safaricom's Daraja API was seamless and secure.", rating: 5 }
    ];

    if (loading) {
        return (
            <div className="pt-40 pb-20 flex justify-center">
                <Loader2 size={48} className="animate-spin text-brand-rose opacity-20" />
            </div>
        );
    }

    return (
        <div className="pt-20 overflow-hidden">
            <SEO
                title="About Us | Nexora Creative Solutions | Tech Agency Kenya"
                description="Learn about Nexora Creative Solutions. We are a premier software engineering and design agency in Kenya architecting scalable web platforms, fintech integrations, and mobile apps."
                url="/about"
                image="/ncs.png"
                keywords={[
                  "about Nexora",
                  "software company Kenya",
                  "tech agency Kenya",
                  "software engineers Nairobi",
                  "tech innovators Kenya"
                ]}
                breadcrumbs={[
                  { name: "Home", item: "/" },
                  { name: "About Us", item: "/about" }
                ]}
                schema={{
                  "@context": "https://schema.org",
                  "@type": "AboutPage",
                  "name": "About Nexora Creative Solutions",
                  "description": "Information about Nexora Creative Solutions, our engineering philosophy, team, and services.",
                  "url": "https://nexoracreatives.co.ke/about"
                }}
            />

            {/* 1. Header Section */}
            <section className="relative py-24 text-center text-white overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src={picture}
                        alt="Background"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-brand-charcoal/80 backdrop-blur-sm"></div>
                </div>

                <div className="relative z-10 max-w-4xl mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 font-creative">
                        Architecting Digital Futures
                    </h1>
                    <div className="flex justify-center gap-2 text-gray-300 text-sm font-medium">
                        <Link to="/" className="hover:text-white transition-colors">Home</Link> /
                        <span className="text-brand-rose">About Us</span>
                    </div>
                </div>
            </section>

            {/* 2. Intro & Vision Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={scaleUp}
                        className="relative"
                    >
                        <div className="grid grid-cols-2 gap-4">
                            <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80" className="rounded-2xl shadow-lg mt-8" alt="Code infrastructure" />
                            <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80" className="rounded-2xl shadow-lg" alt="Team collaborating" />
                        </div>
                        {/* Floating Badge */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-brand-charcoal text-white p-6 rounded-full shadow-2xl border-4 border-white text-center w-32 h-32 flex flex-col items-center justify-center backdrop-blur-md bg-opacity-90"
                        >
                            <span className="text-3xl font-bold text-brand-rose">5+</span>
                            <span className="text-[10px] font-bold tracking-widest uppercase mt-1">Years Exp.</span>
                        </motion.div>
                    </motion.div>

                    {/* Text Content */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                    >
                        <motion.span variants={fadeInUp} className="text-brand-rose font-bold uppercase tracking-wider text-sm">The Architecture</motion.span>
                        <motion.h2 variants={fadeInUp} className="text-4xl font-bold text-brand-charcoal mt-4 mb-6 leading-tight">
                            Engineering Scalable <br /> <span className="text-brand-rose">Digital Ecosystems</span>
                        </motion.h2>
                        <motion.p variants={fadeInUp} className="text-gray-600 mb-6 text-lg leading-relaxed">
                            At Nexora Creative Solutions, we don't just build websites; we engineer enterprise-grade digital infrastructure. From complex fintech pipelines to high-performance cross-platform applications, we merge robust code with conversion-driven design.
                        </motion.p>

                        <motion.div variants={fadeInUp} className="grid grid-cols-2 gap-6 mt-8">
                            {(benefits.length > 0 ? benefits.slice(0, 2) : [
                                { icon: 'Cpu', title: 'Systems First', description: 'Built for high traffic and scale.' },
                                { icon: 'ShieldCheck', title: 'Secure Logic', description: 'Airtight payment integrations.' }
                            ]).map((item, idx) => (
                                <div key={idx} className="flex items-start gap-4">
                                    <div className={`p-3 rounded-xl border ${idx === 0 ? 'bg-blue-50/50 text-blue-600 border-blue-100' : 'bg-rose-50/50 text-brand-rose border-rose-100'}`}>
                                        <LucideIcon name={item.icon || (idx === 0 ? 'Cpu' : 'ShieldCheck')} size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-brand-charcoal">{item.title}</h4>
                                        <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* NEW: 2.5 Tech Stack Marquee */}
            <section className="py-12 bg-gray-50 border-y border-gray-100 overflow-hidden flex items-center">
                <div className="w-full max-w-7xl mx-auto px-4 flex items-center">
                    <span className="text-sm font-bold uppercase text-gray-400 tracking-widest whitespace-nowrap mr-8">Our Arsenal:</span>
                    <div className="flex-1 overflow-hidden relative">
                        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-gray-50 to-transparent z-10"></div>
                        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-gray-50 to-transparent z-10"></div>
                        <motion.div
                            className="flex gap-12 whitespace-nowrap text-xl font-bold text-gray-300"
                            variants={marqueeVariants}
                            animate="animate"
                        >
                            {[...techStack, ...techStack].map((tech, index) => (
                                <span key={index} className="hover:text-brand-rose transition-colors duration-300 cursor-default">
                                    {tech}
                                </span>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 3. Video / Stats Section */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative rounded-[2rem] overflow-hidden h-[450px] shadow-2xl group cursor-pointer"
                    >
                        <div className="absolute inset-0 bg-brand-charcoal/50 group-hover:bg-brand-charcoal/40 transition-colors z-10"></div>
                        <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80" alt="Cyber Security & Code" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />

                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                            <div className="relative group-hover:scale-110 transition-transform">
                                <div className="w-24 h-24 bg-white/10 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center pl-1 shadow-2xl">
                                    <Play size={40} className="text-white fill-current opacity-90" />
                                </div>
                            </div>
                        </div>

                        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-brand-charcoal via-brand-charcoal/80 to-transparent pt-20 pb-8 px-8 z-20 flex justify-around text-white">
                            {displayStats.slice(0, 3).map((stat, idx) => (
                                <div key={idx} className="text-center">
                                    <h3 className="text-4xl font-black mb-1">{stat.value}</h3>
                                    <p className="text-sm font-medium tracking-wide uppercase opacity-70">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* 5. Team / Founder Section */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="text-brand-rose font-bold uppercase tracking-wider text-sm">Leadership</span>
                        <h2 className="text-4xl font-bold text-brand-charcoal mt-2">Meet the Architect</h2>
                    </div>

                    <div className="flex flex-wrap justify-center gap-8">
                        {team.map((member, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.2 }}
                                viewport={{ once: true }}
                                className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100 group w-full md:w-[400px]"
                            >
                                <div className="relative h-[400px] overflow-hidden bg-gray-200">
                                    <img src={member.image} alt={member.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>
                                <div className="p-8 text-center relative bg-white">
                                    {/* Small icon overlapping the image */}
                                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-brand-rose text-white rounded-xl shadow-lg flex items-center justify-center">
                                        <Code size={20} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-brand-charcoal mt-2">{member.name}</h3>
                                    <p className="text-brand-rose font-semibold tracking-wide uppercase text-sm mt-1">{member.role}</p>
                                    <p className="text-gray-500 text-sm mt-4 leading-relaxed">{member.bio}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6. Testimonials Section */}
            <section className="py-24 bg-brand-charcoal text-white relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-rose/5 rounded-full blur-[100px] transform translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
                    <span className="text-brand-rose font-bold uppercase tracking-wider text-sm">Client Success</span>
                    <h2 className="text-4xl font-bold mt-2 mb-16">Trusted by Enterprise Leaders</h2>

                    <div className="grid md:grid-cols-2 gap-8 text-left">
                        {displayTestimonials.map((item, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ scale: 1.02 }}
                                className="bg-white/5 backdrop-blur-sm border border-white/10 p-10 rounded-3xl relative"
                            >
                                <div className="flex gap-1 text-yellow-400 mb-6">
                                    {[...Array(item.rating || 5)].map((_, star) => <Star key={star} size={18} fill="currentColor" />)}
                                </div>
                                <p className="text-gray-300 text-lg italic mb-8 leading-relaxed">"{item.text}"</p>
                                <div className="flex items-center gap-4 border-t border-white/10 pt-6">
                                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-rose to-purple-600 p-[2px]">
                                        <img src={item.image || `https://randomuser.me/api/portraits/women/${idx + 45}.jpg`} alt="Client" className="w-full h-full rounded-full border-2 border-brand-charcoal object-cover" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-lg">{item.name}</h4>
                                        <p className="text-sm text-brand-rose">{item.role} {item.company ? `@ ${item.company}` : ''}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;