import { AIToolItem, LinkListItem, UserProfile } from '../types';

/**
 * Normalizes a string for robust keyword/domain matching
 */
export const cleanText = (str?: string): string => {
  return (str || '')
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/^(tool-|ai-)/, '')
    .replace(/[^a-z0-9]/g, '');
};

/**
 * Extracts the base domain from any URL
 * e.g. "https://cursor.com/download?ref=123" -> "cursor.com"
 */
export const extractDomain = (urlStr?: string): string => {
  if (!urlStr) return '';
  try {
    const raw = urlStr.startsWith('http') ? urlStr : `https://${urlStr}`;
    const u = new URL(raw);
    return u.hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return cleanText(urlStr);
  }
};

/**
 * AUTOMATIC TOOL DEDUPLICATION & SELECTION
 * If an added link or tool name matches an existing tool registered in LocaGo Creative,
 * automatically returns that registered catalog tool.
 */
export const matchCatalogTool = (inputUrlOrName: string, catalogTools: AIToolItem[]): AIToolItem | null => {
  if (!inputUrlOrName || !catalogTools || catalogTools.length === 0) return null;

  const targetDomain = extractDomain(inputUrlOrName);
  const targetClean = cleanText(inputUrlOrName);

  for (const tool of catalogTools) {
    if (!tool) continue;

    // 1. Direct ID match
    if (tool.id && cleanText(tool.id) === targetClean) return tool;

    // 2. Tool Name match
    const toolNameClean = cleanText(tool.name);
    if (toolNameClean && (toolNameClean === targetClean || (targetClean.length >= 4 && targetClean.includes(toolNameClean)))) {
      return tool;
    }

    // 3. Official website / affiliate domain match
    const toolSiteDomain = extractDomain(tool.websiteUrl);
    const toolAffDomain = extractDomain(tool.affiliateUrl);

    if (targetDomain && (targetDomain === toolSiteDomain || targetDomain === toolAffDomain)) {
      return tool;
    }

    // 4. Slug containment match
    if (toolSiteDomain && targetDomain.includes(cleanText(tool.name)) && cleanText(tool.name).length >= 4) {
      return tool;
    }
  }

  return null;
};

/**
 * ANTI-AFFILIATE HIJACKING SANITIZER
 * Enforces security & monetization policy:
 * - Owner (Mas Fahmi): Allowed to use custom affiliate links.
 * - Non-Owner Users: Any affiliate/referral query parameters are stripped clean automatically.
 */
export const sanitizeExternalUrl = (
  rawUrl: string,
  isOwner: boolean
): { cleanUrl: string; wasSanitized: boolean; reason?: string } => {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return { cleanUrl: '', wasSanitized: false };
  }

  let workingUrl = rawUrl.trim();
  if (!/^https?:\/\//i.test(workingUrl)) {
    workingUrl = 'https://' + workingUrl;
  }

  // Owner is exempted from restrictions
  if (isOwner) {
    return { cleanUrl: workingUrl, wasSanitized: false };
  }

  try {
    const u = new URL(workingUrl);

    // List of known affiliate & referral parameter keys
    const affiliateKeys = [
      'ref',
      'aff',
      'affiliate',
      'via',
      'tap_a',
      'fpr',
      'fp_ref',
      'partner',
      'referral',
      'subid',
      'tag',
      'click_id',
      'affid',
      'campaign',
      'aid',
      'pid',
      'r',
      'ref_id'
    ];

    let detected = false;
    for (const key of affiliateKeys) {
      if (u.searchParams.has(key)) {
        u.searchParams.delete(key);
        detected = true;
      }
    }

    // Strip known affiliate redirects or tracking domains
    const hostname = u.hostname.toLowerCase();
    const isAffiliateRedirect = [
      'shareasale.com',
      'clickbank.net',
      'impact.com',
      'cj.com',
      'rewardstyle.com',
      'jvzoo.com',
      'digistore24.com',
      'partnerize.com',
      'awin1.com'
    ].some((dom) => hostname.includes(dom));

    if (isAffiliateRedirect) {
      return {
        cleanUrl: `https://${hostname}`,
        wasSanitized: true,
        reason: 'Domain redirect affiliate dinetralkan ke domain utama.'
      };
    }

    return {
      cleanUrl: u.toString(),
      wasSanitized: detected,
      reason: detected ? 'Parameter affiliate eksternal telah dibersihkan secara otomatis.' : undefined
    };
  } catch {
    return { cleanUrl: workingUrl, wasSanitized: false };
  }
};

