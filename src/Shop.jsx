import React, { useState } from 'react';
import { ShoppingBag, Clock, ShieldCheck, ArrowLeft, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import MpesaModal from './MpesaModal';
import SEO from './components/SEO';

// --- INVENTORY DATA ---
const MERCH = [
  {
    id: 1,
    name: "Nexora 'Source Code' Hoodie (White)",
    price: 2800, 
    image: "/images/White.png", 
    tag: "Heavyweight Cotton",
    shipsIn: "3-5 Days",
    sizes: ["M", "L", "XL", "XXL"]
  },
   {
    id: 2, // Fixed ID
    name: "Nexora 'Source Code' Hoodie (Black)",
    price: 2800, 
    image: "/images/Black.png", 
    tag: "Heavyweight Cotton",
    shipsIn: "3-5 Days",
    sizes: ["M", "L", "XL", "XXL"]
  },
   {
    id: 3, // Fixed ID
    name: "Nexora 'Source Code' Hoodie (Beige)",
    price: 2800, 
    image: "/images/Beige.png", 
    tag: "Heavyweight Cotton",
    shipsIn: "3-5 Days",
    sizes: ["M", "L", "XL", "XXL"]
  },
  {
    id: 4, // Fixed ID
    name: "Nexora 'Source Code' Hoodie (Burgundy)",
    price: 2800, 
    image: "/images/Burgundy.png", 
    tag: "Heavyweight Cotton",
    shipsIn: "3-5 Days",
    sizes: ["M", "L", "XL", "XXL"]
  },
  {
    id: 5,
    name: "Agency Sweatshirt (Burgundy)",
    price: 2000,
    image: "/images/Burgundy_sweat.png",
    tag: "Limited Drop",
    shipsIn: "3-5 Days",
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 6,
    name: "Agency Sweatshirt (White)",
    price: 2000,
    image: "/images/White_sweat.png",
    tag: "Limited Drop",
    shipsIn: "3-5 Days",
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 7,
    name: "Agency Sweatshirt (Beige)",
    price: 2000,
    image: "/images/Beige_sweat.png",
    tag: "Limited Drop",
    shipsIn: "3-5 Days",
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 8,
    name: "Agency Sweatshirt (Black)",
    price: 2000,
    image: "/images/Black_sweat.png",
    tag: "Limited Drop",
    shipsIn: "3-5 Days",
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 9,
    name: "Nexora Developer Tee (White)",
    price: 750,
    image: "/images/White_tee.png",
    tag: "Essential",
    shipsIn: "2 Days",
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 10, // Fixed ID
    name: "Nexora Developer Tee (Black)",
    price: 750,
    image: "/images/Black_tee.png",
    tag: "Essential",
    shipsIn: "2 Days",
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 11, // Fixed ID
    name: "Nexora Developer Tee (Beige)",
    price: 750,
    image: "/images/Beige_tee.png",
    tag: "Essential",
    shipsIn: "2 Days",
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 12, // Fixed ID
    name: "Nexora Developer Tee (Burgundy)",
    price: 750,
    image: "/images/Burgundy_tee.png",
    tag: "Essential",
    shipsIn: "2 Days",
    sizes: ["S", "M", "L", "XL"]
  }
];

const ProductCard = ({ item, index, onBuy }) => {
  const [mySize, setMySize] = useState(""); // <--- Only affects THIS card

  const handlePreOrderClick = () => {
    if (!mySize) {
        toast.error("Please select a size first");
        return;
    }
    // Tell the main shop we want to buy this item with this size
    onBuy(item, mySize);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group flex flex-col bg-white rounded-[2rem] p-4 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-brand-rose/10 transition-all duration-300 border border-gray-100"
    >
      
      {/* Image */}
      <div className="bg-gray-50 rounded-[1.5rem] p-6 mb-6 relative overflow-hidden">
         <motion.img 
           whileHover={{ scale: 1.1 }}
           src={item.image} 
           alt={item.name} 
           className="w-full h-64 object-contain mix-blend-multiply" 
         />
         <div className="absolute top-4 left-4 bg-white/90 backdrop-blur border border-gray-200 text-xs font-bold px-3 py-1 rounded-full text-brand-charcoal">
           {item.tag}
         </div>
      </div>

      {/* Details */}
      <div className="px-2">
          <div className="mb-2 flex justify-between items-start">
              <h3 className="text-lg font-bold text-brand-charcoal leading-tight">{item.name}</h3>
          </div>
          
          <div className="flex justify-between items-center mb-4">
               <span className="text-2xl font-black text-brand-rose">Ksh {item.price.toLocaleString()}</span>
               <p className="text-xs text-gray-400 flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
                  <Clock size={12}/> {item.shipsIn}
               </p>
          </div>

          {/* Size Selector - Uses 'mySize' specific to this card */}
          <p className="text-xs font-bold text-gray-400 uppercase mb-2">Select Size</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {item.sizes.map(size => (
              <button
                key={size}
                onClick={() => setMySize(size)}
                className={`w-10 h-10 text-sm font-bold rounded-full border transition-all ${
                  mySize === size 
                  ? "bg-brand-charcoal text-white border-brand-charcoal scale-110 shadow-lg" 
                  : "bg-white text-gray-400 border-gray-200 hover:border-brand-rose hover:text-brand-rose"
                }`}
              >
                {size}
              </button>
            ))}
          </div>

          {/* Action Button */}
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePreOrderClick}
            className="w-full bg-brand-rose text-white py-4 rounded-full font-bold hover:bg-white hover:text-brand-rose border-2 border-brand-rose transition-all flex justify-center items-center gap-2 shadow-[0_10px_20px_rgba(167,0,42,0.2)]"
          >
            <ShoppingBag size={20} />
            Pre-Order Now
          </motion.button>
          
          <div className="mt-4 text-center">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center justify-center gap-1">
                  <ShieldCheck size={12} /> Secured by Safaricom Daraja API
              </span>
          </div>
      </div>
    </motion.div>
  );
};

