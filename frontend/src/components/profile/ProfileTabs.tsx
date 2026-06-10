"use client";

interface ProfileTabsProps {
  activeTab: "activity" | "settings";
  setActiveTab: (tab: "activity" | "settings") => void;
}

export default function ProfileTabs({ activeTab, setActiveTab }: ProfileTabsProps) {
  return (
    <section className="w-full mb-6">
      <div className="flex gap-4 border-b border-gray-300 pb-3">
        <button
          onClick={() => setActiveTab("activity")}
          className={`px-6 py-2 rounded-lg font-semibold transition ${
            activeTab === "activity"
              ? "bg-green-700 text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          Activity
        </button>

        <button
          onClick={() => setActiveTab("settings")}
          className={`px-6 py-2 rounded-lg font-semibold transition ${
            activeTab === "settings"
              ? "bg-green-700 text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          Pengaturan Akun
        </button>
      </div>
    </section>
  );
}
