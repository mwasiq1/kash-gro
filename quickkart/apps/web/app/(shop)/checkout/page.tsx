"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../../hooks/useCart";
import { MapPin, Receipt, ArrowLeft, Loader2, CheckCircle2, Plus } from "lucide-react";
import { fetchApi } from "../../../lib/api";
import { useAuth } from "@clerk/nextjs";

const DELIVERY_FEE = 25;

interface Address {
  id: string;
  label: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { isMounted, items, cartTotal, clearCart, itemCount } = useCart();
  const { getToken, isLoaded, isSignedIn } = useAuth();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  
  // Form State
  const [label, setLabel] = useState("Home");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [city, setCity] = useState("");
  const [stateForm, setStateForm] = useState("");
  const [pincode, setPincode] = useState("");
  const [isSavingAddress, setIsSavingAddress] = useState(false);

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }
    loadAddresses();
  }, [isLoaded, isSignedIn]);

  async function loadAddresses() {
    try {
      setIsLoadingAddresses(true);
      const token = await getToken();
      const res = await fetchApi("/addresses", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = res.data || [];
      setAddresses(data);
      if (data.length === 0) {
        setShowAddForm(true);
      } else {
        const defaultAddr = data.find((a: Address) => a.isDefault);
        if (defaultAddr) setSelectedAddressId(defaultAddr.id);
        else setSelectedAddressId(data[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingAddresses(false);
    }
  }

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!line1 || !city || !stateForm || !pincode) {
      setError("Please fill all required fields");
      return;
    }
    try {
      setIsSavingAddress(true);
      setError(null);
      const token = await getToken();
      const newAddr = { label, line1, line2, city, state: stateForm, pincode };
      const res = await fetchApi("/addresses", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(newAddr)
      });
      
      const saved = res.data;
      setAddresses([...addresses, saved]);
      setSelectedAddressId(saved.id);
      setShowAddForm(false);
      // reset form
      setLine1(""); setLine2(""); setCity(""); setStateForm(""); setPincode("");
    } catch (err: any) {
      setError(err.message || "Failed to save address");
    } finally {
      setIsSavingAddress(false);
    }
  };

  if (!isMounted || !isLoaded || isLoadingAddresses) {
    return (
      <div className="min-h-screen bg-[#F4F6FA] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#0C831F]" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F4F6FA] flex flex-col items-center justify-center p-6 text-center">
        <Receipt className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-[#1C1C1C] mb-2">Cart is empty</h2>
        <p className="text-sm text-gray-500 mb-6">Add items to proceed to checkout.</p>
        <button onClick={() => router.push("/")} className="bg-[#0C831F] text-white px-6 py-3 rounded-xl font-bold active:scale-95 transition">
          Go Shopping
        </button>
      </div>
    );
  }

  const grandTotal = cartTotal + DELIVERY_FEE;

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      setError("Please select a delivery address");
      return;
    }

    try {
      setIsPlacingOrder(true);
      setError(null);
      const token = await getToken();

      const orderPayload = {
        addressId: selectedAddressId,
        items: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      };

      const res = await fetchApi("/orders", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(orderPayload),
      });

      clearCart();
      router.push(`/orders?success=${res.orderId}`);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6FA] pb-28">
      <header className="bg-white sticky top-0 z-40 shadow-sm px-4 py-3 flex items-center gap-3">
        <button onClick={() => router.back()} className="p-1 -ml-1 hover:bg-gray-100 rounded-full transition">
          <ArrowLeft className="w-6 h-6 text-[#1C1C1C]" />
        </button>
        <h1 className="text-lg font-extrabold text-[#1C1C1C]">Checkout</h1>
      </header>

      <main className="max-w-2xl mx-auto p-4 space-y-4">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium border border-red-100">
            {error}
          </div>
        )}

        {/* Address Section */}
        <section className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-[#0C831F]" />
            <h2 className="font-bold text-[#1C1C1C]">Delivery Address</h2>
          </div>

          {!showAddForm && addresses.length > 0 && (
            <div className="space-y-3 mb-4">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  onClick={() => setSelectedAddressId(addr.id)}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition flex items-start gap-3 ${
                    selectedAddressId === addr.id ? "border-[#F8C200] bg-yellow-50/30" : "border-gray-100 hover:border-gray-200"
                  }`}
                >
                  <div className="mt-0.5">
                    {selectedAddressId === addr.id ? (
                      <CheckCircle2 className="w-5 h-5 text-[#F8C200]" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${addr.isDefault ? "bg-[#F8C200] text-black" : "bg-gray-100 text-gray-600"}`}>
                        {addr.label}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-[#1C1C1C]">{addr.line1} {addr.line2}</p>
                    <p className="text-xs text-gray-500">{addr.city}, {addr.state} - {addr.pincode}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 text-[#0C831F] font-bold text-sm"
            >
              <Plus className="w-4 h-4" /> Add New Address
            </button>
          )}

          {showAddForm && (
            <form onSubmit={handleSaveAddress} className="bg-[#F4F6FA] p-4 rounded-xl space-y-3">
              <h3 className="font-bold text-sm text-[#1C1C1C] mb-2">Add New Address</h3>
              <div>
                <select value={label} onChange={(e) => setLabel(e.target.value)} className="w-full p-2.5 rounded-lg text-sm border-gray-200 outline-none">
                  <option value="Home">Home</option>
                  <option value="Work">Work</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <input type="text" placeholder="Line 1 (Required)" value={line1} onChange={(e) => setLine1(e.target.value)} required className="w-full p-2.5 rounded-lg text-sm outline-none" />
              </div>
              <div>
                <input type="text" placeholder="Line 2 (Optional)" value={line2} onChange={(e) => setLine2(e.target.value)} className="w-full p-2.5 rounded-lg text-sm outline-none" />
              </div>
              <div className="flex gap-2">
                <input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} required className="w-1/2 p-2.5 rounded-lg text-sm outline-none" />
                <input type="text" placeholder="State" value={stateForm} onChange={(e) => setStateForm(e.target.value)} required className="w-1/2 p-2.5 rounded-lg text-sm outline-none" />
              </div>
              <div>
                <input type="text" placeholder="Pincode" value={pincode} onChange={(e) => setPincode(e.target.value)} required pattern="\d{6}" maxLength={6} className="w-full p-2.5 rounded-lg text-sm outline-none" />
              </div>
              <div className="flex gap-2 pt-2">
                {addresses.length > 0 && (
                  <button type="button" onClick={() => setShowAddForm(false)} className="flex-1 bg-white border border-gray-200 text-[#1C1C1C] font-bold py-2.5 rounded-lg text-sm">
                    Cancel
                  </button>
                )}
                <button type="submit" disabled={isSavingAddress} className="flex-1 bg-[#0C831F] text-white font-bold py-2.5 rounded-lg text-sm disabled:opacity-70 flex items-center justify-center">
                  {isSavingAddress ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
                </button>
              </div>
            </form>
          )}
        </section>

        {/* Cart Review */}
        <section className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
          <h2 className="font-bold text-[#1C1C1C] mb-3">Items ({itemCount})</h2>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#F4F6FA] rounded-lg p-1 flex-shrink-0">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1C1C1C] line-clamp-1">{item.name}</p>
                    <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                  </div>
                </div>
                <p className="text-sm font-bold text-[#1C1C1C]">₹{(item.sellingPrice * item.quantity).toFixed(0)}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Order Summary */}
        <section className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
          <div className="flex items-center gap-2 mb-3">
            <Receipt className="w-5 h-5 text-[#1C1C1C]" />
            <h2 className="font-bold text-[#1C1C1C]">Bill Details</h2>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Items total</span>
              <span className="font-semibold text-[#1C1C1C]">₹{cartTotal.toFixed(0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Delivery fee</span>
              <span className="font-semibold text-[#1C1C1C]">₹{DELIVERY_FEE.toFixed(0)}</span>
            </div>
            <div className="border-t pt-2 mt-2 flex justify-between">
              <span className="font-extrabold text-[#1C1C1C]">Grand Total</span>
              <span className="font-extrabold text-[#1C1C1C] text-lg">₹{grandTotal.toFixed(0)}</span>
            </div>
          </div>
        </section>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 z-50">
        <button
          onClick={handlePlaceOrder}
          disabled={isPlacingOrder || !selectedAddressId}
          className="w-full max-w-lg mx-auto bg-[#0C831F] text-white flex items-center justify-between px-5 py-4 rounded-xl font-bold text-base active:scale-[0.98] transition disabled:opacity-70"
        >
          <span>₹{grandTotal.toFixed(0)}</span>
          <div className="flex items-center gap-2">
            {isPlacingOrder ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Place Order <ArrowRight className="w-5 h-5" /></>}
          </div>
        </button>
      </div>
    </div>
  );
}

function ArrowRight(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
  );
}
