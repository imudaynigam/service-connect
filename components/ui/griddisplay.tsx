import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { ChevronLeft, Mountain, Edit2 } from 'lucide-react';

const GridDisplay: React.FC = () => {
  const [mode, setMode] = useState<'main' | 'additional'>('main');
  const barRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLButtonElement>(null);
  const addRef = useRef<HTMLButtonElement>(null);
  const underlineRef = useRef<HTMLSpanElement>(null);
  const [isStuck, setIsStuck] = useState(false);
  const triggerYRef = useRef(0);

  // Sticky effect
  useEffect(() => {
    if (barRef.current) triggerYRef.current = barRef.current.offsetTop;
    
    const handleScroll = () => setIsStuck(window.scrollY >= triggerYRef.current);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Underline positioning
  useLayoutEffect(() => {
    const positionUnderline = () => {
      const btn = mode === 'main' ? mainRef.current : addRef.current;
      if (!btn || !containerRef.current || !underlineRef.current) return;
      
      const btnRect = btn.getBoundingClientRect();
      const contRect = containerRef.current.getBoundingClientRect();
      underlineRef.current.style.left = `${btnRect.left - contRect.left}px`;
      underlineRef.current.style.width = `${btnRect.width}px`;
    };

    positionUnderline();
    window.addEventListener('resize', positionUnderline);
    return () => window.removeEventListener('resize', positionUnderline);
  }, [mode]);

  // Button configuration
  const buttons = [
    { mode: 'main', label: 'Main Service', ref: mainRef },
    { mode: 'additional', label: 'Additional Service', ref: addRef }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 p-3 sm:p-4 h-28 sm:h-32 md:h-40 lg:h-48 flex items-center">
        <button className="p-1 sm:p-2 hover:bg-blue-700 rounded-lg transition-colors">
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </button>
      </header>

      {/* Profile Card */}
      <section className="px-3 sm:px-4 -mt-14 sm:-mt-16 md:-mt-20 lg:-mt-24 relative z-10">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-3 sm:p-4 md:p-6 max-w-2xl mx-auto text-center relative">
          <Edit2 className="absolute top-3 right-3 sm:top-4 sm:right-4 sm:w-5 sm:h-5 text-gray-600 cursor-pointer hover:text-gray-800 transition-colors p-1 hover:bg-gray-100 rounded" />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/b/b5/Windows_10_Default_Profile_Picture.svg"
            alt="Profile"
            className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-full border-3 sm:border-4 border-white -mt-10 sm:-mt-12 md:-mt-16 lg:-mt-18 mx-auto object-cover"
          />
          <h1 className="text-base sm:text-lg md:text-xl font-semibold mt-3 sm:mt-4 mb-2">User Name</h1>
          <p className="text-gray-600 mb-2 text-xs sm:text-sm md:text-base">user@example.com</p>
          <p className="text-gray-600 text-xs sm:text-sm">Ph: 123‑456‑7890</p>
          <p className="text-gray-600 text-xs sm:text-sm mt-2">Location: City ‑ Pincode</p>
          <p className="text-gray-600 text-xs sm:text-sm mt-3 sm:mt-4 max-w-prose mx-auto px-2">
            A brief description about the user.
          </p>
        </div>
      </section>

      <div className="border-t border-gray-300 my-4 sm:my-6 md:my-8 mx-3 sm:mx-4" />

      {/* Button Bar */}
      <div
        ref={barRef}
        className={`bg-gray-200 px-3 sm:px-4 py-2 ${isStuck ? 'fixed top-0 left-0 right-0 shadow-md z-30' : ''}`}
      >
        <div className="border-t border-gray-400" />
        <div ref={containerRef} className="relative flex justify-center items-center space-x-2 sm:space-x-3 md:space-x-4 py-2 overflow-x-auto">
          <span ref={underlineRef} className="absolute bottom-0 h-0.5 bg-blue-600 transition-all duration-300" />

          {buttons.map(({ mode: btnMode, label, ref }) => (
            <button
              key={btnMode}
              ref={ref}
              onClick={() => setMode(btnMode)}
              className={`px-3 sm:px-4 md:px-6 py-2 text-xs sm:text-sm font-medium whitespace-nowrap border-2 border-black rounded-lg sm:rounded-xl transition-all duration-200 ${
                mode === btnMode ? 'bg-white text-black shadow-sm' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="border-t border-gray-400 mt-2" />
      </div>

      {isStuck && <div style={{ height: barRef.current?.offsetHeight }} />}

      {/* Grid Section */}
      <section className="px-3 sm:px-4 pb-6">
        <div className="grid gap-1 sm:gap-2 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {Array.from({ length: mode === 'main' ? 32 : 12 }).map((_, idx) => (
            <div
              key={idx}
              className="aspect-square bg-gray-600 hover:bg-gray-700 transition-colors flex items-center justify-center cursor-pointer rounded-sm"
            >
              <Mountain className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" strokeWidth={1.5} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default GridDisplay;
