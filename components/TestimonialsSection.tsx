"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const testimonials = [
  {
    name: "Sarah Al-Rashidi",
    role: "Food Blogger · Dubai",
    avatar: "SR",
    rating: 5,
    flag: "🇦🇪",
    text: "FoodTuck has completely changed how I experience international cuisine at home. The packaging keeps everything fresh and the delivery time is unbelievably fast. Absolutely world-class service!",
    dish: "Wagyu Beef Burger",
  },
  {
    name: "James Thornton",
    role: "Executive Chef · London",
    avatar: "JT",
    rating: 5,
    flag: "🇬🇧",
    text: "Even as a professional chef, I find myself ordering from FoodTuck on my days off. The quality of ingredients and the attention to detail in each dish is genuinely impressive. Highly recommended.",
    dish: "Truffle Pasta",
  },
  {
    name: "Priya Sharma",
    role: "Software Engineer · Toronto",
    avatar: "PS",
    rating: 5,
    flag: "🇨🇦",
    text: "I ordered for a family gathering and everyone was blown away. Real-time tracking made it stress-free, and the food arrived piping hot. Will definitely order again for every occasion!",
    dish: "Spiced Lamb Platter",
  },
  {
    name: "Carlos Mendes",
    role: "Entrepreneur · São Paulo",
    avatar: "CM",
    rating: 5,
    flag: "🇧🇷",
    text: "The AI chatbot helped me find the perfect meal for my dietary restrictions in seconds. The custom meal options are brilliant. This is what modern food delivery should look like.",
    dish: "Grilled Sea Bass",
  },
  {
    name: "Aiko Tanaka",
    role: "Designer · Tokyo",
    avatar: "AT",
    rating: 5,
    flag: "🇯🇵",
    text: "Beautiful presentation, incredible taste — and delivered faster than expected. FoodTuck treats every order like it's going to a five-star restaurant. Truly remarkable experience.",
    dish: "Sushi Deluxe Set",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.span
          key={i}
          className="text-[#FF9F0D] text-lg"
          initial={{ scale: 0, rotate: -20, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ delay: i * 0.06, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          {i < rating ? "★" : "☆"}
        </motion.span>
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback(
    (next: number) => {
      setDirection(next > current ? 1 : -1);
      setCurrent((next + testimonials.length) % testimonials.length);
    },
    [current]
  );

  useEffect(() => {
    if (paused) return;
    intervalRef.current = setInterval(() => {
      go(current + 1);
    }, 5000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [current, paused, go]);

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 60 : -60,
      opacity: 0,
      filter: "blur(6px)",
      scale: 0.96,
    }),
    center: { x: 0, opacity: 1, filter: "blur(0px)", scale: 1 },
    exit: (dir: number) => ({
      x: dir > 0 ? -60 : 60,
      opacity: 0,
      filter: "blur(6px)",
      scale: 0.96,
    }),
  };

  const t = testimonials[current];

  return (
    <section className="bg-zinc-950 py-20 px-4 md:px-[135px] relative overflow-hidden">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(255,159,13,0.08) 0%, transparent 60%)",
          }}
        />
      </div>

      {/* Section header */}
      <div className="text-center mb-14">
        <p className="text-[#FF9F0D] text-lg font-medium tracking-wide mb-2">
          Real Stories
        </p>
        <h2 className="text-3xl md:text-5xl font-bold text-white">
          What Our <span className="text-[#FF9F0D]">Customers</span> Say
        </h2>
        <p className="text-white/50 mt-4 text-base max-w-lg mx-auto">
          Thousands of satisfied customers from around the world trust FoodTuck
          for their finest dining moments.
        </p>
      </div>

      {/* Review card */}
      <div
        className="relative max-w-3xl mx-auto"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="bg-zinc-900 border border-white/8 rounded-2xl p-8 md:p-12 relative"
          >
            {/* Quote mark */}
            <div className="absolute top-6 right-8 text-[#FF9F0D]/15 text-9xl font-serif leading-none select-none pointer-events-none">
              "
            </div>

            {/* Stars */}
            <StarRating key={`stars-${current}`} rating={t.rating} />

            {/* Quote */}
            <p className="text-white/80 text-base md:text-lg leading-relaxed mt-5 mb-8 italic relative z-10">
              "{t.text}"
            </p>

            {/* Dish tag */}
            <div className="inline-flex items-center gap-2 bg-[#FF9F0D]/10 border border-[#FF9F0D]/20 rounded-full px-4 py-1.5 text-xs text-[#FF9F0D] font-medium mb-6">
              🍽️ Ordered: {t.dish}
            </div>

            {/* Author */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF9F0D] to-orange-700 flex items-center justify-center text-black font-bold text-sm flex-shrink-0">
                {t.avatar}
              </div>
              <div>
                <p className="text-white font-semibold text-sm">
                  {t.flag} {t.name}
                </p>
                <p className="text-white/40 text-xs">{t.role}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation arrows */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={() => go(current - 1)}
            className="w-10 h-10 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-white hover:bg-[#FF9F0D] hover:border-[#FF9F0D] hover:text-black transition-all duration-200"
            aria-label="Previous review"
          >
            ←
          </button>

          {/* Dots */}
          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                className={`transition-all duration-300 rounded-full ${
                  i === current
                    ? "w-6 h-2 bg-[#FF9F0D]"
                    : "w-2 h-2 bg-white/20 hover:bg-white/40"
                }`}
                aria-label={`Review ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => go(current + 1)}
            className="w-10 h-10 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-white hover:bg-[#FF9F0D] hover:border-[#FF9F0D] hover:text-black transition-all duration-200"
            aria-label="Next review"
          >
            →
          </button>
        </div>
      </div>

      {/* Trust badges */}
      <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-white/40 text-xs">
        <span className="flex items-center gap-1.5">⭐ 4.9 Average Rating</span>
        <span className="w-px h-4 bg-white/10 hidden sm:block" />
        <span className="flex items-center gap-1.5">🌍 50+ Countries Served</span>
        <span className="w-px h-4 bg-white/10 hidden sm:block" />
        <span className="flex items-center gap-1.5">✅ 10,000+ Orders Delivered</span>
        <span className="w-px h-4 bg-white/10 hidden sm:block" />
        <span className="flex items-center gap-1.5">🔒 Secure & Trusted</span>
      </div>
    </section>
  );
}
