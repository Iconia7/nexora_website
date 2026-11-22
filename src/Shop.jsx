import React, { useState, useEffect } from 'react';
import { ShoppingBag, Clock, ShieldCheck, ArrowLeft, CheckCircle, Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import MpesaModal from './MpesaModal';
import SEO from './components/SEO';
import { fetchProducts, resolveMediaUrl } from './api';
import { useCompany } from './context/CompanyContext';

const ProductCard = ({ item, index, onBuy }) => {
  const [mySize, setMySize] = useState('');

  const handlePreOrderClick = () => {
    if (!mySize) {
      toast.error('Please select a size first');
      return;
    }
    onBuy(item, mySize);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="card-hover group flex flex-col p-5"
    >
      <div className="bg-brand-light rounded-xl p-6 mb-5 relative overflow-hidden flex items-center justify-center min-h-[240px]">
        {item.image ? (
          <img
            src={resolveMediaUrl(item.image)}
            alt={item.name}
            className="w-full h-60 object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <ShoppingBag size={48} className="text-ink-subtle/40" />
        )}
        <span className="absolute top-3.5 left-3.5 bg-white/95 backdrop-blur border border-line text-[11px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full text-ink">
          {item.tag || 'New Drop'}
        </span>
      </div>

      <div className="flex flex-col flex-1 px-1">
        <h3 className="font-display text-lg font-bold text-ink leading-snug">{item.name}</h3>

        <div className="flex justify-between items-center mt-2 mb-5">
          <span className="font-display text-2xl font-extrabold text-brand-rose">
            KES {parseFloat(item.price).toLocaleString()}
          </span>
          <span className="text-xs text-ink-subtle inline-flex items-center gap-1 bg-brand-light px-2.5 py-1 rounded-md">
            <Clock size={12} /> {item.ships_in || '3–5 Days'}
          </span>
        </div>

        <p className="text-xs font-semibold text-ink-subtle uppercase tracking-wider mb-2">Select size</p>
        <div className="flex flex-wrap gap-2 mb-6">
          {(item.sizes || ['S', 'M', 'L', 'XL', 'XXL']).map((size) => (
            <button
              type="button"
              key={size}
              onClick={() => setMySize(size)}
              className={`w-10 h-10 text-xs font-bold rounded-lg border transition-all ${
                mySize === size
                  ? 'bg-brand-navy text-white border-brand-navy'
                  : 'bg-white text-ink-muted border-line hover:border-ink hover:text-ink'
              }`}
            >
              {size}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handlePreOrderClick}
          className="btn-primary w-full mt-auto"
        >
          <ShoppingBag size={17} />
          Pre-order now
        </button>

        <p className="mt-3.5 text-center text-[11px] text-ink-subtle font-medium inline-flex items-center justify-center gap-1.5">
          <ShieldCheck size={13} className="text-brand-rose" /> Secured by Safaricom Daraja API
        </p>
      </div>
    </motion.article>
  );
};

const ReceiptView = ({ transaction, item, size, onBack }) => {
  const { company: COMPANY } = useCompany();
  const date = new Date().toLocaleString();

  const handleWhatsApp = () => {
    const message = `*${COMPANY.legalName.toUpperCase()} — SHOP RECEIPT*
------------------
*Order Ref:* ${transaction.receipt}
*Item:* ${item.name}
*Size:* ${size}
*Amount:* KES ${item.price}
*Date:* ${new Date().toLocaleString()}
------------------
*Payment Verified.* Please process my delivery to ...(add your location)`;

    const url = `https://wa.me/${COMPANY.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-brand-light flex items-center justify-center p-4 font-sans">
      <div className="card w-full max-w-md overflow-hidden shadow-lift">
        <div className="bg-brand-navy p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-light" aria-hidden="true" />
          <div className="relative">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-soft">
              <CheckCircle size={28} className="text-emerald-600" />
            </div>
            <h2 className="font-display text-2xl font-extrabold text-white tracking-tight">Payment Confirmed</h2>
            <p className="text-white/65 text-xs mt-1">{COMPANY.legalName}</p>
          </div>
        </div>

        <div className="p-8 space-y-6">
          <div className="text-center border-b border-line pb-6">
            <p className="text-ink-subtle text-xs font-semibold uppercase tracking-widest mb-1">Total paid</p>
            <p className="font-display text-4xl font-extrabold text-ink">
              KES {parseFloat(item.price).toLocaleString()}
            </p>
          </div>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink-subtle">M-Pesa Ref</dt>
              <dd className="font-semibold text-ink">{transaction.receipt}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-subtle">Date</dt>
              <dd className="font-semibold text-ink text-right">{date}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-subtle">Item</dt>
              <dd className="font-semibold text-ink">{item.name}</dd>
            </div>
            <div className="flex justify-between items-center">
              <dt className="text-ink-subtle">Size</dt>
              <dd className="font-semibold text-brand-rose bg-brand-rose-light px-3 py-0.5 rounded-full text-xs">
                {size}
              </dd>
            </div>
          </dl>
          <div className="space-y-2.5 pt-2">
            <button type="button" onClick={handleWhatsApp} className="btn-primary w-full">
              Confirm delivery via WhatsApp <ArrowRight size={15} />
            </button>
            <button type="button" onClick={onBack} className="btn-outline w-full">
              Return to store
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Shop({ onBack }) {
  const { company: COMPANY } = useCompany();
  const [view, setView] = useState('shop');
  const [successData, setSuccessData] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [buyingItem, setBuyingItem] = useState(null);
  const [buyingSize, setBuyingSize] = useState('');
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  useEffect(() => {
    const loadInventory = async () => {
      try {
        const res = await fetchProducts();
        setProducts(res.data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInventory();
  }, []);

  const handleBuyRequest = (item, size) => {
    setBuyingItem(item);
    setBuyingSize(size);
    setIsPaymentOpen(true);
  };

  return (
    <>
      <SEO
        title={`Official Store | ${COMPANY.legalName}`}
        description={`Official developer apparel and merchandise from ${COMPANY.legalName}. Fast countrywide delivery in Kenya with direct M-Pesa checkout.`}
        url="/shop"
        image="/ncs.png"
        keywords={[
          'developer merchandise Kenya',
          'coder hoodie Nairobi',
          'Nexora store',
          'tech swag Kenya',
          'programmer t-shirts Kenya',
        ]}
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: 'Store', item: '/shop' },
        ]}
        schema={{
          '@context': 'https://schema.org',
          '@type': 'Store',
          name: `${COMPANY.legalName} Official Store`,
          description: `Official developer apparel and merchandise by ${COMPANY.legalName}.`,
          url: `${COMPANY.siteUrl}/shop`,
        }}
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
        <div className="bg-white min-h-screen flex flex-col font-sans text-ink-muted">
          {/* Store Navbar */}
          <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-xl border-b border-line">
            <div className="container-site h-20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {onBack && (
                  <button
                    type="button"
                    onClick={onBack}
                    aria-label="Back to main site"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-ink hover:bg-brand-light transition-colors"
                  >
                    <ArrowLeft size={18} />
                    <span className="hidden sm:inline">Back</span>
                  </button>
                )}
                <div className="h-6 w-px bg-line hidden sm:block" />
                <div className="flex items-center gap-2.5">
                  <img src="/NCS_Secondary_Logo.png" alt={COMPANY.legalName} className="h-11 w-auto" />
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-subtle hidden md:inline">
                    Store
                  </span>
                </div>
              </div>

              <span className="inline-flex items-center gap-2 rounded-full bg-brand-navy text-white px-4 py-1.5 text-xs font-semibold uppercase tracking-wider">
                Pre-order open
              </span>
            </div>
          </header>

          {/* Store Hero */}
          <section className="relative bg-brand-navy text-white overflow-hidden">
            <div className="absolute inset-0 bg-grid-light mask-fade-b" aria-hidden="true" />
            <div
              className="absolute -top-40 right-[-10%] w-[520px] h-[520px] rounded-full bg-brand-rose/25 blur-[120px]"
              aria-hidden="true"
            />
            <div className="relative container-site py-20 md:py-24 text-center max-w-3xl">
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/70 mb-4">
                <span className="w-6 h-px bg-brand-rose" />
                Official Merchandise
              </span>
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tightest text-white leading-tight">
                Wear the <span className="text-brand-rose">craft</span>.
              </h1>
              <p className="mt-4 text-lg text-white/70 max-w-xl mx-auto">
                Official apparel by {COMPANY.legalName}. Designed in Kenya and fulfilled with direct M-Pesa STK Push checkout.
              </p>
            </div>
          </section>

          {/* Product Grid */}
          <section className="section flex-grow bg-brand-light/50">
            <div className="container-site">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 size={36} className="animate-spin text-brand-rose mb-4" />
                  <p className="font-semibold text-ink-subtle uppercase tracking-widest text-xs">Loading inventory...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {products.map((item, index) => (
                    <ProductCard key={item.id} item={item} index={index} onBuy={handleBuyRequest} />
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Minimal Store Footer */}
          <footer className="border-t border-line bg-white py-6">
            <div className="container-site flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-ink-subtle">
              <p>&copy; {new Date().getFullYear()} {COMPANY.legalName}. All rights reserved.</p>
              <p>{COMPANY.email} · {COMPANY.phone}</p>
            </div>
          </footer>

          {/* M-Pesa Modal */}
          {buyingItem && (
            <MpesaModal
              isOpen={isPaymentOpen}
              onClose={() => setIsPaymentOpen(false)}
              total={buyingItem.price}
              item={buyingItem}
              size={buyingSize}
              onPaymentSuccess={(details) => {
                setSuccessData({
                  details,
                  item: buyingItem,
                  size: buyingSize,
                });
                setIsPaymentOpen(false);
                setView('receipt');
                toast.success('Payment Successful!');
              }}
            />
          )}
        </div>
      )}
    </>
  );
}
