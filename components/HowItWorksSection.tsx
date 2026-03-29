"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    emoji: "🛒",
    title: "Browse & Order",
    description:
      "Explore our international menu, customize your meal, and add favourites to your cart in seconds.",
    color: "from-orange-500/20 to-orange-500/5",
    border: "border-orange-500/30",
    glow: "rgba(255,159,13,0.25)",
  },
  {
    number: "02",
    emoji: "👨‍🍳",
    title: "Freshly Prepared",
    description:
      "Our expert chefs craft your order on-demand using premium ingredients — no pre-made shortcuts.",
    color: "from-amber-400/20 to-amber-400/5",
    border: "border-amber-400/30",
    glow: "rgba(251,191,36,0.25)",
  },
  {
    number: "03",
    emoji: "🏍️",
    title: "Fast Delivery",
    description:
      "Our riders pick up your hot meal and deliver it straight to your door — tracked in real time.",
    color: "from-red-500/20 to-red-500/5",
    border: "border-red-500/30",
    glow: "rgba(239,68,68,0.25)",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18 } },
};

const cardVariants: import("framer-motion").Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.94 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function HowItWorksSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="bg-black py-20 px-4 md:px-[135px] relative overflow-hidden">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-[#FF9F0D]/30 to-transparent" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-[#FF9F0D]/20 to-transparent" />
      </div>

      {/* Section header */}
      <motion.div
        className="text-center mb-14"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="text-[#FF9F0D] text-lg font-medium tracking-wide mb-2">
          Simple & Fast
        </p>
        <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
          How <span className="text-[#FF9F0D]">It Works</span>
        </h2>
        <p className="text-white/60 mt-4 text-base md:text-lg max-w-xl mx-auto">
          From craving to doorstep in three effortless steps.
        </p>
      </motion.div>

      {/* Steps */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-8 relative"
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        {/* Connector lines (desktop only) */}
        <div className="hidden md:flex absolute top-[72px] left-[33%] right-[33%] items-center pointer-events-none">
          <motion.div
            className="h-[2px] w-full"
            style={{
              background:
                "linear-gradient(90deg, #FF9F0D 0%, rgba(255,159,13,0.3) 50%, #FF9F0D 100%)",
            }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={inView ? { scaleX: 1, opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          />
        </div>

        {steps.map((step, i) => (
          <motion.div
            key={i}
            className={`relative rounded-2xl border bg-gradient-to-b ${step.color} ${step.border} p-8 flex flex-col items-center text-center card-lift group`}
            variants={cardVariants}
            style={{ boxShadow: `0 0 0 0 ${step.glow}` }}
            whileHover={{
              boxShadow: `0 20px 60px ${step.glow}`,
              borderColor: step.glow,
            }}
          >
            {/* Step number badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#FF9F0D] text-black text-xs font-bold px-3 py-1 rounded-full">
              Step {step.number}
            </div>

            {/* Emoji icon */}
            <motion.div
              className="text-6xl mb-5 mt-3"
              animate={{ rotate: [0, -8, 8, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.6, ease: "easeInOut" }}
            >
              {step.emoji}
            </motion.div>

            <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
            <p className="text-white/60 text-sm leading-relaxed">{step.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
