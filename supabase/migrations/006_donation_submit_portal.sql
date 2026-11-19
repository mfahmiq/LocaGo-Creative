-- Migration 006: Donasi + Submit Tool Berbayar + Portal Pelanggan + Click tracking
-- LocaGo Creative, 2026-11-19. Additive only: no existing rows/tables touched.
-- Run via Composio SUPABASE_BETA_RUN_SQL_QUERY (service_role via Composio).

-- 1) tool_submissions: one row per paid submission. Portal access via portal_token (UUID, unguessable).
CREATE TABLE IF NOT EXISTS public.tool_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  portal_token uuid NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  tool_name text NOT NULL,
  website_url text NOT NULL,
  category text NOT NULL,
  pricing_type text NOT NULL DEFAULT 'Freemium',
  description text NOT NULL,
  contact_wa text,
  contact_email text,
  donation_amount integer NOT NULL DEFAULT 10000,
  media_fee boolean NOT NULL DEFAULT false,
  media_urls jsonb NOT NULL DEFAULT '[]'::jsonb,
  order_id text NOT NULL UNIQUE,
  payment_status text NOT NULL DEFAULT 'pending',
  submit_status text NOT NULL DEFAULT 'pending',
  safety_notes text,
  boost_start timestamptz,
  boost_until timestamptz,
  is_top10 boolean NOT NULL DEFAULT false,
  top10_week date,
  promo_reel_status text NOT NULL DEFAULT 'belum',
  promo_reel_url text,
  promo_threads_status text NOT NULL DEFAULT 'belum',
  promo_threads_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz
);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON public.tool_submissions (submit_status);
CREATE INDEX IF NOT EXISTS idx_submissions_boost ON public.tool_submissions (boost_until);
CREATE INDEX IF NOT EXISTS idx_submissions_order ON public.tool_submissions (order_id);

-- 2) tool_clicks: own click counter (portal stats must NOT depend on GA4).
CREATE TABLE IF NOT EXISTS public.tool_clicks (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  tool_slug text NOT NULL,
  tool_id text,
  portal_token uuid,
  referrer text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_clicks_slug_time ON public.tool_clicks (tool_slug, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_clicks_token ON public.tool_clicks (portal_token, created_at DESC);

-- 3) ai_tools: boost columns for paid tools (additive, defaults keep old rows unchanged).
ALTER TABLE public.ai_tools ADD COLUMN IF NOT EXISTS donation_amount integer NOT NULL DEFAULT 0;
ALTER TABLE public.ai_tools ADD COLUMN IF NOT EXISTS boost_until timestamptz;
ALTER TABLE public.ai_tools ADD COLUMN IF NOT EXISTS submit_order_id text;
ALTER TABLE public.ai_tools ADD COLUMN IF NOT EXISTS media_urls jsonb NOT NULL DEFAULT '[]'::jsonb;

-- 4) RLS: anon may INSERT submissions + clicks (public form / click counter).
--    Direct SELECT on tool_submissions stays locked; portal reads go through
--    SECURITY DEFINER functions below (token-gated, single row only).
ALTER TABLE public.tool_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tool_clicks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS submissions_anon_insert ON public.tool_submissions;
CREATE POLICY submissions_anon_insert ON public.tool_submissions
  FOR INSERT TO anon WITH CHECK (true);
DROP POLICY IF EXISTS clicks_anon_insert ON public.tool_clicks;
CREATE POLICY clicks_anon_insert ON public.tool_clicks
  FOR INSERT TO anon WITH CHECK (true);

-- 5) Portal RPC (SECURITY DEFINER): returns ONLY the row matching the token.
CREATE OR REPLACE FUNCTION public.get_tool_portal(p_token uuid)
RETURNS jsonb LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT to_jsonb(s) FROM public.tool_submissions s WHERE s.portal_token = p_token LIMIT 1;
$$;
GRANT EXECUTE ON FUNCTION public.get_tool_portal(uuid) TO anon, authenticated;

