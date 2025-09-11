import Image from 'next/image';
import React from 'react';

export const ExperienceItem = [
  {
    src: "/cap.png",
    value: "420",
    label: "Professional Chefs",
  },
  {
    src: "/burger.png",
    value: "320",
    label: "Items Of Food",
  },
  {
    src: "/spoon.png",
    value: "30+",
    label: "Years Of Experienced",
  },
  {
    src: "/pizza.png",
    value: "220",
    label: "Happy Customers",
  },
];

export default function Experience() {
  return (
    <section
      className="relative min-h-[400px] sm:h-[469px] w-full bg-cover bg-center bg-[url('/experience-background.png')]"
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-85"></div>

      {/* Content */}
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-6 w-full text-center">
          {ExperienceItem.map((item, index) => (
            <div
              key={index}
              className="flex flex-col justify-center items-center space-y-2 sm:space-y-4 py-4"
            >
              {/* Icon */}
              <div className="mb-2">
                <Image
                  src={item.src}
                  alt={item.label}
                  width={80}
                  height={80}
                  className="sm:w-[100px] sm:h-[100px] lg:w-[120px] lg:h-[120px]"
                />
              </div>

              {/* Value */}
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                {item.value}
              </h3>

              {/* Text */}
              <p className="text-xs sm:text-sm lg:text-base font-medium text-white px-2">
                {item.label}
              </p>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
