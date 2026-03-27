'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [selectedCollege, setSelectedCollege] = useState<string>('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Get selected college from localStorage
    const college = localStorage.getItem('selectedCollege');
    if (college) {
      setSelectedCollege(college);
    } else {
      // If no college selected, redirect back to home
      router.push('/');
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      alert('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      alert('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);

    try {
      // Registration logic would go here
      alert('Account created! Please check your email to verify.');
      router.push('/auth/login');
    } catch (error: any) {
      const message =
        'Registration failed. Please try again.';
      alert(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-blue-900 to-black flex items-center justify-center p-4">
      {/* Gradient Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-block w-14 h-14 bg-gradient-to-br from-orange-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-2xl mb-4">
            🧠
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">AI Study Planner</h1>
          <p className="text-gray-300">Create your account to get started</p>
        </div>

        {/* College Display */}
        {selectedCollege && (
          <div className="bg-white/10 backdrop-blur-sm border border-orange-500/30 p-4 rounded-lg mb-6 text-center">
            <p className="text-gray-400 text-sm mb-1">Studying at</p>
            <p className="text-orange-400 font-semibold text-lg">{selectedCollege}</p>
            <button
              onClick={() => {
                localStorage.removeItem('selectedCollege');
                router.push('/');
              }}
              className="text-xs text-gray-400 hover:text-orange-400 mt-2 transition-colors"
            >
              Change college
            </button>
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-xl border border-orange-500/30 p-8 rounded-2xl space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-black/50 border border-orange-400/50 text-white rounded-lg focus:outline-none focus:border-orange-400 transition-colors placeholder-gray-500"
              placeholder="you@example.com"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-black/50 border border-orange-400/50 text-white rounded-lg focus:outline-none focus:border-orange-400 transition-colors placeholder-gray-500"
              placeholder="••••••••"
              disabled={isLoading}
            />
            <p className="text-xs text-gray-400 mt-2">At least 8 characters required</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-2">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-black/50 border border-orange-400/50 text-white rounded-lg focus:outline-none focus:border-orange-400 transition-colors placeholder-gray-500"
              placeholder="••••••••"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        {/* Sign In Link */}
        <div className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-orange-400 hover:text-orange-300 font-semibold transition-colors">
            Sign in
          </Link>
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
          <p className="text-xs text-gray-300">
            💡 <span className="font-medium text-orange-300">Tip:</span> Use your college email for better organization and features
          </p>
        </div>
      </div>
    </div>
  );
}
