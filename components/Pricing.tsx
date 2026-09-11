import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { retrieveRelevantContext } from '../services/ragService';

const WA_NUMBER = '62895336377648';
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';
const GROQ_MODEL = import.meta.env.VITE_GROQ_MODEL || 'groq/compound';
const GOOGLE_SHEET_WEBHOOK_URL = import.meta.env.VITE_GOOGLE_SHEET_WEBHOOK_URL || '';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  waButton?: boolean;
  isErrorFallback?: boolean;
  userQuery?: string;
}

// ─── Ticket ID & Checksum Generator (Anti-Tamper) ───────────────────────────
function generateTicketId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let rand = '';
  for (let i = 0; i < 4; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const year = new Date().getFullYear();
  return `LCG-${year}-${rand}`;
}

function generateChecksum(ticketId: string, timestamp: string): string {
  let hash = 0;
  const str = ticketId + timestamp + 'LOCAGO_SECURE_SALT_2026';
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(16).toUpperCase().slice(-4);
}

// ─── Humanized & Concise RAG System Prompt Builder ────────────────────────────
function buildSystemPrompt(retrievedContext: string, queryLang: 'id' | 'en'): string {
  if (queryLang === 'en') {
    return `You are LocaGo Assistant, the official digital solutions consultant for LocaGo Creative (Software & Automation Studio - locagocreative.my.id).

[CORE PERSONA & HUMAN-LIKE RULES]:
1. Speak naturally, warmly, and professionally—like a friendly senior developer or consultant (Mas Fahmi's team).
2. ANSWER CONCISELY AND TO THE POINT (seperlunya saja). DO NOT write lengthy walls of text or rambling paragraphs. Keep your response within 2-3 short, clear sentences or concise bullet points that directly address what the user asked.
3. Strict Language Mirroring: Always respond 100% in English.
4. Scope Guard: Only assist with custom website development, web applications, and business automation. Decline math homework, general trivia, or free code generation politely.
5. In your closing sentence, warmly invite them to discuss specific requirements or secure a development slot directly with Mas Fahmi (Founder & Lead Developer) on WhatsApp (62895336377648).

${retrievedContext ? `[OFFICIAL SUPABASE KNOWLEDGE BASE CONTEXT]:\n${retrievedContext}` : ''}`.trim();
  }

  return `Anda adalah asisten konsultan solusi digital resmi dari LocaGo Creative (Software & Automation Studio - locagocreative.my.id).

[GAYA BICARA & ATURAN MANUSIAWI]:
1. Ramah, santun, natural, dan bersahabat layaknya berbicara langsung dengan developer/konsultan profesional (tim Mas Fahmi).
2. JAWAB SEPERLUNYA SAJA (singkat, padat, dan to the point). HINDARI penjelasan panjang lebar atau bertele-tele. Berikan 2–3 kalimat atau poin ringkas yang langsung menjawab inti pertanyaan pengguna.
3. Samakan bahasa: Wajib menjawab 100% dalam Bahasa Indonesia yang santun dan enak dibaca.
4. Scope Guard: Khusus melayani pembuatan website, aplikasi/sistem kustom, dan otomasi bisnis. Tolak dengan santun jika ditanya soal PR/matematika murni, coding script gratis, atau topik di luar layanan.
5. Di akhir jawaban, ajak dengan ramah untuk berdiskusi detail atau mengamankan antrian pengerjaan langsung bersama Mas Fahmi (Founder & Lead Developer) via WhatsApp (62895336377648).

${retrievedContext ? `[KONTEKS KNOWLEDGE BASE RESMI SUPABASE]:\n${retrievedContext}` : ''}`.trim();
}

