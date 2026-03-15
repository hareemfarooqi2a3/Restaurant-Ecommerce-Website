"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

const HeroAboutus = dynamic(() => import("../../components/HeroAboutus"), { ssr: false });
const FoodCategory = dynamic(() => import("../../components/FoodCategory"), { ssr: false });
const HomePageExperience = dynamic(() => import("../../components/HomePageExperience"), { ssr: false });
const ChefOnHome = dynamic(() => import("../../components/ChefOnHome"), { ssr: false });
const SimilarProductsSection = dynamic(() => import("components/SimilarProducts"), { ssr: false });
const HowItWorksSection = dynamic(() => import("../../components/HowItWorksSection"), { ssr: false });
const TestimonialsSection = dynamic(() => import("../../components/TestimonialsSection"), { ssr: false });
const SpecialOffersSection = dynamic(() => import("../../components/SpecialOffersSection"), { ssr: false });

<<<<<<< Updated upstream
function HomePage() {
  return (
    <>
      <section className='bg-black px-3 md:px-[135px] flex flex-col justify-evenly md:flex-row  md:items-center py-[50px]'>
         <div className='text-white w-full md:w-[50%]'>
          <h1 className='md:text-[32px] text-[24px] font-normal text-[#FF9F0D] font whitespace-nowrap'>
            Its Quick & Amazing!
          </h1>
=======
// ── Typewriter hook ──────────────────────────────────────────────────────────
const HERO_PHRASES = [
  "The Art of Speed Food Quality",
  "International Cuisine, Delivered Fresh",
  "Chef-Crafted Meals at Your Door",
  "From Our Kitchen to Your Table",
];
>>>>>>> Stashed changes

function useTypewriter(phrases: string[], speed = 60, pause = 2200) {
  const [displayed, setDisplayed] = useState("");
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = phrases[phraseIdx];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && charIdx <= current.length) {
      timeout = setTimeout(() => {
        setDisplayed(current.slice(0, charIdx));
        setCharIdx((c) => c + 1);
      }, speed);
    } else if (!deleting && charIdx > current.length) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => {
        setDisplayed(current.slice(0, charIdx - 1));
        setCharIdx((c) => c - 1);
      }, speed / 2);
    } else if (deleting && charIdx === 0) {
      setDeleting(false);
      setPhraseIdx((p) => (p + 1) % phrases.length);
    }

    return () => clearTimeout(timeout);
  }, [charIdx, deleting, phraseIdx, phrases, speed, pause]);

<<<<<<< Updated upstream
    <HeroAboutus/>
    <SimilarProductsSection currentProductId={'product._id'}/>
    <FoodCategory/>
    <HomePageExperience/>
    <ChefOnHome/>
    </>
  )
=======
  return displayed;
>>>>>>> Stashed changes
}

// ── Animated counter hook ────────────────────────────────────────────────────
function useCounter(target: number, duration = 2000, inView: boolean) {
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [inView, target, duration]);

  return count;
}

// ── Stats bar ────────────────────────────────────────────────────────────────
const STATS = [
  { label: "Happy Customers", value: 12500, suffix: "+" },
  { label: "Menu Items", value: 320, suffix: "+" },
  { label: "Expert Chefs", value: 48, suffix: "" },
  { label: "Cities Served", value: 30, suffix: "+" },
];

function StatItem({ stat, inView }: { stat: typeof STATS[0]; inView: boolean }) {
  const count = useCounter(stat.value, 2200, inView);
  return (
    <div className="flex flex-col items-center text-center px-4">
      <span className="text-3xl md:text-4xl font-bold text-[#FF9F0D]">
        {count.toLocaleString()}{stat.suffix}
      </span>
      <span className="text-white/60 text-sm mt-1">{stat.label}</span>
    </div>
  );
}

function StatsBar() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="bg-zinc-900 border-y border-white/8 py-10 px-4 md:px-[135px]"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {STATS.map((stat) => (
          <StatItem key={stat.label} stat={stat} inView={inView} />
        ))}
      </div>
    </div>
  );
}

