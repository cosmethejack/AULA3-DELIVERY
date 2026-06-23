---
description: Generate Playwright browser tests for web application features
---

Generate automated browser tests using Playwright.

**Input**: Description of the feature or test scenario to generate tests for.

**Steps**

1. **Understand the test plan**
   - Read the test plan from `specs/` directory if available
   - Identify the scenario to implement

2. **Set up the page**
   - Run `generator_setup_page` to initialize the browser for the scenario

3. **Execute each step**
   - For each step in the test plan, use the appropriate Playwright tool
   - Use `browser_navigate`, `browser_click`, `browser_type`, etc. as needed
   - Use `browser_snapshot` to verify the page state

4. **Capture the log**
   - Run `generator_read_log` to get the execution log

5. **Write the test file**
   - Run `generator_write_test` with the generated source code
   - Place the file in the appropriate `tests/` directory

**Output**

```
Test generated: tests/<feature>/<scenario-name>.spec.ts
```
