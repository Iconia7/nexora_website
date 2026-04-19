import React, { useState, useEffect } from 'react';
import { fetchServices, fetchStats } from '../api';
import { ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import picture from '../assets/pattern.png';
import SEO from '../components/SEO';
import LucideIcon from '../components/LucideIcon';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const Home = () => {
  const [services, setServices] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchServices(), fetchStats()])
      .then(([servicesRes, statsRes]) => {
        setServices(servicesRes.data);
        setStats(statsRes.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching homepage data:", err);
        setLoading(false);
      });
  }, []);

  // Fallback stats if backend is empty
  const displayStats = stats.length > 0 ? stats : [
    { value: "200+", label: "Happy Clients" },
    { value: "50+", label: "Projects Done" },
    { value: "10+", label: "Team Members" },
    { value: "5+", label: "Years Experience" }
  ];

  return (
    <div className="pt-20 overflow-hidden">
        <SEO 
  title="Nexora Creative Solutions | Best Web Design & App Development in Kenya"
  description="Nexora Creative Solutions is a top-rated tech agency in Thika & Nairobi. We specialize in Custom Mobile Apps, Responsive Websites, and Digital Branding."
  url="/"
/>
     {/* Hero Section - Fun & Creative Style */}
      <section className="relative h-[700px] flex items-center justify-center text-center text-white overflow-hidden font-creative">
        
        {/* Background Image Layer */}
        <div className="absolute inset-0 z-0">
          <img 
            src={picture}
            alt="Hero Background" 
            className="w-full h-full object-cover"
          />
          {/* Dark Overlay with Dull Transparency (85% Opacity for better text contrast) */}
          <div className="absolute inset-0 bg-brand-charcoal/40 backdrop-blur-sm"></div>
        </div>

        {/* Animated Blob - Moves behind text but over the dark overlay */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-rose/20 rounded-full blur-[100px] z-0"
        />

        {/* Content Layer (Centered & In Front) */}
        <div className="relative z-10 max-w-5xl mx-auto px-4">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
        
            
            <motion.h1 
              variants={fadeInUp} 
              className="text-6xl md:text-6xl font-black mb-8 leading-tight text-white tracking-tight"
            >
              We Create Media With <br />
              <span className="text-brand-rose inline-block relative px-2">
                Cutting-Edge
                {/* Squiggly Line for fun effect */}
                <motion.svg 
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: 1 }}
                  className="absolute -bottom-4 left-0 w-full h-4 text-white" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 25 10, 50 5 T 100 5" stroke="currentColor" strokeWidth="4" fill="none"/>
                </motion.svg>
              </span> Technology
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="text-lg text-gray-200 mb-12 leading-relaxed max-w-2xl mx-auto font-light">
              We deliver innovative digital solutions that drive growth, efficiency, and scalable results for your business.
            </motion.p>
            
            {/* Buttons with Navigation */}
            <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-4">
              
              {/* Get Started -> Services */}
              <Link to="/services">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-brand-rose px-8 py-3 rounded-full font-bold text-white hover:bg-white hover:text-brand-rose transition-all shadow-[0_10px_20px_rgba(167,0,42,0.3)] flex items-center gap-2"
                >
                  Get Started <ArrowRight size={20} />
                </motion.button>
              </Link>

              {/* Learn More -> About Us */}
              <Link to="/about">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/10 border border-white/30 backdrop-blur-md text-white px-8 py-3 rounded-full font-bold hover:bg-white hover:text-brand-charcoal transition-all"
                >
                  Learn More
                </motion.button>
              </Link>

            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-brand-charcoal text-white relative overflow-hidden">
        
        {/* --- Background Layers --- */}
        
        {/* Layer 1: Pattern Image */}
        <div
          className="absolute inset-0 z-0 opacity-50" // Subtle opacity
          style={{
            backgroundImage: `url(${picture})`,
            backgroundRepeat: 'repeat',
            backgroundSize: '300px auto', 
            backgroundPosition: 'center'
          }}
        ></div>

        {/* Layer 2: Dull Dark Overlay */}
        <div className="absolute inset-0 z-0 bg-brand-charcoal/50"></div>


        {/* --- Content (Wrapped in relative z-10) --- */}
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="flex flex-wrap justify-center md:justify-between gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-gray-700/50"
          >
            {displayStats.map((stat, idx) => (
              <motion.div variants={fadeInUp} key={idx} className="flex-1 pt-8 md:pt-0 px-4">
                <motion.h3 
                  whileHover={{ scale: 1.2, color: "#fff" }}
                  className="text-5xl font-extrabold text-brand-rose mb-2 cursor-default font-creative"
                >
                  {stat.value}
                </motion.h3>
                <p className="text-gray-300 font-medium text-lg">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 max-w-2xl mx-auto"
          >
            <span className="text-brand-rose font-bold uppercase tracking-wider">Our Expertise</span>
            <h2 className="text-4xl font-bold text-brand-charcoal mt-3 mb-4">Services We Provide</h2>
          </motion.div>
          
          {loading ? (
            <div className="flex justify-center p-20">
              <Loader2 size={48} className="animate-spin text-brand-rose opacity-20" />
            </div>
          ) : (
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid md:grid-cols-3 gap-8"
            >
              {services.slice(0, 3).map((service) => (
                <motion.div 
                  key={service.id} 
                  variants={fadeInUp}
                  whileHover={{ y: -10 }}
                  className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 group border border-gray-100"
                >
                  <motion.div 
                    whileHover={{ rotate: 360, backgroundColor: "#03045E", color: "#fff" }}
                    transition={{ duration: 0.6 }}
                    className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-brand-rose mb-6 shadow-sm"
                  >
                    <LucideIcon name={service.icon} size={24} />
                  </motion.div>
                  <h3 className="text-xl font-bold mb-4 text-brand-charcoal">{service.title}</h3>
                  <p className="text-gray-600 mb-8 leading-relaxed line-clamp-3">{service.description}</p>
                  <Link to={`/services/${service.id}`} className="text-brand-rose font-bold flex items-center gap-2 hover:gap-4 transition-all">
                    Read More <ArrowRight size={18}/>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
             <div className="absolute top-0 left-0 w-full h-full bg-brand-rose rounded-2xl transform translate-x-4 translate-y-4 z-0"></div>
            <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80" alt="Team Meeting" className="rounded-2xl shadow-2xl relative z-10"/>
          </motion.div>
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.span variants={fadeInUp} className="text-brand-rose font-bold uppercase tracking-wider">Why Choose Us</motion.span>
            <motion.h2 variants={fadeInUp} className="text-4xl font-bold mt-3 mb-6 text-brand-charcoal leading-tight">Why You Should Trust Nexora?</motion.h2>
            
            <div className="grid gap-6">
              {[
                { title: 'Expert Team Members', desc: 'Highly skilled professionals dedicated to your success.' },
                { title: '24/7 Support', desc: 'We are always here to help you whenever you need us.' },
                { title: 'Proven Track Record', desc: 'Hundreds of successful projects and satisfied clients.' },
                { title: 'Innovative Strategies', desc: 'Using the latest tech to stay ahead of the competition.' }
              ].map((item, idx) => (
                <motion.div 
                  variants={fadeInUp}
                  key={idx} 
                  whileHover={{ scale: 1.02, backgroundColor: "#eff6ff" }}
                  className="flex items-start gap-4 p-4 rounded-xl transition duration-300 cursor-pointer"
                >
                  <div className="bg-brand-charcoal/10 p-2 rounded-full shrink-0">
                    <CheckCircle className="text-brand-charcoal w-6 h-6" />
                  </div>
                  <div>
                      <h4 className="text-xl font-bold text-brand-charcoal mb-2">{item.title}</h4>
                      <p className="text-gray-600">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;