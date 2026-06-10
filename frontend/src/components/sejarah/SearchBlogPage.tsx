"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";

interface Article {
  id: number;
  title: string;
  image: string;
  category: string;
  date: string;
  excerpt: string;
  content?: string;
}

const articles: Article[] = [
  {
    id: 1,
    title: "Sejarah Wedang Jahe di Nusantara",
    image: "/img/article1.jpg",
    category: "Sejarah",
    date: "20 November 2025",
    excerpt: "Wedang jahe adalah minuman tradisional Indonesia yang telah ada sejak zaman kerajaan...",
    content:
      "Wedang jahe adalah minuman tradisional Indonesia yang telah ada sejak zaman kerajaan. Minuman ini digunakan untuk menjaga kesehatan, menghangatkan tubuh, dan sebagai bagian dari tradisi sosial. Proses pembuatannya melibatkan jahe segar, gula merah, dan rempah lain, yang direbus hingga menghasilkan cita rasa khas.",
  },
  {
    id: 2,
    title: "Kearifan Lokal dalam Pembuatan Jamu",
    image: "/img/article2.jpg",
    category: "Budaya Herbal",
    date: "18 November 2025",
    excerpt: "Setiap daerah memiliki resep unik dalam meracik jamu dengan bahan alami dan teknik tradisional...",
    content:
      "Setiap daerah memiliki resep unik dalam meracik jamu dengan bahan alami dan teknik tradisional. Mulai dari perebusan, fermentasi, hingga pengeringan, semua dilakukan untuk menjaga khasiat herbal. Tradisi ini diwariskan secara turun-temurun dan menjadi identitas budaya yang kaya.",
  },
  {
    id: 3,
    title: "Manfaat Temulawak untuk Kesehatan",
    image: "/img/article3.jpg",
    category: "Herbal",
    date: "15 November 2025",
    excerpt: "Temulawak dikenal memiliki banyak manfaat untuk meningkatkan fungsi hati dan daya tahan tubuh...",
    content:
      "Temulawak dikenal memiliki banyak manfaat untuk meningkatkan fungsi hati dan daya tahan tubuh. Tanaman herbal ini kaya kurkumin yang berfungsi sebagai antioksidan dan anti-inflamasi. Biasanya dikonsumsi dalam bentuk jamu atau ekstrak untuk menjaga kesehatan secara alami.",
  },
];

export default function SearchBlogPage({ search }: { search: string }) {
  const [query, setQuery] = useState(search);
  const [isOpen, setIsOpen] = useState(false);
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);

  const filtered = articles.filter((a) =>
    a.title.toLowerCase().includes(query.toLowerCase())
  );

  const openArticle = (article: Article) => {
    setActiveArticle(article);
    setIsOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FFFBEA]">
      <Navbar />
      <div className="pt-32 px-8">
        <h2 className="text-2xl font-bold mb-6">Hasil Pencarian: "{query}"</h2>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filtered.map((article) => (
              <div
                key={article.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition cursor-pointer"
              >
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <p className="text-xs text-gray-500">{article.date} • {article.category}</p>
                  <h4 className="font-semibold text-lg mt-1">{article.title}</h4>
                  <p className="text-sm mt-2 text-gray-700">{article.excerpt}</p>
                  <button
                    className="mt-3 text-green-700 font-bold hover:underline"
                    onClick={() => openArticle(article)}
                  >
                    Baca selengkapnya →
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-8">
            Tidak ada artikel yang sesuai dengan kata kunci "{query}".
          </p>
        )}

        {/* Popup Detail Artikel */}
        {isOpen && activeArticle && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50 overflow-auto p-4">
            <div className="relative bg-white rounded-3xl w-full max-w-4xl shadow-lg p-6 mt-20">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-5 right-5 text-black text-2xl font-bold hover:text-red-500"
              >
                &times;
              </button>
              <h2 className="text-3xl font-bold mb-4">{activeArticle.title}</h2>
              <img
                src={activeArticle.image}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
              <p className="text-lg leading-8">{activeArticle.content || activeArticle.excerpt}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
