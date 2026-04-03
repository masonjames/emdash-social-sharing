# emdash-social-sharing

Privacy-light social sharing for EmDash.

This plugin gives you:

- an installable `socialShare` Portable Text block,
- a reusable Astro component for theme templates,
- sitewide share settings in the EmDash admin,
- server-built share URLs with no third-party SDKs,
- a progressively enhanced copy-link action that still works without JavaScript.

## Status

`emdash-social-sharing` is a **native / trusted EmDash plugin**.

That means:

- install it in `plugins: []`,
- do **not** install it in `sandboxed: []`,
- it is npm/source publishable,
- it is **not** marketplace-bundleable under current EmDash plugin rules because it ships Portable Text rendering components.
- it is installed officially as a trusted npm package through `astro.config.mjs`, not through the admin marketplace installer.

## Install

```bash
pnpm add emdash-social-sharing
```

## Register the plugin

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

This repo is set up for npm publication as a **public package**.

- CI runs `pnpm check` and `npm pack --dry-run` on pushes and pull requests.
- The npm publish workflow runs on `v*.*.*` tags and `workflow_dispatch`.
- Tag releases must match `package.json` exactly — for example, package version `0.2.0` must be published from tag `v0.2.0`.
- The GitHub Actions workflow expects a repository secret named `NPM_TOKEN`.
- The publish job uses npm provenance (`npm publish --provenance`).

## Marketplace compatibility

Current EmDash marketplace publishing is for **standard / sandboxed** plugins bundled with `emdash plugin bundle` / `emdash plugin publish`.

This package is intentionally a **native / trusted** plugin because it depends on:

- `admin.portableTextBlocks`, and
- `componentsEntry` for site-side Astro block rendering.

Under current EmDash rules, that means it **cannot** be published as an admin-installable marketplace bundle with `emdash plugin publish`. The official installation path for this package is npm + `astro.config.mjs`. A marketplace version would require either:

- EmDash marketplace support for native plugins, or
- a separate standard-format plugin with a reduced feature set.

## Development

```bash
pnpm install
pnpm test
pnpm typecheck
```
