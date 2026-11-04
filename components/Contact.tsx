import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx60KMD3y7h1dW8qiGu7mHCBC5-caKeUzStDhvj9f6dKgj8rmbMZG1AUKuY2e1L7JHl/exec';
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://mnxbnddjmkruzabhlrtq.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_H-meffsrYDjKI6UuwybniA_EsyPmg46';

const Contact: React.FC = () => {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    job: '',
    package: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Send to Google Sheets
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
    } catch (error) {
      console.warn('Error saving to Google Sheets:', error);
    }

    // Save to Supabase
    try {
      if (SUPABASE_ANON_KEY) {
        await fetch(`${SUPABASE_URL}/rest/v1/kb_briefs`, {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({
            category: 'client_order',
            topic: `Brief: ${formData.name || 'Prospek'} - ${formData.package || 'Esensial'}`,
            keywords: [formData.package || 'website', formData.job || 'client', 'order_lead'],
            content: `Nama: ${formData.name}\nWhatsApp: ${formData.phone}\nEmail: ${formData.email}\nPekerjaan/Bisnis: ${formData.job}\nPaket: ${formData.package}\nDetail: ${formData.message}`
          })
        });
      }
    } catch (sbError) {
      console.warn('Error syncing to Supabase:', sbError);
    }

    // Format the message for WhatsApp
    const text = encodeURIComponent(
      `Halo Mas Fahmi / LocaGo Creative! 🚀\nSaya ingin konsultasi dan memulai proyek digital.\n\n*Nama:* ${formData.name}\n*WhatsApp:* ${formData.phone}\n*Email:* ${formData.email}\n*Pekerjaan/Bisnis:* ${formData.job}\n*Minat Proyek:* ${formData.package}\n\n*Detail Kebutuhan:*\n${formData.message}`
    );

    // Redirect to WhatsApp
    window.open(`https://wa.me/62895336377648?text=${text}`, '_blank');
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section id="contact" className="py-24 bg-white dark:bg-neutral-900/40 border-b border-neutral-200 dark:border-neutral-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Direct Studio Dossier */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-xs font-mono text-neutral-600 dark:text-neutral-400 mb-4 shadow-sm">
                <span>{language === 'en' ? 'Direct Founder Channel' : 'Saluran Langsung Founder'}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white mb-4 leading-[1.18]">
                {t.contact.title} <span className="text-neutral-500 dark:text-neutral-400 font-normal">{t.contact.titleHighlight}</span>
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 text-base sm:text-lg leading-relaxed">
                {t.contact.description}
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-4 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-mono text-base font-bold shrink-0">
                  WA
                </div>
                <div>
                  <h4 className="text-sm font-bold text-neutral-900 dark:text-white">{t.contact.whatsappDirect}</h4>
                  <p className="text-xs text-neutral-500 font-mono mt-0.5">+62 895-3363-77648</p>
                  <span className="inline-block mt-2 text-xs font-mono text-emerald-600 dark:text-emerald-400 font-medium">
                    {t.contact.avgResponse}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
                <div className="w-10 h-10 rounded-lg bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 flex items-center justify-center font-mono text-base font-bold shrink-0">
                  HQ
                </div>
                <div>
                  <h4 className="text-sm font-bold text-neutral-900 dark:text-white">{t.contact.officeLocation}</h4>
                  <p className="text-xs text-neutral-500 mt-0.5">Tasikmalaya, Jawa Barat, Indonesia</p>
                  <span className="inline-block mt-2 text-xs font-mono text-neutral-500">
                    {t.contact.serviceCoverage}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Brief Form */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/30 dark:bg-neutral-900/20 backdrop-blur-sm shadow-xl">
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                {t.contact.formTitle}
              </h3>
              <p className="text-xs text-neutral-500 mb-6 font-mono">
                {t.contact.formDesc}
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      {t.contact.fullName}
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={language === 'en' ? 'e.g. John Doe' : 'Contoh: Mas Budi'}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      {t.contact.whatsappNumber}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder={language === 'en' ? 'e.g. +62 812 3456 789' : '08123456789'}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition-all"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      {t.contact.emailAddress}
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="budi@bisnis.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      {t.contact.businessType}
                    </label>
                    <input
                      type="text"
                      name="job"
                      value={formData.job}
                      onChange={handleChange}
                      placeholder={language === 'en' ? 'e.g. Fashion Brand Owner' : 'Owner Brand / Cafe / Klinik'}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    {t.contact.interestedPackage}
                  </label>
                  <select
                    name="package"
                    value={formData.package}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition-all"
                  >
                    <option value="">{t.contact.selectPackage}</option>
                    <option value="Paket Esensial (Rp 1.500.000)">Paket Esensial (Rp 1.500.000)</option>
                    <option value="Paket Bisnis (Rp 2.900.000)">Paket Bisnis (Rp 2.900.000)</option>
                    <option value="Paket Enterprise (Rp 5.500.000)">Paket Enterprise (Rp 5.500.000)</option>
                    <option value="Kustom Web App / Sistem Khusus">Kustom Web App / Sistem Khusus</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    {t.contact.messageLabel}
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={t.contact.messagePlaceholder}
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition-all resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 font-mono font-bold text-sm transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>{t.contact.submitting}</span>
                  ) : (
                    <>
                      <span>{t.contact.submitBtn}</span>
                      <span>→</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
