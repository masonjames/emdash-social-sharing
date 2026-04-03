# emdash-social-sharing

Privacy-light social sharing for EmDash.

This plugin gives you:

- an installable `socialShare` Portable Text block,
- a reusable Astro component for theme templates,
- sitewide share settings in the EmDash admin,
- server-built share URLs with no third-party SDKs,
- a progressively enhanced copy-link action that still works without JavaScript.

## Status

`emdash-social-sharing` is the **trusted / native** package for this plugin family.

That means:

- install it in `plugins: []`,
- do **not** install it in `sandboxed: []`,
- it is the package you install from npm,
- it remains named exactly `emdash-social-sharing`,
- it provides the full feature set: admin settings, Astro rendering, and the `socialShare` Portable Text block.

This repository now also includes a separate **marketplace-safe companion** under `marketplace/`.

That companion:

- is standard / sandboxed,
- is bundleable with `emdash plugin bundle` / `emdash plugin publish`,
- manages sitewide defaults through Block Kit,
- does **not** provide Portable Text block registration or site-side Astro rendering.

## Install Modes

### 1. Trusted full plugin

```bash
pnpm add emdash-social-sharing
```

Register it in `astro.config.mjs`:

```js
import { defineConfig } from "astro/config";
import { emdash } from "emdash/astro";
import { socialSharingPlugin } from "emdash-social-sharing";

export default defineConfig({
	integrations: [
		emdash({
			plugins: [socialSharingPlugin()],
		}),
	],
});
```

Save that in `astro.config.mjs`.

### 2. Marketplace companion

The marketplace-safe companion lives in `marketplace/` in this repository. It is a separate standard-format plugin source package used to produce a marketplace tarball.

Use the marketplace companion when you want:

- admin-installable settings management, and
- sandboxed execution through the EmDash marketplace.

Use the trusted npm package when you want:

- the `socialShare` Portable Text block,
- direct Astro rendering via `emdash-social-sharing/astro`, or
- full parity with the current trusted plugin.

### 3. Hybrid mode

Hybrid mode is supported:

- install the marketplace companion for admin-managed defaults, and
- import `SocialShare` from `emdash-social-sharing/astro` in your theme.

Do **not** enable both runtimes at the same time. Use either:

- the trusted runtime, or
- the marketplace runtime,

but not both.

## Theme usage

```astro
---
import { SocialShare } from "emdash-social-sharing/astro";

const canonicalUrl = post.seo?.canonicalUrl ?? Astro.url.href;
const shareTitle = post.title;
---

<SocialShare canonicalUrl={canonicalUrl} title={shareTitle} />
```

### Helpful props

- `canonicalUrl` – preferred share URL when you have a canonical URL available
- `url` – explicit share URL fallback
- `title` – share title for X, Bluesky, and email targets
- `variant` – `"text" | "button-row" | "icon-label"`
- `density` – `"default" | "compact"`
- `alignment` – `"start" | "center" | "end"`
- `openInNewTab` – override the sitewide new-tab setting
- `enabledActions` – explicit action override, e.g. `['x', 'linkedin', 'copy']`
- `publisherHandles` – optional per-render handle overrides

If you omit `title`, the component still works. Direct usage can pass explicit share copy, and rendered blocks fall back to the current document title in the browser when needed.

## Portable Text block

Once the plugin is enabled, editors can insert **Social Share** from the slash menu in any Portable Text field.

The block supports:

- title override,
- show-only / hide-selected network overrides,
- variant override,
- compact density,
- alignment control.

The block uses the current page URL automatically. If you want custom share copy, use the title override field; otherwise the component will use the page title when it can.

## Admin settings

The plugin ships sitewide defaults for:

- X enabled
- LinkedIn enabled
- Bluesky enabled
- email share enabled
- copy-link enabled
- default style variant
- open links in a new tab
- optional publisher handles for X and Bluesky

These settings are read at render time, so both theme components and PT blocks inherit them unless a local override is provided.

## Supported actions

- X / Twitter-style share intent
- LinkedIn offsite share
- Bluesky compose intent
- email share
- copy link

## Style variants

- `text`
- `button-row`
- `icon-label`

## Privacy story

This plugin intentionally avoids the usual social-plugin baggage:

- no third-party JavaScript SDKs,
- no share counts,
- no analytics pixels,
- no tracking storage,
- no automatic article-body injection,
- no plugin routes or plugin storage for v1.

The only enhancement script is the small copy-link helper. Without JavaScript, readers still get a manual copy panel.

## Notes

- Because this is a render-layer plugin, changing sitewide settings on a fully static site still requires a rebuild/redeploy before the public HTML updates.
- For the most precise share text, pass `title` from your theme template when you use the component directly.

## Publishing

This repo now ships two release paths:

### Trusted npm package

- the root package is published to npm as `emdash-social-sharing`
- CI runs `pnpm check` and `npm pack --dry-run`
- the npm publish workflow runs on `v*.*.*` tags and `workflow_dispatch`
- tag releases must match `package.json` exactly
- the publish job uses npm provenance (`npm publish --provenance`)

### Marketplace companion

- the companion source package lives in `marketplace/`
- validation runs through `pnpm --dir marketplace check`
- marketplace bundle validation runs `emdash plugin bundle --dir marketplace --validateOnly`
- this is the path to use before `emdash plugin publish` for the marketplace artifact

## Marketplace compatibility

Current EmDash marketplace publishing is for **standard / sandboxed** plugins bundled with `emdash plugin bundle` / `emdash plugin publish`.

The root `emdash-social-sharing` package is intentionally a **native / trusted** plugin because it depends on:

- `admin.portableTextBlocks`, and
- `componentsEntry` for site-side Astro block rendering.

That root npm package is therefore **not** itself marketplace-bundleable.

To support marketplace installation, this repository now includes a separate standard-format companion in `marketplace/` that:

- reuses the same settings contract,
- exposes a Block Kit settings page and dashboard widget,
- validates with `emdash plugin bundle --validateOnly`, and
- is the correct source package for `emdash plugin publish`.

Feature parity remains intentionally split under current EmDash rules:

- trusted package: full parity, including PT blocks and Astro rendering
- marketplace companion: settings management only
- hybrid mode: marketplace settings + direct Astro component import

## Development

```bash
pnpm install
pnpm test
pnpm typecheck
```
