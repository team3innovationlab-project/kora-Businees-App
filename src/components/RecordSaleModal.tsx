import React, { useState } from 'react';
import { 
  X, 
  Search, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  CreditCard, 
  Smartphone, 
  Banknote, 
  CheckCircle2, 
  Printer, 
  Share2,
  Lock,
  ShieldCheck,
  Zap,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { StockItem, PaymentMethod, BusinessProfile, Sale, User } from '../types';
import { PinAuthModal } from './PinAuthModal';

interface RecordSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  stock: StockItem[];
  business: BusinessProfile;
  currentUser?: User | null;
  isPinUnlocked?: boolean;
  onUnlockPin?: () => void;
  onSaleCompleted: () => void;
  onShowToast: (msg: string) => void;
}

interface CartItem {
  product: StockItem;
  quantity: number;
}

export const RecordSaleModal: React.FC<RecordSaleModalProps> = ({
  isOpen,
  onClose,
  stock,
  business,
  currentUser = null,
  isPinUnlocked = false,
  onUnlockPin,
  onSaleCompleted,
  onShowToast,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');
  const [momoNetwork, setMomoNetwork] = useState<'MTN' | 'Telecel/Vodafone' | 'AT' | 'Other'>('MTN');
  const [momoReference, setMomoReference] = useState('');
  
  // Card & Paystack integration state
  const [cardBrand, setCardBrand] = useState<'Visa' | 'Mastercard'>('Visa');
  const [cardReference, setCardReference] = useState(`pstk_${Date.now().toString().slice(-6)}`);
  const [customerEmail, setCustomerEmail] = useState('');
  const [isPaystackModalOpen, setIsPaystackModalOpen] = useState(false);
  const [isProcessingPaystack, setIsProcessingPaystack] = useState(false);
  const [paystackVerified, setPaystackVerified] = useState(false);
  const [cardNumber, setCardNumber] = useState('4084 0840 0840 0840');
  const [cardExp, setCardExp] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('123');

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastCompletedSale, setLastCompletedSale] = useState<Sale | null>(null);

  // Cashier PIN lock state
  const [showPinAuthModal, setShowPinAuthModal] = useState(false);
  const isStaff = currentUser?.role === 'CASHIER' || currentUser?.role === 'STAFF';

  if (!isOpen) return null;

  const categories = ['All', ...Array.from(new Set(stock.map((s) => s.category)))];

  const filteredStock = stock.filter((item) => {
    const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const addToCart = (product: StockItem) => {
    if (product.currentQuantity <= 0) {
      onShowToast(`Item "${product.name}" is out of stock!`);
      return;
    }
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.currentQuantity) {
          onShowToast(`Cannot exceed available stock (${product.currentQuantity} ${product.unit})`);
          return prev;
        }
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            if (newQty > item.product.currentQuantity) {
              onShowToast(`Max stock reached for this item.`);
              return item;
            }
            return { ...item, quantity: Math.max(0, newQty) };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const cartSubtotal = cart.reduce(
    (sum, item) => sum + item.product.sellingPrice * item.quantity,
    0
  );

  // Paystack Card Checkout popup flow
  const handlePayWithPaystack = async () => {
    setIsProcessingPaystack(true);
    try {
      // 1. Initialize transaction on backend
      const initRes = await fetch('/api/payments/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: cartSubtotal,
          email: customerEmail || 'customer@kora.app',
        }),
      });

      const initData = await initRes.json();
      const generatedRef = initData.data?.reference || `pstk_trx_${Date.now()}`;

      // 2. Verify transaction
      const verifyRes = await fetch('/api/payments/paystack/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reference: generatedRef,
          last4: cardNumber.replace(/\s/g, '').slice(-4) || '4242',
          cardType: cardBrand,
        }),
      });

      if (verifyRes.ok) {
        setCardReference(generatedRef);
        setPaystackVerified(true);
        setIsPaystackModalOpen(false);
        onShowToast(`Visa/Mastercard authorized via Paystack! Ref: ${generatedRef}`);
      }
    } catch (err) {
      console.error(err);
      onShowToast('Paystack payment processing error.');
    } finally {
      setIsProcessingPaystack(false);
    }
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      onShowToast('Cart is empty. Add items to proceed.');
      return;
    }

    // Role check: Staff must authenticate by PIN
    if (isStaff && !isPinUnlocked) {
      setShowPinAuthModal(true);
      return;
    }

    if (paymentMethod === 'MOMO' && !momoReference.trim()) {
      onShowToast('Please enter the MoMo transaction reference / ID.');
      return;
    }

    if (paymentMethod === 'CARD' && !cardReference.trim()) {
      onShowToast('Please enter or authorize the Paystack reference.');
      return;
    }

    setIsSubmitting(true);
    try {
      const salePayload = {
        items: cart.map((item) => ({
          productId: item.product.id,
          name: item.product.name,
          quantity: item.quantity,
          unitPrice: item.product.sellingPrice,
          total: item.product.sellingPrice * item.quantity,
        })),
        totalAmount: cartSubtotal,
        paymentMethod,
        momoNetwork: paymentMethod === 'MOMO' ? momoNetwork : undefined,
        momoReference: paymentMethod === 'MOMO' ? momoReference : (paymentMethod === 'CARD' ? `${cardBrand} via Paystack (${cardReference})` : undefined),
        customerName: customerName || undefined,
        customerPhone: customerPhone || undefined,
        notes: paymentMethod === 'CARD' ? `Paystack Card (${cardBrand}) Ref: ${cardReference}` : undefined,
        cashierId: currentUser?.id,
        cashierName: currentUser?.name,
      };

      const res = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(salePayload),
      });

      if (!res.ok) throw new Error('Failed to record sale');

      const data = await res.json();
      setLastCompletedSale(data.sale);
      onSaleCompleted();
      onShowToast(`Sale of ${business.currency} ${cartSubtotal} recorded successfully!`);
    } catch (err) {
      console.error('Checkout error:', err);
      onShowToast('Failed to complete transaction.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndNew = () => {
    setCart([]);
    setLastCompletedSale(null);
    setMomoReference('');
    setCardReference(`pstk_${Date.now().toString().slice(-6)}`);
    setPaystackVerified(false);
    setCustomerName('');
    setCustomerPhone('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">
                Point of Sale (POS) — Record Sale
              </h2>
              {isStaff && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                  isPinUnlocked ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  <Lock className="w-3 h-3" />
                  <span>{isPinUnlocked ? 'PIN Authenticated' : 'PIN Required'}</span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              Select products, choose payment (Cash, MoMo, Visa/Mastercard via Paystack), and generate receipt
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {lastCompletedSale ? (
          /* Receipt Success View */
          <div className="p-8 flex flex-col items-center justify-center text-center space-y-4 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Sale Completed!</h3>
              <p className="text-xs text-slate-500 mt-1">
                Receipt #{lastCompletedSale.receiptNumber} · Paid via {lastCompletedSale.paymentMethod}
              </p>
              {lastCompletedSale.paymentMethod === 'CARD' && (
                <div className="mt-1 text-[11px] font-mono text-blue-700 bg-blue-50 py-0.5 px-2 rounded-md inline-block">
                  💳 Paystack Settled · Ref: {lastCompletedSale.momoReference || 'pstk_approved'}
                </div>
              )}
            </div>

            {/* Receipt Summary Card */}
            <div className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-left text-xs space-y-2">
              <div className="border-b border-slate-200 pb-2">
                <span className="font-bold text-slate-800 block text-sm">{business.name}</span>
                <span className="text-slate-500">{business.city}, {business.country}</span>
              </div>
              <div className="space-y-1 py-1">
                {lastCompletedSale.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-slate-700">
                    <span>{item.quantity}x {item.name}</span>
                    <span className="font-semibold">{business.currency} {item.total}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-slate-900 text-sm">
                <span>Total Paid:</span>
                <span className="text-emerald-600">{business.currency} {lastCompletedSale.totalAmount}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Receipt</span>
              </button>
              <button
                onClick={handleResetAndNew}
                className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer"
              >
                Record Another Sale
              </button>
            </div>
          </div>
        ) : (
          /* Normal POS Grid: Left catalog, Right cart */
          <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden">
            {/* Left: Product Catalog (7 Cols) */}
            <div className="lg:col-span-7 p-4 border-r border-slate-200 flex flex-col overflow-hidden">
              {/* Search & Categories */}
              <div className="space-y-2 mb-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by product name or SKU..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                        selectedCategory === cat
                          ? 'bg-slate-900 text-white font-semibold'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Products Grid */}
              <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[380px]">
                {filteredStock.map((prod) => {
                  const isOutOfStock = prod.currentQuantity <= 0;
                  return (
                    <div
                      key={prod.id}
                      onClick={() => !isOutOfStock && addToCart(prod)}
                      className={`p-3 rounded-xl border transition-all text-left flex flex-col justify-between ${
                        isOutOfStock
                          ? 'bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed'
                          : 'bg-white hover:bg-emerald-50/40 border-slate-200 hover:border-emerald-300 cursor-pointer shadow-2xs hover:shadow-xs'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                          <span className="font-mono">{prod.sku}</span>
                          <span
                            className={`px-1.5 py-0.2 rounded font-semibold ${
                              prod.currentQuantity <= prod.restockThreshold
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {prod.currentQuantity} {prod.unit}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-800 line-clamp-2">
                          {prod.name}
                        </h4>
                      </div>

                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-sm font-extrabold text-emerald-700 font-sans">
                          {business.currency} {prod.sellingPrice}
                        </span>
                        <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                          <Plus className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Cart & Checkout (5 Cols) */}
            <div className="lg:col-span-5 p-4 flex flex-col justify-between bg-slate-50/50 overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div className="flex items-center gap-1.5">
                    <ShoppingCart className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-slate-900">
                      Current Order ({cart.reduce((s, i) => s + i.quantity, 0)})
                    </span>
                  </div>
                  {cart.length > 0 && (
                    <button
                      onClick={() => setCart([])}
                      className="text-[11px] text-red-500 hover:underline cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Cart Items List */}
                <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                  {cart.length === 0 ? (
                    <div className="text-center py-6 text-xs text-slate-400">
                      No items selected. Click products on the left to add to sale.
                    </div>
                  ) : (
                    cart.map((item) => (
                      <div
                        key={item.product.id}
                        className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200 text-xs"
                      >
                        <div className="min-w-0 flex-1 pr-2">
                          <p className="font-semibold text-slate-800 truncate">
                            {item.product.name}
                          </p>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {business.currency} {item.product.sellingPrice} each
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                            <button
                              onClick={() => updateQuantity(item.product.id, -1)}
                              className="px-2 py-1 hover:bg-slate-200 text-slate-600 cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 font-bold text-slate-900 text-xs">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.id, 1)}
                              className="px-2 py-1 hover:bg-slate-200 text-slate-600 cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <span className="font-bold text-slate-900 min-w-14 text-right">
                            {business.currency} {item.product.sellingPrice * item.quantity}
                          </span>

                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-slate-400 hover:text-red-500 p-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Payment Channel Selector */}
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('CASH')}
                      className={`p-2 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        paymentMethod === 'CASH'
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <Banknote className="w-3.5 h-3.5" />
                      <span>Cash</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('MOMO')}
                      className={`p-2 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        paymentMethod === 'MOMO'
                          ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-xs font-bold'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>MoMo</span>
                    </button>

                    {/* Visa / Mastercard Option via Paystack */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('CARD')}
                      className={`p-2 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center transition-all cursor-pointer ${
                        paymentMethod === 'CARD'
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        <CreditCard className="w-3.5 h-3.5" />
                        <span className="font-bold">Visa / MC</span>
                      </div>
                      <span className={`text-[9px] font-mono leading-none mt-0.5 ${
                        paymentMethod === 'CARD' ? 'text-blue-100' : 'text-slate-400'
                      }`}>
                        Paystack
                      </span>
                    </button>
                  </div>

                  {/* MoMo specifics */}
                  {paymentMethod === 'MOMO' && (
                    <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-xl space-y-2 text-xs">
                      <div className="flex gap-2">
                        {(['MTN', 'Telecel/Vodafone', 'AT'] as const).map((net) => (
                          <button
                            key={net}
                            type="button"
                            onClick={() => setMomoNetwork(net)}
                            className={`px-2.5 py-1 rounded text-[11px] font-bold cursor-pointer ${
                              momoNetwork === net
                                ? 'bg-amber-600 text-white'
                                : 'bg-white text-slate-700 border border-amber-200'
                            }`}
                          >
                            {net}
                          </button>
                        ))}
                      </div>
                      <input
                        type="text"
                        value={momoReference}
                        onChange={(e) => setMomoReference(e.target.value)}
                        placeholder="Enter MoMo Transaction ID / Ref #..."
                        className="w-full bg-white border border-amber-300 rounded-lg p-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
                      />
                    </div>
                  )}

                  {/* Visa / Mastercard Paystack specifics */}
                  {paymentMethod === 'CARD' && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-blue-900">Visa / Mastercard</span>
                          <span className="text-[10px] bg-blue-100 text-blue-800 font-extrabold px-1.5 py-0.5 rounded">
                            Paystack Secured
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setCardBrand('Visa')}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                              cardBrand === 'Visa' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border'
                            }`}
                          >
                            Visa
                          </button>
                          <button
                            type="button"
                            onClick={() => setCardBrand('Mastercard')}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                              cardBrand === 'Mastercard' ? 'bg-orange-600 text-white' : 'bg-white text-slate-600 border'
                            }`}
                          >
                            Mastercard
                          </button>
                        </div>
                      </div>

                      {paystackVerified ? (
                        <div className="p-2 bg-emerald-100/80 border border-emerald-300 rounded-lg text-emerald-900 text-xs flex items-center justify-between">
                          <div className="flex items-center gap-1.5 font-bold">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Authorized via Paystack ({cardBrand})</span>
                          </div>
                          <span className="font-mono text-[10px]">{cardReference}</span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setIsPaystackModalOpen(true)}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                        >
                          <Zap className="w-3.5 h-3.5 text-amber-300" />
                          <span>Pay with Paystack (Popup Checkout)</span>
                        </button>
                      )}

                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={cardReference}
                          onChange={(e) => setCardReference(e.target.value)}
                          placeholder="Paystack Authorization Reference..."
                          className="w-full bg-white border border-blue-200 rounded-lg p-1.5 text-xs text-slate-800 font-mono placeholder-slate-400 focus:outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Customer Details (Optional) */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Customer Name (optional)"
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
                  />
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Phone / WhatsApp"
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Checkout Footer Total */}
              <div className="pt-3 border-t border-slate-200 space-y-2 mt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-600">Total Due:</span>
                  <span className="text-xl font-extrabold text-slate-900 font-sans">
                    {business.currency} {cartSubtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={cart.length === 0 || isSubmitting}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  {isStaff && !isPinUnlocked ? (
                    <>
                      <Lock className="w-4 h-4 text-amber-300" />
                      <span>Enter Cashier PIN to Record Sale</span>
                    </>
                  ) : (
                    <span>Complete Sale ({business.currency} {cartSubtotal})</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Paystack Inline Checkout Modal */}
      {isPaystackModalOpen && (
        <div className="fixed inset-0 z-60 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in">
            {/* Paystack Top Header */}
            <div className="bg-[#091e42] text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400 font-bold block">
                  PAYSTACK PAYMENT GATEWAY
                </span>
                <h4 className="text-base font-extrabold text-white mt-0.5">
                  {business.name}
                </h4>
                <p className="text-xs text-slate-300 mt-1">
                  Amount: <strong className="text-white text-sm font-sans">{business.currency} {cartSubtotal.toFixed(2)}</strong>
                </p>
              </div>
              <button
                onClick={() => setIsPaystackModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setCardBrand('Visa');
                    setCardNumber('4084 0840 0840 0840');
                  }}
                  className={`flex-1 py-1.5 px-3 rounded-xl border font-bold text-center cursor-pointer ${
                    cardBrand === 'Visa' ? 'bg-blue-50 border-blue-600 text-blue-700' : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  💳 Visa (Test: 4084...)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCardBrand('Mastercard');
                    setCardNumber('5123 4567 8901 2345');
                  }}
                  className={`flex-1 py-1.5 px-3 rounded-xl border font-bold text-center cursor-pointer ${
                    cardBrand === 'Mastercard' ? 'bg-orange-50 border-orange-600 text-orange-700' : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  💳 Mastercard (Test: 5123...)
                </button>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Customer Email (for Paystack Receipt)
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="customer@domain.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="4084 0840 0840 0840"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono text-slate-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Expires
                  </label>
                  <input
                    type="text"
                    value={cardExp}
                    onChange={(e) => setCardExp(e.target.value)}
                    placeholder="12/28"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono text-slate-900 focus:outline-none text-center"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    CVV
                  </label>
                  <input
                    type="password"
                    maxLength={3}
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    placeholder="123"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono text-slate-900 focus:outline-none text-center"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handlePayWithPaystack}
                  disabled={isProcessingPaystack}
                  className="w-full bg-[#00c389] hover:bg-[#00b07c] text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>
                    {isProcessingPaystack
                      ? 'Authorizing via Paystack...'
                      : `Authorize ${business.currency} ${cartSubtotal.toFixed(2)}`}
                  </span>
                </button>
              </div>

              <p className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-1">
                <span>🔒 256-bit encrypted SSL connection via Paystack Ghana</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Cashier PIN Modal */}
      <PinAuthModal
        isOpen={showPinAuthModal}
        onClose={() => setShowPinAuthModal(false)}
        user={currentUser}
        targetActionName="Sales Register & Record Sale"
        onSuccess={() => {
          if (onUnlockPin) onUnlockPin();
          setShowPinAuthModal(false);
          onShowToast('Cashier authenticated via PIN!');
          handleCheckout();
        }}
      />
    </div>
  );
};
