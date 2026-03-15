import Image from "next/image";
import React from "react";

const SidebarOnBlog = () => {
  const recentPosts = [
    {
      img: "/RecentPostOnBlog1.png",
      title: "5-minute lunch ideas you can customize",
      date: "June 22, 2020",
    },
    {
      img: "/RecentPostOnBlog2.png",
      title: "Spice levels explained: mild to extra hot",
      date: "June 22, 2020",
    },
    {
      img: "/RecentPostOnBlog3.png",
      title: "How we pack meals to stay fresh longer",
      date: "June 22, 2020",
    },
    {
      img: "/RecentPostOnBlog4.png",
      title: "Top-rated desserts to finish your order",
      date: "June 22, 2020",
    },
  ];

  const menuItems = [
    { icon: "/FilterByMenuOnBlog1.png", label: "Chicken Fry", count: 26 },
    { icon: "/FilterByMenuOnBlog2.png", label: "Burger Food", count: 48 },
    { icon: "/FilterByMenuOnBlog3.png", label: "Pizza", count: 36 },
    { icon: "/FilterByMenuOnBlog4.png", label: "Pasta Fries", count: 15 },
    { icon: "/FilterByMenuOnBlog5.png", label: "Vegetables", count: 6 },
  ];

  const galleryPhotos = [
    "/PhotoGalleryOnBlog1.png",
    "/PhotoGalleryOnBlog2.png",
    "/PhotoGalleryOnBlog3.png",
    "/PhotoGalleryOnBlog4.png",
    "/PhotoGalleryOnBlog5.png",
    "/PhotoGalleryOnBlog6.png",
  ];

  const tags = [
    "Sandwich",
    "Tikka",
    "BBQ",
    "Restaurant",
    "Chicken Shawarma",
    "Health",
    "Fast Food",
    "Food",
    "Pizza",
    "Burger",
    "Chicken",
  ];

  return (
    <aside className="w-full md:w-2/5 lg:w-1/3 space-y-6">
      {/* Search Field */}
      <div className="mb-6">
        <div className="relative flex items-center rounded-md">
          <input
            type="text"
            placeholder="Search Your Keyword"
            className="w-full h-12 pl-4 pr-14 border border-gray-300 text-sm text-gray-100 bg-transparent focus:outline-none"
          />
          <div className="absolute right-0 w-12 h-12 bg-[#FFA500] flex justify-center items-center rounded-md">
            <img src="/Search.png" alt="Search Icon" className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Review Section */}
      <div className="border border-gray-300 p-5 text-center">
        <Image
          src="/ReviewOnBlog.png"
          alt="Profile"
          width={100}
          height={100}
          className="rounded-full mx-auto mb-4"
        />
        
        <h4 className="font-semibold text-lg mb-1">Prince Miyako</h4>
        <p className="text-sm text-gray-100 mb-3">Blogger/Photographer</p>

        <div className="flex justify-center items-center space-x-2 mb-4">
          <img
            src="/Stars.png"
            alt="Stars"
            className="w-24 h-auto"
          />
          <span className="text-sm text-gray-100">(1 Review)</span>
        </div>

        <p className="text-sm text-gray-100 mb-5">
          Food photography and honest reviews from the FoodTuck kitchen—new launches, seasonal picks, and quick tips for ordering smarter.
        </p>

        <div className="flex justify-center space-x-4">
          <img src="/Facebook.png" alt="Facebook" className="w-2 h-3"/>
          <img src="/Twitter.png" alt="Twitter" className="w-3 h-3"/>
          <img src="/Insta.png" alt="Insta" className="w-3 h-3"/>
          <img src="/Pinterest.png" alt="Pinterest" className="w-3 h-3"/>
        </div>
      </div>


      {/* Recent Posts */}
      <div className="p-5 border border-gray-300 rounded-lg">
        <h4 className="text-lg font-semibold mb-4">Recent Posts</h4>
        <ul>
          {recentPosts.map((post, idx) => (
            <li key={idx} className="flex items-center space-x-3 mb-3">
              <img
                src={post.img}
                alt={post.title}
                className="w-12 h-12 object-cover rounded-lg"
              />
              <div>
                <p className="text-xs text-gray-100">{post.date}</p>
                <p className="text-sm">{post.title}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Filter By Menu */}
      <div className="p-5 border border-gray-300 rounded-lg">
        <h4 className="text-lg font-semibold mb-4">Filter by Menu</h4>
        <ul>
          {menuItems.map((item, idx) => (
            <li
              key={idx}
              className="flex items-center justify-between mb-3"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={item.icon}
                  alt={item.label}
                  className="w-8 h-8 object-cover"
                />
                <span>{item.label}</span>
              </div>
              <span className="text-gray-100 pl-4">{item.count}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Product Tags */}
      <div className="p-5 border border-gray-300 rounded-lg">
        <h4 className="text-lg font-semibold mb-4">Popular Tags</h4>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, idx) => (
            <span
              key={idx}
              className="px-3 py-2 mb-2 border border-gray-300 text-sm text-gray-100 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Photo Gallery */}
      <div className="p-5 border border-gray-300 rounded-lg">
        <h4 className="text-lg font-semibold mb-4">Photo Gallery</h4>
        <div className="grid grid-cols-3 gap-3">
          {galleryPhotos.map((photo, idx) => (
            <div key={idx} className="relative group">
              <div className="aspect-w-1 aspect-h-1">
                <img
                  src={photo}
                  alt={`Gallery ${idx + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <img src="/EyeIconOnBlog.png" alt="View" className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* Follow Us */}
      <div className="p-5 border border-gray-300 rounded-lg">
        <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
        <div className="flex justify-center gap-4">
          {[
            { name: "Facebook", src: "/Facebook.png" },
            { name: "Twitter", src: "/Twitter.png" },
            { name: "Pinterest", src: "/Pinterest.png" },
            { name: "Instagram", src: "/Instagram.png" },
          ].map((icon) => (
            <a
              key={icon.name}
              href="#"
              aria-label={icon.name}
              className="w-10 h-10 rounded-md bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center"
            >
              <img src={icon.src} alt={icon.name} className="w-4 h-4" />
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default SidebarOnBlog;
