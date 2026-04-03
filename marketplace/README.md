# emdash-social-sharing marketplace companion

This package is the marketplace-safe companion for `emdash-social-sharing`.

It is intentionally **not** published to npm. It exists so the repository can produce a standard/sandboxed EmDash marketplace bundle that manages sitewide social-sharing defaults.

What it does:

- exposes a standard-format plugin descriptor
- renders a Block Kit settings page and dashboard widget
- persists the same `settings:*` keys used by the trusted package

What it does not do:

- register Portable Text blocks
- ship Astro rendering components
- provide full parity with the trusted `emdash-social-sharing` package

Use this package when you want marketplace installation for settings management. Use the trusted root package when you want theme rendering and Portable Text block support.
