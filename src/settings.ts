import {
	DEFAULT_SOCIAL_SHARING_SETTINGS,
	SHARE_ACTION_ORDER,
	SHARE_NETWORKS,
	SHARE_VARIANT_OPTIONS,
} from "./defaults.js";
import type {
	PublisherHandles,
	ShareActionId,
	ShareAlignment,
	ShareDensity,
	ShareNetwork,
	ShareVariant,
	SocialSharingSettings,
} from "./types.js";

export interface StoredSocialSharingSettings {
	enableX: boolean;
	enableLinkedIn: boolean;
	enableBluesky: boolean;
	includeEmailShare: boolean;
	includeCopyLink: boolean;
	defaultVariant: ShareVariant;
	openInNewTab: boolean;
	publisherHandleX: string;
	publisherHandleBluesky: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeBoolean(value: unknown, fallback: boolean): boolean {
	return typeof value === "boolean" ? value : fallback;
}

function normalizeString(value: unknown): string | undefined {
	if (typeof value !== "string") return undefined;
	const trimmed = value.trim();
	return trimmed.length > 0 ? trimmed : undefined;
}

export function isShareNetwork(value: unknown): value is ShareNetwork {
	return SHARE_NETWORKS.includes(value as ShareNetwork);
}

export function isShareActionId(value: unknown): value is ShareActionId {
	return SHARE_ACTION_ORDER.includes(value as ShareActionId);
}

export function isShareVariant(value: unknown): value is ShareVariant {
	return SHARE_VARIANT_OPTIONS.some((option) => option.value === value);
}

export function isShareDensity(value: unknown): value is ShareDensity {
	return value === "default" || value === "compact";
}

export function isShareAlignment(value: unknown): value is ShareAlignment {
	return value === "start" || value === "center" || value === "end";
}

export function normalizePublisherHandle(value: unknown): string | undefined {
	const normalized = normalizeString(value);
	if (!normalized) return undefined;
	return normalized.replace(/^@+/, "");
}

export function normalizePublisherHandles(value: unknown): PublisherHandles {
	if (!isRecord(value)) return {};

	const x = normalizePublisherHandle(value.x);
	const bluesky = normalizePublisherHandle(value.bluesky);

	return {
		...(x ? { x } : {}),
		...(bluesky ? { bluesky } : {}),
	};
}

export function canonicalizeShareNetworks(values: Iterable<unknown>): ShareNetwork[] {
	const enabled = new Set<ShareNetwork>();
	for (const value of values) {
		if (isShareNetwork(value)) enabled.add(value);
	}
	return SHARE_NETWORKS.filter((network) => enabled.has(network));
}

export function canonicalizeShareActions(values: Iterable<unknown>): ShareActionId[] {
	const enabled = new Set<ShareActionId>();
	for (const value of values) {
		if (isShareActionId(value)) enabled.add(value);
	}
	return SHARE_ACTION_ORDER.filter((action) => enabled.has(action));
}

export function resolveSettings(
	raw?: Record<string, unknown> | StoredSocialSharingSettings | null,
): SocialSharingSettings {
	const record = isRecord(raw) ? raw : {};

	const enabledNetworks = Array.isArray(record.enabledNetworks)
		? canonicalizeShareNetworks(record.enabledNetworks)
		: canonicalizeShareNetworks([
				normalizeBoolean(
					record.enableX,
					DEFAULT_SOCIAL_SHARING_SETTINGS.enabledNetworks.includes("x"),
				)
					? "x"
					: null,
				normalizeBoolean(
					record.enableLinkedIn,
					DEFAULT_SOCIAL_SHARING_SETTINGS.enabledNetworks.includes("linkedin"),
				)
					? "linkedin"
					: null,
				normalizeBoolean(
					record.enableBluesky,
					DEFAULT_SOCIAL_SHARING_SETTINGS.enabledNetworks.includes("bluesky"),
				)
					? "bluesky"
					: null,
			]);

	const objectHandles = normalizePublisherHandles(record.publisherHandles);
	const x = normalizePublisherHandle(record.publisherHandleX) ?? objectHandles.x;
	const bluesky = normalizePublisherHandle(record.publisherHandleBluesky) ?? objectHandles.bluesky;

	return {
		enabledNetworks,
		includeEmailShare: normalizeBoolean(
			record.includeEmailShare,
			DEFAULT_SOCIAL_SHARING_SETTINGS.includeEmailShare,
		),
		includeCopyLink: normalizeBoolean(
			record.includeCopyLink,
			DEFAULT_SOCIAL_SHARING_SETTINGS.includeCopyLink,
		),
		defaultVariant: isShareVariant(record.defaultVariant)
			? record.defaultVariant
			: DEFAULT_SOCIAL_SHARING_SETTINGS.defaultVariant,
		openInNewTab: normalizeBoolean(
			record.openInNewTab,
			DEFAULT_SOCIAL_SHARING_SETTINGS.openInNewTab,
		),
		publisherHandles: {
			...(x ? { x } : {}),
			...(bluesky ? { bluesky } : {}),
		},
	};
}

export function serializeSettingsForStorage(
	settings: SocialSharingSettings,
): StoredSocialSharingSettings {
	return {
		enableX: settings.enabledNetworks.includes("x"),
		enableLinkedIn: settings.enabledNetworks.includes("linkedin"),
		enableBluesky: settings.enabledNetworks.includes("bluesky"),
		includeEmailShare: settings.includeEmailShare,
		includeCopyLink: settings.includeCopyLink,
		defaultVariant: settings.defaultVariant,
		openInNewTab: settings.openInNewTab,
		publisherHandleX: settings.publisherHandles.x ?? "",
		publisherHandleBluesky: settings.publisherHandles.bluesky ?? "",
	};
}
