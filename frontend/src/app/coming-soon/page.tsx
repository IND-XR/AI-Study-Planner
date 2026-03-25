'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ComingSoon() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-black to-orange-950/20 flex flex-col items-center justify-center px-6">
      {/* Background gradient orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-orange-600/10 rounded-full blur-3xl animate-pulse" />

      {/* Content */}
      <div className="relative z-10 text-center max-w-2xl">
        {/* Icon */}
        <div className="mb-8 inline-block p-4 rounded-full bg-orange-500/10 border border-orange-500/30">
          <svg
            className="w-16 h-16"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="comingSoonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff6a00" />
                <stop offset="100%" stopColor="#ff9a3c" />
              </linearGradient>
            </defs>
            <path
              d="M50 10C28 10 10 28 10 50C10 72 28 90 50 90C72 90 90 72 90 50C90 28 72 10 50 10ZM50 20C66 20 80 34 80 50C80 66 66 80 50 80C34 80 20 66 20 50C20 34 34 20 50 20Z"
              fill="url(#comingSoonGrad)"
            />
            <circle cx="50" cy="45" r="4" fill="url(#comingSoonGrad)" />
            <path d="M50 50V65" stroke="url(#comingSoonGrad)" strokeWidth="2" strokeLinecap="round" />
            <path d="M50 30V35" stroke="url(#comingSoonGrad)" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-orange-400 via-orange-300 to-orange-500 bg-clip-text text-transparent">
          Coming Soon
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-gray-300 mb-4">
          We're working on something amazing for you!
        </p>

        {/* Description */}
        <p className="text-gray-400 mb-12 leading-relaxed">
          This feature is currently under development. Our team is crafting an incredible experience to help you achieve your academic goals.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/"
            className="px-8 py-3 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold hover:shadow-lg hover:shadow-orange-500/50 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>

          <div className="px-8 py-3 rounded-full border border-orange-500/50 text-orange-300 font-semibold hover:bg-orange-500/10 transition-all duration-300">
            Notify Me
          </div>
        </div>

        {/* Progress indicator */}
        <div className="inline-block bg-black/40 border border-orange-500/30 rounded-full px-6 py-3 backdrop-blur-md">
          <p className="text-sm text-gray-400">
            <span className="text-orange-400 font-semibold">Coming in Q2 2026</span>
          </p>
        </div>
      </div>

      {/* Floating particles effect */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-orange-400/40 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              opacity: Math.random() * 0.5 + 0.25,
            }}
          />
        ))}
      </div>
    </div>
  );
}
