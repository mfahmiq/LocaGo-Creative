// components/DonateWidget.tsx — Donasi sendiri via Midtrans (tanpa platform 5%).
// Aturan (Fahmi 2026-11-19): tombol kopi mengambang selalu terlihat; popup
// TIDAK muncul saat load — baru setelah 50 detik, atau scroll 70%, atau
// setelah download source code (event 'locago:download-complete').
// Maks 1x/sesi; kalau ditutup, jangan muncul lagi 7 hari.
// Buka manual: event 'locago:open-donate' (mis. item "Traktir Kopi" di
// Navbar) — klik eksplisit user selalu membuka popup, tanpa guard supresi.
import React, { useEffect, useState } from 'react';
import { Coffee, X, Heart, Check, Loader2 } from 'lucide-react';
import { makeOrderId, requestSnapToken, payWithSnap, checkPaymentStatus } from '../lib/midtrans';
import { formatRupiah } from '../lib/utm';
import { supabase } from '../lib/supabase';

const PRESETS = [10000, 25000, 50000, 100000];
const SHOWN_SESSION_KEY = 'locago_donate_shown_session';
const DISMISSED_KEY = 'locago_donate_dismissed_until';
const DELAY_MS = 50000;

export const DonateWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState<number>(25000);
  const [customAmount, setCustomAmount] = useState('');
  const [donorName, setDonorName] = useState('');
  const [phase, setPhase] = useState<'form' | 'paying' | 'done' | 'error'>('form');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    let dismissedUntil = 0;
    let shownThisSession = false;
    try {
      dismissedUntil = Number(localStorage.getItem(DISMISSED_KEY) || 0);
      shownThisSession = sessionStorage.getItem(SHOWN_SESSION_KEY) === '1';
    } catch {}
    if (dismissedUntil > Date.now() || shownThisSession) return;

    const show = () => {
      try {
        if (sessionStorage.getItem(SHOWN_SESSION_KEY) === '1') return;
        sessionStorage.setItem(SHOWN_SESSION_KEY, '1');
      } catch {}
      setIsOpen(true);
    };

    const timer = window.setTimeout(show, DELAY_MS);
    const onScroll = () => {
      // Robust: hitung dari window.scrollY + fallback body/documentElement,
      // dan dengarkan juga di document (capture) agar scroll di kontainer
      // dalam tetap terdeteksi.
      const el = document.documentElement;
      const scrollTop = window.scrollY || el.scrollTop || document.body.scrollTop || 0;
      const scrollHeight = Math.max(el.scrollHeight, document.body.scrollHeight);
      const clientHeight = window.innerHeight || el.clientHeight || 0;
      const ratio = scrollTop / Math.max(1, scrollHeight - clientHeight);
      if (ratio >= 0.7) show();
    };
    const onDownload = () => show();
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('scroll', onScroll, { passive: true, capture: true });
    window.addEventListener('locago:download-complete', onDownload);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('scroll', onScroll, { capture: true });
      window.removeEventListener('locago:download-complete', onDownload);
    };
  }, []);

  // Buka manual via event 'locago:open-donate' (mis. item "Traktir Kopi" di
  // Navbar). Sengaja di useEffect terpisah dan TANPA guard supresi/sesi —
  // klik eksplisit user harus selalu membuka popup, sama seperti tombol
  // kopi mengambang.
  useEffect(() => {
    const onOpenRequest = () => {
      setPhase('form');
      setIsOpen(true);
    };
    window.addEventListener('locago:open-donate', onOpenRequest);
    return () => window.removeEventListener('locago:open-donate', onOpenRequest);
  }, []);

  const close = () => {
    setIsOpen(false);
    try {
      localStorage.setItem(DISMISSED_KEY, String(Date.now() + 7 * 86400000));
    } catch {}
  };

  const finalAmount = customAmount ? Math.max(3000, Math.floor(Number(customAmount) || 0)) : amount;

  const handlePay = async () => {
    if (finalAmount < 3000) {
      setErrorMsg('Donasi minimal Rp3.000.');
      setPhase('error');
      return;
    }
    setPhase('paying');
    setErrorMsg('');
    const orderId = makeOrderId('DONASI');
    try {
      const { token } = await requestSnapToken(orderId, finalAmount, 'donasi-locago', 'Donasi LocaGo Creative');
      // Catat donasi (ledger admin). Insert anon: tanpa .select() supaya tidak
      // kena read-back RLS (Prefer: return=minimal).
      await supabase.from('donations').insert({
        order_id: orderId, type: 'donasi', amount: finalAmount, status: 'pending',
        tool_name: donorName.trim() || null,
      });
      const result = await payWithSnap(token);
      if (result === 'closed') {
        setErrorMsg('Pembayaran ditutup sebelum selesai. Tidak ada uang yang terpotong.');
        setPhase('error');
        return;
      }
      if (result === 'error') {
        setErrorMsg('Popup pembayaran Midtrans gagal dibuka. Coba lagi atau matikan pemblokir popup.');
        setPhase('error');
        return;
      }
      const check = await checkPaymentStatus(orderId);
      if (check.isPaid) {
        await supabase.rpc('update_donation_status', { p_order_id: orderId, p_status: 'settlement' });
        setPhase('done');
      } else {
        // Pending (mis. VA belum dibayar): tetap tercatat, status menyusul.
        setPhase('done');
      }
    } catch (e: unknown) {
      setErrorMsg(e instanceof Error ? e.message : 'Terjadi kesalahan saat memproses donasi.');
      setPhase('error');
    }
  };

  return (
    <>
      {/* Tombol kopi mengambang — selalu terlihat, tidak menutupi konten */}
      <button
        onClick={() => { setPhase('form'); setIsOpen(true); }}
        aria-label="Donasi untuk LocaGo Creative"
        title="Traktir kopi untuk LocaGo Creative"
        className="fixed bottom-5 right-5 z-40 w-12 h-12 rounded-full bg-amber-500 hover:bg-amber-400 text-white shadow-2xl flex items-center justify-center transition-all active:scale-95 cursor-pointer"
      >
        <Coffee className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={close}>
          <div
            className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative text-neutral-900 dark:text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={close} aria-label="Tutup" className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700 dark:hover:text-white cursor-pointer p-1">
              <X className="w-5 h-5" />
            </button>

            {phase === 'done' ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h4 className="font-bold text-base">Terima kasih dukungannya!</h4>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Donasi {formatRupiah(finalAmount)} kamu membantu 591 tool di LocaGo tetap gratis untuk semua orang.
                </p>
                <button onClick={close} className="mt-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold cursor-pointer">
                  Tutup
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <Heart className="w-5 h-5 text-amber-500" />
                  <h3 className="text-lg font-bold">Traktir Kopi LocaGo</h3>
                </div>
                <p className="text-xs text-neutral-500 mb-5 leading-relaxed">
                  Bantu keep 591 AI tools & source code di LocaGo tetap gratis. Pembayaran via Midtrans (QRIS, GoPay, VA bank) — tanpa potongan platform.
                </p>

                <div className="grid grid-cols-4 gap-2 mb-3">
                  {PRESETS.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => { setAmount(p); setCustomAmount(''); }}
                      className={`py-2 rounded-xl text-xs font-mono font-bold border cursor-pointer transition-all ${!customAmount && amount === p ? 'bg-purple-600 text-white border-purple-600' : 'bg-neutral-50 dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 hover:border-purple-400'}`}
                    >
                      {p / 1000}rb
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  min={3000}
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="Nominal lain (min Rp3.000)"
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-purple-500 mb-3"
                />
                <input
                  type="text"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  placeholder="Nama kamu (opsional)"
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
                />

                {phase === 'error' && (
                  <p className="text-xs text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2 mb-3">{errorMsg}</p>
                )}

                <button
                  onClick={handlePay}
                  disabled={phase === 'paying'}
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-white font-mono text-sm font-bold shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  {phase === 'paying' ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Memproses...</>
                  ) : (
                    <><Coffee className="w-4 h-4" /> Donasi {formatRupiah(finalAmount)}</>
                  )}
                </button>
                <p className="text-[10px] text-neutral-400 text-center mt-3">Aman via Midtrans Snap. Donasi bersifat sukarela dan tidak dapat dikembalikan.</p>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};
