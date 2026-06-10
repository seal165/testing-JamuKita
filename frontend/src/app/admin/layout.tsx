'use client';

import { useState } from 'react';
import AdminNavbar from '../../components/admin/AdminNavbar';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { useAdminProtection } from '@/hooks/useAdminProtection';


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthorized, isLoading } = useAdminProtection();
  
  // Tampilkan loading atau null saat mengecek authorization
  if (isLoading || !isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, #FFFD8F 0%, rgba(250,214,145,0.9) 100%)'
      }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-700">Memuat...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #FFFD8F 0%, rgba(250,214,145,0.9) 100%)'
    }}>
      <AdminNavbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex pt-20 sm:pt-24">
        <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}