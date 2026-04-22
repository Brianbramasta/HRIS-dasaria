---
auto_execution_mode: 0
description: Create new features, components, or functionality in the HRIS application following clean architecture principles
---
You are a senior full-stack developer tasked with creating new features for the HRIS application following clean architecture principles.

Your task is to implement new functionality following the established patterns and architecture of the codebase. Focus on:

## 1. **Repository Architecture Layer Separation**

Follow the strict layer separation: `User Action -> Page -> Hook -> Repository -> Service -> Model -> Backend`

### `pages/` - UI Orchestrator
- **DO**: Compose UI layout, handle UI events, get data/actions from hooks
- **DON'T**: Direct API calls, business logic, complex validation

### `hooks/` - Business Logic Layer  
- **DO**: All application logic, validation, decision making, orchestration, loading/error handling, **ONLY communicate with Repository**
- **DON'T**: JSX/UI, styling, DOM manipulation, **API processing, data mapping**

### `repositories/` - Data Center (WAJIB)
- **DO**: **Central data access point**, get data from Service, use Model for mapping, combine multiple APIs if needed, return ready-to-use data
- **DON'T**: Business logic, UI logic, direct API calls (use Service)

### `models/` - Mapping Layer (WAJIB)
- **DO**: **Map API response to internal format**, transform DTO to Entity, standardize data structure
- **DON'T**: Business logic, validation, API calls

### `services/` - API Call Layer
- **DO**: **Pure API calls only**, endpoint definitions, header & auth setup
- **DON'T**: State storage, data transformation, mapping, logic

### `components/` - Reusable UI Components
- **DO**: Presentational components, receive data via props, emit events via callbacks
- **DON'T**: API calls, business logic, direct global state access

### `types/` - Contract Layer
- **DO**: TypeScript type definitions, frontend-backend contracts, **DTO (backend contracts) and Entity (internal) types**
- **DON'T**: Logic or functions
- **Structure**: `types/dto/` for backend contracts, `types/entity/` for internal structure

### `store/` - Global State
- **DO**: Cross-page state (auth, user info, theme)
- **DON'T**: Store all state, complex business logic
- **RULE**: If only used by one page, DON'T use store

### `utils/` - Helper Functions
- **DO**: Small reusable functions, pure functions (date formatting, math helpers)
- **DON'T**: API access, state access, UI access

## 2. **Folder Structure Requirements**

Always check parent folder first - project uses feature-based folder structure:
```
src/features/[feature-name]/
  components/
  hooks/
  pages/
  repositories/
  models/
  services/
  stores/
  types/
  utils/
```

If required folders don't exist in parent, create them first. **repositories/ and models/ folders are mandatory**.

## 3. **Naming Conventions**

- **Language**: Always use English for functions, variables, folders, files
- **Files**: PascalCase (first letter capital) - example: `AddStaffModals.tsx`
- **Folders**: lowercase with hyphens for multiple words - example: `structure-and-organize`
- **Functions**: PascalCase (first letter capital) - example: `FormatDate()`
- **Variables**: lowercase with underscores for multiple words - example: `staff_status`

## 4. **Implementation Guidelines**

- Use TypeScript with proper type definitions from `types/` folder
- Follow existing UI patterns and component library
- Implement proper error handling and loading states in hooks
- Add appropriate validation in hooks layer
- **Maintain repository architecture flow - no layer jumping**
- **All data access must go through Repository layer**
- **Use Model layer for all API data transformation**
- **Separate DTO and Entity types**

## 5. **Quick Decision Table**

| Need | Location |
|------|----------|
| Fetch API | `services/` |
| **Data Access** | **`repositories/`** |
| **Data Mapping** | **`models/`** |
| Business rule | `hooks/` |
| UI event | `pages/` |
| Form validation | `hooks/` |
| Reusable UI | `components/` |
| Data contract | `types/` |
| Global state | `store/` |
| Helper function | `utils/` |

Make sure to:
1. Explore existing codebase to understand patterns before implementing
2. Check parent folder structure and create missing folders if needed (**repositories/ and models/ are mandatory**)
3. Follow naming conventions strictly (English, PascalCase files, lowercase folders)
4. **Maintain repository architecture layer separation**
5. **Use Repository for all data access, Model for all data mapping**
6. Create reusable components when appropriate
7. Add proper TypeScript types in `types/` folder (**separate DTO and Entity**)
8. Include error handling and user feedback in hooks
9. **Ensure backend changes only impact DTO, Model, Service, Repository - never Hook or UI**
10. Test the implementation thoroughly before considering it complete

When creating new features, always check if similar functionality already exists and follow those patterns exactly.