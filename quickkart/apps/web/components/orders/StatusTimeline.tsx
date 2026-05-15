"use client";

import { CheckCircle2, Circle } from "lucide-react";
import { OrderStatus } from "@prisma/client";

const steps = [
  { status: "PLACED", label: "Order Placed", desc: "We've received your order" },
  { status: "PROCESSING", label: "Processing", desc: "Store is packing your items" },
  { status: "OUT_FOR_DELIVERY", label: "Out for Delivery", desc: "Rider is on the way" },
  { status: "DELIVERED", label: "Delivered", desc: "Enjoy your items!" },
];

interface StatusTimelineProps {
  currentStatus: OrderStatus;
  cancelledAt?: Date | string | null;
}

export default function StatusTimeline({ currentStatus, cancelledAt }: StatusTimelineProps) {
  if (currentStatus === "CANCELLED") {
    return (
      <div className="bg-red-50 border border-red-100 p-6 rounded-2xl flex items-center gap-4">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
          <CheckCircle2 className="w-6 h-6 text-red-600" />
        </div>
        <div>
          <h4 className="font-black text-red-600">Order Cancelled</h4>
          <p className="text-sm text-red-500 font-medium">
            This order was cancelled on {new Date(cancelledAt!).toLocaleDateString()}
          </p>
        </div>
      </div>
    );
  }

  const currentStepIndex = steps.findIndex(s => s.status === currentStatus);

  return (
    <div className="space-y-8">
      {steps.map((step, index) => {
        const isCompleted = index <= currentStepIndex;
        const isCurrent = index === currentStepIndex;
        const isLast = index === steps.length - 1;

        return (
          <div key={step.status} className="relative flex gap-4 group">
            {!isLast && (
              <div 
                className={`absolute left-3 top-8 w-0.5 h-12 -ml-[1px] ${
                  isCompleted && index < currentStepIndex ? "bg-[#0C831F]" : "bg-gray-100"
                }`} 
              />
            )}
            
            <div className="relative z-10">
              {isCompleted ? (
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isCurrent ? "bg-[#0C831F] ring-4 ring-[#EBF9EE]" : "bg-[#0C831F]"}`}>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full bg-white border-2 border-gray-100 flex items-center justify-center">
                  <Circle className="w-3 h-3 text-gray-200 fill-current" />
                </div>
              )}
            </div>

            <div className="-mt-1">
              <h4 className={`text-sm font-black ${isCompleted ? "text-[#1C1C1C]" : "text-gray-400"}`}>
                {step.label}
              </h4>
              <p className={`text-xs font-medium mt-0.5 ${isCompleted ? "text-gray-500" : "text-gray-300"}`}>
                {step.desc}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
