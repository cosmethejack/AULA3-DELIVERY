---
description: Create comprehensive test plans for web applications
---

Create detailed test plans for web applications.

**Input**: URL or description of the web application to test.

**Steps**

1. **Set up the page**
   - Run `planner_setup_page` with the target URL

2. **Explore the application**
   - Navigate through all pages and features
   - Use `browser_snapshot` to capture page states
   - Identify interactive elements, forms, and navigation paths

3. **Map user flows**
   - Document primary user journeys
   - Identify critical paths and edge cases

4. **Design scenarios**
   - Create happy path scenarios
   - Create edge cases and error handling scenarios
   - Define clear steps and expected outcomes

5. **Save the plan**
   - Use `planner_save_plan` to write the test plan to `specs/`

**Output**

```
Test plan saved: specs/<application-name>.md
Scenarios: N (happy paths, edge cases, error handling)
```
