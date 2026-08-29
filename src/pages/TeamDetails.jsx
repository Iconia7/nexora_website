import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchTeamMemberById, fetchTeamMembers } from '../api';
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, Briefcase, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import picture from '../assets/pattern.png';
import SEO from '../components/SEO';
import { useRef } from 'react';
import ReCAPTCHA from "react-google-recaptcha";
import toast from 'react-hot-toast';

const TeamDetails = () => {
    const { id } = useParams();
    const [member, setMember] = useState(null);
    const [loading, setLoading] = useState(true);
    const captchaRef = useRef(null);

    // --- FORM STATE LOGIC ---
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'

    useEffect(() => {
        setLoading(true);
        fetchTeamMemberById(id)
            .then(res => {
                setMember(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching team member:", err);
                setLoading(false);
            });
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.message) {
            toast.error("Please fill in all required fields.");
            return;
        }

        const token = captchaRef.current.getValue();
        if (!token) {
            toast.error("Please verify that you are not a robot 🤖");
            return;
        }

        setStatus('loading');

        try {
            // --- NOTE: Firebase contact_messages log removed ---

            // 2. EmailJS Configuration
            const serviceID = "service_nhwsclu";
            const templateID = "template_61eywtf";
            const publicKey = "ctUKvg88_0Th5sfKn";

            // --- Notification for YOU ---
            const adminParams = {
                to_email: "info@nexoracreatives.co.ke",
                from_name: "Nexora Website System",
                reply_to: formData.email,
                subject: `Direct Message for ${member.name}`,
                message_body: `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
            };

            // --- Auto-Reply for CLIENT ---
            const clientParams = {
                to_email: formData.email,
                from_name: member.name, // Reply comes "from" you personally
                reply_to: "info@nexoracreatives.co.ke",
                subject: `Thanks for connecting! - ${member.name}`,
                message_body: `Hi ${formData.name},\n\nThanks for reaching out to me directly. I have received your message and will get back to you shortly.\n\nBest,\n${member.name}`
            };

            await Promise.all([
                emailjs.send(serviceID, templateID, adminParams, publicKey),
                emailjs.send(serviceID, templateID, clientParams, publicKey)
            ]);

            setStatus('success');
            toast.success("Message sent successfully! We'll be in touch.");
            setFormData({ name: '', email: '', message: '' });
            captchaRef.current.reset();
            setTimeout(() => setStatus('idle'), 5000);

        } catch (error) {
            console.error("Error:", error);
            setStatus('error');
            toast.error("Something went wrong. Please try again.");
        }
    };

    if (loading) {
        return (
            <div className="pt-40 pb-20 flex justify-center">
                <Loader2 size={48} className="animate-spin text-brand-rose opacity-20" />
            </div>
        );
    }

    if (!member) return <div className="pt-40 text-center text-2xl font-bold text-gray-400">Member not found</div>;

    const SocialIconMap = {
        facebook: Facebook,
        twitter: Twitter,
        linkedin: Linkedin,
        instagram: Instagram
    };

    return (
        <div className="pt-20">
            <SEO
                title={`${member.name} - ${member.role} | Nexora Team`}
                description={`Meet ${member.name}, ${member.role} at Nexora Creative Solutions. Dedicated to engineering and creative excellence in ${member.department || "tech and design"}.`}
                url={`/team/${member.id}`}
                image={member.image || "/ncs.png"}
                breadcrumbs={[
                    { name: "Home", item: "/" },
                    { name: "Our Team", item: "/team" },
                    { name: member.name, item: `/team/${member.id}` }
                ]}
            />

            {/* 1. Header Section */}
            <section className="relative py-24 text-center text-white overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src={picture} className="w-full h-full object-cover" alt="bg" />
                    <div className="absolute inset-0 bg-brand-charcoal/55"></div>
                </div>
                <div className="relative z-10 max-w-4xl mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 font-creative">Team Details</h1>
                    <div className="flex justify-center gap-2 text-gray-300 text-sm font-medium">
                        <Link to="/" className="hover:text-white transition-colors">Home</Link> /
                        <Link to="/about" className="hover:text-white">Team</Link> /
                        <span className="text-brand-rose">{member.name}</span>
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 py-24">
                <div className="grid lg:grid-cols-3 gap-12">

                    {/* 2. Left Column: Image & Info */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-gray-50 p-8 rounded-3xl border border-gray-100 text-center"
                        >
                            <div className="rounded-3xl overflow-hidden mb-8 shadow-xl">
                                <img src={member.image} alt={member.name} className="w-full h-auto object-cover" />
                            </div>
                            <h2 className="text-2xl font-bold text-brand-charcoal mb-2">{member.name}</h2>
                            <p className="text-brand-rose font-medium mb-6">{member.role}</p>

                            <div className="space-y-4 text-left mb-8">
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Mail size={18} className="text-brand-rose" /> <span className="text-sm">{member.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Phone size={18} className="text-brand-rose" /> <span className="text-sm">{member.phone}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Briefcase size={18} className="text-brand-rose" /> <span className="text-sm">{member.experience} Experience</span>
                                </div>
                            </div>

                            <div className="flex justify-center gap-3">
                                {member.socials && Object.entries(member.socials).map(([platform, url], i) => {
                                    const Icon = SocialIconMap[platform];
                                    return Icon ? (
                                        <a
                                            key={i}
                                            href={url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-brand-charcoal border border-gray-200 hover:bg-brand-rose hover:text-white hover:border-brand-rose transition"
                                        >
                                            <Icon size={18} />
                                        </a>
                                    ) : null;
                                })}
                            </div>
                        </motion.div>
                    </div>

                    {/* 3. Right Column: Bio & Skills */}
                    <div className="lg:col-span-2">
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                            <h2 className="text-3xl font-bold text-brand-charcoal mb-6">Biography</h2>
                            <p className="text-gray-600 mb-8 leading-relaxed text-lg">{member.bio}</p>
                            <p className="text-gray-600 mb-12 leading-relaxed">
                                I am dedicated to helping businesses grow through technology. Whether it is building a complex mobile application or a simple landing page, I bring the same level of passion and expertise to every project.
                            </p>

                            <h3 className="text-2xl font-bold text-brand-charcoal mb-8">Professional Skills</h3>
                            <div className="grid md:grid-cols-2 gap-x-12 gap-y-8 mb-16">
                                {member.skills.map((skill, idx) => (
                                    <div key={idx}>
                                        <div className="flex justify-between mb-2 font-bold text-brand-charcoal">
                                            <span>{skill.name}</span>
                                            <span>{skill.level}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${skill.level}%` }}
                                                transition={{ duration: 1, ease: "easeOut" }}
                                                className="bg-brand-rose h-2.5 rounded-full relative"
                                            >
                                                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white border-2 border-brand-rose rounded-full"></div>
                                            </motion.div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* FUNCTIONAL Contact Form */}
                            <div className="bg-brand-charcoal rounded-3xl p-10 text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-rose rounded-full blur-[80px] opacity-20"></div>
                                <div className="relative z-10">
                                    <span className="text-brand-rose font-bold uppercase tracking-wider text-sm mb-2 block">Contact Me</span>
                                    <h3 className="text-3xl font-bold mb-8">Get In Touch</h3>

                                    <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Your Name"
                                            required
                                            className="bg-white/10 border border-white/20 p-4 rounded-xl text-white focus:outline-none focus:border-brand-rose"
                                        />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="Your Email"
                                            required
                                            className="bg-white/10 border border-white/20 p-4 rounded-xl text-white focus:outline-none focus:border-brand-rose"
                                        />
                                        <div className="md:col-span-2">
                                            <textarea
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                rows="4"
                                                placeholder="Write Message"
                                                required
                                                className="w-full bg-white/10 border border-white/20 p-4 rounded-xl text-white focus:outline-none focus:border-brand-rose"
                                            ></textarea>
                                        </div>

                                        <div className="flex justify-center mb-4">
                                            <ReCAPTCHA
                                                ref={captchaRef}
                                                sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <button
                                                type="submit"
                                                disabled={status === 'loading' || status === 'success'}
                                                className={`w-full py-4 rounded-xl font-bold transition shadow-lg flex items-center justify-center gap-2 ${status === 'success' ? 'bg-green-500 text-white cursor-default' :
                                                        status === 'error' ? 'bg-red-500 text-white' :
                                                            'bg-brand-rose hover:bg-white hover:text-brand-charcoal'
                                                    }`}
                                            >
                                                {status === 'loading' ? <Loader2 className="animate-spin" /> :
                                                    status === 'success' ? <><CheckCircle /> Message Sent</> :
                                                        status === 'error' ? <><AlertCircle /> Failed. Try Again</> :
                                                            'Send Message'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>

                        </motion.div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default TeamDetails;