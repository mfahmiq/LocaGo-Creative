-- Migration 007: donations ledger + admin RLS policies (owner = Supabase Auth
-- user fahmi@locagocreative.my.id atau user_metadata.role = 'owner').
-- Admin writes go through the logged-in owner's JWT, NOT through anon key.
-- PIN-based owner mode (localStorage only, no JWT) does NOT unlock admin writes.

-- 1) donations: every Midtrans order the site creates (DONASI- and SUBMIT-).
CREATE TABLE IF NOT EXISTS public.donations (
  order_id text PRIMARY KEY,
  type text NOT NULL DEFAULT 'donasi',
  amount integer NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  tool_name text,
  created_at timestamptz NOT NULL DEFAULT now(),
  paid_at timestamptz
);
CREATE INDEX IF NOT EXISTS idx_donations_status_time ON public.donations (status, created_at DESC);
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS donations_anon_insert ON public.donations;
CREATE POLICY donations_anon_insert ON public.donations
  FOR INSERT TO anon WITH CHECK (true);

-- Status updates only through this SECURITY DEFINER function (no anon UPDATE).
CREATE OR REPLACE FUNCTION public.update_donation_status(p_order_id text, p_status text)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE public.donations
  SET status = p_status,
      paid_at = CASE WHEN p_status IN ('settlement','capture') THEN now() ELSE paid_at END
  WHERE order_id = p_order_id AND status <> p_status;
  RETURN FOUND;
END;
$$;
GRANT EXECUTE ON FUNCTION public.update_donation_status(text, text) TO anon, authenticated;

-- 2) Admin policies: only the owner JWT can read/write admin data.
--    Helper predicate inline (no helper function: keeps policy logic visible).
DROP POLICY IF EXISTS submissions_owner_all ON public.tool_submissions;
CREATE POLICY submissions_owner_all ON public.tool_submissions
  FOR ALL TO authenticated
  USING ((auth.jwt() ->> 'email') = 'fahmi@locagocreative.my.id'
      OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'owner')
  WITH CHECK ((auth.jwt() ->> 'email') = 'fahmi@locagocreative.my.id'
      OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'owner');

DROP POLICY IF EXISTS clicks_owner_select ON public.tool_clicks;
CREATE POLICY clicks_owner_select ON public.tool_clicks
  FOR SELECT TO authenticated
  USING ((auth.jwt() ->> 'email') = 'fahmi@locagocreative.my.id'
      OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'owner');

DROP POLICY IF EXISTS donations_owner_select ON public.donations;
CREATE POLICY donations_owner_select ON public.donations
  FOR SELECT TO authenticated
  USING ((auth.jwt() ->> 'email') = 'fahmi@locagocreative.my.id'
      OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'owner');

DROP POLICY IF EXISTS aitools_owner_update ON public.ai_tools;
CREATE POLICY aitools_owner_update ON public.ai_tools
  FOR UPDATE TO authenticated
  USING ((auth.jwt() ->> 'email') = 'fahmi@locagocreative.my.id'
      OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'owner')
  WITH CHECK ((auth.jwt() ->> 'email') = 'fahmi@locagocreative.my.id'
      OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'owner');

-- 3) Daily traffic aggregation for admin (owner JWT required via RLS on tool_clicks).
--    The UI queries tool_clicks directly; no extra function needed. Keep this
--    function as a convenience for per-tool daily series.
CREATE OR REPLACE FUNCTION public.tool_daily_clicks(p_slug text, p_days integer DEFAULT 30)
RETURNS jsonb LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT COALESCE(jsonb_agg(jsonb_build_object('date', d, 'clicks', n) ORDER BY d), '[]'::jsonb)
  FROM (SELECT date(created_at) AS d, count(*) AS n FROM public.tool_clicks
        WHERE tool_slug = p_slug AND created_at >= now() - (p_days || ' days')::interval
        GROUP BY d) t;
$$;
GRANT EXECUTE ON FUNCTION public.tool_daily_clicks(text, integer) TO anon, authenticated;
