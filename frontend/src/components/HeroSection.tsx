'use client';

import { useEffect, useRef, useState } from 'react';

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // toggle visibility each time the hero section intersects
          setVisible(entry.isIntersecting);
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden w-full" style={{
      minHeight: 'calc(100vh - 4rem)',
      display: 'flex',
      alignItems: 'center',
      paddingTop: '2rem',
      paddingBottom: '2rem'
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Text Content */}
          <div className={`space-y-6 sm:space-y-8 md:space-y-12 transform translate-x-0 md:-translate-x-16 lg:-translate-x-32 relative z-30`}>
            <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-tight ${visible ? 'hero-animate delay-150' : 'hero-init'}`} style={{fontFamily: 'Elsie'}}>
              <span className="block">SEHAT DENGAN</span>
              <span className="block">JAMU ALAMI</span>
            </h1>
            <p className={`${visible ? 'hero-animate delay-300' : 'hero-init'} text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed`} style={{fontFamily: 'Poppins'}}>
              Jaga kesehatan Anda secara alami dengan mengandalkan khasiat jamu, resep tradisional yang telah teruji lintas generasi.
            </p>
            <button 
              className={`${visible ? 'hero-animate delay-10' : 'hero-init'} bg-[#FFFEC7] text-[#B6771D] px-8 sm:px-10 md:px-14 py-3 sm:py-4 md:py-5 rounded-full font-bold text-base sm:text-lg md:text-xl transition transform duration-200 hover:-translate-y-1 hover:shadow-2xl hover:bg-[#FFF5B8] focus:outline-none focus:ring-4 focus:ring-[#B6771D33]`}
              style={{
                fontFamily: 'Poppins'
              }}
            >
              MULAI JELAJAH
            </button>
          </div>
          
          {/* Image - Hidden on mobile, visible on md+ */}
          <div className="hidden md:block relative">
            <div className={`${visible ? 'hero-image-animate delay-300' : 'hero-init'} absolute top-1/2 right-0 md:right-[-100px] lg:right-[-180px] xl:right-[-260px] transform -translate-y-1/2 pointer-events-none`} style={{zIndex: 20}}>
              <div className="w-[500px] md:w-[600px] lg:w-[900px] xl:w-[1100px] rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/images/jamu-hero.png"
                  alt="Herbal Ingredients"
                  className="w-full h-auto object-cover"
                  style={{display: 'block'}}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Image - Show below text on mobile */}
        <div className="md:hidden mt-8">
          <div className={`${visible ? 'hero-image-animate delay-300' : 'hero-init'} rounded-3xl overflow-hidden shadow-2xl`}>
            <img
              src="/images/jamu-hero.png"
              alt="Herbal Ingredients"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}