/**
 * Check whether a user has permission to edit or delete a LinkList
 */
export const canUserEditLinkList = (
  list: LinkListItem,
  user: UserProfile | null
): boolean => {
  if (!list) return false;
  // 1. Owner can edit all playlists
  if (user?.isOwner) return true;
  // 2. Creator can edit their own playlist
  if (user && list.userId && list.userId === user.id) return true;
  if (user && list.authorEmail && list.authorEmail === user.email) return true;
  return false;
};

/**
 * Initial curated playlists authored by Mas Fahmi & initial community spotlights
 */
export const INITIAL_COMMUNITY_LINKLISTS: LinkListItem[] = [
  {
    id: 'list-konten-ig-desain-video',
    title: 'Top 5 AI Tools Konten Kreator IG & Video Editor',
    notes: 'Kumpulan tool AI wajib untuk memproduksi video Reels, voiceover studio, dan aset visual siap FYP tanpa repot rekaman berulang kali.',
    videoUrl: 'https://www.instagram.com/locagocreative',
    toolIds: ['tool-cursor', 'tool-elevenlabs', 'tool-make', 'tool-bolt', 'tool-v0', 'tool-systeme'],
    customLinks: [
      {
        id: 'custom-link-prompt',
        title: 'Template Prompt Storyboard & Hook Video FYP (Google Doc)',
        url: 'https://www.locagocreative.my.id/#articles',
        note: 'Formula copywriting 3 detik pertama & struktur naskah video pendek viral.'
      }
    ],
    userId: '995f91f5-8803-4b58-b501-0b4076c678fb',
    authorEmail: 'fahmi@locagocreative.my.id',
    authorName: 'Mas Fahmi (Founder & Owner)',
    isOfficial: true,
    createdAt: '04 Nov 2026',
    views: 1420
  },
  {
    id: 'list-ai-coding-stack-2026',
    title: 'Fullstack AI Coding Stack 2026 (Zero Boilerplate)',
    notes: 'Kombinasi AI Coding agent paling cepat untuk membangun aplikasi web modern dari prompt ke production dalam hitungan jam.',
    videoUrl: 'https://www.instagram.com/locagocreative',
    toolIds: ['tool-cursor', 'tool-bolt', 'tool-v0'],
    customLinks: [
      {
        id: 'custom-link-sc',
        title: 'Koleksi 15+ Source Code Fullstack Siap Pakai',
        url: 'https://www.locagocreative.my.id/#source-code',
        note: 'Unduh gratis template POS kasir, absensi sekolah, dan portal SaaS.'
      }
    ],
    userId: '995f91f5-8803-4b58-b501-0b4076c678fb',
    authorEmail: 'fahmi@locagocreative.my.id',
    authorName: 'Mas Fahmi (Founder & Owner)',
    isOfficial: true,
    createdAt: '04 Nov 2026',
    views: 980
  },
  {
    id: 'list-growth-marketing-automation',
    title: 'Mesin Otomasi Marketing & Leads WhatsApp 24/7',
    notes: 'Alur otomatisasi no-code untuk menjaring prospek, memproses order otomatis, dan broadcast pengingat tanpa bayar staf CS lembur.',
    videoUrl: 'https://www.instagram.com/locagocreative',
    toolIds: ['tool-make', 'tool-systeme', 'tool-elevenlabs'],
    customLinks: [
      {
        id: 'custom-link-wa',
        title: 'Konsultasi Setup Otomasi Bisnis via WhatsApp',
        url: 'https://wa.me/6285189393354?text=Halo%20Mas%20Fahmi%20saya%20tertarik%20setup%20otomasi%20marketing',
        note: 'Pendampingan langsung bangun sistem custom untuk bisnis Anda.'
      }
    ],
    userId: '995f91f5-8803-4b58-b501-0b4076c678fb',
    authorEmail: 'fahmi@locagocreative.my.id',
    authorName: 'Mas Fahmi (Founder & Owner)',
    isOfficial: true,
    createdAt: '04 Nov 2026',
    views: 750
  }
];
