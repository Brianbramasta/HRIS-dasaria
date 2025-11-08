# HRIS Project - Dokumentasi Struktur Folder

Project ini adalah aplikasi HRIS (Human Resource Information System) berbasis React TypeScript dengan Vite sebagai build tool.

## 📁 Struktur Folder Utama

### 🏠 Root Directory
```
d:\all progress code\Dasaria\HRIS\typscript/
├── .gitignore              # File konfigurasi Git ignore
├── README.md               # Dokumentasi utama project
├── db.json                 # Database JSON untuk json-server
├── eslint.config.js        # Konfigurasi ESLint
├── index.html              # Entry point HTML
├── json-server.json        # Konfigurasi JSON Server
├── package-lock.json       # Dependency lock file
├── package.json            # Project dependencies dan scripts
├── postcss.config.js       # Konfigurasi PostCSS
├── routes.json             # Routing untuk json-server
├── server.js               # Server backend untuk development
├── tsconfig*.json          # Konfigurasi TypeScript
└── vite.config.ts          # Konfigurasi Vite
```

### 📂 `public/` - Aset Statik
```
public/
├── favicon.png             # Icon website
└── images/                 # Folder gambar
    ├── brand/              # Logo dan brand assets
    ├── cards/              # Gambar untuk card components
    ├── carousel/           # Gambar untuk carousel
    ├── chat/               # Assets untuk fitur chat
    ├── country/            # Bendera negara
    ├── error/              # Gambar untuk halaman error
    ├── grid-image/         # Gambar untuk grid layout
    ├── icons/              # Icon-icon tambahan
    ├── logo/               # Logo perusahaan
    ├── product/            # Gambar produk
    ├── shape/              # Shape/shadow images
    ├── task/               # Icons untuk task management
    ├── user/               # Avatar dan user images
    └── video-thumb/        # Thumbnail video
```

### 📂 `src/` - Source Code Utama

#### 🧩 `src/components/` - Komponen Reusable
```
components/
├── UiExample/              # Contoh komponen UI
├── UserProfile/            # Komponen profil user
├── analytics/              # Komponen untuk analytics dashboard
├── auth/                   # Komponen autentikasi (login, register)
├── cards/                  # Card components reusable
├── charts/                 # Komponen chart dan grafik
├── chats/                  # Komponen untuk fitur chat
├── common/                 # Komponen umum yang sering digunakan
├── crm/                    # Komponen untuk CRM features
├── ecommerce/              # Komponen untuk fitur e-commerce
├── email/                  # Komponen untuk fitur email
├── faqs/                   # Komponen untuk FAQ section
├── file-manager/           # Komponen file manager
├── form/                   # Komponen form dan input
├── header/                 # Komponen header
├── invoice/                # Komponen untuk invoice
├── links/                  # Komponen untuk link management
├── list/                   # Komponen list dan table
├── marketing/              # Komponen untuk marketing tools
├── price-table/            # Komponen price table
├── saas/                   # Komponen untuk SaaS features
├── stocks/                 # Komponen untuk stock management
├── tables/                 # Komponen table yang kompleks
├── task/                   # Komponen untuk task management
└── ui/                     # Komponen UI dasar (button, modal, dll)
```

#### 🗂️ `src/context/` - React Context
```
context/
├── SidebarContext.tsx      # Context untuk sidebar state
└── ThemeContext.tsx        # Context untuk theme switching
```

#### 🎯 `src/feature/` - Fitur-Fitur Utama
```
feature/
├── auth/                   # Fitur autentikasi lengkap
├── staff/                  # Fitur manajemen staff/karyawan
├── structure-and-organize/ # Fitur untuk struktur organisasi
└── template/               # Template dan layout patterns
```

#### 🪝 `src/hooks/` - Custom Hooks
```
hooks/
├── useGoBack.ts            # Hook untuk navigation go back
└── useModal.ts             # Hook untuk modal state management
```