// --- 2. RECEIPT VIEW ---
const ReceiptView = ({ transaction, item, size, onBack }) => {
  const date = new Date().toLocaleString();
  const adminPhone = "254115332870"; 

const handleWhatsApp = () => {
    // 1. Format the message clearly
    const message = 
`*NEXORA SHOP RECEIPT* ✅
------------------
*Order Ref:* ${transaction.receipt}
*Item:* ${item.name}
*Size:* ${size}
*Amount:* KES ${item.price}
*Date:* ${new Date().toLocaleString()}
------------------
*Payment Verified.* Please process my delivery to ...(add your location)`;

    // 2. Encode and Open
    // Ensure adminPhone is in format 254... without the +
    const adminPhone = "254115332870"; 
    const url = `https://wa.me/${adminPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
};

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative border border-gray-100">
        <div className="bg-brand-charcoal p-8 text-center relative overflow-hidden">
           <div className="absolute inset-0 opacity-10" style={{backgroundImage: `url('/pattern.png')`}}></div>
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-bounce">
                <CheckCircle size={32} className="text-brand-rose" />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight font-creative">PAYMENT SUCCESSFUL</h2>
            <p className="text-gray-300 text-sm font-medium">Transaction Confirmed</p>
          </div>
        </div>

        <div className="p-8 space-y-6">
          <div className="text-center border-b border-gray-100 pb-6">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Total Paid</p>
            <p className="text-4xl font-black text-brand-charcoal">KES {item.price.toLocaleString()}</p>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">M-Pesa Ref</span>
              <span className="font-bold text-brand-charcoal">{transaction.receipt}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Date</span>
              <span className="font-bold text-brand-charcoal text-right">{date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Item</span>
              <span className="font-bold text-brand-charcoal">{item.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Size</span>
              <span className="font-bold text-brand-rose bg-red-50 px-3 py-1 rounded-full">{size}</span>
            </div>
          </div>
          <div className="space-y-3 pt-4">
            <button onClick={handleWhatsApp} className="w-full bg-brand-rose text-white py-4 rounded-full font-bold hover:bg-white hover:text-brand-rose border border-brand-rose transition-all flex items-center justify-center gap-2 shadow-lg">
              <span className="text-xl">👉</span> Send to Nexora for Delivery
            </button>
            <button onClick={onBack} className="w-full bg-white border border-gray-200 text-gray-400 py-3 rounded-full font-bold hover:bg-gray-50 transition">
              Close Receipt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 3. MAIN SHOP COMPONENT ---
export default function Shop({ onBack }) { 
  const [view, setView] = useState('shop');
  const [successData, setSuccessData] = useState(null);
  
  // State for the ACTIVE transaction (the one being paid for right now)
  const [buyingItem, setBuyingItem] = useState(null);
  const [buyingSize, setBuyingSize] = useState(""); 
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  // This function is passed down to every ProductCard
  const handleBuyRequest = (item, size) => {
    setBuyingItem(item);
    setBuyingSize(size);
    setIsPaymentOpen(true);
  };

  return (
    <>
    <SEO 
  title="Nexora Shop | Official Developer Merch"
  description="Buy official Nexora Creative Solutions merchandise. High-quality 'Source Code' hoodies, tees, and developer gear. Delivery countrywide."
  url="/shop"
/>
      {view === 'receipt' && successData ? (
        <ReceiptView 
            transaction={successData.details}
            item={successData.item}
            size={successData.size}
            onBack={() => {
                setView('shop');
                setBuyingItem(null);
            }}
        />
      ) : (
    <div className="bg-white min-h-screen pb-20 font-sans text-brand-charcoal">
      
      {/* Navbar */}
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-gray-100 px-6 py-3 flex items-center justify-between shadow-sm">
         <div className="flex items-center gap-4">
             {onBack && (
                 <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition text-brand-charcoal">
                     <ArrowLeft size={24} />
                 </button>
             )}
             <div className="flex items-center gap-2">
                 <img src="/NCS_Secondary_Logo.png" alt="Nexora Logo" className="h-10 w-auto" />
                 <span className="text-brand-charcoal font-black text-xl hidden md:block tracking-tight">SHOP</span>
             </div>
         </div>
         <div className="flex items-center gap-3">
             <div className="text-[10px] md:text-xs font-bold bg-brand-charcoal text-white px-4 py-2 rounded-full shadow-lg tracking-widest uppercase">
                 Pre-Order Open
             </div>
         </div>
      </div>

      {/* Hero */}
      <div className="relative bg-brand-charcoal text-white py-20 overflow-hidden font-creative">
         <div className="absolute inset-0 opacity-20" style={{backgroundImage: `url('/pattern.png')`, backgroundSize: '300px auto'}}></div>
         <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-6 text-center max-w-3xl mx-auto relative z-10"
          >
            <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-tight">
              WEAR THE <span className="text-brand-rose">CODE.</span>
            </h2>
            <p className="text-gray-300 text-lg md:text-xl font-sans max-w-xl mx-auto">
                Official Agency Merchandise. Engineered in Nairobi. Printed in Thika.
            </p>
          </motion.div>
      </div>

      {/* Product Grid - Renders individual ProductCards */}
      <div className="px-6 py-12 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 -mt-10 relative z-10">
        {MERCH.map((item, index) => (
          <ProductCard 
            key={item.id} 
            item={item} 
            index={index} 
            onBuy={handleBuyRequest} // Pass the handler down
          />
        ))}
      </div>

      {/* Payment Modal */}
      {buyingItem && (
            <MpesaModal 
                isOpen={isPaymentOpen} 
                onClose={() => setIsPaymentOpen(false)}
                total={buyingItem.price}
                item={buyingItem}
                size={buyingSize} 
                onPaymentSuccess={(details) => {
                    setSuccessData({
                        details: details,
                        item: buyingItem,
                        size: buyingSize
                    });
                    setIsPaymentOpen(false);
                    setView('receipt'); 
                    toast.success("Payment Successful!");
                }}
            />
          )}
        </div>
      )}
    </>
  );
}