// ── Floating particle ─────────────────────────────────────────────────────────
function FloatingParticle({
  emoji, style, delay, duration,
}: {
  emoji: string;
  style: React.CSSProperties;
  delay: number;
  duration: number;
}) {
  return (
    <motion.span
      className="pointer-events-none absolute text-3xl select-none opacity-20"
      style={style}
      animate={{
        y: [0, -25, 0],
        rotate: [0, 15, -10, 0],
        opacity: [0.15, 0.35, 0.15],
      }}
      transition={{
        duration,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    >
      {emoji}
    </motion.span>
  );
}

const PARTICLES = [
  { emoji: "🍔", style: { top: "15%", left: "5%" },  delay: 0,   duration: 5 },
  { emoji: "🍕", style: { top: "60%", left: "3%" },  delay: 1,   duration: 7 },
  { emoji: "🍜", style: { top: "25%", right: "6%" }, delay: 0.5, duration: 6 },
  { emoji: "🥗", style: { top: "70%", right: "4%" }, delay: 2,   duration: 8 },
  { emoji: "🍣", style: { top: "45%", left: "2%" },  delay: 1.5, duration: 5.5 },
  { emoji: "🌮", style: { bottom: "20%", right: "7%" }, delay: 0.8, duration: 6.5 },
];

// ── Main page ─────────────────────────────────────────────────────────────────
export default function HomePage() {
  const typed = useTypewriter(HERO_PHRASES, 55, 2400);

  return (
    <div className="main-content">
      {/* ── HERO SECTION ─────────────────────────────────────────────────── */}
      <section className="bg-black px-4 md:px-[135px] flex flex-col justify-evenly md:flex-row md:items-center py-[50px] md:py-[70px] relative overflow-hidden min-h-[80vh]">
        {/* Radial glow */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 70% at 60% 50%, rgba(255,159,13,0.07) 0%, transparent 70%)",
          }}
        />

        {/* Floating food particles */}
        {PARTICLES.map((p, i) => (
          <FloatingParticle key={i} {...p} />
        ))}

        {/* ── Left: Text ─── */}
        <motion.div
          className="text-white w-full md:w-[50%] relative z-10"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Kicker */}
          <motion.div
            className="inline-flex items-center gap-2 bg-[#FF9F0D]/10 border border-[#FF9F0D]/25 rounded-full px-4 py-1.5 mb-5"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <span className="w-2 h-2 rounded-full bg-[#FF9F0D] animate-pulse" />
            <span className="text-[#FF9F0D] text-sm font-medium">
              It&apos;s Quick &amp; Amazing!
            </span>
          </motion.div>

          {/* Typewriter headline */}
          <h1 className="text-[26px] md:text-[48px] lg:text-[56px] font-bold leading-tight mb-5 min-h-[3em] md:min-h-[2em]">
            <span className="text-[#FF9F0D]">Th</span>
            <span className="text-white">{typed.slice(2)}</span>
            <span className="typewriter-cursor" />
          </h1>

          <p className="text-white/65 text-sm md:text-[16px] leading-relaxed mb-8 max-w-md">
            Experience the perfect blend of speed and quality with our
            customized &amp; international cuisine delivery. Fresh flavors, fast
            service — right at your doorstep!
          </p>

          {/* CTA buttons */}
          <motion.div
            className="flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Link
              href="/Shop"
              className="inline-flex items-center gap-2 bg-[#FF9F0D] text-black font-bold px-6 py-3 rounded-full hover:scale-105 hover:shadow-[0_0_30px_rgba(255,159,13,0.4)] transition-all duration-300"
            >
              Order Now 🛒
            </Link>
            <Link
              href="/MenuPage"
              className="inline-flex items-center gap-2 border border-white/20 text-white font-semibold px-6 py-3 rounded-full hover:border-[#FF9F0D]/50 hover:text-[#FF9F0D] hover:bg-[#FF9F0D]/5 transition-all duration-300"
            >
              View Menu →
            </Link>
          </motion.div>

          {/* Trust micro-badges */}
          <motion.div
            className="flex flex-wrap gap-4 mt-8 text-xs text-white/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <span className="flex items-center gap-1">✅ No Hidden Fees</span>
            <span className="flex items-center gap-1">⚡ 30-min Delivery</span>
            <span className="flex items-center gap-1">🔒 Secure Checkout</span>
          </motion.div>
        </motion.div>

        {/* ── Right: Hero image ─── */}
        <motion.div
          className="mt-10 md:mt-0 relative z-10 flex justify-center"
          initial={{ opacity: 0, x: 30, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        >
          {/* Glow ring behind image */}
          <div
            className="absolute inset-0 rounded-full blur-3xl opacity-25 pointer-events-none"
            style={{
              background: "radial-gradient(circle, #FF9F0D 0%, transparent 70%)",
              transform: "scale(0.8)",
            }}
          />

          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image
              src="/hero.png"
              alt="Signature dish"
              width={600}
              height={480}
              priority
              sizes="(max-width: 768px) 100vw, 600px"
              className="relative z-10 drop-shadow-2xl"
            />
          </motion.div>

          {/* Floating badge: Free delivery */}
          <motion.div
            className="absolute -bottom-2 left-4 md:left-0 bg-zinc-900 border border-[#FF9F0D]/30 rounded-2xl px-4 py-2.5 flex items-center gap-3 badge-bounce"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            <span className="text-2xl">🏍️</span>
            <div>
              <p className="text-white font-semibold text-xs">Free Delivery</p>
              <p className="text-white/50 text-[10px]">On orders over $25</p>
            </div>
          </motion.div>

          {/* Floating badge: Rating */}
          <motion.div
            className="absolute top-4 -right-2 md:right-0 bg-zinc-900 border border-[#FF9F0D]/30 rounded-2xl px-4 py-2.5 flex items-center gap-3"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
          >
            <span className="text-2xl">⭐</span>
            <div>
              <p className="text-white font-semibold text-xs">4.9 Rating</p>
              <p className="text-white/50 text-[10px]">12,500+ reviews</p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────────────────── */}
      <StatsBar />

      {/* ── REST OF PAGE ─────────────────────────────────────────────────── */}
      <HeroAboutus />
      <HowItWorksSection />
      <SpecialOffersSection />
      <SimilarProductsSection currentProductId={"product._id"} />
      <FoodCategory />
      <HomePageExperience />
      <TestimonialsSection />
      <ChefOnHome />
    </div>
  );
}
