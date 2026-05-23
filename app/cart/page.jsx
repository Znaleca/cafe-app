'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  FiMinus, FiPlus, FiShoppingCart, FiTrash2, FiArrowLeft,
  FiCheckCircle, FiClock, FiUpload, FiX, FiAlertCircle,
  FiShoppingBag, FiTruck, FiSmartphone, FiAlertTriangle,
} from 'react-icons/fi';
import { useCart } from '@/context/CartContext';
import { getSupabaseImageUrl } from '@/utils/supabase/getSupabaseImageUrl';
import { supabase } from '@/utils/supabase/client';
import { FiMapPin } from 'react-icons/fi';
import DeliveryMap from '@/components/DeliveryMap';

// ── CONFIRMATION MODAL ───────────────────────────────────────────────────────
function ConfirmModal({ cartItems, cartTotal, orderType, paymentMethod, paymentProofFile, onConfirm, onCancel, isProcessing }) {
  const downpayment = paymentMethod === 'cod' ? cartTotal * 0.3 : cartTotal;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-sky-500 px-6 py-5">
          <h2 className="text-2xl font-black text-white tracking-tight">Confirm Your Order</h2>
          <p className="text-sky-100 text-sm mt-1">Please review before placing</p>
        </div>
        <div className="p-6 space-y-5">
          {/* Items */}
          <div className="space-y-2">
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Your Items</p>
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center text-sm">
                <span className="font-semibold text-slate-700">
                  {item.name} <span className="text-slate-400">x{item.quantity}</span>
                </span>
                <span className="font-bold text-slate-800">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t border-dashed border-slate-200 pt-3 mt-3 flex justify-between">
              <span className="font-black text-slate-700">Total</span>
              <span className="font-black text-sky-600 text-lg">${cartTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Order Details */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 rounded-2xl p-3 flex items-center gap-2">
              {orderType === 'pick up'
                ? <FiShoppingBag className="w-4 h-4 text-sky-500 shrink-0" />
                : <FiTruck className="w-4 h-4 text-amber-500 shrink-0" />}
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase">Type</p>
                <p className="font-black text-slate-800 text-sm capitalize">{orderType}</p>
              </div>
            </div>
            <div className="bg-slate-50 rounded-2xl p-3 flex items-center gap-2">
              <FiSmartphone className={`w-4 h-4 shrink-0 ${paymentMethod === 'cod' ? 'text-amber-500' : 'text-violet-500'}`} />
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase">Payment</p>
                <p className="font-black text-slate-800 text-sm uppercase">{paymentMethod}</p>
              </div>
            </div>
          </div>

          {/* Delivery Location Preview */}
          {orderType === 'delivery' && deliveryLocation && (
            <div className="bg-sky-50 border border-sky-100 rounded-2xl p-4 flex gap-3">
              <FiMapPin className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-black text-sky-700 uppercase tracking-widest mb-1">Delivery To</p>
                <p className="text-sm font-semibold text-sky-900 leading-snug">{deliveryLocation.address}</p>
              </div>
            </div>
          )}

          {/* Downpayment notice for COD */}
          {paymentMethod === 'cod' && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <p className="text-xs font-black text-amber-700 uppercase tracking-wide mb-1 flex items-center gap-1">
                <FiAlertTriangle className="w-3.5 h-3.5" /> COD Downpayment Required
              </p>
              <p className="text-2xl font-black text-amber-600">${downpayment.toFixed(2)}</p>
              <p className="text-xs text-amber-600 mt-1">30% of your total. Proof uploaded ✓</p>
            </div>
          )}

          {paymentProofFile && (
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">
              <FiCheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
              <p className="text-sm text-emerald-700 font-semibold truncate">{paymentProofFile.name}</p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button onClick={onCancel} disabled={isProcessing}
              className="flex-1 py-3.5 rounded-2xl border-2 border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50">
              Go Back
            </button>
            <button onClick={onConfirm} disabled={isProcessing}
              className="flex-1 py-3.5 rounded-2xl bg-sky-500 text-white font-bold hover:bg-sky-400 transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
              {isProcessing
                ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Placing...</>
                : 'Yes, Place Order!'
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── MAIN CART PAGE ────────────────────────────────────────────────────────────
export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();

  const [orderType, setOrderType] = useState('pick up');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [paymentProofFile, setPaymentProofFile] = useState(null);
  const [proofPreviewUrl, setProofPreviewUrl] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [deliveryLocation, setDeliveryLocation] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [checkoutError, setCheckoutError] = useState('');
  const fileInputRef = useRef(null);
  const router = useRouter();

  const downpaymentAmount = cartTotal * 0.3;
  const proofLabel = paymentMethod === 'cod'
    ? `Upload Proof of 30% Downpayment ($${downpaymentAmount.toFixed(2)})`
    : 'Upload Proof of Full Payment';

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPaymentProofFile(file);
    setProofPreviewUrl(URL.createObjectURL(file));
  };

  const removeProof = () => {
    setPaymentProofFile(null);
    setProofPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    removeProof();
    setCheckoutError('');
  };

  const handleCheckoutClick = () => {
    if (orderType === 'delivery' && !deliveryLocation) {
      setCheckoutError('Please set your delivery location on the map before proceeding.');
      return;
    }
    if (!paymentProofFile) {
      const label = paymentMethod === 'cod'
        ? 'Please upload your 30% downpayment proof before proceeding.'
        : 'Please upload your proof of payment before proceeding.';
      setCheckoutError(label);
      return;
    }
    setCheckoutError('');
    setShowConfirmModal(true);
  };

  const handleConfirmOrder = async () => {
    setIsProcessing(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/login'); return; }

      let paymentProofUrl = null;
      if (paymentProofFile) {
        const fileExt = paymentProofFile.name.split('.').pop();
        const filePath = `${session.user.id}/${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('payment-proofs')
          .upload(filePath, paymentProofFile, { upsert: true });
        if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);
        paymentProofUrl = filePath;
      }

      const orderItems = cartItems.map((item) => ({
        id: item.id,
        name: item.name,
        price: Number(item.price),
        quantity: item.quantity,
        category: item.category,
        image_url: item.image_url || null,
      }));

      const { data, error } = await supabase
        .from('orders')
        .insert([{
          user_id: session.user.id,
          status: 'pending',
          total_amount: cartTotal,
          items: orderItems,
          order_type: orderType,
          payment_method: paymentMethod,
          payment_proof_url: paymentProofUrl,
          delivery_lat: deliveryLocation?.lat || null,
          delivery_lng: deliveryLocation?.lng || null,
          delivery_address: deliveryLocation?.address || null,
        }])
        .select('id')
        .single();

      if (error) throw new Error(error.message);

      clearCart();
      setShowConfirmModal(false);
      setOrderSuccess(data.id);
    } catch (err) {
      setCheckoutError(err.message || 'Something went wrong. Please try again.');
      setShowConfirmModal(false);
    } finally {
      setIsProcessing(false);
    }
  };

  // ── SUCCESS SCREEN ──────────────────────────────────────────────────────────
  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-sky-50 flex items-center justify-center mx-auto mb-6 animate-bounce">
            <FiCheckCircle className="w-10 h-10 text-sky-500" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Order Placed!</h1>
          <p className="text-slate-500 mb-6 leading-relaxed">
            Your order has been received and is waiting for confirmation from the cafe.
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl px-6 py-4 mb-4 flex items-center gap-3">
            <FiClock className="w-5 h-5 text-amber-500 shrink-0" />
            <div className="text-left">
              <p className="text-sm font-bold text-amber-700">Status: Pending</p>
              <p className="text-xs text-amber-600 mt-0.5">The admin will confirm your order shortly.</p>
            </div>
          </div>
          <div className="bg-slate-50 border border-slate-100 rounded-2xl px-6 py-3 mb-8">
            <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-1">Order ID</p>
            <p className="text-xs font-mono text-slate-600 break-all">{orderSuccess}</p>
          </div>
          <div className="flex flex-col gap-3">
            <Link href="/orders" className="w-full py-3.5 rounded-full bg-sky-500 text-white font-bold uppercase tracking-wide hover:bg-sky-400 transition-colors text-center">
              Track My Order
            </Link>
            <Link href="/menu" className="w-full py-3.5 rounded-full border-2 border-slate-200 text-slate-700 font-bold uppercase tracking-wide hover:bg-slate-50 transition-colors text-center">
              Back to Menu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── NORMAL CART VIEW ────────────────────────────────────────────────────────
  return (
    <>
      {showMapModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowMapModal(false)} />
          <div className="relative w-full max-w-2xl max-h-[90vh]">
            <DeliveryMap 
              initialLocation={deliveryLocation}
              onConfirm={(loc) => {
                setDeliveryLocation(loc);
                setShowMapModal(false);
              }}
              onCancel={() => setShowMapModal(false)}
            />
          </div>
        </div>
      )}

      {showConfirmModal && (
        <ConfirmModal
          cartItems={cartItems}
          cartTotal={cartTotal}
          orderType={orderType}
          paymentMethod={paymentMethod}
          paymentProofFile={paymentProofFile}
          onConfirm={handleConfirmOrder}
          onCancel={() => setShowConfirmModal(false)}
          isProcessing={isProcessing}
        />
      )}

      <div className="min-h-screen bg-white">
        <div className="bg-[#e0f2fe] border-b-2 border-sky-100">
          <div className="max-w-7xl mx-auto px-4 py-16 md:py-20">
            <Link href="/menu" className="inline-flex items-center gap-2 text-slate-700 font-bold uppercase tracking-widest text-sm hover:text-sky-600 transition-colors mb-6">
              <FiArrowLeft className="w-4 h-4" /> Continue shopping
            </Link>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-sky-600">
                <FiShoppingCart className="w-7 h-7" />
              </div>
              <div>
                <p className="uppercase tracking-widest text-sky-600 font-bold text-sm">Your cart</p>
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 uppercase leading-none">Checkout</h1>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-10 md:py-16">
          {cartItems.length === 0 ? (
            <div className="min-h-[50vh] flex flex-col items-center justify-center text-center bg-slate-50 border border-slate-100 rounded-3xl p-10">
              <FiShoppingCart className="w-16 h-16 text-sky-300 mb-6" />
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-3">Your cart is empty</h2>
              <p className="text-slate-600 max-w-md mb-8">Add a few menu items and they will show up here for review before checkout.</p>
              <Link href="/menu" className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-slate-900 text-white font-bold uppercase tracking-wide hover:bg-slate-800 transition-colors">
                Browse menu
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_400px] gap-8 items-start">
              {/* Cart Items */}
              <div className="space-y-4">
                {cartItems.map((item) => {
                  const imageUrl = getSupabaseImageUrl(item.image_url);
                  return (
                    <div key={item.id} className="bg-white border-2 border-slate-100 rounded-3xl p-4 md:p-5 flex flex-col sm:flex-row gap-4 shadow-sm">
                      <div className="relative w-full sm:w-36 h-44 sm:h-36 rounded-2xl overflow-hidden bg-slate-50 shrink-0">
                        {imageUrl && <Image src={imageUrl} alt={item.name} fill className="object-cover" sizes="(max-width: 640px) 100vw, 144px" priority />}
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-between gap-4">
                        <div>
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-xs uppercase tracking-widest text-sky-600 font-bold mb-2">{item.category}</p>
                              <h2 className="text-2xl font-black text-slate-900 leading-tight">{item.name}</h2>
                            </div>
                            <p className="text-xl font-black text-sky-600 whitespace-nowrap">${Number(item.price).toFixed(2)}</p>
                          </div>
                          <p className="text-slate-600 mt-3 leading-relaxed">{item.description}</p>
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-2 bg-slate-50 rounded-full px-3 py-2">
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-slate-500 hover:text-sky-600 p-1">
                              <FiMinus className="w-4 h-4" />
                            </button>
                            <span className="font-bold text-sm w-6 text-center text-slate-700">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-slate-500 hover:text-sky-600 p-1">
                              <FiPlus className="w-4 h-4" />
                            </button>
                          </div>
                          <button onClick={() => removeFromCart(item.id)} className="inline-flex items-center gap-2 text-sm font-bold text-rose-500 hover:text-rose-600">
                            <FiTrash2 className="w-4 h-4" /> Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Sidebar */}
              <aside className="lg:sticky lg:top-28 space-y-4">

                {/* Order Type */}
                <div className="bg-white border-2 border-slate-100 rounded-3xl p-5 shadow-sm">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Order Type</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: 'pick up', label: 'Pick Up', Icon: FiShoppingBag },
                      { value: 'delivery', label: 'Delivery', Icon: FiTruck },
                    ].map(({ value, label, Icon }) => (
                      <button key={value} onClick={() => setOrderType(value)}
                        className={`flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm transition-all ${
                          orderType === value
                            ? 'bg-sky-500 text-white shadow-sm'
                            : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border-2 border-slate-100'
                        }`}>
                        <Icon className="w-4 h-4" /> {label}
                      </button>
                    ))}
                  </div>

                  {orderType === 'delivery' && (
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <p className="text-xs font-bold text-slate-500 mb-2">Delivery Location <span className="text-rose-500">*</span></p>
                      {deliveryLocation ? (
                        <div className="bg-sky-50 border border-sky-200 rounded-2xl p-3 relative group">
                          <p className="text-sm font-semibold text-sky-800 pr-8 line-clamp-2">{deliveryLocation.address}</p>
                          <button onClick={() => setShowMapModal(true)} className="absolute top-3 right-3 p-1.5 bg-white text-sky-600 rounded-xl hover:bg-sky-100 shadow-sm transition-colors border border-sky-200">
                            <FiMapPin className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => setShowMapModal(true)} className="w-full py-3 bg-sky-50 text-sky-600 font-bold text-sm rounded-2xl border border-sky-200 flex items-center justify-center gap-2 hover:bg-sky-100 transition-colors">
                          <FiMapPin className="w-4 h-4" /> Set Location on Map
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Payment Method */}
                <div className="bg-white border-2 border-slate-100 rounded-3xl p-5 shadow-sm">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Payment Method</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: 'cod', label: 'COD', Icon: FiShoppingBag },
                      { value: 'online payment', label: 'Online Pay', Icon: FiSmartphone },
                    ].map(({ value, label, Icon }) => (
                      <button key={value} onClick={() => handlePaymentMethodChange(value)}
                        className={`flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm transition-all ${
                          paymentMethod === value
                            ? 'bg-slate-900 text-white shadow-sm'
                            : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border-2 border-slate-100'
                        }`}>
                        <Icon className="w-4 h-4" /> {label}
                      </button>
                    ))}
                  </div>

                  {/* COD notice */}
                  {paymentMethod === 'cod' && (
                    <div className="mt-4 bg-amber-50 border border-amber-200 rounded-2xl p-3">
                      <p className="text-xs font-black text-amber-700 uppercase tracking-wide flex items-center gap-1 mb-1">
                        <FiAlertTriangle className="w-3.5 h-3.5" /> 30% Downpayment Required
                      </p>
                      <p className="text-xl font-black text-amber-600">${downpaymentAmount.toFixed(2)}</p>
                      <p className="text-xs text-amber-600 mt-0.5">Upload proof of this amount below.</p>
                    </div>
                  )}

                  {/* File Upload */}
                  <div className="mt-4">
                    <p className="text-xs font-bold text-slate-500 mb-2">
                      {proofLabel} <span className="text-rose-500">*</span>
                    </p>
                    {proofPreviewUrl ? (
                      <div className="relative rounded-2xl overflow-hidden border-2 border-sky-200">
                        <Image src={proofPreviewUrl} alt="Payment proof" width={400} height={200} className="w-full object-cover max-h-48" unoptimized />
                        <button onClick={removeProof} className="absolute top-2 right-2 w-7 h-7 bg-rose-500 text-white rounded-full flex items-center justify-center hover:bg-rose-600 transition-colors shadow-md">
                          <FiX className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => fileInputRef.current?.click()}
                        className="w-full border-2 border-dashed border-slate-300 rounded-2xl py-6 flex flex-col items-center gap-2 text-slate-400 hover:border-sky-400 hover:text-sky-500 transition-colors">
                        <FiUpload className="w-6 h-6" />
                        <span className="text-sm font-bold">Click to upload screenshot</span>
                        <span className="text-xs">JPG, PNG, HEIC supported</span>
                      </button>
                    )}
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-7 shadow-2xl shadow-slate-200">
                  <p className="uppercase tracking-widest text-sky-300 font-bold text-sm mb-2">Order summary</p>
                  <h2 className="text-3xl font-black uppercase tracking-tight mb-6">Ready to pay</h2>
                  <div className="space-y-3 text-slate-200 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Items</span>
                      <span className="font-bold">{cartItems.length}</span>
                    </div>
                    <div className="flex justify-between items-center text-lg">
                      <span className="text-slate-300">Total</span>
                      <span className="font-black text-sky-300">${cartTotal.toFixed(2)}</span>
                    </div>
                    {paymentMethod === 'cod' && (
                      <div className="flex justify-between items-center border-t border-white/10 pt-3">
                        <span className="text-amber-300 font-bold text-sm">Downpayment (30%)</span>
                        <span className="font-black text-amber-300">${downpaymentAmount.toFixed(2)}</span>
                      </div>
                    )}
                  </div>

                  {checkoutError && (
                    <div className="mb-4 p-3 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-start gap-2 text-rose-300 text-sm font-medium">
                      <FiAlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                      {checkoutError}
                    </div>
                  )}

                  <div className="space-y-3">
                    <button onClick={handleCheckoutClick}
                      className="w-full py-4 rounded-full bg-sky-500 text-white font-bold uppercase tracking-wide hover:bg-sky-400 transition-colors flex items-center justify-center gap-2">
                      Review & Place Order
                    </button>
                    <Link href="/menu" className="block text-center w-full py-4 rounded-full border-2 border-white/20 text-white font-bold uppercase tracking-wide hover:bg-white hover:text-slate-900 transition-colors">
                      Add more items
                    </Link>
                  </div>
                </div>
              </aside>
            </div>
          )}
        </div>
      </div>
    </>
  );
}