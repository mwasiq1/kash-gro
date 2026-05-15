"use client";

import { useState, useEffect } from "react";
import { MapPin, Plus, Loader2, CheckCircle2 } from "lucide-react";
import { fetchApi } from "../../lib/api";
import { useAuth } from "@clerk/nextjs";

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

interface AddressSelectorProps {
  onSelect: (addressId: string) => void;
  selectedId: string | null;
}

export default function AddressSelector({ onSelect, selectedId }: AddressSelectorProps) {
  const { getToken } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: "Home",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
  });

  const loadAddresses = async () => {
    try {
      const token = await getToken();
      const response = await fetchApi("/addresses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.success) {
        setAddresses(response.data);
        if (response.data.length > 0 && !selectedId) {
          const defaultAddr = response.data.find((a: Address) => a.isDefault) || response.data[0];
          onSelect(defaultAddr.id);
        }
      }
    } catch (err) {
      console.error("Failed to load addresses", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = await getToken();
      const response = await fetchApi("/addresses", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...newAddress, isDefault: addresses.length === 0 }),
      });
      if (response.success) {
        await loadAddresses();
        setShowAddForm(false);
        onSelect(response.data.id);
      }
    } catch (err) {
      console.error("Failed to add address", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && addresses.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 bg-white rounded-2xl border border-gray-100 shadow-sm">
        <Loader2 className="w-6 h-6 text-[#0C831F] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-black text-[#1C1C1C]">Delivery Address</h3>
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="text-[#0C831F] text-sm font-bold flex items-center gap-1 hover:underline"
          >
            <Plus className="w-4 h-4" /> Add New
          </button>
        )}
      </div>

      {showAddForm ? (
        <form onSubmit={handleAddAddress} className="bg-white p-6 rounded-2xl border-2 border-[#0C831F] space-y-4 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Label (e.g. Home, Office)</label>
              <input
                required
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#0C831F] focus:ring-1 focus:ring-[#0C831F] outline-none font-medium transition-all"
                value={newAddress.label}
                onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
              />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Address Line 1</label>
              <input
                required
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#0C831F] focus:ring-1 focus:ring-[#0C831F] outline-none font-medium transition-all"
                value={newAddress.line1}
                onChange={(e) => setNewAddress({ ...newAddress, line1: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">City</label>
              <input
                required
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#0C831F] focus:ring-1 focus:ring-[#0C831F] outline-none font-medium transition-all"
                value={newAddress.city}
                onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Pincode</label>
              <input
                required
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#0C831F] focus:ring-1 focus:ring-[#0C831F] outline-none font-medium transition-all"
                value={newAddress.pincode}
                onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
              />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#0C831F] text-white font-black py-4 rounded-xl hover:bg-[#096618] transition-all disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Address"}
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-6 py-4 border-2 border-gray-100 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : addresses.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <MapPin className="w-8 h-8 text-gray-300" />
          </div>
          <h4 className="font-bold text-[#1C1C1C] mb-1">No addresses saved</h4>
          <p className="text-sm text-gray-500 mb-6 max-w-[240px]">Please add a delivery address to proceed with your order.</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-[#1C1C1C] text-white font-black px-8 py-3.5 rounded-xl hover:bg-black transition-all active:scale-95"
          >
            Add Address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              onClick={() => onSelect(addr.id)}
              className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 group ${
                selectedId === addr.id
                  ? "border-[#0C831F] bg-[#F8FFF9] shadow-md scale-[1.02] ring-2 ring-[#0C831F] ring-opacity-20"
                  : "border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-md tracking-wider ${
                    selectedId === addr.id ? "bg-[#0C831F] text-white" : "bg-gray-100 text-gray-500"
                  }`}>
                    {addr.label}
                  </span>
                  {addr.isDefault && (
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Default</span>
                  )}
                </div>
                {selectedId === addr.id && (
                  <CheckCircle2 className="w-5 h-5 text-[#0C831F]" />
                )}
              </div>
              <p className="text-sm font-bold text-[#1C1C1C] line-clamp-1">{addr.line1}</p>
              <p className="text-xs text-gray-500 mt-1">
                {addr.city}, {addr.pincode}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
