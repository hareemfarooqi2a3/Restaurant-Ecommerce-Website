"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const FEATURES = [
  { icon: "🌿", text: "Fresh ingredients, cooked on-demand for every order." },
  { icon: "⚡", text: "Fast delivery with live order tracking and real-time updates." },
  { icon: "🎨", text: "Customizable meals to match your cravings and dietary needs." },
];

const IMAGE_DELAYS = [0, 0.12, 0.24];

export default function AboutUs() {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="bg-black px-5 md:px-10 lg:pl-[80px] lg:pr-[60px] xl:pl-[130px] xl:pr-[80px] py-16 relative overflow-hidden"
    >
      {/* Background accent */}
      <div
        className="pointer-events-none absolute -left-40 top-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-3xl opacity-10"
        style={{ background: "radial-gradient(circle, #FF9F0D, transparent)" }}
      />

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mx-auto max-w-[1200px] gap-12">

        {/* ── Text ── */}
        <motion.div
          className="text-white lg:w-[48%]"
          initial={{ opacity: 0, x: -30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Tag */}
          <div className="inline-flex items-center gap-2 bg-[#FF9F0D]/10 border border-[#FF9F0D]/25 rounded-full px-4 py-1.5 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF9F0D] animate-pulse" />
            <span className="text-[#FF9F0D] text-sm font-medium tracking-wide">About Us</span>
          </div>

          <h2 className="text-[22px] md:text-[32px] lg:text-[40px] font-bold leading-tight mb-5">
            <span className="text-[#FF9F0D]">We</span>{" "}
            <span className="text-white">Create the Best</span>
            <br />
            <span className="text-white">Foody Products</span>
          </h2>

          <p className="text-white/65 text-sm md:text-base leading-relaxed mb-8">
            FoodTuck delivers customized &amp; international cuisine — freshly prepared,
            carefully packed, and delivered fast. From quick lunches to family dinners,
            we focus on quality ingredients, consistent taste, and a smooth ordering experience.
          </p>

          {/* Feature list */}
          <ul className="space-y-4 mb-8">
            {FEATURES.map((feat, i) => (
              <motion.li
                key={i}
                className="flex items-start gap-3 text-sm text-white/75"
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="text-lg flex-shrink-0 mt-0.5">{feat.icon}</span>
                <span>{feat.text}</span>
              </motion.li>
            ))}
          </ul>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.55, duration: 0.5 }}
          >
            <Link
              href="/About"
              className="inline-flex items-center gap-2 bg-[#FF9F0D] text-black font-bold px-6 py-3 rounded-full hover:scale-105 hover:shadow-[0_0_30px_rgba(255,159,13,0.35)] transition-all duration-300"
            >
              Learn More →
            </Link>
          </motion.div>
        </motion.div>

        {/* ── Images ── */}
        <div className="flex flex-col lg:w-[48%] justify-center items-center gap-4">
          <motion.div
            className="relative w-full max-w-[420px] h-[200px] md:h-[250px] rounded-2xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.92, x: 30 }}
            animate={inView ? { opacity: 1, scale: 1, x: 0 } : {}}
            transition={{ duration: 0.65, delay: IMAGE_DELAYS[0], ease: "easeOut" }}
          >
            <Image
              src="/foodpic1.png"
              alt="Signature dish 1"
              fill
              className="object-cover hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </motion.div>

          <div className="flex flex-col md:flex-row gap-4 w-full max-w-[420px]">
            {["/foodpic2.png", "/foodpic3.png"].map((src, i) => (
              <motion.div
                key={i}
                className="relative w-full h-[150px] md:h-[180px] rounded-xl overflow-hidden"
                initial={{ opacity: 0, scale: 0.92, x: 30 }}
                animate={inView ? { opacity: 1, scale: 1, x: 0 } : {}}
                transition={{ duration: 0.65, delay: IMAGE_DELAYS[i + 1], ease: "easeOut" }}
              >
                <Image
                  src={src}
                  alt={`Dish ${i + 2}`}
                  fill
                  className="object-cover hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
