import Link from "next/link";
import styles from "./Navbar.module.css";
import { use } from "react";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <nav className="sticky top-4 z-10 mb-1 text-[16px] font-'Space Grotesk' sans-serif tracking-wide text-orange-300/80">
      {/* shadow-[0_8px_32px_rgba(255,120,0,0.1)]  bg-black/30  backdrop-blr-1xs  border-b border-orange-900/20 */}

      <div
        className={`max-w-10xl mx-auto px-20 sm:px-9 lg:px-30 flex items-center justify-between h-26 transition-all duration-100 ${scrolled ? "-translate-x-[200%]" : "translate-x-0"}`}
      >
        <div className="flex justify-items-start  h-20">
          {/* Logo Section */}
          <Link
            href="/"
            className={`flex items-center justify-start gap-1 ${styles.logoContainer} transition-all duration-300 group`}
          >
            <svg
              className="w-10 h-15"
              viewBox="20 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ff6a00" />

                  <stop offset="100%" stopColor="#ff9a3c" />
                </linearGradient>
              </defs>

              <path
                  d="M60 5C37.9086 5 20 22.9086 20 45C20 67.0914 37.9086 85 60 85C82.0914 85 100 67.0914 100 45C100 22.9086 82.0914 5 60 5ZM60 15C73.8071 15 85 26.1929 85 40C85 53.8071 73.8071 65 60 65C46.1929 65 35 53.8071 35 40C35 26.1929 46.1929 15 60 15ZM60 25C52.2688 25 45.7143 31.5545 45.7143 39.2857C45.7143 47.0168 52.2688 53.5714 60 53.5714C67.7312 53.5714 74.2857 47.0168 74.2857 39.2857C74.2857 31.5545 67.7312 25 60 25Z"

                // d="M60 5C37.9086 10 20 22.9086 20 45C20 67.0914 37.9086 85 60 85C82.0914 85 100 67.0914 100 45C100 22.9086 82.0914 5 60 5ZM60 15C73.8071 10 85 26.1929 85 40C85 53.8071 73.8071 65 60 65C46.1929 65 35 53.8071 35 40C35 26.1929 46.1929 15 60 15ZM60 25C52.2688 25 45.7143 31.5545 45.7143 39.2857C45.7143 47.0168 52.2688 53.5714 60 53.5714C67.7312 53.5714 74.2857 47.0168 74.2857 39.2857C74.2857 31.5545 67.7312 25 60 25Z"
                fill="url(#logoGrad)"
              />
              
            </svg>
            {/* <span >
  <img
    src="/brain-logo.png"
    alt="logo"  
    className=" h-14 w-15 object-contain"
  />
</span> */}
            {/* <span className="text-xl font-bold bg-gradient-to-r from-orange-400 to-purple-400 bg-clip-text text-transparent">
              AI Study Planner
            </span> */}
          </Link>

          {/* Center Menu */}
          {/* <div className="hidden lg:flex items-center gap-10 text-lg font-semibold tracking-wide px-100" > */}
          {/* <div className="hidden lg:flex items-center gap-8 text-[16px] font-medium tracking-wide px-20 backdrop-blur-md"> */}
          {/* <div className="hidden lg:flex items-center gap-25 text-[20px] font-semibold tracking-wide px-50"> */}

          <div
            className="hidden lg:flex items-center gap-6 text-[16px] font-semibold tracking-wide 
px-6 py-3 
bg-black/40 backdrop-blur-xl 
border border-white/10 
rounded-full 
shadow-[0_0_25px_rgba(255,120,0,0.08)]"
          >
            {["Dashboard", "Planner Features", "Testimonials", "Pricing"].map((item, idx) => {
              const isActive = item === "Dashboard";

              return (
                <div key={item} className="flex items-center">
                  <Link
                    href="/coming-soon"
                    className={`relative px-4 py-3 text-sm font-sans-serif tracking-wide transition-all duration-300 group rounded-full
           ${isActive ? "bg-orange-500/20 text-orange-400" : "text-gray-300 hover:text-white"}
          `}
                  >
                    {/* Hover background */}
                    <span className="absolute inset-0 rounded-full bg-orange-500/10 opacity-0 transition duration-300 group-hover:opacity-100   animate-pulse">
                      {/* {<span className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-purple-400 rounded-full blur-lg opacity-50 animate-pulse" />} */}
                    </span>

                    {/* Text */}
                    <span className="relative z-10 group-hover:text-orange-200 transition duration-300">
                      {item}
                    </span>

                    {/* underline */}
                    <span className="absolute left-2 right-2 -bottom-1 h-[2px] bg-gradient-to-r from-orange-400 to-orange-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                  </Link>

                  {idx < 3 && (
                    <div className="h-6 w-[1px] mx-3 bg-gradient-to-b from-transparent via-orange-500/30 to-transparent"></div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Section - Empty for now */}
          <div />
          <div />
        </div>
      </div>
    </nav>
  );
}
