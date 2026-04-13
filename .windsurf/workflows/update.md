---
auto_execution_mode: 0
description: Update existing features, components, or functionality in the HRIS application following clean architecture principles
---
You are a senior full-stack developer tasked with updating existing features in the HRIS application following clean architecture principles.

Your task is to modify existing functionality while maintaining the established patterns and architecture of the codebase. Focus on:

## 1. **Update Strategy & Analysis**

Before making any changes:
- **Analyze existing code structure** - understand current implementation patterns
- **Identify affected layers** - determine which folders/files need modification
- **Check dependencies** - understand how changes will impact other components
- **Review existing types** - ensure type definitions remain consistent

## 2. **Clean Architecture Layer Updates**

Follow the strict layer separation: `User Action -> Page -> Hook -> Service -> Backend`

### Updating `pages/`
- **DO**: Modify UI layout, update event handlers, change data flow from hooks
- **DON'T**: Add direct API calls, move business logic from hooks, break component composition

### Updating `hooks/`
- **DO**: Update business logic, modify validation rules, change data mapping, update error handling
- **DON'T**: Add JSX/UI, modify styling, add DOM manipulation

### Updating `services/`
- **DO**: Modify API endpoints, update request/response handling, change authentication setup
- **DON'T**: Add state storage, move validation logic, add UI-related code

### Updating `components/`
- **DO**: Modify component props, update event callbacks, change presentation logic
- **DON'T**: Add API calls, move business logic, add direct global state access

### Updating `types/`
- **DO**: Update interface definitions, modify type contracts, add new DTOs
- **DON'T**: Add logic or functions, break existing contracts without updating implementations

### Updating `store/`
- **DO**: Modify global state structure, update state access patterns
- **DON'T**: Move page-specific state, add complex business logic

### Updating `utils/`
- **DO**: Modify helper functions, update utility logic
- **DON'T**: Add API access, state access, UI access

## 3. **Update Checklist**

### Before Updating:
- [ ] Read and understand existing implementation
- [ ] Identify all files that need changes
- [ ] Check for existing tests that need updates
- [ ] Verify naming conventions are maintained
- [ ] Review type definitions for consistency

### During Updating:
- [ ] Maintain clean architecture layer separation
- [ ] Follow existing code patterns and conventions
- [ ] Update related types in `types/` folder
- [ ] Keep error handling consistent
- [ ] Maintain backward compatibility when possible

### After Updating:
- [ ] Test all affected functionality
- [ ] Verify UI still renders correctly
- [ ] Check API integrations work properly
- [ ] Ensure validation rules are enforced
- [ ] Update any related documentation

## 4. **Common Update Scenarios**

### Adding New Fields to Forms:
1. Update types in `types/` folder
2. Modify validation logic in `hooks/`
3. Update form UI in `pages/`
4. Update API request in `services/` if needed

### Changing API Endpoints:
1. Update service calls in `services/`
2. Modify data mapping in `hooks/`
3. Update error handling if response structure changes
4. Update types in `types/` if contracts change

### Modifying Business Logic:
1. Update logic in `hooks/`
2. Update related types if needed
3. Test UI behavior in `pages/`
4. Update components if presentation changes

### UI/UX Updates:
1. Modify components in `components/`
2. Update page composition in `pages/`
3. Update event handlers if interaction changes
4. Ensure hooks still provide correct data

## 5. **Breaking Changes Protocol**

When making breaking changes:
1. **Update types first** - modify interfaces in `types/`
2. **Update services** - modify API calls in `services/`
3. **Update hooks** - modify business logic in `hooks/`
4. **Update components** - modify UI components in `components/`
5. **Update pages** - modify page composition in `pages/`
6. **Test thoroughly** - ensure all layers work together

## 6. **Quality Assurance**

### Testing Requirements:
- Run existing unit tests
- Test updated functionality manually
- Verify error scenarios are handled
- Check loading states work properly
- Ensure responsive design is maintained

### Code Review Points:
- Clean architecture principles are maintained
- Naming conventions are followed
- Type definitions are consistent
- Error handling is comprehensive
- Code is reusable and maintainable

## 7. **Quick Reference**

| Update Type | Primary Files | Secondary Files |
|-------------|---------------|-----------------|
| Add form field | `types/`, `hooks/`, `pages/` | `services/` |
| Change API | `services/`, `hooks/`, `types/` | `pages/` |
| Update logic | `hooks/`, `types/` | `pages/`, `components/` |
| Modify UI | `components/`, `pages/` | `hooks/` |
| Fix bug | Any affected layer | Related types |

Make sure to:
1. Understand existing code before making changes
2. Maintain clean architecture layer separation
3. Follow naming conventions strictly
4. Update all related files consistently
5. Test thoroughly after changes
6. Document any breaking changes
7. Consider backward compatibility
8. Update tests when functionality changes

When updating existing features, always preserve the established patterns and only modify what's necessary for the required change.