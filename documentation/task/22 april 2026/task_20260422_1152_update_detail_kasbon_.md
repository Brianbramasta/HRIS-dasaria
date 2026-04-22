# Task: update detail kasbon 
Tanggal: 22 april 2026 11:52

---

## Checklist:

### 1. Create DTO Types
- [x] Create `CashAdvanceDetailDTO` interface based on API response structure
- [x] Create `LoanDetailDTO` interface for loans array items

### 2. Create Entity Types  
- [x] Create `CashAdvanceDetailResponseEntity` interface for internal app structure
- [x] Create `LoanDetailResponseEntity` interface for internal app structure

### 3. Create Model (Mapping)
- [x] Add mapping functions to existing `CashAdvanceModel.ts`
- [x] Map DTO to Entity format
- [x] Handle currency string to number conversion
- [x] Handle date formatting

### 4. Create Repository
- [x] Update existing `CashAdvanceRepository.ts` 
- [x] Implement `getCashAdvanceDetail` method with new mapping
- [x] Use service and model for data transformation

### 5. Create Hook
- [x] Create `useCashAdvanceDetail.ts` hook
- [x] Implement loading, error, and data states
- [x] Call repository method
- [x] Handle error states

### 6. Update Page Component
- [x] Replace dummy data with hook data
- [x] Update interface to use entity types
- [x] Add loading and error handling
- [x] Update field mappings to match API response
- [ ] Test with real API data