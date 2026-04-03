import { describe, expect, it } from "vitest";

import { buildBlueskyShare, buildEmailShare, buildLinkedInShare, buildXShare, resolveAbsoluteShareUrl } from "../src/networks.js";

describe("resolveAbsoluteShareUrl", () => {
	it("prefers canonical URLs and resolves relative paths against the request URL", () => {
		expect(
			resolveAbsoluteShareUrl({
				canonicalUrl: "/posts/hello-world",
				requestUrl: "https://example.com/blog/hello-world/",
			}),
		).toBe("https://example.com/posts/hello-world");
	});

	it("falls back to the current request URL when no explicit URL is provided", () => {
		expect(
			resolveAbsoluteShareUrl({
				requestUrl: "https://example.com/articles/share-me",
			}),
		).toBe("https://example.com/articles/share-me");
	});

	it("rejects non-http URLs", () => {
		expect(
			resolveAbsoluteShareUrl({
				url: "javascript:alert(1)",
				requestUrl: "https://example.com/articles/share-me",
			}),
		).toBeNull();
	});
});

describe("share target builders", () => {
	it("builds X share URLs with text and via", () => {
		const href = buildXShare({
			url: "https://example.com/posts/share-me",
			title: "Share me",
			publisherHandles: { x: "emdash" },
		}).href;

		const url = new URL(href);
		expect(url.origin + url.pathname).toBe("https://twitter.com/intent/tweet");
		expect(url.searchParams.get("url")).toBe("https://example.com/posts/share-me");
		expect(url.searchParams.get("text")).toBe("Share me");
		expect(url.searchParams.get("via")).toBe("emdash");
	});

	it("builds LinkedIn share URLs with the offsite endpoint", () => {
		const href = buildLinkedInShare({
			url: "https://example.com/posts/share-me",
			title: "Ignored by LinkedIn",
		}).href;

		const url = new URL(href);
		expect(url.origin + url.pathname).toBe("https://www.linkedin.com/sharing/share-offsite/");
		expect(url.searchParams.get("url")).toBe("https://example.com/posts/share-me");
	});

	it("builds Bluesky compose text with title, URL, and optional handle", () => {
		const href = buildBlueskyShare({
			url: "https://example.com/posts/share-me",
			title: "Share me",
			publisherHandles: { bluesky: "team.bsky.social" },
		}).href;

		const url = new URL(href);
		expect(url.origin + url.pathname).toBe("https://bsky.app/intent/compose");
		expect(url.searchParams.get("text")).toBe(
			"Share me\n\nhttps://example.com/posts/share-me\n\nvia @team.bsky.social",
		);
	});

	it("builds mailto shares with encoded subject and body", () => {
		const href = buildEmailShare({
			url: "https://example.com/posts/share-me",
			title: "Share me",
		}).href;

		const url = new URL(href);
		expect(url.protocol).toBe("mailto:");
		expect(url.searchParams.get("subject")).toBe("Share me");
		expect(url.searchParams.get("body")).toBe("Share me\n\nhttps://example.com/posts/share-me");
	});

	it("falls back to URL-only email shares when no title is available", () => {
		const href = buildEmailShare({
			url: "https://example.com/posts/share-me",
		}).href;

		const url = new URL(href);
		expect(url.searchParams.get("subject")).toBe("https://example.com/posts/share-me");
		expect(url.searchParams.get("body")).toBe("https://example.com/posts/share-me");
	});
});
