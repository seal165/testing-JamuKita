export interface Article {
  id: number;
  title: string;
  image: string;
  category: string;
  date: string;
  excerpt: string;
  content: string;
}


export const blogArticles = [
  {
    id: 1,
    title: "Sejarah Wedang Jahe di Nusantara",
    image: "/img/article1.jpg",
    category: "Sejarah",
    date: "20 November 2025",
    excerpt:
      "Wedang jahe adalah minuman tradisional Indonesia yang telah ada sejak zaman kerajaan...",
    content:
      "Wedang jahe adalah minuman tradisional Indonesia yang telah ada sejak zaman kerajaan...",
  },
  {
    id: 2,
    title: "Kearifan Lokal dalam Pembuatan Jamu",
    image: "/img/article2.jpg",
    category: "Budaya Herbal",
    date: "18 November 2025",
    excerpt:
      "Setiap daerah memiliki resep unik dalam meracik jamu dengan bahan alami...",
    content:
      "Setiap daerah memiliki resep unik dalam meracik jamu dengan bahan alami...",
  },
  {
    id: 3,
    title: "Manfaat Temulawak untuk Kesehatan",
    image: "/img/article3.jpg",
    category: "Herbal",
    date: "15 November 2025",
    excerpt:
      "Temulawak dikenal memiliki banyak manfaat untuk meningkatkan fungsi hati...",
    content:
      "Temulawak dikenal memiliki banyak manfaat untuk meningkatkan fungsi hati...",
  },
];
