---
version: 1.0
name: DELIVERY-design-system
description: >
  Design system for DELIVERY — an e-commerce platform for micro-entrepreneurs.
  The system runs two parallel tracks: a warm, inviting consumer track (vitrine,
  cart, order tracking) and a clean, data-efficient admin track (dashboard,
  CRUD tables). Both tracks share typographic DNA (Inter), the same pill-button
  vocabulary, and a warm terracota primary color that signals trust and
  approachability.

colors:
  primary: "#D97757"
  ink: "#1C1917"
  on-primary: "#FFFFFF"
  on-dark: "#FFFFFF"
  canvas-light: "#FFFFFF"
  canvas-cream: "#FDFBF7"
  canvas-dark: "#1C1917"
  canvas-dark-elevated: "#292524"
  surface-elevated: "#FAF7F2"
  surface-elevated-dark: "#3C3834"
  shade-20: "#E7E5E4"
  shade-30: "#D6D3D1"
  shade-40: "#A8A29E"
  shade-50: "#78716C"
  shade-60: "#57534E"
  shade-70: "#44403C"
  shade-80: "#292524"
  hairline-light: "#E7E5E4"
  hairline-dark: "#3C3834"
  success: "#16A34A"
  warning: "#D97706"
  error: "#DC2626"
  info: "#2563EB"
  success-bg: "#F0FDF4"
  warning-bg: "#FFFBEB"
  error-bg: "#FEF2F2"
  info-bg: "#EFF6FF"
  terracota-10: "#FDF2EE"
  terracota-20: "#F8E3DA"
  terracota-30: "#F1CCBC"
  link-primary: "#D97757"
  link-hover: "#C15D3E"
  link-on-dark: "#F8E3DA"

typography:
  display-xl:
    fontFamily: "Inter Variable, Inter, Arial, sans-serif"
    fontSize: 64px
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: -1.28px
  display-lg:
    fontFamily: "Inter Variable, Inter, Arial, sans-serif"
    fontSize: 48px
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: -0.96px
  display-md:
    fontFamily: "Inter Variable, Inter, Arial, sans-serif"
    fontSize: 36px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: -0.72px
  heading-xl:
    fontFamily: "Inter Variable, Inter, Arial, sans-serif"
    fontSize: 28px
    fontWeight: 600
    lineHeight: 1.28
    letterSpacing: 0
  heading-lg:
    fontFamily: "Inter Variable, Inter, Arial, sans-serif"
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1.33
    letterSpacing: 0
  heading-md:
    fontFamily: "Inter Variable, Inter, Arial, sans-serif"
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0
  heading-sm:
    fontFamily: "Inter Variable, Inter, Arial, sans-serif"
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0
  body-lg:
    fontFamily: "Inter Variable, Inter, Arial, sans-serif"
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0
  body-md:
    fontFamily: "Inter Variable, Inter, Arial, sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  body-strong:
    fontFamily: "Inter Variable, Inter, Arial, sans-serif"
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: 0
  body-sm:
    fontFamily: "Inter Variable, Inter, Arial, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  caption:
    fontFamily: "Inter Variable, Inter, Arial, sans-serif"
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0.28px
  micro:
    fontFamily: "Inter Variable, Inter, Arial, sans-serif"
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0.24px
  eyebrow:
    fontFamily: "Inter Variable, Inter, Arial, sans-serif"
    fontSize: 12px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: 0.72px
    textTransform: uppercase
  code:
    fontFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, monospace"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0

rounded:
  xs: 4px
  sm: 6px
  md: 8px
  lg: 12px
  xl: 16px
  pill: 9999px

