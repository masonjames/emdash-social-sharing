---
title: "PRD: EmDash Social Sharing"
status: draft
priority: P1
inspired_by: "Scriptless Social Sharing"
plugin_id: "social-sharing"
package_name: "emdash-social-sharing"
execution_mode: "Trusted-first, sandbox-compatible target"
---

# PRD: EmDash Social Sharing

## Product summary

EmDash Social Sharing gives publishers privacy-light sharing controls for content pages without requiring third-party JavaScript SDKs. The greenfield product should be **explicit-placement and no-script by default**, with a small enhancement only where it improves usability, such as copy-to-clipboard.

The product is meant to cover the practical sharing use case, not social analytics or vendor lock-in.

## Problem

Teams want share buttons, but most social plugins bring baggage:

- third-party scripts,
- performance cost,
- consent complexity,
- inconsistent UI,
- brittle integrations tied to vendor SDKs.

The EmDash-native version should solve the real problem with less ceremony:

- build share URLs on the server,
- use the current page URL/title,
- render accessible buttons or links,
- let teams place the UI explicitly inside content or templates.

## Goals

1. Ship accessible share controls with no third-party SDKs.
2. Support explicit placement through a PT block or theme-imported component.
3. Let admins choose enabled networks and display style.
4. Keep the MVP route-free, storage-free, and capability-free.
5. Preserve a clear privacy story.

## Non-goals

- Share counts
- Vendor analytics pixels
- Auto-append to every article body
- Social follow widgets
- Rich social preview editing, which belongs to SEO metadata rather than sharing UI

## Primary users

### Editors
They want to drop sharing controls into long-form content when it makes sense.

### Theme developers
They want a reusable share component for article templates.

### Readers
They want quick sharing actions without popups full of junk.

## Key user stories

1. As a theme developer, I can place share buttons near the title or below the article.
2. As an editor, I can add a share block to a specific page.
3. As a reader, I can share the current page to supported networks or copy its link.
4. As an admin, I can enable only the networks that matter to my audience.
5. As a publisher, I can avoid third-party JS and preserve performance.

## MVP scope

### In scope

- `socialShare` Portable Text block
- theme-imported share component
- sitewide settings for enabled networks and styles
- supported actions:
  - copy link
  - email share
  - X/Twitter-style share
  - LinkedIn-style share
  - Bluesky share if a stable URL pattern is supported by the package
- style variants:
  - text links
  - button row
  - icon + label

### Out of scope

- share counts
- tracking pixels
- social login or follow buttons
- automatic body injection
- per-network custom analytics in v1

## Functional requirements

### Frontend behavior

- The component must build a share target using the current page’s canonical URL or page URL.
- The current page title must be available to the share target where appropriate.
- The copy-link action must work as progressive enhancement and degrade gracefully.

### Admin settings

- enabled networks
- include email share yes/no
- include copy-link yes/no
- default variant
- open in new tab yes/no
- optional publisher handle fields where applicable

### Editor overrides

Per-block overrides should include:

- title override
- hide/show certain networks
- compact vs full style
- alignment

## UX and integration model

This plugin is placement-explicit on purpose.

Teams can:

- render a share block in content for campaign pages or essays,
- import the component into a theme for article templates.

There is no v1 auto-append behavior because that would require brittle assumptions about theme structure.

## Technical approach for EmDash

### Plugin surfaces

- `admin.settingsSchema`
- `admin.portableTextBlocks`
- `componentsEntry`

### Capabilities

None required for MVP.

### Storage

No storage in v1.

### Routes

No routes in v1.

### Settings

- `settings:enabledNetworks`
- `settings:includeCopyLink`
- `settings:includeEmailShare`
- `settings:defaultVariant`
- `settings:openInNewTab`
- `settings:publisherHandles`

### Rendering notes

The renderer should consume page metadata already available in the site render layer. It should not rely on plugin routes to look up the current page.

## Success metrics

- Share controls can be rendered with no vendor SDKs.
- Copy-link and at least two network share targets work reliably.
- Teams can use the plugin without widening the trust boundary.
- The component is adopted in at least one theme-level article template.

## Risks and mitigations

### Risk: network share URL conventions change
Mitigation: keep share-target builders isolated and versioned, and avoid broad claims beyond supported targets.

### Risk: teams want share counts
Mitigation: treat share counts as a separate product with different privacy and API tradeoffs.

### Risk: duplicate placement
Mitigation: document a simple editorial rule for theme placement vs block placement.

## Milestones

1. Define settings and block contract.
2. Build share-target builder utilities.
3. Implement copy-link enhancement and accessibility polish.
4. QA across desktop and mobile article flows.
5. Publish usage docs for block and theme placement.

## Acceptance criteria

- The plugin can be enabled with no capabilities.
- Editors can insert a `socialShare` block.
- Theme developers can import a share component.
- No third-party SDK is required for the supported sharing actions.

## Open questions

1. Which networks are worth hard-supporting in the first release?
2. Do we want optional UTM tagging later, or should that stay outside the plugin?
3. Should copy-link success/error messaging be configurable?
