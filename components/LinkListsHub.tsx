import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { LinkListItem, AIToolItem } from '../types';
import { AI_TOOLS_LIST } from '../lib/data';
import {
  INITIAL_COMMUNITY_LINKLISTS,
  matchCatalogTool,
  sanitizeExternalUrl,
  canUserEditLinkList,
  cleanText
} from '../lib/linklistUtils';

export const LinkListsHub: React.FC = () => {
  const { user, isOwner, isLoggedIn, openAuthModal } = useAuth();
  
  // Available tools from catalog
  const [tools, setTools] = useState<AIToolItem[]>(AI_TOOLS_LIST);

  // LinkLists State (Persisted in localStorage and synced)
  const [linkLists, setLinkLists] = useState<LinkListItem[]>(() => {
    try {
      const saved = localStorage.getItem('locago_community_linklists');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_COMMUNITY_LINKLISTS;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'official' | 'community' | 'mine'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingList, setEditingList] = useState<LinkListItem | null>(null);

  // Forms
  const [formTitle, setFormTitle] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formVideoUrl, setFormVideoUrl] = useState('');
  const [formManualLinkTitle, setFormManualLinkTitle] = useState('');
  const [formManualLinkUrl, setFormManualLinkUrl] = useState('');
  const [formManualLinkNote, setFormManualLinkNote] = useState('');
  const [formToolSearch, setFormToolSearch] = useState('');
  const [selectedToolIds, setSelectedToolIds] = useState<string[]>([]);
  const [pendingCustomLinks, setPendingCustomLinks] = useState<{ id: string; title: string; url: string; note?: string }[]>([]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync to localStorage
  const saveLists = (updated: LinkListItem[]) => {
    setLinkLists(updated);
    try {
      localStorage.setItem('locago_community_linklists', JSON.stringify(updated));
    } catch {}
  };

  // Fetch live tools
  useEffect(() => {
    fetch('/ai_tools_live.json?t=' + Date.now())
      .then((r) => r.json())
      .then((d) => {
        if (d.items && d.items.length > 0) setTools(d.items);
      })
      .catch(() => {});
  }, []);

  // Filtered LinkLists
  const filteredLists = useMemo(() => {
    let list = linkLists;

    if (filterType === 'official') {
      list = list.filter((l) => l.isOfficial || l.authorEmail === 'fahmi@locagocreative.my.id');
    } else if (filterType === 'community') {
      list = list.filter((l) => !l.isOfficial && l.authorEmail !== 'fahmi@locagocreative.my.id');
    } else if (filterType === 'mine') {
      if (!user) return [];
      list = list.filter((l) => l.userId === user.id || l.authorEmail === user.email);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.notes.toLowerCase().includes(q) ||
          (l.authorName || '').toLowerCase().includes(q)
      );
    }

    return list;
  }, [linkLists, filterType, searchQuery, user]);

  const copyShareLink = (id: string) => {
    const url = `${window.location.origin}/#ai-tools#linklist=${id}`;
    navigator.clipboard.writeText(url);
    showToast('✅ Tautan LinkList berhasil disalin! Siap dibagikan ke Instagram DM/Reels.');
  };

  const openPlaylist = (id: string) => {
    window.location.hash = `ai-tools#linklist=${id}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    if (!isLoggedIn) {
      openAuthModal();
      return;
    }
    setFormTitle('');
    setFormNotes('');
    setFormVideoUrl('');
    setSelectedToolIds([]);
    setPendingCustomLinks([]);
    setIsCreateModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (item: LinkListItem) => {
    if (!canUserEditLinkList(item, user)) {
      showToast('⚠️ Anda tidak memiliki izin untuk mengedit playlist ini.');
      return;
    }
    setEditingList(item);
    setFormTitle(item.title);
    setFormNotes(item.notes || '');
    setFormVideoUrl(item.videoUrl || '');
    setSelectedToolIds([...item.toolIds]);
    setPendingCustomLinks(item.customLinks ? [...item.customLinks] : []);
  };

  // Add Manual Link (with anti-affiliate check & automatic catalog matching)
  const handleAddManualLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formManualLinkTitle.trim() || !formManualLinkUrl.trim()) return;

    const rawUrl = formManualLinkUrl.trim();
    const rawTitle = formManualLinkTitle.trim();

    // 1. Check if matches any existing tool in LocaGo Catalog!
    const matchedTool = matchCatalogTool(rawUrl, tools) || matchCatalogTool(rawTitle, tools);
    if (matchedTool) {
      // Automatic replacement!
      if (!selectedToolIds.includes(matchedTool.id)) {
        setSelectedToolIds([...selectedToolIds, matchedTool.id]);
      }
      setFormManualLinkTitle('');
      setFormManualLinkUrl('');
      setFormManualLinkNote('');
      showToast(`✨ Tool Terdeteksi! "${matchedTool.name}" telah terdaftar di LocaGo Creative. Otomatis dihubungkan menggunakan tautan resmi.`);
      return;
    }

    // 2. Not in catalog -> Run Anti-Affiliate Sanitizer
    const { cleanUrl, wasSanitized, reason } = sanitizeExternalUrl(rawUrl, isOwner);
    if (wasSanitized && !isOwner) {
      showToast(`⚠️ ${reason || 'Tautan affiliate eksternal telah dinetralkan secara otomatis.'}`);
    }

    const newLink = {
      id: `link-${Date.now().toString().slice(-6)}`,
      title: rawTitle,
      url: cleanUrl,
      note: formManualLinkNote.trim() || undefined
    };

    setPendingCustomLinks([...pendingCustomLinks, newLink]);
    setFormManualLinkTitle('');
    setFormManualLinkUrl('');
    setFormManualLinkNote('');
    showToast(`✅ Link manual "${rawTitle}" berhasil ditambahkan!`);
  };

  // Submit Create List
  const handleSaveNewList = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const slug = formTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newList: LinkListItem = {
      id: `list-${slug}-${Date.now().toString().slice(-4)}`,
      title: formTitle.trim(),
      notes: formNotes.trim(),
      videoUrl: formVideoUrl.trim() || undefined,
      toolIds: selectedToolIds,
      customLinks: pendingCustomLinks,
      userId: user?.id,
      authorEmail: user?.email,
      authorName: isOwner ? 'Mas Fahmi (Founder & Owner)' : (user?.name || 'Kreator Komunitas'),
      isOfficial: isOwner,
      createdAt: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
      views: 10
    };

    saveLists([newList, ...linkLists]);
    setIsCreateModalOpen(false);
    showToast(`🎉 Playlist "${newList.title}" berhasil dibuat dan siap dibagikan!`);
  };

  // Submit Edit List
  const handleSaveEditedList = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingList) return;

    const updated = linkLists.map((item) => {
      if (item.id === editingList.id) {
        return {
          ...item,
          title: formTitle.trim(),
          notes: formNotes.trim(),
          videoUrl: formVideoUrl.trim() || undefined,
          toolIds: selectedToolIds,
          customLinks: pendingCustomLinks
        };
      }
      return item;
    });

    saveLists(updated);
    setEditingList(null);
    showToast('✅ Perubahan playlist berhasil disimpan!');
  };

  // Delete List
  const handleDeleteList = (id: string) => {
    const target = linkLists.find((l) => l.id === id);
    if (!target || !canUserEditLinkList(target, user)) {
      showToast('⚠️ Anda tidak memiliki izin untuk menghapus playlist ini.');
      return;
    }

    if (!confirm(`Hapus playlist "${target.title}"? Tindakan ini tidak dapat dibatalkan.`)) return;

    const updated = linkLists.filter((l) => l.id !== id);
    saveLists(updated);
    if (editingList?.id === id) setEditingList(null);
    showToast('Playlist berhasil dihapus.');
  };

  return (
    <section className="pt-28 pb-24 bg-neutral-50/60 dark:bg-neutral-950 text-neutral-900 dark:text-white min-h-screen relative overflow-hidden transition-colors duration-200">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-purple-600 text-white font-mono text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <span>✨</span>
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 text-purple-800 dark:text-purple-400 text-xs font-mono font-medium mb-4">
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            <span>Direktori & Library LinkList Publik</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Pustaka LinkList & Playlist AI Komunitas
          </h1>
          <p className="mt-4 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Kumpulan daftar kurasi kecerdasan buatan, engine otomasi, dan link rekomendasi dari Mas Fahmi dan para kreator konten. Satu tautan lengkap untuk bio Instagram, DM, dan video Reels Anda.
          </p>

          {/* Action Header Buttons */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleOpenCreate}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <span>+</span>
              <span>Buat LinkList Saya Sendiri</span>
            </button>

            {isLoggedIn ? (
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs font-mono">
                <span>{isOwner ? '👑' : '👤'}</span>
                <span className="font-bold">{user?.name}</span>
                <span className="text-[10px] text-neutral-500">({isOwner ? 'Owner' : 'Member'})</span>
              </div>
            ) : (
              <button
                onClick={openAuthModal}
                className="px-4 py-2.5 rounded-xl bg-neutral-900 dark:bg-neutral-800 hover:bg-neutral-800 dark:hover:bg-neutral-700 text-white font-mono text-xs font-bold transition-all border border-neutral-700 flex items-center gap-2 cursor-pointer"
              >
                <span>🔐</span>
                <span>Masuk / Daftar Akun</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white dark:bg-neutral-900/90 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-4 sm:p-5 mb-8 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-96">
              <input
                type="text"
                placeholder="Cari judul playlist, kreator, atau kata kunci..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <span className="absolute left-3.5 top-3 text-neutral-400 text-xs">🔍</span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap cursor-pointer transition-all ${
                  filterType === 'all'
                    ? 'bg-purple-600 text-white font-bold'
                    : 'bg-neutral-100 dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800'
                }`}
              >
                Semua Playlist
              </button>

              <button
                onClick={() => setFilterType('official')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap cursor-pointer transition-all ${
                  filterType === 'official'
                    ? 'bg-amber-500 text-black font-bold'
                    : 'bg-neutral-100 dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800'
                }`}
              >
                👑 Kurasi Mas Fahmi
              </button>

              <button
                onClick={() => setFilterType('community')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap cursor-pointer transition-all ${
                  filterType === 'community'
                    ? 'bg-purple-600 text-white font-bold'
                    : 'bg-neutral-100 dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800'
                }`}
              >
                👥 Komunitas
              </button>

              {isLoggedIn && (
                <button
                  onClick={() => setFilterType('mine')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap cursor-pointer transition-all ${
                    filterType === 'mine'
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'bg-neutral-100 dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800'
                  }`}
                >
                  ⭐ Milik Saya
                </button>
              )}
            </div>
          </div>

          <div className="text-[11px] font-mono text-neutral-500">
            Menampilkan <strong className="text-purple-600 dark:text-purple-400">{filteredLists.length}</strong> playlist publik
          </div>
        </div>

        {/* Playlist Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLists.map((list) => {
            const canEdit = canUserEditLinkList(list, user);
            const isOfficial = list.isOfficial || list.authorEmail === 'fahmi@locagocreative.my.id';

            return (
              <div
                key={list.id}
                className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 hover:border-purple-500/40 transition-all hover:shadow-xl flex flex-col justify-between"
              >
                <div>
                  {/* Author & Status Badge */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold border ${
                        isOfficial
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                          : 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
                      }`}
                    >
                      {isOfficial ? '👑 Kurasi Resmi Mas Fahmi' : `👤 ${list.authorName || 'Member'}`}
                    </span>

                    <span className="text-[10px] font-mono text-neutral-400">{list.createdAt}</span>
                  </div>

                  {/* Title */}
                  <h3 className="font-extrabold text-lg sm:text-xl text-neutral-900 dark:text-white mb-2 leading-snug">
                    {list.title}
                  </h3>

                  {/* Notes */}
                  {list.notes && (
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-3 mb-4 leading-relaxed">
                      {list.notes}
                    </p>
                  )}

                  {/* Tools preview badges */}
                  <div className="space-y-2 mb-5">
                    <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-500">
                      <span>🗂️ {list.toolIds.length} tools terpilih</span>
                      <span>•</span>
                      <span>🔗 {(list.customLinks || []).length} link manual</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {list.toolIds.slice(0, 4).map((tid) => {
                        const cleanTid = cleanText(tid);
                        const matched = tools.find((t) => cleanText(t.id) === cleanTid || cleanText(t.name) === cleanTid);
                        return (
                          <span
                            key={tid}
                            className="px-2 py-0.5 rounded text-[10px] font-mono bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700"
                          >
                            {matched?.name || tid.replace(/^(tool-|ai-)/, '')}
                          </span>
                        );
                      })}
                      {list.toolIds.length > 4 && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono text-neutral-400">
                          +{list.toolIds.length - 4} lagi
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openPlaylist(list.id)}
                      className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer flex items-center gap-1"
                    >
                      <span>Buka</span>
                      <span>↗</span>
                    </button>

                    <button
                      onClick={() => copyShareLink(list.id)}
                      className="px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 font-mono text-xs font-bold transition-all cursor-pointer"
                      title="Salin Link Share"
                    >
                      🔗 Share
                    </button>
                  </div>

                  {canEdit && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(list)}
                        className="px-2.5 py-1.5 rounded-lg bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 text-neutral-800 dark:text-neutral-200 font-mono text-xs font-bold transition-all cursor-pointer"
                        title="Edit Playlist Saya"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDeleteList(list.id)}
                        className="p-1.5 text-neutral-400 hover:text-rose-500 transition-colors cursor-pointer"
                        title="Hapus Playlist"
                      >
                        🗑️
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* MODAL: CREATE / EDIT PLAYLIST */}
        {(isCreateModalOpen || editingList) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative text-neutral-900 dark:text-white my-8 max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setEditingList(null);
                }}
                className="absolute top-5 right-5 text-neutral-400 hover:text-white font-mono text-xl cursor-pointer"
              >
                ✕
              </button>

              <h3 className="text-xl font-bold mb-1">
                {editingList ? '✏️ Edit Playlist LinkList' : '✨ Buat Playlist LinkList Baru'}
              </h3>
              <p className="text-xs text-neutral-500 font-mono mb-6">
                Kurasi tool AI dan link rekomendasi untuk konten media sosial Anda.
              </p>

              <form onSubmit={editingList ? handleSaveEditedList : handleSaveNewList} className="space-y-5">
                <div>
                  <label className="block text-xs font-mono font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Judul Playlist *
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="Contoh: 5 AI Tool Wajib Freelancer 2026"
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Catatan / Notes untuk Audiens
                  </label>
                  <textarea
                    rows={3}
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    placeholder="Tuliskan catatan panduan pemakaian tool atau hook video Anda..."
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-purple-500 resize-y"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Tautan Video Instagram Reels / Shorts / YouTube (Opsional)
                  </label>
                  <input
                    type="url"
                    value={formVideoUrl}
                    onChange={(e) => setFormVideoUrl(e.target.value)}
                    placeholder="https://www.instagram.com/reel/..."
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* SECTION: SELECT TOOLS FROM CATALOG */}
                <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800">
                  <label className="block text-xs font-mono font-bold text-neutral-700 dark:text-neutral-300 mb-2">
                    🛠️ Pilih Tool AI dari Katalog LocaGo ({selectedToolIds.length} dipilih)
                  </label>
                  <input
                    type="text"
                    placeholder="Ketik untuk mencari tool (Cursor, ElevenLabs, Make, dll)..."
                    value={formToolSearch}
                    onChange={(e) => setFormToolSearch(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-mono mb-2"
                  />
                  <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1 border border-neutral-200 dark:border-neutral-800 rounded-xl">
                    {tools
                      .filter((t) => (t.name || '').toLowerCase().includes(formToolSearch.toLowerCase()))
                      .slice(0, 30)
                      .map((t) => {
                        const isSelected = selectedToolIds.includes(t.id);
                        return (
                          <button
                            type="button"
                            key={t.id}
                            onClick={() => {
                              if (isSelected) {
                                setSelectedToolIds(selectedToolIds.filter((id) => id !== t.id));
                              } else {
                                setSelectedToolIds([...selectedToolIds, t.id]);
                              }
                            }}
                            className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-purple-600 text-white font-bold'
                                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200'
                            }`}
                          >
                            {isSelected ? '✓ ' : '+ '}
                            {t.name}
                          </button>
                        );
                      })}
                  </div>
                </div>

                {/* SECTION: ADD MANUAL CUSTOM LINK */}
                <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-mono font-bold text-neutral-700 dark:text-neutral-300">
                      🔗 Tambah Tautan Manual Custom ({pendingCustomLinks.length} tautan)
                    </label>
                    <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400">
                      Auto-Deduplikasi Aktif
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Nama Link / Tool (misal: Template Google Doc)"
                      value={formManualLinkTitle}
                      onChange={(e) => setFormManualLinkTitle(e.target.value)}
                      className="px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-mono"
                    />
                    <input
                      type="text"
                      placeholder="URL Tautan (https://...)"
                      value={formManualLinkUrl}
                      onChange={(e) => setFormManualLinkUrl(e.target.value)}
                      className="px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-mono"
                    />
                  </div>

                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      placeholder="Catatan Singkat (Opsional)"
                      value={formManualLinkNote}
                      onChange={(e) => setFormManualLinkNote(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleAddManualLink}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold cursor-pointer transition-all shrink-0"
                    >
                      + Tambah Link
                    </button>
                  </div>

                  {/* List of pending custom links */}
                  {pendingCustomLinks.length > 0 && (
                    <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                      {pendingCustomLinks.map((cl) => (
                        <div
                          key={cl.id}
                          className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-2 text-xs"
                        >
                          <div className="truncate">
                            <span className="font-bold text-neutral-900 dark:text-white">{cl.title}</span>
                            <span className="text-[10px] text-neutral-500 font-mono block truncate">{cl.url}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setPendingCustomLinks(pendingCustomLinks.filter((l) => l.id !== cl.id))}
                            className="text-rose-500 hover:text-rose-400 font-mono text-xs px-1 cursor-pointer"
                          >
                            Hapus
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Buttons */}
                <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreateModalOpen(false);
                      setEditingList(null);
                    }}
                    className="px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 font-mono text-xs cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold transition-all shadow-md cursor-pointer active:scale-95"
                  >
                    {editingList ? 'Simpan Perubahan →' : 'Publikasikan LinkList →'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
