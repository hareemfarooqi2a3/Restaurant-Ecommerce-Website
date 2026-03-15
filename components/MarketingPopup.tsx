"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, X } from "lucide-react";

type DismissMode = "later" | "week";

const STORAGE_KEY = "foodtuck_marketing_popup_dismissed_until";

function getDismissUntilMs(mode: DismissMode) {
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;
  return mode === "later" ? now + oneDay : now + 7 * oneDay;
}

function isDismissed() {
  if (typeof window === "undefined") return true;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return false;
  const until = Number(raw);
  return Number.isFinite(until) && until > Date.now();
}

export default function MarketingPopup() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Keep it marketing-focused without interrupting critical flows.
  const eligibleRoute = useMemo(() => {
    return pathname === "/" || pathname === "/Shop" || pathname === "/MenuPage";
  }, [pathname]);

  const close = (mode: DismissMode = "week") => {
    try {
      window.localStorage.setItem(STORAGE_KEY, String(getDismissUntilMs(mode)));
    } catch {
      // Ignore storage failures (private mode, etc).
    }
    setOpen(false);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!eligibleRoute) return;
    if (isDismissed()) return;

    const t = window.setTimeout(() => setOpen(true), 2200);
    return () => window.clearTimeout(t);
  }, [eligibleRoute, mounted]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close("week");
    };
    document.addEventListener("keydown", onKeyDown);

    // Simple scroll lock while modal is open.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[10020] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          aria-hidden={!open}
        >
          {/* Backdrop */}
          <button
            aria-label="Close marketing popup"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => close("week")}
            type="button"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="marketing-popup-title"
            className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-950 via-zinc-950 to-zinc-900 shadow-2xl"
            initial={{ y: 18, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 14, scale: 0.98, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
          >
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -top-24 -right-24 h-56 w-56 rounded-full bg-[#FF9F0D]/20 blur-3xl" />
              <div className="absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-fuchsia-500/10 blur-3xl" />
            </div>

            <button
              type="button"
              onClick={() => close("week")}
              className="absolute right-4 top-4 inline-flex items-center justify-center rounded-full border border-white/10 bg-black/40 p-2 text-white/80 hover:text-white hover:bg-black/60 transition"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="relative hidden md:block">
                <Image
                  src="/hero.png"
                  alt="Featured dish"
                  fill
                  sizes="(max-width: 768px) 0px, 520px"
                  className="object-cover opacity-90"
                  priority={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5">
                  <div className="inline-flex items-center gap-2 rounded-full bg-black/50 px-3 py-1 text-xs text-white/90 border border-white/10">
                    <Sparkles size={14} className="text-[#FF9F0D]" />
                    Fast, fresh, customized — made for you
                  </div>
                </div>
              </div>

              <div className="p-6 md:p-8">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80">
                  <Sparkles size={14} className="text-[#FF9F0D]" />
                  FoodTuck picks
                </div>

                <h2
                  id="marketing-popup-title"
                  className="mt-4 text-2xl md:text-3xl font-bold text-white tracking-tight"
                >
                  Explore new flavors, faster.
                </h2>

                <p className="mt-3 text-sm md:text-base text-white/70">
                  Discover international cuisine, customize your meal, and track your order in real time — all in one place.
                </p>

                <ul className="mt-5 space-y-2 text-sm text-white/80">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#FF9F0D]" />
                    AI recommendations tailored to your taste
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#FF9F0D]" />
                    Quick checkout + secure payments
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#FF9F0D]" />
                    Order tracking from kitchen to doorstep
                  </li>
                </ul>

                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/Shop"
                    className="inline-flex items-center justify-center rounded-full bg-[#FF9F0D] px-5 py-3 text-sm font-bold text-black hover:bg-[#e58b0a] transition"
                    onClick={() => close("week")}
                  >
                    Browse Shop
                  </Link>
                  <Link
                    href="/MenuPage"
                    className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10 transition"
                    onClick={() => close("week")}
                  >
                    View Menu
                  </Link>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-white/60">
                  <button
                    type="button"
                    onClick={() => close("later")}
                    className="underline underline-offset-4 hover:text-white/80 transition"
                  >
                    Remind me tomorrow
                  </button>
                  <Link
                    href="/Signup"
                    className="underline underline-offset-4 hover:text-white/80 transition"
                    onClick={() => close("week")}
                  >
                    Create an account
                  </Link>
                  <span className="hidden sm:inline text-white/30">|</span>
                  <button
                    type="button"
                    onClick={() => close("week")}
                    className="text-white/60 hover:text-white/80 transition"
                  >
                    No thanks
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}





