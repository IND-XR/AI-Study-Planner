'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import CollegeSelector from '@/components/CollegeSelector';

export default function Home() {
  const router = useRouter();
  const [showCollegeSelector, setShowCollegeSelector] = useState(false);

  const handleContinue = (college: string) => {
    // Store selected college in localStorage
    if (college === 'other') {
      setShowCollegeSelector(true);
    } else {
      localStorage.setItem('selectedCollege', college);
      // Redirect to login page
      router.push('/auth/login');
    }
  };

  return (
    <main className="min-h-screen bg-black">
      <Navbar />
      <HeroSection onContinue={handleContinue} showCollegeSelector={showCollegeSelector} />
      {showCollegeSelector && <CollegeSelector onBack={() => setShowCollegeSelector(false)} onSelect={handleContinue} />}
      
      {/* Bottom Navigation Tabs */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur border-t border-orange-500/20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center items-center h-16 gap-12">
          <button className="text-gray-400 hover:text-white font-medium flex items-center gap-2 transition-colors">
            Dashboard
            <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
          </button>
          <button className="text-gray-400 hover:text-white font-medium flex items-center gap-2 transition-colors">
            Planner Features
            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
          </button>
          <button className="text-gray-400 hover:text-white font-medium transition-colors">
            Testimonials
          </button>
        </div>
      </div>
    </main>
  );
}