spacing:
  xxs: 2px
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  xxl: 32px
  huge: 48px

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.pill}"
    padding: 12px 24px
  button-primary-hover:
    backgroundColor: "#C15D3E"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.pill}"
    padding: 12px 24px
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.pill}"
    padding: 12px 24px
    border: 2px solid "{colors.primary}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.pill}"
    padding: 8px 16px
  button-on-dark:
    backgroundColor: "transparent"
    textColor: "{colors.on-dark}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.pill}"
    padding: 12px 24px
    border: 2px solid "{colors.on-dark}"
  button-success:
    backgroundColor: "{colors.success}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.pill}"
    padding: 12px 24px
  button-danger:
    backgroundColor: "{colors.error}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.pill}"
    padding: 12px 24px
  text-input:
    backgroundColor: "{colors.canvas-light}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: 10px 12px
    border: 1px solid "{colors.hairline-light}"
  text-input-focus:
    backgroundColor: "{colors.canvas-light}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: 10px 12px
    border: 2px solid "{colors.primary}"
  select-input:
    backgroundColor: "{colors.canvas-light}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: 10px 12px
  card:
    backgroundColor: "{colors.canvas-light}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: 24px
    shadow: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)"
  card-elevated:
    backgroundColor: "{colors.canvas-light}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: 24px
    shadow: "0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06)"
  card-dark:
    backgroundColor: "{colors.canvas-dark-elevated}"
    textColor: "{colors.on-dark}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: 24px
  card-product:
    backgroundColor: "{colors.canvas-light}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: 0
    shadow: "0 1px 3px rgba(0,0,0,0.08)"
  nav-bar-light:
    backgroundColor: "{colors.canvas-light}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    padding: 16px 24px
  nav-bar-dark:
    backgroundColor: "{colors.canvas-dark}"
    textColor: "{colors.on-dark}"
    typography: "{typography.body-md}"
    padding: 16px 24px
  sidebar:
    backgroundColor: "{colors.canvas-dark}"
    textColor: "{colors.on-dark}"
    typography: "{typography.body-md}"
    padding: 24px 16px
  sidebar-item-active:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.md}"
    padding: 10px 16px
  sidebar-item:
    backgroundColor: "transparent"
    textColor: "{colors.on-dark}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: 10px 16px
  badge-pending:
    backgroundColor: "{colors.warning-bg}"
    textColor: "{colors.warning}"
    typography: "{typography.caption}"
    rounded: "{rounded.pill}"
    padding: 2px 10px
  badge-success:
    backgroundColor: "{colors.success-bg}"
    textColor: "{colors.success}"
    typography: "{typography.caption}"
    rounded: "{rounded.pill}"
    padding: 2px 10px
  badge-error:
    backgroundColor: "{colors.error-bg}"
    textColor: "{colors.error}"
    typography: "{typography.caption}"
    rounded: "{rounded.pill}"
    padding: 2px 10px
  badge-info:
    backgroundColor: "{colors.info-bg}"
    textColor: "{colors.info}"
    typography: "{typography.caption}"
    rounded: "{rounded.pill}"
    padding: 2px 10px
  data-table-header:
    backgroundColor: "{colors.surface-elevated}"
    textColor: "{colors.shade-60}"
    typography: "{typography.caption}"
    padding: 12px 16px
  data-table-row:
    backgroundColor: "{colors.canvas-light}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    padding: 12px 16px
    border-bottom: 1px solid "{colors.hairline-light}"
  stats-card:
    backgroundColor: "{colors.canvas-light}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: 20px 24px
  footer-light:
    backgroundColor: "{colors.canvas-light}"
    textColor: "{colors.shade-50}"
    typography: "{typography.caption}"
    padding: 32px 24px
    border-top: 1px solid "{colors.hairline-light}"
  footer-dark:
    backgroundColor: "{colors.canvas-dark}"
    textColor: "{colors.shade-40}"
    typography: "{typography.caption}"
    padding: 32px 24px
    border-top: 1px solid "{colors.hairline-dark}"

---

## Overview

DELIVERY runs two parallel design tracks that share the same typographic system (Inter Variable) and button vocabulary (terracota-filled pill primary, outlined pill secondary). The consumer track (vitrine, cart, order tracking) lives on `{colors.canvas-light}` (`#FFFFFF`) and `{colors.canvas-cream}` (`#FDFBF7`) — clean, warm, and inviting, designed to build trust with end customers. The admin track (dashboard, CRUD tables) lives on the same light canvas but adds a dark sidebar (`{colors.canvas-dark}`) and data-dense components like `data-table-row` and `stats-card`.

The brand color is `{colors.primary}` (`#D97757`) — a warm terracota that signals reliability and approachability. It appears in filled pills, link text, active sidebar items, and status accents. The color is versatile enough to work on both light and dark surfaces without losing its warmth.

### Key Characteristics
- **Single typography family**: Inter Variable across all roles — display, body, caption, eyebrow. No separate display font; weight and size create hierarchy.
- **Pill shape**: `{rounded.pill}` is the primary button shape. Rounded rectangles (`{rounded.md}`, `{rounded.lg}`) appear on inputs, cards, and data tables — never on primary buttons.
- **Terracota is the signal**: `{colors.primary}` identifies interactive elements (buttons, links, active states). Status badges use semantic colors (green for success, red for error, amber for warning, blue for info).
- **Two-canvas admin system**: Dark sidebar (`{colors.canvas-dark}`) + light content area (`{colors.canvas-light}`) — the standard admin dashboard pattern.
- **Generous whitespace**: Product cards and vitrine sections use `{spacing.xl}`–`{spacing.xxl}` gaps; admin tables tighten to `{spacing.md}`–`{spacing.lg}` for data density.
- **Semantic status colors**: Badges use dedicated background+text pairs for immediate visual scanning — critical for order management.

