"use client";

import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Banner {
  id: string;
  imageUrl: string;
  linkUrl?: string | null;
}

// Hardcoded vibrant banners since our seed uses placeholders
const FALLBACK_BANNERS = [
  {
    id: "1",
    gradient: "from-[#F8C200] to-[#FF6B00]",
    title: "Mega Grocery Sale",
    subtitle: "Up to 50% off on fresh produce",
    emoji: "🛒",
  },
  {
    id: "2",
    gradient: "from-[#0C831F] to-[#34D058]",
    title: "Fresh Daily",
    subtitle: "Farm-fresh vegetables at your door",
    emoji: "🥦",
  },
  {
    id: "3",
    gradient: "from-[#6C63FF] to-[#3B82F6]",
    title: "10-Min Delivery",
    subtitle: "Order now, get it lightning fast",
    emoji: "⚡",
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % FALLBACK_BANNERS.length);
    }, 3500);
  };

  useEffect(() => {
    resetTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const prev = () => {
    setCurrent((c) => (c - 1 + FALLBACK_BANNERS.length) % FALLBACK_BANNERS.length);
    resetTimer();
  };

  const next = () => {
    setCurrent((c) => (c + 1) % FALLBACK_BANNERS.length);
    resetTimer();
  };

  return (
    <div className="relative mx-4 mt-3 rounded-2xl overflow-hidden h-36 shadow-sm">
      {FALLBACK_BANNERS.map((banner, i) => (
        <div
          key={banner.id}
          className={`absolute inset-0 bg-gradient-to-r ${banner.gradient} flex items-center px-6 transition-opacity duration-500 ${
            i === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <div className="flex-1">
            <p className="text-white/80 text-xs font-semibold uppercase tracking-wider mb-1">
              KashGro Deals
            </p>
            <h3 className="text-white text-xl font-extrabold leading-tight">{banner.title}</h3>
            <p className="text-white/80 text-sm mt-0.5">{banner.subtitle}</p>
          </div>
          <div className="text-6xl ml-4 select-none">{banner.emoji}</div>
        </div>
      ))}

      {/* Controls */}
      <button
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 rounded-full p-1 transition"
      >
        <ChevronLeft className="w-4 h-4 text-white" />
      </button>
      <button
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 rounded-full p-1 transition"
      >
        <ChevronRight className="w-4 h-4 text-white" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
        {FALLBACK_BANNERS.map((_, i) => (
          <button
            key={i}
            onClick={() => { setCurrent(i); resetTimer(); }}
            className={`rounded-full transition-all duration-300 ${
              i === current ? "w-5 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
