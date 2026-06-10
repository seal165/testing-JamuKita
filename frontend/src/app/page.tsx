// app/page.tsx — Next.js 16 App Router
import Image from "next/image";
import Link from "next/link";
import { Elsie } from "next/font/google";

const elsie = Elsie({ subsets: ["latin"], weight: ["400", "900"] });

export default function Home() {
  return (
    <>
      <main className="flex flex-col bg-[linear-gradient(to_right,rgba(255,253,143,1)_46%,rgba(250,214,145,0.9)_75%)]">
        {/* HERO */}
        <section className="flex-1 flex items-center justify-center p-4 md:p-8">
          <div className="relative w-full max-w-6xl overflow-hidden rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
            {/* Base gradient (card) */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FFF3B0] to-[#F8D791]" />

          {/* Gambar hanya sebagian kanan (tidak full) */}
          <div className="absolute inset-y-0 right-0 w-[58%]">
            <Image
              src="/images/jamu-hero.png"
              alt="Bahan jamu tradisional dengan ulekan"
              fill
              priority
              sizes="(max-width: 1024px) 150vw, 58vw"
              className="object-contain object-right pointer-events-none select-none"
            />
            {/* Fade lembut ke kiri agar teks tetap kebaca */}
            <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-l from-transparent to-[#FFF3B0]/85" />
          </div>

          {/* Konten di atas gambar */}
          <div className="relative z-10 grid lg:grid-cols-2 items-center gap-8 p-6 sm:p-8 md:p-10">
            {/* LEFT: Text (sedikit overlap gambar karena z-index lebih tinggi) */}
            <div className="space-y-5 max-w-xl">
              <h1
                className={`${elsie.className} text-4xl leading-tight sm:text-5xl lg:text-6xl text-neutral-900 drop-shadow-[0_1px_0_rgba(0,0,0,0.05)]`}
              >
                SEHAT DENGAN
                <br />
                JAMU ALAMI
              </h1>
              <p className="text-neutral-800">
                Jaga kesehatan Anda secara alami dengan mengandalkan khasiat jamu, resep tradisional yang telah
                teruji lintas generasi.
              </p>

              <Link
                href="/beranda"
                aria-label="Mulai jelajah pilihan jamu"
                className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium shadow-[inset_0_-2px_0_rgba(0,0,0,0.1),0_6px_14px_rgba(0,0,0,0.08)] bg-[#FBE3A1] hover:bg-[#F7D778] transition-colors border border-[#F4D67E] text-[#5A43114] w-fit"
              >
                MULAI JELAJAH
              </Link>
            </div>

            {/* Kolom kanan dibiarkan kosong agar ruang gambar lega di desktop */}
            <div className="hidden lg:block" />
          </div>

          {/* Aksen opsional */}
          <span className="pointer-events-none absolute -top-3 -right-3 h-8 w-8 rounded-full bg-[#FFEAA0]/60 blur-sm" />
          <span className="pointer-events-none absolute -bottom-3 -left-3 h-8 w-8 rounded-full bg-[#FFF4CC]/70 blur-sm" />
        </div>
      </section>

      {/* Pilihan Jamu Kita */}
      <section id="pilihan" className="py-8 sm:py-10 md:py-14 px-4 sm:px-6 md:px-16">
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-green-900 leading-none mb-0 whitespace-nowrap">Pilihan Jamu Kita</h2>
            <div className="flex-1 h-[1.2px] bg-[#C6A34D] ml-2 sm:ml-4" />
          </div>
        </div>
        <div className="space-y-6 sm:space-y-8 md:space-y-10">
          {/* Card 1 */}
          <div className="bg-yellow-100 rounded-xl shadow p-4 sm:p-5 md:p-6 flex flex-col md:flex-row-reverse gap-4 sm:gap-5 md:gap-6 items-center">
            <Image
              src="/images/jamu1.jpg"
              alt="Temukan Jamu"
              width={160}
              height={160}
              sizes="(max-width: 640px) 120px, 160px"
              className="rounded-full object-cover w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 flex-shrink-0 md:ml-auto"
            />
            <div className="text-center md:text-left flex-1">
              <h3 className="text-base sm:text-lg md:text-xl font-semibold text-green-900 mb-2">
                Temukan Jamu yang Anda Butuhkan dalam Sekejap
              </h3>
              <p className="text-sm sm:text-base text-gray-700">
                Filter pencarian cerdas mempermudah Anda menemukan jamu tradisional berdasarkan nama, kategori, atau
                manfaatnya. Dengan sistem filter dan auto-suggestion, pengguna dapat mengakses informasi dengan cepat
                dan akurat mulai dari kunyit asam hingga beras kencur.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-green-100 rounded-xl shadow p-4 sm:p-5 md:p-6 flex flex-col md:flex-row gap-4 sm:gap-5 md:gap-6 items-center">
            <Image
              src="/images/jamu2.jpg"
              alt="Pelajari Jamu"
              width={160}
              height={160}
              sizes="(max-width: 640px) 120px, 160px"
              className="rounded-full object-cover w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 flex-shrink-0 md:order-1"
            />
            <div className="text-center md:text-right md:order-2 md:flex-1">
              <h3 className="text-base sm:text-lg md:text-xl font-semibold text-green-900 mb-2">Pelajari Jamu Secara Mendalam</h3>
              <p className="text-sm sm:text-base text-gray-700">
                Setiap jenis jamu dilengkapi dengan informasi lengkap, termasuk nama ilmiah bahan, manfaat spesifik,
                cara konsumsi yang tepat, hingga sejarah singkatnya. Dapatkan kekayaan pengetahuan jamu yang Anda butuhkan
                dengan satu klik.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-yellow-100 rounded-xl shadow p-4 sm:p-5 md:p-6 flex flex-col md:flex-row-reverse gap-4 sm:gap-5 md:gap-6 items-center">
            <Image
              src="/images/jamu3.jpg"
              alt="Solusi Kesehatan"
              width={160}
              height={160}
              sizes="(max-width: 640px) 120px, 160px"
              className="rounded-full object-cover w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 flex-shrink-0 md:ml-auto"
            />
            <div className="text-center md:text-left md:order-2 md:flex-1">
              <h3 className="text-base sm:text-lg md:text-xl font-semibold text-green-900 mb-2">Solusi Jamu untuk Kesehatan Anda</h3>
              <p className="text-sm sm:text-base text-gray-700">
                Masukkan keluhan kesehatan Anda, dan Herbari akan memberikan rekomendasi tanaman herbal yang sesuai,
                lengkap dengan panduan penggunaan yang aman dan efektif.
              </p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-green-100 rounded-xl shadow p-4 sm:p-5 md:p-6 flex flex-col md:flex-row gap-4 sm:gap-5 md:gap-6 items-center">
            <Image
              src="/images/jamu4.jpg"
              alt="Kekayaan Tradisi"
              width={160}
              height={160}
              sizes="(max-width: 640px) 120px, 160px"
              className="rounded-full object-cover w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 flex-shrink-0 md:order-1"
            />
            <div className="text-center md:text-right md:order-2 md:flex-1">
              <h3 className="text-base sm:text-lg md:text-xl font-semibold text-green-900 mb-2">
                Jelajahi Kekayaan Tradisi Herbal Nusantara
              </h3>
              <p className="text-sm sm:text-base text-gray-700">
                Kenali budaya lokal yang kaya akan tradisi meramu jamu, dari resep rahasia keluarga hingga cerita
                spiritual di baliknya. Fitur ini menghubungkan Anda dengan warisan Indonesia yang tak ternilai.
              </p>
            </div>
          </div>

          {/* Card 5 */}
          <div className="bg-yellow-100 rounded-xl shadow p-4 sm:p-5 md:p-6 flex flex-col md:flex-row-reverse gap-4 sm:gap-5 md:gap-6 items-center">
            <Image
              src="/images/jamu5.jpg"
              alt="Perawatan Anak"
              width={160}
              height={160}
              sizes="(max-width: 640px) 120px, 160px"
              className="rounded-full object-cover w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 flex-shrink-0 md:ml-auto"
            />
            <div className="text-center md:text-left md:order-2 md:flex-1">
              <h3 className="text-base sm:text-lg md:text-xl font-semibold text-green-900 mb-2">
                Rawat Kesehatan Anak, Rawat Tradisi Nusantara
              </h3>
              <p className="text-sm sm:text-base text-gray-700">
                Dapatkan panduan konsumsi jamu yang teratur dan saran gaya hidup sehat ala Nusantara.
              </p>
            </div>
          </div>
        </div>
      </section>
      <div className="w-full h-auto py-3 sm:py-4 md:h-[50px] flex items-center justify-center bg-gradient-to-r from-[#FFF79C] via-[#FFEFA7] to-[#F6C986] rounded-full px-2 sm:px-4 shadow-[0_6px_18px_rgba(0,0,0,0.06)]">
        {/* Left icon - hidden on mobile */}
        <Image
          src="/images/cup.png"
          alt=""
          width={28}
          height={20}
          className="hidden sm:block h-20 w-20 md:h-28 md:w-28 lg:h-32 lg:w-32 object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.15)] transform scale-x-[-1]"
        />

        {/* Left gradient line */}
        <div className="flex-1 h-[1.2px] bg-gradient-to-r from-transparent via-[#C6A34D]/70 to-[#C6A34D]/90 mx-2 sm:mx-3 md:mx-4" />

        {/* Center logo */}
        <Image
          src="/images/jamu-logo.png"
          alt="Logo Jamu"
          width={6}
          height={8}
          className="h-6 w-6 sm:h-8 sm:w-8 md:h-9 md:w-9 object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.15)]"
        />

        {/* Right gradient line (reversed) */}
        <div className="flex-1 h-[1.2px] bg-gradient-to-l from-transparent via-[#C6A34D]/70 to-[#C6A34D]/90 mx-2 sm:mx-3 md:mx-4" />

        {/* Right icon - hidden on mobile */}
        <Image
          src="/images/cup.png"
          alt=""
          width={28}
          height={20}
          className="hidden sm:block h-20 w-20 md:h-28 md:w-28 lg:h-32 lg:w-32 object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.15)]"
        />
      </div>

      {/* Footer */}
      <footer className="bg-white text-center py-3 sm:py-4 mt-6 sm:mt-8 md:mt-10 text-gray-700">
        <p className="text-xs sm:text-sm md:text-base">© 2025 Jamu Kita. Semua Hak Dilindungi.</p>
      </footer>
    </main>
  </>
  );
}