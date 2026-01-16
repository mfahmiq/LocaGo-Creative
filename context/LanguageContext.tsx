import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'id';

export const translations = {
    en: {
        nav: {
            home: 'Home',
            services: 'Services',
            portfolio: 'Portfolio',
            pricing: 'Pricing',
            process: 'Process',
            contact: 'Contact',
            about: 'About',
        },
        hero: {
            badge: '🚀 Time for Your Business to Go Digital',
            titleStart: 'Bring Your Local Business',
            titleGradient: 'Worldwide',
            titleEnd: 'Through Website.',
            description: 'Look more professional and trustworthy in the eyes of potential customers with a website that reflects your business quality.',
            ctaStart: 'Start Your Project',
            ctaPortfolio: 'View Portfolio',
            available: 'Available for new projects',
            cardPerf: 'Performance',
            cardDesign: 'Design',
            cardDesignValue: 'Premium',
        },
        stats: {
            projects: 'Projects Completed',
            clients: 'Satisfied Clients',
            timely: 'On Time',
        },
        services: {
            items: [
                { title: 'Landing Page', description: 'High-conversion single page designed to turn visitors into buyers.' },
                { title: 'Company Profile', description: 'Professional website to build business credibility and trust.' },
                { title: 'Online Store', description: 'Complete e-commerce solution with shopping cart and payment gateway.' },
                { title: 'Tour & Travel', description: 'Specialized travel website with booking system and itinerary display.' },
            ]
        },
        portfolio: {
            subtitle: 'Portfolio',
            title: 'Our Best Work',
            description: 'Helping various businesses transform digitally through aesthetic design and optimal performance.',
            projects: [
                { title: 'Alharamain Tour', category: 'Travel & Umrah', description: 'Trusted Umrah and Hajj travel agency website with comprehensive package information.', link: 'https://alharamain-kohl.vercel.app/' },
                { title: 'Glowup Beauty', category: 'Beauty & Skincare', description: 'Modern e-commerce landing page for a premium skincare brand focused on aesthetics.', link: 'https://glowup-kohl.vercel.app/' },
                { title: 'NusaTrip', category: 'Travel Agency', description: 'Adventure travel website showcasing exotic destinations in the archipelago.', link: 'https://nusatrip.vercel.app/' },
                { title: 'Urban Kicks', category: 'E-Commerce', description: 'Trendy online shoe store with a sleek design and smooth shopping experience.', link: 'https://urbankicks-one.vercel.app/' },
                { title: 'Mitra Konstruksi', category: 'Construction', description: 'Professional company profile for a construction and contractor firm.', link: 'https://mitrakonstruksi.vercel.app/' },
            ]
        },
        pricing: {
            subtitle: 'Pricelist',
            title: 'Best Investment for Your Business',
            features_guarantee: 'Warranty',
            description: 'Choose the package that best suits your current business scale.',
            popular: 'Recommended',
            tabs: {
                landing: 'Landing Page',
                company: 'Company Profile',
                store: 'Online Store',
                travel: 'Tour & Travel',
                seo: 'SEO Services'
            },
            categories: {
                landing: [
                    {
                        title: 'Starter',
                        price: 'Rp 1.500.000',
                        description: 'Perfect for new businesses wanting an elegant online presence immediately.',
                        features: ['Free .com Domain', 'Shared Hosting (6 Months)', '1 Long Scrolling Page', '1 Business Email & 1 GB Storage', 'Free SSL (Green Padlock)', '1x Free Revision', '15 Days Maintenance Warranty'],
                        ctaText: 'Order Now'
                    },
                    {
                        title: 'Growth',
                        price: 'Rp 2.750.000',
                        isPopular: true,
                        description: 'For those who want to look more professional with more branded control.',
                        features: ['Hosting 1 Year', 'Complex Visual Design (CTA, Form, Gallery)', 'Direct WhatsApp Chat', '2 Business Emails & 10 GB Storage', '3x Free Revisions', 'Basic SEO On-Page', '1 Month Maintenance Warranty'],
                        ctaText: 'Order Now'
                    },
                    {
                        title: 'Ultimate',
                        price: 'Rp 3.750.000',
                        description: 'All-in-one landing page solution for high conversion & premium look.',
                        features: ['All Growth features +', 'Up to 2 Extra Pages (About/FAQ)', 'Request Features (Popup, Accordion)', 'Interactive Design (Scroll Animation)', 'Speed Optimization', '5x Free Revisions', '1.5 Months Maintenance Warranty'],
                        ctaText: 'Order Now'
                    }
                ],
                company: [
                    {
                        title: 'Starter',
                        price: 'Rp 2.500.000',
                        description: 'For businesses just going digital needing a tidy online presence.',
                        features: ['Free .com Domain', 'Shared Hosting (6 Months)', '3 Main Pages (Home, About, Contact)', '1 Business Email & 2 GB Storage', '2x Free Revisions', 'Contact Form to WhatsApp', '15 Days Maintenance Warranty'],
                        ctaText: 'Order Now'
                    },
                    {
                        title: 'Growth',
                        price: 'Rp 4.000.000',
                        isPopular: true,
                        description: 'For businesses wanting to appear professional and trusted.',
                        features: ['Hosting 1 Year', '5–6 Pages (Home, Service, Portfolio)', '2 Business Emails & 10 GB Storage', 'Premium & Clean Design', 'Photo Gallery / Testimonials', 'Basic SEO On-Page', '1 Month Maintenance Warranty'],
                        ctaText: 'Order Now'
                    },
                    {
                        title: 'Executive',
                        price: 'Rp 6.500.000',
                        description: 'For companies ready to scale with professional features.',
                        features: ['8–10 Pages (Inc. Blog/Career)', 'Request Features (Popup, Pricing Table)', 'Instagram Feed / YouTube Integration', 'Speed Optimization (Lazy Load)', 'Interactive Design (Parallax)', '3 Business Emails & 5x Revisions', '1.5 Months Maintenance Warranty'],
                        ctaText: 'Order Now'
                    }
                ],
                store: [
                    {
                        title: 'Starter Store',
                        price: 'Rp 2.500.000',
                        description: 'Simple online store, product gallery, checkout via WhatsApp.',
                        features: ['Free .com Domain', 'Shared Hosting 6 Months', 'Responsive Design', 'Buy via WA Button', 'Max 20 Products', '2x Revisions', '15 Days Warranty'],
                        ctaText: 'Order Now'
                    },
                    {
                        title: 'Growth Store',
                        price: 'Rp 6.000.000',
                        isPopular: true,
                        description: 'Professional store with product filters and complete categories.',
                        features: ['Hosting 1 Year', '5-7 Pages', 'Catalog up to 100 Products', 'Search & Filter Features', 'Basic SEO', '3x Revisions', '1 Month Warranty'],
                        ctaText: 'Best Seller'
                    },
                    {
                        title: 'Ultimate Store',
                        price: 'Rp 12.000.000',
                        description: 'Complete e-commerce system with cart & automated payment.',
                        features: ['Cart & Checkout System', 'Payment Gateway (Midtrans/Xendit)', 'Automated Shipping Calculation', 'Complete Admin Dashboard', '5x Revisions', '1.5 Months Warranty'],
                        ctaText: 'VIP Consultation'
                    }
                ],
                travel: [
                    {
                        title: 'Starter Trip',
                        price: 'Rp 2.500.000',
                        description: 'Promo tour package landing page. Focus on conversion to WA.',
                        features: ['1 Long Page', 'Free Domain & Hosting', 'Detail Itinerary & Price', 'Booking via WhatsApp', '2x Revisions'],
                        ctaText: 'Order Now'
                    },
                    {
                        title: 'Travel Agent',
                        price: 'Rp 5.000.000',
                        isPopular: true,
                        description: 'Full travel agent website, displaying many destination choices.',
                        features: ['5-7 Main Pages', 'Detail Page per Package', 'Tour Package Search', 'Photo/Video Gallery', '3x Revisions'],
                        ctaText: 'Best Seller'
                    },
                    {
                        title: 'Travel System',
                        price: 'Rp 12.000.000',
                        description: 'Travel website with online booking and payment system.',
                        features: ['Payment Gateway Integration', 'Automated Booking Form', 'Email Ticket Notification', 'Availability Calendar', '5x Revisions'],
                        ctaText: 'Contact Sales'
                    }
                ],
                seo: [
                    {
                        title: 'SEO Starter',
                        price: 'Rp 2.000.000',
                        description: 'Basic audit to make website readable by Google.',
                        features: ['Research 5 Keywords', 'Google Search Console Setup', 'Meta Title/Desc Fix', '4 SEO Articles', 'Monthly Report'],
                        ctaText: 'Choose Package'
                    },
                    {
                        title: 'SEO Growth',
                        price: 'Rp 3.500.000',
                        isPopular: true,
                        description: 'Increase organic visitors from Google search.',
                        features: ['Research 20 Keywords', 'Web Speed Optimization', '8 SEO Articles', 'Optimize 3 Main Pages', 'Monthly Report'],
                        ctaText: 'Best Seller'
                    },
                    {
                        title: 'SEO Ultimate',
                        price: 'Rp 4.500.000',
                        description: 'Keyword dominance for medium-scale businesses.',
                        features: ['Competitive Keywords', '20 SEO Articles', 'Product Page Optimization', 'Basic Backlink Strategy', 'Monthly Report'],
                        ctaText: 'Choose Package'
                    }
                ]
            },
            note: '*Prices do not include content materials (photos/text). Domain/hosting renewal for the following years is borne by the client.'
        },
        process: {
            subtitle: 'How It Works',
            title: 'Steps to Your Dream Website',
            description: 'Transparent and measurable work process to ensure the best quality at every stage of development.',
            steps: [
                { title: 'Consultation & Deal', description: 'In-depth discussion about your business needs and package selection.' },
                { title: 'Down Payment & Materials', description: '50% down payment and asset submission (logo, text, photos).' },
                { title: 'Development Process', description: 'Coding and design with regular progress updates.' },
                { title: 'Review & Revision', description: 'You review the work and submit revisions if needed.' },
                { title: 'Final Payment & Handover', description: '50% final payment, access handover, and website goes LIVE!' },
            ]
        },
        faq: {
            subtitle: 'FAQ',
            title: 'Frequently Asked Questions',
            description: "Maybe this is what you're thinking. Still confused? Ask directly via WhatsApp.",
            items: [
                { question: 'Does the price include hosting and domain?', answer: 'Yes, for Business package and above, the price includes domain (.com) renewal and premium hosting for the first year. For Starter package, only domain (.com) is included.' },
                { question: 'Can I update website content myself?', answer: 'Of course. We provide a user-friendly admin dashboard (CMS) so you can change text, images, or add blog articles without coding.' },
                { question: 'What is the payment system?', answer: 'Our payment system uses 50% down payment before work begins, and 50% final payment after the website is reviewed but before full access handover.' },
                { question: 'Will my website look good on mobile?', answer: 'Absolutely. All websites we build use the "Mobile-First Design" principle that guarantees responsive and perfect appearance on smartphones, tablets, and desktops.' },
                { question: 'How long does it take?', answer: 'Depends on the package chosen. Starter usually takes 3-5 business days, Business 7-14 business days, and Enterprise can be 1 month or more depending on complexity.' },
            ]
        },
        contact: {
            title: 'Ready to Start',
            titleHighlight: 'Your Project?',
            description: "Don't let your business ideas evaporate. Consult for free and get the best offer today.",
            whatsapp: 'WhatsApp Chat',
            email: 'Business Email',
            form: {
                name: 'Name',
                namePlaceholder: 'John Doe',
                job: 'Occupation',
                jobPlaceholder: 'SME Owner',
                package: 'Select Package',
                message: 'Message / Project Details',
                messagePlaceholder: 'Hello, I want to create a website for...',
                submit: 'Send Inquiry'
            },
            copyright: '© 2024 LocaGo Creative. All rights reserved.',
        },
        whyUs: {
            subtitle: 'Why Choose Us',
            title: 'Your Growth Partner',
            description: "We don't just build websites; we build your business assets.",
            items: [
                {
                    title: 'Free Copywriting',
                    description: "No need to be confused about words. We help create selling content."
                },
                {
                    title: 'Guaranteed Quality',
                    description: "Fast loading, mobile-friendly, and SEO ready from the start."
                },
                {
                    title: 'All-in-One Solution',
                    description: "We handle design, content, domain, to hosting. You just sit back."
                },
                {
                    title: 'Full Support',
                    description: "Need help after the website is finished? We are ready to help anytime."
                }
            ]
        },
        about: {
            subtitle: 'About Us',
            title: 'More Than Just An Agency',
            description: "LocaGo Creative is a team of freelance developers and designers focused on helping MSMEs and travel businesses go digital. We believe every business deserves a professional website without the hassle.",
            stats: {
                exp: 'Years Experience',
                projects: 'Projects Done'
            },
            cta: 'Consult Now'
        },
        footer: {
            tagline: 'Building the digital future, one pixel at a time.',
            quickLinks: 'Quick Links',
            socials: 'Connect',
            contact: 'Contact Us',
        }
    },
    id: {
        nav: {
            home: 'Beranda',
            services: 'Layanan',
            portfolio: 'Portofolio',
            pricing: 'Harga',
            process: 'Proses',
            contact: 'Kontak',
            about: 'Tentang',
        },
        hero: {
            badge: '🚀 Saatnya Bisnis Anda Go Digital',
            titleStart: 'Jasa Pembuatan Website',
            titleGradient: 'Profesional &',
            titleEnd: 'Mobile-Friendly',
            description: 'Bantu Bisnis Lokal Anda Mendunia Lewat Website. LocaGo Creative siap buatkan Company Profile, Landing Page, dan Toko Online yang optimal.',
            ctaStart: 'Mulai Proyek',
            ctaPortfolio: 'Lihat Portofolio',
            available: 'Tersedia untuk proyek baru',
            cardPerf: 'Performa',
            cardDesign: 'Desain',
            cardDesignValue: 'Premium',
        },
        stats: {
            projects: 'Project Selesai',
            clients: 'Client Puas',
            timely: 'Tepat Waktu',
        },
        services: {
            items: [
                { title: 'Jasa Landing Page', description: 'Halaman penawaran khusus (landing page) yang dirancang untuk meningkatkan konversi penjualan iklan.' },
                { title: 'Website Company Profile', description: 'Bangun citra profesional perusahaan Anda dengan website profil yang elegan dan informatif.' },
                { title: 'Website Toko Online', description: 'Toko online lengkap dengan fitur keranjang belanja, integrasi ongkir, dan sistem pembayaran otomatis.' },
                { title: 'Website Custom / UMKM', description: 'Solusi website fleksibel yang disesuaikan dengan kebutuhan unik UMKM dan bisnis lokal Anda.' },
            ]
        },
        portfolio: {
            subtitle: 'Portofolio',
            title: 'Karya Terbaik Kami',
            description: 'Membantu berbagai bisnis bertransformasi digital melalui desain yang estetik dan performa yang optimal.',
            projects: [
                { title: 'Alharamain Tour', category: 'Travel & Umrah', description: 'Website biro perjalanan Umroh dan Haji terpercaya dengan informasi paket lengkap.', link: 'https://alharamain-kohl.vercel.app/' },
                { title: 'Glowup Beauty', category: 'Beauty & Skincare', description: 'Landing page e-commerce modern untuk brand skincare premium yang estetik.', link: 'https://glowup-kohl.vercel.app/' },
                { title: 'NusaTrip', category: 'Travel Agency', description: 'Website travel petualangan yang menampilkan destinasi eksotis nusantara.', link: 'https://nusatrip.vercel.app/' },
                { title: 'Urban Kicks', category: 'E-Commerce', description: 'Toko sepatu online kekinian dengan desain ramping dan pengalaman belanja mulus.', link: 'https://urbankicks-one.vercel.app/' },
                { title: 'Mitra Konstruksi', category: 'Konstruksi', description: 'Profil perusahaan profesional untuk kontraktor dan jasa konstruksi.', link: 'https://mitrakonstruksi.vercel.app/' },
            ]
        },
        pricing: {
            subtitle: 'Daftar Harga',
            title: 'Investasi Terbaik untuk Bisnis Anda',
            description: 'Pilih paket yang sesuai dengan skala bisnis Anda saat ini.',
            popular: 'Rekomendasi',
            tabs: {
                landing: 'Landing Page',
                company: 'Company Profile',
                store: 'Toko Online',
                travel: 'Tour & Travel',
                seo: 'Jasa SEO'
            },
            categories: {
                landing: [
                    {
                        title: 'Starter',
                        price: 'Rp 1.500.000',
                        description: 'Cocok untuk bisnis baru yang ingin langsung tampil online dengan landing page elegan.',
                        features: ['Free Domain (.com)', 'Shared Hosting (6 Bulan)', '1 Halaman Landing Page (Scroll Panjang)', '1 Email Bisnis & 1 GB Storage', 'Free SSL (Gembok Hijau)', '1x Revisi Gratis', 'Garansi Maintenance 15 Hari'],
                        ctaText: 'Order Sekarang'
                    },
                    {
                        title: 'Growth',
                        price: 'Rp 2.750.000',
                        isPopular: true,
                        description: 'Buat kamu yang pengen tampil lebih profesional dan punya kontrol lebih atas fitur & brand.',
                        features: ['Hosting 1 Year', 'Desain Visual Kompleks (CTA, Form, Galeri)', 'Direct WhatsApp Chat', '2 Email Bisnis & 10 GB Storage', '3x Revisi Gratis', 'SEO On-Page Basic', 'Garansi Maintenance 1 Bulan'],
                        ctaText: 'Order Sekarang'
                    },
                    {
                        title: 'Ultimate',
                        price: 'Rp 3.750.000',
                        description: 'Solusi landing page all-in-one buat bisnis digital yang pengen konversi tinggi + tampil premium.',
                        features: ['Semua fitur Growth +', 'Up to 2 Halaman Tambahan (About/FAQ)', 'Request Fitur (Popup, Accordion, dll)', 'Desain Interaktif (Animasi Scroll)', 'Speed Optimization', '5x Revisi Gratis', 'Garansi Maintenance 1,5 Bulan'],
                        ctaText: 'Order Sekarang'
                    }
                ],
                company: [
                    {
                        title: 'Starter',
                        price: 'Rp 2.500.000',
                        description: 'Untuk bisnis yang baru go digital dan butuh online presence yang rapi.',
                        features: ['Free Domain (.com)', 'Shared Hosting (6 Bulan)', '3 Halaman Utama (Home, About, Contact)', '1 Email Bisnis & 2 GB Storage', '2x Revisi Gratis', 'Form Kontak ke WhatsApp', 'Garansi Maintenance 15 Hari'],
                        ctaText: 'Order Sekarang'
                    },
                    {
                        title: 'Growth',
                        price: 'Rp 4.000.000',
                        isPopular: true,
                        description: 'Untuk bisnis yang ingin tampil lebih profesional dan dipercaya oleh calon klien.',
                        features: ['Hosting 1 Tahun', '5–6 Halaman (Home, Service, Portfolio, dll)', '2 Email Bisnis & 10 GB Storage', 'Desain Premium & Clean', 'Galeri Foto / Testimoni', 'SEO On-Page Dasar', 'Garansi Maintenance 1 Bulan'],
                        ctaText: 'Order Sekarang'
                    },
                    {
                        title: 'Executive',
                        price: 'Rp 6.500.000',
                        description: 'Untuk perusahaan yang ingin tampil profesional, punya fitur lengkap, dan siap scale.',
                        features: ['8–10 Halaman (Termasuk Blog/Career)', 'Request Fitur (Popup, Pricing Table)', 'Integrasi Instagram Feed / YouTube', 'Speed Optimization (Lazy Load)', 'Desain Interaktif (Parallax)', '3 Email Bisnis & 5x Revisi Gratis', 'Garansi Maintenance 1,5 Bulan'],
                        ctaText: 'Order Sekarang'
                    }
                ],
                store: [
                    {
                        name: "Starter Store",
                        title: "Starter Store", // Added title to match interface
                        price: "Rp 2.500.000",
                        description: "Toko online simpel, katalog produk, checkout langsung ke WhatsApp.",
                        features: ["Gratis Domain .com", "Hosting Shared 6 Bulan", "Desain Responsif", "Tombol Beli via WA", "Max 20 Produk", "Revisi 2x", "Garansi 15 Hari"],
                        ctaText: "Pesan Sekarang"
                    },
                    {
                        name: "Growth Store",
                        title: "Growth Store", // Added title to match interface
                        price: "Rp 6.000.000",
                        isPopular: true,
                        description: "Toko profesional dengan fitur filter produk dan kategori lengkap.",
                        features: ["Hosting 1 Tahun", "5-7 Halaman", "Katalog s/d 100 Produk", "Fitur Search & Filter", "SEO Basic", "Revisi 3x", "Garansi 1 Bulan"],
                        ctaText: "Paling Laris"
                    },
                    {
                        name: "Ultimate Store",
                        title: "Ultimate Store", // Added title to match interface
                        price: "Rp 12.000.000",
                        description: "Sistem e-commerce lengkap dengan keranjang & pembayaran otomatis.",
                        features: ["Sistem Cart & Checkout", "Payment Gateway (Midtrans/Xendit)", "Hitung Ongkir Otomatis", "Dashboard Admin Lengkap", "Revisi 5x", "Garansi 1.5 Bulan"],
                        ctaText: "Konsultasi VIP"
                    }
                ],
                travel: [
                    {
                        name: "Starter Trip",
                        title: "Starter Trip", // Added title to match interface
                        price: "Rp 2.500.000",
                        description: "Landing page khusus promo paket wisata. Fokus konversi ke WA.",
                        features: ["1 Halaman Panjang", "Gratis Domain & Hosting", "Detail Itinerary & Harga", "Booking via WhatsApp", "Revisi 2x"],
                        ctaText: "Pesan Sekarang"
                    },
                    {
                        name: "Travel Agent",
                        title: "Travel Agent", // Added title to match interface
                        price: "Rp 5.000.000",
                        isPopular: true,
                        description: "Website travel agent full, menampilkan banyak pilihan destinasi.",
                        features: ["5-7 Halaman Utama", "Halaman Detail per Paket", "Fitur Search Paket Wisata", "Galeri Foto/Video", "Revisi 3x"],
                        ctaText: "Paling Laris"
                    },
                    {
                        name: "Travel System",
                        title: "Travel System", // Added title to match interface
                        price: "Rp 12.000.000",
                        description: "Website travel dengan sistem booking dan pembayaran online.",
                        features: ["Integrasi Payment Gateway", "Form Booking Otomatis", "Email Notifikasi Tiket", "Kalender Ketersediaan", "Revisi 5x"],
                        ctaText: "Hubungi Sales"
                    }
                ],
                seo: [
                    {
                        name: "SEO Starter",
                        title: "SEO Starter", // Added title to match interface
                        price: "Rp 2.000.000",
                        description: "Audit dasar agar website terbaca oleh Google.",
                        features: ["Riset 5 Keyword", "Setup Google Search Console", "Perbaikan Meta Title/Desc", "4 Artikel SEO", "Report Bulanan"],
                        ctaText: "Pilih Paket"
                    },
                    {
                        name: "SEO Growth",
                        title: "SEO Growth", // Added title to match interface
                        price: "Rp 3.500.000",
                        isPopular: true,
                        description: "Meningkatkan pengunjung organik dari pencarian Google.",
                        features: ["Riset 20 Keyword", "Optimasi Kecepatan Web", "8 Artikel SEO", "Optimasi 3 Halaman Utama", "Report Bulanan"],
                        ctaText: "Paling Laris"
                    },
                    {
                        name: "SEO Ultimate",
                        title: "SEO Ultimate", // Added title to match interface
                        price: "Rp 4.500.000",
                        description: "Dominasi kata kunci untuk bisnis skala menengah.",
                        features: ["Keyword Kompetitif", "20 Artikel SEO", "Optimasi Halaman Produk", "Strategi Backlink Basic", "Report Bulanan"],
                        ctaText: "Pilih Paket"
                    }
                ]
            },
            note: '*Harga belum termasuk materi konten (foto/teks). Perpanjangan domain/hosting tahun berikutnya ditanggung klien.'
        },
        process: {
            subtitle: 'Cara Kerja',
            title: 'Langkah Menuju Website Impian',
            description: 'Proses kerja yang transparan dan terukur untuk memastikan kualitas terbaik di setiap tahap pengembangan.',
            steps: [
                { title: 'Konsultasi & Deal', description: 'Diskusi mendalam mengenai kebutuhan bisnis Anda dan penentuan paket.' },
                { title: 'DP & Pengumpulan Materi', description: 'Pembayaran uang muka 50% dan pengiriman aset (logo, teks, foto).' },
                { title: 'Proses Pengerjaan', description: 'Koding dan desain dilakukan dengan update progres secara berkala.' },
                { title: 'Review & Revisi', description: 'Anda memeriksa hasil kerja dan mengajukan revisi jika diperlukan.' },
                { title: 'Lunas & Serah Terima', description: 'Pelunasan sisa 50%, penyerahan akses, dan website LIVE!' },
            ]
        },
        faq: {
            subtitle: 'FAQ',
            title: 'Pertanyaan Umum',
            description: 'Mungkin ini yang sedang Anda pikirkan. Masih bingung? Tanya langsung via WhatsApp.',
            items: [
                { question: 'Apakah harga sudah termasuk hosting dan domain?', answer: 'Ya, untuk paket Business ke atas, harga sudah termasuk biaya perpanjangan domain (.com) dan hosting premium selama 1 tahun pertama. Untuk paket Starter, hanya termasuk domain (.com).' },
                { question: 'Apakah saya bisa update konten website sendiri?', answer: 'Tentu. Kami menyediakan dashboard admin (CMS) yang user-friendly sehingga Anda bisa mengubah teks, gambar, atau menambahkan artikel blog tanpa perlu koding.' },
                { question: 'Bagaimana sistem pembayarannya?', answer: 'Sistem pembayaran kami menggunakan DP 50% di awal sebelum pengerjaan dimulai, dan pelunasan 50% setelah website selesai ditinjau namun sebelum serah terima akses penuh.' },
                { question: 'Apakah website saya akan tampil bagus di HP?', answer: 'Pasti. Semua website yang kami buat menggunakan prinsip "Mobile-First Design" yang menjamin tampilan responsif dan sempurna di smartphone, tablet, maupun desktop.' },
                { question: 'Berapa lama waktu pengerjaannya?', answer: 'Tergantung paket yang dipilih. Starter biasanya 3-5 hari kerja, Business 7-14 hari kerja, dan Enterprise bisa 1 bulan atau lebih tergantung tingkat kerumitan.' },
            ]
        },
        contact: {
            title: 'Siap Memulai',
            titleHighlight: 'Proyek Anda?',
            description: 'Jangan biarkan ide bisnis Anda menguap begitu saja. Konsultasikan secara gratis dan dapatkan penawaran terbaik hari ini.',
            whatsapp: 'Chat WhatsApp',
            email: 'Email Bisnis',
            form: {
                name: 'Nama',
                namePlaceholder: 'Budi Santoso',
                job: 'Pekerjaan',
                jobPlaceholder: 'Owner UMKM',
                package: 'Pilih Paket',
                message: 'Pesan / Detail Proyek',
                messagePlaceholder: 'Halo, saya ingin membuat website untuk...',
                submit: 'Kirim Penawaran'
            },
            copyright: '© 2024 LocaGo Creative. All rights reserved.',
        },
        whyUs: {
            subtitle: 'Kenapa Kami',
            title: 'Kenapa Memilih LocaGo Creative?',
            description: "Kami bukan hanya pembuat website, tapi partner digital yang peduli pertumbuhan bisnis Anda.",
            items: [
                {
                    title: 'Gratis Copywriting',
                    description: "Bingung menyusun kata-kata? Tim kami bantu buatkan konten marketing yang menjual."
                },
                {
                    title: 'Desain Modern & Mobile-Friendly',
                    description: "Tampilan website yang responsif dan nyaman diakses dari HP, Tablet, maupun Laptop."
                },
                {
                    title: 'Terima Beres (Domain + Hosting)',
                    description: "Tidak perlu pusing teknis. Kami urus domain, hosting, hingga website online."
                },
                {
                    title: 'Full Support & Garansi',
                    description: "Dukungan penuh pasca-pembuatan dan garansi teknis untuk ketenangan pikiran Anda."
                }
            ]
        },
        about: {
            subtitle: 'Tentang Kami',
            title: 'Tentang LocaGo Creative',
            description: "LocaGo Creative adalah layanan jasa pembuatan website profesional yang berfokus membantu UMKM dan pemilik bisnis lokal untuk Go Digital. Kami mengerti bahwa memiliki website saja tidak cukup. Oleh karena itu, kami hadir sebagai web developer partner Anda untuk membangun aset digital yang tidak hanya bagus secara visual, tapi juga mobile-friendly, cepat diakses, dan siap untuk optimasi SEO.",
            stats: {
                exp: 'Tahun Pengalaman',
                projects: 'Proyek Selesai'
            },
            cta: 'Konsultasi Sekarang'
        },
        footer: {
            tagline: 'Membangun masa depan digital, satu piksel setiap waktu.',
            quickLinks: 'Tautan Cepat',
            socials: 'Terhubung',
            contact: 'Hubungi Kami',
        }
    }
};

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: typeof translations.en;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>('id');

    // Simple getter for current translation
    const t = translations[language];

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
