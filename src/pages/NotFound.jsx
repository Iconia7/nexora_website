import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';
import SEO from '../components/SEO';

const NotFound = () => {
  return (
    <div className="pt-20 min-h-[80vh] flex items-center justify-center bg-white overflow-hidden relative">
      <SEO 
        title="404 - Page Not Found | Nexora Creative Solutions"
        description="The page you are looking for does not exist on Nexora Creative Solutions."
        url="/404"
        noindex={true}
      />
      
      {/* Decorative Sparkles (SVG shapes) */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute top-1/3 left-1/4 text-brand-rose opacity-20 pointer-events-none hidden md:block"
      >
        <svg width="50" height="50" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
        </svg>
      </motion.div>

      <motion.div 
        animate={{ scale: [1, 1.1, 1], rotate: [0, -10, 10, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute bottom-1/3 right-1/4 text-brand-charcoal opacity-20 pointer-events-none hidden md:block"
      >
        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
        </svg>
      </motion.div>

      <div className="text-center px-4 max-w-3xl mx-auto relative z-10">
        
        {/* The Giant 404 Text with Image Mask */}
        <motion.h1 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-[150px] md:text-[250px] font-black leading-none tracking-tighter bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80')] bg-cover bg-center bg-clip-text text-transparent select-none drop-shadow-sm"
        >
          404
        </motion.h1>

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-brand-charcoal mb-4">
            Oops! <span className="text-brand-rose">Page not found</span>
          </h2>
          <p className="text-gray-500 text-lg mb-10 max-w-lg mx-auto">
            The page you are looking for cannot be found. Take a break before trying again.
          </p>

          {/* Button */}
          <Link to="/">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-brand-rose text-white px-10 py-4 rounded-full font-bold shadow-lg hover:bg-brand-charcoal transition-all flex items-center gap-2 mx-auto"
            >
              Go To Home Page
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;