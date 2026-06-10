'use client';

export default function Footer() {
  return (
    <footer className="mt-12 sm:mt-16 md:mt-20 lg:mt-24 z-40" style={{
      position: 'relative'
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* Desktop Layout */}
        <div className="hidden sm:flex items-center justify-between">
          <div className="flex items-center gap-3 md:gap-4 flex-1">
            <img src="/images/cup.png" alt="Cup Left" className="w-20 h-16 sm:w-28 sm:h-20 md:w-32 md:h-24 lg:w-40 lg:h-30" />
            <div className="h-px bg-[#B6771D] flex-1"></div>
          </div>
          
          <div className="px-4 md:px-6 lg:px-8">
            <img src="/images/jamu-logo.png" alt="Logo" className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-25 lg:h-30" />
          </div>
          
          <div className="flex items-center gap-3 md:gap-4 flex-1">
            <div className="h-px bg-[#B6771D] flex-1"></div>
            <img src="/images/cup.png" alt="Cup Right" className="w-20 h-16 sm:w-28 sm:h-20 md:w-32 md:h-24 lg:w-40 lg:h-30" />
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="sm:hidden flex flex-col items-center">
          <img src="/images/jamu-logo.png" alt="Logo" className="w-16 h-16 mb-3" />
          <div className="w-full h-px bg-[#B6771D]"></div>
        </div>
        
        <div className="text-center mt-3 sm:mt-4">
          <div className="inline-block bg-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-full shadow-sm">
            <p className="text-[#B6771D] font-semibold text-xs sm:text-sm md:text-base" style={{fontFamily: 'Inter'}}>
              Copyright © Jamu Kita 2025
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}