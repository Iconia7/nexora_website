import React, { useState } from 'react';
import { servicePricing } from '../data';
import axios from 'axios';
import { Check, X, Smartphone, CreditCard, FileText, Loader2, CheckCircle, AlertCircle, Copy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'; 
import { db } from '../firebase'; 
import emailjs from '@emailjs/browser';
import picture from '../assets/pattern.png';
import SEO from '../components/SEO';
import { useRef } from 'react';
import ReCAPTCHA from "react-google-recaptcha";
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';

const Pricing = () => {
  // --- STATE MANAGEMENT ---
  const [activeCategory, setActiveCategory] = useState("Website Development");
  const [selectedPlan, setSelectedPlan] = useState(null); // Stores the plan user clicked
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('mpesa'); // 'mpesa', 'invoice', 'visa'
  const [loading, setLoading] = useState(false);

  const captchaRef = useRef(null);
  
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', mpesaCode: '' });
  const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'

  // Open Modal
const handleSelectPlan = (plan) => {
    setSelectedPlan({ ...plan, category: activeCategory }); // Track which service they picked
    setIsModalOpen(true);
    setStatus('idle');
  };

const generatePDF = (docType, paymentDetails) => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString();
    const isReceipt = docType === "Receipt";
    
    // -- BRANDING HEADER --
    // Navy Blue Background
    doc.setFillColor(2, 2, 48); 
    doc.rect(0, 0, 210, 40, 'F');
    
    // Logo Text / Image
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("NEXORA CREATIVE SOLUTIONS", 20, 25);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Thika, Kiambu | info@nexoracreatives.co.ke | +254115332870", 20, 35);

    // -- DOCUMENT TYPE & STATUS --
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(isReceipt ? "OFFICIAL RECEIPT" : "PROFORMA INVOICE", 140, 60);
    
    // "PAID" Stamp or "UNPAID" Status
    if (isReceipt) {
        doc.setTextColor(34, 197, 94); // Green
        doc.setFontSize(14);
        doc.text("STATUS: PAID", 140, 70);
        doc.setTextColor(0, 0, 0); // Reset
    } else {
        doc.setTextColor(220, 38, 38); // Red
        doc.setFontSize(14);
        doc.text("STATUS: PENDING", 140, 70);
        doc.setTextColor(0, 0, 0);
    }

    // -- METADATA --
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Date: ${date}`, 140, 80);
    doc.text(`Ref: ${paymentDetails.ref}`, 140, 85);
    
    // Client Details
    doc.setFont("helvetica", "bold");
    doc.text("Bill To:", 20, 60);
    doc.setFont("helvetica", "normal");
    doc.text(formData.name.toUpperCase(), 20, 65);
    doc.text(formData.email, 20, 70);
    doc.text(formData.phone, 20, 75);

    // -- TABLE --
    // Header
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 95, 190, 95);
    doc.setFont("helvetica", "bold");
    doc.text("Service Description", 20, 102);
    doc.text("Amount (KES)", 160, 102);
    doc.line(20, 105, 190, 105);

    // Item
    doc.setFont("helvetica", "normal");
    doc.text(`${selectedPlan.plan} (${selectedPlan.category})`, 20, 115);
    doc.text(selectedPlan.price, 160, 115);
    
    // Extra M-Pesa Info for Receipts
    if(isReceipt) {
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text(`Paid via M-Pesa. Code: ${paymentDetails.mpesaCode}`, 20, 122);
        doc.setTextColor(0, 0, 0);
    }

    // -- TOTALS --
    doc.line(20, 130, 190, 130);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Total Total:", 120, 140);
    doc.setTextColor(2, 2, 48); // Navy
    doc.text(`KES ${selectedPlan.price}`, 160, 140);

    // -- FOOTER --
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text("Thank you for doing business with us.", 20, 160);
    
    if (!isReceipt) {
         doc.setFontSize(9);
         doc.text("PAYMENT INSTRUCTIONS:", 20, 175);
         doc.text("Paybill: 4041463", 20, 180);
         doc.text(`Account: ${selectedPlan.plan.substring(0,10)}`, 20, 185);
    }

    return doc;
};

  // Close Modal
  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ name: '', email: '', phone: '', mpesaCode: '' });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMpesaPay = async (e) => {
    e.preventDefault();

    // 1. Validate Inputs
    if (!formData.name || !formData.email || !formData.phone) {
        toast.error("Please fill in your contact details first.");
        return;
    }
    
    // 2. Validate Captcha
    const token = captchaRef.current.getValue();
    if (!token) {
       toast.error("Please verify that you are not a robot 🤖");
       return;
    }

    if (selectedPlan.price === "Custom" || selectedPlan.price === "Quote Based") {
        toast.error("For Custom plans, please generate an Invoice.");
        setPaymentMethod("invoice");
        return;
    }

    setLoading(true);
    const cleanPrice = parseInt(selectedPlan.price.replace(/,/g, ''));
    const accountRefName = selectedPlan.plan.substring(0, 12);

    try {
        // 3. Trigger STK Push
        // We use the same API route as the shop!
        const res = await axios.post('/api/stkpush', {
            phone: formData.phone,
            amount: cleanPrice,
            item: { name: selectedPlan.plan }, // Pass the Plan Name as the item
            size: selectedPlan.period,
            accountRef: accountRefName
        });

        if (res.data.ResponseCode === "0") {
            toast.success(`STK Push sent to ${formData.phone}. Enter PIN!`);
            
            // 4. Start Polling for Payment Confirmation
            const checkoutID = res.data.CheckoutRequestID;
            pollPaymentStatus(checkoutID);
        } else {
            toast.error("STK Push Failed: " + res.data.errorMessage);
            setLoading(false);
        }

    } catch (error) {
        console.error(error);
        toast.error("Payment System Error. Try again.");
        setLoading(false);
    }
  };

  // --- NEW: POLL STATUS (Check if they paid) ---
  const pollPaymentStatus = async (checkoutID) => {
    let attempts = 0;
    const maxAttempts = 20;
    
    const interval = setInterval(async () => {
        attempts++;
        try {
            const res = await axios.post('/api/query', { checkoutRequestID: checkoutID });
            
            if (res.data.ResultCode === "0") {
                clearInterval(interval);
                // Payment Success! Now save the order to Firebase
                await finalizeOrder("Paid via M-Pesa", res.data.CheckoutRequestID);
            } else if (['1032', '1'].includes(res.data.ResultCode)) {
                 clearInterval(interval);
                 toast.error("Payment Cancelled by user.");
                 setLoading(false);
            }
        } catch (err) { console.log("Polling..."); }

        if (attempts >= maxAttempts) {
            clearInterval(interval);
            toast.error("Payment Timeout. Please try again.");
            setLoading(false);
        }
    }, 3000);
  };

const finalizeOrder = async (paymentStatus, receiptRef = "N/A") => {
      try {
        // 1. Generate PDF (Data URI)
        const isMpesa = paymentMethod === 'mpesa';
        const docType = isMpesa ? "Receipt" : "Invoice";
        const refNumber = isMpesa ? mpesaRef : `INV-${Math.floor(Math.random() * 10000)}`;

        // 1. Generate PDF
        const pdfDoc = generatePDF(docType, { 
            ref: refNumber, 
            mpesaCode: mpesaRef 
        });

        // 2. Auto-Download for User
        pdfDoc.save(`Nexora_${docType}_${selectedPlan.plan.replace(/\s/g, '_')}.pdf`);
        // 2. Save to Firebase
        await addDoc(collection(db, "orders"), {
            customer: formData,
            plan: selectedPlan,
            method: paymentMethod,
            amount: selectedPlan.price,
            status: paymentStatus,
            mpesaReceipt: receiptRef,
            timestamp: serverTimestamp()
        });

        // 3. Prepare Email

        const emailSubject = isMpesa ? "Payment Receipt" : "Invoice Generated";
        const emailMessage = isMpesa 
            ? `We confirm receipt of KES ${selectedPlan.price} via M-Pesa (${mpesaRef}). Your official receipt has been downloaded.`
            : `Please find your invoice details. Paybill: 4041463, Account: ${selectedPlan.plan}. Please download the invoice generated.`;

        const clientParams = {
            to_email: formData.email,
            from_name: "Nexora Creative Solution Billing Team",
            subject: emailSubject,
            message_body: emailMessage,
        };

        const adminParams = {
            to_email: "info@nexoracreatives.co.ke",
            subject: `New Order: ${selectedPlan.plan}`,
            message_body: `New ${paymentMethod} order from ${formData.name}. Phone: ${formData.phone}`
        };

        await Promise.all([
            emailjs.send("service_nhwsclu", "template_61eywtf", adminParams, "ctUKvg88_0Th5sfKn"),
            emailjs.send("service_nhwsclu", "template_61eywtf", clientParams, "ctUKvg88_0Th5sfKn")
        ]);

        
        setStatus('success');
        toast.success(paymentMethod === 'mpesa' ? "Payment Confirmed! Receipt Downloaded." : "Invoice Generated & Downloaded!");
        setTimeout(() => closeModal(), 5000);
        setLoading(false);

      } catch (error) {
          console.error("Save Error", error);
          toast.error("Order saved, check your email but PDF generation failed.");
          setLoading(false);
      }
  };

return (
    <div className="pt-20 bg-gray-50 min-h-screen">
       <SEO title="Pricing | Nexora Creative Solutions" description="Transparent pricing packages." url="/pricing"/>
      
      {/* 1. Header Section */}
      <section className="relative py-20 text-center text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={picture} alt="Background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-brand-charcoal/90"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-black mb-4 font-creative">Transparent Pricing</h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Choose a package that fits your business stage. No hidden fees.
          </p>
        </div>
      </section>

      {/* 2. Category Filter (Tabs) */}
      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-20">
        <div className="bg-white p-2 rounded-2xl shadow-xl flex flex-wrap justify-center gap-2 border border-gray-100">
           {Object.keys(servicePricing).map((category) => (
             <button
               key={category}
               onClick={() => setActiveCategory(category)}
               className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                 activeCategory === category 
                 ? 'bg-brand-charcoal text-white shadow-lg scale-105' 
                 : 'text-gray-500 hover:bg-gray-100 hover:text-brand-charcoal'
               }`}
             >
               {category}
             </button>
           ))}
        </div>
      </div>

      {/* 3. Pricing Grid (Dynamic) */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <motion.div 
            key={activeCategory} // Triggers animation on switch
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid md:grid-cols-3 gap-8"
        >
          {servicePricing[activeCategory]?.map((plan, idx) => (
            <div 
              key={idx} 
              className={`relative p-8 rounded-3xl transition-all duration-300 flex flex-col ${
                plan.recommended 
                ? 'bg-brand-charcoal text-white shadow-2xl ring-4 ring-brand-rose/20 scale-105 z-10' 
                : 'bg-white border border-gray-200 text-brand-charcoal shadow-lg hover:shadow-xl'
              }`}
            >
              {plan.recommended && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-brand-rose text-white text-[10px] font-black px-4 py-1 rounded-full shadow-lg uppercase tracking-widest">
                  Best Value
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-bold opacity-80 uppercase tracking-wider mb-2">{plan.plan}</h3>
                <div className="flex items-baseline">
                  {plan.price !== "Custom" && <span className="text-xl font-bold mr-1">KES</span>}
                  <span className="text-4xl font-black tracking-tight">{plan.price}</span>
                </div>
                <p className={`text-xs font-bold uppercase tracking-widest mt-2 ${plan.recommended ? 'text-gray-400' : 'text-gray-400'}`}>
                  {plan.period}
                </p>
              </div>

              <div className={`h-px w-full mb-6 ${plan.recommended ? 'bg-white/10' : 'bg-gray-100'}`}></div>

              <ul className="space-y-4 mb-8 flex-grow">
                {plan.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-3">
                    <CheckCircle size={18} className={`mt-0.5 flex-shrink-0 ${plan.recommended ? 'text-brand-rose' : 'text-green-600'}`} />
                    <span className="text-sm font-medium leading-relaxed opacity-90">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button 
                onClick={() => handleSelectPlan(plan)}
                className={`w-full py-4 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 ${
                plan.recommended 
                ? 'bg-brand-rose hover:bg-white hover:text-brand-rose text-white' 
                : 'bg-gray-100 text-brand-charcoal hover:bg-brand-charcoal hover:text-white'
              }`}>
                Get Started
              </button>
            </div>
          ))}
        </motion.div>
        
        {/* Fallback if category empty */}
        {(!servicePricing[activeCategory] || servicePricing[activeCategory].length === 0) && (
            <div className="text-center py-20">
                <p className="text-gray-400">Custom pricing available on request for this service.</p>
                <Link to="/contact" className="text-brand-rose font-bold hover:underline">Contact Us</Link>
            </div>
        )}
      </div>

      {/* 3. CHECKOUT MODAL */}
      <AnimatePresence>
        {isModalOpen && selectedPlan && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-charcoal/80 backdrop-blur-sm"
            >
                <motion.div 
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="bg-white rounded-3xl w-full max-w-2xl relative shadow-2xl overflow-hidden flex flex-col md:flex-row"
                >
                    {/* Close Button */}
                    <button onClick={closeModal} className="absolute top-4 right-4 z-20 text-gray-400 hover:text-brand-rose bg-white rounded-full p-1">
                        <X size={24} />
                    </button>

                    {/* Left Side: Order Summary */}
                    <div className="bg-brand-charcoal text-white p-8 md:w-2/5 flex flex-col justify-between">
                        <div>
                            <h3 className="text-gray-400 uppercase text-xs font-bold tracking-wider mb-2">Order Summary</h3>
                            <div>
                                 <p className="text-xs text-gray-400 mb-1">{selectedPlan.category}</p>
             <h2 className="text-3xl font-bold mb-1">{selectedPlan.plan}</h2>
          </div>
                            <p className="text-brand-rose text-lg font-bold">KES {selectedPlan.price} <span className="text-xs text-gray-400 font-normal">/project</span></p>
                        </div>
                        <div className="mt-8 space-y-3">
                            {selectedPlan.features.slice(0, 3).map((feat, i) => (
                                <div key={i} className="flex gap-2 text-sm text-gray-300">
                                    <Check size={16} className="text-brand-rose shrink-0"/> {feat}
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 pt-6 border-t border-gray-700">
                            <p className="text-xs text-gray-500">Total Due Today</p>
                            <p className="text-2xl font-bold">KES {selectedPlan.price}</p>
                        </div>
                    </div>

                    {/* Right Side: Payment Form */}
                    <div className="p-8 md:w-3/5 bg-gray-50">
        <h3 className="text-xl font-bold text-brand-charcoal mb-6">Secure Checkout</h3>
        
        <form className="space-y-4"> {/* Removed onSubmit here, buttons handle it */}
            
            {/* Contact Inputs */}
            <div className="space-y-3">
                <input 
                    type="text" name="name" placeholder="Full Name" required 
                    value={formData.name} onChange={handleChange}
                    className="w-full p-3 rounded-lg border border-gray-200 text-sm"
                />
                <input 
                    type="email" name="email" placeholder="Email Address" required 
                    value={formData.email} onChange={handleChange}
                    className="w-full p-3 rounded-lg border border-gray-200 text-sm"
                />
                <input 
                    type="tel" name="phone" placeholder="M-Pesa Number (07...)" required 
                    value={formData.phone} onChange={handleChange}
                    className="w-full p-3 rounded-lg border border-gray-200 text-sm"
                />
            </div>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-2 gap-2 mt-4">
                <button 
                    type="button"
                    onClick={() => setPaymentMethod('mpesa')}
                    // DISABLE M-PESA IF PRICE IS CUSTOM
    disabled={selectedPlan.price === "Custom"} 
    className={`p-3 rounded-lg border flex flex-col items-center gap-1 text-xs font-bold transition 
    ${selectedPlan.price === "Custom" ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''} 
    ${paymentMethod === 'mpesa' && selectedPlan.price !== "Custom" ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-500'}`}
                >
                    <Smartphone size={20}/> Pay Now (M-Pesa)
                </button>
                <button 
                    type="button"
                    onClick={() => setPaymentMethod('invoice')}
                    className={`p-3 rounded-lg border flex flex-col items-center gap-1 text-xs font-bold transition ${paymentMethod === 'invoice' ? 'border-brand-rose bg-red-50 text-brand-rose' : 'border-gray-200 text-gray-500'}`}
                >
                    <FileText size={20}/> Pay Later (Invoice)
                </button>
            </div>

            {/* Dynamic Payment Content */}
            <div className="mt-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                {paymentMethod === 'mpesa' ? (
                    <div className="text-center space-y-2">
                         <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2 text-green-600 animate-pulse">
                            <Smartphone size={24} />
                         </div>
                         <p className="text-sm font-bold text-brand-charcoal">Automatic Payment</p>
                         <p className="text-xs text-gray-500">
                             We will send an M-Pesa prompt to <b>{formData.phone || "your phone"}</b>. 
                             <br/>Enter your PIN to complete the order instantly.
                         </p>
                    </div>
                ) : (
                    <div className="space-y-3 text-center">
                         <p className="text-xs text-gray-500 font-bold uppercase">Manual Payment Details</p>
                         <div className="bg-gray-50 p-3 rounded-lg border border-dashed border-gray-300">
                             <p className="text-xs text-gray-500">Paybill</p>
                             <p className="text-xl font-black text-brand-charcoal tracking-widest">4041463</p>
                             
                             <p className="text-xs text-gray-500 mt-2">Account No.</p>
                             {/* Account No is automatically the Plan Name */}
                             <p className="text-sm font-bold text-brand-rose uppercase">
                                 {selectedPlan.plan.replace(/\s/g, '').substring(0, 10) || "NEXORA"}
                             </p>
                         </div>
                         <p className="text-[10px] text-gray-400">
                             Click 'Generate Invoice' to receive this via email.
                         </p>
                    </div>
                )}
            </div>

            <div className="flex justify-center mb-4">
                <ReCAPTCHA
                    ref={captchaRef}
                    sitekey="6LfWPTwsAAAAAL7MIvw9G_BLeA7il4BTwNJCu7eN"
                />
            </div>

            {/* Action Buttons */}
            {paymentMethod === 'mpesa' ? (
                 <button 
                    type="button" // Important: Button type button to prevent form submit
                    onClick={handleMpesaPay}
                    disabled={loading || status === 'success'}
                    className={`w-full py-4 rounded-xl font-bold text-white transition flex items-center justify-center gap-2 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 shadow-lg shadow-green-200'}`}
                 >
                    {loading ? <Loader2 className="animate-spin"/> : <><Smartphone size={18}/> Pay KES {selectedPlan.price}</>}
                 </button>
            ) : (
                 <button 
                    type="button" 
                    onClick={(e) => { e.preventDefault(); finalizeOrder("Pending Invoice"); }}
                    disabled={loading || status === 'success'}
                    className="w-full py-4 rounded-xl font-bold bg-brand-charcoal text-white hover:bg-brand-rose transition shadow-lg flex items-center justify-center gap-2"
                 >
                    {status === 'success' ? <CheckCircle/> : <><FileText size={18}/> Generate Invoice</>}
                 </button>
            )}
            
            <p className="text-[10px] text-center text-gray-400 mt-2">
                Secured by Safaricom & Nexora Creative Solutions
            </p>

        </form>
    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Pricing;