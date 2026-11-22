import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { X, Smartphone, CreditCard, FileText, Loader2, CheckCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReCAPTCHA from 'react-google-recaptcha';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import { usePaystackPayment } from 'react-paystack';
import { fetchPricing, initiateStkPush, checkOrderStatus, notifyPricingOrder } from '../api';
import SEO from '../components/SEO';
import PageHeader from '../components/ui/PageHeader';
import CTASection from '../components/ui/CTASection';
import { useCompany } from '../context/CompanyContext';
import ncsLogoDark from '../assets/ncs_logo_dark_bg.png';

const KRA_PIN_REGEX = /^[AP]\d{9}[A-Z]$/i;

const loadLogoDataUrl = (src) =>
  new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        resolve({
          dataUrl: canvas.toDataURL('image/png'),
          width: canvas.width,
          height: canvas.height,
        });
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = src;
  });

const Pricing = () => {
  const { company: COMPANY, formatAddress } = useCompany();
  const [pricingData, setPricingData] = useState({});
  const [activeCategory, setActiveCategory] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [loading, setLoading] = useState(true);
  const [orderLoading, setOrderLoading] = useState(false);

  const captchaRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    mpesaCode: '',
    requiresEtims: false,
    kraPin: '',
  });
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    fetchPricing()
      .then((res) => {
        const grouped = (res.data || []).reduce((acc, current) => {
          const cat = current.category || 'General';
          if (!acc[cat]) acc[cat] = [];
          acc[cat].push({ ...current, category: cat });
          return acc;
        }, {});
        setPricingData(grouped);
        if (Object.keys(grouped).length > 0) {
          setActiveCategory(Object.keys(grouped)[0]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching pricing:', err);
        setLoading(false);
      });
  }, []);

  const onPaystackSuccess = (reference) => {
    finalizeOrder('Paid via Card', reference.reference, 'card');
  };

  const onPaystackClose = () => {
    toast('Payment window closed.');
    setOrderLoading(false);
  };

  const PAYSTACK_PAGE_LINK = 'https://paystack.shop/pay/x259a1rre3';
  const PAYSTACK_PUBLIC_KEY = 'pk_live_6cdd6363ff6f142ba84eb1cd87d1117f41c8c2fc';

  const paystackConfig = {
    reference: new Date().getTime().toString(),
    email: formData.email,
    amount: selectedPlan ? parseInt(String(selectedPlan.price).replace(/,/g, ''), 10) * 100 : 0,
    publicKey: PAYSTACK_PUBLIC_KEY,
    currency: 'KES',
  };

  const initializePayment = usePaystackPayment(paystackConfig);

  const validateContactAndTax = () => {
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error('Please fill in your contact details first.');
      return false;
    }
    if (formData.requiresEtims) {
      const cleanedPin = formData.kraPin.trim().toUpperCase();
      if (!cleanedPin) {
        toast.error('Please enter your Company / Buyer KRA PIN for eTIMS.');
        return false;
      }
      if (!KRA_PIN_REGEX.test(cleanedPin)) {
        toast.error('Enter a valid KRA PIN (e.g. P051234567X or A001234567X).');
        return false;
      }
    }
    return true;
  };

  const handleCardPay = () => {
    if (!validateContactAndTax()) return;
    setOrderLoading(true);
    initializePayment(onPaystackSuccess, onPaystackClose);
  };

  const handleSelectPlan = (plan) => {
    setSelectedPlan({ ...plan });
    setIsModalOpen(true);
    setStatus('idle');
  };

  const generatePDF = async (docType, paymentDetails) => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString('en-KE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    const isReceipt = docType === 'Receipt';
    const buyerPin = formData.requiresEtims ? formData.kraPin.trim().toUpperCase() : '';
    const isNumericPrice = selectedPlan.price !== 'Custom' && selectedPlan.price !== 'Quote Based';
    const amountLabel = isNumericPrice ? `KES ${selectedPlan.price}` : String(selectedPlan.price);

    // 1. Branded Deep Navy Header with Embedded NCS Logo + Crimson Accent Rule
    doc.setFillColor(2, 2, 48);
    doc.rect(0, 0, 210, 44, 'F');
    doc.setFillColor(167, 0, 42);
    doc.rect(0, 44, 210, 2.2, 'F');

    const logoInfo = await loadLogoDataUrl(ncsLogoDark);
    if (logoInfo?.dataUrl) {
      const targetW = 54;
      const targetH = Number(((logoInfo.height / logoInfo.width) * targetW).toFixed(2));
      doc.addImage(logoInfo.dataUrl, 'PNG', 18, 12, targetW, targetH);
    } else {
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text(COMPANY.legalName.toUpperCase(), 18, 24);
    }

    // Right-aligned corporate header details
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10.5);
    doc.setFont('helvetica', 'bold');
    doc.text(COMPANY.legalName, 192, 16, { align: 'right' });

    doc.setTextColor(215, 222, 238);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.text(formatAddress(), 192, 22, { align: 'right' });
    doc.text(`${COMPANY.email}  |  ${COMPANY.phone}`, 192, 27.5, { align: 'right' });
    const regLine = [
      COMPANY.registrationNumber ? `Reg: ${COMPANY.registrationNumber}` : '',
      COMPANY.kraPin ? `KRA PIN: ${COMPANY.kraPin}` : '',
    ]
      .filter(Boolean)
      .join('  |  ');
    if (regLine) {
      doc.text(regLine, 192, 33, { align: 'right' });
    } else {
      doc.text(COMPANY.siteUrl.replace(/^https?:\/\//, ''), 192, 33, { align: 'right' });
    }

    // 2. Document Title & Status Pill
    doc.setTextColor(14, 16, 36);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(isReceipt ? 'OFFICIAL RECEIPT' : 'PROFORMA INVOICE', 192, 60, { align: 'right' });

    if (isReceipt) {
      doc.setFillColor(236, 253, 245);
      doc.roundedRect(156, 64, 36, 8, 2, 2, 'F');
      doc.setTextColor(4, 120, 87);
      doc.setFontSize(9.5);
      doc.setFont('helvetica', 'bold');
      doc.text('STATUS: PAID', 174, 69.5, { align: 'center' });
    } else {
      doc.setFillColor(252, 232, 236);
      doc.roundedRect(150, 64, 42, 8, 2, 2, 'F');
      doc.setTextColor(167, 0, 42);
      doc.setFontSize(9.5);
      doc.setFont('helvetica', 'bold');
      doc.text('STATUS: UNPAID', 171, 69.5, { align: 'center' });
    }

    doc.setTextColor(75, 80, 104);
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'normal');
    doc.text(`Date: ${date}`, 192, 80, { align: 'right' });
    doc.text(`Reference: ${paymentDetails.ref}`, 192, 85.5, { align: 'right' });

    // 3. Bill To
    doc.setTextColor(167, 0, 42);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.text('BILL TO', 18, 58);

    doc.setTextColor(14, 16, 36);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(formData.name.toUpperCase(), 18, 65);

    doc.setTextColor(75, 80, 104);
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'normal');
    doc.text(formData.email, 18, 71);
    doc.text(formData.phone, 18, 76.5);
    if (buyerPin) {
      doc.setTextColor(2, 2, 48);
      doc.setFont('helvetica', 'bold');
      doc.text(`Buyer KRA PIN (eTIMS): ${buyerPin}`, 18, 82.5);
    }

    // 4. Line Items Table
    const tableTop = 96;
    doc.setFillColor(246, 247, 251);
    doc.setDrawColor(230, 232, 240);
    doc.rect(18, tableTop, 174, 10, 'FD');

    doc.setTextColor(14, 16, 36);
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'bold');
    doc.text('SERVICE DESCRIPTION', 22, tableTop + 6.5);
    doc.text('AMOUNT', 188, tableTop + 6.5, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10.5);
    doc.setTextColor(14, 16, 36);
    doc.text(`${selectedPlan.plan} (${selectedPlan.category})`, 22, tableTop + 19);
    doc.setFont('helvetica', 'bold');
    doc.text(amountLabel, 188, tableTop + 19, { align: 'right' });

    let nextY = tableTop + 26;
    if (isReceipt) {
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 106, 128);
      doc.text(
        `Paid via: ${paymentDetails.method === 'card' ? 'Visa / Mastercard (Paystack)' : 'M-Pesa (Safaricom)'}`,
        22,
        nextY
      );
      doc.text(`Transaction ID: ${paymentDetails.mpesaCode}`, 22, nextY + 5.5);
      nextY += 13;
    }

    // 5. Total Bar
    doc.setDrawColor(2, 2, 48);
    doc.setLineWidth(0.6);
    doc.line(18, nextY + 4, 192, nextY + 4);
    doc.setLineWidth(0.2);

    doc.setFontSize(11.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(14, 16, 36);
    doc.text(isReceipt ? 'TOTAL PAID:' : 'TOTAL AMOUNT DUE:', 110, nextY + 13);
    doc.setTextColor(isReceipt ? 4 : 167, isReceipt ? 120 : 0, isReceipt ? 87 : 42);
    doc.text(amountLabel, 188, nextY + 13, { align: 'right' });

    let cursorY = nextY + 24;

    // 6. KRA eTIMS Notice (when requested)
    if (buyerPin) {
      doc.setFillColor(246, 247, 251);
      doc.setDrawColor(2, 2, 48);
      doc.roundedRect(18, cursorY, 174, 20, 2, 2, 'FD');
      doc.setFillColor(167, 0, 42);
      doc.rect(18, cursorY, 2.5, 20, 'F');

      doc.setTextColor(2, 2, 48);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('KRA eTIMS TAX INVOICE / RECEIPT REQUESTED', 24, cursorY + 6.5);

      doc.setTextColor(75, 80, 104);
      doc.setFontSize(8.2);
      doc.setFont('helvetica', 'normal');
      doc.text(
        `Buyer KRA PIN ${buyerPin} recorded. This instant PDF is a commercial ${isReceipt ? 'payment receipt' : 'proforma invoice'}.`,
        24,
        cursorY + 12
      );
      doc.text(
        'Our accounts desk will email your signed KRA eTIMS tax invoice (with CU Number & QR code) upon confirmation.',
        24,
        cursorY + 16.5
      );
      cursorY += 27;
    }

    // 7. Payment Instructions (Proforma Invoice)
    if (!isReceipt) {
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(230, 232, 240);
      doc.roundedRect(18, cursorY, 174, 52, 2, 2, 'FD');
      doc.setFillColor(2, 2, 48);
      doc.rect(18, cursorY, 2.5, 52, 'F');

      doc.setTextColor(2, 2, 48);
      doc.setFontSize(9.5);
      doc.setFont('helvetica', 'bold');
      doc.text('OFFICIAL PAYMENT INSTRUCTIONS', 24, cursorY + 8);

      // Left column — M-Pesa
      doc.setFontSize(8.8);
      doc.setTextColor(14, 16, 36);
      doc.setFont('helvetica', 'bold');
      doc.text('KENYA (M-PESA PAYBILL)', 24, cursorY + 16);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(75, 80, 104);
      doc.text('Paybill: 4041463', 24, cursorY + 22);
      doc.text(`Account: ${selectedPlan.plan.substring(0, 12).toUpperCase()}`, 24, cursorY + 27.5);

      // Right column — KCB Bank
      doc.setDrawColor(230, 232, 240);
      doc.line(102, cursorY + 12, 102, cursorY + 34);

      doc.setTextColor(14, 16, 36);
      doc.setFont('helvetica', 'bold');
      doc.text('BANK TRANSFER (LOCAL & INT\'L)', 108, cursorY + 16);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(75, 80, 104);
      doc.text('Bank: KCB Bank', 108, cursorY + 22);
      doc.text(`Account Name: ${COMPANY.legalName}`, 108, cursorY + 27.5);
      doc.text('Account No: 1358337365   |   SWIFT: KCBLKENX', 108, cursorY + 33);

      // Bottom strip — Paystack
      doc.line(24, cursorY + 38, 186, cursorY + 38);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(14, 16, 36);
      doc.text('PAY ONLINE (CARD):', 24, cursorY + 45.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(167, 0, 42);
      doc.text(PAYSTACK_PAGE_LINK, 62, cursorY + 45.5);
      cursorY += 59;
    }

    doc.setFontSize(9.5);
    doc.setTextColor(75, 80, 104);
    doc.text(`Thank you for doing business with ${COMPANY.legalName}.`, 18, Math.min(cursorY + 6, 265));

    // 8. Corporate Ltd Footer
    doc.setDrawColor(230, 232, 240);
    doc.line(18, 275, 192, 275);
    doc.setFontSize(7.8);
    doc.setTextColor(122, 127, 150);
    doc.text(
      `${COMPANY.legalName} — Private Limited Company incorporated in the Republic of Kenya under the Companies Act, 2015.`,
      18,
      281
    );
    doc.text(`${formatAddress()}  |  ${COMPANY.email}  |  ${COMPANY.phone}`, 18, 286);

    return doc;
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      mpesaCode: '',
      requiresEtims: false,
      kraPin: '',
    });
  };

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : name === 'kraPin' ? value.toUpperCase() : value,
    }));
  };

  const handleInvoice = (e) => {
    e.preventDefault();

    if (!validateContactAndTax()) return;

    const token = captchaRef.current?.getValue();
    if (!token) {
      toast.error('Please verify that you are not a robot.');
      return;
    }

    setOrderLoading(true);
    finalizeOrder('Pending Invoice', 'N/A', 'invoice');
  };

  const handleMpesaPay = async (e) => {
    e.preventDefault();

    if (!validateContactAndTax()) return;

    const token = captchaRef.current?.getValue();
    if (!token) {
      toast.error('Please verify that you are not a robot.');
      return;
    }

    if (selectedPlan.price === 'Custom' || selectedPlan.price === 'Quote Based') {
      toast.error('For Custom plans, please generate an Invoice.');
      setPaymentMethod('invoice');
      return;
    }

    setOrderLoading(true);
    const cleanPrice = parseInt(String(selectedPlan.price).replace(/,/g, ''), 10);
    const accountRefName = selectedPlan.plan.substring(0, 12);

    try {
      const res = await initiateStkPush({
        phone: formData.phone,
        amount: cleanPrice,
        plan_name: selectedPlan.plan,
        item_name: selectedPlan.plan,
        item_category: selectedPlan.category || 'Service Package',
        customer_name: formData.name,
        customer_email: formData.email,
        accountRef: accountRefName,
        requires_etims: formData.requiresEtims,
        customer_kra_pin: formData.requiresEtims ? formData.kraPin.trim().toUpperCase() : '',
      });

      if (res.data.ResponseCode === '0') {
        toast.success(`STK Push sent to ${formData.phone}. Enter PIN!`);
        const checkoutID = res.data.CheckoutRequestID;
        pollPaymentStatus(checkoutID);
      } else {
        toast.error('STK Push Failed: ' + res.data.errorMessage);
        setOrderLoading(false);
      }
    } catch (error) {
      console.error(error);
      toast.error('Payment System Error. Try again.');
      setOrderLoading(false);
    }
  };

  const pollPaymentStatus = async (checkoutID) => {
    let attempts = 0;
    const maxAttempts = 20;

    const interval = setInterval(async () => {
      attempts++;
      try {
        const res = await checkOrderStatus(checkoutID);

        if (res.data.status === 'PAID' || res.data.status === 'COMPLETED') {
          clearInterval(interval);
          await finalizeOrder('Paid via M-Pesa', res.data.mpesa_receipt || res.data.checkout_request_id);
        } else if (res.data.status === 'FAILED') {
          clearInterval(interval);
          toast.error('Payment failed or cancelled.');
          setOrderLoading(false);
        }
      } catch {
        // continue polling
      }

      if (attempts >= maxAttempts) {
        clearInterval(interval);
        toast.error('Payment Timeout. Please try again.');
        setOrderLoading(false);
      }
    }, 3000);
  };

  const finalizeOrder = async (paymentStatus, receiptRef = 'N/A', methodUsed = 'mpesa') => {
    try {
      const isPaid = paymentStatus.includes('Paid');
      const docType = isPaid ? 'Receipt' : 'Invoice';
      const refNumber = isPaid ? receiptRef : `INV-${Math.floor(Math.random() * 10000)}`;

      const pdfDoc = await generatePDF(docType, {
        ref: refNumber,
        mpesaCode: receiptRef,
        method: methodUsed,
      });

      pdfDoc.save(`Nexora_${docType}_${selectedPlan.plan.replace(/\s/g, '_')}.pdf`);

      // For M-Pesa, the backend callback already dispatches the receipt via Zoho SMTP.
      // For Proforma Invoices and Card (Paystack) payments, notify the backend here.
      if (methodUsed !== 'mpesa') {
        try {
          await notifyPricingOrder({
            customer_name: formData.name,
            customer_email: formData.email,
            customer_phone: formData.phone,
            item_name: selectedPlan.plan,
            item_category: selectedPlan.category || 'General',
            amount: selectedPlan.price,
            payment_method: methodUsed,
            doc_type: docType,
            ref_code: refNumber,
            paystack_link: PAYSTACK_PAGE_LINK,
            requires_etims: formData.requiresEtims,
            customer_kra_pin: formData.requiresEtims ? formData.kraPin.trim().toUpperCase() : '',
          });
        } catch (notifyErr) {
          console.warn('Billing email notification skipped:', notifyErr);
        }
      }

      setStatus('success');
      toast.success(isPaid ? 'Payment Confirmed! Receipt Downloaded.' : 'Invoice Generated & Downloaded!');
      setTimeout(() => closeModal(), 5000);
      setOrderLoading(false);
    } catch (error) {
      console.error('Save Error', error);
      toast.error('Order saved, check your email but PDF generation failed.');
      setOrderLoading(false);
    }
  };

  const categories = Object.keys(pricingData);

  return (
    <div className="overflow-hidden">
      <SEO
        title={`Pricing & Packages | ${COMPANY.legalName}`}
        description={`Transparent web design, mobile app, and custom software packages in Kenya from ${COMPANY.legalName}. Clear proposals and corporate invoicing.`}
        url="/pricing"
        image="/ncs.png"
        keywords={[
          'web design cost Kenya',
          'app development pricing Nairobi',
          'website packages Kenya',
          'software development cost',
          'Nexora pricing',
        ]}
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: 'Pricing', item: '/pricing' },
        ]}
        schema={{
          '@context': 'https://schema.org',
          '@type': 'OfferCatalog',
          name: `${COMPANY.legalName} Software, Web & Branding Packages`,
          provider: { '@id': `${COMPANY.siteUrl}/#organization` },
          itemListElement: Object.entries(pricingData).flatMap(([category, plans]) =>
            plans.map((p) => {
              const numericPrice = String(p.price || '').replace(/,/g, '');
              const isNumeric = /^\d+(\.\d+)?$/.test(numericPrice);
              return {
                '@type': 'Offer',
                name: `${p.plan} (${category})`,
                description: Array.isArray(p.features) ? p.features.join(', ') : category,
                priceCurrency: 'KES',
                ...(isNumeric ? { price: numericPrice } : {}),
                availability: 'https://schema.org/InStock',
                seller: { '@id': `${COMPANY.siteUrl}/#organization` },
                itemOffered: { '@type': 'Service', name: p.plan, serviceType: category },
              };
            })
          ),
        }}
      />

      <PageHeader
        align="center"
        eyebrow="Pricing"
        title={
          <>
            Clear packages, <span className="text-brand-rose">zero guesswork</span>.
          </>
        }
        description={`Select a structured package or request a custom enterprise proposal from ${COMPANY.legalName}. Official invoices and receipts included.`}
        breadcrumbs={[{ label: 'Pricing' }]}
      />

      {/* Category Tabs & Pricing Cards */}
      <section className="section bg-brand-light min-h-[520px]">
        <div className="container-site">
          {categories.length > 0 && (
            <div className="flex justify-center mb-12">
              <div
                className="inline-flex flex-wrap justify-center gap-1.5 rounded-2xl border border-line bg-white p-1.5 shadow-soft"
                role="tablist"
                aria-label="Pricing categories"
              >
                {categories.map((category) => {
                  const active = activeCategory === category;
                  return (
                    <button
                      key={category}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setActiveCategory(category)}
                      className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${active
                          ? 'bg-brand-navy text-white shadow-sm'
                          : 'text-ink-muted hover:text-ink hover:bg-brand-light'
                        }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {loading ? (
            <div className="grid md:grid-cols-3 gap-6">
              {[0, 1, 2].map((i) => (
                <div key={i} className="card h-[460px] animate-pulse bg-white" />
              ))}
            </div>
          ) : pricingData[activeCategory]?.length > 0 ? (
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="grid md:grid-cols-3 gap-6 items-stretch"
            >
              {pricingData[activeCategory].map((plan, idx) => {
                const featured = Boolean(plan.recommended);
                return (
                  <div
                    key={idx}
                    className={`relative rounded-2xl p-8 flex flex-col transition-all duration-300 ${featured
                        ? 'bg-brand-navy text-white shadow-lift ring-2 ring-brand-rose'
                        : 'card hover:shadow-lift'
                      }`}
                  >
                    {featured && (
                      <span className="absolute -top-3.5 left-8 rounded-full bg-brand-rose px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white shadow-sm">
                        Recommended
                      </span>
                    )}

                    <div className="mb-6">
                      <h3
                        className={`text-sm font-semibold uppercase tracking-[0.16em] ${featured ? 'text-white/70' : 'text-ink-subtle'
                          }`}
                      >
                        {plan.plan}
                      </h3>
                      <div className="mt-4 flex items-baseline gap-1.5">
                        {plan.price !== 'Custom' && plan.price !== 'Quote Based' && (
                          <span className={`text-base font-semibold ${featured ? 'text-white/70' : 'text-ink-subtle'}`}>
                            KES
                          </span>
                        )}
                        <span className={`font-display text-4xl font-extrabold tracking-tight ${featured ? 'text-white' : 'text-ink'}`}>
                          {plan.price}
                        </span>
                      </div>
                      {plan.period && (
                        <p className={`mt-1.5 text-xs font-medium uppercase tracking-wider ${featured ? 'text-white/55' : 'text-ink-subtle'}`}>
                          {plan.period}
                        </p>
                      )}
                    </div>

                    <div className={`h-px w-full mb-6 ${featured ? 'bg-white/10' : 'bg-line'}`} />

                    <ul className="space-y-3.5 mb-8 flex-1">
                      {(plan.features || []).map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-3">
                          <CheckCircle size={17} className="mt-0.5 shrink-0 text-brand-rose" />
                          <span className={`text-sm leading-relaxed ${featured ? 'text-white/85' : 'text-ink-muted'}`}>
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <button
                      type="button"
                      onClick={() => handleSelectPlan(plan)}
                      className={`w-full py-3.5 rounded-lg font-semibold text-sm transition flex items-center justify-center gap-2 ${featured
                          ? 'bg-brand-rose text-white hover:bg-brand-rose-dark'
                          : 'bg-brand-navy text-white hover:bg-brand-rose'
                        }`}
                    >
                      Get started <ArrowRight size={15} />
                    </button>
                  </div>
                );
              })}
            </motion.div>
          ) : (
            <div className="card p-14 text-center max-w-xl mx-auto">
              <h2 className="heading-md">Custom corporate pricing</h2>
              <p className="mt-2 text-ink-muted">
                Every enterprise build is scoped to your requirements. Contact {COMPANY.legalName} for a formal proposal.
              </p>
              <Link to="/contact" className="btn-primary mt-6">
                Request a custom quote <ArrowRight size={15} />
              </Link>
            </div>
          )}

          <p className="mt-10 text-center text-xs text-ink-subtle">
            All official proforma invoices and receipts are issued by {COMPANY.legalName}. Need a custom scope or SLA?{' '}
            <Link to="/contact" className="text-brand-rose font-semibold hover:underline">
              Talk to our team
            </Link>
            .
          </p>
        </div>
      </section>

      <CTASection
        title="Need a bespoke scope or enterprise SLA?"
        description="Share your requirements and we will prepare a detailed Statement of Work and commercial proposal."
        primary={{ label: 'Request custom proposal', to: '/contact' }}
        secondary={{ label: 'Explore services', to: '/services' }}
      />

      {/* Checkout Modal */}
      <AnimatePresence>
        {isModalOpen && selectedPlan && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-navy/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 16 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl w-full max-w-2xl relative shadow-lift overflow-hidden flex flex-col md:flex-row max-h-[92vh] overflow-y-auto"
            >
              <button
                type="button"
                aria-label="Close checkout"
                onClick={closeModal}
                className="absolute top-4 right-4 z-20 inline-flex items-center justify-center w-9 h-9 rounded-lg bg-white text-ink-subtle hover:bg-brand-light hover:text-ink"
              >
                <X size={18} />
              </button>

              {/* Left Summary */}
              <div className="bg-brand-navy text-white p-8 md:w-2/5 flex flex-col justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/55">
                    {selectedPlan.category}
                  </p>
                  <h2 className="font-display text-2xl font-bold text-white mt-2">{selectedPlan.plan}</h2>
                  <p className="text-brand-rose text-lg font-bold mt-1">
                    {selectedPlan.price !== 'Custom' && selectedPlan.price !== 'Quote Based' ? 'KES ' : ''}
                    {selectedPlan.price}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10">
                  <p className="text-xs text-white/55">Billed by</p>
                  <p className="text-sm font-semibold text-white mt-0.5">{COMPANY.legalName}</p>
                  <p className="text-xs text-white/55 mt-4">Total due</p>
                  <p className="font-display text-2xl font-bold text-white">
                    {selectedPlan.price !== 'Custom' && selectedPlan.price !== 'Quote Based' ? 'KES ' : ''}
                    {selectedPlan.price}
                  </p>
                </div>
              </div>

              {/* Right Form */}
              <div className="p-7 md:p-8 md:w-3/5 bg-white">
                <h3 className="heading-md mb-5">Checkout &amp; invoicing</h3>

                {status === 'success' ? (
                  <div className="py-10 text-center">
                    <span className="inline-flex w-14 h-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-4">
                      <CheckCircle size={28} />
                    </span>
                    <h4 className="font-display text-lg font-bold text-ink">Order confirmed</h4>
                    <p className="mt-2 text-sm text-ink-muted">
                      Your PDF document has been downloaded and a copy sent to {formData.email}.
                      {formData.requiresEtims && formData.kraPin && (
                        <> Our accounts desk has recorded KRA PIN <strong>{formData.kraPin.toUpperCase()}</strong> and will issue your signed KRA eTIMS tax invoice shortly.</>
                      )}
                    </p>
                  </div>
                ) : (
                  <form className="space-y-4">
                    <div className="space-y-3">
                      <input
                        type="text"
                        name="name"
                        placeholder="Full name or company *"
                        value={formData.name}
                        onChange={handleChange}
                        className="input !py-2.5 text-sm"
                      />
                      <input
                        type="email"
                        name="email"
                        placeholder="Billing email *"
                        value={formData.email}
                        onChange={handleChange}
                        className="input !py-2.5 text-sm"
                      />
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Phone number (e.g. 07XX...) *"
                        value={formData.phone}
                        onChange={handleChange}
                        className="input !py-2.5 text-sm"
                      />

                      {/* KRA eTIMS Tax Invoice Option */}
                      <div className="rounded-xl border border-line bg-brand-light/50 p-3 space-y-2.5">
                        <label className="flex items-start gap-2.5 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            name="requiresEtims"
                            checked={formData.requiresEtims}
                            onChange={handleChange}
                            className="mt-0.5 h-4 w-4 rounded border-line text-brand-rose focus:ring-brand-rose accent-brand-rose"
                          />
                          <span className="text-xs leading-snug text-ink">
                            <strong className="font-semibold">Request KRA eTIMS Tax Invoice / Receipt</strong>
                            <span className="block text-[11px] text-ink-subtle mt-0.5">
                              For Kenyan businesses claiming tax-deductible expenses.
                            </span>
                          </span>
                        </label>
                        {formData.requiresEtims && (
                          <input
                            type="text"
                            name="kraPin"
                            maxLength={11}
                            placeholder="Company / Buyer KRA PIN * (e.g. P051234567X)"
                            value={formData.kraPin}
                            onChange={handleChange}
                            className="input !py-2 text-xs uppercase tracking-wider font-mono"
                          />
                        )}
                      </div>
                    </div>

                    {/* Payment Method Selector */}
                    <div className="grid grid-cols-3 gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('mpesa')}
                        className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-semibold transition ${paymentMethod === 'mpesa'
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                            : 'border-line text-ink-muted hover:border-ink'
                          }`}
                      >
                        <Smartphone size={16} /> M-Pesa
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('card')}
                        className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-semibold transition ${paymentMethod === 'card'
                            ? 'border-brand-navy bg-brand-light text-brand-navy'
                            : 'border-line text-ink-muted hover:border-ink'
                          }`}
                      >
                        <CreditCard size={16} /> Card
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('invoice')}
                        className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-semibold transition ${paymentMethod === 'invoice'
                            ? 'border-brand-rose bg-brand-rose-light text-brand-rose'
                            : 'border-line text-ink-muted hover:border-ink'
                          }`}
                      >
                        <FileText size={16} /> Invoice
                      </button>
                    </div>

                    <div className="rounded-xl border border-line bg-brand-light/70 p-3.5 text-xs text-ink-muted text-center">
                      {paymentMethod === 'mpesa' && 'An M-Pesa STK Push prompt will be sent to your phone.'}
                      {paymentMethod === 'invoice' &&
                        `A PDF proforma invoice from ${COMPANY.legalName} will download and be emailed to you.`}
                      {paymentMethod === 'card' && 'Secure Visa / Mastercard payment processed via Paystack.'}
                    </div>

                    <div className="flex justify-center overflow-x-auto">
                      <ReCAPTCHA ref={captchaRef} sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY} />
                    </div>

                    {paymentMethod === 'mpesa' && (
                      <button
                        type="button"
                        onClick={handleMpesaPay}
                        disabled={orderLoading}
                        className="w-full py-3.5 rounded-lg font-semibold text-sm text-white bg-emerald-600 hover:bg-emerald-700 transition flex justify-center items-center gap-2 disabled:opacity-60"
                      >
                        {orderLoading ? <Loader2 className="animate-spin" size={18} /> : 'Pay with M-Pesa'}
                      </button>
                    )}
                    {paymentMethod === 'card' && (
                      <button
                        type="button"
                        onClick={handleCardPay}
                        disabled={orderLoading}
                        className="w-full py-3.5 rounded-lg font-semibold text-sm text-white bg-brand-navy hover:bg-brand-navy-700 transition flex justify-center items-center gap-2 disabled:opacity-60"
                      >
                        {orderLoading ? <Loader2 className="animate-spin" size={18} /> : 'Pay with Card'}
                      </button>
                    )}
                    {paymentMethod === 'invoice' && (
                      <button
                        type="button"
                        onClick={handleInvoice}
                        disabled={orderLoading}
                        className="btn-primary w-full py-3.5"
                      >
                        {orderLoading ? <Loader2 className="animate-spin" size={18} /> : 'Generate Proforma Invoice'}
                      </button>
                    )}
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Pricing;
