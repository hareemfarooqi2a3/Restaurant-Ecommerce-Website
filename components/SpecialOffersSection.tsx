"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const offers = [
  {
    tag: "🔥 Today Only",
    title: "Burger Feast Deal",
    description: "Double Wagyu Burger + Fries + Drink",
    originalPrice: 24.99,
    salePrice: 14.99,
    discount: 40,
    emoji: "🍔",
    bg: "from-orange-950/80 to-zinc-900",
    accent: "#FF9F0D",
    badge: "BESTSELLER",
  },
  {
    tag: "🌙 Weekend Special",
    title: "Chef's Platter",
    description: "Premium grilled meats with 4 sides",
    originalPrice: 49.99,
    salePrice: 34.99,
    discount: 30,
    emoji: "🥩",
    bg: "from-red-950/80 to-zinc-900",
    accent: "#EF4444",
    badge: "LIMITED",
  },
  {
    tag: "🌿 Healthy Pick",
    title: "Wellness Bowl",
    description: "Super-grain bowl with grilled protein & dressing",
    originalPrice: 18.99,
    salePrice: 12.99,
    discount: 32,
    emoji: "🥗",
    bg: "from-emerald-950/80 to-zinc-900",
    accent: "#10B981",
    badge: "POPULAR",
  },
  {
    tag: "🍰 Sweet Ending",
    title: "Dessert Duo",
    description: "Choice of any 2 premium desserts",
    originalPrice: 15.99,
    salePrice: 9.99,
    discount: 38,
    emoji: "🍰",
    bg: "from-pink-950/80 to-zinc-900",
    accent: "#EC4899",
    badge: "NEW",
  },
];

function Countdown() {
  const [time, setTime] = useState({ h: 5, m: 47, s: 30 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => {
        let { h, m, s } = prev;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 23; m = 59; s = 59; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="flex items-center gap-2 text-sm font-mono">
      <span className="text-white/60">Offers end in:</span>
      {[time.h, time.m, time.s].map((val, i) => (
        <span key={i} className="flex items-center gap-1">
          <span className="bg-[#FF9F0D] text-black font-bold px-2 py-0.5 rounded text-xs min-w-[28px] text-center">
            {pad(val)}
          </span>
          {i < 2 && <span className="text-[#FF9F0D] font-bold">:</span>}
        </span>
      ))}
    </div>
  );
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const cardVariants: import("framer-motion").Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

export default function SpecialOffersSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="bg-black py-20 px-4 md:px-[135px] relative overflow-hidden">
      {/* Grid background pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#FF9F0D 1px, transparent 1px), linear-gradient(90deg, #FF9F0D 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Header */}
      <motion.div
        className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div>
          <p className="text-[#FF9F0D] text-lg font-medium tracking-wide mb-2">
            Flash Deals
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-white">
            Today&apos;s <span className="text-[#FF9F0D]">Special Offers</span>
          </h2>
        </div>
        <Countdown />
      </motion.div>

      {/* Cards grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        {offers.map((offer, i) => (
          <motion.div
            key={i}
            className={`relative rounded-2xl bg-gradient-to-b ${offer.bg} border border-white/8 overflow-hidden group cursor-pointer`}
            variants={cardVariants}
            whileHover={{ y: -8, boxShadow: `0 24px 60px ${offer.accent}33` }}
          >
            {/* Badge */}
            <div
              className="absolute top-4 right-4 text-[10px] font-bold px-2 py-1 rounded-full"
              style={{ background: offer.accent, color: "#000" }}
            >
              {offer.badge}
            </div>

            {/* Discount ribbon */}
            <div className="absolute top-4 left-4 bg-black/60 border border-white/10 text-white text-xs font-bold px-2 py-1 rounded-full">
              -{offer.discount}%
            </div>

            <div className="p-6 pt-14">
              {/* Emoji */}
              <motion.div
                className="text-5xl mb-4"
                animate={{ rotate: [0, -6, 6, 0], scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.5, ease: "easeInOut" }}
              >
                {offer.emoji}
              </motion.div>

              {/* Tag */}
              <p className="text-xs font-medium mb-1" style={{ color: offer.accent }}>
                {offer.tag}
              </p>

              {/* Title */}
              <h3 className="text-white font-bold text-lg leading-tight mb-1">
                {offer.title}
              </h3>

              {/* Description */}
              <p className="text-white/50 text-xs mb-4 leading-relaxed">
                {offer.description}
              </p>

              {/* Pricing */}
              <div className="flex items-center gap-3 mb-5">
                <span className="text-2xl font-bold text-white">
                  ${offer.salePrice}
                </span>
                <span className="text-white/30 text-sm line-through">
                  ${offer.originalPrice}
                </span>
              </div>

              {/* CTA */}
              <Link
                href="/Shop"
                className="block w-full text-center text-sm font-bold py-2.5 rounded-xl transition-all duration-200 hover:scale-105"
                style={{ background: offer.accent, color: "#000" }}
              >
                Order Now →
              </Link>
            </div>

            {/* Hover shimmer overlay */}
            <div
              className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: `linear-gradient(135deg, ${offer.accent}10 0%, transparent 60%)`,
              }}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* View all CTA */}
      <motion.div
        className="text-center mt-12"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <Link
          href="/Shop"
          className="inline-flex items-center gap-2 border border-[#FF9F0D]/40 text-[#FF9F0D] hover:bg-[#FF9F0D] hover:text-black font-semibold px-8 py-3 rounded-full transition-all duration-300 hover:scale-105"
        >
          View All Deals <span>→</span>
        </Link>
      </motion.div>
    </section>
  );
}
