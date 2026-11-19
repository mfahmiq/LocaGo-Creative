-- publish_auto_approved.sql — sinkronisasi tool auto-ACC ke tabel ai_tools.
-- Dijalankan via Composio SUPABASE_BETA_RUN_SQL_QUERY (parent agent / cron),
-- BUKAN dari browser: ai_tools hanya bisa ditulis dengan service_role.
-- Catatan: tool auto-ACC SUDAH tampil instan di katalog lewat RPC
-- list_live_paid_tools (merge di AIToolsHub); sync ini untuk permanensi di
-- ai_tools + SEO. Aman diulang (ON CONFLICT ... DO UPDATE).
-- Logo: submission berbayar tidak punya logo; logoUrl dibiarkan NULL dan
-- gatekeeper katalog dilewati untuk baris berbayar (isPaidBoost di UI).
INSERT INTO public.ai_tools
  (id, name, category, "pricingType", tagline, description, features,
   "affiliateUrl", "demoVideoUrl", "logoUrl", "screenshotUrl", "needsReview",
   source, url, sort_order, donation_amount, boost_until, submit_order_id, media_urls)
SELECT
  'paid-' || s.id::text,
  s.tool_name,
  s.category,
  s.pricing_type,
  left(s.description, 120),
  s.description,
  '[]'::jsonb,
  s.website_url,
  NULL,
  NULL,
  NULL,
  false,
  'paid-submit',
  s.website_url,
  900000 + (row_number() OVER (ORDER BY s.donation_amount DESC))::int,
  s.donation_amount,
  s.boost_until,
  s.order_id,
  COALESCE(s.media_urls, '[]'::jsonb)
FROM public.tool_submissions s
WHERE s.submit_status IN ('approved', 'auto_approved')
  AND s.boost_until > now()
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  "pricingType" = EXCLUDED."pricingType",
  tagline = EXCLUDED.tagline,
  description = EXCLUDED.description,
  "affiliateUrl" = EXCLUDED."affiliateUrl",
  url = EXCLUDED.url,
  donation_amount = EXCLUDED.donation_amount,
  boost_until = EXCLUDED.boost_until,
  submit_order_id = EXCLUDED.submit_order_id,
  media_urls = EXCLUDED.media_urls,
  updated_at = now();
