import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'id';

export const translations = {
    en: {
        nav: {
            home: 'Home',
            services: 'Services',
            portfolio: 'Portfolio',
            pricing: 'Calculator',
            process: 'Process',
            contact: 'Contact',
            about: 'About',
            demo: 'Live Demo',
        },
        hero: {
            badge: '99+ Digital Projects Delivered',
            titleStart: 'One Digital Ecosystem.',
            titleGradient: 'Unlimited Automation',
            titleEnd: 'for Business, Schools & You.',
            description: 'Trusted across 99+ digital projects. We design & build Premium Websites, WhatsApp AI Automation, and Custom Systems that save up to 80% operational time. We never turn away any budget, as our core mission is empowering MSMEs and individuals to confidently go digital with custom technology.',
            ctaStart: 'Consult & Check Offer',
            ctaPortfolio: 'Consult with AI',
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
            tabBusiness: 'Business & UMKM',
            tabSchool: 'School & Teachers',
            tabPersonal: 'Personal & Students',
            sectionBadge: 'Multi-Segment Services',
            sectionTitle: 'Handcrafted Digital Solutions',
            sectionDescription: 'Handcrafted custom solutions tailored to your scale — whether you are a business owner, educator, or student.',
            viewCalculator: 'View Investment Calculator',
            bottomHelp: "Didn't find what you need? Tell us your specific requirements.",
            bottomCta: 'Discuss Custom Requirements',
            business: [
                { title: 'Landing Page / E-Commerce', description: 'High-conversion pages & complete online stores with Midtrans/Mayar payment gateway integration.', icon: '🛒' },
                { title: 'Omnichannel AI Chatbot', description: 'WhatsApp AI automation that serves customers 24/7, handles orders & answers FAQs automatically.', icon: '🤖' },
                { title: 'Payment Gateway Integration', description: 'Seamless integration with Midtrans, Mayar, Xendit for automated payment processing.', icon: '💳' },
            ],
            school: [
                { title: 'QR Attendance + WA Alert', description: 'Digital QR code attendance system with automatic WhatsApp notifications to parents.', icon: '📱' },
                { title: 'Digital Savings App', description: 'Student digital savings management system with transaction history & admin dashboard.', icon: '💰' },
                { title: 'AI RPS Generator', description: 'Instantly generate Lesson Plans (RPS/RPP) automatically using AI — save hours of teacher time.', icon: '📚' },
            ],
            personal: [
                { title: 'Google Apps Script + CSV Automation', description: 'Automate your Google Sheets workflows, data processing & report generation with custom scripts.', icon: '⚙️' },
                { title: 'Desktop / Mobile App', description: 'Offline desktop software (Python/Electron) and Android mobile apps for specific business needs.', icon: '💻' },
                { title: 'Coding Task Assistance', description: 'Technical help for student projects, thesis coding, algorithm debugging & rapid prototyping.', icon: '🎯' },
            ],
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
            title: 'Steps to Your Custom Digital Asset',
            description: 'Transparent, measured, and 100% handcrafted workflow with zero generic templates.',
            steps: [
                { title: 'Consultation & Strategy', description: 'In-depth discussion on business workflows, essential features, and flexible investment allocations.' },
                { title: 'Down Payment & Materials', description: '50% initial commitment to secure your development slot and submission of project assets (logo, copy, photos).' },
                { title: 'Handcrafted Coding from Scratch', description: 'Clean custom code built from zero (Zero Template Policy) with regular progress updates via live staging preview.' },
                { title: 'Review & Refinement', description: 'Interactive testing, mobile speed optimization, and focused refinement session to ensure exact alignment.' },
                { title: 'Go-Live & Ownership Handover', description: 'Final 50% settlement, full access handover (domain/hosting/source code), and system goes LIVE 100% ready!' },
            ]
        },
        faq: {
            subtitle: 'FAQ',
            title: 'Frequently Asked Questions',
            description: 'Clear answers to our development workflow, investments, and custom technology solutions.',
            items: [
                { question: 'Does LocaGo Creative use WordPress or website templates?', answer: 'Never! We strictly enforce a Zero Template Policy. Every single website and digital system is built 100% from scratch with clean, lightweight custom code. This ensures maximum security, blazing-fast speed, exclusive tailored aesthetics, and full flexibility without the bloat or security vulnerabilities of WordPress themes.' },
                { question: 'Is it true that investments starting from Rp 1.5M include domain and hosting for a year?', answer: 'Yes, absolutely! For essential projects starting from Rp 1.5M - Rp 1.8M (such as One-Page Landing Pages, Company Profiles, or direct WhatsApp Commerce catalogs), the package ALREADY INCLUDES official .com domain registration and 1 full year of managed cloud hosting. We deliver a ready-to-run asset with zero technical headaches.' },
                { question: 'How does the AI Investment & Budget Consultant work?', answer: 'Our interactive AI assistant (powered by Groq) analyzes your specific business scale, required features, and budget target in real-time. It provides transparent estimates and win-win solutions without rigid barrier pricing, then generates an official ticket for direct negotiation and scheduling with Mas Fahmi (Founder & Lead Developer) on WhatsApp.' },
                { question: 'What is the difference between WhatsApp Commerce and Pro Online Stores?', answer: 'WhatsApp Commerce (Rp 1.5M - Rp 1.9M) features a modern product catalog where customer checkouts redirect seamlessly to WhatsApp with automated order summaries — ideal for fast sales without payment gateway transaction fees. Pro Online Stores (Rp 3.5M+) feature self-service cart checkouts, real-time courier shipping calculators, automated QRIS/Virtual Account gateways (Midtrans), and an admin inventory management dashboard.' },
                { question: 'How does the WhatsApp AI Automation Chatbot work?', answer: 'Our AI Chatbot connects custom AI models with WhatsApp to handle customer inquiries 24/7, process incoming orders, answers FAQs, and save data directly into Google Sheets, with seamless human agent escalation when needed.' },
                { question: 'What is the payment terms and project turnaround time?', answer: 'We operate on a 50% down payment to initiate development and 50% final payment upon completion and handover. Essential landing pages and company profiles are delivered rapidly within 3 to 5 business days. Advanced e-commerce and AI automations typically take 1 to 3 weeks depending on feature scope.' },
            ]
        },
        contact: {
            title: 'Ready to Build',
            titleHighlight: 'Your Digital Asset?',
            description: "Don't let your business vision stay on paper. Consult for free and secure your exclusive development slot today.",
            whatsapp: 'WhatsApp Consultation',
            email: 'Business Email',
            location: 'Garut, West Java, Indonesia',
            form: {
                name: 'Your Name',
                namePlaceholder: 'John Doe',
                job: 'Occupation / Business',
                jobPlaceholder: 'e.g. UMKM Owner, Clinic, Travel',
                phone: 'WhatsApp Number',
                email: 'Email Address',
                package: 'Project Interest',
                message: 'Message / Project Details',
                messagePlaceholder: 'Hello, I want to develop a custom system for...',
                submit: 'Send Inquiry & Consult'
            },
            copyright: '© 2026 LocaGo Creative. All rights reserved.',
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
            description: "LocaGo Creative is a modern software house and web development studio focused on helping businesses, schools, and individuals achieve digital transformation through 100% custom-built solutions without generic templates.",
            stats: {
                exp: 'Years Experience',
                projects: 'Projects Delivered'
            },
            cta: 'Consult Now'
        },
        footer: {
            tagline: 'Building high-converting digital assets, one line of code at a time.',
            quickLinks: 'Quick Links',
            socials: 'Connect',
            contact: 'Contact Us',
            location: 'Based in Garut, West Java, Indonesia',
        },
        demo: {
            badge: '⚡ Live Demo',
            title: 'Try Our AI System',
            titleHighlight: 'Right Now',
            description: 'Ask our AI anything about our services, pricing, or how we can help your project.',
            chatPlaceholder: 'Ask about our services, pricing, or your project...',
            chatSend: 'Send',
            chatWelcome: 'Hello! 👋 I am LocaGo Creative virtual assistant. How can I help you today? You can ask about our services, pricing estimates, or anything else!',
            featuresTitle: 'System Capabilities',
            demoMode: '🎭 Demo Mode (Add GROQ API key for live AI)',
            features: [
                { title: 'GAS + CSV Processing', desc: 'Automated Google Apps Script & spreadsheet data processing', emoji: '⚙️' },
                { title: 'Auto Attendance Notif', desc: 'QR Code scan triggers instant WhatsApp alert to parents', emoji: '📱' },
                { title: 'WhatsApp Chatbot Flow', desc: 'AI-powered conversational bot for customer service 24/7', emoji: '🤖' },
                { title: 'School Admin Dashboard', desc: 'Complete management system for digital savings & reports', emoji: '📊' },
            ]
        },
        calculator: {
            badge: '🧮 Smart Calculator',
            title: 'Build Your Custom System',
            titleHighlight: 'We Quote Automatically',
            description: 'Select your profile and desired features. Our AI will calculate a fair estimate and send it directly to WhatsApp for negotiation.',
            profileLabel: 'Your Profile',
            profileOptions: [
                { value: 'corporate', label: '🏢 Corporate / Company' },
                { value: 'umkm', label: '🏪 UMKM / Small Business' },
                { value: 'school', label: '🏫 School / Educational Institution' },
                { value: 'personal', label: '👨‍🎓 Personal / Student' },
            ],
            featuresLabel: 'Features Needed',
            features: [
                { id: 'landing', label: 'Landing Page / Company Profile' },
                { id: 'ecommerce', label: 'Online Store / E-Commerce' },
                { id: 'chatbot', label: 'AI WhatsApp Chatbot' },
                { id: 'attendance', label: 'QR Attendance System' },
                { id: 'savings', label: 'Digital School Savings App' },
                { id: 'rps', label: 'AI RPS/RPP Generator' },
                { id: 'gas', label: 'Google Apps Script Automation' },
                { id: 'mobile', label: 'Mobile App (Android)' },
                { id: 'desktop', label: 'Desktop Software (Offline)' },
            ],
            budgetLabel: 'Your Budget Target (Rp)',
            budgetPlaceholder: 'e.g. 3000000',
            submitBtn: 'Calculate with AI & Start Negotiation 🚀',
            calculating: 'AI is calculating your estimate...',
            resultTitle: '✅ AI Estimate Ready!',
            sendWA: 'Send to WhatsApp & Start Negotiation',
        }
    },
    id: {
        nav: {
            home: 'Beranda',
            services: 'Layanan',
            portfolio: 'Portofolio',
            pricing: 'Kalkulator',
            process: 'Proses',
            contact: 'Kontak',
            about: 'Tentang',
            demo: 'Demo Langsung',
        },
        hero: {
            badge: '99+ Proyek Digital Telah Selesai',
            titleStart: 'Satu Ekosistem Digital.',
            titleGradient: 'Otomatisasi Tanpa Batas',
            titleEnd: 'untuk Bisnis, Sekolah, dan Tugas Anda.',
            description: 'Dipercaya menangani 99+ proyek digital. Kami merancang & membangun Website Premium, WhatsApp AI Automation, dan Sistem Administrasi Kustom yang menghemat waktu operasional hingga 80%. Kami tidak pernah menolak berapa pun budget Anda, karena komitmen utama kami adalah membantu UMKM dan individu untuk sukses go digital bersama solusi teknologi yang tepat.',
            ctaStart: 'Konsultasi & Cek Penawaran',
            ctaPortfolio: 'Konsultasi Bersama AI',
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
            tabBusiness: 'Bisnis & UMKM',
            tabSchool: 'Sekolah & Guru',
            tabPersonal: 'Perorangan & Mahasiswa',
            sectionBadge: 'Layanan Multi-Segmen',
            sectionTitle: 'Solusi Digital Kustom & Presisi',
            sectionDescription: 'Solusi koding dari nol yang dirancang khusus sesuai kebutuhan Anda — apakah Anda pelaku bisnis, pendidik, atau pelajar.',
            viewCalculator: 'Lihat Kalkulator Investasi',
            bottomHelp: 'Tidak menemukan yang Anda butuhkan? Ceritakan kebutuhan spesifik Anda.',
            bottomCta: 'Diskusi Kebutuhan Custom',
            business: [
                { title: 'Landing Page / E-Commerce', description: 'Halaman konversi tinggi & toko online lengkap dengan integrasi payment gateway Midtrans/Mayar.', icon: '🛒' },
                { title: 'Omnichannel AI Chatbot', description: 'Otomasi WhatsApp AI yang melayani pelanggan 24/7, memproses pesanan & menjawab FAQ secara otomatis.', icon: '🤖' },
                { title: 'Integrasi Payment Gateway', description: 'Integrasi seamless dengan Midtrans, Mayar, Xendit untuk proses pembayaran yang otomatis.', icon: '💳' },
            ],
            school: [
                { title: 'Presensi QR Code + WA Alert', description: 'Sistem absensi digital berbasis QR Code dengan notifikasi WhatsApp otomatis ke wali murid.', icon: '📱' },
                { title: 'Aplikasi Tabungan Digital', description: 'Sistem manajemen tabungan siswa digital dengan riwayat transaksi & dashboard admin.', icon: '💰' },
                { title: 'AI Generator RPS Instan', description: 'Generate Rencana Pembelajaran (RPS/RPP) secara otomatis menggunakan AI — hemat jam kerja guru.', icon: '📚' },
            ],
            personal: [
                { title: 'Otomasi Google Apps Script + CSV', description: 'Otomatisasi alur kerja Google Sheets, pemrosesan data & pembuatan laporan dengan script kustom.', icon: '⚙️' },
                { title: 'Aplikasi Desktop / Mobile', description: 'Software desktop offline (Python/Electron) dan aplikasi Android mobile untuk kebutuhan spesifik.', icon: '💻' },
                { title: 'Bantuan Tugas Coding', description: 'Bantuan teknis untuk proyek mahasiswa, koding skripsi, debugging algoritma & prototyping cepat.', icon: '🎯' },
            ],
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
            title: 'Langkah Membangun Aset Digital Anda',
            description: 'Alur kerja yang transparan, terukur, dan 100% koding kustom dari nol tanpa template pasaran.',
            steps: [
                { title: 'Konsultasi & Strategi', description: 'Diskusi mendalam alur bisnis, pemetaan fitur esensial berdampak tinggi, dan kesepakatan alokasi investasi yang fleksibel.' },
                { title: 'DP & Pengumpulan Materi', description: 'Komitmen awal 50% untuk mengamankan slot antrean dan penyerahan materi awal (logo, teks profil, foto produk/layanan).' },
                { title: 'Koding Handcrafted Murni dari 0', description: 'Pengembangan kode custom (Zero Template Policy) yang ringan dan aman, disertai laporan progres berkala via link staging preview.' },
                { title: 'Review & Penyempurnaan Terfokus', description: 'Uji coba performa di smartphone, penyesuaian fungsionalitas, dan sesi penyempurnaan agar sistem tepat sasaran.' },
                { title: 'Go-Live & Serah Terima Aset', description: 'Pelunasan 50%, penyerahan akses akun/domain/hosting, dan website 100% resmi online siap menjadi mesin penjualan Anda!' },
            ]
        },
        faq: {
            subtitle: 'FAQ',
            title: 'Pertanyaan yang Sering Diajukan',
            description: 'Jawaban jelas seputar alur pembuatan, skema investasi, dan solusi teknologi kustom dari LocaGo Creative.',
            items: [
                { question: 'Apakah LocaGo Creative menggunakan template WordPress atau tema pasaran?', answer: 'Sama sekali tidak! Kami memegang teguh ZERO TEMPLATE POLICY. Seluruh website dan sistem kami dibangun 100% murni dari nol (handcrafted custom code). Hasilnya jauh lebih cepat diakses di smartphone, aman dari celah malware WordPress, berdesain eksklusif, dan memiliki source code bersih yang mudah dikembangkan.' },
                { question: 'Apakah benar investasi mulai Rp 1,5 Juta sudah termasuk domain dan hosting setahun?', answer: 'Benar sekali! Untuk proyek skala esensial mulai Rp 1.500.000 - Rp 1.900.000 (seperti One-Page Landing Page, Company Profile bisnis, atau katalog produk), paket SUDAH TERMASUK DOMAIN RESMI (.com) & CLOUD HOSTING SELAMA 1 TAHUN PENUH. Klien terima beres tanpa perlu pusing urusan server teknis.' },
                { question: 'Bagaimana cara kerja Konsultasi & Kalkulator Bersama AI?', answer: 'Asisten AI kami (bertenaga Groq) menganalisis profil bisnis, kebutuhan fitur, dan target anggaran Anda secara cerdas. AI akan memberikan estimasi investasi yang adil tanpa batasan kaku, lalu mengamankan tiket resmi untuk difinalisasi dan dinegosiasikan langsung bersama Mas Fahmi (Founder & Lead Developer) via WhatsApp.' },
                { question: 'Apa perbedaan Toko Online WhatsApp Commerce dengan Toko Online Pro?', answer: 'WhatsApp Commerce (Rp 1.5jt - Rp 1.9jt) memiliki katalog produk modern di mana saat pembeli klik beli, format pesanan otomatis terisi langsung ke chat WhatsApp admin — sangat praktis, cepat closing, dan bebas potongan biaya gateway. Toko Online Pro (Rp 3.5jt ke atas) memiliki sistem keranjang belanja mandiri, cek ongkir ekspedisi otomatis, payment gateway QRIS/Virtual Account (Midtrans), dan dashboard admin pengelola stok.' },
                { question: 'Bagaimana cara kerja AI Chatbot WhatsApp Otomatis?', answer: 'Chatbot AI kami menghubungkan WhatsApp Business dengan model kecerdasan buatan untuk melayani pelanggan 24 jam nonstop, memproses pemesanan, menjawab FAQ seputar produk, dan merekap data ke Google Sheets, dengan kemampuan pengalihan ke admin manusia jika ada pertanyaan khusus.' },
                { question: 'Bagaimana sistem pembayaran dan berapa lama estimasi waktu pengerjaan?', answer: 'Kami menerapkan sistem DP 50% di awal untuk mengamankan slot pengerjaan dan pelunasan 50% setelah website selesai serta disetujui. Untuk Landing Page atau Company Profile esensial selesai kilat dalam 3 sampai 5 hari kerja. Untuk toko online dan sistem kustom berkisar 1 sampai 3 minggu.' },
            ]
        },
        contact: {
            title: 'Siap Memulai',
            titleHighlight: 'Proyek Anda?',
            description: 'Jangan biarkan ide bisnis Anda menguap begitu saja. Konsultasikan secara gratis dan dapatkan penawaran terbaik hari ini.',
            whatsapp: 'Konsultasi WhatsApp',
            email: 'Email Bisnis',
            location: 'Garut, Jawa Barat, Indonesia',
            form: {
                name: 'Nama Lengkap',
                namePlaceholder: 'Budi Santoso',
                job: 'Pekerjaan / Bisnis',
                jobPlaceholder: 'cth: Owner UMKM, Klinik, Travel',
                phone: 'No. WhatsApp',
                email: 'Alamat Email',
                package: 'Minat Proyek',
                message: 'Pesan / Detail Kebutuhan',
                messagePlaceholder: 'Halo, saya ingin membuat sistem digital untuk...',
                submit: 'Kirim Penawaran & Konsultasi'
            },
            copyright: '© 2026 LocaGo Creative. All rights reserved.',
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
            description: "LocaGo Creative adalah software house dan web development studio modern yang berfokus membantu UMKM, sekolah, dan profesional bertransformasi digital melalui solusi koding 100% custom dari nol tanpa template instan.",
            stats: {
                exp: 'Tahun Pengalaman',
                projects: 'Proyek Selesai'
            },
            cta: 'Konsultasi Sekarang'
        },
        footer: {
            tagline: 'Membangun aset digital berkonversi tinggi, baris demi baris kode.',
            quickLinks: 'Tautan Cepat',
            socials: 'Terhubung',
            contact: 'Hubungi Kami',
            location: 'Berbasis di Garut, Jawa Barat, Indonesia',
        },
        demo: {
            badge: '⚡ Live Demo',
            title: 'Coba Sistem AI Kami',
            titleHighlight: 'Langsung Sekarang',
            description: 'Tanya apa saja tentang layanan kami, estimasi harga, atau bagaimana kami bisa membantu proyek Anda.',
            chatPlaceholder: 'Tanya tentang layanan, harga, atau proyek Anda...',
            chatSend: 'Kirim',
            chatWelcome: 'Halo! 👋 Saya asisten virtual LocaGo Creative. Ada yang bisa saya bantu hari ini? Tanya saja tentang layanan, estimasi harga, atau kebutuhan sistem digital Anda!',
            featuresTitle: 'Kemampuan Sistem Kami',
            demoMode: '🎭 Mode Demo (Tambahkan GROQ API key untuk AI live)',
            features: [
                { title: 'GAS + CSV Processing', desc: 'Pemrosesan data Google Sheets & otomasi script otomatis', emoji: '⚙️' },
                { title: 'Notif Absensi Otomatis', desc: 'Scan QR Code memicu alert WhatsApp instan ke orang tua', emoji: '📱' },
                { title: 'WhatsApp Chatbot Flow', desc: 'Bot percakapan AI untuk layanan pelanggan 24/7', emoji: '🤖' },
                { title: 'Dashboard Admin Sekolah', desc: 'Sistem manajemen tabungan & laporan digital lengkap', emoji: '📊' },
            ]
        },
        calculator: {
            badge: '🧮 Kalkulator Cerdas',
            title: 'Bangun Sistem Kustom Anda,',
            titleHighlight: 'Kami Hitung Otomatis',
            description: 'Pilih profil dan fitur yang diinginkan. AI kami akan menghitung estimasi yang adil dan mengirimkannya langsung ke WhatsApp untuk negosiasi.',
            profileLabel: 'Profil Anda',
            profileOptions: [
                { value: 'corporate', label: '🏢 Korporat / Perusahaan' },
                { value: 'umkm', label: '🏪 UMKM / Bisnis Kecil' },
                { value: 'school', label: '🏫 Sekolah / Institusi Pendidikan' },
                { value: 'personal', label: '👨‍🎓 Perorangan / Mahasiswa' },
            ],
            featuresLabel: 'Fitur yang Diinginkan',
            features: [
                { id: 'landing', label: 'Landing Page / Company Profile' },
                { id: 'ecommerce', label: 'Toko Online / E-Commerce' },
                { id: 'chatbot', label: 'AI Chatbot WhatsApp' },
                { id: 'attendance', label: 'Sistem Presensi QR Code' },
                { id: 'savings', label: 'Aplikasi Tabungan Digital Sekolah' },
                { id: 'rps', label: 'AI Generator RPS/RPP' },
                { id: 'gas', label: 'Otomasi Google Apps Script' },
                { id: 'mobile', label: 'Aplikasi Mobile (Android)' },
                { id: 'desktop', label: 'Software Desktop (Offline)' },
            ],
            budgetLabel: 'Target Anggaran Anda (Rp)',
            budgetPlaceholder: 'cth. 3000000',
            submitBtn: 'Hitung dengan AI & Mulai Negosiasi 🚀',
            calculating: 'AI sedang menghitung estimasi Anda...',
            resultTitle: '✅ Estimasi AI Siap!',
            sendWA: 'Kirim ke WhatsApp & Mulai Negosiasi',
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
