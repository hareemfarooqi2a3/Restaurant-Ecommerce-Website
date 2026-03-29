import React from 'react';
import Image from "next/image";

export default function ChefOnHome() {
  return (
    <>
      <div>
        {/* Hero Section */}
        <section
          className="bg-black md:px-[135px] py-[50px] relative"
          style={{
            backgroundImage: "url('/MeetOurChef-Background.png')",
            backgroundSize: "400px", // Smaller background size
            backgroundRepeat: "no-repeat",
            backgroundPosition: "left bottom",
          }}
        >
          <div className="flex flex-col justify-center items-center">
            <p className="mb-2 text-[#FF9F0D] text-xl md:text-2xl font-['cursive'] tracking-wide">
              Chefs
            </p>
            <h1 className="text-[16px] text-white md:text-[36px] font-bold whitespace-nowrap md:whitespace-normal">
              <span className="text-[#FF9F0D]">Me</span>et Our Chef
            </h1>
          </div>
          <div className="flex flex-col md:flex-row justify-center items-center gap-[20px] mt-[50px]">
            <Image
              src="/chef1.png"
              alt="Chef 1"
              className="w-[180px] md:w-[280px] md:h-[260px] cursor-pointer transition-transform duration-300 hover:scale-[1.03]"
              width={312}
              height={391}
            />
            <Image
              src="/chef2.png"
              alt="Chef 2"
              className="w-[180px] md:w-[280px] md:h-[260px] cursor-pointer transition-transform duration-300 hover:scale-[1.03]"
              width={312}
              height={391}
            />
            <Image
              src="/chef3.png"
              alt="Chef 3"
              className="w-[180px] md:w-[280px] md:h-[260px] cursor-pointer transition-transform duration-300 hover:scale-[1.03]"
              width={312}
              height={391}
            />
            <Image
              src="/chef4.png"
              alt="Chef 4"
              className="w-[180px] md:w-[280px] md:h-[260px] cursor-pointer transition-transform duration-300 hover:scale-[1.03]"
              width={312}
              height={391}
            />
          </div>
          <div className="flex justify-center mt-[30px]">
            <button className="px-8 py-2 border border-[#e58b0a] rounded-lg text-white text-sm md:text-lg font-medium transition-all shadow-lg hover:bg-[#FF9F0D] hover:text-black">
              See More
            </button>
          </div>
        </section>
      </div>
    </>
  );
}
