"use client";

import { useState, useEffect } from "react";
import { MapPin, Plus, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import AddressForm from "./AddressForm";
import { AddressInput } from "@quickkart/shared";
import { fetchApi } from "../../lib/api";
import { useAuth } from "../../hooks/useAuth";

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
  const [error, setError] = useState<string | null>(null);

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

  const handleAddAddress = async (data: AddressInput) => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      const response = await fetchApi("/addresses", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...data, isDefault: addresses.length === 0 }),
      });
      if (response.success) {
        await loadAddresses();
        setShowAddForm(false);
        onSelect(response.data.id);
      } else {
        setError(response.error || "Failed to add address");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
      console.error("Failed to add address", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && addresses.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 bg-white rounded-2xl border border-[#E8E8E8] shadow-sm">
        <Loader2 className="w-6 h-6 text-[#F8C200] animate-spin" />
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
            className="text-[#F8C200] text-sm font-bold flex items-center gap-1 hover:underline"
          >
            <Plus className="w-4 h-4" /> Add New
          </button>
        )}
      </div>

      {showAddForm ? (
        <div className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-100 p-4 rounded-xl text-red-600 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
          <AddressForm 
            onSubmit={handleAddAddress} 
            onCancel={() => setShowAddForm(false)} 
            isLoading={loading}
          />
        </div>
      ) : addresses.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-dashed border-[#E8E8E8] flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <MapPin className="w-8 h-8 text-gray-300" />
          </div>
          <h4 className="font-bold text-[#1C1C1C] mb-1">No addresses saved</h4>
          <p className="text-sm text-[#666666] mb-6 max-w-[240px]">Please add a delivery address to proceed with your order.</p>
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
                  ? "border-[#F8C200] bg-yellow-50 shadow-md scale-[1.02] ring-2 ring-[#F8C200] ring-opacity-20"
                  : "border-[#E8E8E8] bg-white hover:border-[#E8E8E8] hover:shadow-sm"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-md tracking-wider ${
                    selectedId === addr.id ? "bg-[#F8C200] text-[#1C1C1C]" : "bg-gray-100 text-[#666666]"
                  }`}>
                    {addr.label}
                  </span>
                  {addr.isDefault && (
                    <span className="text-[10px] text-[#999999] font-bold uppercase tracking-widest">Default</span>
                  )}
                </div>
                {selectedId === addr.id && (
                  <CheckCircle2 className="w-5 h-5 text-[#F8C200]" />
                )}
              </div>
              <p className="text-sm font-bold text-[#1C1C1C] line-clamp-1">{addr.line1}</p>
              <p className="text-xs text-[#666666] mt-1">
                {addr.city}, {addr.pincode}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
