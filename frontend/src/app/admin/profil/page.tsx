'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function ProfilPage() {
  const router = useRouter();

  // MODIFIKASI: Handler untuk logout
  const handleLogout = () => {
    // Konfirmasi sebelum logout
    const confirmLogout = window.confirm('Apakah Anda yakin ingin keluar?');
    
    if (confirmLogout) {
      // Logic untuk clear session/token bisa ditambahkan di sini
      // localStorage.removeItem('token');
      // sessionStorage.clear();
      
      // Redirect ke landing page
      router.push('/');
    }
  };

  const handleSaveChanges = () => {
    alert('Perubahan berhasil disimpan!');
    // Logic untuk menyimpan data profil
  };

  return (
    <div className="space-y-6">
      <div className="w-full h-32 rounded-2xl overflow-hidden">
        <Image
           src="/images/header.png"
          alt="Herbs Header"
          width={1200}
          height={0}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="bg-white rounded-3xl shadow-lg p-8">
        {/* MODIFIKASI: Header dengan button Logout */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#B6771D]" style={{fontFamily: 'Inter'}}>
            PROFIL ADMIN
          </h1>
          <button 
            onClick={handleLogout}
            className="bg-red-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-red-700 transition-colors flex items-center gap-2"
            style={{fontFamily: 'Inter'}}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="w-32 h-32 rounded-full bg-[#B6771D] flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold" style={{fontFamily: 'Inter'}}>Admin Jamu Kita</h2>
              <p className="text-gray-600">admin@jamukita.com</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold mb-2" style={{fontFamily: 'Inter'}}>Nama Lengkap</label>
              <input 
                type="text" 
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#B6771D] focus:outline-none" 
                defaultValue="Admin Jamu Kita" 
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2" style={{fontFamily: 'Inter'}}>Email</label>
              <input 
                type="email" 
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#B6771D] focus:outline-none" 
                defaultValue="admin@jamukita.com" 
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2" style={{fontFamily: 'Inter'}}>Username</label>
              <input 
                type="text" 
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#B6771D] focus:outline-none" 
                defaultValue="admin_jamukita" 
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2" style={{fontFamily: 'Inter'}}>Role</label>
              <input 
                type="text" 
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg bg-gray-100" 
                defaultValue="Administrator" 
                disabled 
              />
            </div>
          </div>

          {/* MODIFIKASI: Button Simpan dengan handler */}
          <button 
            onClick={handleSaveChanges}
            className="bg-[#B6771D] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#8B5A15] transition-colors" 
            style={{fontFamily: 'Inter'}}
          >
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
}