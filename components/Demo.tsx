
import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

const WA_NUMBER = '62895336377648';
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const DEMO_QA: { trigger: string[]; response: string }[] = [
  {
    trigger: ['harga', 'biaya', 'berapa', 'cost', 'price', 'tarif'],
    response: 'Harga kami sangat fleksibel! 🎯 Mulai dari proyek sederhana untuk mahasiswa/perorangan hingga sistem enterprise untuk perusahaan. Kami tidak punya harga mati — semua berdasarkan fitur yang kamu butuhkan. Coba gunakan **Kalkulator Budget** di bawah untuk estimasi otomatis. Atau langsung konsultasi gratis via WhatsApp ya!'
  },
  {
    trigger: ['chatbot', 'whatsapp', 'bot', 'ai', 'otomasi', 'automation'],
    response: '🤖 Layanan AI Chatbot WhatsApp kami bisa:\n- Membalas pesan pelanggan 24/7 secara otomatis\n- Mengelola pesanan & FAQ\n- Integrasi dengan sistem inventory\n- Notifikasi proaktif ke pelanggan\n\nTersedia untuk bisnis kecil hingga korporat. Tertarik? Tanya lebih lanjut via WhatsApp!'
  },
  {
    trigger: ['sekolah', 'guru', 'absensi', 'presensi', 'qr', 'rps', 'rppp', 'tabungan'],
    response: '🏫 Untuk institusi pendidikan, kami punya:\n\n1. **Presensi QR Code + WA Alert** — Siswa scan QR, orang tua langsung dapat notifikasi WA\n2. **Tabungan Digital** — Kelola tabungan siswa dengan dashboard admin\n3. **AI Generator RPS** — Buat Rencana Pembelajaran otomatis dalam hitungan detik\n\nSemua sistem bisa dikustomisasi sesuai kebutuhan sekolah Anda! 📚'
  },
  {
    trigger: ['mahasiswa', 'tugas', 'skripsi', 'coding', 'script', 'gas', 'google apps'],
    response: '👨‍💻 Untuk mahasiswa & perorangan, kami siap bantu:\n\n- **Google Apps Script** — Otomasi spreadsheet, laporan, & integrasi data\n- **Bantuan Coding** — Debug, algoritma, tugas pemrograman\n- **Aplikasi Custom** — Desktop (Python/Electron) atau Android\n\nHarga sangat terjangkau untuk kantong mahasiswa! Diskusi dulu via WhatsApp gratis.'
  },
  {
    trigger: ['lama', 'berapa lama', 'waktu', 'durasi', 'selesai'],
    response: '⏱️ Estimasi waktu pengerjaan:\n\n- Landing Page sederhana: **3-5 hari kerja**\n- Website dengan fitur medium: **1-2 minggu**\n- Sistem kompleks (chatbot, dashboard): **2-4 minggu**\n- Proyek enterprise custom: **1-3 bulan**\n\nSemua tergantung kompleksitas fitur yang dipilih. Konsultasikan dulu biar lebih akurat!'
  },
];

function getDemoResponse(input: string): string {
  const lower = input.toLowerCase();
  for (const qa of DEMO_QA) {
    if (qa.trigger.some(t => lower.includes(t))) {
      return qa.response;
    }
  }
  return `Terima kasih sudah bertanya! 😊 Pertanyaan Anda tentang "${input}" akan kami jawab lebih detail via WhatsApp. Tim kami siap konsultasi gratis dan membantu menemukan solusi terbaik untuk kebutuhan digital Anda! 🚀`;
}

function formatMessage(text: string): React.ReactNode {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part.split('\n').map((line, j) => (
      <React.Fragment key={`${i}-${j}`}>
        {j > 0 && <br />}
        {line}
      </React.Fragment>
    ));
  });
}

