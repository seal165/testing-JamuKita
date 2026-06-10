import bcrypt from "bcryptjs";
import prisma from "../../src/lib/prisma.js";

async function main() {
  console.log("🌱 Starting seed...");

  // Clear existing data
  await prisma.favorit.deleteMany();
  await prisma.komentar.deleteMany();
  await prisma.resep.deleteMany();
  await prisma.kategori.deleteMany();
  await prisma.user.deleteMany();

  console.log("✅ Cleared existing data");

  // Create Admin User
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.create({
    data: {
      nama: "Admin Jamu Kita",
      email: "admin@jamukita.com",
      password: adminPassword,
      role: "admin",
    },
  });
  console.log("✅ Created admin user");

  // Create Sample Users (Anggota)
  const userPassword = await bcrypt.hash("password123", 10);
  const users = await Promise.all([
    prisma.user.create({
      data: {
        nama: "Budi Hartono",
        email: "budi@example.com",
        password: userPassword,
        role: "anggota",
      },
    }),
    prisma.user.create({
      data: {
        nama: "Siti Aminah",
        email: "siti@example.com",
        password: userPassword,
        role: "anggota",
      },
    }),
    prisma.user.create({
      data: {
        nama: "Ahmad Yani",
        email: "ahmad@example.com",
        password: userPassword,
        role: "anggota",
      },
    }),
  ]);
  console.log("✅ Created sample users");

  // Create Categories
  const categories = await Promise.all([
    prisma.kategori.create({ data: { nama: "Kesehatan" } }),
    prisma.kategori.create({ data: { nama: "Manfaat" } }),
    prisma.kategori.create({ data: { nama: "Rumahan" } }),
    prisma.kategori.create({ data: { nama: "Rempah" } }),
    prisma.kategori.create({ data: { nama: "Buah" } }),
  ]);
  console.log("✅ Created categories");

  // Data untuk generate 100 resep jamu random
  const namaJamu = [
    "Kunyit", "Jahe", "Temulawak", "Kencur", "Beras Kencur", "Sirih", "Sambiloto",
    "Daun Katuk", "Daun Pepaya", "Meniran", "Lidah Buaya", "Kumis Kucing", "Tapak Liman",
    "Cincau", "Serai", "Lengkuas", "Mahkota Dewa", "Sarang Semut", "Pegagan",
    "Daun Insulin", "Sambung Nyawa", "Belimbing Wuluh", "Mengkudu", "Pace", "Binahong",
    "Ciplukan", "Daun Salam", "Daun Jambu Biji", "Kemangi", "Kapulaga"
  ];

  const variasiJamu = [
    "Asam", "Merah", "Putih", "Segar", "Kuat", "Sehat", "Hangat", "Dingin",
    "Maniskan", "Murni", "Tradisional", "Herbal", "Rempah", "Nusantara", "Jawa",
    "Sunda", "Bali", "Madura", "Istimewa", "Pilihan", "Super", "Extra", "Premium",
    "Klasik", "Modern", "Spesial", "Original"
  ];

  const deskripsiTemplate = [
    "Minuman herbal tradisional yang berkhasiat untuk menjaga kesehatan dan stamina tubuh",
    "Jamu warisan nenek moyang yang telah terbukti khasiatnya untuk kesehatan",
    "Ramuan tradisional Indonesia yang kaya akan manfaat untuk tubuh",
    "Obat herbal alami yang dapat membantu mengatasi berbagai keluhan kesehatan",
    "Resep jamu turun temurun yang telah dipercaya sejak zaman dahulu",
    "Minuman kesehatan berbahan rempah pilihan yang berkhasiat tinggi",
    "Jamu tradisional yang diolah dengan cara modern tanpa mengurangi khasiatnya",
    "Ramuan herbal Indonesia yang dapat meningkatkan daya tahan tubuh",
    "Minuman sehat alami yang membantu menjaga keseimbangan tubuh",
    "Jamu khas nusantara yang memiliki segudang manfaat untuk kesehatan"
  ];

  const bahanDasar = [
    ["Kunyit 200 gram", "Asam jawa 50 gram", "Gula merah 150 gram", "Air 1 liter"],
    ["Jahe merah 150 gram", "Gula aren 100 gram", "Air 1 liter"],
    ["Temulawak 200 gram", "Madu 3 sdm", "Air 1,5 liter"],
    ["Kencur 100 gram", "Beras 100 gram", "Gula merah 100 gram", "Air 1 liter"],
    ["Daun sirih 15 lembar", "Kapur sirih secukupnya", "Madu 2 sdm", "Air 1 liter"],
    ["Sambiloto kering 20 gram", "Madu 2 sdm", "Air 800 ml"],
    ["Lengkuas 100 gram", "Serai 3 batang", "Gula merah 100 gram", "Air 1 liter"],
    ["Daun katuk 50 gram", "Jahe 50 gram", "Madu 2 sdm", "Air 1 liter"],
    ["Mengkudu 2 buah", "Madu 3 sdm", "Air 500 ml"],
    ["Lidah buaya 200 gram", "Madu 3 sdm", "Jeruk nipis 2 buah", "Air 800 ml"],
    ["Kumis kucing 30 gram", "Daun salam 10 lembar", "Air 1 liter"],
    ["Meniran 50 gram", "Temulawak 100 gram", "Madu 2 sdm", "Air 1 liter"]
  ];

  const langkahDasar = [
    [
      "Cuci bersih semua bahan",
      "Potong atau parut bahan utama",
      "Rebus air hingga mendidih",
      "Masukkan semua bahan ke dalam air mendidih",
      "Masak dengan api kecil selama 20-30 menit",
      "Saring dan tambahkan pemanis jika perlu",
      "Dinginkan dan sajikan"
    ],
    [
      "Siapkan dan bersihkan semua bahan",
      "Geprek atau tumbuk bahan yang keras",
      "Didihkan air dalam panci",
      "Masukkan bahan satu per satu",
      "Rebus dengan api sedang selama 15-20 menit",
      "Tambahkan gula atau madu sesuai selera",
      "Saring dan minum selagi hangat"
    ],
    [
      "Pilih bahan yang segar dan berkualitas",
      "Cuci bersih dan potong-potong",
      "Blender atau haluskan bahan utama",
      "Rebus dengan air secukupnya",
      "Tambahkan rempah pelengkap",
      "Masak hingga mendidih dan matang",
      "Saring, dinginkan, dan siap diminum"
    ]
  ];

  const manfaatJamu = [
    "Meningkatkan daya tahan tubuh", "Melancarkan pencernaan", "Mengatasi pegal linu",
    "Menghangatkan tubuh", "Menurunkan kolesterol", "Mengontrol gula darah",
    "Menjaga kesehatan jantung", "Meningkatkan stamina", "Mengatasi masuk angin",
    "Meredakan batuk", "Melancarkan peredaran darah", "Mengatasi asam urat",
    "Menjaga kesehatan ginjal", "Mengatasi rematik", "Meningkatkan nafsu makan",
    "Menjaga kesehatan kulit", "Mengatasi insomnia", "Meredakan stress",
    "Meningkatkan metabolisme", "Detoksifikasi tubuh"
  ];

  const sumberLiteratur = [
    "Buku Resep Herbal Warisan, Hal. ",
    "Ensiklopedia Jamu Indonesia, Hal. ",
    "Ramuan Tradisional Nusantara, Hal. ",
    "Khasiat Tanaman Obat Indonesia, Hal. ",
    "Pusaka Jamu Nusantara, Hal. ",
    null, null // 30% tidak ada sumber
  ];

  function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function generateJudul() {
    const jenis = getRandomElement(namaJamu);
    const variasi = Math.random() > 0.6 ? getRandomElement(variasiJamu) : "";
    return variasi ? `Jamu ${jenis} ${variasi}` : `Jamu ${jenis}`;
  }

  function generateDeskripsi() {
    const base = getRandomElement(deskripsiTemplate);
    const manfaat1 = getRandomElement(manfaatJamu);
    const manfaat2 = getRandomElement(manfaatJamu.filter(m => m !== manfaat1));
    return `${base}. Bermanfaat untuk ${manfaat1.toLowerCase()} dan ${manfaat2.toLowerCase()}.`;
  }

  function generateBahan() {
    const bahanUtama = getRandomElement(bahanDasar);
    const bahanTambahan = [];
    if (Math.random() > 0.5) bahanTambahan.push("Kayu manis 1 batang");
    if (Math.random() > 0.5) bahanTambahan.push("Cengkeh 5 butir");
    if (Math.random() > 0.7) bahanTambahan.push("Pala 1/2 butir");
    if (Math.random() > 0.7) bahanTambahan.push("Kapulaga 3 butir");
    return JSON.stringify([...bahanUtama, ...bahanTambahan]);
  }

  function generateLangkah() {
    return JSON.stringify(getRandomElement(langkahDasar));
  }

  function generateGambarURL() {
    if (Math.random() > 0.3) {
      const imageId = Math.floor(Math.random() * 1000) + 1;
      return `https://picsum.photos/seed/jamu${imageId}/800/600`;
    }
    return null;
  }

  function generateSumberLiteratur() {
    const sumber = getRandomElement(sumberLiteratur);
    if (sumber) {
      const halaman = Math.floor(Math.random() * 300) + 1;
      return sumber + halaman;
    }
    return null;
  }

  // Create 100 Resep Jamu
  console.log("🔄 Creating 100 resep jamu...");
  const resepList = [];
  
  for (let i = 0; i < 100; i++) {
    const resep = await prisma.resep.create({
      data: {
        judul: generateJudul(),
        deskripsi: generateDeskripsi(),
        gambarURL: generateGambarURL(),
        sumberLiteratur: generateSumberLiteratur(),
        kategoriId: getRandomElement(categories).id,
        bahan: generateBahan(),
        langkahPembuatan: generateLangkah(),
      },
    });
    resepList.push(resep);
    
    if ((i + 1) % 10 === 0) {
      console.log(`   ✓ Created ${i + 1} resep...`);
    }
  }
  console.log("✅ Created 100 resep jamu");

  // Create Random Comments
  const jumlahKomentar = Math.floor(Math.random() * 100) + 150;
  console.log(`🔄 Creating ${jumlahKomentar} random comments...`);
  
  const komentarTemplate = [
    "Jamu ini sangat manjur! Terima kasih resepnya.",
    "Sudah coba dan memang terasa khasiatnya. Recommended!",
    "Bagus untuk kesehatan. Saya rutin minum setiap hari.",
    "Rasanya enak dan berkhasiat. Sangat membantu.",
    "Resep yang bagus, mudah dibuat di rumah.",
    "Khasiatnya luar biasa, sudah terbukti ampuh.",
    "Terima kasih sudah berbagi resep yang bermanfaat ini.",
    "Jamu tradisional yang patut dilestarikan. Mantap!",
    "Sangat membantu mengatasi keluhan saya. Top!",
    "Resepnya mudah diikuti dan hasilnya memuaskan."
  ];
  
  for (let i = 0; i < jumlahKomentar; i++) {
    await prisma.komentar.create({
      data: {
        resepId: getRandomElement(resepList).id,
        userId: getRandomElement(users).id,
        isiKomentar: getRandomElement(komentarTemplate),
        rating: Math.floor(Math.random() * 2) + 4, // Rating 4-5
      },
    });
  }
  console.log(`✅ Created ${jumlahKomentar} comments`);

  // Create Random Favorites
  const jumlahFavorit = Math.floor(Math.random() * 50) + 80;
  console.log(`🔄 Creating ${jumlahFavorit} random favorites...`);
  
  const favoritSet = new Set();
  let favoritCreated = 0;
  
  while (favoritCreated < jumlahFavorit) {
    const userId = getRandomElement(users).id;
    const resepId = getRandomElement(resepList).id;
    const key = `${userId}-${resepId}`;
    
    if (!favoritSet.has(key)) {
      await prisma.favorit.create({
        data: { userId, resepId },
      });
      favoritSet.add(key);
      favoritCreated++;
    }
  }
  console.log(`✅ Created ${jumlahFavorit} favorites`);

  console.log("\n🎉 Seed completed successfully!");
  console.log("\n📊 Summary:");
  console.log(`   • 1 Admin user`);
  console.log(`   • ${users.length} Regular users`);
  console.log(`   • ${categories.length} Categories`);
  console.log(`   • 100 Resep Jamu`);
  console.log(`   • ${jumlahKomentar} Comments`);
  console.log(`   • ${jumlahFavorit} Favorites`);
  console.log("\n📝 Sample credentials:");
  console.log("   Admin: admin@jamukita.com / admin123");
  console.log("   User: budi@example.com / password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
