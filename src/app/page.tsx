"use client"
import React from 'react'
import Image from "next/image";
import dynamic from 'next/dynamic';

const HeroAboutus = dynamic(() => import('../../components/HeroAboutus'), { ssr: false });
const FoodCategory = dynamic(() => import('../../components/FoodCategory'), { ssr: false });
const HomePageExperience = dynamic(() => import('../../components/HomePageExperience'), { ssr: false });
const ChefOnHome = dynamic(() => import('../../components/ChefOnHome'), { ssr: false });
const SimilarProductsSection = dynamic(() => import('components/SimilarProducts'), { ssr: false });

function HomePage() {
  return (
    <div className="main-content">
      <section className='bg-black px-3 md:px-[135px] flex flex-col justify-evenly md:flex-row  md:items-center py-[50px] relative z-[1]'>
         <div className='text-white w-full md:w-[50%]'>
          <h1 className='md:text-[32px] text-[24px] font-normal text-[#FF9F0D] font whitespace-nowrap'>
            Its Quick & Amazing!
          </h1>

          <h1 className='text-[25px] md:text-[50px] font-bold whitespace-nowrap md:whitespace-normal'>
            <span className='text-[#FF9F0D]'>Th</span>e Art of speed food Quality
          </h1>

          <p className='text-[10px] md:text-[16px] font-normal'>
          Experience the perfect blend of speed and quality with our customized & international cuisine delivery. Fresh flavors, fast service—right at your doorstep!
          </p>

          <div className='flex flex-col md:flex-row items-center md:items-start'>
            <button className='bg-[#FF9F0D] text-white w-[100px] h-[30px] md:w-[190px] md:h-[60px] rounded-[40px] mt-[32px] hover:bg-yellow-800'>
              See More
            </button>
          </div>
        </div>

        <div className='mt-[50px] md:mt-0 '>   
            <Image 
                src="/hero.png"
                alt='Hero Image'
                width={700}
                height={500}
                priority
                sizes="(max-width: 768px) 100vw, 700px"
            />
        </div>
    </section>

    <HeroAboutus/>
    <SimilarProductsSection currentProductId={'product._id'}/>
    <FoodCategory/>
    <HomePageExperience/>
    <ChefOnHome/>
    </div>
  )
}

export default HomePage;
