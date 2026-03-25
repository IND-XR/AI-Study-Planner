
'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, Star, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  onContinue: (college: string) => void;
  showCollegeSelector: boolean;
}

const COLLEGES = [
  'Lovely Professional University',
  'Delhi University',
  'Chandigarh University',
  'IIT Delhi',
  'Amity University',
  'Other Colleges',
];

export default function HeroSection({ onContinue, showCollegeSelector }: HeroSectionProps) {
  const [selectedCollege, setSelectedCollege] = useState('Lovely Professional University');
  const [isOpen, setIsOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // ✅ SSR SAFE CHECK
  const isClient = typeof window !== 'undefined';

  // ✅ SAFE MOUSE TRACKING
  useEffect(() => {
    if (!isClient) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isClient]);

  const handleSelect = (college: string) => {
    setSelectedCollege(college);
    setIsOpen(false);

    if (college === 'Other Colleges') {
      onContinue('other');
    } else {
      onContinue(college);
    }
  };

  const handleStartPlanning = () => {
    if (selectedCollege === 'Other Colleges') {
      onContinue('other');
    } else {
      onContinue(selectedCollege);
    }
  };

  if (showCollegeSelector) {
    return null;
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden pt-20 pb-20 perspective">

      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full blur-3xl opacity-20 animate-blob" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-500 to-purple-600 rounded-full blur-3xl opacity-20 animate-blob" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/3 left-1/2 w-96 h-96 bg-gradient-to-r from-orange-500 to-purple-500 rounded-full blur-3xl opacity-10 animate-blob" style={{ animationDelay: '4s' }} />
      </div>

      {/* Mouse Light */}
      <div
        className="absolute w-96 h-96 bg-gradient-to-br from-orange-400/30 to-transparent rounded-full blur-3xl pointer-events-none"
        style={{
          left: mousePos.x - 192,
          top: mousePos.y - 192,
          transition: 'all 0.3s ease-out',
        }}
      />

      {/* Content */}
      <div
        className="relative z-10 text-center max-w-3xl mx-auto"
        style={{
          perspective: '1000px',
          transform: isClient
            ? `rotateX(${(mousePos.y - window.innerHeight / 2) * 0.01}deg) rotateY(${(mousePos.x - window.innerWidth / 2) * 0.01}deg)`
            : 'none',
          transition: 'transform 0.3s ease-out',
        }}
      >

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/20 to-purple-500/20 border border-orange-500/50 mb-8 backdrop-blur-sm">
          <Sparkles className="w-4 h-4 text-orange-400 animate-spin" style={{ animationDuration: '3s' }} />
          <span className="text-sm font-medium bg-gradient-to-r from-orange-300 to-orange-400 bg-clip-text text-transparent">
            Powered by Advanced AI
          </span>
        </div>

        {/* Title */}
        <h1 className="text-6xl sm:text-7xl font-bold text-white mb-4">
          🧠 AI Powered Study Planner
        </h1>

        <p className="text-xl text-gray-300 mb-12">
          Generate AI-tailored study timetables for your college exams.
        </p>

        {/* Dropdown */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-10">

          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="px-6 py-3 bg-white/10 border rounded-xl text-white flex items-center gap-3"
            >
              {selectedCollege}
              <ChevronDown className={`w-5 h-5 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
              <div className="absolute mt-2 bg-black/50 rounded-xl w-72">
                {COLLEGES.map((college) => (
                  <button
                    key={college}
                    onClick={() => handleSelect(college)}
                    className="block w-full text-left px-4 py-2 hover:bg-orange-500/30 text-white"
                  >
                    {college}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleStartPlanning}
            className="px-8 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600"
          >
            Start Planning ✨
          </button>

        </div>

        {/* Stars */}
        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4].map((i) => (
            <Star key={i} className="w-6 h-6 text-orange-500 fill-orange-500" />
          ))}
        </div>

      </div>
    </section>
  );
}

// 'use client';

// import { useState, useEffect } from 'react';
// import { ChevronDown, Star, Sparkles } from 'lucide-react';

// interface HeroSectionProps {
//   onContinue: (college: string) => void;
//   showCollegeSelector: boolean;
// }

// const COLLEGES = [
//   'Lovely Professional University',,
//   'Other Colleges',
// ];

// export default function HeroSection({ onContinue, showCollegeSelector }: HeroSectionProps) {
//   const [selectedCollege, setSelectedCollege] = useState('Lovely Professional University');
//   const [isOpen, setIsOpen] = useState(false);
//   const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

//   useEffect(() => {
//     const handleMouseMove = (e: MouseEvent) => {
//       setMousePos({ x: e.clientX, y: e.clientY });
//     };
//     window.addEventListener('mousemove', handleMouseMove);
//     return () => window.removeEventListener('mousemove', handleMouseMove);
//   }, []);

//   const handleSelect = (college: string) => {
//     setSelectedCollege(college);
//     setIsOpen(false);
    
//     if (college === 'Other Colleges') {
//       onContinue('other');
//     } else {
//       onContinue(college);
//     }
//   };

//   const handleStartPlanning = () => {
//     if (selectedCollege === 'Other Colleges') {
//       onContinue('other');
//     } else {
//       onContinue(selectedCollege);
//     }
//   };

//   if (showCollegeSelector) {
//     return null;
//   }

//   return (
//     <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden pt-20 pb-20 perspective">
//       {/* Animated gradient background with 3D effect */}
//       <div className="absolute inset-0 overflow-hidden">
//         {/* Floating light orbs */}
//         <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full blur-3xl opacity-20 animate-blob" />
//         <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-500 to-purple-600 rounded-full blur-3xl opacity-20 animate-blob" style={{ animationDelay: '2s' }} />
//         <div className="absolute top-1/3 left-1/2 w-96 h-96 bg-gradient-to-r from-orange-500 to-purple-500 rounded-full blur-3xl opacity-10 animate-blob" style={{ animationDelay: '4s' }} />
//       </div>

//       {/* Mouse-following gradient light */}
//       <div
//         className="absolute w-96 h-96 bg-gradient-to-br from-orange-400/30 to-transparent rounded-full blur-3xl pointer-events-none"
//         style={{
//           left: mousePos.x - 192,
//           top: mousePos.y - 192,
//           transition: 'all 0.3s ease-out',
//         }}
//       />

//       {/* Content with 3D perspective */}
//       <div className="relative z-10 text-center max-w-3xl mx-auto" style={{
//         perspective: '1000px',
//         transform: `rotateX(${(mousePos.y - window.innerHeight / 2) * 0.01}deg) rotateY(${(mousePos.x - window.innerWidth / 2) * 0.01}deg)`,
//         transition: 'transform 0.3s ease-out',
//       }}>
//         {/* Badge with animation */}
//         <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/20 to-purple-500/20 border border-orange-500/50 mb-8 backdrop-blur-sm
//           transform hover:scale-105 hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300 cursor-pointer">
//           <Sparkles className="w-4 h-4 text-orange-400 animate-spin" style={{ animationDuration: '3s' }} />
//           <span className="text-sm font-medium bg-gradient-to-r from-orange-300 to-orange-400 bg-clip-text text-transparent">Powered by Advanced AI</span>
//         </div>

//         {/* Main Title with 3D effect */}
//         <div className="mb-8 transform hover:scale-105 transition-transform duration-300" style={{
//           perspective: '1000px',
//         }}>
//           <h1 className="text-6xl sm:text-7xl font-bold text-white flex items-center gap-4 justify-center mb-4">
//             <span className="text-5xl animate-bounce" style={{ animationDuration: '2s' }}>🧠</span>
//             <span className="bg-gradient-to-r from-orange-300 via-orange-400 to-orange-500 bg-clip-text text-transparent drop-shadow-lg">
//               AI Powered Study Planner
//             </span>
//           </h1>
//         </div>

//         {/* Subtitle with fade-in animation */}
//         <p className="text-xl text-gray-300 mb-12 animate-fade-in">
//           Generate AI-tailored study timetables for your college exams.
//         </p>

//         {/* College Selection and Button with glass effect */}
//         <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-10 transform hover:scale-105 transition-transform duration-300">
//           {/* College Dropdown with glassmorphism */}
//           <div className="relative w-full sm:w-auto group">
//             <button
//               onClick={() => setIsOpen(!isOpen)}
//               className="w-full sm:w-auto px-6 py-3 bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-2xl text-white font-medium
//                 flex items-center justify-between hover:border-orange-500/50 hover:bg-white/20 transition-all duration-300
//                 shadow-2xl hover:shadow-orange-500/50 group-hover:shadow-orange-500/50 transform group-hover:scale-105"
//             >
//               <span className="flex items-center gap-3">
//                 <span className="w-6 h-6 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white text-sm font-bold">◆</span>
//                 {selectedCollege}
//               </span>
//               <ChevronDown className={`w-5 h-5 ml-3 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
//             </button>

//             {/* Dropdown Menu with animation */}
//             {isOpen && (
//               <div className="absolute top-full left-0 right-0 mt-3 bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden z-20 w-80
//                 animate-in fade-in zoom-in duration-200">
//                 {COLLEGES.map((college, i) => (
//                   <button
//                     key={college}
//                     onClick={() => handleSelect(college)}
//                     className="w-full text-left px-6 py-3 text-gray-300 hover:bg-gradient-to-r hover:from-orange-500/30 hover:to-purple-500/30
//                       hover:text-white transition-all duration-200 border-b border-white/10 last:border-b-0 group"
//                     style={{ transitionDelay: `${i * 50}ms` }}
//                   >
//                     <span className="flex items-center gap-2 group-hover:translate-x-2 transition-transform duration-300">
//                       <span className="w-2 h-2 bg-orange-500 rounded-full group-hover:scale-150 transition-transform" />
//                       {college}
//                     </span>
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Start Planning Button with 3D effect */}
//           <button
//             onClick={handleStartPlanning}
//             className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500
//               text-white font-semibold rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-orange-500/50
//               transform hover:scale-110 active:scale-95 relative overflow-hidden group"
//           >
//             <span className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//             <span className="relative flex items-center justify-center gap-2">
//               Start Planning
//               <Sparkles className="w-4 h-4" />
//             </span>
//           </button>
//         </div>

//         {/* Trust Section with staggered animation */}
//         <div className="mt-12 pt-8 border-t border-white/10 backdrop-blur-sm rounded-t-3xl">
//           <p className="text-gray-400 text-sm mb-4 animate-fade-in">Trusted by thousands of students</p>
//           <div className="flex justify-center gap-2">
//             {[1, 2, 3, 4].map((i) => (
//               <div
//                 key={i}
//                 className="transform hover:scale-125 transition-transform duration-300"
//                 style={{ transitionDelay: `${i * 100}ms` }}
//               >
//                 <Star className="w-6 h-6 fill-orange-500 text-orange-500 drop-shadow-lg" />
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* 3D Floating cards in background */}
//       <div className="absolute inset-0 pointer-events-none">
//         <div className="absolute top-1/4 right-12 w-32 h-40 bg-gradient-to-br from-orange-500/10 to-transparent rounded-2xl border border-orange-500/30
//           backdrop-blur-sm transform hover:scale-110 transition-transform duration-300 animate-float" />
//         <div className="absolute bottom-1/4 left-12 w-32 h-40 bg-gradient-to-tr from-purple-500/10 to-transparent rounded-2xl border border-purple-500/30
//           backdrop-blur-sm transform hover:scale-110 transition-transform duration-300 animate-float" style={{ animationDelay: '2s' }} />
//       </div>
//     </section>
//   );
// }
