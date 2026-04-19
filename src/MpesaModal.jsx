import React, { useState } from 'react';
import { X, Smartphone, Loader, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { initiateStkPush, checkPaymentStatus } from './api';

export default function MpesaModal({ isOpen, onClose, total, onPaymentSuccess, item, size }) {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("input"); // 'input' | 'success'

  const handlePay = async () => {
    if (phone.length < 10) {
      toast.error("Please enter a valid phone number (e.g., 0712345678)");
      return;
    }

    setLoading(true);

    try {
      const res = await initiateStkPush({ 
        phone: phone, 
        amount: total,
        product_id: item.id,
        size: size 
      });
      
      const data = res.data;

      if (data.ResponseCode === "0") {
        const checkoutID = data.CheckoutRequestID;
        setStep("success");
        checkStatus(checkoutID);
      } else {
        toast.error("STK Push Failed: " + (data.errorMessage || "Unknown Error"));
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      toast.error("System Error. Please try again.");
      setLoading(false);
    }
  };

  const checkStatus = async (checkoutID) => {
    let attempts = 0;
    const maxAttempts = 20; 

    const interval = setInterval(async () => {
        attempts++;
        try {
            const res = await checkPaymentStatus(checkoutID);
            const data = res.data;
            
            // --- SUCCESS ---
            if (data.status === "COMPLETED") {
                clearInterval(interval);
                onPaymentSuccess({ 
                    receipt: data.checkout_request_id, 
                    phone: phone 
                });
                onClose();
            } 
            // --- FAILED ---
            else if (data.status === "FAILED") {
                clearInterval(interval);
                toast.error(`Payment Failed`);
                setStep("input");
                setLoading(false);
            }
        } catch (error) {
            console.log("Polling error", error);
        }

        if (attempts >= maxAttempts) {
            clearInterval(interval);
            toast.error("Timeout. Did you enter your PIN?");
            setStep("input");
            setLoading(false);
        }
    }, 3000); 
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-brand-charcoal/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4 text-brand-charcoal">
      <div className="bg-white rounded-[2rem] w-full max-w-sm overflow-hidden shadow-2xl relative border border-gray-100">
        
        {/* --- BRANDED HEADER (Charcoal + Pattern) --- */}
        <div className="bg-brand-charcoal p-8 text-white text-center relative overflow-hidden">
          {/* Pattern Overlay */}
          <div className="absolute inset-0 opacity-20" style={{backgroundImage: `url('/pattern.png')`}}></div>
          
          <button onClick={onClose} className="absolute top-4 right-4 bg-white/10 p-2 rounded-full hover:bg-white/20 transition z-20">
              <X size={18} />
          </button>

          <div className="relative z-10">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg ring-4 ring-white/10">
                <Smartphone size={32} className="text-[#24B02E]" />
              </div>
              <h2 className="text-2xl font-black tracking-tight font-creative">SECURE PAY</h2>
              <p className="text-gray-300 text-xs font-bold uppercase tracking-widest mt-1">Via M-Pesa</p>
          </div>
        </div>

        {/* --- CONTENT --- */}
        <div className="p-8">
            {step === "input" ? (
                <div className="space-y-6">
                    <div className="text-center">
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Total to Pay</p>
                        <p className="text-4xl font-black text-brand-charcoal">KES {total.toLocaleString()}</p>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 mb-2 ml-1">PHONE NUMBER</label>
                        <input 
                            type="tel" 
                            placeholder="07..." 
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full bg-gray-50 border-2 border-gray-100 p-4 rounded-2xl font-bold text-xl text-brand-charcoal focus:border-brand-rose focus:ring-0 outline-none transition-all placeholder:text-gray-300"
                        />
                    </div>

                    <button 
                        onClick={handlePay}
                        disabled={loading}
                        className="w-full bg-brand-rose text-white py-4 rounded-full font-bold text-lg shadow-[0_10px_20px_rgba(167,0,42,0.3)] hover:bg-white hover:text-brand-rose border border-brand-rose transition-all disabled:opacity-70 flex justify-center items-center gap-2"
                    >
                        {loading ? <Loader className="animate-spin" /> : "Send Prompt"}
                    </button>
                    
                    <div className="flex justify-center items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                        <ShieldCheck size={12} /> Encrypted by Safaricom
                    </div>
                </div>
            ) : (
                <div className="text-center py-6">
                    <div className="inline-block p-4 rounded-full bg-green-50 border border-green-100 text-[#24B02E] mb-6 animate-pulse">
                        <Smartphone size={40} />
                    </div>
                    <h3 className="text-2xl font-black text-brand-charcoal mb-3">Check Your Phone</h3>
                    <p className="text-gray-500 leading-relaxed text-sm">
                        We sent a prompt to <b className="text-brand-charcoal">{phone}</b>.<br/>
                        Enter your M-Pesa PIN to complete the order.
                    </p>
                    <div className="mt-6 flex justify-center gap-2">
                        <span className="w-2 h-2 bg-brand-rose rounded-full animate-bounce" style={{animationDelay: '0s'}}></span>
                        <span className="w-2 h-2 bg-brand-rose rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                        <span className="w-2 h-2 bg-brand-rose rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></span>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}