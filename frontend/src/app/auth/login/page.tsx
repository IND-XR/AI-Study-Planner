'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();

  const [enrollmentNumber, setEnrollmentNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    if (!enrollmentNumber || !password) {
      toast.error('Please fill all fields');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          enrollmentNumber,
          password,
        }),
      });

      const data = await res.json();


console.log("LOGIN RESPONSE:", data);


const user = data?.data?.data?.user || data?.data?.user || data?.user;
const token = data?.data?.data?.accessToken || data?.data?.accessToken || data?.accessToken;
// const user = data?.data?.user;
// const token = data?.data?.accessToken;

console.log("Full Resposnse:",JSON.stringify(data,null,2));

console.log("USER:", user);
console.log("Token:",token);


// const user = data?.user;
// const token = data?.accessToken;

// ❌ ERROR HANDLING
if (!user || !token) {
  console.log('❌ INVALID RESPONSE:', data);
  toast.error(data?.message || 'Login failed');
  //setLoading(false);
  return;
}

// ✅ DEBUG (optional)
console.log('✅ Login success:', user.enrollmentNumber, user.role);

// ✅ SAVE (CORRECT WAY)
localStorage.setItem('accessToken', token);
localStorage.setItem('user', JSON.stringify(user));

// ✅ SUCCESS
toast.success('Login successful 🚀');

// ✅ ROLE SAFE (IMPORTANT)
const role = user?.role?.toUpperCase() || 'STUDENT';


setTimeout(() => {
  if( role === 'ADMIN') {
    router.replace('/admin');
  }else{
    router.replace('/dashboard');
  }
},200);


console.log("Redirecting to:", user.role);
      
    } catch (error) {
      console.error('Login Error:', error);
      toast.error('Network error or server not running');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdf6f0] flex">

      {/* LEFT SIDE */}
      <div className="hidden lg:flex w-1/2 flex-col px-16 py-10">

        {/* Navbar */}
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-xl font-semibold flex items-center gap-2">
            📚 <span>AI Study Planner</span>
          </h1>

          <div className="flex gap-8 text-gray-600">
            <span className="cursor-pointer hover:text-black">Features</span>
            <span className="cursor-pointer hover:text-black">Pricing</span>
            <span className="cursor-pointer hover:text-black">Contact</span>
          </div>

          <button className="bg-orange-500 text-white px-4 py-2 rounded-lg">
            Login
          </button>
        </div>

        {/* Hero */}
        <div className="flex flex-col justify-center flex-1">
          <h2 className="text-5xl font-bold text-gray-800 mb-6 leading-tight">
            AI-Powered Study Planner
          </h2>

          <p className="text-gray-600 text-lg mb-8">
            Get organized, stay focused, and improve your grades
            with an AI-generated study timetable.
          </p>

          <button className="bg-orange-500 text-white px-6 py-3 rounded-xl w-44 shadow-md hover:bg-orange-600 transition">
            Get Started
          </button>

          <p className="mt-6 text-sm text-gray-500">
            ⭐⭐⭐⭐⭐ Trusted by students
          </p>
        </div>
      </div>

      {/* RIGHT SIDE LOGIN */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6">

        <div className="bg-white/70 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-xl p-10 w-full max-w-md">

          <div className="text-center mb-6">
            <h1 className="text-xl font-semibold">📚 AI Study Planner</h1>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Welcome back
          </h2>

          <p className="text-gray-500 mb-6">
            Sign in to your account to continue
          </p>

          <form onSubmit={handleLogin} className="space-y-4">

            <input
              type="text"
              placeholder="University ID"
              value={enrollmentNumber}
              onChange={(e) => setEnrollmentNumber(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            />

            <div className="text-right">
              <span className="text-sm text-orange-500 cursor-pointer hover:underline">
                Forgot password?
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-xl font-semibold shadow-md hover:opacity-90 transition"
            >
              {loading ? 'Signing In...' : 'Sign In →'}
            </button>

          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            Don’t have an account?{' '}
            <span className="text-orange-500 cursor-pointer hover:underline">
              Sign up
            </span>
          </div>

          <div className="mt-6 text-center text-xs text-gray-400">
            🔒 Secured • Powered by AI
          </div>

        </div>
      </div>
    </div>
  );
}
