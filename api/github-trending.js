import fs from 'node:fs';
import path from 'node:path';

function nowWibStr() {
  const now = new Date(Date.now() + 7 * 3600 * 1000);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dd = String(now.getUTCDate()).padStart(2, '0');
  const mon = months[now.getUTCMonth()];
  const yyyy = now.getUTCFullYear();
  const hh = String(now.getUTCHours()).padStart(2, '0');
  const mm = String(now.getUTCMinutes()).padStart(2, '0');
  return `${dd} ${mon} ${yyyy}, ${hh}:${mm} WIB`;
}

function decodeHtml(str) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseTrendingHtml(html, since) {
  const articles = html.split('<article class="Box-row">').slice(1);
  const items = [];

  for (const art of articles) {
    const repoMatch = art.match(/<h2 class="h3 lh-condensed">\s*<a[^>]*href="\/([^"]+)"/);
    if (!repoMatch) continue;

    const fullRepo = repoMatch[1].trim().replace(/\s+/g, '');
    const parts = fullRepo.split('/');
    const owner = parts[0] || '';
    const repoName = parts[1] || fullRepo;
    const rank = items.length + 1;

    const descMatch = art.match(/<p class="col-9[^>]*>([\s\S]*?)<\/p>/);
    const description = descMatch
      ? decodeHtml(descMatch[1].replace(/<[^>]+>/g, ''))
      : `Repositori open-source ${repoName} yang sedang trending di GitHub.`;

    const langMatch = art.match(/itemprop="programmingLanguage">([^<]+)</);
    const language = langMatch ? decodeHtml(langMatch[1]) : '';

    const periodMatch = art.match(/([\d,]+)\s+stars\s+(today|this week|this month)/i);
    let starsNum = 0;
    let starsGrowthText = 'Trending';
    if (periodMatch) {
      starsNum = parseInt(periodMatch[1].replace(/,/g, ''), 10) || 0;
      starsGrowthText = `+${periodMatch[1]} stars ${periodMatch[2]}`;
    }

    const escapedRepo = fullRepo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const starsRegex = new RegExp(
      `href="/${escapedRepo}/stargazers"[^>]*>[\\s\\S]*?<\\/svg>\\s*([\\d,]+)`,
      'i'
    );
    const starsM =
      art.match(starsRegex) ||
      art.match(/href="[^"]*stargazers"[^>]*>[\s\S]*?<\/svg>\s*([\d,]+)/i);

    let totalStarsStr = '0';
    if (starsM) {
      const totalInt = parseInt(starsM[1].replace(/,/g, '').trim(), 10);
      if (!Number.isNaN(totalInt)) {
        totalStarsStr = totalInt >= 1000 ? `${(totalInt / 1000).toFixed(1)}k` : String(totalInt);
      }
    }

    const descLower = `${repoName} ${description}`.toLowerCase();
    let category = 'Productivity & Media';
    if (/(ai|agent|llm|gpt|model|inference|rag|claude|transformer|deepseek|prompt|voice)/.test(descLower)) {
      category = 'AI Agents & LLM';
    } else if (/(cli|git|tool|dev|rust|compiler|worktree|debug|emulator|docker|terminal|shell)/.test(descLower)) {
      category = 'Dev Tools & Automation';
    } else if (/(web|scrape|crawler|browser|react|next|vue|api|http|ui)/.test(descLower)) {
      category = 'Web & Scrapers';
    }

    const topics = [category.split(' ')[0].toLowerCase()];
    if (language) topics.push(language.toLowerCase());

    items.push({
      id: `gh-${owner.toLowerCase()}-${repoName.toLowerCase()}`,
      name: repoName,
      owner,
      repo: fullRepo,
      url: `https://github.com/${fullRepo}`,
      category,
      language,
      description,
      oneSentencePitch: description,
      rank,
      totalStars: totalStarsStr,
      starsToday: starsNum,
      starsGrowthText,
      growthRate: starsGrowthText,
      topics,
      features: [
        `Trending resmi #${rank} di GitHub (?since=${since})`,
        `Pertumbuhan pesat: ${starsGrowthText}`,
        language ? `Ditulis menggunakan bahasa ${language}` : 'Repositori Open-Source GitHub'
      ]
    });
  }

  return items;
}

async function scrapeTimeframe(since) {
  const res = await fetch(`https://github.com/trending?since=${since}`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9'
    },
    signal: AbortSignal.timeout(10000)
  });

  if (!res.ok) {
    throw new Error(`GitHub Trending HTTP ${res.status} for since=${since}`);
  }
  const html = await res.text();
  return parseTrendingHtml(html, since);
}

function readStaticFallback() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'github_trending_live.json');
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const rawSince = String(req.query?.since || 'daily').toLowerCase();
  const timeframe = ['daily', 'weekly', 'monthly'].includes(rawSince) ? rawSince : 'daily';

  try {
    const [dailyRes, weeklyRes, monthlyRes] = await Promise.allSettled([
      scrapeTimeframe('daily'),
      scrapeTimeframe('weekly'),
      scrapeTimeframe('monthly')
    ]);

    const fallback = (dailyRes.status !== 'fulfilled' || weeklyRes.status !== 'fulfilled' || monthlyRes.status !== 'fulfilled')
      ? readStaticFallback()
      : null;

    const daily = dailyRes.status === 'fulfilled' && dailyRes.value.length > 0
      ? dailyRes.value
      : (fallback?.daily || fallback?.items || []);
    const weekly = weeklyRes.status === 'fulfilled' && weeklyRes.value.length > 0
      ? weeklyRes.value
      : (fallback?.weekly || []);
    const monthly = monthlyRes.status === 'fulfilled' && monthlyRes.value.length > 0
      ? monthlyRes.value
      : (fallback?.monthly || []);

    const byTimeframe = { daily, weekly, monthly };
    const items = byTimeframe[timeframe] || daily;

    if (items.length === 0) {
      return res.status(502).json({ error: 'Unable to fetch GitHub Trending repositories' });
    }

    return res.status(200).json({
      updatedAt: nowWibStr(),
      timeframe,
      total: items.length,
      items,
      daily,
      weekly,
      monthly
    });
  } catch (err) {
    const fallback = readStaticFallback();
    if (fallback) {
      const items = fallback[timeframe] || fallback.items || [];
      return res.status(200).json({
        updatedAt: fallback.updatedAt || nowWibStr(),
        timeframe,
        total: items.length,
        items,
        daily: fallback.daily || fallback.items || [],
        weekly: fallback.weekly || [],
        monthly: fallback.monthly || []
      });
    }
    return res.status(500).json({ error: err.message || 'Failed to fetch GitHub Trending' });
  }
}
