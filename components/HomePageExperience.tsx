"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export const ExperienceItem = [
  { src: "/cap.png",    rawValue: 420,  suffix: "+", label: "Professional Chefs"   },
  { src: "/burger.png", rawValue: 320,  suffix: "+", label: "Menu Items"            },
  { src: "/spoon.png",  rawValue: 30,   suffix: "+", label: "Years of Experience"   },
  { src: "/pizza.png",  rawValue: 12500,suffix: "+", label: "Happy Customers"       },
];

function useCounter(target: number, duration: number, inView: boolean) {
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // cubic ease-out
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, target, duration]);

  return count;
}

function CounterItem({
  item,
  inView,
  index,
}: {
  item: typeof ExperienceItem[0];
  inView: boolean;
  index: number;
}) {
  const count = useCounter(item.rawValue, 2000, inView);

  return (
    <motion.div
      className="flex flex-col justify-center items-center space-y-3 py-6 group"
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.6,
        delay: index * 0.15,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {/* Icon with hover float */}
      <motion.div
        className="mb-1"
        animate={{ y: [0, -8, 0] }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          delay: index * 0.5,
          ease: "easeInOut",
        }}
      >
        <Image
          src={item.src}
          alt={item.label}
          width={80}
          height={80}
          className="sm:w-[90px] sm:h-[90px] lg:w-[110px] lg:h-[110px] drop-shadow-lg"
        />
      </motion.div>

      {/* Animated counter */}
      <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
        {count.toLocaleString()}
        <span className="text-[#FF9F0D]">{item.suffix}</span>
      </h3>

      {/* Label */}
      <p className="text-xs sm:text-sm lg:text-base font-medium text-white/70 px-2 text-center">
        {item.label}
      </p>

      {/* Underline accent */}
      <motion.div
        className="h-0.5 bg-[#FF9F0D] rounded-full"
        initial={{ width: 0 }}
        animate={inView ? { width: 40 } : { width: 0 }}
        transition={{ duration: 0.5, delay: 0.4 + index * 0.15 }}
      />
    </motion.div>
  );
}

export default function Experience() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
<<<<<<< Updated upstream
      className="relative h-[469px] w-full bg-cover bg-center bg-[url('/experience-background.png')]"
=======
      ref={ref}
      className="relative min-h-[400px] sm:h-[480px] w-full bg-cover bg-center bg-[url('/experience-background.png')]"
>>>>>>> Stashed changes
    >
      {/* Dark overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/80 to-black/90" />

      {/* Top golden line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FF9F0D]/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FF9F0D]/40 to-transparent" />

      {/* Content */}
<<<<<<< Updated upstream
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full text-center">
          {ExperienceItem.map((item, index) => (
            <div
              key={index}
              className="flex flex-col justify-center items-center space-y-4"
            >
              {/* Icon */}
              <div>
                <Image
                  src={item.src}
                  alt={item.label}
                  width={120}
                  height={120}
                  className="mb-4"
                />
              </div>

              {/* Text */}
              <p className="text-sm sm:text-base lg:text-lg font-medium text-white">
                {item.label}
              </p>

              {/* Value */}
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                {item.value}
              </h3>

            </div>
=======
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col items-center justify-center py-12">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-[#FF9F0D] font-medium tracking-widest text-sm uppercase mb-2">
            Our Achievements
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Numbers That <span className="text-[#FF9F0D]">Speak</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 w-full text-center">
          {ExperienceItem.map((item, index) => (
            <CounterItem key={index} item={item} inView={inView} index={index} />
>>>>>>> Stashed changes
          ))}
        </div>
      </div>
    </section>
  );
}