## Colors

### Brand & Accent
- **Terracota** (`{colors.primary}` — `#D97757`): The brand color. Used for primary buttons, links, active navigation, and as the seed color for the design system.
- **Terracota-10** (`{colors.terracota-10}` — `#FDF2EE`): Light terracota tint for section backgrounds and hover states on light surfaces.
- **Terracota-20** (`{colors.terracota-20}` — `#F8E3DA`): Medium tint for cards on tinted backgrounds.
- **Terracota-30** (`{colors.terracota-30}` — `#F1CCBC`): Border and divider accent on tinted surfaces.

### Status Semantic Colors
- **Success** (`{colors.success}` — `#16A34A` / `{colors.success-bg}` — `#F0FDF4`): Paid, delivered, confirmed badges.
- **Warning** (`{colors.warning}` — `#D97706` / `{colors.warning-bg}` — `#FFFBEB`): Pending, delayed badges.
- **Error** (`{colors.error}` — `#DC2626` / `{colors.error-bg}` — `#FEF2F2`): Canceled, failed badges.
- **Info** (`{colors.info}` — `#2563EB` / `{colors.info-bg}` — `#EFF6FF`): Information, processing badges.

### Surface
- **Canvas Light** (`{colors.canvas-light}` — `#FFFFFF`): Default page background.
- **Canvas Cream** (`{colors.canvas-cream}` — `#FDFBF7`): Consumer-facing section backgrounds, slightly warm.
- **Canvas Dark** (`{colors.canvas-dark}` — `#1C1917`): Admin sidebar, dark footer.
- **Canvas Dark Elevated** (`{colors.canvas-dark-elevated}` — `#292524`): Cards on dark surfaces.
- **Surface Elevated** (`{colors.surface-elevated}` — `#FAF7F2`): Data table headers, subtle card fills.

### Shade Ladder
- **Shade-20** (`{colors.shade-20}` — `#E7E5E4`): Disabled backgrounds.
- **Shade-30** (`{colors.shade-30}` — `#D6D3D1`): Borders, dividers on light.
- **Shade-40** (`{colors.shade-40}` — `#A8A29E`): Placeholder text, disabled text.
- **Shade-50** (`{colors.shade-50}` — `#78716C`): Secondary text on light.
- **Shade-60** (`{colors.shade-60}` — `#57534E`): Tertiary text on light.
- **Shade-70** (`{colors.shade-70}` — `#44403C`): Dark hover states.
- **Shade-80** (`{colors.shade-80}` — `#292524`): Near-dark surfaces.

## Typography

### Font Family

**Inter Variable** (`Inter Variable, Inter, Arial, sans-serif`) is the single typeface across all roles — display, heading, body, caption, and eyebrow. Weights range from 400 (body) to 600 (headings, strong). No separate display font is needed; hierarchy is achieved through size, weight, and tracking adjustments.

**JetBrains Mono** (`JetBrains Mono, ui-monospace, monospace`) is used exclusively for code blocks and order numbers.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `display-xl` | 64px | 600 | 1.1 | -1.28px | Hero / landing page headline |
| `display-lg` | 48px | 600 | 1.15 | -0.96px | Section title on consumer pages |
| `display-md` | 36px | 600 | 1.2 | -0.72px | Dashboard welcome / page title |
| `heading-xl` | 28px | 600 | 1.28 | 0 | Product detail title, modal title |
| `heading-lg` | 24px | 600 | 1.33 | 0 | Card title, section header |
| `heading-md` | 20px | 600 | 1.4 | 0 | Card sub-title, form section |
| `heading-sm` | 18px | 600 | 1.4 | 0 | Sidebar group label |
| `body-lg` | 18px | 400 | 1.6 | 0 | Lead paragraph, marketing body |
| `body-md` | 16px | 400 | 1.5 | 0 | Default UI body, table cells |
| `body-strong` | 16px | 600 | 1.5 | 0 | Button labels, emphasized body |
| `body-sm` | 14px | 400 | 1.5 | 0 | Form helper text, metadata |
| `caption` | 14px | 500 | 1.4 | 0.28px | Table headers, badge text |
| `micro` | 12px | 500 | 1.4 | 0.24px | Fine print, secondary metadata |
| `eyebrow` | 12px | 600 | 1.2 | 0.72px | All-caps section eyebrow |
| `code` | 14px | 400 | 1.6 | 0 | Code blocks, order numbers |

## Layout