#### 🎨 `src/icons/` - SVG Icons
```
icons/
├── *.svg                   # Collection SVG icons
├── index.ts                # Export semua icons
├── alert.svg               # Icon alert/notification
├── calendar.svg            # Icon kalender
├── chat.svg                # Icon chat
├── check-circle.svg        # Icon check/success
├── close.svg               # Icon close/X
├── user-circle.svg         # Icon user profile
└── ... (50+ icons lainnya)
```

#### 📐 `src/layout/` - Layout Components
```
layout/
├── AppHeader.tsx           # Header utama aplikasi
├── AppLayout.tsx           # Layout wrapper utama
├── AppSidebar.tsx          # Sidebar navigation
├── Backdrop.tsx            # Backdrop component
└── SidebarWidget.tsx       # Widget untuk sidebar
```

#### 📄 `src/pages/` - Halaman Utama
```
pages/
├── AuthPages/              # Halaman login, register, forgot password
├── Blank.tsx               # Halaman kosong (template)
├── Calendar.tsx            # Halaman kalender
├── Charts/                 # Halaman charts dan dashboard
├── Chat/                   # Halaman chat/messaging
├── Dashboard/              # Halaman dashboard utama
├── Email/                  # Halaman email client
├── Faqs.tsx                # Halaman FAQ
├── FileManager.tsx         # Halaman file manager
├── Forms/                  # Halaman form dan input
├── Invoices.tsx            # Halaman invoice management
├── OtherPage/              # Halaman-halaman lainnya
├── PricingTables.tsx       # Halaman pricing
├── Tables/                 # Halaman data tables
├── Task/                   # Halapan task management
├── UiElements/             # Halaman UI components showcase
└── UserProfiles.tsx        # Halaman profil user
```

#### 🔧 `src/services/` - Services & API
```
services/
└── api.ts                  # Service untuk API calls dan data fetching
```

#### 📋 File-file Konfigurasi TypeScript
```
src/
├── svg.d.ts                # Type declarations untuk SVG imports
├── vite-env.d.ts           # Type declarations untuk Vite
├── index.css               # Global CSS styles
├── main.tsx                # Entry point aplikasi React
└── App.tsx                 # Root component
```

## 🎯 Kegunaan Utama Setiap Section

### Components (`src/components/`)
- **Reusable Components**: Semua komponen yang bisa dipakai ulang di seluruh aplikasi
- **Feature-specific Components**: Komponen khusus untuk fitur tertentu seperti CRM, e-commerce, dll
- **UI Components**: Komponen dasar seperti button, card, modal

### Features (`src/feature/`)
- **Modular Features**: Setiap fitur utama dibuat terpisah untuk maintainability
- **HRIS Core**: Fokus pada manajemen karyawan dan struktur organisasi
- **Authentication**: Sistem login dan otorisasi

### Pages (`src/pages/`)
- **Route-based Pages**: Setiap halamaan yang ada di routing aplikasi
- **Dashboard Variations**: Berbagai jenis dashboard untuk kebutuhan berbeda
- **Management Pages**: Halaman untuk manajemen data (user, task, invoice, dll)

### Layout (`src/layout/`)
- **Consistent Layout**: Layout yang konsisten di seluruh aplikasi
- **Responsive Design**: Layout yang adaptif untuk berbagai screen size
- **Navigation**: Sistem navigasi yang terpusat

## 🔧 Teknologi yang Digunakan
- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS (diasumsikan dari postcss.config.js)
- **State Management**: React Context
- **Mock API**: JSON Server
- **Linting**: ESLint
- **Icons**: SVG dengan custom index

## 📈 Skalabilitas
Struktur folder ini dirancang untuk:
- **Easy Maintenance**: Setiap fitur terpisah dan terorganisir
- **Team Collaboration**: Struktur yang jelas memudahkan kolaborasi tim
- **Feature Scaling**: Mudah menambahkan fitur baru
- **Component Reusability**: Komponen bisa dipakai di berbagai tempat

---

*Dokumentasi ini berisi struktur folder dan kegunaannya untuk project HRIS TypeScript React.*