"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";

const footer1 = "/footer1.png";
const footer2 = "/footer2.png";
const footer3 = "/footer3.png";

const USEFUL_LINKS = [
  { label: "About Us",    href: "/About" },
  { label: "Our Chefs",   href: "/OurChef" },
  { label: "Blog",        href: "/Blog" },
  { label: "Menu",        href: "/MenuPage" },
  { label: "Contact",     href: "/Contact" },
  { label: "Shop",        href: "/Shop" },
];

const HELP_LINKS = [
  { label: "FAQ",                href: "/FAQ" },
  { label: "Track My Order",     href: "/track" },
  { label: "Terms & Conditions", href: "#" },
  { label: "Privacy Policy",     href: "#" },
  { label: "Support",            href: "/Contact" },
  { label: "Reservations",       href: "#reservations" },
];

const SOCIAL = [
  { name: "Facebook",  path: "/Facebook.png",  href: "#" },
  { name: "Instagram", path: "/Instagram.png", href: "#" },
  { name: "Youtube",   path: "/Youtube.png",   href: "#" },
  { name: "Twitter",   path: "/Twitter.png",   href: "#" },
  { name: "Pinterest", path: "/Pinterest.png", href: "#" },
];

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <footer className="bg-black text-white relative overflow-hidden">
      {/* Top ambient line */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-[#FF9F0D]/40 to-transparent" />

      {/* Newsletter strip */}
      <div className="bg-zinc-950 py-12 px-6 md:px-[135px]">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <h2 className="text-xl md:text-3xl font-bold">
              <span className="text-[#FF9F0D]">St</span>ay in the Loop
            </h2>
            <p className="text-white/55 text-sm mt-2">
              Subscribe for exclusive offers, new menu drops &amp; delivery updates.
            </p>
          </div>

          <form
            onSubmit={handleSubscribe}
            className="flex flex-col sm:flex-row items-stretch gap-0 w-full md:w-auto"
          >
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-zinc-800 border border-white/10 text-white placeholder-white/30 py-3 px-5 text-sm rounded-l-full sm:w-64 focus:outline-none focus:border-[#FF9F0D]/60 transition-colors"
            />
            <button
              type="submit"
              className="bg-[#FF9F0D] hover:bg-orange-400 text-black font-bold py-3 px-6 text-sm rounded-r-full transition-all duration-200 hover:scale-105 whitespace-nowrap"
            >
              {subscribed ? "✅ Subscribed!" : "Subscribe Now"}
            </button>
          </form>
        </div>
      </div>

      {/* Divider */}
      <div className="w-3/4 mx-auto h-px bg-gradient-to-r from-transparent via-[#FF9F0D]/25 to-transparent" />

      {/* Main footer grid */}
      <motion.div
        className="max-w-screen-xl mx-auto px-6 md:px-[135px] py-14"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Col 1 — Brand */}
          <motion.div variants={itemVariants}>
            <h2 className="text-2xl font-bold mb-4">
              <span className="text-[#FF9F0D]">Food</span>Tuck
            </h2>
            <p className="text-white/55 text-sm leading-relaxed mb-5">
              FoodTuck delivers customized &amp; international cuisine — freshly prepared,
              carefully packed, and delivered fast. Order in minutes, track in
              real-time, and enjoy restaurant-quality meals at home.
            </p>
            <div className="flex items-center gap-3">
              <div className="bg-[#FF9F0D] w-11 h-11 flex justify-center items-center rounded-lg flex-shrink-0">
                <Image src="/ClockClockwise.png" alt="Clock" width={24} height={24} />
              </div>
              <div>
                <p className="text-white text-sm font-semibold">Opening Hours</p>
                <p className="text-white/45 text-xs">Mon – Sat · 8:00 – 22:00</p>
                <p className="text-white/45 text-xs">Sunday · 10:00 – 20:00</p>
              </div>
            </div>
          </motion.div>

          {/* Col 2 — Useful Links */}
          <motion.div variants={itemVariants}>
            <h2 className="text-lg font-bold mb-5 uppercase tracking-wider">Quick Links</h2>
            <ul className="space-y-3">
              {USEFUL_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-[#FF9F0D] text-sm transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#FF9F0D] opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Col 3 — Help */}
          <motion.div variants={itemVariants}>
            <h2 className="text-lg font-bold mb-5 uppercase tracking-wider">Help &amp; Support</h2>
            <ul className="space-y-3">
              {HELP_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-[#FF9F0D] text-sm transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#FF9F0D] opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Col 4 — Recent Posts */}
          <motion.div variants={itemVariants}>
            <h2 className="text-lg font-bold mb-5 uppercase tracking-wider">Recent Posts</h2>
            <ul className="space-y-4">
              {[footer1, footer2, footer3].map((img, index) => (
                <li key={index} className="flex items-center gap-3 group cursor-pointer">
                  <div className="relative w-16 h-14 flex-shrink-0 rounded-lg overflow-hidden">
                    <Image
                      src={img}
                      alt={`Post ${index + 1}`}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div>
                    <p className="text-white/40 text-[11px] mb-0.5">
                      {["20 Feb 2024", "15 Mar 2024", "02 Apr 2024"][index]}
                    </p>
                    <p className="text-white/80 text-sm font-medium leading-tight group-hover:text-[#FF9F0D] transition-colors">
                      {[
                        "The Art of Seasonal Cooking",
                        "Our New International Menu",
                        "Behind the Kitchen Door",
                      ][index]}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>

        </div>
      </motion.div>

      {/* Bottom bar */}
      <div className="bg-[#FF9F0D] py-5 px-6 md:px-[135px] relative overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 relative z-10">
          <p className="text-black text-sm font-semibold">
            © {new Date().getFullYear()} FoodTuck. All Rights Reserved.
          </p>

          {/* Social icons */}
          <div className="flex gap-3">
            {SOCIAL.map((icon, idx) => (
              <Link
                key={idx}
                href={icon.href}
                aria-label={icon.name}
                className="bg-black/15 hover:bg-black/30 w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-200 hover:scale-110"
              >
                <Image
                  src={icon.path}
                  alt={icon.name}
                  width={16}
                  height={16}
                  onError={(e) => { e.currentTarget.src = "/fallback-icon.png"; }}
                />
              </Link>
            ))}
          </div>

          <p className="text-black/70 text-xs">
            Crafted with ❤️ for food lovers worldwide
          </p>
        </div>

        {/* Decorative leaves */}
        <Image
          src="/Leaves.png"
          alt=""
          width={130}
          height={130}
          className="absolute bottom-0 right-0 opacity-30 pointer-events-none"
        />
      </div>
    </footer>
  );
}
