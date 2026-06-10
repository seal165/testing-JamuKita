export interface Article {
  id: number;
  title: string;
  image: string;
  category: string;
  date: string;
  excerpt: string;
  content?: string;
}

export const articles: Article[] = [
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
