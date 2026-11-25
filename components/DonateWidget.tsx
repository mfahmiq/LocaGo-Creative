// components/DonateWidget.tsx — Donasi sendiri via Midtrans (tanpa platform 5%).
// Aturan (Fahmi 2026-11-19, diubah 2026-11-21): tombol kopi mengambang
// selalu terlihat; popup TIDAK muncul saat load — baru setelah 15–30 detik
// (ACAK per kunjungan halaman), atau scroll 70%, atau setelah
// download source code (event 'locago:download-complete').
// POPUP SEKALI PER HALAMAN (Fahmi 2026-11-21 07:45, "Ngerti?"): tiap
// navigasi/pindah halaman, timer 15–30 detik jalan lagi dan popup muncul
// sekali di halaman itu. Supresi 7 hari DITIADAKAN — menutup popup di satu
// halaman TIDAK boleh mematikan popup di halaman lain; menutup hanya
// mencegah popup muncul lagi di halaman yang sama.
// Buka manual: event 'locago:open-donate' (mis. item "Traktir Kopi" di
// Navbar) — klik eksplisit user selalu membuka popup.
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Coffee, X, Heart, Check, Loader2 } from 'lucide-react';
import { makeOrderId, requestSnapToken, payWithSnap, checkPaymentStatus } from '../lib/midtrans';
import { formatRupiah } from '../lib/utm';
import { supabase } from '../lib/supabase';

const PRESETS = [10000, 25000, 50000, 100000];
// Timer otomatis ACAK 15–30 detik (Fahmi 2026-11-21): satu nilai acak
// dipilih per kunjungan halaman; tidak pernah 0 detik.
const DELAY_MIN_MS = 15000;
const DELAY_MAX_MS = 30000;
const randomDelayMs = () =>
  DELAY_MIN_MS + Math.floor(Math.random() * (DELAY_MAX_MS - DELAY_MIN_MS + 1));

// Kunci "halaman" = URL penuh (path + query + hash). Situs ini SPA:
// DonateWidget di-mount sekali di App.tsx, jadi pindah halaman TIDAK
// me-remount komponen — perubahan route dideteksi dari popstate /
// hashchange + patch history.pushState/replaceState (navigasi programatik
// di App.tsx tidak memicu event apapun secara native).
const pageKey = () =>
  window.location.pathname + window.location.search + window.location.hash;

