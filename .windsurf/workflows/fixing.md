---
auto_execution_mode: 0
description: Fix bugs and resolve issues in the HRIS application following clean architecture principles
---
You are a senior software engineer tasked with debugging and fixing issues in the HRIS application following clean architecture principles.

Your task is to identify, analyze, and resolve bugs while maintaining the established patterns and architecture of the codebase. Focus on:

## 1. **Bug Analysis & Identification**

### Initial Investigation:
- **Understand the issue** - clearly identify what's broken vs expected behavior
- **Reproduce the bug** - create consistent reproduction steps
- **Identify affected layers** - determine which clean architecture layers are involved
- **Check error logs** - review console errors, network failures, API responses
- **Analyze data flow** - trace the issue through `Page -> Hook -> Service -> Backend`

### Common Bug Categories:
- **UI/Rendering issues** - component not displaying, layout problems
- **Logic errors** - validation failures, incorrect calculations, wrong decisions
- **API issues** - failed requests, wrong endpoints, data mapping problems
- **State management** - incorrect state updates, stale data, race conditions
- **Type errors** - TypeScript compilation issues, wrong type usage
- **Performance issues** - slow rendering, memory leaks, unnecessary re-renders

## 2. **Debugging by Layer**

### `pages/` Layer Issues:
**Symptoms:**
- UI not rendering correctly
- Event handlers not working
- Data not displaying from hooks

**Debugging Steps:**
1. Check if hook data is being received correctly
2. Verify event handlers are properly bound
3. Ensure component composition is correct
4. Check for JSX syntax errors

**Common Fixes:**
- Fix data flow from hooks
- Correct event handler bindings
- Update component props
- Fix JSX syntax

### `hooks/` Layer Issues:
**Symptoms:**
- Business logic not working
- Validation failing
- State not updating
- API data not processed correctly

**Debugging Steps:**
1. Check if service calls are working
2. Verify state management logic
3. Validate business rules implementation
4. Check data mapping and transformation

**Common Fixes:**
- Fix logic flow in hooks
- Update validation rules
- Correct state management
- Fix data mapping

### `services/` Layer Issues:
**Symptoms:**
- API calls failing
- Wrong endpoints being called
- Authentication issues
- Request/response format problems

**Debugging Steps:**
1. Check API endpoint URLs
2. Verify request headers and authentication
3. Review request/response format
4. Test API calls directly

**Common Fixes:**
- Correct endpoint URLs
- Fix authentication setup
- Update request/response handling
- Fix error handling

### `components/` Layer Issues:
**Symptoms:**
- Component not rendering
- Props not being passed correctly
- Event callbacks not working
- Styling issues

**Debugging Steps:**
1. Check component props interface
2. Verify callback functions
3. Check component composition
4. Review styling and CSS

**Common Fixes:**
- Fix prop types and interfaces
- Correct callback implementations
- Update component structure
- Fix styling issues

### `types/` Layer Issues:
**Symptoms:**
- TypeScript compilation errors
- Type mismatches
- Interface inconsistencies

**Debugging Steps:**
1. Check type definitions
2. Verify interface contracts
3. Review type usage across layers
4. Check for type conflicts

**Common Fixes:**
- Update type definitions
- Fix interface contracts
- Correct type usage
- Resolve type conflicts

## 3. **Systematic Debugging Process**

### Step 1: Issue Reproduction
1. Create clear reproduction steps
2. Identify exact conditions that trigger the bug
3. Document expected vs actual behavior
4. Note any error messages or logs

### Step 2: Root Cause Analysis
1. Trace the issue through clean architecture layers
2. Identify the exact layer where the problem occurs
3. Check for related issues in dependent layers
4. Verify data flow and state changes

### Step 3: Fix Implementation
1. Apply minimal fix to resolve the issue
2. Ensure clean architecture principles are maintained
3. Update related types if necessary
4. Maintain naming conventions

### Step 4: Testing & Validation
1. Test the fix with original reproduction steps
2. Verify no regression in related functionality
3. Test edge cases and error scenarios
4. Ensure performance is not degraded

## 4. **Common Bug Patterns & Solutions**

### Data Flow Issues:
**Problem**: Data not flowing from hooks to pages
**Solution**: 
- Check hook return values
- Verify data destructuring in pages
- Ensure async data handling with loading states

### State Management Issues:
**Problem**: State not updating correctly
**Solution**:
- Check state update logic in hooks
- Verify dependency arrays in useEffect
- Ensure proper async state handling

### API Integration Issues:
**Problem**: API calls failing or returning wrong data
**Solution**:
- Verify service endpoint URLs
- Check request/response format matching
- Fix authentication and headers

### Type Definition Issues:
**Problem**: TypeScript errors or type mismatches
**Solution**:
- Update interface definitions in types/
- Ensure consistent type usage across layers
- Fix type annotations and generics

### Component Rendering Issues:
**Problem**: Components not rendering or displaying incorrectly
**Solution**:
- Check component props and interfaces
- Verify conditional rendering logic
- Fix component composition and hierarchy

## 5. **Debugging Tools & Techniques**

### Browser DevTools:
- **Console**: Check for JavaScript errors and warnings
- **Network**: Monitor API calls and responses
- **Elements**: Inspect DOM and CSS issues
- **React DevTools**: Debug component state and props

### VS Code Debugging:
- **Breakpoints**: Set breakpoints in suspicious code
- **Watch variables**: Monitor variable values during execution
- **Call stack**: Trace function call hierarchy

### Logging Strategy:
```typescript
// Add strategic logging for debugging
console.log('Hook data:', data);
console.log('API response:', response);
console.log('State update:', newState);
```

## 6. **Fix Validation Checklist**

### Before Fix:
- [ ] Reproduce the bug consistently
- [ ] Identify the affected layer(s)
- [ ] Understand the root cause
- [ ] Check for similar issues elsewhere

### During Fix:
- [ ] Apply minimal change principle
- [ ] Maintain clean architecture separation
- [ ] Follow naming conventions
- [ ] Update related types if needed

### After Fix:
- [ ] Verify bug is resolved
- [ ] Test related functionality
- [ ] Check for performance impact
- [ ] Update tests if necessary
- [ ] Document the fix if complex

## 7. **Prevention Strategies**

### Code Review Focus:
- Clean architecture layer separation
- Type definition consistency
- Error handling completeness
- State management correctness

### Testing Improvements:
- Add unit tests for fixed bugs
- Increase test coverage for critical paths
- Add integration tests for API flows
- Include edge case testing

### Documentation Updates:
- Document common bug patterns
- Update troubleshooting guides
- Add debugging best practices
- Record fix decisions and rationale

## 8. **Quick Bug Reference**

| Bug Type | Likely Layer | Common Cause | Quick Fix |
|----------|--------------|--------------|-----------|
| UI not rendering | `pages/` | Hook data issue | Check data flow |
| Logic errors | `hooks/` | Business rule bug | Fix logic flow |
| API failures | `services/` | Endpoint/auth issue | Fix API call |
| Type errors | `types/` | Interface mismatch | Update types |
| Component issues | `components/` | Props/callback bug | Fix component |
| State issues | `hooks/` | State update bug | Fix state logic |

Make sure to:
1. Reproduce bugs consistently before fixing
2. Identify root cause, not just symptoms
3. Apply minimal fixes that maintain architecture
4. Test thoroughly after implementing fixes
5. Document complex fixes for future reference
6. Consider adding tests to prevent regression
7. Follow clean architecture principles strictly
8. Maintain naming conventions and code standards

When fixing bugs, always prioritize understanding the issue completely before implementing changes, and ensure the fix doesn't break other functionality or violate architectural principles.