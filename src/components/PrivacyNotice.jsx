import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const PrivacyNotice = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted
    const consent = localStorage.getItem('nexora_cookie_consent');
    if (!consent) {
      // Show banner after 2 seconds delay for better UX
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('nexora_cookie_consent', 'true');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-4 left-4 right-4 md:left-8 md:right-auto md:max-w-md z-50"
        >
          <div className="bg-brand-charcoal/95 backdrop-blur-md text-white p-6 rounded-2xl shadow-2xl border border-white/10 relative">
            
            {/* Close Icon (Optional decline) */}
            <button 
              onClick={() => setIsVisible(false)} 
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
            >
              <X size={16} />
            </button>

            <h4 className="font-bold text-lg mb-2 text-brand-rose">We value your privacy</h4>
            <p className="text-gray-300 text-sm mb-4 leading-relaxed">
              We use cookies to enhance your experience and secure our forms (reCAPTCHA). By continuing to visit this site you agree to our use of cookies.
            </p>

            <div className="flex gap-3">
              <button 
                onClick={acceptCookies}
                className="bg-brand-rose text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-white hover:text-brand-charcoal transition-all flex-grow"
              >
                Accept
              </button>
              <a 
                href="/privacy" 
                className="px-4 py-2 rounded-full text-sm font-bold border border-white/20 hover:bg-white/10 transition-colors text-center"
              >
                Learn More
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PrivacyNotice;