const Demo: React.FC = () => {
  const { t } = useLanguage();
  const dt = (t as any).demo || {};
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: dt.chatWelcome || 'Halo! Saya asisten LocaGo Creative. Ada yang bisa saya bantu?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLiveMode, setIsLiveMode] = useState(!!GROQ_API_KEY && GROQ_API_KEY !== 'your_groq_api_key_here');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = { role: 'user', content: trimmed };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    if (isLiveMode) {
      // Live Groq AI mode
      try {
        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'llama-3.1-8b-instant',
            messages: [
              {
                role: 'system',
                content: `Kamu adalah asisten virtual LocaGo Creative, sebuah digital agency berbasis di Bandung, Indonesia. Layanan kami meliputi:
- Pembuatan Website (Landing Page, E-Commerce, Company Profile)
- WhatsApp AI Chatbot & Omnichannel Automation
- Sistem Sekolah (Presensi QR, Tabungan Digital, Generator RPS)
- Otomasi Google Apps Script & Google Sheets / Excel (Solusi hemat sistem/otomasi untuk budget di bawah 500k)
- Aplikasi Mobile & Desktop
- Bantuan Coding untuk Mahasiswa

Prinsip: Berapa pun anggarannya semuanya ada solusinya (Zero Rejection Policy).
Nomor WA: 62895336377648. Jawab dengan ramah, informatif, dan solutif. Gunakan bahasa Indonesia. Gunakan emoji secukupnya.`
              },
              ...messages.map(m => ({ role: m.role, content: m.content })),
              { role: 'user', content: trimmed }
            ],
            temperature: 0.7,
            max_tokens: 500,
          }),
        });
        const data = await res.json();
        const reply = data.choices?.[0]?.message?.content || 'Maaf, terjadi kesalahan. Silakan coba lagi.';
        setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
      } catch {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Maaf, koneksi AI terputus. Silakan hubungi kami via WhatsApp untuk konsultasi langsung! 📱' }]);
      }
    } else {
      // Demo mode with pre-loaded responses
      await new Promise(r => setTimeout(r, 800 + Math.random() * 700));
      const reply = getDemoResponse(trimmed);
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    }

    setLoading(false);
    inputRef.current?.focus();
  };

  const features: Array<{ title: string; desc: string; emoji: string }> = dt.features || [];

  return (
    <section id="demo" className="py-24 bg-slate-50 dark:bg-slate-900 relative overflow-hidden transition-colors duration-300">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-5"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
            {dt.badge || '⚡ Live Demo'}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            {dt.title || 'Coba Sistem AI Kami'} <span className="text-gradient">{dt.titleHighlight || 'Langsung Sekarang'}</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            {dt.description || 'Tanya apa saja tentang layanan kami.'}
          </p>
          {!isLiveMode && (
            <div className="mt-3 inline-block px-4 py-1.5 rounded-full bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs font-medium">
              {dt.demoMode || '🎭 Mode Demo — Tambahkan VITE_GROQ_API_KEY untuk AI live'}
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* === Chatbot === */}
          <div className="bg-white dark:bg-slate-800/60 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-xl dark:shadow-2xl">
            {/* Chat header */}
            <div className="flex items-center gap-3 p-5 border-b border-slate-100 dark:border-white/10 bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-600/20 dark:to-blue-600/20">
              <img
                src="/logo.png"
                alt="LocaGo AI Assistant"
                className="w-10 h-10 rounded-xl object-contain bg-white dark:bg-slate-900 p-1 border border-emerald-500/20 shadow-md"
              />
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-sm">LocaGo AI Assistant</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400">{isLiveMode ? 'Powered by Groq AI' : 'Demo Mode'}</p>
                </div>
              </div>
              <div className="ml-auto flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/60"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/60"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/60"></div>
              </div>
            </div>

            {/* Messages */}
            <div className="h-80 overflow-y-auto p-5 space-y-4 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-2`}>
                  {msg.role === 'assistant' && (
                    <img
                      src="/logo.png"
                      alt="LocaGo AI"
                      className="w-7 h-7 rounded-lg object-contain bg-white dark:bg-slate-800 p-0.5 border border-slate-200 dark:border-white/10 flex-shrink-0 mt-1 shadow-sm"
                    />
                  )}
                  <div className={`max-w-xs lg:max-w-sm px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-sm'
                      : 'bg-slate-100 dark:bg-slate-700/80 text-slate-700 dark:text-slate-200 rounded-bl-sm'
                  }`}>
                    {formatMessage(msg.content)}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start gap-2">
                  <img
                    src="/logo.png"
                    alt="LocaGo AI"
                    className="w-7 h-7 rounded-lg object-contain bg-white dark:bg-slate-800 p-0.5 border border-slate-200 dark:border-white/10 flex-shrink-0 shadow-sm animate-pulse"
                  />
                  <div className="bg-slate-100 dark:bg-slate-700/80 px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1 items-center">
                    <div className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested prompts */}
            <div className="px-5 pb-3 flex flex-wrap gap-2">
              {['Berapa harga chatbot WA?', 'Sistem presensi sekolah', 'Bantuan tugas coding'].map(p => (
                <button
                  key={p}
                  onClick={() => { setInput(p); inputRef.current?.focus(); }}
                  className="text-xs px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-emerald-100 dark:hover:bg-emerald-600/30 hover:text-emerald-700 dark:hover:text-emerald-300 border border-slate-200 dark:border-white/10 transition-all"
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-slate-100 dark:border-white/10 flex gap-3">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder={dt.chatPlaceholder || 'Tanya sesuatu...'}
                className="flex-1 bg-slate-50 dark:bg-slate-700/60 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-xl px-4 py-3 text-sm border border-slate-200 dark:border-white/10 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl font-semibold text-sm transition-all active:scale-95 flex items-center gap-2"
              >
                {dt.chatSend || 'Kirim'}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>

            {/* WA link */}
            <div className="px-4 pb-4">
              <a
                href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Halo LocaGo Creative! Saya ingin konsultasi langsung 🚀')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-50 dark:bg-green-600/20 border border-green-200 dark:border-green-500/30 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-600/30 text-sm font-semibold transition-all"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                Konsultasi Langsung via WhatsApp
              </a>
            </div>
          </div>

          {/* === Feature Demo Grid === */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{dt.featuresTitle || 'Kemampuan Sistem Kami'}</h3>
            <div className="grid grid-cols-2 gap-4">
              {features.map((feat, idx) => (
                <div
                  key={idx}
                  className="group relative rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800/50 hover:border-emerald-300 dark:hover:border-emerald-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/10 cursor-default shadow-sm"
                >
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/0 to-blue-600/0 group-hover:from-emerald-600/10 group-hover:to-blue-600/10 transition-all duration-500"></div>

                  {/* Animated top border */}
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  <div className="p-5">
                    {/* Mock screen */}
                    <div className="w-full h-24 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 mb-4 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 group-hover:from-emerald-500/20 group-hover:to-blue-500/20 transition-all duration-300"></div>
                      {/* Animated lines */}
                      <div className="absolute top-3 left-3 right-3 space-y-2">
                        <div className="h-1.5 bg-slate-400/40 dark:bg-slate-600/60 rounded w-3/4 animate-pulse"></div>
                        <div className="h-1.5 bg-slate-400/30 dark:bg-slate-600/40 rounded w-1/2 animate-pulse" style={{ animationDelay: '200ms' }}></div>
                        <div className="h-1.5 bg-slate-400/30 dark:bg-slate-600/40 rounded w-2/3 animate-pulse" style={{ animationDelay: '400ms' }}></div>
                      </div>
                      <span className="text-3xl relative z-10 group-hover:scale-110 transition-transform duration-300">{feat.emoji}</span>
                    </div>

                    <h4 className="font-bold text-slate-800 dark:text-white text-sm mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{feat.title}</h4>
                    <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4 pt-2">
              {[
                { value: '99+', label: 'Proyek Selesai' },
                { value: '24/7', label: 'Support AI' },
                { value: '80%', label: 'Hemat Waktu' },
              ].map(stat => (
                <div key={stat.label} className="text-center p-4 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-white/10 shadow-sm">
                  <p className="text-2xl font-black text-gradient mb-1">{stat.value}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Demo;
