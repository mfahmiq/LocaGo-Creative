// components/AdminPortal.tsx — Portal Master Admin (Fahmi only).
// KEAMANAN: halaman ini TIDAK ada di navigasi publik, TIDAK terindeks
// (meta robots noindex dipasang saat mount), dan TIDAK bisa dibuka lewat
// token seperti portal pelanggan. Akses tulis memakai login Supabase Auth
// owner (email fahmi@locagocreative.my.id) — RLS di Supabase yang
// menguncinya. Mode PIN owner (localStorage saja, tanpa sesi Supabase)
// TIDAK bisa menulis: aksi admin akan gagal dengan pesan yang jelas.
// Jangan pernah menaruh link admin di homepage / footer / sitemap.
import React, { useEffect, useMemo, useState } from 'react';
import { Loader2, ShieldAlert, Check, X, Clock, Crown, BarChart3, ExternalLink, RefreshCw, Lock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { fetchSiteDailyClicks, fetchToolDailyClicks, type DailyPoint } from '../lib/portal';
import { formatRupiah } from '../lib/utm';

interface SubmissionRow {
  id: string; portal_token: string; tool_name: string; website_url: string;
  category: string; pricing_type: string; description: string;
  contact_wa?: string | null; contact_email?: string | null;
  donation_amount: number; media_fee: boolean; media_urls: string[];
  order_id: string; payment_status: string; submit_status: string;
  safety_notes?: string | null; boost_start?: string | null; boost_until?: string | null;
  is_top10: boolean; top10_week?: string | null;
  promo_reel_status: string; promo_reel_url?: string | null;
  promo_threads_status: string; promo_threads_url?: string | null;
  created_at: string;
}

interface DonationRow { order_id: string; type: string; amount: number; status: string; tool_name?: string | null; created_at: string; paid_at?: string | null }
interface ToolRow { id: string; name: string; affiliateUrl?: string | null; url?: string | null; donation_amount?: number | null; boost_until?: string | null; needsReview?: boolean | null }

type Tab = 'antrean' | 'donasi' | 'tools' | 'trafik' | 'promosi' | 'media';

function mondayOfWeek(d = new Date()): string {
  const x = new Date(d);
  const day = (x.getDay() + 6) % 7;
  x.setDate(x.getDate() - day);
  return x.toISOString().slice(0, 10);
}

export const AdminPortal: React.FC = () => {
  const { user, isOwner, isLoggedIn, openAuthModal } = useAuth();
  const [tab, setTab] = useState<Tab>('antrean');
  const [loading, setLoading] = useState(true);
  const [hasSession, setHasSession] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [subs, setSubs] = useState<SubmissionRow[]>([]);
  const [donations, setDonations] = useState<DonationRow[]>([]);
  const [tools, setTools] = useState<ToolRow[]>([]);
  const [daily, setDaily] = useState<DailyPoint[]>([]);
  const [clickRows, setClickRows] = useState<{ tool_slug: string; created_at: string }[]>([]);
  const [selectedToolSlug, setSelectedToolSlug] = useState('');
  const [selectedToolDaily, setSelectedToolDaily] = useState<DailyPoint[]>([]);
  const [rejectReason, setRejectReason] = useState<Record<string, string>>({});
  const [promoLink, setPromoLink] = useState<Record<string, string>>({});

  // noindex + judul khusus admin
  useEffect(() => {
    const prevTitle = document.title;
    document.title = 'Admin — LocaGo Creative';
    let meta = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    const created = !meta;
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'robots');
      document.head.appendChild(meta);
    }
    const prevContent = meta.getAttribute('content');
    meta.setAttribute('content', 'noindex, nofollow');
    return () => {
      document.title = prevTitle;
      if (created) meta?.remove();
      else if (prevContent) meta.setAttribute('content', prevContent);
    };
  }, []);

  const loadAll = async () => {
    setLoading(true);
    setError('');
    const { data: { session } } = await supabase.auth.getSession();
    setHasSession(Boolean(session));
    const [s, d, t, c] = await Promise.all([
      supabase.from('tool_submissions').select('*').order('created_at', { ascending: false }).limit(300),
      supabase.from('donations').select('*').order('created_at', { ascending: false }).limit(300),
      supabase.from('ai_tools').select('id,name,affiliateUrl,url,donation_amount,boost_until,needsReview').order('donation_amount', { ascending: false }).limit(600),
      supabase.from('tool_clicks').select('tool_slug,created_at').gte('created_at', new Date(Date.now() - 30 * 86400000).toISOString()).order('created_at', { ascending: false }).limit(20000),
    ]);
    if (s.error) setError('Gagal memuat submission: ' + s.error.message + (session ? '' : ' (pastikan login dengan akun Supabase Auth owner, bukan mode PIN)'));
    setSubs((s.data as SubmissionRow[]) || []);
    setDonations((d.data as DonationRow[]) || []);
    setTools((t.data as ToolRow[]) || []);
    setClickRows((c.data as { tool_slug: string; created_at: string }[]) || []);
    setDaily(await fetchSiteDailyClicks(30));
    setLoading(false);
  };

  useEffect(() => { loadAll(); }, []);

  const run = async (fn: () => Promise<{ error: unknown }>, okMsg: string) => {
    setNotice('');
    const { error: e } = await fn();
    if (e) {
      setNotice('Gagal: ' + ((e as { message?: string }).message || 'RLS menolak. Pastikan login Supabase Auth owner (mode PIN tidak bisa menulis).'));
    } else {
      setNotice(okMsg);
      await loadAll();
    }
  };

  const approve = (s: SubmissionRow) => run(async () => {
    const until = new Date(Date.now() + 30 * 86400000).toISOString();
    return supabase.from('tool_submissions').update({ submit_status: 'approved', boost_start: new Date().toISOString(), boost_until: until, reviewed_at: new Date().toISOString() }).eq('id', s.id);
  }, `"${s.tool_name}" di-ACC + boost 30 hari.`);
  const reject = (s: SubmissionRow) => run(async () =>
    supabase.from('tool_submissions').update({ submit_status: 'rejected', safety_notes: rejectReason[s.id] || 'Ditolak moderasi.', reviewed_at: new Date().toISOString() }).eq('id', s.id),
  `"${s.tool_name}" ditolak.`);
  const needsFix = (s: SubmissionRow) => run(async () =>
    supabase.from('tool_submissions').update({ submit_status: 'needs_fix', safety_notes: rejectReason[s.id] || 'Data kurang lengkap.', reviewed_at: new Date().toISOString() }).eq('id', s.id),
  `"${s.tool_name}" dikembalikan untuk diperbaiki (tanpa bayar lagi).`);
  const extendBoost = (s: SubmissionRow) => run(async () => {
    const base = Math.max(Date.now(), s.boost_until ? new Date(s.boost_until).getTime() : 0);
    return supabase.from('tool_submissions').update({ boost_until: new Date(base + 30 * 86400000).toISOString() }).eq('id', s.id);
  }, `Boost "${s.tool_name}" diperpanjang 30 hari.`);
  const endBoost = (s: SubmissionRow) => run(async () =>
    supabase.from('tool_submissions').update({ boost_until: new Date().toISOString() }).eq('id', s.id),
  `Boost "${s.tool_name}" diakhiri.`);
  const takedownTool = (t: ToolRow) => run(async () =>
    supabase.from('ai_tools').update({ needsReview: true, boost_until: null, donation_amount: 0 }).eq('id', t.id),
  `"${t.name}" ditakedown (needsReview=true, tidak tampil di katalog).`);
  const setPromo = (s: SubmissionRow, field: 'promo_reel_status' | 'promo_threads_status', urlField: 'promo_reel_url' | 'promo_threads_url') => run(async () =>
    supabase.from('tool_submissions').update({ [field]: 'selesai', [urlField]: promoLink[s.id] || null }).eq('id', s.id),
  `Promosi "${s.tool_name}" ditandai selesai.`);
  const lockTop10 = async () => {
    setNotice('');
    const { data, error } = await supabase.rpc('lock_top10', { p_week: mondayOfWeek() });
    if (error) setNotice('Gagal kunci Top 10: ' + error.message);
    else {
      setNotice(`Top 10 minggu ${mondayOfWeek()} dikunci (${data} tool).`);
      await loadAll();
    }
  };

  const totals = useMemo(() => {
    const paid = donations.filter((d) => d.status === 'settlement' || d.status === 'capture');
    const sum = (rows: DonationRow[]) => rows.reduce((a, d) => a + (d.amount || 0), 0);
    const day = (n: number) => {
      const from = new Date(Date.now() - n * 86400000);
      return paid.filter((d) => new Date(d.created_at) >= from);
    };
    return { total: sum(paid), today: sum(day(1)), week: sum(day(7)), month: sum(day(30)), pendingCount: donations.filter((d) => d.status === 'pending').length };
  }, [donations]);

  // Donatur per baris donasi: donasi biasa menyimpan nama donatur di
  // tool_name (opsional — kosong = Anonim); submit tool menyimpan nama
  // tool di tool_name, jadi donaturnya diambil dari kontak submission
  // dengan order_id yang sama.
  const donorOf = (d: DonationRow): string => {
    if (d.type === 'donasi') return d.tool_name || 'Anonim';
    const s = subs.find((x) => x.order_id === d.order_id);
    return (s && (s.contact_wa || s.contact_email)) || d.tool_name || '—';
  };

  const traffic = useMemo(() => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const yestStr = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    const count = (from: string, to?: string) => clickRows.filter((r) => {
      const d = r.created_at.slice(0, 10);
      return d >= from && (!to || d <= to);
    }).length;
    const topBy = (days: number) => {
      const from = new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);
      const m = new Map<string, number>();
      clickRows.filter((r) => r.created_at.slice(0, 10) >= from).forEach((r) => m.set(r.tool_slug, (m.get(r.tool_slug) || 0) + 1));
      return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);
    };
    const perTool = new Map<string, number>();
    clickRows.forEach((r) => perTool.set(r.tool_slug, (perTool.get(r.tool_slug) || 0) + 1));
    return {
      today: count(todayStr), yesterday: count(yestStr, yestStr),
      last7: count(new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10)),
      last30: clickRows.length,
      topToday: topBy(1), topWeek: topBy(7), perTool,
    };
  }, [clickRows]);

  const maxDaily = Math.max(1, ...daily.map((d) => d.clicks));

  if (!isLoggedIn || !isOwner) {
    return (
      <section className="pt-28 pb-24 min-h-screen max-w-xl mx-auto px-6 text-center">
        <Lock className="w-10 h-10 text-amber-500 mx-auto mb-3" />
        <h1 className="text-2xl font-bold mb-2">Portal Admin — Khusus Owner</h1>
        <p className="text-sm text-neutral-500 mb-6">Halaman ini tidak terindeks Google dan tidak ada di navigasi publik. Login dengan akun Supabase Auth owner untuk membuka dashboard.</p>
        <button onClick={openAuthModal} className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-bold cursor-pointer">Login Owner</button>
        {isLoggedIn && <p className="text-xs text-red-500 mt-4">Akun {user?.email} bukan owner.</p>}
      </section>
    );
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'antrean', label: `Antrean (${subs.filter((s) => s.submit_status === 'pending').length})` },
    { id: 'donasi', label: 'Donasi & Pembayaran' },
    { id: 'tools', label: 'Semua Tool' },
    { id: 'trafik', label: 'Trafik Harian' },
    { id: 'promosi', label: 'Promosi Top 10' },
    { id: 'media', label: 'Media' },
  ];

  return (
    <section className="pt-28 pb-24 min-h-screen bg-neutral-50/60 dark:bg-neutral-950 text-neutral-900 dark:text-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-2"><ShieldAlert className="w-6 h-6 text-amber-500" /> Portal Admin</h1>
          <button onClick={loadAll} className="px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"><RefreshCw className="w-3.5 h-3.5" /> Muat Ulang</button>
        </div>
        <p className="text-xs text-neutral-500 mb-4">Login sebagai {user?.email} · {hasSession ? 'Sesi Supabase Auth aktif — aksi tulis diizinkan.' : 'TIDAK ADA sesi Supabase Auth (mode PIN?) — aksi tulis akan ditolak RLS. Login ulang dengan email+password.'}</p>
        {notice && <p className="text-xs bg-purple-500/10 border border-purple-500/30 rounded-xl px-3 py-2 mb-4">{notice}</p>}
        {error && <p className="text-xs text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2 mb-4">{error}</p>}
        {loading && <p className="text-sm text-neutral-500 flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Memuat data admin...</p>}

        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold border cursor-pointer ${tab === t.id ? 'bg-purple-600 text-white border-purple-600' : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800'}`}>{t.label}</button>
          ))}
        </div>

        {tab === 'antrean' && (
          <div className="space-y-3">
            {subs.length === 0 && <p className="text-sm text-neutral-500">Belum ada submission.</p>}
            {subs.map((s) => (
              <div key={s.id} className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-bold">{s.tool_name} <span className="text-xs font-mono text-neutral-400">· {s.submit_status}{s.donation_amount >= 50000 ? ' · AUTO-ACC' : ''}</span></p>
                    <a href={s.website_url} target="_blank" rel="noopener noreferrer" className="text-xs text-purple-600 underline inline-flex items-center gap-1">{s.website_url} <ExternalLink className="w-3 h-3" /></a>
                    <p className="text-xs text-neutral-500 mt-1">{s.description}</p>
                    <p className="text-xs text-neutral-500 mt-1">Donasi {formatRupiah(s.donation_amount)} · Order {s.order_id} · {s.payment_status} · {s.contact_wa || ''} {s.contact_email || ''} · {new Date(s.created_at).toLocaleString('id-ID')}</p>
                    {s.safety_notes && <p className="text-xs text-amber-600 mt-1">Catatan: {s.safety_notes}</p>}
                  </div>
                  <a href={`/#portal/${s.portal_token}`} target="_blank" rel="noopener noreferrer" className="text-xs text-purple-600 underline">Lihat portal pelanggan</a>
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <input value={rejectReason[s.id] || ''} onChange={(e) => setRejectReason({ ...rejectReason, [s.id]: e.target.value })} placeholder="Alasan tolak / catatan perbaikan" className="flex-1 min-w-[180px] px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-mono" />
                  <button onClick={() => approve(s)} className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold flex items-center gap-1 cursor-pointer"><Check className="w-3.5 h-3.5" /> Approve + Boost 30h</button>
                  <button onClick={() => needsFix(s)} className="px-3 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-white text-xs font-mono font-bold cursor-pointer">Minta Perbaiki</button>
                  <button onClick={() => reject(s)} className="px-3 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-bold flex items-center gap-1 cursor-pointer"><X className="w-3.5 h-3.5" /> Tolak</button>
                  {s.boost_until && new Date(s.boost_until).getTime() > Date.now() && (
                    <>
                      <button onClick={() => extendBoost(s)} className="px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xs font-mono font-bold cursor-pointer">+30 hari boost</button>
                      <button onClick={() => endBoost(s)} className="px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xs font-mono font-bold cursor-pointer">Akhiri boost</button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'donasi' && (
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-5">
              {[
                { label: 'Total masuk', v: formatRupiah(totals.total) },
                { label: 'Hari ini', v: formatRupiah(totals.today) },
                { label: '7 hari', v: formatRupiah(totals.week) },
                { label: '30 hari', v: formatRupiah(totals.month) },
                { label: 'Pending', v: String(totals.pendingCount) },
              ].map((s) => (
                <div key={s.label} className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-center">
                  <p className="text-lg font-extrabold">{s.v}</p>
                  <p className="text-[11px] font-mono text-neutral-500">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="overflow-x-auto rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              <table className="w-full text-xs">
                <thead><tr className="text-left text-neutral-500 border-b border-neutral-100 dark:border-neutral-800"><th className="p-3">Order ID</th><th className="p-3">Tipe</th><th className="p-3">Donatur</th><th className="p-3">Nominal</th><th className="p-3">Status</th><th className="p-3">Tanggal</th></tr></thead>
                <tbody>
                  {donations.map((d) => (
                    <tr key={d.order_id} className="border-b border-neutral-50 dark:border-neutral-900">
                      <td className="p-3 font-mono">{d.order_id}</td><td className="p-3">{d.type === 'submit' && d.tool_name ? `submit — ${d.tool_name}` : d.type}</td><td className="p-3 font-bold">{donorOf(d)}</td>
                      <td className="p-3 font-bold">{formatRupiah(d.amount)}</td><td className="p-3">{d.status}</td>
                      <td className="p-3">{new Date(d.created_at).toLocaleString('id-ID')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-neutral-400 mt-3">Status = terakhir terverifikasi via Midtrans (settlement/capture = uang masuk). Transaksi yang tidak pernah diverifikasi tetap pending di sini — cek dashboard Midtrans bila ragu.</p>
          </div>
        )}

        {tab === 'tools' && (
          <div className="overflow-x-auto rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <table className="w-full text-xs">
              <thead><tr className="text-left text-neutral-500 border-b border-neutral-100 dark:border-neutral-800"><th className="p-3">Tool</th><th className="p-3">Donasi</th><th className="p-3">Boost sampai</th><th className="p-3">Status</th><th className="p-3">Aksi</th></tr></thead>
              <tbody>
                {tools.filter((t) => (t.donation_amount || 0) > 0 || t.boost_until).map((t) => (
                  <tr key={t.id} className="border-b border-neutral-50 dark:border-neutral-900">
                    <td className="p-3 font-bold">{t.name}</td>
                    <td className="p-3">{formatRupiah(t.donation_amount || 0)}</td>
                    <td className="p-3">{t.boost_until ? new Date(t.boost_until).toLocaleDateString('id-ID') : '—'}</td>
                    <td className="p-3">{t.needsReview ? 'Ditakedown' : 'Live'}</td>
                    <td className="p-3"><button onClick={() => takedownTool(t)} className="px-2.5 py-1.5 rounded-lg bg-red-600 text-white font-mono font-bold cursor-pointer">Takedown</button></td>
                  </tr>
                ))}
                {tools.filter((t) => (t.donation_amount || 0) > 0 || t.boost_until).length === 0 && (
                  <tr><td colSpan={5} className="p-4 text-neutral-500">Belum ada tool berbayar di tabel ai_tools (tool auto-ACC tampil dulu lewat portal submissions sampai sinkronisasi katalog).</td></tr>
                )}
              </tbody>
            </table>
            <p className="text-[11px] text-neutral-400 p-3">Ranking boost & Top 10 submission berbayar dikelola dari tab Antrean/Promosi (tabel tool_submissions). Total tool di katalog: {tools.length} (tampilan ini dibatasi 600).</p>
          </div>
        )}

        {tab === 'trafik' && (
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
              {[
                { label: 'Hari ini', v: traffic.today },
                { label: 'Kemarin', v: traffic.yesterday },
                { label: '7 hari terakhir', v: traffic.last7 },
                { label: '30 hari terakhir', v: traffic.last30 },
              ].map((s) => (
                <div key={s.label} className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-center">
                  <p className="text-2xl font-extrabold">{s.v}</p>
                  <p className="text-[11px] font-mono text-neutral-500">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="p-5 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 mb-5">
              <h2 className="font-bold flex items-center gap-2 mb-2"><BarChart3 className="w-4 h-4 text-purple-500" /> Total Klik Tool per Hari — 30 Hari</h2>
              <div className="flex items-end gap-[3px] h-28">
                {daily.map((d) => (
                  <div key={d.date} title={`${d.date}: ${d.clicks} klik`} className="flex-1 flex flex-col justify-end h-full">
                    <div className="rounded-t bg-purple-500/80" style={{ height: `${Math.max(d.clicks > 0 ? 6 : 2, (d.clicks / maxDaily) * 100)}%` }} />
                    <span className="text-[8px] text-neutral-400 text-center mt-1">{d.date.slice(5)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                <h3 className="font-bold mb-2">Paling banyak diklik hari ini</h3>
                {traffic.topToday.length === 0 && <p className="text-sm text-neutral-500">Belum ada klik hari ini.</p>}
                {traffic.topToday.map(([slug, n]) => (<p key={slug} className="text-sm flex justify-between py-1 border-b border-neutral-50 dark:border-neutral-900"><span>{slug}</span><strong>{n}</strong></p>))}
                <h3 className="font-bold mt-4 mb-2">Paling banyak diklik minggu ini</h3>
                {traffic.topWeek.map(([slug, n]) => (<p key={slug} className="text-sm flex justify-between py-1 border-b border-neutral-50 dark:border-neutral-900"><span>{slug}</span><strong>{n}</strong></p>))}
              </div>
              <div className="p-5 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                <h3 className="font-bold mb-2">Klik per tool per hari</h3>
                <select value={selectedToolSlug} onChange={async (e) => { setSelectedToolSlug(e.target.value); if (e.target.value) setSelectedToolDaily(await fetchToolDailyClicks(e.target.value, 30)); }} className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-mono mb-3">
                  <option value="">— Pilih tool —</option>
                  {[...traffic.perTool.entries()].sort((a, b) => b[1] - a[1]).map(([slug, n]) => (<option key={slug} value={slug}>{slug} ({n} klik / 30 hari)</option>))}
                </select>
                {selectedToolSlug && (
                  <>
                    <div className="flex items-end gap-[3px] h-24">
                      {selectedToolDaily.map((d) => (
                        <div key={d.date} title={`${d.date}: ${d.clicks}`} className="flex-1 flex flex-col justify-end h-full">
                          <div className="rounded-t bg-emerald-500/80" style={{ height: `${Math.max(d.clicks > 0 ? 6 : 2, (d.clicks / Math.max(1, ...selectedToolDaily.map((x) => x.clicks))) * 100)}%` }} />
                          <span className="text-[8px] text-neutral-400 text-center mt-1">{d.date.slice(5)}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-neutral-500 mt-2">Total 30 hari: {traffic.perTool.get(selectedToolSlug) || 0} klik.</p>
                  </>
                )}
              </div>
            </div>
            <p className="text-[11px] text-neutral-400 mt-3">Sumber: tabel tool_clicks (pencatat klik LocaGo sendiri), bukan GA4. Pilih rentang: grafik di atas 30 hari terakhir; ubah dengan memfilter tanggal di query bila perlu rentang lain.</p>
          </div>
        )}

        {tab === 'promosi' && (
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <button onClick={lockTop10} className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-white text-xs font-mono font-bold flex items-center gap-2 cursor-pointer"><Crown className="w-4 h-4" /> Kunci Top 10 Minggu Ini (Senin {mondayOfWeek()})</button>
              <p className="text-xs text-neutral-500">Top 10 = 10 donasi terbesar yang boost-nya masih aktif. Dikunci tiap Senin 00:00 untuk antrean reel + Threads.</p>
            </div>
            <div className="space-y-3">
              {subs.filter((s) => s.is_top10 || (s.submit_status === 'auto_approved' || s.submit_status === 'approved')).slice(0, 20).map((s) => (
                <div key={s.id} className="p-4 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                  <p className="font-bold">{s.is_top10 ? '👑 ' : ''}{s.tool_name} <span className="text-xs font-mono text-neutral-400">· {formatRupiah(s.donation_amount)} · Top10: {s.is_top10 ? `ya (minggu ${s.top10_week})` : 'tidak'}</span></p>
                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    <input value={promoLink[s.id] || ''} onChange={(e) => setPromoLink({ ...promoLink, [s.id]: e.target.value })} placeholder="Tempel link reel / Threads yang sudah tayang" className="flex-1 min-w-[200px] px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-mono" />
                    <button onClick={() => setPromo(s, 'promo_reel_status', 'promo_reel_url')} className="px-3 py-2 rounded-xl bg-purple-600 text-white text-xs font-mono font-bold cursor-pointer">Reel selesai ✓</button>
                    <button onClick={() => setPromo(s, 'promo_threads_status', 'promo_threads_url')} className="px-3 py-2 rounded-xl bg-purple-600 text-white text-xs font-mono font-bold cursor-pointer">Threads selesai ✓</button>
                    <span className="text-xs text-neutral-500">Reel: {s.promo_reel_status} · Threads: {s.promo_threads_status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'media' && (
          <div className="space-y-3">
            {subs.filter((s) => s.media_urls && s.media_urls.length > 0).length === 0 && <p className="text-sm text-neutral-500">Belum ada media yang diupload submitter.</p>}
            {subs.filter((s) => s.media_urls && s.media_urls.length > 0).map((s) => (
              <div key={s.id} className="p-4 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                <p className="font-bold">{s.tool_name} <span className="text-xs font-mono text-neutral-400">· {s.submit_status}</span></p>
                <div className="flex flex-wrap gap-3 mt-3">
                  {s.media_urls.map((u) => (
                    <a key={u} href={u} target="_blank" rel="noopener noreferrer" className="block w-40">
                      {/\.(mp4|webm|mov)$/i.test(u) ? (
                        <video src={u} controls preload="metadata" className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800" />
                      ) : (
                        <img src={u} alt="media submission" className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800" loading="lazy" />
                      )}
                      <span className="text-[11px] text-purple-600 underline break-all">{u.split('/').pop()}</span>
                    </a>
                  ))}
                </div>
                <p className="text-xs text-neutral-500 mt-2">Review sebelum tampil: video/gambar yang melanggar (bukan demo tool, konten dewasa, watermark kompetitor) → tolak submission dari tab Antrean.</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