export const DonateWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState<number>(25000);
  const [customAmount, setCustomAmount] = useState('');
  const [donorName, setDonorName] = useState('');
  const [phase, setPhase] = useState<'form' | 'paying' | 'done' | 'error'>('form');
  const [errorMsg, setErrorMsg] = useState('');

  // --- Pelacak "sekali per halaman" (hidup selama komponen ter-mount,
  //     direset saat refresh — refresh = kunjungan halaman baru) ---
  const shownPagesRef = useRef<Set<string>>(new Set());
  const currentPageRef = useRef<string>(pageKey());
  const timerRef = useRef<number | null>(null);
  const isOpenRef = useRef(false);
  useEffect(() => { isOpenRef.current = isOpen; }, [isOpen]);

  // Tampilkan popup sekali di halaman saat ini (tidak lebih).
  const showPopup = useCallback(() => {
    const key = currentPageRef.current;
    if (!key || shownPagesRef.current.has(key)) return;
    shownPagesRef.current.add(key);
    setIsOpen(true);
  }, []);

  // Pasang timer acak 15–30 detik untuk halaman saat ini.
  const armPopup = useCallback(() => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    timerRef.current = null;
    if (shownPagesRef.current.has(currentPageRef.current)) return;
    timerRef.current = window.setTimeout(showPopup, randomDelayMs());
  }, [showPopup]);

  useEffect(() => {
    // Bersihkan sisa aturan lama (1x/sesi + supresi 7 hari) dari browser
    // yang pernah menyimpannya — aturan itu sudah tidak berlaku lagi.
    try {
      localStorage.removeItem('locago_donate_dismissed_until');
      sessionStorage.removeItem('locago_donate_shown_session');
    } catch {}

    const onRouteChange = () => {
      const key = pageKey();
      if (key === currentPageRef.current) return;
      currentPageRef.current = key;
      // Kalau popup sedang terbuka saat pindah halaman, popup itu sudah
      // terlihat di halaman baru — tandai halaman baru sudah ditampilkan.
      if (isOpenRef.current) {
        shownPagesRef.current.add(key);
        return;
      }
      armPopup();
    };

    const onScroll = () => {
      // Robust: hitung dari window.scrollY + fallback body/documentElement,
      // dan dengarkan juga di document (capture) agar scroll di kontainer
      // dalam tetap terdeteksi.
      const el = document.documentElement;
      const scrollTop = window.scrollY || el.scrollTop || document.body.scrollTop || 0;
      const scrollHeight = Math.max(el.scrollHeight, document.body.scrollHeight);
      const clientHeight = window.innerHeight || el.clientHeight || 0;
      const ratio = scrollTop / Math.max(1, scrollHeight - clientHeight);
      if (ratio >= 0.7) showPopup();
    };
    const onDownload = () => showPopup();

    // Tangkap navigasi programatik: history.pushState/replaceState tidak
    // memicu event apapun secara native, jadi patch keduanya untuk
    // mengirim event 'locago:route-change' (dipulihkan saat unmount).
    const origPushState = window.history.pushState.bind(window.history);
    const origReplaceState = window.history.replaceState.bind(window.history);
    const notifyRouteChange = () => window.dispatchEvent(new Event('locago:route-change'));
    window.history.pushState = function (...args: Parameters<History['pushState']>) {
      origPushState(...args);
      notifyRouteChange();
    };
    window.history.replaceState = function (...args: Parameters<History['replaceState']>) {
      origReplaceState(...args);
      notifyRouteChange();
    };

    armPopup();
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('scroll', onScroll, { passive: true, capture: true });
    window.addEventListener('locago:download-complete', onDownload);
    window.addEventListener('popstate', onRouteChange);
    window.addEventListener('hashchange', onRouteChange);
    window.addEventListener('locago:route-change', onRouteChange);
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('scroll', onScroll, { capture: true });
      window.removeEventListener('locago:download-complete', onDownload);
      window.removeEventListener('popstate', onRouteChange);
      window.removeEventListener('hashchange', onRouteChange);
      window.removeEventListener('locago:route-change', onRouteChange);
      window.history.pushState = origPushState;
      window.history.replaceState = origReplaceState;
    };
  }, [armPopup, showPopup]);

  // Buka manual via event 'locago:open-donate' (mis. item "Traktir Kopi" di
  // Navbar). Klik eksplisit user selalu membuka popup, sama seperti tombol
  // kopi mengambang. Buka manual dihitung sebagai "sudah tampil" di halaman
  // ini — popup tidak muncul lagi otomatis di halaman yang sama.
  useEffect(() => {
    const onOpenRequest = () => {
      shownPagesRef.current.add(pageKey());
      setPhase('form');
      setIsOpen(true);
    };
    window.addEventListener('locago:open-donate', onOpenRequest);
    return () => window.removeEventListener('locago:open-donate', onOpenRequest);
  }, []);

  // Menutup hanya menutup popup — TIDAK menulis supresi apapun: popup
  // tetap boleh muncul di halaman lain (sekali per halaman).
  const close = () => {
    setIsOpen(false);
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
      <button data-shopee-exclude
        onClick={() => { shownPagesRef.current.add(pageKey()); setPhase('form'); setIsOpen(true); }}
        aria-label="Donasi untuk LocaGo Creative"
        title="Traktir kopi untuk LocaGo Creative"
        className="fixed bottom-5 right-5 z-40 w-12 h-12 rounded-full bg-amber-500 hover:bg-amber-400 text-white shadow-2xl flex items-center justify-center transition-all active:scale-95 cursor-pointer"
      >
        <Coffee className="w-5 h-5" />
      </button>

      {isOpen && (
        <div data-shopee-exclude className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={close}>
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
