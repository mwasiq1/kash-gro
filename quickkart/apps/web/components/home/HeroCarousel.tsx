"use client";

import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { fetchApi } from "../../lib/api";

interface Banner {
  id: string;
  imageUrl: string;
  title: string;
  linkUrl?: string | null;
  gradient?: string;
  subtitle?: string;
  emoji?: string;
}

// Hardcoded vibrant banners fallback
const FALLBACK_BANNERS: Banner[] = [
  {
    id: "1",
    imageUrl: "",
    gradient: "from-[#F8C200] to-[#FF6B00]",
    title: "Mega Grocery Sale",
    subtitle: "Up to 50% off on fresh produce",
    emoji: "🛒",
  },
  {
    id: "2",
    imageUrl: "",
    gradient: "from-[#F8C200] to-[#E6B400]",
    title: "Fresh Daily Deals",
    subtitle: "Farm-fresh vegetables at your door",
    emoji: "🥦",
  },
  {
    id: "3",
    imageUrl: "",
    gradient: "from-[#6C63FF] to-[#3B82F6]",
    title: "10-Min Delivery",
    subtitle: "Order now, get it lightning fast",
    emoji: "⚡",
  },
];

export default function HeroCarousel() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const activeBanners = banners.length > 0 ? banners : FALLBACK_BANNERS;

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % activeBanners.length);
    }, 3500);
  };

  useEffect(() => {
    async function loadBanners() {
      try {
        const response = await fetchApi("/banners");
        if (response.success && response.data && response.data.length > 0) {
          setBanners(response.data);
        }
      } catch (error) {
        console.error("Failed to load banners:", error);
      }
    }
    loadBanners();
  }, []);

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeBanners.length]);

  const prev = () => {
    setCurrent((c) => (c - 1 + activeBanners.length) % activeBanners.length);
    resetTimer();
  };

  const next = () => {
    setCurrent((c) => (c + 1) % activeBanners.length);
    resetTimer();
  };

  return (
    <div className="relative mx-4 mt-3 rounded-2xl overflow-hidden h-36 shadow-sm">
      {activeBanners.map((banner, i) => {
        const hasImage = banner.imageUrl && !banner.imageUrl.includes("placeholder");

        return (
          <div
            key={banner.id}
            className={`absolute inset-0 flex items-center px-6 transition-opacity duration-500 ${
              i === current ? "opacity-100 z-10" : "opacity-0 z-0"
            } ${!hasImage ? `bg-gradient-to-r ${banner.gradient || "from-[#F8C200] to-[#E6B400]"}` : ""}`}
          >
            {hasImage && (
              <>
                <Image
                  src={banner.imageUrl}
                  alt={banner.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 800px"
                  priority={i === 0}
                />
                <div className="absolute inset-0 bg-black/20" />
              </>
            )}

            <div className="flex-1 relative z-10">
              <p className="text-white/80 text-xs font-semibold uppercase tracking-wider mb-1">
                KashGro Deals
              </p>
              <h3 className="text-white text-xl font-extrabold leading-tight">{banner.title}</h3>
              {banner.subtitle && (
                <p className="text-white/80 text-sm mt-0.5 font-bold">{banner.subtitle}</p>
              )}
            </div>
            {banner.emoji && (
              <div className="text-6xl ml-4 select-none relative z-10">{banner.emoji}</div>
            )}
          </div>
        );
      })}

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
        {activeBanners.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setCurrent(i);
              resetTimer();
            }}
            className={`rounded-full transition-all duration-300 ${
              i === current ? "w-5 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
