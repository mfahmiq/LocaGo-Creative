import React, { useState } from 'react';
import { X, Crown, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, loginWithEmail, registerWithEmail, loginWithOwnerPin } = useAuth();
  
  const [tab, setTab] = useState<'login' | 'register' | 'owner_pin'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [ownerPin, setOwnerPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    const res = await loginWithEmail(email, password);
    setIsLoading(false);

    if (res.success) {
      setSuccessMsg('Login berhasil! Selamat datang kembali.');
      setTimeout(() => {
        closeAuthModal();
        setSuccessMsg(null);
      }, 800);
    } else {
      setErrorMsg(res.error || 'Email atau password salah.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    const res = await registerWithEmail(email, password, fullName);
    setIsLoading(false);

    if (res.success) {
      setSuccessMsg('Akun berhasil didaftarkan! Mengarahkan ke dashboard...');
      setTimeout(() => {
        closeAuthModal();
        setSuccessMsg(null);
      }, 1000);
    } else {
      setErrorMsg(res.error || 'Pendaftaran gagal. Pastikan email valid.');
    }
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const ok = loginWithOwnerPin(ownerPin);
    if (ok) {
      setSuccessMsg('Mode Owner Terverifikasi! Selamat datang Mas Fahmi.');
      setTimeout(() => {
        closeAuthModal();
        setSuccessMsg(null);
      }, 800);
    } else {
      setErrorMsg('PIN Owner salah. Akses ditolak.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative text-neutral-900 dark:text-white my-8">
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 text-neutral-400 hover:text-neutral-700 dark:hover:text-white font-mono cursor-pointer p-1"
          aria-label="Tutup modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-neutral-100 dark:bg-neutral-950 rounded-xl mb-6 border border-neutral-200 dark:border-neutral-800 text-xs font-mono">
          <button
            type="button"
            onClick={() => { setTab('login'); setErrorMsg(null); }}
            className={`flex-1 py-2 rounded-lg font-bold transition-all cursor-pointer ${
              tab === 'login'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Masuk
          </button>
          <button
            type="button"
            onClick={() => { setTab('register'); setErrorMsg(null); }}
            className={`flex-1 py-2 rounded-lg font-bold transition-all cursor-pointer ${
              tab === 'register'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Daftar Akun
          </button>
          <button
            type="button"
            onClick={() => { setTab('owner_pin'); setErrorMsg(null); }}
            className={`px-3 py-2 rounded-lg font-bold transition-all cursor-pointer ${
              tab === 'owner_pin'
                ? 'bg-amber-500 text-black shadow-sm'
                : 'text-neutral-500 hover:text-amber-400'
            }`}
            title="Akses Cepat Owner"
          >
            <span className="inline-flex items-center gap-1">
              <Crown className="w-3.5 h-3.5" />
              <span>Owner</span>
            </span>
          </button>
        </div>

        {/* Feedback Alerts */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-mono leading-relaxed flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-mono leading-relaxed flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* TAB 1: LOGIN */}
        {tab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <h3 className="text-xl font-bold mb-1">Selamat Datang Kembali</h3>
              <p className="text-xs text-neutral-500 font-mono mb-4">
                Masuk untuk membuat playlist, mengelola tool pilihan, dan berbagi kurasi ke publik.
              </p>
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Alamat Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold transition-all shadow-md cursor-pointer active:scale-95 disabled:opacity-50"
            >
              {isLoading ? 'Memverifikasi...' : 'Masuk Sekarang →'}
            </button>
          </form>
        )}

        {/* TAB 2: REGISTER */}
        {tab === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <h3 className="text-xl font-bold mb-1">Daftar Akun Kreator</h3>
              <p className="text-xs text-neutral-500 font-mono mb-4">
                Buat akun gratis untuk mulai mengkurasi playlist AI Anda dan bagikan ke audiens Instagram.
              </p>
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Nama Lengkap / Username
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Contoh: Rian Kreator"
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Alamat Email Aktif
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Password (Minimal 6 Karakter)
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold transition-all shadow-md cursor-pointer active:scale-95 disabled:opacity-50"
            >
              {isLoading ? 'Mendaftarkan Akun...' : 'Daftar & Buat Playlist Gratis →'}
            </button>
          </form>
        )}

        {/* TAB 3: OWNER FAST PIN */}
        {tab === 'owner_pin' && (
          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center mx-auto mb-2">
                <Crown className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">Akses Cepat Owner (Mas Fahmi)</h3>
              <p className="text-xs text-neutral-500 font-mono mt-1">
                Masukkan PIN master untuk langsung mengaktifkan hak akses Founder & Owner.
              </p>
            </div>

            <div>
              <input
                type="password"
                required
                autoFocus
                value={ownerPin}
                onChange={(e) => setOwnerPin(e.target.value)}
                placeholder="Masukkan PIN Owner..."
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-mono text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono text-xs font-bold transition-all shadow-md cursor-pointer active:scale-95"
            >
              Verifikasi Owner →
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
