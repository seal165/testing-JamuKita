"use client";

import { FaLeaf, FaBook, FaShieldAlt, FaPeopleCarry } from "react-icons/fa";

export default function BenefitSection() {
  const list = [
    { icon: <FaLeaf />, title: "Bahan Alami Terpercaya", desc: "Menggunakan informasi herbal asli Nusantara yang aman dan terbukti." },
    { icon: <FaBook />, title: "Edukasi Ilmiah", desc: "Konten berbasis riset, studi pustaka dan dokumentasi budaya." },
    { icon: <FaShieldAlt />, title: "Akurat & Terverifikasi", desc: "Informasi yang disusun oleh peneliti & praktisi jamu." },
    { icon: <FaPeopleCarry />, title: "Mendukung Pelestarian Budaya", desc: "Menjaga warisan leluhur dalam bentuk modern & relevan." },
  ];

  return (
    <section className="w-full py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 bg-white">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-10 md:mb-14 text-[#026301]">Mengapa Memilih Jamu Kita?</h2>
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10">
        {list.map((item, index) => (
          <div
            key={index}
            className="p-5 sm:p-6 bg-[#FAF8F1] rounded-xl shadow-lg text-center hover:-translate-y-2 transition-all"
          >
            <div className="flex justify-center text-[#026301] mb-3 text-3xl sm:text-4xl">
              {item.icon}
            </div>
            <h3 className="font-bold text-base sm:text-lg mb-2 px-2">{item.title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed px-2">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
