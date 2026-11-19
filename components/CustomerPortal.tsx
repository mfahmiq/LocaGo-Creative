// components/CustomerPortal.tsx — Portal Pelanggan (tanpa login).
// Akses lewat token UUID yang tidak bisa ditebak: #portal/<token>.
// Menampilkan HANYA submission pemilik token itu (via /api/portal -> RPC
// get_tool_portal, SECURITY DEFINER, single-row). Read-only v1: perubahan
// diarahkan ke WA LocaGo.
import React, { useEffect, useState } from 'react';
import { Copy, ExternalLink, Check, Clock, XCircle, TrendingUp, Crown, Video, MessageCircle, BarChart3, Loader2 } from 'lucide-react';
import { fetchPortal, portalUrl, isUuidLike, type PortalSubmission, type PortalStats } from '../lib/portal';
import { formatRupiah } from '../lib/utm';

const STATUS_LABEL: Record<string, { label: string; cls: string; icon: React.ReactNode }> = {
  pending: { label: 'Menunggu Moderasi', cls: 'bg-amber-500/15 text-amber-600 border-amber-500/30', icon: <Clock className="w-4 h-4" /> },
  needs_fix: { label: 'Perlu Diperbaiki', cls: 'bg-orange-500/15 text-orange-600 border-orange-500/30', icon: <Clock className="w-4 h-4" /> },
  approved: { label: 'Live di Katalog', cls: 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30', icon: <Check className="w-4 h-4" /> },
  auto_approved: { label: 'Live — Auto-ACC', cls: 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30', icon: <Check className="w-4 h-4" /> },
  rejected: { label: 'Ditolak', cls: 'bg-red-500/15 text-red-600 border-red-500/30', icon: <XCircle className="w-4 h-4" /> },
};

function BarChart({ daily }: { daily: { date: string; clicks: number }[] }) {
  const max = Math.max(1, ...daily.map((d) => d.clicks));
  return (
    <div className="flex items-end gap-[3px] h-28 mt-3">
      {daily.map((d) => (
        <div key={d.date} title={`${d.date}: ${d.clicks} klik`} className="flex-1 flex flex-col justify-end h-full">
          <div className="rounded-t bg-purple-500/80 hover:bg-purple-500 transition-all" style={{ height: `${Math.max(d.clicks > 0 ? 6 : 2, (d.clicks / max) * 100)}%` }} />
          <span className="text-[8px] text-neutral-400 text-center mt-1">{d.date.slice(5)}</span>
        </div>
      ))}
    </div>
  );
}

export const CustomerPortal: React.FC<{ token: string }> = ({ token }) => {
  // FIX bug blank saat hash navigation: sebelumnya error token-tidak-valid
  // baru dihitung di dalam useEffect, jadi first paint SELALU spinner
  // "Memuat portal pelanggan..." — di screenshot terlihat seperti halaman
  // putih kosong. Sekarang status awal dihitung SINKRON dari token, jadi
  // first paint untuk token tidak valid langsung menampilkan pesan error.
  const tokenValid = isUuidLike(token);
  const [loading, setLoading] = useState(tokenValid);
  const [error, setError] = useState(tokenValid ? '' : 'Link portal tidak valid.');
  const [sub, setSub] = useState<PortalSubmission | null>(null);
  const [stats, setStats] = useState<PortalStats | null>(null);
  const [copied, setCopied] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!isUuidLike(token)) {
      setError('Link portal tidak valid.');
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError('');
    // Timeout: fetch /api/portal yang tertahan (cold-start Vercel) tidak
    // boleh membiarkan halaman di spinner selamanya.
    const timeout = window.setTimeout(() => {
      if (!cancelled) {
        setError('Portal tidak bisa dimuat (koneksi lambat). Coba lagi.');
        setLoading(false);
      }
    }, 12000);
    fetchPortal(token).then(({ submission, stats: st, error: err }) => {
      if (cancelled) return;
      window.clearTimeout(timeout);
      if (err || !submission) setError(err || 'Portal tidak ditemukan. Periksa kembali link yang kamu simpan saat submit.');
      else {
        setSub(submission);
        setStats(st);
      }
      setLoading(false);
    }).catch(() => {
      if (cancelled) return;
      window.clearTimeout(timeout);
      setError('Portal tidak bisa dimuat (koneksi bermasalah). Coba lagi.');
      setLoading(false);
    });
    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, [token, attempt]);

  if (loading) {
    return (
      <section className="pt-28 pb-24 min-h-screen flex items-center justify-center text-neutral-500 text-sm">
        <Loader2 className="w-5 h-5 animate-spin mr-2" /> Memuat portal pelanggan...
      </section>
    );
  }

  if (error || !sub) {
    return (
      <section className="pt-28 pb-24 min-h-screen max-w-xl mx-auto px-6 text-center">
        <XCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
        <h1 className="text-2xl font-bold mb-2">Portal Tidak Ditemukan</h1>
        <p className="text-sm text-neutral-500">{error}</p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {tokenValid && (
            <button onClick={() => setAttempt((a) => a + 1)} className="px-5 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xs font-mono font-bold cursor-pointer">Coba Lagi</button>
          )}
          <a href="/ai-tools" className="inline-block px-5 py-2.5 rounded-xl bg-purple-600 text-white text-xs font-mono font-bold">Kembali ke AI Tools</a>
        </div>
      </section>
    );
  }

  const st = STATUS_LABEL[sub.submit_status] || STATUS_LABEL.pending;
  const daily = stats?.daily || [];
  const today = daily[daily.length - 1]?.clicks ?? 0;
  const yesterday = daily[daily.length - 2]?.clicks ?? 0;
  const boostActive = sub.boost_until ? new Date(sub.boost_until).getTime() > Date.now() : false;
  const portalLink = portalUrl(token);

  return (
    <section className="pt-28 pb-24 min-h-screen bg-neutral-50/60 dark:bg-neutral-950 text-neutral-900 dark:text-white">
      <div className="max-w-4xl mx-auto px-6">
        <p className="text-xs font-mono text-purple-600 dark:text-purple-400 font-bold mb-2">PORTAL PELANGGAN — LOCAGO CREATIVE</p>
        <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
          <div>
            <h1 className="text-3xl font-extrabold">{sub.tool_name}</h1>
            <a href={sub.website_url} target="_blank" rel="noopener noreferrer" className="text-sm text-purple-600 dark:text-purple-400 inline-flex items-center gap-1 mt-1">
              {sub.website_url} <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-mono font-bold ${st.cls}`}>{st.icon}{st.label}</span>
        </div>

        {sub.submit_status === 'rejected' && sub.safety_notes && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-sm">
            <strong>Alasan penolakan:</strong> {sub.safety_notes}
            <p className="text-xs text-neutral-500 mt-1">Refund (dikurangi fee Midtrans) diproses manual. Hubungi WA LocaGo bila ada pertanyaan.</p>
          </div>
        )}
        {sub.submit_status === 'needs_fix' && (
          <div className="mb-6 p-4 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-sm">
            <strong>Perlu diperbaiki:</strong> {sub.safety_notes || 'Data submission kurang lengkap.'} Perbaiki via WA LocaGo — tidak perlu bayar lagi.
          </div>
        )}

        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          <div className="p-5 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <p className="text-xs font-mono text-neutral-500 mb-1">DONASI</p>
            <p className="text-2xl font-extrabold">{formatRupiah(sub.donation_amount)}</p>
            <p className="text-xs text-neutral-500 mt-1">Order {sub.order_id} · {sub.payment_status}</p>
          </div>
          <div className="p-5 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <p className="text-xs font-mono text-neutral-500 mb-1">BOOST 30 HARI</p>
            <p className="text-lg font-bold">{boostActive ? 'Aktif' : 'Tidak aktif'}</p>
            <p className="text-xs text-neutral-500 mt-1">
              {sub.boost_start ? `${new Date(sub.boost_start).toLocaleDateString('id-ID')} — ` : ''}
              {sub.boost_until ? new Date(sub.boost_until).toLocaleDateString('id-ID') : 'belum dimulai'}
            </p>
          </div>
          <div className="p-5 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <p className="text-xs font-mono text-neutral-500 mb-1">RANKING & TOP 10</p>
            <p className="text-lg font-bold flex items-center gap-1.5"><TrendingUp className="w-4 h-4 text-purple-500" /> {stats?.rank ? `Peringkat #${stats.rank}` : '—'}</p>
            <p className="text-xs text-neutral-500 mt-1 flex items-center gap-1">
              {sub.is_top10 ? <><Crown className="w-3.5 h-3.5 text-amber-500" /> Top 10 minggu {sub.top10_week || 'ini'} — dipromosikan</> : 'Belum masuk Top 10 minggu ini'}
            </p>
          </div>
        </div>

        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 mb-6">
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="w-4 h-4 text-purple-500" />
            <h2 className="font-bold">Trafik Klik — 30 Hari Terakhir</h2>
          </div>
          <p className="text-xs text-neutral-500">Dihitung dari pencatat klik LocaGo sendiri (bukan GA4), setiap klik tombol “Kunjungi Tool”.</p>
          <div className="grid grid-cols-4 gap-3 mt-4 text-center">
            {[
              { label: 'Hari ini', v: today },
              { label: 'Kemarin', v: yesterday },
              { label: '7 hari', v: stats?.clicks_7d ?? 0 },
              { label: '30 hari', v: stats?.clicks_30d ?? 0 },
            ].map((s) => (
              <div key={s.label} className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-800">
                <p className="text-xl font-extrabold">{s.v}</p>
                <p className="text-[11px] font-mono text-neutral-500">{s.label}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-neutral-500 mt-3">Total klik sepanjang masa: <strong className="text-neutral-800 dark:text-white">{stats?.total_clicks ?? 0}</strong></p>
          <BarChart daily={daily} />
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div className="p-5 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <h2 className="font-bold flex items-center gap-2 mb-3"><Video className="w-4 h-4 text-purple-500" /> Status Promosi</h2>
            <p className="text-sm flex justify-between py-1.5 border-b border-neutral-100 dark:border-neutral-800"><span>Reel video</span><strong>{sub.promo_reel_status}{sub.promo_reel_url ? <> — <a className="text-purple-600 underline" href={sub.promo_reel_url} target="_blank" rel="noopener noreferrer">lihat</a></> : ''}</strong></p>
            <p className="text-sm flex justify-between py-1.5"><span>Postingan Threads</span><strong>{sub.promo_threads_status}{sub.promo_threads_url ? <> — <a className="text-purple-600 underline" href={sub.promo_threads_url} target="_blank" rel="noopener noreferrer">lihat</a></> : ''}</strong></p>
            <p className="text-xs text-neutral-500 mt-2">Top 10 minggu ini dipromosikan jadi reel + Threads oleh tim LocaGo.</p>
          </div>
          <div className="p-5 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <h2 className="font-bold mb-3">Media yang Diupload</h2>
            {sub.media_urls && sub.media_urls.length > 0 ? (
              <ul className="space-y-1.5">
                {sub.media_urls.map((u) => (
                  <li key={u}><a href={u} target="_blank" rel="noopener noreferrer" className="text-xs text-purple-600 dark:text-purple-400 underline break-all">{u.split('/').pop()}</a></li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-neutral-500">Tidak ada media tambahan.</p>
            )}
            <p className="text-xs text-neutral-500 mt-3">Kategori: {sub.category} · Harga: {sub.pricing_type}</p>
            <p className="text-xs text-neutral-500">Disubmit: {new Date(sub.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-purple-500/10 border border-purple-500/30 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-bold text-sm">Simpan link portal ini baik-baik</p>
            <p className="text-xs text-neutral-500 break-all">{portalLink}</p>
          </div>
          <button
            onClick={async () => { try { await navigator.clipboard.writeText(portalLink); setCopied(true); setTimeout(() => setCopied(false), 2500); } catch {} }}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold flex items-center gap-2 cursor-pointer"
          >
            <Copy className="w-4 h-4" /> {copied ? 'Disalin!' : 'Salin Link'}
          </button>
        </div>
        <p className="text-xs text-neutral-400 text-center mt-6">
          Mau ubah data tool? Hubungi WA LocaGo — portal v1 read-only.
        </p>
      </div>
    </section>
  );
};
