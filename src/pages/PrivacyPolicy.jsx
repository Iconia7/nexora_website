import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Eye, FileText, Database, Cookie } from 'lucide-react';
import { motion } from 'framer-motion';
import picture from '../assets/pattern.png';
import SEO from '../components/SEO';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const PrivacyPolicy = () => {
  return (
    <div className="pt-20">
      <SEO
        title="Privacy Policy | Nexora Creative Solutions"
        description="We value your privacy. Read our policy to understand how Nexora Creative Solutions protects your enterprise and personal data."
        url="/privacy"
        image="/ncs.png"
        breadcrumbs={[
          { name: "Home", item: "/" },
          { name: "Privacy Policy", item: "/privacy" }
        ]}
      />

      {/* Header */}
      <section className="relative py-24 text-center text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={picture} alt="Background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-brand-charcoal/80 backdrop-blur-sm"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-creative">Privacy Policy</h1>
          <div className="flex justify-center gap-2 text-gray-300 text-sm">
            <Link to="/" className="hover:text-white transition-colors">Home</Link> / <span className="text-brand-rose">Privacy</span>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-16 text-gray-700 leading-relaxed">

        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="bg-blue-50/50 border-l-4 border-brand-rose p-6 mb-12 rounded-r-xl">
          <p className="font-bold text-brand-charcoal mb-1">Effective Date: {new Date().getFullYear()}</p>
          <p>At Nexora Creative Solutions, we treat data security as a core architectural requirement. This policy outlines how we collect, process, and protect your information in compliance with the Kenyan Data Protection Act (2019) and global security standards.</p>
        </motion.div>

        <div className="space-y-12">
          <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-brand-charcoal text-white p-3 rounded-xl"><Database size={24} /></div>
              <h2 className="text-2xl font-bold text-brand-charcoal">1. Information We Collect</h2>
            </div>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Identity & Contact Data:</strong> Name, corporate email address, and phone numbers.</li>
              <li><strong>Technical Specifications:</strong> Proprietary business logic, server access credentials, and project requirements shared during the consultation phase.</li>
              <li><strong>Financial Data:</strong> M-Pesa transaction reference codes and billing details. <em>Note: We do not process or store raw credit card numbers on our local servers.</em></li>
            </ul>
          </motion.section>

          <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-brand-charcoal text-white p-3 rounded-xl"><FileText size={24} /></div>
              <h2 className="text-2xl font-bold text-brand-charcoal">2. How We Use Your Data</h2>
            </div>
            <p className="mb-4">We process your data strictly to facilitate our engineering and agency operations:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Architecting and deploying your custom software or branding deliverables.</li>
              <li>Executing automated payment pipelines and generating financial invoices.</li>
              <li>Providing technical support, server maintenance, and critical security patches.</li>
            </ul>
          </motion.section>

          <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-brand-charcoal text-white p-3 rounded-xl"><Lock size={24} /></div>
              <h2 className="text-2xl font-bold text-brand-charcoal">3. Infrastructure & Security</h2>
            </div>
            <p>
              We deploy enterprise-grade security protocols. Client data, including API keys and environment variables, are encrypted in transit and at rest. We utilize secure cloud infrastructure (such as AWS, Firebase, and secure VPS environments) protected by modern firewall configurations and SSL/TLS encryption.
            </p>
          </motion.section>

          <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-brand-charcoal text-white p-3 rounded-xl"><Shield size={24} /></div>
              <h2 className="text-2xl font-bold text-brand-charcoal">4. Third-Party Data Processors</h2>
            </div>
            <p>
              To deliver high-performance applications, we integrate with trusted third-party APIs. These include payment gateways (Safaricom Daraja, Paystack), communication nodes (Africa's Talking, Twilio), and analytics engines (Google Analytics). These processors are bound by their own stringent data privacy compliance frameworks.
            </p>
          </motion.section>

          <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-brand-charcoal text-white p-3 rounded-xl"><Cookie size={24} /></div>
              <h2 className="text-2xl font-bold text-brand-charcoal">5. Cookies & Analytics</h2>
            </div>
            <p>
              The Nexora Creative Solutions website utilizes cookies and tracking technologies to monitor site performance, understand user behavior, and optimize our digital marketing campaigns. You can adjust your browser settings to decline non-essential cookies.
            </p>
          </motion.section>

          <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="border-t border-gray-200 pt-8 mt-12">
            <h2 className="text-xl font-bold text-brand-charcoal mb-4">Data Rights & Contact</h2>
            <p>Under the Kenyan Data Protection Act, you have the right to request access to, correction of, or deletion of your personal data. For any legal or privacy inquiries, contact our data protection team at:</p>
            <a href="mailto:info@nexoracreatives.co.ke" className="inline-block font-bold text-brand-rose mt-3 hover:text-brand-charcoal transition-colors">info@nexoracreatives.co.ke</a>
          </motion.section>
        </div>

      </div>
    </div>
  );
};

export default PrivacyPolicy;