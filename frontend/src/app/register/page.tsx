"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import styles from "./register.module.css";
import { inter } from "@/app/fonts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPerson, faEnvelope, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

const ASSETS = {
  hero: "/images/hero-login.jpeg", // <- diganti sesuai permintaan
  leaf: "/images/leaf.png",
  teacup: "/images/cup.png",
  logo: "/images/jamu-logo.png",
};

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await register({ nama, email, password });

      if (result.success) {
        router.push("/beranda");
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.log("Registration error:", err);
      setError("Terjadi kesalahan saat registrasi");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative min-h-dvh w-full overflow-hidden bg-[#faf5d9]">
      {/* Backdrop: z-0 agar terlihat di atas background */}
      <div className={`${styles.backdrop} pointer-events-none absolute inset-0 z-0`} aria-hidden>
        <div className={styles.radial} />
        <div className={styles.heroCenter}>
          <div>
            <Image
              src={ASSETS.hero}
              alt=""
              fill
              className="object-cover opacity-60 blur-sm"
              sizes="100vw"
              priority
            />
          </div>
        </div>
      </div>

      {/* Dekorasi PNG: z-10 (di atas backdrop, di bawah konten) */}
      <div className="pointer-events-none absolute inset-0 z-10" aria-hidden>
        {/* Leaf kiri-atas: besar, menyamping ke tengah (condong kanan) */}
        <div className="absolute left-[-60px] top-[-42px] h-[220px] w-[220px] sm:left-[-60px] sm:top-[-42px] sm:h-[280px] sm:w-[280px]">
          <Image
            src={ASSETS.leaf}
            alt=""
            fill
            className="object-contain rotate-[136.06deg]"
            sizes="(max-width: 640px) 220px, 280px"
          />
        </div>

        {/* Leaf kanan-bawah: besar, menyamping ke tengah (condong kiri) */}
        <div className="absolute bottom-2 right-[-70px] h-[240px] w-[240px] sm:bottom-2 sm:right-[-70px] sm:h-[300px] sm:w-[300px]">
          <Image
            src={ASSETS.leaf}
            alt=""
            fill
            className="object-contain rotate-[-59.46deg]"
            sizes="(max-width: 640px) 240px, 300px"
          />
        </div>

        {/* Cangkir pojok kiri-bawah */}
        <div className="absolute bottom-[-20px] left-[-20px] h-32 w-32 sm:h-32 sm:w-32">
          <Image src={ASSETS.teacup} alt="" fill className="object-contain" sizes="(max-width: 640px) 64px, 80px" />
        </div>
        {/* Cangkir pojok kanan-bawah (mirror) */}
        <div className="absolute bottom-[-20px] right-[-20px] h-32 w-32 sm:h-32 sm:w-32">
          <Image src={ASSETS.teacup} alt="" fill className="object-contain scale-x-[-1]" sizes="(max-width: 640px) 64px, 80px" />
        </div>
      </div>

      {/* Konten: z-20 */}
      <section className="relative z-20 mx-auto flex max-w-[980px] flex-col items-center px-4 py-8 sm:px-6 sm:py-10">
        {/* Brand */}
        <div className="mb-4 flex items-center gap-3 sm:mb-5">
          <Image src={ASSETS.logo} alt="Logo Jamu Kita" width={48} height={48} className="h-10 w-10 sm:h-12 sm:w-12" />
          <div className="leading-tight">
            <p className={` ${inter.className} text-xl italic font-bold text-[#B6771D] sm:text-2xl`}>Jamu Kita</p>
            <p className={`${inter.className} -mt-0.5 text-xs font-semibold text-[#b3751c] sm:text-sm`}>Herbal Indonesia</p>
          </div>
        </div>

        <h1 className="mb-5 text-center text-2xl font-bold text-[#4C763B] sm:mb-6 sm:text-3xl">Create Account</h1>

        {error && (
          <div className="mb-4 w-full max-w-md rounded-lg bg-red-50 border border-red-200 p-3 text-center text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Card form */}
        <form
          className="w-full max-w-md rounded-2xl bg-white/50 p-4 shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur-md sm:p-5"
          onSubmit={handleSubmit}
        >
          {/* Username */}
          <label className="mb-3 block">
            <span className="sr-only">Name</span>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="Name"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                disabled={isLoading}
                className="h-11 w-full rounded-full border border-[#cde7cf] bg-white/90 px-4 pr-11 text-sm text-[#2f3e2a] placeholder:text-[#9fb19a] outline-none focus:border-[#66b37a] focus:ring-2 focus:ring-[#bfe6c9] disabled:opacity-50"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#B6771D]">
                <FontAwesomeIcon icon={faPerson} className="h-5 w-5" />
              </span>
            </div>
          </label>
          {/* Email */}
          <label className="mb-3 block">
            <span className="sr-only">Email Address</span>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="h-11 w-full rounded-full border border-[#cde7cf] bg-white/90 px-4 pr-11 text-sm text-[#2f3e2a] placeholder:text-[#9fb19a] outline-none focus:border-[#66b37a] focus:ring-2 focus:ring-[#bfe6c9] disabled:opacity-50"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#B6771D]">
                <FontAwesomeIcon icon={faEnvelope} className="h-5 w-5" />
              </span>
            </div>
          </label>

          {/* Password */}
          <label className="mb-1 block">
            <span className="sr-only">Password</span>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="h-11 w-full rounded-full border border-[#cde7cf] bg-white/90 px-4 pr-11 text-sm text-[#2f3e2a] placeholder:text-[#9fb19a] outline-none focus:border-[#66b37a] focus:ring-2 focus:ring-[#bfe6c9] disabled:opacity-50"
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 text-[#B6771D] hover:bg-[#e8f6ea]"
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="h-4 w-4" />
              </button>
            </div>
          </label>

          {/* Remember & Forgot */}
          <div className="mb-4 flex items-center justify-between">
            <label className="flex cursor-pointer select-none items-center gap-0 text-xs text-[#355238] sm:text-sm">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-11 rounded border-[#8bc79c] text-[#B6771D] focus:ring-[#8bd3a1]"
              />
              Remember
            </label>
            <a href="#" className="text-xs font-semibold text-[#B6771D] underline-offset-2 hover:underline sm:text-sm">
              Forgot Password?
            </a>
          </div>

          {/* Create Account */}
          <button
            type="submit"
            disabled={isLoading}
            className="h-11 w-full rounded-full bg-[#4C763B] text-sm font-semibold text-white shadow-sm transition hover:brightness-110 active:brightness-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Loading..." : "Create Account"}
          </button>

          {/* Divider */}
          <div className="my-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#dfeadf]" />
            <span className="text-[11px] text-[#6a7a68]">or log in with</span>
            <div className="h-px flex-1 bg-[#dfeadf]" />
          </div>

          {/* Google */}
          <button
            type="button"
            aria-label="Sign in with Google"
            className="mx-auto grid h-10 w-10 place-items-center rounded-full border border-[#dfeadf] bg-white shadow-sm hover:bg-[#f7faf7]"
          >
            <FontAwesomeIcon icon={faGoogle} className="h-5 w-5 text-[#ea4335]" />
          </button>

          {/* Sign up */}
          <p className="mt-4 text-center text-xs text-[#4e5c48] sm:text-sm">
            Have an account?{" "}
            <a href="/login" className="font-semibold text-[#226d25] underline-offset-2 hover:underline">
              Sign in
            </a>
          </p>

          
        </form>
      </section>
    </main>
  );
}