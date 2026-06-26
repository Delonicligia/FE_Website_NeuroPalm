import React, { useState, useEffect } from 'react';
import sawitlogin from "../../assets/sawitlogin.jpg"
import logo2 from "../../assets/logo2.png"
import { userService } from '@/services/userService';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const rememberedEmail = localStorage.getItem('remembered_email');
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await userService.login({
        email: email,
        password: password
      });
      localStorage.setItem('access_token', response.access_token);
      
      if (rememberMe) {
        localStorage.setItem('remembered_email', email);
      } else {
        localStorage.removeItem('remembered_email');
      }

      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.detail || 
        'Login gagal. Silakan periksa kembali email/username dan kata sandi Anda.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 p-4 sm:p-6 md:p-8 font-sans">
      <div className="w-full max-w-5xl bg-white rounded-[24px] sm:rounded-[32px] md:rounded-[40px] shadow-2xl flex flex-col md:flex-row overflow-hidden min-h-[600px] md:min-h-[700px]">
        
        {/* Left Side: Brand Banner (Hidden on Mobile) */}
        <div className="hidden md:flex md:w-1/2 bg-emerald-950 p-12 relative flex-col justify-between overflow-hidden">
          {/* Overlay Background Image */}
          <div className="absolute inset-0 z-0">
            <img 
              className="w-full h-full object-cover opacity-35 mix-blend-overlay" 
              src={sawitlogin}
              alt="NeuroPalm Plantation" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-transparent to-transparent" />
          </div>

          {/* Logo Section */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-md">
              <img src={logo2} alt="NeuroPalm Logo" />
            </div>
            <span className="text-white text-2xl font-black tracking-tight">NeuroPalm</span>
          </div>

          {/* Slogan & Info */}
          <div className="relative z-10 flex flex-col gap-4 max-w-md my-auto">
            <h1 className="text-white text-3xl lg:text-4xl font-bold leading-tight" style={{ color: '#ffffff' }}>
              <span style={{ color: '#ffffff' }}>Mengolah Data,<br />Menuai Wawasan.</span>
            </h1>
            <p className="text-slate-100/80 text-sm lg:text-base leading-relaxed">
              Akses pusat komando untuk Emerald Estate. Kelola hasil panen, pantau perkebunan, dan dorong keunggulan pertanian melalui arsip digital kelas atas kami.
            </p>
          </div>

          {/* Security Badge */}
          <div className="relative z-10 self-start">
            <div className="px-4 py-2 bg-emerald-900/60 border border-emerald-800/40 rounded-full backdrop-blur-md flex items-center gap-2">
              <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
              <span className="text-white text-[10px] lg:text-xs font-semibold tracking-wider uppercase">
                LINGKUNGAN ADMIN TERJAMIN
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Form Area */}
        <div className="w-full md:w-1/2 p-6 sm:p-12 md:p-16 lg:p-20 flex flex-col justify-center bg-white">
          <div className="w-full max-w-md mx-auto flex flex-col gap-8">
            
            {/* Header */}
            <div className="flex flex-col gap-2">
              <div className="md:hidden flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded bg-emerald-900 flex items-center justify-center">
                  <span className="text-white font-black text-xs">N</span>
                </div>
                <span className="text-emerald-950 text-lg font-black tracking-tight">NeuroPalm</span>
              </div>
              <h1 className="text-black font-bold text-3xl sm:text-4xl">
                Selamat Datang Kembali.
              </h1>
              <p className="text-neutral-500 text-sm sm:text-base font-medium">
                Silakan masukkan kredensial administrasi Anda.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-sm rounded-xl font-medium">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {/* Email Field */}
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-neutral-700 text-xs font-bold uppercase tracking-wider">
                  ALAMAT EMAIL / USERNAME
                </label>
                <input
                  id="email"
                  type="text"
                  required
                  placeholder="admin@neuropalm.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white transition-all text-sm sm:text-base"
                />
              </div>

              {/* Password Field */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="password" className="text-neutral-700 text-xs font-bold uppercase tracking-wider">
                    KATA SANDI
                  </label>
                  <a href="#" className="text-emerald-800 hover:text-emerald-900 text-xs font-bold uppercase tracking-wider transition">
                    LUPA KATA SANDI?
                  </a>
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  placeholder="Masukkan kata sandi"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white transition-all text-sm sm:text-base"
                />
              </div>

              {/* Remember Me Option */}
              <div className="flex items-center gap-3 py-1">
                <input
                  id="remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-5 h-5 rounded border-slate-300 text-emerald-800 focus:ring-emerald-700 cursor-pointer accent-emerald-800"
                />
                <label htmlFor="remember" className="text-neutral-600 text-sm font-semibold cursor-pointer select-none">
                  Ingat Saya
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-b from-emerald-900 to-emerald-950 hover:from-emerald-800 hover:to-emerald-900 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 transform active:scale-[0.98]"
              >
                <span>{loading ? 'Sedang Login...' : 'Masuk ke Portal'}</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </button>
            </form>

            {/* Footer Text */}
            <div className="pt-6 border-t border-slate-100 text-center">
              <span className="text-neutral-500 text-xs sm:text-sm font-medium">
                Hanya untuk Personel Berwenang.
              </span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}