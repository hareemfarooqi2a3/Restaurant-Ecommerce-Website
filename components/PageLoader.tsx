"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FOOD_EMOJIS = ["🍔", "🍕", "🍜", "🥗", "🍣", "🌮", "🍰", "☕"];

export default function PageLoader() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [emojiIndex, setEmojiIndex] = useState(0);

  useEffect(() => {
    // Cycle through food emojis
    const emojiTimer = setInterval(() => {
      setEmojiIndex((prev) => (prev + 1) % FOOD_EMOJIS.length);
    }, 300);

    // Progress animation
    const progressSteps = [15, 35, 55, 72, 88, 100];
    const delays = [200, 400, 700, 1000, 1400, 2000];

    const timers: ReturnType<typeof setTimeout>[] = [];
    progressSteps.forEach((step, i) => {
      timers.push(
        setTimeout(() => setProgress(step), delays[i])
      );
    });

    // Hide loader after progress completes
    const hideTimer = setTimeout(() => {
      setVisible(false);
    }, 2600);

    return () => {
      clearInterval(emojiTimer);
      timers.forEach(clearTimeout);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-black select-none"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.04,
            filter: "blur(12px)",
            transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
          }}
        >
          {/* Radial ambient glow */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255,159,13,0.12) 0%, transparent 70%)",
            }}
          />

          {/* Floating food particles */}
          {FOOD_EMOJIS.slice(0, 6).map((emoji, i) => (
            <motion.span
              key={emoji}
              className="pointer-events-none absolute text-2xl opacity-20 select-none"
              style={{
                left: `${10 + i * 14}%`,
                top: `${20 + (i % 3) * 20}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.12, 0.28, 0.12],
                rotate: [0, 15, -10, 0],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut",
              }}
            >
              {emoji}
            </motion.span>
          ))}

          {/* Main content */}
          <div className="relative flex flex-col items-center gap-6">
            {/* Animated plate / ring */}
            <div className="relative flex items-center justify-center w-24 h-24">
              {/* Outer spinning ring */}
              <svg
                className="absolute inset-0 w-full h-full loader-ring"
                viewBox="0 0 96 96"
                fill="none"
              >
                <circle
                  cx="48"
                  cy="48"
                  r="44"
                  stroke="rgba(255,159,13,0.15)"
                  strokeWidth="4"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="44"
                  stroke="#FF9F0D"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="80 196"
                  strokeDashoffset="0"
                />
              </svg>

              {/* Inner pulsing emoji */}
              <motion.span
                className="text-4xl loader-plate z-10"
                key={emojiIndex}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.2, opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                {FOOD_EMOJIS[emojiIndex]}
              </motion.span>
            </div>

            {/* Brand name */}
            <div className="text-center">
              <motion.h1
                className="text-3xl md:text-4xl font-bold tracking-tight"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <span className="text-[#FF9F0D]">Food</span>
                <span className="text-white">Tuck</span>
              </motion.h1>
              <motion.p
                className="text-white/50 text-sm mt-1 tracking-widest uppercase"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                Preparing your experience
              </motion.p>
            </div>

            {/* Progress bar */}
            <motion.div
              className="w-56 md:w-72 h-1 bg-white/10 rounded-full overflow-hidden"
              initial={{ opacity: 0, scaleX: 0.6 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, #FF9F0D, #FFD700, #FF6B35)",
                }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </motion.div>

            {/* Loading dots */}
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-[#FF9F0D] loader-dot"
                  animate={{ scale: [0.6, 1, 0.6], opacity: [0.4, 1, 0.4] }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
