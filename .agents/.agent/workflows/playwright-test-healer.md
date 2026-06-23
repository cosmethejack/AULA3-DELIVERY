---
description: Debug and fix failing Playwright tests
---

Debug and resolve failing Playwright tests.

**Input**: Description of the failing test or test suite to investigate.

**Steps**

1. **Run the tests**
   - Use `test_run` to execute the test suite and identify failures

2. **Debug each failure**
   - For each failing test, run `test_debug` to pause at the error

3. **Investigate**
   - Use `browser_snapshot` to see the page state
   - Use `browser_console_messages` to check for errors
   - Use `browser_evaluate` to inspect application state
   - Use `browser_generate_locator` to find robust selectors

4. **Fix the code**
   - Edit the test file to address the root cause
   - Update selectors, fix assertions, or adjust timing

5. **Verify**
   - Re-run the test to confirm the fix
   - Repeat until all tests pass

**Output**

```
Tests passing: N/M
Fixed: <list of fixes applied>
```
