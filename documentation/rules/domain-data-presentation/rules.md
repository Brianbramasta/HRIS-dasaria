# 🧱 Feature-Based Clean Architecture Rules

## 📌 Overview

Struktur ini menggabungkan **Clean Architecture (layer separation)** dengan **Feature-based structure (modular per domain bisnis)** untuk menciptakan sistem yang scalable, maintainable, dan kolaboratif.

---

# 📁 Struktur Folder Wajib

```bash
src/
│
├── features/
│   ├── [feature-name]/
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   └── *.ts
│   │   │   └── usecases/
│   │   │       └── *.ts
│   │   │
│   │   ├── data/
│   │   │   ├── models/
│   │   │   │   └── *.ts
│   │   │   ├── services/
│   │   │   │   └── *.ts
│   │   │   └── repositories/
│   │   │       └── *.ts
│   │   │
│   │   ├── presentation/
│   │   │   ├── hooks/
│   │   │   │   └── *.ts
│   │   │   ├── components/
│   │   │   │   ├── *.tsx
│   │   │   │   └── index.ts
│   │   │   └── pages/
│   │   │       └── *.tsx
│   │   │
│   │   └── index.ts
│
├── infrastructure/
│   └── api/
│       ├── apiClient.ts
│       └── endpoints.ts
│
├── shared/
│   ├── types/
│   │   └── *.ts
│   ├── utils/
│   │   └── *.ts
│   └── components/
│       ├── *.tsx
│       └── index.ts
│
├── App.tsx
├── main.tsx
└── vite-env.d.ts
```

---

# 🎯 Core Principles

## 1. Feature Independence
Setiap feature adalah **mini clean architecture** yang tidak bergantung pada feature lain.

## 2. Layer Separation
Setiap feature memiliki 3 layer utama dengan tanggung jawab jelas:
- **Domain**: Business logic & entities
- **Data**: API calls & data transformation  
- **Presentation**: UI components & hooks

## 3. Dependency Direction
Dependencies hanya boleh mengalir dari luar ke dalam:
```
Presentation → Domain ← Data
```

---

# 📋 Aturan Wajib Per Layer

## 🧠 Domain Layer (`domain/`)

### ✅ BOLEH:
- Definisikan business entities
- Tulis usecases (business logic)
- Buat interfaces untuk repositories
- Export types murni tanpa implementasi

### ❌ DILARANG:
- Import React hooks
- Import API services
- Import UI components
- Akses localStorage atau API langsung

### 📝 Contoh Benar:
```ts
// domain/entities/Karyawan.ts
export interface Karyawan {
  id: string
  nama: string
  jabatan: string
}

// domain/usecases/getKaryawan.ts
export const getKaryawan = (repo: KaryawanRepository) => {
  return repo.getAll()
}
```

## 💾 Data Layer (`data/`)

### ✅ BOLEH:
- Import API dari infrastructure
- Transform data (models)
- Implement repositories
- Handle HTTP requests

### ❌ DILARANG:
- Import React hooks
- Import UI components
- Import dari feature lain

### 📝 Contoh Benar:
```ts
// data/services/fetchKaryawan.ts
import { apiClient } from "@/infrastructure/api/apiClient"

export const fetchKaryawan = () => {
  return apiClient("/karyawan")
}

// data/repositories/karyawanRepository.ts
import { fetchKaryawan } from "../services/fetchKaryawan"
import { mapKaryawan } from "../models/mapKaryawan"

export const karyawanRepository = {
  getAll: async () => {
    const data = await fetchKaryawan()
    return data.map(mapKaryawan)
  }
}
```

## 🎨 Presentation Layer (`presentation/`)

### ✅ BOLEH:
- Import React hooks & components
- Import dari domain layer (usecases)
- Import dari shared components
- Import dari infrastructure API

### ❌ DILARANG:
- Import langsung dari data layer
- Import dari feature lain
- Taruh business logic di components

### 📝 Contoh Benar:
```ts
// presentation/hooks/useKaryawan.ts
import { useEffect, useState } from "react"
import { getKaryawan } from "../../domain/usecases/getKaryawan"
import { karyawanRepository } from "../../data/repositories/karyawanRepository"

export const useKaryawan = () => {
  const [data, setData] = useState([])

  useEffect(() => {
    getKaryawan(karyawanRepository).then(setData)
  }, [])

  return { data }
}
```

---

# 🔗 Cross-Feature Communication Rules

## ❌ DILARANG: Direct Feature Import
```ts
// SALAH - JANGAN LAKUKAN INI
import { something } from "@/features/penggajian"
```

## ✅ BOLEH: Melalui Shared Layer
```ts
// BENAR - Gunakan shared
import { PaginationType } from "@/shared/types"
import { Button } from "@/shared/components"
```

## ✅ BOLEH: Melalui Infrastructure
```ts
// BENAR - API calls tetap melalui infrastructure
import { apiClient } from "@/infrastructure/api/apiClient"
```

---

# 📁 File Naming Conventions

## 🇬🇧 Language Rules
**Semua penamaan WAJIB menggunakan bahasa Inggris** untuk:
- File names
- Folder names  
- Function names
- Variable names
- Component names

