"use client";

import { useEffect, useState } from "react";
import { apiService } from "@/lib/api";
import type { User } from "@/types";

interface AccountSettingsProps {
  user: User | null;
}

export default function AccountSettings({ user, onProfileUpdate }: AccountSettingsProps & { onProfileUpdate: () => void }) {
  const [name, setName] = useState(user?.nama || "Irani");
  const [email, setEmail] = useState(user?.email || "");

  useEffect(() => {
    setName(user?.nama || "Irani");
    setEmail(user?.email || "");
  }, [user]);

  const handleSubmit = () => {
    apiService.updateProfile({ nama: name, email }).then((res) => {
      if (res.success) {
        alert("Profil berhasil diperbarui");
        onProfileUpdate();
      } else {
        alert("Gagal memperbarui profil: " + res.message);
      }
    }).catch((err) => {
      console.error("Error updating profile:", err);
      alert("Terjadi kesalahan saat memperbarui profil");
    });
  }

  return (
     <div className="w-full bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all">
      <h2 className="text-2xl font-bold mb-6">Pengaturan Akun</h2>

      <div className="space-y-5">
        <div>
          <label className="text-sm font-medium">Nama Lengkap</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full border rounded-xl px-4 py-3"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full border rounded-xl px-4 py-3"
          />
        </div>

        <button className="px-8 py-3 bg-green-700 text-white rounded-xl hover:scale-[1.05] transition font-semibold" onClick={handleSubmit}>
          Simpan Perubahan
        </button>
      </div>
    </div>
  );
}
