"use client";
import React from "react";

type ShippingRateDetail = {
  id: string;
  provider: string;
  service?: string;
  amount: number;
  duration?: string;
  logo?: string;
};

interface ShippingRatesProps {
  shippingAddress: { zip?: string; country?: string };
  cartItems: unknown[];
  onSelectShipping: (id: string | null) => void;
  selectedShippingId: string | null;
  shippingOptionsFromParent: ShippingRateDetail[];
  loading: boolean;
  error: string | null;
}

// Maps API ids to human-friendly labels and icons (restaurant delivery — no couriers)
const DELIVERY_META: Record<string, { label: string; icon: string; detail: string }> = {
  standard_delivery: {
    label: "Standard Delivery",
    icon: "🏍️",
    detail: "Our own delivery riders · 45–60 min",
  },
  express_delivery: {
    label: "Express Delivery",
    icon: "⚡",
    detail: "Priority dispatch · 20–30 min",
  },
  scheduled_delivery: {
    label: "Scheduled Delivery",
    icon: "🗓️",
    detail: "Choose your preferred time slot",
  },
  pickup: {
    label: "Self Pickup",
    icon: "🏠",
    detail: "Collect from our restaurant · Free",
  },
};

export default function ShippingRates({
  onSelectShipping,
  selectedShippingId,
  shippingOptionsFromParent,
  loading,
  error,
}: ShippingRatesProps) {
  const handleSelectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSelectShipping(e.target.value);
  };

  return (
    <div className="my-2">
      {/* Loading */}
      {loading && (
        <div className="flex items-center gap-2 text-gray-100 py-4">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-400" />
          <span>Loading delivery options...</span>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="p-3 bg-red-900/40 border border-red-500/30 text-red-300 rounded-md text-sm">
          <p><strong>Error:</strong> {error}</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && shippingOptionsFromParent.length === 0 && (
        <p className="text-gray-300 py-4 text-sm">
          Please enter your ZIP/Postal code and Country above to see delivery options.
        </p>
      )}

      {/* Options */}
      {!loading && !error && shippingOptionsFromParent.length > 0 && (
        <div className="space-y-3">
          {shippingOptionsFromParent.map((option) => {
            const meta = DELIVERY_META[option.id];
            const isSelected = selectedShippingId === option.id;

            return (
              <label
                key={option.id}
                className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? "border-orange-500 bg-orange-500/10 ring-1 ring-orange-500"
                    : "border-gray-600 hover:border-orange-400/50 hover:bg-white/5"
                }`}
              >
                {/* Radio */}
                <input
                  type="radio"
                  name="shippingOption"
                  value={option.id}
                  checked={isSelected}
                  onChange={handleSelectionChange}
                  className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-500 accent-orange-500"
                />

                {/* Icon */}
                <span className="text-2xl flex-shrink-0">
                  {meta?.icon ?? "🚗"}
                </span>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white text-sm">
                    {meta?.label ?? option.provider}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {meta?.detail ?? option.service}
                  </p>
                </div>

                {/* Price */}
                <p className="font-bold text-white flex-shrink-0">
                  {option.amount === 0 ? (
                    <span className="text-green-400">FREE</span>
                  ) : (
                    `$${option.amount.toFixed(2)}`
                  )}
                </p>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}
