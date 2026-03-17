"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "../src/app/Context/CartContext";
import { FaChevronDown } from "react-icons/fa";

interface NavbarProps {
  children?: React.ReactNode; // Accept children as a prop
}

const Navbar: React.FC<NavbarProps> = ({ children }) => {
  const router = useRouter();
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // State for search input

  const { cart } = useCart(); // Access the cart context
  const userDropdownRef = useRef<HTMLDivElement | null>(null);
  const aboutDropdownRef = useRef<HTMLDivElement | null>(null);
  const searchDropdownRef = useRef<HTMLDivElement | null>(null);
  const navRef = useRef<HTMLDivElement | null>(null);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);


  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Handle Search Submit
  const handleSearch = () => {
    if (searchTerm.trim()) {
      router.push(`/Shop?search=${encodeURIComponent(searchTerm.trim())}`);
      setIsSearchDropdownOpen(false); // Close dropdown after search
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        aboutDropdownRef.current &&
        !aboutDropdownRef.current.contains(event.target as Node)
      ) {
        setIsAboutDropdownOpen(false);
      }
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setIsUserDropdownOpen(false);
      }
      if (
        searchDropdownRef.current &&
        !searchDropdownRef.current.contains(event.target as Node)
      ) {
        setIsSearchDropdownOpen(false);
      }
      if (
        navRef.current &&
        !navRef.current.contains(event.target as Node) &&
        isMobileMenuOpen
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // Close all dropdowns when mobile menu is toggled
  useEffect(() => {
    if (!isMobileMenuOpen) {
      setIsUserDropdownOpen(false);
      setIsAboutDropdownOpen(false);
      setIsSearchDropdownOpen(false);
    }
  }, [isMobileMenuOpen]);

  return (
    <div className="bg-black text-white relative">
      {/* Foodtruck Heading */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 ">
        <span className="text-3xl font-bold text-[#FF9F0D]">
          Food<span className="text-white">tuck</span>
        </span>
      </div>

      {/* Navigation Bar */}
      <div className="container mx-auto flex justify-between items-center py-2 px-6 pt-14">
        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-white font-bold text-2xl"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Mobile Menu"
        >
          ☰
        </button>

        {/* Navigation Links */}
        <nav
          ref={navRef}
          className={`${
            isMobileMenuOpen ? "block" : "hidden"
          } absolute top-full left-0 w-full bg-black shadow-lg lg:flex lg:static lg:bg-transparent lg:w-auto lg:shadow-none lg:items-center z-[100] opacity-90`}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-8 w-full lg:w-auto">
            <Link
              href="/"
              className="block lg:inline-block text-white font-bold py-2 lg:py-0 px-4 lg:px-0 hover:text-[#FF9F0D]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/MenuPage"
              className="block lg:inline-block text-white font-bold py-2 lg:py-0 px-4 lg:px-0 hover:text-[#FF9F0D]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Menu
            </Link>
            <Link
              href="/Blog"
              className="block lg:inline-block text-white font-bold py-2 lg:py-0 px-4 lg:px-0 hover:text-[#FF9F0D]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Blog
            </Link>

            {/* About Dropdown */}
            <div ref={aboutDropdownRef} className="relative">
              <button
                className=" lg:inline-block text-white font-bold py-2 lg:py-0 px-4 lg:px-0 hover:text-[#FF9F0D]"
                onClick={() => setIsAboutDropdownOpen(!isAboutDropdownOpen)}
              >
                About <FaChevronDown className="ml-1 inline text-sm transition-transform hover:rotate-180" />
              </button>
              {isAboutDropdownOpen && (
                <div className="absolute left-0 top-full bg-black text-white font-bold py-4 px-6 rounded-md shadow-md space-y-2 w-40 z-[200]">
                  <Link href="/About" className="block hover:text-[#FF9F0D]" onClick={() => setIsAboutDropdownOpen(false)}>
                    About Us
                  </Link>
                  <Link href="/OurChef" className="block hover:text-[#FF9F0D]" onClick={() => setIsAboutDropdownOpen(false)}>
                    Our Chef
                  </Link>
                  <Link href="/FAQ" className="block hover:text-[#FF9F0D]" onClick={() => setIsAboutDropdownOpen(false)}>
                    FAQ
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/Shop"
              className="block lg:inline-block text-white font-bold py-2 lg:py-0 px-4 lg:px-0 hover:text-[#FF9F0D]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Shop
            </Link>
            <Link
              href="/Contact"
              className="block lg:inline-block text-white font-bold py-2 lg:py-0 px-4 lg:px-0 hover:text-[#FF9F0D]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>
          </div>
        </nav>

        {/* Right Section: User, Basket, and Search Icons */}
        <div className="flex items-center space-x-6">
          {/* Search Dropdown */}
          <div ref={searchDropdownRef} className="relative inline-block">
            <button
              className="relative transition-transform duration-200 hover:scale-125 focus:outline-none focus:ring-[#FF9F0D]"
              onClick={() => setIsSearchDropdownOpen(!isSearchDropdownOpen)}
            >
              <Image
                src="/Search.png"
                alt="Search"
                className="mt-2"
                width={22}
                height={22}
              />
            </button>
            {isSearchDropdownOpen && (
              <div className="absolute right-0 mt-2 bg-black text-black font-bold rounded-md shadow-lg p-4 w-64 transition-opacity duration-300 ease-in-out opacity-100 z-[200]">
                <input
                  type="text"
                  placeholder="Search for items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#FF9F0D]"
                />
                <button
                  onClick={handleSearch}
                  className="mt-2 bg-[#FF9F0D] text-white py-2 px-4 w-full rounded-md hover:bg-[#ff9f0db8]"
                >
                  Search
                </button>
              </div>
            )}
          </div>

          {/* User Dropdown */}
          <div ref={userDropdownRef} className="relative inline-block">
            <button
              className="flex items-center transition-transform duration-200 hover:scale-125"
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
            >
              <Image
                src="/user.png"
                alt="user"
                className="h-6 w-6 cursor-pointer"
                width={24}
                height={24}
              />
              <FaChevronDown className="ml-1 text-sm transition-transform hover:rotate-180" />
            </button>

            {isUserDropdownOpen && (
              <div className="absolute bg-black text-white font-bold py-2 mt-2 rounded-md shadow-lg right-0 z-[200] transition-transform duration-200 ease-in-out">
                <Link
                  href="/Login"
                  className="block px-6 py-2 hover:bg-[#FF9F0D] hover:text-black transition-all duration-200 ease-in-out"
                  onClick={() => setIsUserDropdownOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/Signup"
                  className="block px-6 py-2 hover:bg-[#FF9F0D] hover:text-black transition-all duration-200 ease-in-out"
                  onClick={() => setIsUserDropdownOpen(false)}
                >
                  Signup
                </Link>
                <Link
                  href="/track"
                  className="block px-6 py-2 hover:bg-[#FF9F0D] hover:text-black transition-all duration-200 ease-in-out"
                  onClick={() => setIsUserDropdownOpen(false)}
                >
                  Track Order
                </Link>
                <Link
                  href="/Checkout"
                  className="block px-6 py-2 hover:bg-[#FF9F0D] hover:text-black transition-all duration-200 ease-in-out"
                  onClick={() => setIsUserDropdownOpen(false)}
                >
                  Checkout
                </Link>
                <Link
                  href="/Logout"
                  className="block px-6 py-2 hover:bg-[#FF9F0D] hover:text-black transition-all duration-200 ease-in-out"
                  onClick={() => setIsUserDropdownOpen(false)}
                >
                  Logout
                </Link>
              </div>
            )}
          </div>

          {/* Basket Icon with Cart Count */}
          <Link
            href="/Cart"
            className="relative transition-transform duration-200 hover:scale-125"
          >
            <Image
              src="/Handbag.png"
              alt="Basket Icon"
              width={28}
              height={28}
              priority unoptimized
              className="cursor-pointer"
            />
            {isClient && totalCartItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#FF9F0D] text-black text-xs font-bold rounded-full px-2 py-1 animate-pulse">
                {totalCartItems}
              </span>
            )}

          </Link>

          {/* Render children (e.g., LanguageSwitcher) */}
          {children}
        </div>
      </div>
    </div>
  );
};

export default Navbar;