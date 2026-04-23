# Task: update kasbon - detail karyawan
Tanggal: 23 april 2026 16:32

---

## Checklist:

### 1. Create DTO Types
- [x] Create `PayrollHistoryItemDTO` interface for payroll API response
- [x] Create `KasbonHistoryItemDTO` interface for kasbon API response
- [x] Create `PayrollHistoryResponseDTO` interface for payroll response structure
- [x] Create `KasbonHistoryResponseDTO` interface for kasbon response structure

### 2. Create Entity Types  
- [x] Create `PayrollHistoryEntity` interface for internal app structure
- [x] Create `KasbonHistoryEntity` interface for internal app structure
- [x] Create `PayrollHistoryListEntity` interface for list with pagination
- [x] Create `KasbonHistoryListEntity` interface for list with pagination

### 3. Create Model (Mapping)
- [x] Create `PayrollHistoryModel.ts` with mapping functions
- [x] Map payroll DTO to Entity format
- [x] Map kasbon DTO to Entity format
- [x] Handle null safety checks
- [x] Handle array transformations

### 4. Create Repository
- [x] Create `payrollHistoryRepository.ts`
- [x] Implement `getPayrollHistory` method with new mapping
- [x] Implement `getKasbonHistory` method with new mapping
- [x] Use service and model for data transformation
- [x] Add error handling

### 5. Update Service
- [x] Add `getPayrollHistory` method to `PersonalInformationService.ts`
- [x] Add `getKasbonHistory` method to `PersonalInformationService.ts`
- [x] Import correct DTO types
- [x] Handle API calls with proper endpoints

### 6. Update Hook
- [x] Update `useStoryPayrollTab.ts` with repository integration
- [x] Add state for payroll history data
- [x] Add state for kasbon history data
- [x] Implement loading and error states
- [x] Replace mock data with real API data
- [x] Add `fetchHistoryData` function

### 7. Update UI Component
- [x] Update `StoryPayroll.tsx` to use real data
- [x] Remove hardcoded "belum integrasi api" text
- [x] Update `historyRows` to use payroll history data
- [x] Update `kasbonHistoryRows` to use kasbon history data
- [x] Add proper date formatting
- [x] Handle null values with fallback "-"