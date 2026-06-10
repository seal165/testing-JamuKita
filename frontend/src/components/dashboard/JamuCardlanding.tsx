"use client";

import { useState } from "react";

interface JamuCardProps {
  index: number; // index card
  title: string;
  img: string;
  rating: number;
  benefits: string[];
  ingredients: string[];
  steps: string[];
}

export default function JamuCardlanding({
  index,
  title,
  img,
  rating,
  benefits = [],
  ingredients = [],
  steps = [],
}: JamuCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Login state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  // Profile Popup
  const [selectedProfile, setSelectedProfile] = useState<any>(null);

  // Report Popup
  const [showReport, setShowReport] = useState(false);
  const [reportCategory, setReportCategory] = useState("");
  const [reportMessage, setReportMessage] = useState("");

  // Review
  const [review, setReview] = useState("");
  const [userRating, setUserRating] = useState(0);

  const [submittedReviews, setSubmittedReviews] = useState<
    { text: string; rating: number; user: string; avatar: string }[]
  >([
    {
      text: "Jamu ini sangat enak dan membuat badan lebih segar!",
      rating: 5,
      user: "Aisyah",
      avatar: "/img/users/user1.png",
    },
    {
      text: "Rasanya kuat, cocok diminum saat cuaca dingin.",
      rating: 4,
      user: "Budi",
      avatar: "/img/users/user2.png",
    },
  ]);

  const randomAvatars = [
    "/img/users/user1.png",
    "/img/users/user2.png",
    "/img/users/user3.png",
    "/img/users/user4.png",
  ];

  // Saved Post (card level)
  const [isSaved, setIsSaved] = useState(false);
  const toggleSave = () => setIsSaved(!isSaved);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      setShowLogin(true);
      return;
    }
    if (!review || !userRating) return;

    const randomAvatar =
      randomAvatars[Math.floor(Math.random() * randomAvatars.length)];

    setSubmittedReviews([
      ...submittedReviews,
      {
        text: review,
        rating: userRating,
        user: "Pengguna Baru",
        avatar: randomAvatar,
      },
    ]);

    setReview("");
    setUserRating(0);
  };

  const handleReportClick = () => {
    if (!isLoggedIn) {
      setShowLogin(true);
      return;
    }
    setShowReport(true);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setShowLogin(false);
  };

  return (
    <>
      {/* CARD */}
      <div
        className="w-36 bg-white rounded-xl border shadow hover:scale-105 transition relative cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <img src={img} className="h-32 w-full object-cover rounded-t-xl" alt={title} />
        <div className="p-2">
          <h3 className="text-sm font-semibold">{title}</h3>
          <p className="text-xs mt-1">⭐ {rating}/5</p>
        </div>

        {/* SAVE BUTTON CARD */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleSave();
          }}
          className="absolute top-2 right-2 text-xl"
        >
          {isSaved ? "🔖" : "📑"}
        </button>
      </div>

      {/* MAIN POPUP */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50 overflow-auto p-4">
          <div className="relative bg-[#FAF8F1] rounded-3xl w-full max-w-6xl shadow-lg p-6">

            {/* SAVE BUTTON POPUP */}
            <button
              onClick={toggleSave}
              className="absolute top-5 right-5 text-2xl"
            >
              {isSaved ? "🔖" : "📑"}
            </button>

            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-5 right-14 text-black text-2xl font-bold hover:text-red-500"
            >
              &times;
            </button>

            <div className="flex flex-col md:flex-row gap-6">

              {/* LEFT IMAGE */}
              <div className="md:w-1/3 w-full">
                <img
                  src={img}
                  alt={title}
                  className="rounded-xl w-full object-cover"
                  style={{ height: "400px" }}
                />
              </div>

              {/* RIGHT CONTENT */}
              <div className="md:w-2/3 w-full max-h-[500px] overflow-y-auto pr-2 space-y-4">

                <h2 className="text-2xl font-bold">{title}</h2>
                <p className="text-sm font-medium">⭐ {rating}/5</p>

                {/* BENEFITS */}
                <div>
                  <h3 className="font-semibold text-lg mb-2">Manfaat</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {benefits.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>

                {/* INGREDIENTS */}
                <div>
                  <h3 className="font-semibold text-lg mb-2">Bahan / Resep</h3>
                  <ul className="list-decimal pl-5 space-y-1">
                    {ingredients.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>

                {/* STEPS */}
                <div>
                  <h3 className="font-semibold text-lg mb-2">Langkah Pembuatan</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {steps.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>

                {/* REVIEW FORM */}
                <div className="mt-4">
                  <h3 className="font-semibold text-lg mb-2">Tambahkan Review</h3>
                  <form onSubmit={handleSubmitReview} className="flex flex-col gap-2">
                    <input
                      type="text"
                      placeholder="Tulis review..."
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      className="p-2 border rounded"
                    />
                    <select
                      value={userRating}
                      onChange={(e) => setUserRating(Number(e.target.value))}
                      className="p-2 border rounded"
                    >
                      <option value={0}>Pilih rating</option>
                      <option value={1}>⭐ 1</option>
                      <option value={2}>⭐ 2</option>
                      <option value={3}>⭐ 3</option>
                      <option value={4}>⭐ 4</option>
                      <option value={5}>⭐ 5</option>
                    </select>
                    <button
                      type="submit"
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                    >
                      Submit
                    </button>
                  </form>
                </div>

                {/* REVIEW LIST */}
                <div className="mt-5">
                  <h3 className="font-semibold text-lg mb-3">Ulasan Pengguna</h3>
                  <div className="space-y-3">
                    {submittedReviews.map((r, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-start bg-white border rounded-xl p-3 shadow-sm"
                      >
                        {/* LEFT - CLICK PROFILE */}
                        <div
                          className="flex gap-3 cursor-pointer"
                          onClick={() => {
                            if (!isLoggedIn) {
                              setShowLogin(true);
                              return;
                            }
                            setSelectedProfile(r);
                          }}
                        >
                          <img
                            src={r.avatar}
                            className="w-10 h-10 rounded-full object-cover border"
                          />
                          <div>
                            <p className="text-sm font-semibold">{r.user}</p>
                            <p className="text-xs text-yellow-600">⭐ {r.rating}/5</p>
                            <p className="text-sm mt-1">{r.text}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* PROFILE POPUP */}
      {selectedProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[60]">
          <div className="bg-white p-6 rounded-2xl w-96 shadow-xl relative">
            <button
              onClick={() => setSelectedProfile(null)}
              className="absolute top-3 right-4 text-xl font-bold hover:text-red-500"
            >
              &times;
            </button>

            <div className="text-center">
              <img
                src={selectedProfile.avatar}
                className="w-24 h-24 rounded-full mx-auto border object-cover mb-3"
              />
              <h2 className="text-xl font-semibold">{selectedProfile.user}</h2>
              <p className="text-yellow-600">⭐ {selectedProfile.rating}/5</p>

              <button
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                onClick={handleReportClick}
              >
                Report User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REPORT POPUP */}
      {showReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[70]">
          <div className="bg-white p-6 rounded-2xl w-96 shadow-xl relative">
            <button
              onClick={() => setShowReport(false)}
              className="absolute top-3 right-4 text-xl font-bold hover:text-red-500"
            >
              &times;
            </button>

            <h2 className="text-xl font-bold mb-3">Report User</h2>

            <select
              className="w-full border p-2 rounded mb-3"
              value={reportCategory}
              onChange={(e) => setReportCategory(e.target.value)}
            >
              <option value="">Pilih kategori</option>
              <option>Akun Palsu</option>
              <option>Konten Tidak Pantas</option>
              <option>Perilaku Buruk</option>
              <option>Spam / Penipuan</option>
              <option>Lainnya</option>
            </select>

            {reportCategory === "Lainnya" && (
              <textarea
                className="w-full border p-2 rounded mb-3"
                placeholder="Tulis alasan..."
                value={reportMessage}
                onChange={(e) => setReportMessage(e.target.value)}
              ></textarea>
            )}

            <button className="w-full bg-red-600 text-white p-2 rounded hover:bg-red-700">
              Submit Report
            </button>

          </div>
        </div>
      )}

      {/* LOGIN POPUP */}
      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[80]">
          <div className="bg-white p-6 rounded-2xl w-80 shadow-xl relative">
            <button
              onClick={() => setShowLogin(false)}
              className="absolute top-3 right-4 text-xl font-bold hover:text-red-500"
            >
              &times;
            </button>

            <h2 className="text-xl font-bold mb-3 text-center">Login Dulu</h2>
            <p className="text-sm mb-3 text-center">Silakan login untuk bisa memberi review atau report akun.</p>

            <button
              onClick={handleLogin}
              className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
            >
              Login
            </button>
          </div>
        </div>
      )}
    </>
  );
}
