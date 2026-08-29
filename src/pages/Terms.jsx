import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, AlertTriangle, Briefcase, DollarSign, FileCode, Scale, Server } from 'lucide-react';
import { motion } from 'framer-motion';
import picture from '../assets/pattern.png';
import SEO from '../components/SEO';

const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const Terms = () => {
    return (
        <div className="pt-20">
            <SEO
                title="Terms of Service | Nexora Creative Solutions"
                description="Read the Terms and Conditions for using Nexora Creative Solutions' website and software engineering services."
                url="/terms"
                image="/ncs.png"
                breadcrumbs={[
                    { name: "Home", item: "/" },
                    { name: "Terms & Conditions", item: "/terms" }
                ]}
            />

            {/* Header */}
            <section className="relative py-24 text-center text-white overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src={picture} alt="Background" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-brand-charcoal/80 backdrop-blur-sm"></div>
                </div>
                <div className="relative z-10 max-w-4xl mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 font-creative">Terms of Service</h1>
                    <div className="flex justify-center gap-2 text-gray-300 text-sm">
                        <Link to="/" className="hover:text-white transition-colors">Home</Link> / <span className="text-brand-rose">Terms</span>
                    </div>
                </div>
            </section>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 py-16 text-gray-700 leading-relaxed">
                <motion.p initial="hidden" animate="visible" variants={fadeIn} className="mb-10 text-lg">
                    Welcome to Nexora Creative Solutions. By engaging our agency for software engineering, design, or digital marketing services, you agree to be bound by the following enterprise terms and conditions.
                </motion.p>

                <div className="space-y-12">

                    {/* Services & Scope */}
                    <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-blue-50 text-blue-600 p-3 rounded-xl border border-blue-100"><Briefcase size={24} /></div>
                            <h2 className="text-2xl font-bold text-brand-charcoal">1. Scope of Work & Services</h2>
                        </div>
                        <p>
                            Nexora Creative Solutions provides custom software architecture, web development, mobile app engineering, and digital branding. The specific deliverables, tech stack, and timelines for each project will be strictly defined in a formal Proposal or Statement of Work (SOW). Any features or requests made outside of this approved SOW will be considered "Scope Creep" and billed separately at our standard hourly or feature rate.
                        </p>
                    </motion.section>

                    {/* Payments */}
                    <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-green-50 text-green-600 p-3 rounded-xl border border-green-100"><DollarSign size={24} /></div>
                            <h2 className="text-2xl font-bold text-brand-charcoal">2. Payments & Billing</h2>
                        </div>
                        <ul className="list-disc pl-6 space-y-3">
                            <li><strong>Commencement Deposit:</strong> A strict non-refundable deposit of <strong>50%</strong> is required to secure your project slot and commence engineering.</li>
                            <li><strong>Final Handover:</strong> The remaining 50% balance is due upon project completion. Source code, administrative credentials, and live server deployments will only be released <em>after</em> final payment is cleared.</li>
                            <li><strong>Accepted Methods:</strong> We process payments via verified Safaricom M-Pesa (Paybill/Till) and direct Bank Transfers.</li>
                            <li><strong>Late Fees:</strong> Invoices outstanding beyond 14 days will accrue a 10% late penalty fee.</li>
                        </ul>
                    </motion.section>

                    {/* Intellectual Property */}
                    <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-purple-50 text-purple-600 p-3 rounded-xl border border-purple-100"><FileCode size={24} /></div>
                            <h2 className="text-2xl font-bold text-brand-charcoal">3. Intellectual Property Rights</h2>
                        </div>
                        <p>
                            Upon full and final payment, the client assumes full ownership of the final compiled software, frontend designs, and associated digital assets. Nexora Creative Solutions retains the right to use the completed project, including wireframes and case studies, within our professional portfolio and marketing materials unless a strict Non-Disclosure Agreement (NDA) is executed prior to commencement.
                        </p>
                    </motion.section>

                    {/* Hosting & Maintenance */}
                    <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-orange-50 text-orange-600 p-3 rounded-xl border border-orange-100"><Server size={24} /></div>
                            <h2 className="text-2xl font-bold text-brand-charcoal">4. Hosting, APIs & Maintenance</h2>
                        </div>
                        <p>
                            Unless specifically outlined in a monthly retainer package, our development fees do not include ongoing costs for third-party services. The client is strictly responsible for recurring fees related to cloud hosting (e.g., VPS, AWS), domain renewals, and premium API usages (e.g., Africa's Talking, Google Maps API).
                        </p>
                    </motion.section>

                    {/* Liability */}
                    <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-red-50 text-brand-rose p-3 rounded-xl border border-rose-100"><AlertTriangle size={24} /></div>
                            <h2 className="text-2xl font-bold text-brand-charcoal">5. Limitation of Liability</h2>
                        </div>
                        <p>
                            Nexora Creative Solutions builds highly secure, enterprise-grade systems, but no digital environment is entirely immune to exploits. We shall not be held liable for data breaches, server downtimes caused by third-party hosts, or loss of revenue resulting from the use of our software. Digital marketing ROI and SEO rankings are dependent on dynamic market algorithms and are not legally guaranteed.
                        </p>
                    </motion.section>

                    {/* Governing Law */}
                    <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-gray-100 text-gray-700 p-3 rounded-xl border border-gray-200"><Scale size={24} /></div>
                            <h2 className="text-2xl font-bold text-brand-charcoal">6. Governing Law</h2>
                        </div>
                        <p>
                            These terms shall be governed by and construed in accordance with the laws of the Republic of Kenya. Any disputes arising from these terms or project execution shall be subject to the exclusive jurisdiction of the courts located in Nairobi.
                        </p>
                    </motion.section>

                </div>
            </div>
        </div>
    );
};

export default Terms;