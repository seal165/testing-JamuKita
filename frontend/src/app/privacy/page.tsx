"use client";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#faf8f1] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold text-[#B6771D] mb-8" style={{ fontFamily: 'Inter' }}>
            Kebijakan Privasi & Cookie
          </h1>

          <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
            <section>
              <h2 className="text-2xl font-bold text-[#B6771D] mb-4">1. Penggunaan Cookie</h2>
              <p>
                Website Jamu Kita menggunakan cookie dan teknologi serupa untuk meningkatkan
                pengalaman pengguna, menganalisis penggunaan website, dan memahami preferensi
                pengunjung.
              </p>
              <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">
                Jenis Cookie yang Kami Gunakan:
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Cookie Esensial:</strong> Diperlukan untuk fungsi dasar website seperti
                  autentikasi pengguna dan navigasi.
                </li>
                <li>
                  <strong>Cookie Analitik (Google Analytics):</strong> Membantu kami memahami
                  bagaimana pengunjung menggunakan website, halaman mana yang paling populer, dan
                  dari mana pengunjung berasal.
                </li>
                <li>
                  <strong>Cookie Preferensi:</strong> Mengingat pilihan Anda seperti consent cookie.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#B6771D] mb-4">2. Data yang Kami Kumpulkan</h2>
              <p>Melalui Google Analytics, kami mengumpulkan data anonim seperti:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Halaman yang Anda kunjungi</li>
                <li>Waktu yang dihabiskan di setiap halaman</li>
                <li>Kata kunci pencarian yang digunakan</li>
                <li>Resep yang paling sering dilihat</li>
                <li>Informasi perangkat dan browser (User Agent)</li>
                <li>Alamat IP (dianonim untuk privasi)</li>
              </ul>
              <div className="bg-green-50 border-l-4 border-green-500 p-4 my-4">
                <p className="text-green-800 font-semibold">
                  ✅ Kami TIDAK mengumpulkan data pribadi seperti nama, email, nomor telepon, atau
                  informasi pembayaran melalui cookie analytics.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#B6771D] mb-4">
                3. Tujuan Pengumpulan Data
              </h2>
              <p>Data yang kami kumpulkan digunakan untuk:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Meningkatkan pengalaman pengguna website</li>
                <li>Memahami konten yang paling diminati pengunjung</li>
                <li>Mengoptimalkan kinerja dan kecepatan website</li>
                <li>Mengidentifikasi dan memperbaiki masalah teknis</li>
                <li>Membuat keputusan strategis untuk pengembangan fitur baru</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#B6771D] mb-4">4. Google Analytics</h2>
              <p>
                Kami menggunakan Google Analytics, layanan analitik web yang disediakan oleh Google
                LLC. Google Analytics menggunakan cookie untuk menganalisis penggunaan website.
              </p>
              <p className="mt-4">
                Informasi yang dihasilkan oleh cookie tentang penggunaan website Anda (termasuk
                alamat IP Anda) akan dikirimkan dan disimpan oleh Google di server Amerika Serikat.
              </p>
              <p className="mt-4">
                <strong>Opt-out:</strong> Anda dapat menolak penggunaan cookie dengan memilih
                pengaturan yang sesuai di browser Anda atau dengan mengklik tombol &quot;Tolak&quot; di banner
                cookie kami.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#B6771D] mb-4">5. Hak Anda</h2>
              <p>Anda memiliki hak untuk:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Menolak penggunaan cookie analytics</li>
                <li>Menghapus cookie yang telah disimpan di perangkat Anda</li>
                <li>Mengubah preferensi cookie kapan saja</li>
                <li>Mengakses dan menghapus data pribadi yang kami simpan (untuk akun pengguna)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#B6771D] mb-4">
                6. Cara Mengelola Cookie
              </h2>
              <p>
                Sebagian besar browser web memungkinkan Anda mengelola preferensi cookie melalui
                pengaturan browser. Anda dapat:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Memblokir semua cookie</li>
                <li>Hanya mengizinkan cookie dari website tertentu</li>
                <li>Menghapus cookie setelah menutup browser</li>
                <li>Menerima pemberitahuan setiap kali cookie dikirim</li>
              </ul>
              <p className="mt-4 text-sm text-gray-600">
                <strong>Catatan:</strong> Menonaktifkan cookie mungkin mempengaruhi fungsionalitas
                website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#B6771D] mb-4">7. Keamanan Data</h2>
              <p>
                Kami berkomitmen untuk melindungi data Anda dengan menerapkan langkah-langkah
                keamanan teknis dan organisasi yang sesuai. Namun, tidak ada metode transmisi data
                melalui internet yang 100% aman.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#B6771D] mb-4">
                8. Perubahan Kebijakan Privasi
              </h2>
              <p>
                Kami dapat memperbarui kebijakan privasi ini dari waktu ke waktu. Perubahan akan
                dipublikasikan di halaman ini dengan tanggal revisi terbaru.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#B6771D] mb-4">9. Hubungi Kami</h2>
              <p>
                Jika Anda memiliki pertanyaan tentang kebijakan privasi atau penggunaan cookie kami,
                silakan hubungi kami melalui:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mt-4">
                <p>
                  <strong>Email:</strong> privacy@jamukita.com
                </p>
                <p className="mt-2">
                  <strong>Website:</strong> www.jamukita.com
                </p>
              </div>
            </section>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mt-8">
              <p className="text-blue-800 text-sm">
                <strong>Terakhir diperbarui:</strong> 19 Desember 2025
              </p>
              <p className="text-blue-800 text-sm mt-2">
                Dengan menggunakan website Jamu Kita, Anda menyetujui pengumpulan dan penggunaan
                informasi sesuai dengan kebijakan privasi ini.
              </p>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <button
              onClick={() => window.history.back()}
              className="px-6 py-3 bg-[#B6771D] text-white rounded-lg hover:bg-[#9a6118] transition-colors duration-200"
            >
              ← Kembali
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
