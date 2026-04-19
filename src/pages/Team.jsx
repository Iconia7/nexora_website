import React, { useState, useEffect } from 'react';
import { fetchTeamMembers } from '../api';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Instagram, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import picture from '../assets/pattern.png';
import SEO from '../components/SEO';
import { useRef } from 'react';
import ReCAPTCHA from "react-google-recaptcha";
import toast from 'react-hot-toast';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const Team = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // --- NEWSLETTER LOGIC ---
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'
  const [message, setMessage] = useState('');
  const captchaRef = useRef(null);

  useEffect(() => {
    fetchTeamMembers()
      .then(res => {
        setTeam(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching team:", err);
        setLoading(false);
      });
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    
    // Basic Validation
    if (!email || !email.includes('@')) {
        toast.error("Please enter a valid email.");
        setStatus('error');
        return;
    }

    // CAPTCHA CHECK
  const token = captchaRef.current.getValue();
if (!token) {
    toast.error("Please verify that you are not a robot 🤖");
    return;
}

    setStatus('loading');
    setMessage('');

    try {
        // --- NOTE: Firebase newsletter log removed ---

        // 2. Email Notification (Optional - to Admin)
        const serviceID = "service_nhwsclu"; 
        const templateID = "template_61eywtf"; 
        const publicKey = "ctUKvg88_0Th5sfKn";

        const templateParams = {
            to_email: "info@nexoracreatives.co.ke",
            from_name: "Team Page Subscriber",
            reply_to: email,
            subject: "New Newsletter Subscriber",
            message_body: `New subscriber from Team Page: ${email}`
        };

        await emailjs.send(serviceID, templateID, templateParams, publicKey);

        // 3. Success State
        setStatus('success');
        setEmail('');
        toast.success("Thanks for subscribing!");
        
        // Reset Captcha if visible
        captchaRef.current.reset();

        setTimeout(() => {
            setStatus('idle');
            setMessage('');
        }, 3000);

    } catch (error) {
        console.error("Error: ", error);
        setStatus('error');
        toast.error("Something went wrong. Please try again.");
    }
  };

  // Helper for Social Icons
  const SocialIconMap = {
      facebook: Facebook,
      twitter: Twitter,
      linkedin: Linkedin,
      instagram: Instagram
  };

  return (
    <div className="pt-20">
        <SEO 
  title="Meet The Team | Expert Developers in Kenya"
  description="Get to know the experts behind the code. Our team consists of skilled software engineers, UI/UX designers, and project managers."
  url="/team"
/>

      {/* 1. Header Section */}
      <section className="relative py-24 text-center text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={picture} alt="Background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-brand-charcoal/55"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-creative">Our Team</h1>
          <div className="flex justify-center gap-2 text-gray-300 text-sm font-medium">
            <Link to="/" className="hover:text-white transition-colors">Home</Link> / 
            <span className="text-brand-rose">Our Team</span>
          </div>
        </div>
      </section>

      {/* 2. Team Grid */}
      <div className="max-w-7xl mx-auto px-4 py-24">
        <div className="text-center mb-16">
            <span className="text-brand-rose font-bold uppercase tracking-wider text-sm">Our Team</span>
            <h2 className="text-4xl font-bold text-brand-charcoal mt-2">Meet Our <span className="text-brand-rose">Expert Team</span></h2>
        </div>

        {loading ? (
             <div className="flex justify-center p-20">
                 <Loader2 size={48} className="animate-spin text-brand-rose opacity-20" />
             </div>
        ) : (
            <div className="flex flex-wrap justify-center gap-8">
              {team.map((member) => (
                <motion.div 
                  key={member.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeInUp}
                  className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 w-full sm:w-[350px]"
                >
                  <div className="relative h-[350px] overflow-hidden">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    />
                    
                    {/* Social Overlay - Dynamic Links */}
                    <div className="absolute inset-0 bg-brand-charcoal/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                        {['facebook', 'twitter', 'linkedin', 'instagram'].map((platform, i) => {
                            const Icon = SocialIconMap[platform];
                            const url = member[platform];
                            return url ? (
                                <a 
                                    key={i} 
                                    href={url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-brand-charcoal hover:bg-brand-rose hover:text-white cursor-pointer transition transform hover:-translate-y-1"
                                >
                                    <Icon size={18}/>
                                </a>
                            ) : null;
                        })}
                    </div>
                  </div>
                  
                  <div className="p-6 text-center">
                    <h3 className="text-2xl font-bold text-brand-charcoal mb-1">
                        <Link to={`/team/${member.id}`} className="hover:text-brand-rose transition">{member.name}</Link>
                    </h3>
                    <p className="text-gray-500 font-medium">{member.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
        )}
      </div>

      {/* 3. Newsletter Section (FUNCTIONAL) */}
      <section className="bg-white pb-24">
         <div className="max-w-4xl mx-auto px-4 text-center">
             <div className="bg-brand-charcoal rounded-3xl p-12 relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-brand-rose rounded-full blur-[80px] opacity-30"></div>
                 <div className="relative z-10">
                     <span className="text-brand-rose font-bold uppercase tracking-wider text-sm mb-2 block">// Our Newsletter</span>
                     <h2 className="text-3xl font-bold text-white mb-8">Subscribe for <span className="text-brand-rose">Expert IT <br/> Tips & Special Offers</span></h2>
                     
                     <form onSubmit={handleSubscribe} className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto">
                         <div className="flex-grow">
                             <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter Email Address" 
                                disabled={status === 'loading' || status === 'success'}
                                className="w-full px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-brand-rose transition-colors" 
                             />
                         </div>

                         <div className="flex justify-center mb-4">
    <ReCAPTCHA
        ref={captchaRef}
        sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
    />
</div>
                         
                         <button 
                            type="submit"
                            disabled={status === 'loading' || status === 'success'}
                            className={`px-8 py-4 rounded-full font-bold transition flex items-center justify-center gap-2 min-w-[160px] ${
                                status === 'success' 
                                ? 'bg-green-500 text-white cursor-default' 
                                : status === 'error'
                                ? 'bg-red-500 text-white'
                                : 'bg-brand-rose text-white hover:bg-white hover:text-brand-charcoal'
                            }`}
                         >
                             {status === 'loading' ? <Loader2 className="animate-spin" /> : 
                              status === 'success' ? <><CheckCircle /> Subscribed</> : 
                              status === 'error' ? <><AlertCircle /> Failed</> : 
                              'Subscribe'}
                         </button>
                     </form>
                     
                     {/* Feedback Message */}
                     {message && (
                        <p className={`mt-4 text-sm font-medium ${status === 'error' ? 'text-red-400' : 'text-green-400'}`}>
                            {message}
                        </p>
                     )}
                 </div>
             </div>
         </div>
      </section>

    </div>
  );
};

export default Team;