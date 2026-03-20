import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, updateDoc, doc, addDoc, deleteDoc, serverTimestamp, where } from "firebase/firestore";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { db, auth } from '../firebase';
import emailjs from '@emailjs/browser';
import toast from 'react-hot-toast';
import { Loader2, CheckCircle, Search, RefreshCw, LogOut, ShieldCheck, X, Banknote, Package, Plus, Trash2, Edit } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminPanel = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Login State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  // Modal State
  const [selectedOrder, setSelectedOrder] = useState(null); 
  const [paymentCode, setPaymentCode] = useState(""); 
  const [processing, setProcessing] = useState(false);

  // Inventory State
  const [activeTab, setActiveTab] = useState("orders"); // "orders" | "inventory"
  const [products, setProducts] = useState([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
      name: "", price: "", image: "", tag: "", shipsIn: "", sizes: "S, M, L, XL", category: "Uncategorized", active: true
  });

  // --- CHECK LOGIN STATUS ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        if (currentUser) {
            fetchOrders();
            fetchProducts();
        }
    });
    return () => unsubscribe();
  }, []);

  // --- inventory handlers ---
  const fetchProducts = async () => {
    try {
        const snapshot = await getDocs(collection(db, "products"));
        setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) { toast.error("Failed to load products"); }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    try {
        const data = { ...productForm, price: Number(productForm.price), sizes: productForm.sizes.split(",").map(s => s.trim()), updatedAt: serverTimestamp() };
        if (editingProduct) {
            await updateDoc(doc(db, "products", editingProduct.id), data);
            toast.success("Product Updated");
        } else {
            await addDoc(collection(db, "products"), { ...data, createdAt: serverTimestamp() });
            toast.success("Product Added");
        }
        setShowProductModal(false);
        fetchProducts();
    } catch (err) { toast.error("Error saving product"); }
    finally { setProcessing(false); }
  };

  const deleteProduct = async (id) => {
      if (!window.confirm("Delete this product?")) return;
      try {
          await deleteDoc(doc(db, "products", id));
          toast.success("Product Deleted");
          fetchProducts();
      } catch (err) { toast.error("Error deleting product"); }
  };

  // --- 1. SECURE LOGIN ---
  const handleLogin = async (e) => {
      e.preventDefault();
      try {
          await signInWithEmailAndPassword(auth, email, password);
          toast.success("Welcome back, Boss!");
      } catch (error) {
          toast.error("Access Denied: Wrong Email or Password");
      }
  };

  const handleLogout = async () => {
      await signOut(auth);
      toast.success("Logged out securely.");
  };

  // --- 2. FETCH ORDERS ---
  const fetchOrders = async () => {
      setLoading(true);
      try {
          const ordersRef = collection(db, "orders");
          const q = query(ordersRef, orderBy("timestamp", "desc"));
          const snapshot = await getDocs(q);
          const ordersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setOrders(ordersData);
      } catch (err) {
          toast.error("Failed to load orders");
      } finally {
          setLoading(false);
      }
  };

  // --- 3. MODAL HANDLERS ---
  const openPaymentModal = (order) => {
      setSelectedOrder(order);
      setPaymentCode(""); 
  };

  const closePaymentModal = () => {
      setSelectedOrder(null);
      setPaymentCode("");
  };

  // --- 4. PROCESS PAYMENT ---
  const confirmPayment = async (e) => {
      e.preventDefault();
      
      // 1. Basic Validation
      if (!paymentCode) return toast.error("Please enter a transaction code");
      
      // 2. M-Pesa Regex Validation (10 chars, starts with alpha, alphanumeric)
      const mpesaRegex = /^[A-Z0-9]{10}$/;
      if (!mpesaRegex.test(paymentCode)) {
          return toast.error("Invalid Code: M-Pesa codes must be 10 characters (e.g., SAB8123XYZ)");
      }

      setProcessing(true);
      const toastId = toast.loading("Verifying Code with Safaricom...");

      try {
          // 3. Duplicate Check: Ensure code hasn't been used before
          const dupQuery = query(collection(db, "orders"), where("mpesaReceipt", "==", paymentCode));
          const dupSnapshot = await getDocs(dupQuery);
          
          if (!dupSnapshot.empty) {
              toast.error("Error: This transaction code has already been used!", { id: toastId });
              setProcessing(false);
              return;
          }

          // 4. LIVE VERIFICATION CALL
          // We call our new verify API to check with Safaricom
          try {
              const verifyRes = await fetch('/api/verify', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ transactionID: paymentCode })
              });
              
              const verifyData = await verifyRes.json();

              if (!verifyRes.ok) {
                  // If keys are missing or service is down, we notify but allow override for now 
                  // to prevent blocking the admin if they've manually verified the statement.
                  if (verifyRes.status === 503) {
                      toast.error("Verification Service Unconfigured. Check .env keys.", { id: toastId });
                  } else {
                      toast.error(`Verification Failed: ${verifyData.error}`, { id: toastId });
                  }
                  
                  if (!window.confirm("Safaricom verification failed or is unconfigured. Mark as PAID anyway based on manual statement check?")) {
                      setProcessing(false);
                      return;
                  }
              } else {
                  toast.success("Verification request sent! Finalizing...", { id: toastId });
              }
          } catch (vErr) {
              console.error("Verification Error:", vErr);
              if (!window.confirm("Could not reach verification server. Mark as PAID anyway?")) {
                  setProcessing(false);
                  return;
              }
          }

          // A. Update Firebase
          const orderRef = doc(db, "orders", selectedOrder.id);
          await updateDoc(orderRef, {
              status: `PAID (Confirmed: ${paymentCode})`,
              mpesaReceipt: paymentCode,
              paidAt: new Date()
          });

          // B. Send Receipt Email
          const emailParams = {
              to_email: selectedOrder.customer?.email || 'info@nexoracreatives.co.ke', // Fallback
              from_name: "Nexora Creative Solutions Billing Team",
              subject: `Payment Received - ${selectedOrder.plan?.plan || selectedOrder.item?.name}`,
              message_body: `Hi ${selectedOrder.customer?.name || 'Client'},\n\n` +
                            `Great news! We have confirmed your payment of KES ${selectedOrder.amount}.\n\n` +
                            `DETAILS:\n` +
                            `Service: ${selectedOrder.plan?.plan || selectedOrder.item?.name}\n` +
                            `Amount: KES ${selectedOrder.amount}\n` +
                            `Ref Code: ${paymentCode}\n\n` +
                            `Our team will be in touch shortly to start the project.\n\n` +
                            `Thank you,\nNexora Creative Solutions`
          };

          await emailjs.send(
              import.meta.env.VITE_EMAILJS_SERVICE_ID, 
              import.meta.env.VITE_EMAILJS_TEMPLATE_ID, 
              emailParams, 
              import.meta.env.VITE_EMAILJS_PUBLIC_KEY
          );

          toast.success("Payment Recorded & Receipt Sent!", { id: toastId });
          fetchOrders(); 
          closePaymentModal();

      } catch (error) {
          console.error(error);
          toast.error("Error updating order", { id: toastId });
      } finally {
          setProcessing(false);
      }
  };

  // --- LOGIN SCREEN (With Padding for Navbar) ---
  if (!user) {
      return (
          // 👇 CHANGED: 'h-screen' -> 'min-h-screen pt-32 pb-10' to clear navbar
          <div className="min-h-screen pt-32 pb-10 flex items-center justify-center bg-gray-50 font-sans relative overflow-hidden">
              <div className="absolute top-0 left-0 w-64 h-64 bg-brand-rose/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-charcoal/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

              <form onSubmit={handleLogin} className="bg-white p-10 rounded-3xl shadow-2xl text-center w-full max-w-sm relative z-10 border border-gray-100">
                  <div className="w-20 h-20 bg-brand-charcoal rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-brand-charcoal/20">
                      <ShieldCheck className="text-brand-rose" size={32} />
                  </div>
                  <h2 className="text-3xl font-black text-brand-charcoal mb-2 font-creative">ADMIN PORTAL</h2>
                  <p className="text-gray-400 text-sm mb-8 font-medium">Secure Access Only</p>
                  
                  <input type="email" placeholder="admin@nexora..." className="border-2 border-gray-100 bg-gray-50 p-4 rounded-xl mb-3 w-full outline-none focus:border-brand-rose transition-all" onChange={(e) => setEmail(e.target.value)} />
                  <input type="password" placeholder="Password" className="border-2 border-gray-100 bg-gray-50 p-4 rounded-xl mb-4 w-full outline-none focus:border-brand-rose transition-all" onChange={(e) => setPassword(e.target.value)} />
                  <button type="submit" className="bg-brand-charcoal text-white w-full py-4 rounded-xl font-bold hover:bg-brand-rose transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">SECURE LOGIN</button>
              </form>
          </div>
      );
  }

  // --- DASHBOARD UI ---
  return (
    // 👇 CHANGED: 'pt-24' -> 'pt-32' (Extra safe space for tall navbars)
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 pt-50 font-sans text-gray-800">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4 border-b border-gray-200 pb-6">
            <div>
                <h1 className="text-4xl font-black text-brand-charcoal font-creative tracking-tight">ORDER MANAGEMENT</h1>
                <p className="text-gray-500 mt-2 font-medium">Logged in as: {user.email}</p>
            </div>
            <div className="flex gap-3">
                <div className="flex bg-white rounded-xl p-1 border border-gray-200 shadow-sm mr-4">
                    <button onClick={() => setActiveTab("orders")} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === "orders" ? "bg-brand-charcoal text-white shadow-md" : "text-gray-400 hover:text-brand-charcoal"}`}>ORDERS</button>
                    <button onClick={() => setActiveTab("inventory")} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === "inventory" ? "bg-brand-charcoal text-white shadow-md" : "text-gray-400 hover:text-brand-charcoal"}`}>INVENTORY</button>
                </div>
                <button onClick={activeTab === "orders" ? fetchOrders : fetchProducts} className="bg-white border border-gray-200 text-brand-charcoal px-4 py-2 rounded-xl hover:bg-gray-50 flex items-center gap-2 text-sm font-bold shadow-sm transition-all"><RefreshCw size={18} className={loading ? "animate-spin" : ""} /> REFRESH</button>
                <button onClick={handleLogout} className="bg-brand-rose/10 text-brand-rose border border-brand-rose/20 px-4 py-2 rounded-xl hover:bg-brand-rose hover:text-white flex items-center gap-2 text-sm font-bold shadow-sm transition-all"><LogOut size={18} /> LOGOUT</button>
            </div>
        </div>

        {activeTab === "inventory" && (
            <div className="mb-6 flex justify-between items-center bg-white p-6 rounded-3xl border border-gray-100 shadow-xl">
                <div>
                   <h2 className="text-xl font-bold text-brand-charcoal">Shop Inventory</h2>
                   <p className="text-sm text-gray-400">Manage products, pricing and visibility</p>
                </div>
                <button 
                  onClick={() => { setEditingProduct(null); setProductForm({ name: "", price: "", image: "", tag: "", shipsIn: "", sizes: "S, M, L, XL", category: "Uncategorized", active: true }); setShowProductModal(true); }}
                  className="bg-brand-charcoal text-white px-6 py-3 rounded-xl hover:bg-brand-rose flex items-center gap-2 font-bold shadow-lg transition-all transform hover:-translate-y-1"
                >
                    <Plus size={20} /> ADD NEW PRODUCT
                </button>
            </div>
        )}

        {/* Content Area */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
            {activeTab === "orders" ? (
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[900px]">
                        <thead className="bg-brand-charcoal text-white text-xs uppercase tracking-widest">
                            <tr>
                                <th className="p-5 font-bold">Date</th>
                                <th className="p-5 font-bold">Client Details</th>
                                <th className="p-5 font-bold">Service Plan</th>
                                <th className="p-5 font-bold">Amount</th>
                                <th className="p-5 font-bold">Status</th>
                                <th className="p-5 font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {orders.map((order) => {
                                const isPaid = order.status && (order.status.toLowerCase().includes("paid"));
                                return (
                                <tr key={order.id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="p-5 text-gray-500 whitespace-nowrap font-medium">
                                        {order.timestamp?.seconds ? new Date(order.timestamp.seconds * 1000).toLocaleDateString() : 'N/A'}
                                        <div className="text-xs opacity-50 mt-1">{order.timestamp?.seconds ? new Date(order.timestamp.seconds * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}</div>
                                    </td>
                                    <td className="p-5">
                                        <p className="font-black text-brand-charcoal text-base">{order.customer?.name || order.phone}</p>
                                        <p className="text-xs font-bold text-brand-rose mt-0.5">{order.customer?.phone || order.phone}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">{order.customer?.email || 'N/A'}</p>
                                    </td>
                                    <td className="p-5">
                                        <span className="font-bold text-gray-700 bg-gray-100 px-2 py-1 rounded text-xs uppercase tracking-wide">{order.plan?.category || 'Shop'}</span>
                                        <div className="font-bold text-brand-charcoal mt-1 text-base">{order.plan?.plan || order.item?.name || 'Item'}</div>
                                    </td>
                                    <td className="p-5 font-black text-xl text-brand-charcoal whitespace-nowrap">KES {order.amount}</td>
                                    <td className="p-5">
                                        <span className={`px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 shadow-sm ${isPaid ? "bg-green-100 text-green-800 border border-green-200" : "bg-yellow-50 text-yellow-700 border border-yellow-200"}`}>
                                            {isPaid ? <CheckCircle size={14}/> : <Loader2 size={14} className="animate-spin"/>}
                                            {isPaid ? "PAID" : "PENDING"}
                                        </span>
                                        {order.mpesaReceipt && order.mpesaReceipt !== "N/A" && (
                                            <div className="text-[10px] text-gray-400 mt-2 font-mono bg-gray-50 inline-block px-1 rounded border border-gray-100">{order.mpesaReceipt}</div>
                                        )}
                                    </td>
                                    <td className="p-5 text-right">
                                        {!isPaid && (
                                            <button 
                                                onClick={() => openPaymentModal(order)} 
                                                className="bg-brand-charcoal text-white text-xs px-5 py-2.5 rounded-xl hover:bg-brand-rose transition-all shadow-md hover:shadow-lg font-bold transform hover:-translate-y-0.5"
                                            >
                                                MARK PAID
                                            </button>
                                        )}
                                        {isPaid && <span className="text-xs text-gray-300 font-bold uppercase tracking-wider">Completed</span>}
                                    </td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[900px]">
                        <thead className="bg-brand-charcoal text-white text-xs uppercase tracking-widest">
                            <tr>
                                <th className="p-5 font-bold">Img</th>
                                <th className="p-5 font-bold">Product Name</th>
                                <th className="p-5 font-bold">Price</th>
                                <th className="p-5 font-bold">Category</th>
                                <th className="p-5 font-bold">Status</th>
                                <th className="p-5 font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {products.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-5"><img src={item.image} className="w-10 h-10 object-contain bg-gray-50 rounded-lg p-1 border border-gray-100" /></td>
                                    <td className="p-5 font-black text-brand-charcoal">{item.name}</td>
                                    <td className="p-5 font-bold text-brand-rose text-base">KES {item.price}</td>
                                    <td className="p-5"><span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded uppercase">{item.category}</span></td>
                                    <td className="p-5">
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-black ${item.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                            {item.active ? "LIVE" : "HIDDEN"}
                                        </span>
                                    </td>
                                    <td className="p-5 text-right space-x-2">
                                        <button onClick={() => { setEditingProduct(item); setProductForm({ ...item, sizes: item.sizes.join(", ") }); setShowProductModal(true); }} className="p-2 text-brand-charcoal hover:text-brand-rose"><Edit size={18}/></button>
                                        <button onClick={() => deleteProduct(item.id)} className="p-2 text-brand-charcoal hover:text-red-600"><Trash2 size={18}/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {((activeTab === "orders" ? orders : products).length === 0) && !loading && (
                <div className="p-16 text-center text-gray-400 font-medium">
                   <Package size={48} className="mx-auto mb-4 opacity-20" />
                   No {activeTab} found.
                </div>
            )}
        </div>
      </div>

      {/* --- PAYMENT MODAL --- */}
      <AnimatePresence>
        {selectedOrder && (
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                // 👇 CHANGED: z-50 -> z-[100] (Ensures it pops OVER the navbar)
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-charcoal/80 backdrop-blur-sm"
            >
                <motion.div 
                    initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                    className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden relative"
                >
                    {/* Header */}
                    <div className="bg-brand-charcoal p-6 text-white text-center relative">
                        <button onClick={closePaymentModal} className="absolute top-4 right-4 text-white/50 hover:text-white"><X size={24}/></button>
                        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Banknote size={24} className="text-white"/>
                        </div>
                        <h3 className="text-xl font-bold">Confirm Payment</h3>
                        <p className="text-xs text-gray-400 mt-1">Order for {selectedOrder.customer.name}</p>
                    </div>

                    {/* Body */}
                    <form onSubmit={confirmPayment} className="p-6">
                        <div className="mb-6">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Transaction Code (Required)</label>
                            <input 
                                autoFocus
                                type="text" 
                                placeholder="e.g. QWE123456" 
                                value={paymentCode}
                                onChange={(e) => setPaymentCode(e.target.value.toUpperCase())}
                                className="w-full p-4 text-center text-xl font-black tracking-widest bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-brand-rose focus:bg-white outline-none transition-all uppercase placeholder:tracking-normal placeholder:font-normal placeholder:text-sm"
                            />
                            <p className="text-[10px] text-gray-400 mt-2 text-center">
                                Enter the code from the M-Pesa SMS or Bank Transfer.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button type="button" onClick={closePaymentModal} className="w-1/3 py-3 rounded-xl font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 transition">
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                disabled={processing || !paymentCode}
                                className={`w-2/3 py-3 rounded-xl font-bold text-white transition flex items-center justify-center gap-2 ${processing || !paymentCode ? 'bg-gray-300 cursor-not-allowed' : 'bg-brand-rose hover:bg-brand-charcoal shadow-lg hover:shadow-xl'}`}
                            >
                                {processing ? <Loader2 className="animate-spin"/> : "CONFIRM & SEND RECEIPT"}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* --- PRODUCT MODAL --- */}
      <AnimatePresence>
          {showProductModal && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-charcoal/80 backdrop-blur-sm">
                  <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
                      <div className="bg-brand-charcoal p-6 text-white flex justify-between items-center">
                          <h3 className="text-xl font-bold">{editingProduct ? "Edit Product" : "New Product"}</h3>
                          <button onClick={() => setShowProductModal(false)}><X size={24}/></button>
                      </div>
                      <form onSubmit={handleProductSubmit} className="p-8 grid grid-cols-2 gap-4">
                          <div className="col-span-2">
                              <label className="text-[10px] font-bold text-gray-400 uppercase">Product Name</label>
                              <input required value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:border-brand-rose" placeholder="e.g. Agency Hoodie" />
                          </div>
                          <div>
                              <label className="text-[10px] font-bold text-gray-400 uppercase">Price (KES)</label>
                              <input required type="number" value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:border-brand-rose" placeholder="2800" />
                          </div>
                          <div>
                              <label className="text-[10px] font-bold text-gray-400 uppercase">Category</label>
                              <select value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:border-brand-rose">
                                  <option>Hoodies</option>
                                  <option>Sweatshirts</option>
                                  <option>T-Shirts</option>
                                  <option>Other</option>
                              </select>
                          </div>
                          <div className="col-span-2">
                              <label className="text-[10px] font-bold text-gray-400 uppercase">Image URL (e.g. /images/Black.png)</label>
                              <input required value={productForm.image} onChange={e => setProductForm({...productForm, image: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:border-brand-rose" placeholder="/images/..." />
                          </div>
                          <div>
                              <label className="text-[10px] font-bold text-gray-400 uppercase">Tagline</label>
                              <input value={productForm.tag} onChange={e => setProductForm({...productForm, tag: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:border-brand-rose" placeholder="Heavyweight Cotton" />
                          </div>
                          <div>
                              <label className="text-[10px] font-bold text-gray-400 uppercase">Shipping Info</label>
                              <input value={productForm.shipsIn} onChange={e => setProductForm({...productForm, shipsIn: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:border-brand-rose" placeholder="3-5 Days" />
                          </div>
                          <div className="col-span-2">
                              <label className="text-[10px] font-bold text-gray-400 uppercase">Sizes (comma separated)</label>
                              <input value={productForm.sizes} onChange={e => setProductForm({...productForm, sizes: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:border-brand-rose" placeholder="S, M, L, XL" />
                          </div>
                          <div className="col-span-2 flex items-center gap-2 mt-2">
                              <input type="checkbox" checked={productForm.active} onChange={e => setProductForm({...productForm, active: e.target.checked})} />
                              <label className="text-xs font-bold text-gray-600">Product is Live on Shop</label>
                          </div>
                          <button disabled={processing} className="col-span-2 mt-4 bg-brand-rose text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2">
                              {processing ? <Loader2 className="animate-spin"/> : <Package size={20}/>}
                              {editingProduct ? "UPDATE PRODUCT" : "SAVE PRODUCT"}
                          </button>
                      </form>
                  </motion.div>
              </motion.div>
          )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPanel;