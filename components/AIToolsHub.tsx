import React, { useState, useMemo, useEffect } from 'react';
import { AI_TOOLS_LIST } from '../lib/data';
import { AIToolItem } from '../types';

export interface CustomLinkItem {
  id: string;
  title: string;
  url: string;
  note?: string;
  createdAt?: string;
}

export interface LinkList {
  id: string;
  title: string;
  notes: string;
  videoUrl?: string;
  toolIds: string[];
  customLinks?: CustomLinkItem[];
  createdAt: string;
}

export const AIToolsHub: React.FC = () => {
  const [tools, setTools] = useState<AIToolItem[]>(AI_TOOLS_LIST);
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [selectedPricing, setSelectedPricing] = useState<string>('Semua');
  const [sortBy, setSortBy] = useState<'popular' | 'name'>('popular');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);

  // Modal Detail Tool (Full Preview)
  const [viewingTool, setViewingTool] = useState<AIToolItem | null>(null);

  // LinkList States
  const [linkLists, setLinkLists] = useState<LinkList[]>(() => {
    try {
      const saved = localStorage.getItem('locago_ai_linklists');
      if (saved) return JSON.parse(saved);
    } catch {}
    // Default starter list for Mas Fahmi
    return [
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
        createdAt: '04 Nov 2026'
      }
    ];
  });

  const [activeLinkListId, setActiveLinkListId] = useState<string | null>(null);
  const [isLinkListManagerOpen, setIsLinkListManagerOpen] = useState<boolean>(false);
  const [toolToAddToLinkList, setToolToAddToLinkList] = useState<AIToolItem | null>(null);
  const [isCreateListModalOpen, setIsCreateListModalOpen] = useState<boolean>(false);
  const [newListForm, setNewListForm] = useState({ title: '', notes: '', videoUrl: '' });

  // Edit LinkList & Manual Custom Link States
  const [editingLinkList, setEditingLinkList] = useState<LinkList | null>(null);
  const [isAddCustomLinkModalOpen, setIsAddCustomLinkModalOpen] = useState<boolean>(false);
  const [customLinkForm, setCustomLinkForm] = useState({ title: '', url: '', note: '' });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Robust tool matching helper (matches by exact ID, normalized slug, or tool name)
  const isToolInList = (tool: AIToolItem, toolIds: string[]): boolean => {
    if (!tool || !toolIds || toolIds.length === 0) return false;
    const clean = (s: string) => (s || '').toLowerCase().replace(/^(tool-|ai-)/, '').replace(/[^a-z0-9]/g, '');
    const tId = clean(tool.id || '');
    const tName = clean(tool.name || '');
    return toolIds.some((id) => {
      if (!id) return false;
      if (id === tool.id) return true;
      const cleanId = clean(id);
      if (!cleanId) return false;
      return (
        cleanId === tId ||
        cleanId === tName ||
        (cleanId.length >= 4 && (tId.includes(cleanId) || cleanId.includes(tId))) ||
        (cleanId.length >= 4 && (tName.includes(cleanId) || cleanId.includes(tName)))
      );
    });
  };

  // Sync LinkLists to localStorage & Supabase
  const saveLinkLists = (updated: LinkList[]) => {
    setLinkLists(updated);
    try {
      localStorage.setItem('locago_ai_linklists', JSON.stringify(updated));
    } catch {}

    // Cloud backup to Supabase (if configured)
    try {
      const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_H-meffsrYDjKI6UuwybniA_EsyPmg46';
      fetch('https://mnxbnddjmkruzabhlrtq.supabase.co/rest/v1/kb_briefs', {
        method: 'POST',
        headers: {
          'apikey': anonKey,
          'Authorization': `Bearer ${anonKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          category: 'linklist_backup',
          topic: `LinkLists Backup (${updated.length} collections)`,
          keywords: ['linklists', 'backup', 'instagram_cta'],
          content: JSON.stringify(updated)
        })
      }).catch(() => {});
    } catch {}
  };

  // Handle URL hash for shared LinkLists (e.g. #linklist=list-konten-ig-desain-video)
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.includes('linklist=')) {
        const id = hash.split('linklist=')[1]?.split('&')[0];
        if (id) {
          setActiveLinkListId(id);
          const el = document.getElementById('ai-tools');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Fetch live tools
  useEffect(() => {
    fetch('/ai_tools_live.json?t=' + Date.now())
      .then((res) => {
        if (!res.ok) throw new Error('Live JSON not found');
        return res.json();
      })
      .then((data) => {
        if (data.items && data.items.length > 0) {
          setTools(data.items);
        }
      })
      .catch(() => {});
  }, []);

  // Form submission state
  const [submitForm, setSubmitForm] = useState({
    toolName: '',
    websiteUrl: '',
    category: 'AI Coding',
    pricing: 'Freemium',
    description: '',
    contactWa: '',
    isFeaturedRequest: false
  });
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  // Upvotes state stored in localStorage
  const [upvotes, setUpvotes] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('locago_ai_upvotes');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [userVoted, setUserVoted] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('locago_ai_uservoted');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [views, setViews] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('locago_ai_views');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const appendUtm = (rawUrl?: string, toolName?: string) => {
    if (!rawUrl || typeof rawUrl !== 'string' || !rawUrl.startsWith('http')) return '#';
    const slug = (toolName || 'tool').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    try {
      const u = new URL(rawUrl);
      u.searchParams.set('utm_source', 'locagocreative');
      u.searchParams.set('utm_medium', 'directory');
      u.searchParams.set('utm_campaign', 'ai_tools_hub');
      u.searchParams.set('utm_content', slug);
      return u.toString();
    } catch {
      const sep = rawUrl.includes('?') ? '&' : '?';
      return `${rawUrl}${sep}utm_source=locagocreative&utm_medium=directory&utm_campaign=ai_tools_hub&utm_content=${slug}`;
    }
  };

  const trackClick = (toolId?: string) => {
    if (!toolId) return;
    const current = views[toolId] || 0;
    const nextViews = { ...views, [toolId]: current + 1 };
    setViews(nextViews);
    try {
      localStorage.setItem('locago_ai_views', JSON.stringify(nextViews));
    } catch {}
  };

  const categories = [
    'Semua',
    'Automation & No-Code',
    'Voice & Audio AI',
    'AI Writing & SEO',
    'Video & Graphics',
    'AI Coding'
  ];

  const pricingModels = ['Semua', 'Freemium', 'Free Trial', 'Paid'];

  const toggleUpvote = (id?: string) => {
    if (!id) return;
    const isVoted = userVoted[id];
    const safeStr = String(id);
    const defaultVal = 12 + (safeStr.charCodeAt(safeStr.length - 1) % 40);
    const current = upvotes[id] !== undefined ? upvotes[id] : defaultVal;
    const nextCount = isVoted ? current - 1 : current + 1;
    const nextUpvotes = { ...upvotes, [id]: Math.max(0, nextCount) };
    const nextVoted = { ...userVoted, [id]: !isVoted };

    setUpvotes(nextUpvotes);
    setUserVoted(nextVoted);

    try {
      localStorage.setItem('locago_ai_upvotes', JSON.stringify(nextUpvotes));
      localStorage.setItem('locago_ai_uservoted', JSON.stringify(nextVoted));
    } catch {}
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      setIsSubmitModalOpen(false);
      const msg = encodeURIComponent(
        `Halo LocaGo Creative! Saya ingin submit tool AI baru ke AI Tool Library:\n\n• Nama Tool: ${submitForm.toolName}\n• Website: ${submitForm.websiteUrl}\n• Kategori: ${submitForm.category}\n• Model Harga: ${submitForm.pricing}\n• Paket: ${submitForm.isFeaturedRequest ? 'VIP Featured Listing' : 'Standard Free Review'}`
      );
      window.open(`https://wa.me/6285189393354?text=${msg}`, '_blank');
    }, 1200);
  };

  // Active LinkList object
  const activeLinkList = useMemo(() => {
    if (!activeLinkListId) return null;
    return linkLists.find((l) => l.id === activeLinkListId) || null;
  }, [activeLinkListId, linkLists]);

  const toggleToolInLinkList = (listId: string, toolId: string) => {
    const clean = (s: string) => (s || '').toLowerCase().replace(/^(tool-|ai-)/, '').replace(/[^a-z0-9]/g, '');
    const cToolId = clean(toolId);
    const updated = linkLists.map((list) => {
      if (list.id === listId) {
        const exists = list.toolIds.some((id) => id === toolId || clean(id) === cToolId);
        const newToolIds = exists
          ? list.toolIds.filter((id) => id !== toolId && clean(id) !== cToolId)
          : [...list.toolIds, toolId];
        return { ...list, toolIds: newToolIds };
      }
      return list;
    });
    saveLinkLists(updated);
    showToast('Koleksi LinkList berhasil diperbarui!');
  };

  const handleCreateNewList = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListForm.title.trim()) return;
    const slug = newListForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newList: LinkList = {
      id: `list-${slug}-${Date.now().toString().slice(-4)}`,
      title: newListForm.title.trim(),
      notes: newListForm.notes.trim(),
      videoUrl: newListForm.videoUrl.trim() || undefined,
      toolIds: toolToAddToLinkList ? [toolToAddToLinkList.id] : [],
      customLinks: [],
      createdAt: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
    };
    saveLinkLists([newList, ...linkLists]);
    setNewListForm({ title: '', notes: '', videoUrl: '' });
    setIsCreateListModalOpen(false);
    showToast(`LinkList "${newList.title}" berhasil dibuat!`);
  };

  // Save changes from Edit LinkList modal
  const handleSaveEditedLinkList = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLinkList) return;
    const updated = linkLists.map((item) =>
      item.id === editingLinkList.id ? editingLinkList : item
    );
    saveLinkLists(updated);
    setEditingLinkList(null);
    showToast('✅ Catatan dan info LinkList berhasil disimpan!');
  };

  // Add a manual custom link to active or specified list
  const handleAddCustomLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customLinkForm.title.trim() || !customLinkForm.url.trim()) return;

    let targetUrl = customLinkForm.url.trim();
    if (!/^https?:\/\//i.test(targetUrl)) {
      targetUrl = 'https://' + targetUrl;
    }

    const targetListId = editingLinkList ? editingLinkList.id : activeLinkListId;
    if (!targetListId) return;

    const newCustomItem: CustomLinkItem = {
      id: `custom-${Date.now().toString().slice(-6)}`,
      title: customLinkForm.title.trim(),
      url: targetUrl,
      note: customLinkForm.note.trim() || undefined,
      createdAt: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })
    };

    const updated = linkLists.map((item) => {
      if (item.id === targetListId) {
        const existingLinks = item.customLinks || [];
        return {
          ...item,
          customLinks: [...existingLinks, newCustomItem]
        };
      }
      return item;
    });

    saveLinkLists(updated);

    // If currently editing inside modal, update the local editing state too
    if (editingLinkList && editingLinkList.id === targetListId) {
      setEditingLinkList({
        ...editingLinkList,
        customLinks: [...(editingLinkList.customLinks || []), newCustomItem]
      });
    }

    setCustomLinkForm({ title: '', url: '', note: '' });
    setIsAddCustomLinkModalOpen(false);
    showToast(`✅ Link manual "${newCustomItem.title}" berhasil ditambahkan!`);
  };

  // Remove a manual custom link
  const handleRemoveCustomLink = (listId: string, customLinkId: string) => {
    const updated = linkLists.map((item) => {
      if (item.id === listId) {
        return {
          ...item,
          customLinks: (item.customLinks || []).filter((cl) => cl.id !== customLinkId)
        };
      }
      return item;
    });
    saveLinkLists(updated);

    if (editingLinkList && editingLinkList.id === listId) {
      setEditingLinkList({
        ...editingLinkList,
        customLinks: (editingLinkList.customLinks || []).filter((cl) => cl.id !== customLinkId)
      });
    }

    showToast('Tautan manual dihapus dari LinkList.');
  };

  // Delete an entire LinkList
  const handleDeleteLinkList = (listId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus LinkList ini?')) return;
    const updated = linkLists.filter((l) => l.id !== listId);
    saveLinkLists(updated);
    if (activeLinkListId === listId) {
      setActiveLinkListId(null);
      window.location.hash = 'ai-tools';
    }
    if (editingLinkList?.id === listId) {
      setEditingLinkList(null);
    }
    showToast('LinkList berhasil dihapus.');
  };

  const copyShareLink = (listId: string) => {
    const url = `${window.location.origin}/#linklist=${listId}`;
    navigator.clipboard.writeText(url);
    showToast('✅ Tautan LinkList berhasil disalin! Siap dikirim ke DM Instagram!');
  };

  // Filter tools
  const filteredAndSortedTools = useMemo(() => {
    let baseList = tools || [];

    // If an active LinkList is selected, display all tools belonging to that LinkList!
    if (activeLinkList) {
      baseList = baseList.filter((tool) => isToolInList(tool, activeLinkList.toolIds));
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        baseList = baseList.filter((tool) =>
          (tool.name || '').toLowerCase().includes(q) ||
          (tool.tagline || '').toLowerCase().includes(q) ||
          (tool.description || '').toLowerCase().includes(q)
        );
      }
      return baseList;
    }

    return baseList.filter((tool) => {
      if (!tool) return false;
      const matchCat = selectedCategory === 'Semua' || tool.category === selectedCategory;
      const matchPricing = selectedPricing === 'Semua' || tool.pricingType === selectedPricing;
      const searchLower = (searchQuery || '').toLowerCase();
      const matchSearch =
        (tool.name || '').toLowerCase().includes(searchLower) ||
        (tool.tagline || '').toLowerCase().includes(searchLower) ||
        (tool.description || '').toLowerCase().includes(searchLower) ||
        (tool.category || '').toLowerCase().includes(searchLower);
      return matchCat && matchPricing && matchSearch;
    }).sort((a, b) => {
      if (!a || !b) return 0;
      if (sortBy === 'popular') {
        const votesA = (a.id && upvotes[a.id] !== undefined) ? upvotes[a.id] : 20;
        const votesB = (b.id && upvotes[b.id] !== undefined) ? upvotes[b.id] : 20;
        return votesB - votesA;
      }
      if (sortBy === 'name') {
        return (a.name || '').localeCompare(b.name || '');
      }
      return 0;
    });
  }, [tools, activeLinkList, selectedCategory, selectedPricing, searchQuery, sortBy, upvotes]);

  return (
    <section id="ai-tools" className="pt-28 pb-24 bg-neutral-50/60 dark:bg-neutral-950 text-neutral-900 dark:text-white min-h-screen relative overflow-hidden transition-colors duration-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-purple-600 text-white font-mono text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <span>✨</span>
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header Library */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 text-purple-800 dark:text-purple-400 text-xs font-mono font-medium mb-4">
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            <span>AI Tool Directory & Software Intelligence Library</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-neutral-900 dark:text-white">
            AI Tool Library & Direktori Software
          </h1>
          <p className="mt-4 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Perpustakaan kurasi kecerdasan buatan, engine otomatisasi no-code, dan model AI paling produktif untuk mempercepat pertumbuhan bisnis dan proyek Anda.
          </p>

          {/* Quick Action Badges: LinkList & Submit (Private CSV download is hidden from public) */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setIsLinkListManagerOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <span>🗂️</span>
              <span>Koleksi LinkList ({linkLists.length})</span>
            </button>

            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-neutral-900 dark:bg-neutral-800 hover:bg-neutral-800 dark:hover:bg-neutral-700 text-white text-xs font-mono font-bold transition-all border border-neutral-700/80 flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <span>+</span>
              <span>Submit Tool Baru</span>
            </button>
          </div>
        </div>

        {/* ACTIVE LINKLIST CURATION BANNER (If viewing a shared/filtered list) */}
        {activeLinkList && (
          <div className="mb-8 p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-purple-900/40 via-purple-950/60 to-neutral-900 border-2 border-purple-500/40 text-white shadow-2xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-purple-500/20 pb-4 mb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-purple-500/30 text-purple-300 border border-purple-400/30 uppercase tracking-wider">
                  📂 Kurasi Playlist Khusus Konten
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold mt-2 text-white">
                  {activeLinkList.title}
                </h2>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {/* Edit LinkList & Notes Button */}
                <button
                  onClick={() => setEditingLinkList({ ...activeLinkList })}
                  className="px-3.5 py-2 rounded-xl bg-purple-700/80 hover:bg-purple-600 text-white font-mono text-xs font-bold transition-all border border-purple-400/40 shadow-sm flex items-center gap-1.5 cursor-pointer active:scale-95"
                  title="Edit Judul, Catatan, Video, dan Link"
                >
                  <span>✏️</span>
                  <span>Edit Catatan & Info</span>
                </button>

                {/* Add Manual Link Button */}
                <button
                  onClick={() => setIsAddCustomLinkModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer active:scale-95"
                  title="Tambah Tautan Manual Custom ke Playlist ini"
                >
                  <span>+</span>
                  <span>Tambah Link Manual</span>
                </button>

                {/* Share Link Button */}
                <button
                  onClick={() => copyShareLink(activeLinkList.id)}
                  className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <span>🔗</span>
                  <span>Salin Link Share IG</span>
                </button>

                {/* Close Playlist */}
                <button
                  onClick={() => {
                    setActiveLinkListId(null);
                    window.location.hash = 'ai-tools';
                  }}
                  className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white font-mono text-xs transition-all border border-neutral-700 cursor-pointer"
                >
                  ✕ Tutup Playlist
                </button>
              </div>
            </div>

            {/* Notes Section with Inline Edit */}
            <div className="p-4 rounded-2xl bg-neutral-900/70 border border-purple-500/20 text-neutral-300 text-xs sm:text-sm leading-relaxed mb-4">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <strong className="text-purple-400 font-mono block">📝 Catatan Khusus dari Mas Fahmi:</strong>
                <button
                  onClick={() => setEditingLinkList({ ...activeLinkList })}
                  className="text-[11px] font-mono text-purple-300 hover:text-purple-200 underline cursor-pointer"
                >
                  ✏️ Edit Catatan
                </button>
              </div>
              {activeLinkList.notes ? (
                <p className="whitespace-pre-line text-neutral-200">{activeLinkList.notes}</p>
              ) : (
                <p className="text-neutral-500 italic text-xs">Belum ada catatan. Klik tombol edit di atas untuk menambahkan catatan bagi audiens Anda.</p>
              )}
            </div>

            {/* Video Reference */}
            {activeLinkList.videoUrl && (
              <div className="text-xs font-mono text-purple-300 flex items-center gap-2 mb-4">
                <span>📹 Tonton Video Referensi:</span>
                <a
                  href={activeLinkList.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 underline font-bold hover:text-purple-300 break-all"
                >
                  Buka Tautan Video ({activeLinkList.videoUrl}) ↗
                </a>
              </div>
            )}

            {/* Manual Custom Links in Banner */}
            {activeLinkList.customLinks && activeLinkList.customLinks.length > 0 && (
              <div className="pt-3 border-t border-purple-500/20">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-mono font-bold text-purple-300 uppercase tracking-wider">
                    🔗 Tautan & Referensi Tambahan ({activeLinkList.customLinks.length}):
                  </span>
                  <button
                    onClick={() => setIsAddCustomLinkModalOpen(true)}
                    className="text-[11px] font-mono text-emerald-400 hover:text-emerald-300 underline cursor-pointer"
                  >
                    + Tambah Lagi
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {activeLinkList.customLinks.map((cl) => (
                    <div
                      key={cl.id}
                      className="p-3 rounded-xl bg-neutral-900/90 border border-purple-500/30 flex items-start justify-between gap-2 text-xs"
                    >
                      <div className="overflow-hidden">
                        <h4 className="font-bold text-white truncate">{cl.title}</h4>
                        {cl.note && <p className="text-[11px] text-neutral-400 line-clamp-1 mt-0.5">{cl.note}</p>}
                        <a
                          href={cl.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-mono text-purple-400 hover:text-purple-300 underline inline-flex items-center gap-1 mt-1 font-semibold"
                        >
                          <span>Kunjungi Tautan</span>
                          <span>↗</span>
                        </a>
                      </div>
                      <button
                        onClick={() => handleRemoveCustomLink(activeLinkList.id, cl.id)}
                        className="text-neutral-500 hover:text-rose-400 text-xs px-1 cursor-pointer shrink-0"
                        title="Hapus tautan ini"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Filter Controls Box */}
        <div className="bg-white dark:bg-neutral-900/90 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-4 sm:p-5 mb-8 shadow-sm dark:shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-neutral-100 dark:border-neutral-800/80 pb-4">
            <div className="relative w-full sm:w-96">
              <input
                type="text"
                placeholder="Cari tool AI, nama, atau kata kunci..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-neutral-400"
              />
              <span className="absolute left-3.5 top-3 text-neutral-400 text-xs">🔍</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <select
                value={selectedPricing}
                onChange={(e) => setSelectedPricing(e.target.value)}
                className="px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-700 dark:text-neutral-300 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
              >
                {pricingModels.map((p) => (
                  <option key={p} value={p}>{p === 'Semua' ? 'Semua Harga' : p}</option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'popular' | 'name')}
                className="px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-700 dark:text-neutral-300 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
              >
                <option value="popular">Terpopuler (Upvotes)</option>
                <option value="name">Nama (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Category Chips Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-purple-600 text-white font-bold shadow-sm'
                    : 'bg-neutral-100 dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
                }`}
              >
                {cat}
              </button>
            ))}

            <div className="ml-auto text-[11px] font-mono text-neutral-500 shrink-0">
              Menampilkan <strong className="text-purple-600 dark:text-purple-400">{filteredAndSortedTools.length}</strong> alat
            </div>
          </div>
        </div>

        {/* AI Tools Grid ala Futurepedia */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedTools.map((tool) => {
            const voteVal = upvotes[tool.id] !== undefined ? upvotes[tool.id] : 18;
            const hasVoted = !!userVoted[tool.id];

            return (
              <div
                key={tool.id}
                onClick={() => setViewingTool(tool)}
                className="group p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 hover:border-purple-500/40 transition-all duration-200 hover:shadow-xl flex flex-col justify-between cursor-pointer"
              >
                <div>
                  {/* Card Header with Real Logo */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      {tool.logoUrl ? (
                        <img
                          src={tool.logoUrl}
                          alt={tool.name}
                          className="w-10 h-10 rounded-xl object-contain p-1 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm shrink-0"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/30 text-purple-700 dark:text-purple-400 flex items-center justify-center font-bold text-base font-mono shrink-0">
                          {(tool.name || 'AI').charAt(0)}
                        </div>
                      )}
                      <div>
                        <h3 className="font-bold text-lg text-neutral-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors flex items-center gap-1.5">
                          <span>{tool.name || 'AI Tool'}</span>
                          {tool.isFeatured && (
                            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30">
                              PRO
                            </span>
                          )}
                        </h3>
                        <span className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400">{tool.category || 'Tools'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                      {/* Add to LinkList Button (+) */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setToolToAddToLinkList(tool);
                        }}
                        className="px-2 py-1 rounded-lg text-xs font-mono font-bold bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 hover:bg-purple-600 hover:text-white transition-all flex items-center gap-1 cursor-pointer"
                        title="Tambahkan ke LinkList Koleksi IG"
                      >
                        <span>+</span>
                        <span className="hidden sm:inline">List</span>
                      </button>

                      {/* Pricing Tag */}
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
                        {tool.pricingType}
                      </span>

                      {/* Upvote Button */}
                      <button
                        onClick={() => toggleUpvote(tool.id)}
                        className={`px-2 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer border flex items-center gap-1 ${
                          hasVoted
                            ? 'bg-rose-50 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-300 dark:border-rose-500/40'
                            : 'bg-neutral-50 dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 hover:text-neutral-900 dark:hover:text-white'
                        }`}
                        title="Upvote tool ini"
                      >
                        <span>{hasVoted ? '❤️' : '🤍'}</span>
                        <span>{voteVal}</span>
                      </button>
                    </div>
                  </div>

                  <h4 className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 leading-snug mb-2 line-clamp-1">
                    {tool.tagline}
                  </h4>

                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed line-clamp-3 mb-4">
                    {tool.description}
                  </p>

                  {/* Feature Highlights */}
                  {tool.features && tool.features.length > 0 && (
                    <ul className="space-y-1 mb-5">
                      {tool.features.slice(0, 3).map((feat, idx) => (
                        <li key={idx} className="text-[11px] text-neutral-500 dark:text-neutral-400 flex items-start gap-1.5">
                          <span className="text-purple-500 font-bold shrink-0">✓</span>
                          <span className="line-clamp-1">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Card Footer */}
                <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between gap-3" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-2">
                    <div className="text-[11px] font-mono text-neutral-500 flex items-center gap-1">
                      <span>👁️</span>
                      <span>{(views[tool.id] || (120 + tool.name.length * 15))} views</span>
                    </div>

                    {/* If viewing inside active LinkList: Provide 1-click Remove button */}
                    {activeLinkList && (
                      <button
                        onClick={() => toggleToolInLinkList(activeLinkList.id, tool.id)}
                        className="px-2 py-0.5 rounded text-[10px] font-mono text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 transition-all cursor-pointer"
                        title="Hapus tool ini dari playlist aktif"
                      >
                        ✕ Hapus dari List
                      </button>
                    )}
                  </div>

                  <a
                    href={appendUtm(tool.websiteUrl || tool.affiliateUrl, tool.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackClick(tool.id)}
                    className="py-2 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold transition-all shadow-sm active:scale-95 flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Kunjungi {tool.name}</span>
                    <span>↗</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* MODAL 1: FULL PREVIEW POPUP DETAIL TOOL */}
        {viewingTool && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto text-neutral-900 dark:text-white">
              <button
                onClick={() => setViewingTool(null)}
                className="absolute top-5 right-5 text-neutral-400 hover:text-neutral-900 dark:hover:text-white font-mono text-xl cursor-pointer"
              >
                ✕
              </button>

              <div className="flex items-center gap-4 mb-5">
                {viewingTool.logoUrl ? (
                  <img
                    src={viewingTool.logoUrl}
                    alt={viewingTool.name}
                    className="w-14 h-14 rounded-2xl object-contain p-1.5 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 flex items-center justify-center font-bold text-2xl font-mono shrink-0">
                    {viewingTool.name.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300">
                      {viewingTool.category}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                      {viewingTool.pricingType}
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold">{viewingTool.name}</h2>
                </div>
              </div>

              {/* Tagline */}
              <div className="mb-4 p-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/40 text-purple-900 dark:text-purple-200 font-medium text-sm leading-relaxed">
                💡 {viewingTool.tagline}
              </div>

              {/* Full Narrative Description */}
              <div className="space-y-3 mb-6 text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-line">
                <strong className="text-xs font-mono font-bold text-neutral-500 uppercase tracking-wider block">
                  📖 Ulasan Lengkap & Fungsionalitas Riil:
                </strong>
                <p>{viewingTool.description}</p>
              </div>

              {/* Features List */}
              {viewingTool.features && viewingTool.features.length > 0 && (
                <div className="mb-6">
                  <strong className="text-xs font-mono font-bold text-neutral-500 uppercase tracking-wider block mb-2">
                    ⚡ Fitur Utama & Keunggulan:
                  </strong>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {viewingTool.features.map((feat, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs flex items-start gap-2">
                        <span className="text-purple-500 font-bold shrink-0">✓</span>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons in Modal */}
              <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  onClick={() => {
                    setToolToAddToLinkList(viewingTool);
                    setViewingTool(null);
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>+</span>
                  <span>Tambahkan ke LinkList</span>
                </button>

                <a
                  href={appendUtm(viewingTool.websiteUrl || viewingTool.affiliateUrl, viewingTool.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <span>Buka Website Resmi {viewingTool.name}</span>
                  <span>↗</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 2: ADD TO LINKLIST SELECTOR */}
        {toolToAddToLinkList && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative text-neutral-900 dark:text-white">
              <button
                onClick={() => setToolToAddToLinkList(null)}
                className="absolute top-5 right-5 text-neutral-400 hover:text-white font-mono text-xl cursor-pointer"
              >
                ✕
              </button>

              <h3 className="text-lg font-bold mb-1">
                Tambahkan ke LinkList
              </h3>
              <p className="text-xs text-neutral-500 font-mono mb-4">
                Pilih LinkList tujuan untuk <strong className="text-purple-600 dark:text-purple-400">{toolToAddToLinkList.name}</strong>:
              </p>

              <div className="space-y-2.5 max-h-60 overflow-y-auto mb-5 pr-1">
                {linkLists.map((list) => {
                  const inList = isToolInList(toolToAddToLinkList, list.toolIds);
                  return (
                    <div
                      key={list.id}
                      onClick={() => toggleToolInLinkList(list.id, toolToAddToLinkList.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        inList
                          ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-500 text-purple-900 dark:text-purple-200'
                          : 'bg-neutral-50 dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 hover:border-neutral-300'
                      }`}
                    >
                      <div>
                        <h4 className="text-xs font-bold">{list.title}</h4>
                        <span className="text-[10px] font-mono text-neutral-500">
                          {tools.filter((t) => isToolInList(t, list.toolIds)).length} tool • {(list.customLinks || []).length} link manual
                        </span>
                      </div>
                      <span className={`px-2 py-1 rounded text-[11px] font-mono font-bold ${inList ? 'bg-purple-600 text-white' : 'bg-neutral-200 dark:bg-neutral-800'}`}>
                        {inList ? '✓ Ada' : '+ Tambah'}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                <button
                  onClick={() => setIsCreateListModalOpen(true)}
                  className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
                >
                  + Buat LinkList Baru
                </button>
                <button
                  onClick={() => setToolToAddToLinkList(null)}
                  className="px-4 py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-mono text-xs font-bold cursor-pointer"
                >
                  Selesai
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 3: CREATE NEW LINKLIST */}
        {isCreateListModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative text-neutral-900 dark:text-white">
              <button
                onClick={() => setIsCreateListModalOpen(false)}
                className="absolute top-5 right-5 text-neutral-400 hover:text-white font-mono text-xl cursor-pointer"
              >
                ✕
              </button>

              <h3 className="text-xl font-bold mb-2">Buat LinkList Baru (Koleksi IG)</h3>
              <p className="text-xs text-neutral-500 mb-6 font-mono">
                Buat satu tautan khusus untuk membagikan daftar tool pilihan di konten Instagram atau media sosial.
              </p>

              <form onSubmit={handleCreateNewList} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Nama LinkList (Judul Playlist) *
                  </label>
                  <input
                    type="text"
                    required
                    value={newListForm.title}
                    onChange={(e) => setNewListForm({ ...newListForm, title: e.target.value })}
                    placeholder="Contoh: 5 Tool AI Wajib Freelancer 2026"
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Catatan / Notes untuk Audiens (Bisa Diedit Kapan Saja)
                  </label>
                  <textarea
                    rows={3}
                    value={newListForm.notes}
                    onChange={(e) => setNewListForm({ ...newListForm, notes: e.target.value })}
                    placeholder="Contoh: Ini daftar tool dari reels hari ini ya guys. Klik link untuk coba gratis!"
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Tautan Video IG Reels / Shorts / YouTube (Opsional)
                  </label>
                  <input
                    type="url"
                    value={newListForm.videoUrl}
                    onChange={(e) => setNewListForm({ ...newListForm, videoUrl: e.target.value })}
                    placeholder="https://www.instagram.com/reel/..."
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsCreateListModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-mono border border-neutral-300 dark:border-neutral-700 cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold transition-all shadow-md cursor-pointer"
                  >
                    Simpan LinkList →
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 4: EDIT LINKLIST (TITLE, NOTES, VIDEO & CUSTOM LINKS) */}
        {editingLinkList && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl relative text-neutral-900 dark:text-white my-8 max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setEditingLinkList(null)}
                className="absolute top-5 right-5 text-neutral-400 hover:text-white font-mono text-xl cursor-pointer"
              >
                ✕
              </button>

              <h3 className="text-xl font-bold mb-1">✏️ Edit Catatan & Info LinkList</h3>
              <p className="text-xs text-neutral-500 mb-6 font-mono">
                Perbarui judul, catatan penjelasan untuk audiens, tautan video, atau kelola link manual.
              </p>

              <form onSubmit={handleSaveEditedLinkList} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Judul Playlist / LinkList *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingLinkList.title}
                    onChange={(e) => setEditingLinkList({ ...editingLinkList, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Catatan Khusus untuk Audiens (Edit Sesuka Hati)
                  </label>
                  <textarea
                    rows={4}
                    value={editingLinkList.notes || ''}
                    onChange={(e) => setEditingLinkList({ ...editingLinkList, notes: e.target.value })}
                    placeholder="Tuliskan catatan panduan, tips pemakaian, atau pengantar video..."
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-purple-500 resize-y"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Tautan Video IG Reels / Shorts / YouTube
                  </label>
                  <input
                    type="url"
                    value={editingLinkList.videoUrl || ''}
                    onChange={(e) => setEditingLinkList({ ...editingLinkList, videoUrl: e.target.value })}
                    placeholder="https://www.instagram.com/reel/..."
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Custom Links Management inside Edit Modal */}
                <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-neutral-700 dark:text-neutral-300">
                      🔗 Tautan Manual ({editingLinkList.customLinks?.length || 0})
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsAddCustomLinkModalOpen(true)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-[11px] font-bold cursor-pointer transition-all"
                    >
                      + Tambah Link Manual
                    </button>
                  </div>

                  {(!editingLinkList.customLinks || editingLinkList.customLinks.length === 0) ? (
                    <p className="text-[11px] font-mono text-neutral-500 italic py-2">
                      Belum ada tautan manual custom. Anda bisa menambahkan link Google Form, WhatsApp, grup Telegram, atau URL produk lain.
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                      {editingLinkList.customLinks.map((cl) => (
                        <div
                          key={cl.id}
                          className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-2 text-xs"
                        >
                          <div className="truncate">
                            <span className="font-bold">{cl.title}</span>
                            <span className="text-[10px] text-neutral-500 font-mono block truncate">{cl.url}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveCustomLink(editingLinkList.id, cl.id)}
                            className="px-2 py-1 text-rose-500 hover:text-rose-400 font-mono text-xs cursor-pointer"
                          >
                            Hapus
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => handleDeleteLinkList(editingLinkList.id)}
                    className="text-xs font-mono text-rose-500 hover:underline cursor-pointer"
                  >
                    🗑️ Hapus Playlist Ini
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingLinkList(null)}
                      className="px-4 py-2 rounded-xl text-xs font-mono border border-neutral-300 dark:border-neutral-700 cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold transition-all shadow-md cursor-pointer"
                    >
                      Simpan Perubahan →
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 5: ADD MANUAL CUSTOM LINK */}
        {isAddCustomLinkModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative text-neutral-900 dark:text-white">
              <button
                onClick={() => setIsAddCustomLinkModalOpen(false)}
                className="absolute top-5 right-5 text-neutral-400 hover:text-white font-mono text-xl cursor-pointer"
              >
                ✕
              </button>

              <h3 className="text-xl font-bold mb-1">🔗 Tambah Link Manual ke Playlist</h3>
              <p className="text-xs text-neutral-500 mb-5 font-mono">
                Tambahkan link eksternal apa pun (form, landing page, grup WA/Telegram, affiliate link pribadi, dll) ke dalam playlist.
              </p>

              <form onSubmit={handleAddCustomLinkSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Judul Tautan / Nama Link *
                  </label>
                  <input
                    type="text"
                    required
                    value={customLinkForm.title}
                    onChange={(e) => setCustomLinkForm({ ...customLinkForm, title: e.target.value })}
                    placeholder="Contoh: Template Prompt Canva Gratis"
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    URL Tautan Lengkap *
                  </label>
                  <input
                    type="text"
                    required
                    value={customLinkForm.url}
                    onChange={(e) => setCustomLinkForm({ ...customLinkForm, url: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Catatan Singkat (Opsional)
                  </label>
                  <input
                    type="text"
                    value={customLinkForm.note}
                    onChange={(e) => setCustomLinkForm({ ...customLinkForm, note: e.target.value })}
                    placeholder="Contoh: Link langsung unduh file zip"
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddCustomLinkModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-mono border border-neutral-300 dark:border-neutral-700 cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold transition-all shadow-md cursor-pointer"
                  >
                    Tambahkan Link →
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 6: MANAGE ALL LINKLISTS DRAWER */}
        {isLinkListManagerOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl relative text-neutral-900 dark:text-white max-h-[85vh] overflow-y-auto">
              <button
                onClick={() => setIsLinkListManagerOpen(false)}
                className="absolute top-5 right-5 text-neutral-400 hover:text-white font-mono text-xl cursor-pointer"
              >
                ✕
              </button>

              <div className="flex items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-xl font-bold">Koleksi LinkList Saya</h3>
                  <span className="text-xs font-mono text-neutral-500">Kelola daftar kumpulan tool untuk dibagikan ke Instagram</span>
                </div>
                <button
                  onClick={() => setIsCreateListModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold cursor-pointer shrink-0"
                >
                  + Buat Baru
                </button>
              </div>

              <div className="space-y-3 mb-6">
                {linkLists.length === 0 ? (
                  <p className="text-xs font-mono text-neutral-500 py-6 text-center">Belum ada LinkList yang dibuat.</p>
                ) : (
                  linkLists.map((list) => (
                    <div
                      key={list.id}
                      className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-2"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="font-bold text-sm text-neutral-900 dark:text-white">{list.title}</h4>
                          <span className="text-[10px] font-mono text-neutral-500">
                            {list.createdAt} • {tools.filter((t) => isToolInList(t, list.toolIds)).length} tools • {(list.customLinks || []).length} link manual
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {/* Edit button */}
                          <button
                            onClick={() => {
                              setEditingLinkList({ ...list });
                              setIsLinkListManagerOpen(false);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 font-mono text-xs font-bold transition-all cursor-pointer"
                            title="Edit Catatan & Info"
                          >
                            ✏️ Edit
                          </button>

                          {/* Open button */}
                          <button
                            onClick={() => {
                              setActiveLinkListId(list.id);
                              setSelectedCategory('Semua');
                              setSelectedPricing('Semua');
                              setSearchQuery('');
                              setIsLinkListManagerOpen(false);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-neutral-200 dark:bg-neutral-800 hover:bg-purple-600 hover:text-white font-mono text-xs font-bold transition-all cursor-pointer"
                          >
                            Buka ↗
                          </button>

                          {/* Share button */}
                          <button
                            onClick={() => copyShareLink(list.id)}
                            className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold transition-all cursor-pointer shadow-sm"
                            title="Salin Link Publik"
                          >
                            🔗 Share
                          </button>
                        </div>
                      </div>

                      {list.notes && (
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2">
                          {list.notes}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>

              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex justify-end">
                <button
                  onClick={() => setIsLinkListManagerOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-mono text-xs font-bold cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 7: SUBMIT NEW TOOL */}
        {isSubmitModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative text-neutral-900 dark:text-white">
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="absolute top-5 right-5 text-neutral-400 hover:text-white font-mono text-xl cursor-pointer"
              >
                ✕
              </button>

              <h3 className="text-xl font-bold mb-2">Submit Tool AI Baru</h3>
              <p className="text-xs text-neutral-500 mb-6 font-mono">
                Daftarkan produk AI Anda ke pustaka kecerdasan buatan LocaGo Creative untuk menjangkau ribuan pengunjung harian.
              </p>

              {submitSuccess ? (
                <div className="py-10 text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center text-xl mx-auto">
                    ✓
                  </div>
                  <h4 className="font-bold text-base">Permohonan Berhasil Dikirim!</h4>
                  <p className="text-xs text-neutral-500">Mengarahkan ke WhatsApp admin LocaGo...</p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Nama Tool / Software *
                    </label>
                    <input
                      type="text"
                      required
                      value={submitForm.toolName}
                      onChange={(e) => setSubmitForm({ ...submitForm, toolName: e.target.value })}
                      placeholder="Contoh: MyGenius AI"
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Tautan Website Resmi *
                    </label>
                    <input
                      type="url"
                      required
                      value={submitForm.websiteUrl}
                      onChange={(e) => setSubmitForm({ ...submitForm, websiteUrl: e.target.value })}
                      placeholder="https://mygenius.ai"
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-mono font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        Kategori
                      </label>
                      <select
                        value={submitForm.category}
                        onChange={(e) => setSubmitForm({ ...submitForm, category: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-mono"
                      >
                        {categories.filter((c) => c !== 'Semua').map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        Model Harga
                      </label>
                      <select
                        value={submitForm.pricing}
                        onChange={(e) => setSubmitForm({ ...submitForm, pricing: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-mono"
                      >
                        <option value="Freemium">Freemium</option>
                        <option value="Free Trial">Free Trial</option>
                        <option value="Paid">Paid</option>
                        <option value="Free">100% Free</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Deskripsi Fungsional Singkat *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={submitForm.description}
                      onChange={(e) => setSubmitForm({ ...submitForm, description: e.target.value })}
                      placeholder="Jelaskan secara jelas apa yang dilakukan tool ini dan mengapa user harus menggunakannya..."
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsSubmitModalOpen(false)}
                      className="px-4 py-2 rounded-xl text-xs font-mono border border-neutral-300 dark:border-neutral-700 cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold transition-all shadow-md cursor-pointer"
                    >
                      Kirim Pendaftaran Tool Sekarang →
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
