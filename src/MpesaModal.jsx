import React, { useState } from 'react';
import { X, Smartphone, Loader2, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { initiateStkPush, checkPaymentStatus } from './api';
import { useCompany } from './context/CompanyContext';

export default function MpesaModal({ isOpen, onClose, total, onPaymentSuccess, item, size }) {
  const { company: COMPANY } = useCompany();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('input');

  const handlePay = async () => {
    if (phone.length < 10) {
      toast.error('Please enter a valid phone number (e.g., 0712345678)');
      return;
    }

    setLoading(true);

    try {
      const res = await initiateStkPush({
        phone,
        amount: total,
        product_id: item.id,
        item_name: `${item.name}${size ? ` (${size})` : ''}`,
        item_category: item.category || 'Merchandise',
        size,
      });

      const data = res.data;

      if (data.ResponseCode === '0') {
        const checkoutID = data.CheckoutRequestID;
        setStep('success');
        checkStatus(checkoutID);
      } else {
        toast.error('STK Push Failed: ' + (data.errorMessage || 'Unknown Error'));
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      toast.error('System Error. Please try again.');
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

        if (data.status === 'PAID' || data.status === 'COMPLETED') {
          clearInterval(interval);
          onPaymentSuccess({
            receipt: data.mpesa_receipt || data.checkout_request_id,
            phone,
          });
          onClose();
        } else if (data.status === 'FAILED') {
          clearInterval(interval);
          toast.error('Payment Failed');
          setStep('input');
          setLoading(false);
        }
      } catch (error) {
        console.log('Polling error', error);
      }

      if (attempts >= maxAttempts) {
        clearInterval(interval);
        toast.error('Timeout. Did you enter your PIN?');
        setStep('input');
        setLoading(false);
      }
    }, 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-brand-navy/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4 text-ink">
      <div className="card w-full max-w-sm overflow-hidden shadow-lift relative">
        <div className="bg-brand-navy p-7 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-light" aria-hidden="true" />
          <button
            type="button"
            aria-label="Close payment modal"
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/10 p-2 rounded-lg hover:bg-white/20 transition z-20"
          >
            <X size={16} />
          </button>

          <div className="relative z-10">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-soft">
              <Smartphone size={26} className="text-[#24B02E]" />
            </div>
            <h2 className="font-display text-xl font-bold text-white">M-Pesa Checkout</h2>
            <p className="text-white/60 text-xs mt-1">{COMPANY.legalName}</p>
          </div>
        </div>

        <div className="p-7">
          {step === 'input' ? (
            <div className="space-y-5">
              <div className="text-center">
                <p className="text-ink-subtle text-xs font-semibold uppercase tracking-widest mb-1">Total to pay</p>
                <p className="font-display text-3xl font-extrabold text-ink">KES {Number(total).toLocaleString()}</p>
              </div>

              <div>
                <label htmlFor="mpesa-phone" className="label">M-Pesa phone number</label>
                <input
                  id="mpesa-phone"
                  type="tel"
                  placeholder="07XX XXX XXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input font-semibold text-base"
                />
              </div>

              <button
                type="button"
                onClick={handlePay}
                disabled={loading}
                className="btn-primary w-full py-3.5"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : 'Send STK Push Prompt'}
              </button>

              <p className="flex justify-center items-center gap-1.5 text-[11px] text-ink-subtle font-medium">
                <ShieldCheck size={13} className="text-brand-rose" /> Encrypted by Safaricom Daraja
              </p>
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="inline-flex p-4 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 mb-5">
                <Smartphone size={32} />
              </div>
              <h3 className="font-display text-xl font-bold text-ink mb-2">Check your phone</h3>
              <p className="text-ink-muted leading-relaxed text-sm">
                We sent an M-Pesa prompt to <strong className="text-ink">{phone}</strong>.<br />
                Enter your PIN to complete the order.
              </p>
              <div className="mt-6 flex justify-center">
                <Loader2 size={22} className="animate-spin text-brand-rose" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