## Files
- **Selalu menggunakan huruf besar di awal (PascalCase)**
- Contoh: `AddStaffModals.tsx`, `DataTable.tsx`, `UserManagement.tsx`
- Index files: `index.ts` untuk re-exports

## Folders
- **Selalu menggunakan huruf kecil**
- **Multi-kata gunakan '-' (dash) separator**
- Contoh: `user-management`, `data-table`, `structure-and-organize`

## Functions
- **Selalu menggunakan huruf besar di awal (PascalCase)**
- Contoh: `FormatDate()`, `CalculateSalary()`, `ValidateUser()`

## Variables
- **Selalu menggunakan huruf kecil**
- **Multi-kata gunakan '_' (underscore) separator**
- Contoh: `staff_status`, `user_data`, `api_response`

## Specific File Types

### Components
- PascalCase: `AddStaffModals.tsx`, `DataTable.tsx`

### Hooks  
- PascalCase dengan "Use" prefix: `UseUserData.ts`, `UsePagination.ts`

### Services
- PascalCase: `FetchStaff.ts`, `CalculateGaji.ts`

### Types/Models
- PascalCase: `Staff.ts`, `GajiModel.ts`

### Pages
- PascalCase dengan "Page" suffix: `StaffPage.tsx`, `GajiPage.tsx`

---

# 🔄 Import Path Rules

## Gunakan Alias Path
```ts
// BENAR
import { Karyawan } from "@/features/karyawan/domain/entities/Karyawan"
import { Button } from "@/shared/components"
import { formatDate } from "@/shared/utils"

// SALAH
import { Karyawan } from "../../../../features/karyawan/domain/entities/Karyawan"
```

## Feature Public API
Setiap feature wajib punya `index.ts` sebagai public API:

```ts
// features/karyawan/index.ts
export * from "./presentation/pages/KaryawanPage"
export * from "./presentation/hooks/useKaryawan"
```

---

# 🧪 Testing Rules

## Test Structure
```bash
features/
├── karyawan/
│   ├── domain/
│   │   └── __tests__/
│   │       └── getKaryawan.test.ts
│   ├── data/
│   │   └── __tests__/
│   │       └── karyawanRepository.test.ts
│   └── presentation/
│       └── __tests__/
│           └── useKaryawan.test.ts
```

## Test Priorities
1. **Domain Layer**: Business logic testing
2. **Data Layer**: Repository & service testing  
3. **Presentation Layer**: Hook & component testing

---

# 🚀 Best Practices

## 1. Dependency Injection
Selalu inject dependencies ke usecases:
```ts
export const getKaryawan = (repo: KaryawanRepository) => {
  return repo.getAll()
}
```

## 2. Error Handling
Centralized error handling di infrastructure layer:
```ts
// infrastructure/api/errorHandler.ts
export const handleApiError = (error: any) => {
  // Centralized error logic
}
```

## 3. Type Safety
Gunakan TypeScript strict mode:
- Hindari `any` types
- Buat proper interfaces
- Gunakan generics untuk reusable types

## 4. Performance
- Lazy loading untuk feature routes
- Memoization untuk expensive computations
- Proper dependency arrays di useEffect

---

# ⚠️ Common Mistakes to Avoid

## 1. Business Logic di UI
```ts
// SALAH
const KaryawanPage = () => {
  const [karyawan, setKaryawan] = useState([])
  
  useEffect(() => {
    fetch("/karyawan").then(setKaryawan) // Business logic di UI
  }, [])
}
```

## 2. Tight Coupling
```ts
// SALAH - Feature bergantung langsung
import { PenggajianComponent } from "@/features/penggajian"
```

## 3. Violating Layer Rules
```ts
// SALAH - Domain mengimport React
import { useState } from "react" // Di domain layer!
```

---

# 📊 Code Review Checklist

## Feature Structure
- [ ] Folder structure sesuai template
- [ ] Index.ts sebagai public API
- [ ] Tidak ada cross-feature direct imports

## Layer Compliance  
- [ ] Domain tidak import React/API
- [ ] Data tidak import React/UI
- [ ] Presentation tidak import data layer langsung

## Code Quality
- [ ] TypeScript strict mode
- [ ] Proper error handling
- [ ] Unit tests untuk critical logic
- [ ] Documentation untuk complex logic

---

# 🎯 When to Use This Structure

## ✅ Cocok untuk:
- Project dengan >1 fitur besar
- Tim development >2 orang
- Project yang perlu scaling
- Long-term maintenance projects

## ❌ Tidak Cocok untuk:
- Simple CRUD apps
- Prototype/proof of concept
- Single developer projects dengan scope kecil

---

# 🔧 Migration Strategy

## Step 1: Setup Structure
Buat folder structure sesuai template

## Step 2: Move Existing Code
Pindahkan code ke appropriate layers

## Step 3: Refactor Dependencies
Hapus cross-feature dependencies

## Step 4: Add Tests
Implement unit tests per layer

## Step 5: Optimize
Add lazy loading, error handling, etc.

---

# 📝 Conclusion

Struktur ini adalah investasi untuk long-term maintainability. Meskipun terasa rigid di awal, ini akan mempermudah scaling dan collaboration saat project berkembang.

**Key takeaway: "Feature boundaries" lebih penting daripada sekadar folder structure.**

---

*Last updated: 2026-04-25*