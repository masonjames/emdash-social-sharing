import { SHARE_ACTION_LABELS } from "./defaults.js";
import type { ShareLinkAction, ShareTargetInput } from "./types.js";

function normalizeUrlInput(value: URL | string | undefined): URL | null {
	if (!value) return null;
	if (value instanceof URL) return value;

	try {
		return new URL(value);
	} catch {
		return null;
	}
}

function tryResolveUrl(value: string, base?: URL | null): URL | null {
	try {
		const resolved = base ? new URL(value, base) : new URL(value);
		if (resolved.protocol !== "http:" && resolved.protocol !== "https:") {
			return null;
		}
		return resolved;
	} catch {
		return null;
	}
}

function normalizeTitle(value: string | undefined): string | undefined {
	const trimmed = value?.trim();
	return trimmed ? trimmed : undefined;
}

export function resolveAbsoluteShareUrl(input: {
	canonicalUrl?: string;
	url?: string;
	requestUrl?: URL | string;
}): string | null {
	const requestUrl = normalizeUrlInput(input.requestUrl);
	const candidate = input.canonicalUrl?.trim() || input.url?.trim();

	if (candidate) {
		return tryResolveUrl(candidate, requestUrl)?.href ?? null;
	}

	if (!requestUrl) return null;
	return requestUrl.protocol === "http:" || requestUrl.protocol === "https:"
		? requestUrl.href
		: null;
}

export function buildXShare(input: ShareTargetInput): ShareLinkAction {
	const href = new URL("https://twitter.com/intent/tweet");
	href.searchParams.set("url", input.url);

	const title = normalizeTitle(input.title);
	if (title) {
		href.searchParams.set("text", title);
	}

	const via = input.publisherHandles?.x?.trim();
	if (via) {
		href.searchParams.set("via", via);
	}

	return {
		id: "x",
		label: SHARE_ACTION_LABELS.x,
		href: href.toString(),
	};
}

export function buildLinkedInShare(input: ShareTargetInput): ShareLinkAction {
	const href = new URL("https://www.linkedin.com/sharing/share-offsite/");
	href.searchParams.set("url", input.url);

	return {
		id: "linkedin",
		label: SHARE_ACTION_LABELS.linkedin,
		href: href.toString(),
	};
}

export function buildBlueskyShare(input: ShareTargetInput): ShareLinkAction {
	const title = normalizeTitle(input.title);
	const via = input.publisherHandles?.bluesky?.trim();

	const composedText = [title ? `${title}\n\n${input.url}` : input.url, via ? `via @${via}` : null]
		.filter(Boolean)
		.join("\n\n");

	const href = new URL("https://bsky.app/intent/compose");
	href.searchParams.set("text", composedText);

	return {
		id: "bluesky",
		label: SHARE_ACTION_LABELS.bluesky,
		href: href.toString(),
	};
}

export function buildEmailShare(input: ShareTargetInput): ShareLinkAction {
	const title = normalizeTitle(input.title);
	const href = new URL("mailto:");
	href.searchParams.set("subject", title ?? input.url);
	href.searchParams.set("body", title ? `${title}\n\n${input.url}` : input.url);

	return {
		id: "email",
		label: SHARE_ACTION_LABELS.email,
		href: href.toString(),
	};
}
