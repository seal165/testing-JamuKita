'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

export default function CardsSection() {
  const [visibleCards, setVisibleCards] = useState([]);
  const cardRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = parseInt(entry.target.dataset.index || '0');
          if (entry.isIntersecting) {
            setVisibleCards((prev) => [...new Set([...prev, index])]);
          } else {
            setVisibleCards((prev) => prev.filter((i) => i !== index));
          }
        });
      },
      { threshold: 0.2 }
    );

    cardRefs.current.forEach((ref) => ref && observer.observe(ref));
    return () => observer.disconnect();
  }, []);

  const cards = [
    {
      title: "Temukan Jamu yang Anda Butuhkan dalam Sekejap",
      description: "Filter pencarian cerdas mempermudah Anda menemukan jamu tradisional berdasarkan nama, kategori, atau manfaatnya. Dengan sistem filter dan auto-suggestion, pengguna dapat mengakses informasi dengan cepat dan akurat, mulai dari kunyit asam hingga beras kencur.",
      position: "left",
      image: "/images/1.png",
      gradient: "from-[#B0CE88] to-[#FCF9EA]" // Hijau → Krem
    },
    {
      title: "Pelajari Jamu Secara Mendalam",
      description: "Setiap jenis jamu dilengkapi dengan informasi lengkap, termasuk nama ilmiah bahan, manfaat spesifik, cara konsumsi yang tepat, hingga sejarah singkatnya. Dapatkan kekayaan pengetahuan jamu yang Anda butuhkan dengan satu klik.",
      position: "right",
      image: "/images/jamu2.jpg",
      gradient: "from-[#FCF9EA] to-[#B0CE88]" // Krem → Hijau
    },
    {
      title: "Solusi Jamu untuk Kesehatan Anda",
      description: "Masukkan keluhan kesehatan Anda, dan Herbari akan memberikan rekomendasi tanaman herbal yang sesuai, lengkap dengan panduan penggunaan yang aman dan efektif.",
      position: "left",
      image: "/images/jamu1.jpg",
      gradient: "from-[#B0CE88] to-[#FCF9EA]" // Hijau → Krem
    },
    {
      title: "Jelajahi Kekayaan Tradisi Herbal Nusantara",
      description: "Kenali budaya lokal yang kaya akan tradisi meramu jamu, dari resep rahasia keluarga hingga cerita spiritual di baliknya. Fitur ini menghubungkan Anda dengan warisan Indonesia yang tak ternilai.",
      position: "right",
      image: "/images/2.png",
      gradient: "from-[#FCF9EA] to-[#B0CE88]" // Krem → Hijau
    }
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">

        {/* TITLE */}
        <div className="w-full mb-8 sm:mb-12 flex items-center">
          <h2 
            className="text-xl sm:text-2xl md:text-3xl font-bold whitespace-nowrap"
            style={{ color: "#B6771D", fontFamily: "Inter" }}
          >
            Pilihan Jamu Kita
          </h2>
          <div 
            className="ml-3 sm:ml-4 h-[2px] w-full" 
            style={{ backgroundColor: "#B6771D" }}
          ></div>
        </div>

        {/* CARDS */}
        {cards.map((card, index) => (
          <div
            key={index}
            data-index={index}
            ref={(el) => (cardRefs.current[index] = el)}
            className={`
              transition-all duration-700 transform
              ${visibleCards.includes(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"}
              bg-gradient-to-r ${card.gradient}
              rounded-2xl sm:rounded-3xl shadow-lg
            `}
            style={{ 
              transitionDelay: `${index * 150}ms`,
            }}
          >
            <div className="px-4 sm:px-8 md:px-12 lg:px-16 py-8 sm:py-10 md:py-12">
              <div 
                className={`grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center 
                ${card.position === "right" ? "direction-rtl" : ""}`}
              >

                {/* TEXT */}
                <div className={`${card.position === "right" ? "md:order-2" : "md:order-1"} order-1`}>
                  <h2 
                    className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#B6771D] leading-tight" 
                    style={{ fontFamily: "Inter" }}
                  >
                    {card.title}
                  </h2>

                  <p 
                    className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700 leading-relaxed"
                    style={{ fontFamily: "Inter" }}
                  >
                    {card.description}
                  </p>
                </div>

                {/* IMAGE */}
                <div className={`${card.position === "right" ? "md:order-1" : "md:order-2"} order-2`}>
                  <div className="flex justify-center">
                    <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 bg-[#026301] rounded-full flex items-center justify-center shadow-xl">
                      <Image
                        width={300}
                        height={0} 
                        src={card.image}
                        alt={card.title}
                        className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-full object-cover"
                      />
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        ))}

      </div>
    </section>
  );
}