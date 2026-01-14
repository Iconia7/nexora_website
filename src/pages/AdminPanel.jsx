import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, updateDoc, doc } from "firebase/firestore";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { db, auth } from '../firebase';
import emailjs from '@emailjs/browser';
import toast from 'react-hot-toast';
import { Loader2, CheckCircle, Search, RefreshCw, LogOut, ShieldCheck } from 'lucide-react';

const AdminPanel = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null); // Stores the logged-in user;

// --- CHECK LOGIN STATUS ---
  useEffect(() => {
    // This listener checks if you are already logged in when the page loads
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        if (currentUser) {
            fetchOrders();
        }
    });
    return () => unsubscribe();
  }, []);

  // --- 1. SECURE LOGIN (Firebase) ---
  const handleLogin = async (e) => {
      e.preventDefault();
      try {
          // This sends the password to Google. 
          // If correct, it logs you in. If wrong, it throws an error.
          await signInWithEmailAndPassword(auth, email, password);
          toast.success("Welcome back, Boss!");
      } catch (error) {
          console.error(error);
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
          
          const ordersData = snapshot.docs.map(doc => ({ 
              id: doc.id, 
              ...doc.data() 
          }));
          
          setOrders(ordersData);
      } catch (err) {
          console.error(err);
          toast.error("Failed to load orders");
      } finally {
          setLoading(false);
      }
  };

  // --- 3. MARK AS PAID & SEND RECEIPT ---
  const handleMarkPaid = async (order) => {
      const mpesaCodeInput = window.prompt("Enter the M-Pesa/Bank Transaction Code from your phone:");
      if (!mpesaCodeInput) return; 

      const toastId = toast.loading("Updating Order & Sending Email...");

      try {
          // A. Update Firebase
          const orderRef = doc(db, "orders", order.id);
          await updateDoc(orderRef, {
              status: `PAID (Confirmed: ${mpesaCodeInput})`,
              mpesaReceipt: mpesaCodeInput,
              paidAt: new Date()
          });

          // B. Send Receipt Email
          const emailParams = {
              to_email: order.customer.email,
              from_name: "Nexora Creative Solutions Billing Team",
              subject: `Payment Received - ${order.plan.plan}`,
              message_body: `Hi ${order.customer.name},\n\n` +
                            `Great news! We have confirmed your payment of KES ${order.amount}.\n\n` +
                            `DETAILS:\n` +
                            `Service: ${order.plan.plan}\n` +
                            `Amount: KES ${order.amount}\n` +
                            `Ref Code: ${mpesaCodeInput}\n\n` +
                            `Our team will be in touch shortly to start the project.\n\n` +
                            `Thank you,\nNexora Creative Solutions`
          };

          await emailjs.send("service_nhwsclu", "template_61eywtf", emailParams, "ctUKvg88_0Th5sfKn");

          toast.success("Success! Client has been emailed.", { id: toastId });
          fetchOrders(); 

      } catch (error) {
          console.error(error);
          toast.error("Error updating order", { id: toastId });
      }
  };

  // --- LOGIN SCREEN (Brand Style) ---
if (!user) {
      return (
          <div className="h-screen flex items-center justify-center bg-gray-50 font-sans relative overflow-hidden">
              <div className="absolute top-0 left-0 w-64 h-64 bg-brand-rose/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-charcoal/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

              <form onSubmit={handleLogin} className="bg-white p-10 rounded-3xl shadow-2xl text-center w-full max-w-sm relative z-10 border border-gray-100">
                  <div className="w-20 h-20 bg-brand-charcoal rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-brand-charcoal/20">
                      <ShieldCheck className="text-brand-rose" size={32} />
                  </div>
                  <h2 className="text-3xl font-black text-brand-charcoal mb-2 font-creative">ADMIN PORTAL</h2>
                  <p className="text-gray-400 text-sm mb-8 font-medium">Secure Access Only</p>
                  
                  <input 
                      type="email" 
                      placeholder="admin@nexora..." 
                      className="border-2 border-gray-100 bg-gray-50 p-4 rounded-xl mb-3 w-full outline-none focus:border-brand-rose transition-all"
                      onChange={(e) => setEmail(e.target.value)}
                  />
                  <input 
                      type="password" 
                      placeholder="Password" 
                      className="border-2 border-gray-100 bg-gray-50 p-4 rounded-xl mb-4 w-full outline-none focus:border-brand-rose transition-all"
                      onChange={(e) => setPassword(e.target.value)}
                  />

                  <button type="submit" className="bg-brand-charcoal text-white w-full py-4 rounded-xl font-bold hover:bg-brand-rose transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                      SECURE LOGIN
                  </button>
              </form>
          </div>
      );
  }

  // --- DASHBOARD UI (Brand Style) ---
