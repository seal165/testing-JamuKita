"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import { adminApiService } from "@/lib/adminApi";
import { AdminStats } from "@/types/adminApi.types";
import Image from "next/image";

export default function StatistikPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await adminApiService.getAnalyticsLogs();
        if (response.success && response.data) {
          setStats(response.data);
        } else {
          throw new Error(response.message || "Failed to fetch statistics");
        }
      } catch (err) {
        console.error("Error fetching statistics:", err);
        setError("Gagal memuat statistik. Menggunakan data contoh.");
        // Use dummy data as fallback
        setStats(getDummyData());
      } finally {
        setLoading(false);
      }
    };
    fetchStatistics();
  }, []);

  const getDummyData = (): AdminStats => {
    const chartData = [
      { date: "2024-11-01", visitors: 245 },
      { date: "2024-11-02", visitors: 312 },
      { date: "2024-11-03", visitors: 289 },
      { date: "2024-11-04", visitors: 401 },
      { date: "2024-11-05", visitors: 478 },
      { date: "2024-11-06", visitors: 523 },
      { date: "2024-11-07", visitors: 445 },
      { date: "2024-11-08", visitors: 267 },
      { date: "2024-11-09", visitors: 334 },
      { date: "2024-11-10", visitors: 298 },
      { date: "2024-11-11", visitors: 389 },
      { date: "2024-11-12", visitors: 456 },
      { date: "2024-11-13", visitors: 612 },
      { date: "2024-11-14", visitors: 534 },
      { date: "2024-11-15", visitors: 278 },
      { date: "2024-11-16", visitors: 345 },
      { date: "2024-11-17", visitors: 312 },
      { date: "2024-11-18", visitors: 423 },
      { date: "2024-11-19", visitors: 501 },
      { date: "2024-11-20", visitors: 589 },
      { date: "2024-11-21", visitors: 498 },
      { date: "2024-11-22", visitors: 289 },
      { date: "2024-11-23", visitors: 367 },
      { date: "2024-11-24", visitors: 334 },
      { date: "2024-11-25", visitors: 412 },
      { date: "2024-11-26", visitors: 489 },
      { date: "2024-11-27", visitors: 578 },
      { date: "2024-11-28", visitors: 512 },
      { date: "2024-11-29", visitors: 301 },
      { date: "2024-11-30", visitors: 378 },
    ];

    const totalVisitors = chartData.reduce((sum, data) => sum + data.visitors, 0);

    return {
      summary: {
        totalVisitors,
        averageDaily: Math.round(totalVisitors / chartData.length),
        highestVisitors: 612,
        lowestVisitors: 245,
        period: "30 days",
      },
      dailyVisitors: chartData,
      topCategories: [
        { name: "Kesehatan", count: 92 },
        { name: "Manfaat", count: 75 },
        { name: "Bahan", count: 54 },
      ],
      topRecipes: [
        { id: "1", title: "Jamu Beras Kencur", count: 154 },
        { id: "2", title: "Jamu Temulawak", count: 122 },
        { id: "3", title: "Jamu Kunir Madu", count: 96 },
      ],
      topSearchTerms: [],
    };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
    return `${days[date.getDay()]} ${date.getDate()}`;
  };

  const chartData =
    stats?.dailyVisitors.map((d) => ({
      tanggal: formatDate(d.date),
      pengunjung: d.visitors,
    })) || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Memuat statistik...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Image */}
      <div className="w-full h-32 rounded-2xl overflow-hidden">
        <Image src="/images/header.png" alt="Herbs Header" width={1200} height={0} className="w-full h-full object-cover" />
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-3xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-[#B6771D] mb-6" style={{ fontFamily: "Inter" }}>
          STATISTIK PENGUNJUNG
        </h1>

        {error && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <p className="text-yellow-700">{error}</p>
          </div>
        )}

        {/* Statistics Cards - Pengunjung */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">Total Pengunjung</h3>
            <p className="text-3xl font-bold text-blue-600">
              {stats?.summary.totalVisitors.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">30 hari terakhir</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">Rata-rata Harian</h3>
            <p className="text-3xl font-bold text-green-600">
              {stats?.summary.averageDaily.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">pengunjung/hari</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">Pengunjung Tertinggi</h3>
            <p className="text-3xl font-bold text-purple-600">
              {stats?.summary.highestVisitors.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">dalam sehari</p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">Pengunjung Terendah</h3>
            <p className="text-3xl font-bold text-orange-600">
              {stats?.summary.lowestVisitors.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">dalam sehari</p>
          </div>
        </div>

        {/* Chart Pengunjung Harian */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-[#B6771D] mb-4" style={{ fontFamily: "Inter" }}>
            Grafik Pengunjung Harian (30 Hari Terakhir)
          </h2>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="tanggal" tick={{ fontSize: 11 }} interval={2} />
              <YAxis
                tick={{ fontSize: 12 }}
                label={{ value: "Pengunjung", angle: -90, position: "insideLeft" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "2px solid #B6771D",
                  borderRadius: "8px",
                  padding: "10px",
                }}
                labelStyle={{ fontWeight: "bold", color: "#B6771D" }}
              />
              <Line
                type="monotone"
                dataKey="pengunjung"
                stroke="#B6771D"
                strokeWidth={3}
                dot={{ fill: "#B6771D", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-center text-gray-500 mt-2 font-semibold">
            {stats?.summary.period} terakhir
          </p>
        </div>

        {/* Tables */}
        <div className="grid grid-cols-2 gap-6">
          {/* Kategori Table */}
          <div>
            <h2 className="text-xl font-bold text-[#B6771D] mb-4" style={{ fontFamily: "Inter" }}>
              Kategori yang Paling Sering dicari
            </h2>
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left p-3 font-bold" style={{ fontFamily: "Inter" }}>
                    Nama Kategori
                  </th>
                  <th className="text-left p-3 font-bold" style={{ fontFamily: "Inter" }}>
                    Pencarian
                  </th>
                  <th className="text-left p-3 font-bold" style={{ fontFamily: "Inter" }}>
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {stats?.topCategories.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3">{item.name}</td>
                    <td className="p-3">{item.count}</td>
                    <td className="p-3">
                      <button className="text-blue-600 hover:underline">Lihat Konten</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Jamu Table */}
          <div>
            <h2 className="text-xl font-bold text-[#B6771D] mb-4" style={{ fontFamily: "Inter" }}>
              Jamu yang Paling Sering dicari
            </h2>
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left p-3 font-bold" style={{ fontFamily: "Inter" }}>
                    Jamu
                  </th>
                  <th className="text-left p-3 font-bold" style={{ fontFamily: "Inter" }}>
                    Pencarian
                  </th>
                  <th className="text-left p-3 font-bold" style={{ fontFamily: "Inter" }}>
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {stats?.topRecipes.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3">{item.title}</td>
                    <td className="p-3">{item.count}</td>
                    <td className="p-3">
                      <a
                        href={`/resep/${item.id}?dontTrack=true`}
                        className="text-blue-600 hover:underline"
                      >
                        Cek Konten
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