-- 6) Portal stats RPC: totals + daily series for the owner's tool only.
CREATE OR REPLACE FUNCTION public.get_portal_stats(p_token uuid)
RETURNS jsonb LANGUAGE sql SECURITY DEFINER STABLE AS $$
  WITH sub AS (
    SELECT tool_name, donation_amount, boost_start, boost_until, submit_status,
           is_top10, top10_week, promo_reel_status, promo_reel_url,
           promo_threads_status, promo_threads_url, created_at
    FROM public.tool_submissions WHERE portal_token = p_token LIMIT 1
  ),
  slug AS (
    SELECT lower(regexp_replace(tool_name, '[^a-z0-9]+', '-', 'g')) AS slug FROM sub
  ),
  clicks AS (
    SELECT c.* FROM public.tool_clicks c, slug s
    WHERE c.tool_slug = s.slug OR c.portal_token = p_token
  )
  SELECT jsonb_build_object(
    'total_clicks', (SELECT count(*) FROM clicks),
    'clicks_7d', (SELECT count(*) FROM clicks WHERE created_at >= now() - interval '7 days'),
    'clicks_30d', (SELECT count(*) FROM clicks WHERE created_at >= now() - interval '30 days'),
    'daily', COALESCE((SELECT jsonb_agg(jsonb_build_object('date', d, 'clicks', n) ORDER BY d)
      FROM (SELECT date(created_at) AS d, count(*) AS n FROM clicks
            WHERE created_at >= now() - interval '30 days' GROUP BY d) t), '[]'::jsonb),
    'rank', (SELECT count(*) + 1 FROM public.tool_submissions s2, sub
             WHERE s2.submit_status IN ('approved','auto_approved')
               AND s2.boost_until > now()
               AND s2.donation_amount > (SELECT donation_amount FROM sub))
  );
$$;
GRANT EXECUTE ON FUNCTION public.get_portal_stats(uuid) TO anon, authenticated;

-- 7) Live paid tools for the public catalog (approved/auto_approved + boost active).
--    Lets auto-approved (>=Rp50.000) tools appear instantly without waiting for
--    the ai_tools upsert sync.
CREATE OR REPLACE FUNCTION public.list_live_paid_tools()
RETURNS jsonb LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT COALESCE(jsonb_agg(to_jsonb(s) ORDER BY s.donation_amount DESC), '[]'::jsonb)
  FROM public.tool_submissions s
  WHERE s.submit_status IN ('approved', 'auto_approved') AND s.boost_until > now();
$$;
GRANT EXECUTE ON FUNCTION public.list_live_paid_tools() TO anon, authenticated;

-- 8) Weekly Top-10 lock (run Mondays 00:00 WIB by agent/cron via Composio):
--    top 10 approved+boost-active tools by donation get is_top10=true for that week.
CREATE OR REPLACE FUNCTION public.lock_top10(p_week date)
RETURNS integer LANGUAGE sql SECURITY DEFINER AS $$
  UPDATE public.tool_submissions SET is_top10 = false, top10_week = NULL
  WHERE is_top10 = true;
  WITH top AS (
    SELECT id FROM public.tool_submissions
    WHERE submit_status IN ('approved', 'auto_approved') AND boost_until > now()
    ORDER BY donation_amount DESC, created_at ASC LIMIT 10
  )
  UPDATE public.tool_submissions s SET is_top10 = true, top10_week = p_week
  FROM top WHERE s.id = top.id;
  SELECT count(*)::integer FROM public.tool_submissions WHERE is_top10 = true AND top10_week = p_week;
$$;

-- 9) Storage bucket for demo media (public read, anon upload via RLS insert policy).
INSERT INTO storage.buckets (id, name, public) VALUES ('tool-media', 'tool-media', true)
ON CONFLICT (id) DO NOTHING;
DROP POLICY IF EXISTS "tool-media anon upload" ON storage.objects;
CREATE POLICY "tool-media anon upload" ON storage.objects
  FOR INSERT TO anon WITH CHECK (bucket_id = 'tool-media');
DROP POLICY IF EXISTS "tool-media public read" ON storage.objects;
CREATE POLICY "tool-media public read" ON storage.objects
  FOR SELECT TO anon USING (bucket_id = 'tool-media');
