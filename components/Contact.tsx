
import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzG6K-1Cjm4mPoQF0kHXWGxN0mlBpSKG8CAMA10UsO3rumE5FquN0AE4pzqVuK1Vqb0/exec';

const Contact: React.FC = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = React.useState({
    name: '',
    job: '',
    package: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Send to Google Sheets
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Required for Google Apps Script
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
    } catch (error) {
      console.error('Error saving to Google Sheets:', error);
      // Continue to WhatsApp even if Google Sheets fails
    }

    // Format the message for WhatsApp
    const text = `Halo LocaGo Creative, saya ingin konsultasi proyek.%0A%0A*Nama:* ${formData.name}%0A*Pekerjaan:* ${formData.job}%0A*Paket Minat:* ${formData.package}%0A%0A*Pesan:*%0A${formData.message}`;

    // Redirect to WhatsApp
    window.open(`https://wa.me/6289663012893?text=${text}`, '_blank');

    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contact" className="py-24 bg-blue-600 dark:bg-blue-900 relative overflow-hidden transition-colors duration-300">
      {/* Visual flare */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-900/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 md:p-20 shadow-2xl flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight mb-6">
              {t.contact.title} <br /> <span className="text-blue-600">{t.contact.titleHighlight}</span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
              {t.contact.description}
            </p>

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.contact.whatsapp}</p>
                  <p className="text-lg font-bold text-slate-800 dark:text-white">+62 896-6301-2893</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Instagram</p>
                  <p className="text-lg font-bold text-slate-800 dark:text-white">@locagocreative</p>
                </div>
              </div>
            </div>
          </div>

          <form className="md:w-1/2 w-full space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t.contact.form.name}</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t.contact.form.namePlaceholder}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/50 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t.contact.form.job}</label>
                <input
                  type="text"
                  name="job"
                  value={formData.job}
                  onChange={handleChange}
                  placeholder={t.contact.form.jobPlaceholder}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/50 outline-none transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t.contact.form.package}</label>
              <select
                name="package"
                value={formData.package}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/50 outline-none transition-all appearance-none"
              >
                <option value="" disabled>-- Select Package --</option>
                <optgroup label="Landing Page">
                  <option value="Landing Page - Starter">Starter (Rp 1.500.000)</option>
                  <option value="Landing Page - Growth">Growth (Rp 2.750.000)</option>
                  <option value="Landing Page - Ultimate">Ultimate (Rp 3.750.000)</option>
                </optgroup>
                <optgroup label="Company Profile">
                  <option value="Company Profile - Starter">Starter (Rp 2.500.000)</option>
                  <option value="Company Profile - Growth">Growth (Rp 4.000.000)</option>
                  <option value="Company Profile - Executive">Executive (Rp 6.500.000)</option>
                </optgroup>
                <optgroup label="Online Store">
                  <option value="Store - Starter">Starter Store (Rp 2.500.000)</option>
                  <option value="Store - Growth">Growth Store (Rp 6.000.000)</option>
                  <option value="Store - Ultimate">Ultimate Store (Rp 12.000.000)</option>
                </optgroup>
                <optgroup label="Tour & Travel">
                  <option value="Travel - Starter Trip">Starter Trip (Rp 2.500.000)</option>
                  <option value="Travel - Agent">Travel Agent (Rp 5.000.000)</option>
                  <option value="Travel - System">Travel System (Rp 12.000.000)</option>
                </optgroup>
                <optgroup label="SEO Services">
                  <option value="SEO - Starter">SEO Starter (Rp 2.000.000)</option>
                  <option value="SEO - Growth">SEO Growth (Rp 3.500.000)</option>
                  <option value="SEO - Ultimate">SEO Ultimate (Rp 4.500.000)</option>
                </optgroup>
                <option value="Custom Requirement">Custom / Lainnya</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t.contact.form.message}</label>
              <textarea
                rows={4}
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder={t.contact.form.messagePlaceholder}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/50 outline-none transition-all resize-none"
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 rounded-xl font-bold text-lg shadow-xl shadow-blue-100 dark:shadow-blue-900/30 transition-all active:scale-95 ${isSubmitting
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
                } text-white`}
            >
              {isSubmitting ? 'Mengirim...' : t.contact.form.submit}
            </button>
          </form>
        </div>

      </div>
    </section>
  );
};

export default Contact;
