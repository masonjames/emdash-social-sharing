import type {
	NetworkSelectionMode,
	ShareActionId,
	ShareAlignment,
	ShareDensity,
	ShareNetwork,
	ShareVariant,
	SocialSharingSettings,
} from "./types.js";

export const SOCIAL_SHARING_PLUGIN_ID = "social-sharing";
export const SOCIAL_SHARING_VERSION = "0.1.2";

export const SHARE_NETWORKS = ["x", "linkedin", "bluesky"] as const satisfies readonly ShareNetwork[];
export const SHARE_ACTION_ORDER = ["x", "linkedin", "bluesky", "email", "copy"] as const satisfies readonly ShareActionId[];

export const SHARE_VARIANT_OPTIONS = [
	{ value: "text", label: "Text links" },
	{ value: "button-row", label: "Button row" },
	{ value: "icon-label", label: "Icon + label" },
] as const satisfies ReadonlyArray<{ value: ShareVariant; label: string }>;

export const SHARE_DENSITY_OPTIONS = [
	{ value: "default", label: "Default" },
	{ value: "compact", label: "Compact" },
] as const satisfies ReadonlyArray<{ value: ShareDensity; label: string }>;

export const SHARE_ALIGNMENT_OPTIONS = [
	{ value: "start", label: "Start" },
	{ value: "center", label: "Center" },
	{ value: "end", label: "End" },
] as const satisfies ReadonlyArray<{ value: ShareAlignment; label: string }>;

export const SHARE_SELECTION_MODE_OPTIONS = [
	{ value: "inherit", label: "Use site defaults" },
	{ value: "show-only", label: "Show only selected" },
	{ value: "hide-selected", label: "Hide selected" },
] as const satisfies ReadonlyArray<{ value: NetworkSelectionMode; label: string }>;

export const SHARE_ACTION_OPTIONS = [
	{ value: "x", label: "X" },
	{ value: "linkedin", label: "LinkedIn" },
	{ value: "bluesky", label: "Bluesky" },
	{ value: "email", label: "Email" },
	{ value: "copy", label: "Copy link" },
] as const satisfies ReadonlyArray<{ value: ShareActionId; label: string }>;

export const SHARE_ACTION_LABELS: Record<ShareActionId, string> = {
	x: "Share on X",
	linkedin: "Share on LinkedIn",
	bluesky: "Share on Bluesky",
	email: "Share via email",
	copy: "Copy link",
};

export const DEFAULT_SHARE_DENSITY: ShareDensity = "default";
export const DEFAULT_SHARE_ALIGNMENT: ShareAlignment = "start";
export const DEFAULT_BLOCK_SELECTION_MODE: NetworkSelectionMode = "inherit";
export const DEFAULT_SHARE_ARIA_LABEL = "Share this page";

export const DEFAULT_SOCIAL_SHARING_SETTINGS: SocialSharingSettings = {
	enabledNetworks: [...SHARE_NETWORKS],
	includeEmailShare: true,
	includeCopyLink: true,
	defaultVariant: "button-row",
	openInNewTab: true,
	publisherHandles: {},
};
