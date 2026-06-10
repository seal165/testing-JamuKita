"use client";

import Image from "next/image";	

export default function HistorySection() {
  return (
    <section className="w-full py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 bg-[#FAF8F1]">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center">
        
        <Image
          src="/images/jamu1.jpg"
          alt="Sejarah Jamu Kita"
          width={800}
          height={0}
          className="rounded-2xl shadow-xl w-full h-64 sm:h-80 md:h-auto object-cover hover:scale-105 transition"
        />

        <div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#026301] mb-3 sm:mb-4">
            Sejarah Jamu Kita
          </h2>
          <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed sm:leading-[26px] md:leading-[28px]">
            Jamu Kita berdiri tahun 2025 sebagai platform edukasi untuk memperkenalkan
            tanaman herbal Nusantara melalui metode modern dan ilmiah. Menggabungkan
            dokumentasi tradisi leluhur dengan teknologi, kami ingin membawa jamu
            Indonesia menuju era kesehatan masa depan.
          </p>
        </div>
      </div>
    </section>
  );
}
