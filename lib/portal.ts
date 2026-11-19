// lib/portal.ts — akses Portal Pelanggan (token UUID, tanpa login) dan
// helper Admin (butuh login Supabase Auth owner — lihat AdminPortal).
import { supabase } from './supabase';

export interface PortalSubmission {
  id: string;
  portal_token: string;
  tool_name: string;
  website_url: string;
  category: string;
  pricing_type: string;
  description: string;
  contact_wa?: string | null;
  contact_email?: string | null;
  donation_amount: number;
  media_fee: boolean;
  media_urls: string[];
  order_id: string;
  payment_status: string;
  submit_status: string;
  safety_notes?: string | null;
  boost_start?: string | null;
  boost_until?: string | null;
  is_top10: boolean;
  top10_week?: string | null;
  promo_reel_status: string;
  promo_reel_url?: string | null;
  promo_threads_status: string;
  promo_threads_url?: string | null;
  created_at: string;
  reviewed_at?: string | null;
}

export interface PortalStats {
  total_clicks: number;
  clicks_7d: number;
  clicks_30d: number;
  daily: { date: string; clicks: number }[];
  rank: number | null;
}

export interface DailyPoint {
  date: string;
  clicks: number;
}

const PORTAL_API = '/api/portal';

export async function fetchPortal(token: string): Promise<{ submission: PortalSubmission | null; stats: PortalStats | null; error?: string }> {
  const res = await fetch(`${PORTAL_API}?token=${encodeURIComponent(token)}`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) return { submission: null, stats: null, error: data?.error || 'Portal tidak ditemukan.' };
  return { submission: data.submission ?? null, stats: data.stats ?? null };
}

/** Klik harian situs keseluruhan (admin) dari tool_clicks. */
export async function fetchSiteDailyClicks(days = 30): Promise<DailyPoint[]> {
  const since = new Date(Date.now() - days * 86400000).toISOString();
  const { data, error } = await supabase
    .from('tool_clicks')
    .select('created_at')
    .gte('created_at', since)
    .order('created_at', { ascending: true })
    .limit(20000);
  if (error || !data) return [];
  const byDay = new Map<string, number>();
  for (const row of data as { created_at: string }[]) {
    const d = (row.created_at || '').slice(0, 10);
    if (d) byDay.set(d, (byDay.get(d) || 0) + 1);
  }
  const out: DailyPoint[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
    out.push({ date: d, clicks: byDay.get(d) || 0 });
  }
  return out;
}

/** Klik harian satu tool (admin): pakai RPC tool_daily_clicks. */
export async function fetchToolDailyClicks(slug: string, days = 30): Promise<DailyPoint[]> {
  const { data, error } = await supabase.rpc('tool_daily_clicks', { p_slug: slug, p_days: days });
  if (error || !Array.isArray(data)) return [];
  const byDay = new Map<string, number>((data as DailyPoint[]).map((p) => [p.date, p.clicks]));
  const out: DailyPoint[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
    out.push({ date: d, clicks: byDay.get(d) || 0 });
  }
  return out;
}

export function portalUrl(token: string): string {
  return `${window.location.origin}/#portal/${token}`;
}

export function isUuidLike(v: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v.trim());
}
