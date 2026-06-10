'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function AdminSidebar({ isOpen = true, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const menuItems = [
    { name: 'STATISTIK', path: '/admin/statistik' },
    { name: 'USER', path: '/admin/user' },
    { name: 'ARTIKEL', path: '/admin/artikel' },
    { name: 'RESEP', path: '/admin/resep' },
    { name: 'REPORT', path: '/admin/report' },
  ];
  
  const sidebarContent = (
    <nav className="space-y-3 sm:space-y-4">
      {menuItems.map((item) => (
        <Link
          key={item.path}
          href={item.path}
          onClick={() => isMobile && onClose && onClose()}
          className={`block px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-bold text-base sm:text-lg transition-colors ${
            pathname === item.path
              ? 'bg-[#B6771D] text-white'
              : 'text-[#B6771D] hover:bg-[#FFFEC7]'
          }`}
          style={{fontFamily: 'Inter'}}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
  
  // Mobile drawer
  if (isMobile) {
    return (
      <>
        {/* Overlay */}
        {isOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={onClose}
          />
        )}
        
        {/* Drawer */}
        <aside className={`fixed left-0 top-16 bottom-0 w-64 bg-white shadow-2xl z-50 transition-transform duration-300 ease-in-out md:hidden overflow-y-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="p-6">
            {sidebarContent}
          </div>
        </aside>
      </>
    );
  }
  
  // Desktop sidebar
  return (
    <aside className="hidden md:block w-56 lg:w-64 bg-white rounded-3xl shadow-lg ml-4 lg:ml-6 p-6 lg:p-8 h-fit sticky top-28">
      {sidebarContent}
    </aside>
  );
}