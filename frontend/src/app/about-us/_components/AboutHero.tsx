"use client";

import Image from "next/image";

export default function AboutHero() {
  return (
   <section className="relative z-0 w-full py-12 sm:py-16 md:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-white text-[#3B2F0B] overflow-hidden">
      
      {/* Background pattern */}
      <Image
        src="/img/ilustrasi-daun.png"
        width={550}
        height={0}
        className="absolute opacity-10 w-[300px] sm:w-[400px] md:w-[550px] right-0 top-0 pointer-events-none z-0"
        alt="pattern"
      />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-center relative z-10">
        
        {/* Text Content */}
        <div className="text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold drop-shadow-md leading-tight">
            Tentang Jamu Kita
          </h1>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-relaxed opacity-90">
            Menjaga tradisi, meningkatkan kesehatan. Edukasi jamu & herbal Indonesia
            dalam pendekatan modern dan terpercaya.
          </p>

          <button className="mt-6 sm:mt-8 px-6 sm:px-8 py-2.5 sm:py-3 bg-[#8E6C1A] text-[#FFF8A6] font-bold text-sm sm:text-base rounded-xl shadow-lg hover:scale-105 transition">
            Jelajahi Lebih Dalam
          </button>
        </div>

        {/* Image Section */}
        <div className="flex justify-center">
          <Image
            src="/images/jamu-logo.png"
            alt="Foto Jamu"
            width={420}
            height={0}
            className="w-[280px] sm:w-[320px] md:w-[380px] lg:w-[420px] h-auto rounded-3xl shadow-2xl object-cover border-4 border-white/20 hover:scale-105 transition transform"
          />
        </div>
      </div>
    </section>
  );
}
