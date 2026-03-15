import React from 'react'
import Image from "next/image";
import ForAllHeroSections from '../../../components/ForAllHeroSections'
import { Clock, ShieldCheck, Truck } from "lucide-react";

export default function About() {
  return (
    <div className="main-content bg-black text-white">
        <ForAllHeroSections />

        {/* First Section: Content and Buttons */}
        <section className="body-font">
          <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-24 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              {/* Images */}
              <div className="grid grid-cols-2 gap-4">
                <Image
                  className="object-cover object-center w-full h-[360px] rounded-lg col-span-1"
                  alt="Freshly prepared dishes"
                  src="/About1.png"
                  width={520}
                  height={720}
                />
                <div className="flex flex-col gap-4">
                  <Image
                    className="object-cover object-center w-full h-[170px] rounded-lg"
                    alt="Chef-crafted meal"
                    src="/about4.png"
                    width={520}
                    height={380}
                  />
                  <Image
                    className="object-cover object-center w-full h-[170px] rounded-lg"
                    alt="Seasonal salad bowl"
                    src="/aboutt.png"
                    width={520}
                    height={380}
                  />
                </div>
              </div>

              {/* Text Content */}
              <div className="flex flex-col items-start text-left">
                <p className="text-sm mb-3 font-medium text-[#FF9F0D] italic tracking-wide">
                  About us
                </p>
                <h2 className="title-font text-3xl sm:text-4xl font-bold leading-tight">
                  Food that fits your day — fast, fresh, and customizable
                </h2>
                <p className="mt-6 text-white/80 leading-relaxed">
                  We’re built for Q‑commerce: fast delivery, consistent quality, and meals tailored to your taste.
                  Choose from international favorites, customize ingredients, and track your order end‑to‑end.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <button className="inline-flex text-black bg-[#FF9F0D] border-0 py-2.5 px-5 focus:outline-none rounded-full text-sm font-semibold hover:bg-[#ff9f0db8] transition-colors">
                    Explore Menu
                  </button>
                  <button className="inline-flex text-white border border-white/20 py-2.5 px-5 focus:outline-none rounded-full text-sm font-semibold hover:border-white/40 hover:bg-white/5 transition-colors">
                    Watch Story
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Second Section: Why Choose Us */}
        <section className="body-font">
          <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-24 py-16">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold">Why Choose Us</h2>
              <p className="text-white/80 mt-3">
                A better ordering experience from checkout to doorstep — designed for speed, safety, and satisfaction.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border border-white/15 rounded-xl p-5 bg-white/5 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-lg bg-[#FF9F0D]/15 flex items-center justify-center">
                      <Truck className="w-5 h-5 text-[#FF9F0D]" />
                    </span>
                    <h3 className="font-semibold text-lg">Fast Delivery</h3>
                  </div>
                  <p className="mt-3 text-sm text-white/75 leading-relaxed">
                    Delivery optimized for speed with live tracking and instant status updates.
                  </p>
                </div>

                <div className="border border-white/15 rounded-xl p-5 bg-white/5 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-lg bg-[#FF9F0D]/15 flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5 text-[#FF9F0D]" />
                    </span>
                    <h3 className="font-semibold text-lg">Secure Payments</h3>
                  </div>
                  <p className="mt-3 text-sm text-white/75 leading-relaxed">
                    Trusted checkout with clear totals, receipts, and safer transactions.
                  </p>
                </div>

                <div className="border border-white/15 rounded-xl p-5 bg-white/5 hover:bg-white/10 transition-colors sm:col-span-2">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-lg bg-[#FF9F0D]/15 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-[#FF9F0D]" />
                    </span>
                    <h3 className="font-semibold text-lg">Fresh, On‑Demand Cooking</h3>
                  </div>
                  <p className="mt-3 text-sm text-white/75 leading-relaxed">
                    Meals are prepared to order and packed carefully so they arrive hot, fresh, and delicious.
                  </p>
                </div>
              </div>

              {/* Supporting Image */}
              <div className="relative w-full h-[320px] sm:h-[420px] rounded-2xl overflow-hidden border border-white/10">
                <Image
                  className="object-cover"
                  alt="Fresh meal selection"
                  src="/about.png"
                  fill
                  priority={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              </div>
            </div>
          </div>
        </section>

        {/* Third Section: Team Members */}
        <section className="body-font">
          <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-24 py-16">
            <div className="flex flex-wrap -m-4">
              <div className="p-4 md:w-1/3">
                <div className="h-full flex justify-center items-center flex-col border border-white/15 rounded-lg overflow-hidden bg-white/5 hover:bg-white/10 transition-colors">
                  <Image src="/Student.png" width={80} height={80} alt="Best Chef" />
                  <div className="p-6">
                    <h3 className="title-font text-lg font-semibold text-white mb-2 text-center">Expert Chefs</h3>
                    <p className="leading-relaxed mb-3 text-center text-white/80 text-sm">
                      Recipes crafted by experienced chefs for consistent taste in every order.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 md:w-1/3">
                <div className="h-full border border-white/15 flex justify-center items-center flex-col rounded-lg overflow-hidden bg-white/5 hover:bg-white/10 transition-colors">
                  <Image src="/Coffee.png" width={80} height={80} alt="120 Item Food" />
                  <div className="p-6">
                    <h3 className="title-font text-lg font-semibold text-white mb-2 text-center">Wide Menu</h3>
                    <p className="leading-relaxed mb-3 text-center text-white/80 text-sm">
                      International dishes, quick bites, and healthier options—something for everyone.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 md:w-1/3">
                <div className="h-full border border-white/15 flex justify-center items-center flex-col rounded-lg overflow-hidden bg-white/5 hover:bg-white/10 transition-colors">
                  <Image src="/man.png" width={80} height={80} alt="Clean Environment" />
                  <div className="p-6">
                    <h3 className="title-font text-lg font-semibold text-white mb-2 text-center">Quality & Hygiene</h3>
                    <p className="leading-relaxed mb-3 text-center text-white/80 text-sm">
                      Clean kitchens and careful packaging for a safer, better meal experience.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* <Image src="/TeamMember.png" width={1440} height={80} alt="Team Member"/>
        <Image src="/Testimonials.png" width={1273} height={770} alt="Testimonials" className='px-44' />
        <Image src="/FoodMenu.png" width={1320} height={941} alt="Food Menu" className='px-44 mb-16' /> */}

    </div>
  )
}
