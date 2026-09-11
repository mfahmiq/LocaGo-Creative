import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx60KMD3y7h1dW8qiGu7mHCBC5-caKeUzStDhvj9f6dKgj8rmbMZG1AUKuY2e1L7JHl/exec';

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

            {/* Direct Contact Channels Cards */}
            <div className="space-y-3">
              {/* WhatsApp Card */}
              <a
                href="https://wa.me/62895336377648"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/50 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors duration-200 flex items-center gap-4 group"
              >
                <div className="w-10 h-10 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm flex-shrink-0">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">{t.contact.whatsapp}</p>
                  <p className="text-sm font-bold text-neutral-900 dark:text-white group-hover:underline">+62 895-3363-77648</p>
                </div>
                <span className="text-xs font-mono text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">→</span>
              </a>

              {/* Email Card */}
              <a
                href="mailto:locagocreative@gmail.com"
                className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/50 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors duration-200 flex items-center gap-4 group"
              >
                <div className="w-10 h-10 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center justify-center text-neutral-900 dark:text-white shadow-sm flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">{t.contact.email}</p>
                  <p className="text-sm font-bold text-neutral-900 dark:text-white group-hover:underline">locagocreative@gmail.com</p>
                </div>
                <span className="text-xs font-mono text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">→</span>
              </a>

              {/* Studio Location Card */}
              <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/50 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center justify-center text-neutral-900 dark:text-white shadow-sm flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                    {language === 'en' ? 'Studio HQ' : 'Studio Pusat'}
                  </p>
                  <p className="text-sm font-bold text-neutral-900 dark:text-white">
                    {language === 'en' ? 'Garut, West Java, Indonesia' : 'Garut, Jawa Barat, Indonesia'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Project Intake Form */}
          <div className="lg:col-span-7">
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/50 p-6 sm:p-8">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-neutral-200/80 dark:border-neutral-800/80">
                <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400">locagocreative.my.id/intake</span>
                <span className="text-[11px] font-mono text-neutral-400">Handcrafted Form</span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name & Job */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="name" className="text-xs font-mono font-semibold text-neutral-600 dark:text-neutral-400">
                      {t.contact.form.name} *
                    </label>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={t.contact.form.namePlaceholder}
                      required
                      className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white text-sm focus:border-neutral-500 focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="job" className="text-xs font-mono font-semibold text-neutral-600 dark:text-neutral-400">
                      {t.contact.form.job} *
                    </label>
                    <input
                      id="job"
                      type="text"
                      name="job"
                      value={formData.job}
                      onChange={handleChange}
                      placeholder={t.contact.form.jobPlaceholder}
                      required
                      className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white text-sm focus:border-neutral-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Phone & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="phone" className="text-xs font-mono font-semibold text-neutral-600 dark:text-neutral-400">
                      {(t.contact.form as any).phone || (language === 'en' ? 'WhatsApp Number' : 'No. WhatsApp')} *
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="08xxxxxxxxxx"
                      required
                      className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white text-sm font-mono focus:border-neutral-500 focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="email" className="text-xs font-mono font-semibold text-neutral-600 dark:text-neutral-400">
                      {(t.contact.form as any).email || (language === 'en' ? 'Email Address' : 'Alamat Email')} *
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="nama@email.com"
                      required
                      className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white text-sm focus:border-neutral-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Project package dropdown */}
                <div className="space-y-1.5">
                  <label htmlFor="package" className="text-xs font-mono font-semibold text-neutral-600 dark:text-neutral-400">
                    {t.contact.form.package} *
                  </label>
                  <select
                    id="package"
                    name="package"
                    value={formData.package}
                    onChange={handleChange}
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white text-sm focus:border-neutral-500 focus:outline-none transition-colors"
                  >
                    <option value="" disabled>-- {language === 'en' ? 'Select Project Interest' : 'Pilih Minat Proyek'} --</option>
                    <option value="Landing Page & Company Profile Esensial">
                      {language === 'en' ? 'Landing Page & Company Profile (Incl. Domain & Hosting)' : 'Landing Page & Company Profile (Include Domain + Hosting 1 Thn)'}
                    </option>
                    <option value="WhatsApp Commerce (Katalog Online)">
                      {language === 'en' ? 'WhatsApp Commerce (Online Catalog + Direct WA)' : 'WhatsApp Commerce (Katalog Produk + Direct WA)'}
                    </option>
                    <option value="Toko Online Pro (Cart + Midtrans)">
                      {language === 'en' ? 'Pro E-Commerce Store (Cart + Payment Gateway Midtrans)' : 'Toko Online Pro (Keranjang Belanja + Midtrans Gateway)'}
                    </option>
                    <option value="WhatsApp AI Chatbot Automation">
                      {language === 'en' ? 'WhatsApp AI Chatbot Automation 24/7' : 'WhatsApp AI Chatbot & Otomasi Bisnis 24 Jam'}
                    </option>
                    <option value="Presensi QR & Sistem Sekolah">
                      {language === 'en' ? 'QR Code Attendance & School Systems' : 'Presensi QR Code & Sistem Administrasi Sekolah'}
                    </option>
                    <option value="Otomasi Google Sheets / Apps Script">
                      {language === 'en' ? 'Google Apps Script & Spreadsheet Automation' : 'Otomasi Google Sheets / Apps Script / CSV'}
                    </option>
                    <option value="Custom Software & Web Application">
                      {language === 'en' ? 'Custom Web Application / Mobile App' : 'Aplikasi Web Kustom / Mobile App Android'}
                    </option>
                    <option value="Konsultasi Kebutuhan Custom Lainnya">
                      {language === 'en' ? 'Other Custom Requirements' : 'Konsultasi Kebutuhan Custom Lainnya'}
                    </option>
                  </select>
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label htmlFor="message" className="text-xs font-mono font-semibold text-neutral-600 dark:text-neutral-400">
                    {t.contact.form.message} *
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={t.contact.form.messagePlaceholder}
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white text-sm focus:border-neutral-500 focus:outline-none transition-colors resize-none"
                  ></textarea>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 disabled:opacity-40 text-white dark:text-neutral-950 rounded-lg font-medium text-sm transition-all active:scale-[0.98] shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{isSubmitting ? (language === 'en' ? 'Dispatching...' : 'Mengirim...') : t.contact.form.submit}</span>
                  <span>→</span>
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
