"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addressSchema, AddressInput } from "@quickkart/shared";
import { Loader2 } from "lucide-react";

interface AddressFormProps {
  onSubmit: (data: AddressInput) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  defaultValues?: Partial<AddressInput>;
}

export default function AddressForm({ onSubmit, onCancel, isLoading, defaultValues }: AddressFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressInput>({
    resolver: zodResolver(addressSchema) as any,
    defaultValues: {
      label: "Home",
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-2xl border-2 border-[#0C831F] space-y-4 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Label (e.g. Home, Office)</label>
          <input
            {...register("label")}
            className={`w-full px-4 py-3 rounded-xl bg-gray-50 border ${errors.label ? 'border-red-500' : 'border-gray-200'} focus:border-[#0C831F] focus:ring-1 focus:ring-[#0C831F] outline-none font-medium transition-all`}
            placeholder="Home"
          />
          {errors.label && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase">{errors.label.message}</p>}
        </div>

        <div className="col-span-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Address Line 1</label>
          <input
            {...register("line1")}
            className={`w-full px-4 py-3 rounded-xl bg-gray-50 border ${errors.line1 ? 'border-red-500' : 'border-gray-200'} focus:border-[#0C831F] focus:ring-1 focus:ring-[#0C831F] outline-none font-medium transition-all`}
            placeholder="Flat No, Building, Street"
          />
          {errors.line1 && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase">{errors.line1.message}</p>}
        </div>

        <div className="col-span-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Address Line 2 (Optional)</label>
          <input
            {...register("line2")}
            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#0C831F] focus:ring-1 focus:ring-[#0C831F] outline-none font-medium transition-all"
            placeholder="Landmark, Area"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">City</label>
          <input
            {...register("city")}
            className={`w-full px-4 py-3 rounded-xl bg-gray-50 border ${errors.city ? 'border-red-500' : 'border-gray-200'} focus:border-[#0C831F] focus:ring-1 focus:ring-[#0C831F] outline-none font-medium transition-all`}
            placeholder="Mumbai"
          />
          {errors.city && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase">{errors.city.message}</p>}
        </div>

        <div>
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">State</label>
          <input
            {...register("state")}
            className={`w-full px-4 py-3 rounded-xl bg-gray-50 border ${errors.state ? 'border-red-500' : 'border-gray-200'} focus:border-[#0C831F] focus:ring-1 focus:ring-[#0C831F] outline-none font-medium transition-all`}
            placeholder="Maharashtra"
          />
          {errors.state && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase">{errors.state.message}</p>}
        </div>

        <div className="col-span-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Pincode (6 digits)</label>
          <input
            {...register("pincode")}
            className={`w-full px-4 py-3 rounded-xl bg-gray-50 border ${errors.pincode ? 'border-red-500' : 'border-gray-200'} focus:border-[#0C831F] focus:ring-1 focus:ring-[#0C831F] outline-none font-medium transition-all`}
            placeholder="400001"
            maxLength={6}
            type="tel"
            inputMode="numeric"
          />
          {errors.pincode && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase">{errors.pincode.message}</p>}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-[#0C831F] text-white font-black py-4 rounded-xl hover:bg-[#096618] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Address"
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-6 py-4 border-2 border-gray-100 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-all disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
