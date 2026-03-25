'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Sparkles } from 'lucide-react';

interface CollegeSelectorProps {
  onBack: () => void;
  onSelect: (college: string) => void;
}

export default function CollegeSelector({ onBack, onSelect }: CollegeSelectorProps) {
  const router = useRouter();
  const [customCollege, setCustomCollege] = useState('');
  const [error, setError] = useState('');

  const handleContinue = () => {
    if (!customCollege.trim()) {
      setError('Please enter your college name');
      return;
    }

    localStorage.setItem('selectedCollege', customCollege);
    router.push('/auth/login');
  };

  return (
    <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      {/* Animated gradient background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-500/20 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-500/20 to-transparent rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-gradient-to-br from-slate-900 to-purple-900/50 border border-purple-500/30 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="flex items-center gap-2 mb-6">
            <button
              onClick={onBack}
              className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors"
              title="Go back"
            >
              <ArrowLeft className="w-5 h-5 text-gray-400" />
            </button>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-purple-400 bg-clip-text text-transparent flex-1">
              Your College
            </h2>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-orange-500/10 to-purple-500/10 border border-orange-500/30 mb-6">
            <Sparkles className="w-3 h-3 text-orange-400" />
            <span className="text-xs font-medium text-orange-300">Custom College</span>
          </div>

          {/* Description */}
          <p className="text-gray-400 mb-6">
            Your college wasn't in our list? No problem! Enter your college name to continue with the AI Study Planner.
          </p>

          {/* Input Field */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">College Name</label>
            <input
              type="text"
              value={customCollege}
              onChange={(e) => {
                setCustomCollege(e.target.value);
                setError('');
              }}
              placeholder="e.g., SRM University, VIT Vellore"
              className="w-full px-4 py-3 bg-slate-800/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-colors"
            />
            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
          </div>

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            className="w-full py-3 bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105 active:scale-95 shadow-lg"
          >
            Continue to Dashboard
          </button>

          <button
            onClick={onBack}
            className="w-full py-2 mt-3 text-gray-400 hover:text-white font-medium transition-colors"
          >
            Back to College List
          </button>
        </div>
      </div>
    </div>
  );
}