// ─── Cleaner for plain text (strips any markdown) ───────────────────────────
function cleanPlainText(text: string): string {
  if (!text) return '';
  return text
    .replace(/^#+\s+/gm, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/_(.*?)_/g, '$1')
    .replace(/`{1,3}(.*?)`{1,3}/g, '$1')
    .replace(/^\s*[-*+]\s+/gm, '• ')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .trim();
}

// ─── Query language detection ───────────────────────────────────────────────
function detectQueryLanguage(query: string, currentUiLang: 'id' | 'en'): 'en' | 'id' {
  const clean = query.trim().toLowerCase();

  const indonesianIndicators =
    /\b(yang|dan|di|ke|dari|ini|itu|bisa|saya|aku|kami|kamu|kak|kakak|mas|bang|gan|bro|apakah|apa|berapa|bagaimana|gimana|kenapa|mengapa|kalau|kalo|jika|dapat|dapet|punya|untuk|dengan|ada|nggak|ngga|tidak|gak|nggak|mau|buat|bikin|toko|olshop|jualan|sekolah|guru|tugas|skripsi|koding|codingan|harga|biaya|murah|mahal|diskon|potongan|rekomendasi|bingung|tanya|halo|siang|pagi|malam|terima\s+kasih|makasih|ya|yah|nih|dong|deh|kan|udah|sudah|belum|kira-kira|min|admin|paket|saja|aja|rb|ribu|jt|juta)\b/i;

  const englishIndicators =
    /\b(how|what|why|when|where|who|which|can|could|would|should|hello|hi|hey|please|price|pricing|cost|quote|build|create|make|need|want|help|looking|feature|features|store|shop|online|school|teacher|company|service|services|estimate|project|developer|business|portfolio|thank|thanks|confused|recommend|suggestion|available)\b/i;

  const hasIndo = indonesianIndicators.test(clean);
  const hasEng = englishIndicators.test(clean);

  if (hasIndo) return 'id';
  if (hasEng && !hasIndo) return 'en';
  return currentUiLang === 'en' ? 'en' : 'id';
}

function getFallbackResponse(input: string, lang: 'id' | 'en' = 'id', context?: string): string {
  const lower = input.toLowerCase();

  const isMathOrOffTopic =
    /([0-9]+\s*[\+\-\*\/]\s*[0-9]+|sin\(|cos\(|resep\s+|recipe|puisi|poem|codingan|write\s+code)/i.test(lower);

  if (isMathOrOffTopic) {
    return lang === 'en'
      ? 'Sorry, I specifically consult on website development, custom software, and digital automation at LocaGo Creative. Please feel free to ask about your web project, or connect directly with Mas Fahmi via WhatsApp!'
      : 'Maaf Kak, saya khusus melayani konsultasi pembuatan website dan otomasi software di LocaGo Creative. Silakan tanyakan seputar kebutuhan sistem digital Anda, atau langsung diskusikan bersama Mas Fahmi via WhatsApp!';
  }

  if (context) {
    return lang === 'en'
      ? `Based on LocaGo Creative setup:\n${context}\n\nFeel free to discuss specific details directly with Mas Fahmi on WhatsApp!`
      : `Berdasarkan panduan resmi LocaGo Creative:\n${context}\n\nMari diskusikan detail kebutuhan Kakak langsung bersama Mas Fahmi di WhatsApp ya!`;
  }

  if (lang === 'en') {
    return `All of our websites are 100% custom-built from scratch (Handcrafted Code, Zero Template).
• Under IDR 300k: No custom domain (free link/subdomain).
• Under IDR 500k: Official .my.id domain.
• Above IDR 500k: .com domain + shared hosting.
• Above IDR 1M: .com domain + 1 full year of cloud hosting.

What features do you need for your system? Let's connect directly with Mas Fahmi on WhatsApp to discuss details!`;
  }

  return `Seluruh website kami dibangun murni dari nol (Handcrafted Code, Zero Template).
• Di bawah Rp 300rb: Tidak dapat domain kustom (pakai link/subdomain gratis).
• Di bawah Rp 500rb: Mendapatkan domain resmi .my.id.
• Di atas Rp 500rb: Mendapatkan domain .com + shared hosting.
• Di atas Rp 1jt: Mendapatkan domain .com + hosting 1 tahun penuh.

Sistem yang Kakak rencanakan ingin ada fitur apa saja? Mari langsung kita bahas bersama Mas Fahmi via WhatsApp ya Kak!`;
}

// ─── Format clean plain text into React paragraphs ──────────────────────────
function renderPlainText(text: string): React.ReactNode {
  const cleaned = cleanPlainText(text);
  const paragraphs = cleaned.split('\n');
  return paragraphs.map((line, i) => (
    <React.Fragment key={i}>
      {i > 0 && <br />}
      {line}
    </React.Fragment>
  ));
}

// ─── Feature + Profile presets (Clean & Professional, No Raw Emojis) ────────
const getProfiles = (lang: 'en' | 'id') =>
  lang === 'en'
    ? [
        { value: 'corporate', label: 'Corporate / Company' },
        { value: 'umkm', label: 'UMKM / Small Business' },
        { value: 'school', label: 'School / Educator' },
        { value: 'personal', label: 'Student / Individual' },
      ]
    : [
        { value: 'corporate', label: 'Korporat / Perusahaan' },
        { value: 'umkm', label: 'UMKM / Bisnis' },
        { value: 'school', label: 'Sekolah / Guru' },
        { value: 'personal', label: 'Mahasiswa / Perorangan' },
      ];

const getFeatures = (lang: 'en' | 'id') =>
  lang === 'en'
    ? [
        { id: 'landing', label: 'Website & Landing Page' },
        { id: 'ecommerce', label: 'Online Store / E-Commerce' },
        { id: 'chatbot', label: 'AI WhatsApp Chatbot' },
        { id: 'attendance', label: 'QR Attendance System' },
        { id: 'savings', label: 'Digital Savings System' },
        { id: 'rps', label: 'AI Lesson Planner (RPS/RPP)' },
        { id: 'gas', label: 'Google Apps Script Automation' },
        { id: 'mobile', label: 'Android Mobile App' },
        { id: 'desktop', label: 'Custom Desktop Software' },
        { id: 'coding', label: 'Coding Task Assistance' },
      ]
    : [
        { id: 'landing', label: 'Website & Landing Page' },
        { id: 'ecommerce', label: 'Toko Online / E-Commerce' },
        { id: 'chatbot', label: 'AI Chatbot WhatsApp' },
        { id: 'attendance', label: 'Sistem Presensi QR Code' },
        { id: 'savings', label: 'Tabungan Digital Siswa' },
        { id: 'rps', label: 'AI Generator RPS / RPP' },
        { id: 'gas', label: 'Otomasi Google Apps Script' },
        { id: 'mobile', label: 'Aplikasi Android Mobile' },
        { id: 'desktop', label: 'Aplikasi Desktop Kustom' },
        { id: 'coding', label: 'Asistensi Coding / Tugas' },
      ];

interface ExtractedConsultationDetails {
  profileLabel: string;
  systemType: string;
  featureList: string[];
  investmentValue: string;
  durationEstimate: string;
  summaryText: string;
}

function extractConsultationDetails(
  messages: Message[],
  selectedProfile: string,
  customProfile: string,
  selectedFeatures: string[],
  customFeature: string,
  budget: string,
  PROFILES: { value: string; label: string }[],
  FEATURES: { id: string; label: string }[],
  lang: 'id' | 'en'
): ExtractedConsultationDetails {
  const allUserText = messages.filter(m => m.role === 'user').map(m => m.content).join(' ');
  const lastAiMsg = messages.filter(m => m.role === 'assistant').pop()?.content || '';
  const combinedText = `${allUserText} ${lastAiMsg}`.toLowerCase();

  // 1. Profil Klien
  const profilePresetLabel = PROFILES.find(p => p.value === selectedProfile)?.label.replace(/^.{2}/, '').trim();
  let profileLabel = [profilePresetLabel, customProfile.trim()].filter(Boolean).join(' - ');
  if (!profileLabel) {
    if (/toko|olshop|jual|dagang|produk|warung|cafe|resto|katalog/i.test(combinedText)) {
      profileLabel = lang === 'en' ? 'Online Store Owner / Merchant' : 'Pemilik Toko / Pelaku Usaha';
    } else if (/sekolah|guru|guru les|siswa|pendidikan|ajar/i.test(combinedText)) {
      profileLabel = lang === 'en' ? 'Educator / School Representative' : 'Sekolah / Guru / Pengajar';
    } else if (/mahasiswa|kampus|tugas|skripsi|kuliah/i.test(combinedText)) {
      profileLabel = lang === 'en' ? 'Student / Researcher' : 'Mahasiswa / Akademisi';
    } else if (/perusahaan|pt|cv|kantor|corporate|legalitas/i.test(combinedText)) {
      profileLabel = lang === 'en' ? 'Company / Corporate' : 'Korporat / Perusahaan';
    } else {
      profileLabel = lang === 'en' ? 'Prospective Client (LocaGo Digital)' : 'Calon Klien LocaGo Creative';
    }
  }

  // 2. Jenis Sistem
  let systemType = '';
  if (/google apps script|appscript|app script|gas|google sheet|spreadsheet|excel|500k|300k|200k|400k|100k/i.test(combinedText)) {
    systemType = lang === 'en'
      ? 'Automated Cloud System (Google Apps Script + Google Sheets / Excel)'
      : 'Sistem Otomasi Cloud (Google Apps Script + Google Sheets / Excel)';
  } else if (/toko online|ecommerce|e-commerce|olshop/i.test(combinedText)) {
    systemType = lang === 'en'
      ? 'Online Store & E-Commerce (Direct-to-WhatsApp)'
      : 'Website Toko Online & Katalog Direct-to-WhatsApp';
  } else if (/presensi|absensi|sekolah|guru|siswa|rpp/i.test(combinedText)) {
    systemType = lang === 'en'
      ? 'School QR Code Attendance & Digital Ledger System'
      : 'Sistem Presensi QR Code Siswa & Notifikasi WhatsApp';
  } else if (/booking|reservasi|jadwal|klinik|salon|rental/i.test(combinedText)) {
    systemType = lang === 'en'
      ? 'Online Appointment Booking & Scheduling Platform'
      : 'Website Booking & Reservasi Layanan Online';
  } else if (/company profile|landing page|profil perusahaan/i.test(combinedText)) {
    systemType = lang === 'en'
      ? 'Modern Corporate Website & Landing Page'
      : 'Website Company Profile & Landing Page Modern';
  } else if (/chatbot|bot wa|whatsapp ai/i.test(combinedText)) {
    systemType = lang === 'en'
      ? 'AI WhatsApp 24/7 Chatbot & Workflow Automation'
      : 'AI Chatbot WhatsApp 24/7 & Otomasi Alur Kerja';
  } else if (selectedFeatures.length > 0) {
    systemType = FEATURES.find(f => f.id === selectedFeatures[0])?.label || (lang === 'en' ? 'Custom Digital System' : 'Sistem Digital Kustom');
  } else {
    systemType = lang === 'en' ? 'Custom Digital System & Website' : 'Sistem Digital & Website Kustom';
  }

  // 3. List Fitur Utama
  const rawFeatures = [
    ...FEATURES.filter(f => selectedFeatures.includes(f.id)).map(f => f.label.replace(/^.{2}/, '').trim()),
    customFeature.trim() ? `${customFeature.trim()}` : '',
  ].filter(Boolean);

  if (rawFeatures.length === 0) {
    if (/google apps script|appscript|google sheet|excel|300k|500k/i.test(combinedText)) {
      rawFeatures.push(
        lang === 'en' ? 'Web Form Input for Easy Data Entry' : 'Formulir Web Input Data Otomatis',
        lang === 'en' ? 'Structured Google Sheets / Excel Database' : 'Database Google Sheets / Excel Terstruktur',
        lang === 'en' ? 'Automatic Calculations & 100% Free Cloud Server' : 'Kalkulasi Rumus Otomatis & Bebas Biaya Server Selamanya'
      );
    } else if (/toko|olshop/i.test(combinedText)) {
      rawFeatures.push(
        lang === 'en' ? 'Product Showcase & Auto WhatsApp Order Form' : 'Katalog Produk & Form Pemesanan Otomatis WhatsApp',
        lang === 'en' ? 'Mobile-First Responsive Layout' : 'Desain Responsif Super Cepat di HP',
        lang === 'en' ? 'Domain & Cloud Hosting 1 Year Included' : 'Paket Terima Beres Domain & Cloud Hosting 1 Tahun'
      );
    } else if (/presensi|sekolah/i.test(combinedText)) {
      rawFeatures.push(
        lang === 'en' ? 'QR Code Attendance Scanner' : 'Scanner Presensi QR Code Siswa',
        lang === 'en' ? 'Automatic WhatsApp Notification to Parents' : 'Notifikasi WhatsApp Otomatis ke Orang Tua',
        lang === 'en' ? 'Daily & Monthly Attendance Reports' : 'Rekap Kehadiran Harian & Bulanan'
      );
    } else {
      rawFeatures.push(
        lang === 'en' ? 'Zero Template Handcrafted Custom Code' : 'Arsitektur Kustom 100% dari 0 (Zero Template)',
        lang === 'en' ? 'Direct Integration to WhatsApp & Business Flow' : 'Integrasi Langsung ke Alur Operasional & WhatsApp'
      );
    }
  }

  // 4. Nilai Investasi
  let investmentValue = budget.trim() ? `Rp ${budget.trim()}` : '';
  if (!investmentValue) {
    const userMsgs = messages.filter(m => m.role === 'user').map(m => m.content);
    for (let i = userMsgs.length - 1; i >= 0; i--) {
      const budgetMatch = userMsgs[i].match(/(?:budget|anggaran|dana|biaya|alokasi|sebesar|punya)?\s*([0-9]+(?:[\.,][0-9]+)*\s*(?:k|rb|ribu|jt|juta)?)/i);
      if (budgetMatch && budgetMatch[1] && /\d/.test(budgetMatch[1])) {
        investmentValue = `Rp ${budgetMatch[1].trim()}`;
        break;
      }
    }
    if (!investmentValue) {
      if (/300k|300rb|300 ribu/i.test(combinedText)) {
        investmentValue = 'Rp 300.000 (Solusi Super Hemat GAS)';
      } else if (/500k|500rb|500 ribu/i.test(combinedText)) {
        investmentValue = 'Di bawah Rp 500.000 (< 500k)';
      } else {
        investmentValue = lang === 'en' ? 'Flexible / As Discussed in Consultation' : 'Fleksibel / Sesuai Hasil Konsultasi AI';
      }
    }
  }

  // 5. Estimasi Waktu Pengerjaan
  let durationEstimate = '';
  if (/appscript|gas|google sheet|excel|300k|500k/i.test(combinedText)) {
    durationEstimate = lang === 'en' ? '1 - 3 business days (Express)' : '1 - 3 hari kerja (Express)';
  } else if (/landing page|company profile/i.test(combinedText)) {
    durationEstimate = lang === 'en' ? '3 - 5 business days' : '3 - 5 hari kerja';
  } else if (/toko|ecommerce|sekolah|presensi/i.test(combinedText)) {
    durationEstimate = lang === 'en' ? '1 - 2 weeks' : '1 - 2 minggu';
  } else {
    durationEstimate = lang === 'en' ? '1 - 3 weeks (Tailored to project scale)' : '1 - 3 minggu (Menyesuaikan skala fitur)';
  }

  // 6. Rangkuman Inti AI
  let cleanSummary = lastAiMsg
    .replace(/^Halo.*?(\n|$)/i, '')
    .replace(/^Kabar gembira.*?(\n|$)/i, '')
    .replace(/Mari langsung kita diskusikan.*?$/is, '')
    .replace(/Yuk langsung kita.*?$/is, '')
    .replace(/Silakan klik tombol.*?$/is, '')
    .replace(/Mohon maaf Kak.*?$/is, '')
    .trim();

  if (!cleanSummary) {
    cleanSummary = lang === 'en'
      ? 'Discussion on system requirements, budget optimization, and development plan.'
      : 'Diskusi pemetaan fitur, solusi sistem teroptimasi, dan kesepakatan nilai investasi.';
  } else if (cleanSummary.length > 350) {
    cleanSummary = cleanSummary.substring(0, 340) + '...';
  }

  return {
    profileLabel,
    systemType,
    featureList: rawFeatures,
    investmentValue,
    durationEstimate,
    summaryText: cleanSummary,
  };
}

const AIChatSection: React.FC = () => {
  const { t, language } = useLanguage();
  const hasKey = !!GROQ_API_KEY && GROQ_API_KEY !== 'your_groq_api_key_here';

  const PROFILES = getProfiles(language as 'en' | 'id');
  const FEATURES = getFeatures(language as 'en' | 'id');

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        language === 'en'
          ? `Hello! I am LocaGo Virtual Agent, the official digital assistant from LocaGo Creative.\n\nI am ready to help you plan digital investment estimates, choose the right technology solutions, and tailor your project to your budget without barrier.\n\nFeel free to ask anything in this chat, or use the Quick Estimate panel on the right for automated calculations.`
          : `Halo! Saya LocaGo Virtual Agent, asisten digital resmi dari LocaGo Creative.\n\nSaya siap membantu Anda merancang estimasi nilai investasi digital, memilih solusi teknologi yang tepat, dan menyesuaikan proyek dengan alokasi anggaran Anda tanpa batasan.\n\nSilakan tanyakan apa saja di chat ini, atau gunakan panel Hitung Cepat di sebelah kanan untuk kalkulasi otomatis.`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Update initial message if empty user messages and language switches
  useEffect(() => {
    setMessages(prev => {
      if (prev.length === 1 && prev[0].role === 'assistant') {
        return [
          {
            role: 'assistant',
            content:
              language === 'en'
                ? `Hello! I am LocaGo Virtual Agent, the official digital assistant from LocaGo Creative.\n\nI am ready to help you plan digital investment estimates, choose the right technology solutions, and tailor your project to your budget without barrier.\n\nFeel free to ask anything in this chat, or use the Quick Estimate panel on the right for automated calculations.`
                : `Halo! Saya LocaGo Virtual Agent, asisten digital resmi dari LocaGo Creative.\n\nSaya siap membantu Anda merancang estimasi nilai investasi digital, memilih solusi teknologi yang tepat, dan menyesuaikan proyek dengan alokasi anggaran Anda tanpa batasan.\n\nSilakan tanyakan apa saja di chat ini, atau gunakan panel Hitung Cepat di sebelah kanan untuk kalkulasi otomatis.`,
          },
        ];
      }
      return prev;
    });
  }, [language]);

  // Calculator panel state
  const [selectedProfile, setSelectedProfile] = useState('');
  const [customProfile, setCustomProfile] = useState('');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [customFeature, setCustomFeature] = useState('');
  const [budget, setBudget] = useState('');

  const [syncedTicket, setSyncedTicket] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Only scroll the internal chat container if there is an active conversation (> 1 message)
    // and NEVER scroll the browser window.
    if (messages.length > 1 && chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  // ── Sync lead & Open WhatsApp with Tamper-Proof Ticket ─────────────────────
  const handleWhatsAppRedirect = async (overrideMsg?: string) => {
    setIsSyncing(true);
    const ticketId = generateTicketId();
    const now = new Date();
    const timestamp =
      now.toLocaleString('id-ID', {
        dateStyle: 'short',
        timeStyle: 'short',
      }) + ' WIB';
    const checksum = generateChecksum(ticketId, timestamp);

    const details = extractConsultationDetails(
      messages,
      selectedProfile,
      customProfile,
      selectedFeatures,
      customFeature,
      budget,
      PROFILES,
      FEATURES,
      language as 'id' | 'en'
    );

    const transcript = messages.map(m => `${m.role === 'user' ? 'Klien' : 'AI'}: ${m.content}`).join('\n---\n');

    const leadData = {
      ticketId,
      timestamp,
      profile: details.profileLabel,
      systemType: details.systemType,
      features: details.featureList.join(', '),
      budget: details.investmentValue,
      duration: details.durationEstimate,
      aiSummary: details.summaryText,
      checksum,
      fullTranscript: transcript,
    };

    // 1. Simpan salinan asli di LocalStorage browser
    try {
      const stored = JSON.parse(localStorage.getItem('locago_consultation_leads') || '[]');
      stored.unshift(leadData);
      localStorage.setItem('locago_consultation_leads', JSON.stringify(stored.slice(0, 50)));
    } catch (err) {
      console.warn('LocalStorage save error:', err);
    }

    // 2. Kirim otomatis ke Google Sheets via Webhook URL (background async)
    if (GOOGLE_SHEET_WEBHOOK_URL && GOOGLE_SHEET_WEBHOOK_URL.startsWith('http')) {
      try {
        await fetch(GOOGLE_SHEET_WEBHOOK_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(leadData),
        });
      } catch (sheetErr) {
        console.warn('Google Sheet sync background note:', sheetErr);
      }
    }

    setSyncedTicket(ticketId);
    setIsSyncing(false);

    // 3. Format pesan WhatsApp Resmi & Rangkuman Kesepakatan Lengkap
    let waText = '';
    if (overrideMsg) {
      waText = language === 'en'
        ? `Hello Mas Fahmi (LocaGo Creative)! 🚀\n\n${overrideMsg}\n\n[Ticket Number: #${ticketId} | Verif: #VERIF-${checksum}]`
        : `Halo Mas Fahmi (LocaGo Creative)! 🚀\n\n${overrideMsg}\n\n[Nomor Tiket: #${ticketId} | Verif: #VERIF-${checksum}]`;
    } else {
      const formattedFeatures = details.featureList.map(f => `  • ${f}`).join('\n');

      waText = language === 'en'
        ? `Hello Mas Fahmi (Founder & Lead Developer LocaGo Creative)! 🚀
I'd like to confirm and lock our project agreement from the website consultation:

📋 OFFICIAL AGREEMENT TICKET
• Ticket Number: #${ticketId}
• Session Time: ${timestamp}
• Client Profile: ${details.profileLabel}

🛠️ SYSTEM & FEATURE SPECIFICATIONS:
• System Type: ${details.systemType}
• Core Features:
${formattedFeatures}

💰 INVESTMENT VALUE:
• Target Budget: ${details.investmentValue}

⏱️ ESTIMATED TIMELINE & SCHEDULE:
• Estimated Duration: ${details.durationEstimate}
• Start Schedule: Subject to developer queue (Mas Fahmi, when can we start development?)

💬 AI CONSULTATION SUMMARY:
${details.summaryText}

[Verification Code: #VERIF-${checksum}]
Please confirm development slot availability and next steps. Thank you!`
        : `Halo Mas Fahmi (Founder & Lead Developer LocaGo Creative)! 🚀
Saya ingin konfirmasi dan mengunci kesepakatan hasil diskusi AI dari website:

📋 TIKET KESEPAKATAN PROYEK RESMI
• Nomor Tiket: #${ticketId}
• Waktu Sesi: ${timestamp}
• Profil Klien: ${details.profileLabel}

🛠️ SPESIFIKASI SISTEM & FITUR:
• Jenis Sistem: ${details.systemType}
• Rincian Fitur Utama:
${formattedFeatures}

💰 NILAI INVESTASI:
• Target Anggaran: ${details.investmentValue}

⏱️ ESTIMASI WAKTU & JADWAL PENGERJAAN:
• Estimasi Durasi: ${details.durationEstimate}
• Jadwal Mulai: Menyesuaikan slot antrian pengerjaan Mas Fahmi (bisa disesuaikan mulai kapan ya Mas?)

💬 RANGKUMAN HASIL DISKUSI AI:
${details.summaryText}

[Kode Verifikasi Keaslian: #VERIF-${checksum}]
Mohon dicek jadwal antrian pengerjaannya ya Mas. Terima kasih!`;
    }

    const waLink = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(waText)}`;
    window.open(waLink, '_blank', 'noopener,noreferrer');
  };
  const sendMessage = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    const userMsg: Message = { role: 'user', content };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const detectedLang = detectQueryLanguage(content, language);

    // Retrieve relevant context from Supabase Vector DB / KB
    const retrievedContext = await retrieveRelevantContext(content, 2);

    if (hasKey) {
      try {
        const history = messages.slice(-4).map(m => ({ role: m.role, content: m.content }));
        const systemPrompt = buildSystemPrompt(retrievedContext, detectedLang);

        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: GROQ_MODEL,
            messages: [
              { role: 'system', content: systemPrompt },
              ...history,
              { role: 'user', content },
            ],
            temperature: 0.6,
            max_tokens: 400,
          }),
        });

        if (!res.ok) {
          const errText = await res.text();
          console.error('Groq API error:', res.status, errText);
          throw new Error(`HTTP ${res.status}: ${errText}`);
        }

        const data = await res.json();
        const rawReply = data.choices?.[0]?.message?.content || 'Maaf, terjadi kendala respons. Silakan coba lagi.';
        const cleanReply = cleanPlainText(rawReply);
        const showWA = true; // Always provide WhatsApp contact access
        setMessages(prev => [...prev, { role: 'assistant', content: cleanReply, waButton: showWA }]);
      } catch (err: any) {
        console.error('Groq error:', err);
        const busyMsg =
          detectedLang === 'en'
            ? `We apologize, our AI assistant server is currently experiencing high traffic / busy status (503).

To ensure your digital consultation and project planning are not delayed, Mas Fahmi (Founder & Lead Developer LocaGo Creative) is available for direct consultation on WhatsApp right now. Please click the button below to connect directly:`
            : `Mohon maaf Kak, server asisten AI kami saat ini sedang sangat sibuk (Trafik Tinggi / 503).

Agar konsultasi dan rencana proyek digital Anda tidak tertunda, Mas Fahmi (Founder & Lead Developer LocaGo Creative) siap melayani konsultasi langsung secara gratis via WhatsApp sekarang. Silakan klik tombol di bawah untuk langsung terhubung:`;

        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: busyMsg,
            waButton: true,
            isErrorFallback: true,
            userQuery: content,
          },
        ]);
      }
    } else {
      await new Promise(r => setTimeout(r, 600 + Math.random() * 300));
      const reply = cleanPlainText(getFallbackResponse(content, detectedLang, retrievedContext));
      setMessages(prev => [...prev, { role: 'assistant', content: reply, waButton: true }]);
    }

    setLoading(false);
    inputRef.current?.focus();
  };

  // ── Calculator shortcut → compose message ──────────────────────────────────
  const handleQuickCalculate = () => {
    const hasProfile = selectedProfile || customProfile.trim();
    const hasFeatures = selectedFeatures.length > 0 || customFeature.trim();
    const hasBudget = budget.trim();

    if (!hasProfile && !hasFeatures && !hasBudget) return;

    const profilePresetLabel = PROFILES.find(p => p.value === selectedProfile)?.label.replace(/^.{2}/, '').trim();
    const profileText = [profilePresetLabel, customProfile.trim()].filter(Boolean).join(' - ');

    const featureLabels = FEATURES.filter(f => selectedFeatures.includes(f.id)).map(f => f.label.replace(/^.{2}/, '').trim());
    if (customFeature.trim()) {
      featureLabels.push(`Kustom: ${customFeature.trim()}`);
    }

    let msg = `Halo LocaGo Virtual Agent! Saya ingin konsultasi estimasi proyek:\n`;
    if (profileText) {
      msg += `• Profil: ${profileText}\n`;
    }
    if (featureLabels.length > 0) {
      msg += `• Kebutuhan Sistem / Fitur:\n${featureLabels.map(f => `  - ${f}`).join('\n')}\n`;
    }
    if (hasBudget) {
      msg += `• Estimasi Anggaran Saya: ${budget.trim()}\n`;
    } else {
      msg += `• Estimasi Anggaran: Fleksibel / ingin rekomendasi terbaik\n`;
    }
    msg += `\nTolong berikan rincian estimasi biaya, waktu pengerjaan, rekomendasi paket hemat, serta penawaran promo diskon terbaik yang bisa saya peroleh hari ini.`;

    sendMessage(msg);
  };

  const toggleFeature = (id: string) => {
    setSelectedFeatures(prev => (prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]));
  };

  const waUrl = (msg: string) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;

  const buildWAMessage = () => {
    const last = messages.filter(m => m.role === 'assistant').pop();
    return `Halo Mas Fahmi / LocaGo Creative! 🚀\n\nSaya ingin konsultasi proyek dari website LocaGo.\n\n${
      last ? `Hasil ringkasan AI:\n${last.content.substring(0, 300)}...` : ''
    }\n\nMohon info detail dan kesepakatan lebih lanjut. Terima kasih!`;
  };

  return (
    <section id="ai-consultation" className="py-24 bg-neutral-50/50 dark:bg-neutral-950 relative transition-colors duration-200 border-b border-neutral-200 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs font-mono text-neutral-600 dark:text-neutral-400 mb-4 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>
              {hasKey
                ? (language === 'en' ? 'LocaGo AI Assistant · Active' : 'LocaGo AI Assistant · Aktif')
                : (language === 'en' ? 'Digital Consultation Engine' : 'Engine Konsultasi Digital')}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white mb-4 leading-[1.18]">
            {language === 'en' ? 'Consultation & Investment Calculator' : 'Konsultasi & Kalkulator Investasi'}
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            {language === 'en'
              ? 'Transparent investment estimates, essential feature roadmaps, and custom zero-template digital solutions tailored to your budget.'
              : 'Dapatkan estimasi investasi transparan, rancangan fitur esensial, dan solusi arsitektur custom bebas template yang disesuaikan dengan anggaran Anda.'}
          </p>
        </div>

        {/* Main layout: Chat (left) + Calculator panel (right) */}
        <div className="grid lg:grid-cols-[1fr_400px] gap-6 items-start">
          {/* ══ LEFT: Chat Interface ══════════════════════════════════════════ */}
          <div
            className="bg-white dark:bg-neutral-900/60 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden flex flex-col"
            style={{ minHeight: '620px' }}
          >
            {/* Chat header bar */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-900/80">
              <div className="flex items-center gap-3">
                <img
                  src="/logo.png"
                  alt="LocaGo Virtual Agent"
                  className="w-9 h-9 rounded-lg object-contain bg-white dark:bg-neutral-800 p-1 border border-neutral-200 dark:border-neutral-800 shadow-sm flex-shrink-0"
                />
                <div>
                  <p className="font-bold text-neutral-900 dark:text-white text-sm tracking-tight">LocaGo Virtual Agent</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 font-mono flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                    {hasKey
                      ? (language === 'en' ? 'Online · Live Model' : 'Aktif · Asisten Digital')
                      : (language === 'en' ? 'Demo Consultation Mode' : 'Mode Konsultasi Demo')}
                  </p>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-neutral-400 dark:text-neutral-500">
                <span>locagocreative.my.id/consult</span>
              </div>
            </div>

            {/* Messages area */}
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-5 space-y-4" style={{ maxHeight: '490px', minHeight: '330px' }}>
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' && (
                    <img
                      src="/logo.png"
                      alt="LocaGo AI"
                      className="w-8 h-8 rounded-lg object-contain bg-white dark:bg-neutral-800 p-0.5 border border-neutral-200 dark:border-neutral-800 flex-shrink-0 mt-0.5 shadow-sm"
                    />
                  )}
                  <div className="max-w-[85%] space-y-2">
                    <div
                      className={`px-4 py-3 rounded-lg text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 ml-auto'
                          : 'bg-neutral-50 dark:bg-neutral-800/80 text-neutral-800 dark:text-neutral-200 border border-neutral-200/80 dark:border-neutral-700/60'
                      }`}
                    >
                      {renderPlainText(msg.content)}
                    </div>
                    {/* Inline WA button */}
                    {msg.role === 'assistant' && msg.waButton && (
                      <div className="space-y-1.5">
                        <button
                          onClick={() =>
                            msg.isErrorFallback && msg.userQuery
                              ? handleWhatsAppRedirect(
                                  language === 'en'
                                    ? `Hello Mas Fahmi (LocaGo Creative)! I was consulting on the website, but the AI system is currently busy. My question was: "${msg.userQuery}". Could you help advise on this?`
                                    : `Halo Mas Fahmi (LocaGo Creative)! Saya sedang konsultasi di website, tapi sistem AI sedang sibuk. Pertanyaan saya: "${msg.userQuery}". Mohon info dan solusinya ya Mas!`
                                )
                              : handleWhatsAppRedirect()
                          }
                          disabled={isSyncing}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-all active:scale-[0.98] shadow-sm cursor-pointer disabled:opacity-50"
                        >
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                          </svg>
                          <span>
                            {msg.isErrorFallback
                              ? (language === 'en' ? 'Chat Directly via WhatsApp' : 'Konsultasi Langsung via WhatsApp')
                              : (language === 'en' ? 'Lock Agreement on WhatsApp' : 'Kunci Kesepakatan di WhatsApp')}
                          </span>
                        </button>
                        {syncedTicket && (
                          <p className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                            <span>✓</span>{' '}
                            {language === 'en'
                              ? `Official Ticket #${syncedTicket} synced to system`
                              : `Tiket resmi #${syncedTicket} tersimpan di Google Sheet & sistem`}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-lg bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-xs flex-shrink-0 mt-0.5 font-bold font-mono text-neutral-700 dark:text-neutral-300">
                      U
                    </div>
                  )}
                </div>
              ))}

              {/* Typing indicator */}
              {loading && (
                <div className="flex gap-3 justify-start">
                  <img
                    src="/logo.png"
                    alt="LocaGo AI"
                    className="w-8 h-8 rounded-lg object-contain bg-white dark:bg-neutral-800 p-0.5 border border-neutral-200 dark:border-neutral-800 flex-shrink-0 shadow-sm animate-pulse"
                  />
                  <div className="bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 px-4 py-3 rounded-lg flex gap-1.5 items-center">
                    <div className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              )}
            </div>

            {/* Suggested consultation question prompts */}
            <div className="px-5 pt-2 pb-2 flex flex-wrap gap-2 border-t border-neutral-100 dark:border-neutral-800">
              {(language === 'en'
                ? [
                    'Cost estimate for an online store website',
                    'Automated WhatsApp AI Chatbot quote',
                    'School QR attendance & parent alert system',
                    'I have a small budget, what can we build?',
                  ]
                : [
                    'Berapa estimasi pembuatan website toko online?',
                    'Estimasi AI Chatbot WhatsApp otomatis',
                    'Sistem presensi QR sekolah & notif WA',
                    'Punya budget 500 ribu, bisa buat apa?',
                  ]
              ).map(p => (
                <button
                  key={p}
                  onClick={() => sendMessage(p)}
                  disabled={loading}
                  className="text-xs font-mono px-3 py-1.5 rounded-md bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:border-neutral-400 dark:hover:border-neutral-600 border border-neutral-200 dark:border-neutral-800 transition-all disabled:opacity-50"
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Input area */}
            <div className="p-4 flex gap-3 border-t border-neutral-100 dark:border-neutral-800">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                placeholder={
                  language === 'en'
                    ? 'Type your question or system requirements...'
                    : 'Ketik pertanyaan atau kebutuhan sistem Anda...'
                }
                disabled={loading}
                className="flex-1 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white placeholder-neutral-400 rounded-lg px-4 py-2.5 text-sm border border-neutral-200 dark:border-neutral-800 focus:border-neutral-500 focus:outline-none transition-all disabled:opacity-60"
              />
              <button
                onClick={() => sendMessage()}
                disabled={loading || !input.trim()}
                className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed text-white dark:text-neutral-950 rounded-lg font-medium text-sm transition-all active:scale-[0.98] flex items-center gap-2 flex-shrink-0"
              >
                <span>{language === 'en' ? 'Send' : 'Kirim'}</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* ══ RIGHT: Quick Calculator Panel ═════════════════════════════════ */}
          <div className="space-y-4 lg:sticky lg:top-28">
            <div className="bg-white dark:bg-neutral-900/60 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
              {/* Panel header */}
              <div className="px-5 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-900/80">
                <h3 className="font-bold text-neutral-900 dark:text-white text-sm tracking-tight flex items-center gap-2">
                  <svg className="w-4 h-4 text-neutral-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <span>{language === 'en' ? 'Quick Investment Estimator' : 'Kalkulator Estimasi Cepat'}</span>
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  {language === 'en'
                    ? 'Select criteria & budget → AI calculates tailored architecture'
                    : 'Pilih kriteria & budget → AI kalkulasikan arsitektur terbaik'}
                </p>
              </div>

              <div className="p-5 space-y-4">
                {/* Profile selection + Optional custom input */}
                <div>
                  <p className="text-xs font-mono font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-2">
                    {language === 'en' ? '01. Client Profile' : '01. Profil Klien'}
                  </p>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    {PROFILES.map(p => (
                      <button
                        key={p.value}
                        onClick={() => setSelectedProfile(prev => (prev === p.value ? '' : p.value))}
                        className={`px-3 py-2 rounded-lg border text-xs font-medium text-left transition-all duration-150 leading-tight ${
                          selectedProfile === p.value
                            ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-950'
                            : 'border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400 dark:hover:border-neutral-600 bg-neutral-50/50 dark:bg-neutral-800/40'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                  {/* Optional free-text profile */}
                  <input
                    type="text"
                    value={customProfile}
                    onChange={e => setCustomProfile(e.target.value)}
                    placeholder={
                      language === 'en'
                        ? 'Or describe your profile (optional)...'
                        : 'Atau deskripsikan profil Anda (opsional)...'
                    }
                    className="w-full bg-neutral-50/50 dark:bg-neutral-800/40 text-neutral-900 dark:text-white placeholder-neutral-400 text-xs rounded-lg px-3 py-2 border border-neutral-200 dark:border-neutral-800 focus:border-neutral-500 focus:outline-none transition-all"
                  />
                </div>

                {/* Feature selection + Optional custom feature */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-mono font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                      {language === 'en' ? '02. Target Features' : '02. Fitur yang Dibutuhkan'}
                    </p>
                    {selectedFeatures.length > 0 && (
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded border border-neutral-200 dark:border-neutral-700">
                        {selectedFeatures.length} {language === 'en' ? 'selected' : 'dipilih'}
                      </span>
                    )}
                  </div>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 mb-2">
                    {FEATURES.map(feat => (
                      <button
                        key={feat.id}
                        onClick={() => toggleFeature(feat.id)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg border text-left transition-all duration-150 ${
                          selectedFeatures.includes(feat.id)
                            ? 'border-neutral-900 bg-neutral-900/5 dark:bg-neutral-100/10 dark:border-neutral-400'
                            : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 bg-neutral-50/50 dark:bg-neutral-800/40'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-all ${
                            selectedFeatures.includes(feat.id)
                              ? 'bg-neutral-900 border-neutral-900 dark:bg-white dark:border-white text-white dark:text-neutral-950'
                              : 'border-neutral-300 dark:border-neutral-600'
                          }`}
                        >
                          {selectedFeatures.includes(feat.id) && (
                            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span
                          className={`text-xs font-medium ${
                            selectedFeatures.includes(feat.id)
                              ? 'text-neutral-900 dark:text-white font-semibold'
                              : 'text-neutral-600 dark:text-neutral-400'
                          }`}
                        >
                          {feat.label}
                        </span>
                      </button>
                    ))}
                  </div>
                  {/* Optional manual custom feature */}
                  <input
                    type="text"
                    value={customFeature}
                    onChange={e => setCustomFeature(e.target.value)}
                    placeholder={
                      language === 'en'
                        ? 'Other custom requirements (optional)...'
                        : 'Kebutuhan kustom lainnya (opsional)...'
                    }
                    className="w-full bg-neutral-50/50 dark:bg-neutral-800/40 text-neutral-900 dark:text-white placeholder-neutral-400 text-xs rounded-lg px-3 py-2 border border-neutral-200 dark:border-neutral-800 focus:border-neutral-500 focus:outline-none transition-all"
                  />
                </div>

                {/* 3. Budget input field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-xs font-mono font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                      {language === 'en' ? '03. Target Budget' : '03. Target Anggaran'}
                    </p>
                    <span className="text-[10px] font-mono text-neutral-400">
                      {language === 'en' ? 'Optional' : 'Opsional'}
                    </span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-xs font-mono font-bold text-neutral-400">Rp</span>
                    <input
                      type="text"
                      value={budget}
                      onChange={e => setBudget(e.target.value)}
                      placeholder={
                        language === 'en'
                          ? 'e.g. 1,500,000 (or type freely)'
                          : 'contoh: 1.500.000 (atau ketik bebas)'
                      }
                      className="w-full bg-neutral-50/50 dark:bg-neutral-800/40 text-neutral-900 dark:text-white placeholder-neutral-400 text-xs rounded-lg pl-8 pr-3 py-2 border border-neutral-200 dark:border-neutral-800 focus:border-neutral-500 focus:outline-none transition-all font-mono"
                    />
                  </div>
                  <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-1">
                    {language === 'en'
                      ? '*Whatever your budget, AI will tailor feature scope to make it viable.'
                      : '*Berapapun budget Anda, AI akan menyesuaikan skala fitur agar tetap dapat dibuat.'}
                  </p>
                </div>

                {/* CTA Button */}
                <button
                  onClick={handleQuickCalculate}
                  disabled={
                    loading ||
                    (!selectedProfile &&
                      !customProfile.trim() &&
                      selectedFeatures.length === 0 &&
                      !customFeature.trim() &&
                      !budget.trim())
                  }
                  className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed text-white dark:text-neutral-950 rounded-lg font-medium text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>{language === 'en' ? 'Calculate Estimate & Ask AI' : 'Hitung Estimasi & Tanya AI'}</span>
                </button>

                {/* Reset */}
                {(selectedProfile ||
                  customProfile ||
                  selectedFeatures.length > 0 ||
                  customFeature ||
                  budget) && (
                  <button
                    onClick={() => {
                      setSelectedProfile('');
                      setCustomProfile('');
                      setSelectedFeatures([]);
                      setCustomFeature('');
                      setBudget('');
                    }}
                    className="w-full text-xs font-mono text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                  >
                    {language === 'en' ? 'Reset all criteria' : 'Reset semua isian'}
                  </button>
                )}
              </div>
            </div>

            {/* Direct WA CTA */}
            <button
              onClick={() => handleWhatsAppRedirect(
                language === 'en'
                  ? 'Hello Mas Fahmi / LocaGo Creative! I would like to consult about software & system development 🚀'
                  : 'Halo Mas Fahmi / LocaGo Creative! Saya ingin konsultasi langsung tentang pembuatan sistem/software 🚀'
              )}
              disabled={isSyncing}
              className="flex items-center justify-center gap-2.5 w-full py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition-all active:scale-[0.98] shadow-sm cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              <span>{language === 'en' ? 'Direct WhatsApp Consultation' : 'Konsultasi Langsung via WhatsApp'}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIChatSection;
