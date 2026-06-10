"use client";

import SejarahContent from "@/components/sejarah/SejarahContent";
import BlogSidebar from "@/components/sejarah/BlogSidebar"; // Top News + Search Sidebar


export default function SejarahPage() {
  return (
    <div className="min-h-screen bg-[#FFFBEA]">

      {/* Layout utama */}
      <div className="pt-24 px-8 flex flex-col md:flex-row gap-10">

        {/* Konten sejarah */}
        <div className="flex-1">
          <SejarahContent />
        </div>

        {/* Sidebar kanan */}
        <div className="w-full md:w-[350px] flex flex-col gap-6 sticky top-32">
          <BlogSidebar />
        </div>

      </div>

    

    </div>
  );
}
