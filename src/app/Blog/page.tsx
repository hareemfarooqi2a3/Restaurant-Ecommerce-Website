import React from 'react'
import ForAllHeroSections from '../../../components/ForAllHeroSections'
import BlogCardOnBlog from "../../../components/BlogCardOnBlog";
import SidebarOnBlog from "../../../components/SidebarOnBlog";

export default function Blog() {

  const blogs = [
    {
      image: "/BlogImage1.png",
      date: "Feb 14, 2022",
      title: "How we keep delivery fast without sacrificing quality",
      description: "From optimized prep stations to smart batching, here’s how FoodTuck keeps your meals hot, fresh, and on time—especially during peak hours.",
    },
    {
      image: "/BlogImage2.png",
      date: "Feb 15, 2022",
      title: "Build your perfect burger: toppings, sauces, and combos",
      description: "A quick guide to customizing your burger—from spice level to extra cheese—so every bite matches your mood.",
    },
    {
      image: "/BlogImage3.png",
      date: "Feb 18, 2022",
      title: "Quick vegetarian comfort meals you can order in minutes",
      description: "Healthy doesn’t have to be boring. These are our go-to veggie favorites when you want comfort and flavor—fast.",
    },
    {
      image: "/BlogImage4.png",
      date: "Feb 20, 2022",
      title: "Pizza night, upgraded: sauces, crusts, and smart sides",
      description: "A few easy pairings to level up your pizza order—think dips, crunchy sides, and a drink that actually complements the flavors.",
    },
  ];


  return (
    <div className="main-content">
      <ForAllHeroSections />

      <div className="bg-black min-h-screen">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-24 py-16 flex flex-col md:flex-row gap-10">
          <div className="w-full md:w-2/3 lg:w-3/4 space-y-6">
            {blogs.map((blog, idx) => (
              <BlogCardOnBlog
                key={idx}
                image={blog.image}
                date={blog.date}
                title={blog.title}
                description={blog.description}
              />
            ))}
          </div>

          <SidebarOnBlog />
        </div>
      </div>
    </div>
  );
}
