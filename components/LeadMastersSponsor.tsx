import React from 'react';
import { ArrowUpRight } from 'lucide-react';

// ============================================================================
// Blok sponsor LeadMasters — keputusan Fahmi 20 Nov 2026 18:36.
// ----------------------------------------------------------------------------
// Dipakai di halaman artikel (di bawah banner/judul, di tengah isi, di akhir
// artikel, dan di sidebar) serta di tampilan detail SETIAP linklist (bukan
// cuma linklist panduan). Blok ini bagian dari tampilan, BUKAN item tool di
// daftar — jadi tidak mengubah isi linklist / artikel apa pun.
// ----------------------------------------------------------------------------
// Logo: file ASLI dari leadmasters.my.id (/assets/leadmasters-logo.png,
// 1024x1024), diunduh 20 Nov 2026 lalu diperkecil ke 256px (PNG 46 KB +
// WebP 5 KB) ke public/assets/ — BUKAN logo buatan/AI.
// Klik: lewat pencatat klik yang sudah ada, pola yang sama dengan kartu
// tool (/api/click?tool=<id ai_tools>&slug=<slug>) — LeadMasters terdaftar
// di ai_tools sebagai id `ai-leadmasters` (affiliateUrl
// https://leadmasters.my.id), jadi /api/click mencatat klik ke tool_clicks
// lalu 302 ke leadmasters.my.id + UTM (utm_content=leadmasters-ai).
// Referrer membedakan halaman asalnya (artikel/linklist mana).
// Harga: "cuma Rp149.000" sekali lifetime tanpa langganan (aturan paten).
// Label "Sponsor" selalu tampil supaya pembaca tahu ini sponsor, bukan isi.
// ============================================================================

export const LEADMASTERS_CLICK_URL = '/api/click?tool=ai-leadmasters&slug=leadmasters-ai';

interface LeadMastersSponsorProps {
  /** 'horizontal': logo kiri + teks (artikel atas/tengah/akhir, linklist).
   *  'vertical': logo di atas, teks di tengah (sidebar artikel). */
  layout?: 'horizontal' | 'vertical';
  className?: string;
}

export const LeadMastersSponsor: React.FC<LeadMastersSponsorProps> = ({
  layout = 'horizontal',
  className = '',
}) => {
  const isVertical = layout === 'vertical';

  return (
    <div
      className={`rounded-2xl border border-teal-200 dark:border-teal-800/60 bg-teal-50 dark:bg-teal-950/30 p-4 sm:p-5 ${className}`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-teal-700 dark:text-teal-400">
          Sponsor
        </span>
        <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500">
          Iklan
        </span>
      </div>

      <div className={isVertical ? 'flex flex-col items-center text-center' : 'flex items-start gap-4'}>
        <picture className="shrink-0">
          <source srcSet="/assets/leadmasters-logo-256.webp" type="image/webp" />
          <img
            src="/assets/leadmasters-logo-256.png"
            alt="Logo LeadMasters"
            width={isVertical ? 72 : 56}
            height={isVertical ? 72 : 56}
            loading="lazy"
            decoding="async"
            className="rounded-xl shadow-sm"
          />
        </picture>

        <div className="min-w-0">
          <div className="font-bold text-base text-neutral-900 dark:text-white leading-snug">
            LeadMasters
          </div>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mt-1">
            Cari prospek sampai closing otomatis, dibantu AI Assistant — unlimited,
            lifetime, seumur hidup. Cuma Rp149.000, sekali bayar, tanpa langganan.
          </p>
          <a
            href={LEADMASTERS_CLICK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-mono font-bold shadow-sm transition-all active:scale-95 ${isVertical ? 'w-full justify-center' : ''}`}
          >
            <span>Kunjungi LeadMasters</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