return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 pt-24 font-sans text-gray-800">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4 border-b border-gray-200 pb-6">
            <div>
                <h1 className="text-4xl font-black text-brand-charcoal font-creative tracking-tight">ORDER MANAGEMENT</h1>
                <p className="text-gray-500 mt-2 font-medium">Logged in as: {user.email}</p>
            </div>
            <div className="flex gap-3">
                <button onClick={fetchOrders} className="bg-white border border-gray-200 text-brand-charcoal px-4 py-2 rounded-xl hover:bg-gray-50 flex items-center gap-2 text-sm font-bold shadow-sm transition-all">
                    <RefreshCw size={18} className={loading ? "animate-spin" : ""} /> REFRESH
                </button>
                {/* LOGOUT BUTTON NOW CALLS FIREBASE SIGNOUT */}
                <button onClick={handleLogout} className="bg-brand-rose/10 text-brand-rose border border-brand-rose/20 px-4 py-2 rounded-xl hover:bg-brand-rose hover:text-white flex items-center gap-2 text-sm font-bold shadow-sm transition-all">
                    <LogOut size={18} /> LOGOUT
                </button>
            </div>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
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
                                    <p className="font-black text-brand-charcoal text-base">{order.customer.name}</p>
                                    <p className="text-xs font-bold text-brand-rose mt-0.5">{order.customer.phone}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{order.customer.email}</p>
                                </td>
                                <td className="p-5">
                                    <span className="font-bold text-gray-700 bg-gray-100 px-2 py-1 rounded text-xs uppercase tracking-wide">{order.plan.category}</span>
                                    <div className="font-bold text-brand-charcoal mt-1 text-base">{order.plan.plan}</div>
                                </td>
                                <td className="p-5 font-black text-xl text-brand-charcoal whitespace-nowrap">
                                    KES {order.amount}
                                </td>
                                <td className="p-5">
                                    <span className={`px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 shadow-sm ${
                                        isPaid
                                        ? "bg-green-100 text-green-800 border border-green-200" 
                                        : "bg-yellow-50 text-yellow-700 border border-yellow-200"
                                    }`}>
                                        {isPaid ? <CheckCircle size={14}/> : <Loader2 size={14} className="animate-spin"/>}
                                        {isPaid ? "PAID" : "PENDING"}
                                    </span>
                                    {order.mpesaReceipt && order.mpesaReceipt !== "N/A" && (
                                        <div className="text-[10px] text-gray-400 mt-2 font-mono bg-gray-50 inline-block px-1 rounded border border-gray-100">
                                            {order.mpesaReceipt}
                                        </div>
                                    )}
                                </td>
                                <td className="p-5 text-right">
                                    {!isPaid && (
                                        <button 
                                            onClick={() => handleMarkPaid(order)}
                                            className="bg-brand-charcoal text-white text-xs px-5 py-2.5 rounded-xl hover:bg-brand-rose transition-all shadow-md hover:shadow-lg font-bold transform hover:-translate-y-0.5"
                                        >
                                            MARK PAID
                                        </button>
                                    )}
                                    {isPaid && (
                                        <span className="text-xs text-gray-300 font-bold uppercase tracking-wider">Completed</span>
                                    )}
                                </td>
                            </tr>
                        )})}
                    </tbody>
                </table>
            </div>
            
            {orders.length === 0 && !loading && (
                <div className="p-16 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search size={24} className="text-gray-300"/>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">No Orders Yet</h3>
                    <p className="text-gray-400 text-sm">Waiting for the first sale to come in!</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;