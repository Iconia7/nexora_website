import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchServiceById, fetchServices } from '../api';
import { CheckCircle, ArrowRight, HelpCircle, Loader2, CheckCircle as CheckIcon, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import picture from '../assets/pattern.png';
import SEO from '../components/SEO';
import { useRef } from 'react';
import ReCAPTCHA from "react-google-recaptcha";
import toast from 'react-hot-toast';

const ServiceDetails = () => {
  const { id } = useParams();
  const [currentService, setCurrentService] = useState(null);
  const [allServices, setAllServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const captchaRef = useRef(null);

  // --- FORM LOGIC ---
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchServiceById(id),
      fetchServices()
    ])
    .then(([detailRes, listRes]) => {
      setCurrentService(detailRes.data);
      setAllServices(listRes.data);
      setLoading(false);
    })
    .catch(err => {
      console.error("Error fetching service details:", err);
      setLoading(false);
    });
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!formData.name || !formData.email || !formData.message) {
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

        // 2. EmailJS Logic
        const serviceID = "service_nhwsclu"; 
        const templateID = "template_61eywtf"; 
        const publicKey = "ctUKvg88_0Th5sfKn";

        const adminParams = {
            to_email: "info@nexoracreatives.co.ke",
            from_name: "Nexora Service Page",
            reply_to: formData.email,
            subject: `Quote Request for ${currentService.title}`,
            message_body: `Client: ${formData.name}\nEmail: ${formData.email}\nService Page: ${currentService.title}\n\nMessage:\n${formData.message}`
        };

        const clientParams = {
            to_email: formData.email,
            from_name: "Nexora Creative Solutions",
            reply_to: "info@nexoracreatives.co.ke",
            subject: `We received your quote request!`,
            message_body: `Hi ${formData.name},\n\nThanks for inquiring about our ${currentService.title} services. We have received your request and will get back to you with a quote shortly.\n\nBest Regards,\nThe Nexora Team`
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

  if (!currentService) {
      return (
          <div className="pt-40 pb-20 text-center">
              <h2 className="text-2xl font-bold text-gray-400">Service not found.</h2>
              <Link to="/services" className="text-brand-rose font-bold mt-4 inline-block underline">Back to Services</Link>
          </div>
      );
  }

  const { details } = currentService;

  return (
    <div className="pt-20">
        <SEO 
    title={`${currentService.title} Services | Nexora Creative Solutions`}
    description={`Professional ${currentService.title} services in Kenya. We provide top-tier solutions in technology tailored for your business needs.`}
    url={`/services/${currentService.id}`}
  />
      {/* 1. Header Section */}
      <section className="relative py-24 text-center text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={picture} className="w-full h-full object-cover" alt="bg"/>
          <div className="absolute inset-0 bg-brand-charcoal/55"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-creative">
            Service Details
          </h1>
          <div className="flex justify-center gap-2 text-gray-300 text-sm font-medium">
            <Link to="/" className="hover:text-white transition-colors">Home</Link> / 
            <Link to="/services" className="hover:text-white">Services</Link> / 
            <span className="text-brand-rose">{currentService.title}</span>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-20">
         <div className="grid lg:grid-cols-3 gap-12">
            
            {/* 2. Main Content */}
            <div className="lg:col-span-2">
                <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{duration:0.5}}>
                    <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80" alt="Team" className="rounded-2xl shadow-xl w-full h-[400px] object-cover mb-10" />

                    <h2 className="text-3xl font-bold text-brand-charcoal mb-4">{details?.heading || currentService.title}</h2>
                    <div className="flex gap-4 mb-6">
                        <span className="text-6xl font-bold text-brand-rose leading-none float-left mr-2">
                            {details?.intro?.charAt(0) || "W"}
                        </span>
                        <p className="text-gray-600 leading-relaxed pt-2">
                            {details?.intro?.substring(1) || currentService.desc}
                        </p>
                    </div>
                    
                    <p className="text-gray-600 mb-8 leading-relaxed">
                        We provide comprehensive solutions that help you achieve your business goals. Our team consists of industry experts who are dedicated to delivering excellence in every project.
                    </p>

                    <h3 className="text-2xl font-bold text-brand-charcoal mb-6">Services Include:</h3>
                    <div className="grid md:grid-cols-2 gap-4 mb-12">
                        {(details?.includes || ['Custom Solutions', 'Expert Support']).map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-brand-rose/50 transition">
                                <CheckCircle className="text-brand-rose shrink-0" size={20} />
                                <span className="font-semibold text-gray-700">{item}</span>
                            </div>
                        ))}
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6 mb-12">
                        <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80" className="rounded-2xl shadow-lg" alt="Work 1"/>
                        <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80" className="rounded-2xl shadow-lg" alt="Work 2"/>
                    </div>

                    <h3 className="text-2xl font-bold text-brand-charcoal mb-8">Our Expertise in {currentService.title}</h3>
                    <div className="space-y-6">
                        {(details?.expertise || []).map((exp, idx) => (
                            <div key={idx} className="flex gap-6 group">
                                <div className="w-16 h-16 rounded-full bg-white border-2 border-brand-rose text-brand-rose flex items-center justify-center font-bold text-xl shrink-0 group-hover:bg-brand-rose group-hover:text-white transition">
                                    0{idx + 1}
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-brand-charcoal mb-2">{exp.title}</h4>
                                    <p className="text-gray-600">{exp.text}</p>
                                </div>
                            </div>
                        ))}
                        {(!details?.expertise || details.expertise.length === 0) && (
                            <p className="text-gray-500 italic">Detailed expertise info coming soon.</p>
                        )}
                    </div>

                </motion.div>
            </div>

            {/* 3. Sidebar */}
            <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-8">
                    
                    {/* Services List */}
                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                        <h3 className="font-bold text-xl text-brand-charcoal mb-4">All Services</h3>
                        <div className="space-y-2">
                            {allServices.map(s => (
                                <Link 
                                    key={s.id} 
                                    to={`/services/${s.id}`} 
                                    className={`block p-3 rounded-lg transition flex justify-between items-center ${s.id === currentService.id ? 'bg-brand-rose text-white' : 'bg-white text-gray-600 hover:bg-gray-200'}`}
                                >
                                    {s.title} <ArrowRight size={16}/>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Functional Contact Form */}
                    <div className="bg-brand-charcoal text-white p-8 rounded-2xl shadow-xl relative overflow-hidden">
                         <div className="absolute top-0 right-0 w-32 h-32 bg-brand-rose/20 rounded-full -mr-10 -mt-10 blur-xl"></div>
                         <h3 className="text-2xl font-bold mb-2">Get Your <span className="text-brand-rose">Free Quote</span></h3>
                         <p className="text-gray-400 text-sm mb-6">Fill the form and we'll get back to you shortly.</p>
                         
                         <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                             <input 
                                type="text" 
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Name" 
                                required
                                className="w-full p-3 rounded bg-white/10 border border-white/20 focus:outline-none focus:border-brand-rose text-white placeholder-gray-400"
                             />
                             <input 
                                type="email" 
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email" 
                                required
                                className="w-full p-3 rounded bg-white/10 border border-white/20 focus:outline-none focus:border-brand-rose text-white placeholder-gray-400"
                             />
                             <textarea 
                                rows="3" 
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="Message" 
                                required
                                className="w-full p-3 rounded bg-white/10 border border-white/20 focus:outline-none focus:border-brand-rose text-white placeholder-gray-400"
                             ></textarea>

                             <div className="flex justify-center mb-4">
    <ReCAPTCHA
        ref={captchaRef}
        sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
    />
</div>
                             
                             <button 
                                type="submit"
                                disabled={status === 'loading' || status === 'success'}
                                className={`w-full py-3 rounded font-bold transition flex items-center justify-center gap-2 ${
                                    status === 'success' ? 'bg-green-500 text-white cursor-default' : 
                                    status === 'error' ? 'bg-red-500 text-white' : 
                                    'bg-brand-rose hover:bg-white hover:text-brand-rose'
                                }`}
                             >
                                {status === 'loading' ? <Loader2 className="animate-spin" size={18} /> : 
                                 status === 'success' ? <><CheckIcon size={18}/> Sent</> : 
                                 status === 'error' ? <><AlertCircle size={18}/> Failed</> : 
                                 'Submit Now'}
                             </button>
                         </form>
                    </div>

                    {/* Help Box */}
                    <div className="bg-blue-50 p-6 rounded-2xl flex items-center gap-4">
                        <div className="bg-brand-charcoal text-white p-3 rounded-full">
                            <HelpCircle />
                        </div>
                        <div>
                            <h4 className="font-bold text-brand-charcoal">Have Questions?</h4>
                            <p className="text-sm text-brand-rose font-bold">+254 115 332 870</p>
                        </div>
                    </div>

                </div>
            </div>

         </div>
      </div>
    </div>
  );
};

export default ServiceDetails;