### Spacing System
- **Base unit**: 8px. All spacing tokens are multiples of 4px.
- **Tokens**: `{spacing.xs}` 4px · `{spacing.sm}` 8px · `{spacing.md}` 12px · `{spacing.lg}` 16px · `{spacing.xl}` 24px · `{spacing.xxl}` 32px · `{spacing.huge}` 48px.
- **Page padding**: 24px–32px on consumer pages; 24px on admin pages.
- **Card internal padding**: 24px (`{spacing.xxl}`) for admin cards; 0 for product cards (content fills to edges).

### Responsive Breakpoints
| Name | Width | Changes |
|---|---|---|
| Wide | ≥ 1200px | Max-width container, 4-col product grid |
| Desktop | 992–1199px | 3-col product grid |
| Tablet | 768–991px | 2-col product grid, sidebar collapses |
| Mobile | < 768px | 1-col, hamburger nav, stacked admin panels |

## Components

### Buttons
All primary buttons use `{rounded.pill}` (9999px). Secondary and ghost buttons share the same pill shape.

- **`button-primary`**: Terracota fill, white text, 600 weight, pill shape. The dominant CTA.
- **`button-secondary`**: Transparent with terracota border and text. For secondary actions.
- **`button-ghost`**: No border, no fill, ink text. For tertiary actions in tight spaces.
- **`button-on-dark`**: Transparent with white border and text. For CTAs on dark surfaces.
- **`button-success`**: Green fill for confirmatory actions (pay, approve).
- **`button-danger`**: Red fill for destructive actions (cancel, delete).

### Cards
- **`card`**: Standard white card with subtle shadow. Used in admin for forms and detail views.
- **`card-elevated`**: Higher shadow for modals, highlighted sections.
- **`card-dark`**: Dark card for consumer track accents.
- **`card-product`**: Borderless product card with image top, no internal padding.

### Navigation
- **`nav-bar-light`**: White top navigation for consumer pages. Logo left, nav items center, CTA right.
- **`nav-bar-dark`**: Dark top navigation for admin pages or special consumer sections.
- **`sidebar`**: Dark sidebar for admin dashboard. `sidebar-item` for inactive, `sidebar-item-active` with terracota fill for active.

### Data Display
- **`data-table-header`**: Warm surface background, caption typography, uppercase feel via weight+size.
- **`data-table-row`**: Alternating or striped rows with `{colors.hairline-light}` bottom borders.
- **`stats-card`**: Metric display with value (heading-lg) and label (body-sm).
- **`badge-*`**: Four semantic variants (pending, success, error, info) with matching background+text pairs.

### Form Inputs
- **`text-input`**: White, 8px roundness, 1px hairline border. Focus state gets 2px terracota border.
- **`select-input`**: Same styling as text-input.

## Elevation

| Level | Shadow | Use |
|---|---|---|
| 0 | None | Default surfaces, page backgrounds |
| 1 | `0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)` | Cards, data tables |
| 2 | `0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06)` | Elevated cards, hover states |
| 3 | `0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)` | Dropdowns, popovers |
| 4 | `0 20px 25px rgba(0,0,0,0.15), 0 8px 10px rgba(0,0,0,0.1)` | Modals, dialogs |

## Do's and Don'ts

### Do
- Use `{rounded.pill}` for all primary and secondary buttons.
- Use Inter Variable across the entire system — no other typeface for UI.
- Use `{colors.primary}` terracota for interactive elements only (buttons, links, active states).
- Use semantic status badges (`badge-success`, `badge-error`, etc.) for order status indicators.
- Apply the dark sidebar + light content pattern for all admin pages.

### Don't
- Don't mix rounded rectangle shapes for buttons — primary CTA is always pill.
- Don't introduce a third canvas color — stick to white, cream, or dark.
- Don't use terracota for non-interactive decorative elements.
- Don't add shadows to dark surfaces — use `card-dark` for flat darkness.
- Don't shrink sidebar below 240px on desktop — navigation labels must remain readable.

## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Wide | ≥ 1200px | 4-col product grid, full sidebar |
| Desktop | 992–1199px | 3-col product grid, full sidebar |
| Tablet | 768–991px | 2-col product grid, sidebar collapses to icons |
| Mobile | < 768px | 1-col, hamburger nav, stacked admin panels |

### Collapsing Strategy
- Display sizes scale down through breakpoints: 64 → 48 → 36 → 28px on mobile.
- Product grid collapses 4 → 3 → 2 → 1 column.
- Admin sidebar collapses to icon-only at tablet; hamburger at mobile.
- Data tables horizontal-scroll on mobile with sticky first column.
