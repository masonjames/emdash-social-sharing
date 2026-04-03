import type { PluginContext } from "emdash";
import {
	SHARE_ACTION_ORDER,
	SHARE_ACTION_LABELS,
	SHARE_VARIANT_OPTIONS,
} from "../../src/defaults.js";
import {
	resolveSettings,
	serializeSettingsForStorage,
} from "../../src/settings.js";
import type { SocialSharingSettings } from "../../src/types.js";

import {
	SOCIAL_SHARING_MARKETPLACE_SETTINGS_PATH,
	SOCIAL_SHARING_MARKETPLACE_WIDGET_ID,
} from "./index.js";

export interface BlockResponse {
	blocks: unknown[];
	toast?: {
		message: string;
		type: "success" | "error";
	};
}

export interface AdminInteraction {
	type: string;
	page?: string;
	action_id?: string;
	values?: Record<string, unknown>;
}

const SETTINGS_PREFIX = "settings:";

function formatEnabledActions(state: SocialSharingSettings): string {
	const enabled = SHARE_ACTION_ORDER.filter((action) => {
		if (action === "email") return state.includeEmailShare;
		if (action === "copy") return state.includeCopyLink;
		return state.enabledNetworks.includes(action);
	});

	return enabled.map((action) => SHARE_ACTION_LABELS[action]).join(", ") || "None";
}

function handleDisplay(handle?: string): string {
	return handle ? `@${handle}` : "—";
}

function normalizeInteraction(input: unknown): AdminInteraction {
	if (!input || typeof input !== "object") return { type: "unknown" };
	const candidate = input as Record<string, unknown>;
	return {
		type: typeof candidate.type === "string" ? candidate.type : "unknown",
		page: typeof candidate.page === "string" ? candidate.page : undefined,
		action_id: typeof candidate.action_id === "string" ? candidate.action_id : undefined,
		values:
			candidate.values && typeof candidate.values === "object" && !Array.isArray(candidate.values)
				? (candidate.values as Record<string, unknown>)
				: undefined,
	};
}

export async function loadSettingsState(ctx: PluginContext): Promise<SocialSharingSettings> {
	const entries = await ctx.kv.list(SETTINGS_PREFIX);
	const raw = Object.fromEntries(
		entries
			.filter((entry) => entry.key.startsWith(SETTINGS_PREFIX))
			.map((entry) => [entry.key.slice(SETTINGS_PREFIX.length), entry.value]),
	);

	return resolveSettings(raw);
}

export function buildSummaryWidget(state: SocialSharingSettings): BlockResponse {
	return {
		blocks: [
			{
				type: "fields",
				fields: [
					{ label: "Enabled", value: formatEnabledActions(state) },
					{ label: "Variant", value: state.defaultVariant },
					{ label: "New tab", value: state.openInNewTab ? "Enabled" : "Disabled" },
					{
						label: "Handles",
						value: [handleDisplay(state.publisherHandles.x), handleDisplay(state.publisherHandles.bluesky)].join(" · "),
					},
				],
			},
			{
				type: "context",
				text: "Theme rendering and Portable Text blocks still require the trusted emdash-social-sharing package.",
			},
		],
	};
}

export function buildSettingsPage(state: SocialSharingSettings, siteUrl: string): BlockResponse {
	return {
		blocks: [
			{ type: "header", text: "Social Sharing" },
			{
				type: "section",
				text: "This marketplace variant manages sitewide sharing defaults in the admin. It does not register Portable Text blocks or site rendering components.",
			},
			{
				type: "banner",
				style: "warning",
				text: "For full feature parity, install the trusted `emdash-social-sharing` package in astro.config.mjs. Do not run both plugin runtimes at the same time.",
			},
			{
				type: "fields",
				fields: [
					{ label: "Enabled actions", value: formatEnabledActions(state) },
					{ label: "Default variant", value: state.defaultVariant },
					{ label: "Open in new tab", value: state.openInNewTab ? "Yes" : "No" },
					{ label: "Site URL", value: siteUrl || "Unknown" },
					{ label: "X handle", value: handleDisplay(state.publisherHandles.x) },
					{ label: "Bluesky handle", value: handleDisplay(state.publisherHandles.bluesky) },
				],
			},
			{ type: "divider" },
			{
				type: "form",
				block_id: "social-sharing-settings",
				fields: [
					{
						type: "toggle",
						action_id: "enableX",
						label: "Enable X",
						initial_value: state.enabledNetworks.includes("x"),
					},
					{
						type: "toggle",
						action_id: "enableLinkedIn",
						label: "Enable LinkedIn",
						initial_value: state.enabledNetworks.includes("linkedin"),
					},
					{
						type: "toggle",
						action_id: "enableBluesky",
						label: "Enable Bluesky",
						initial_value: state.enabledNetworks.includes("bluesky"),
					},
					{
						type: "toggle",
						action_id: "includeEmailShare",
						label: "Enable email sharing",
						initial_value: state.includeEmailShare,
					},
					{
						type: "toggle",
						action_id: "includeCopyLink",
						label: "Enable copy link",
						initial_value: state.includeCopyLink,
					},
					{
						type: "toggle",
						action_id: "openInNewTab",
						label: "Open external targets in a new tab",
						initial_value: state.openInNewTab,
					},
					{
						type: "select",
						action_id: "defaultVariant",
						label: "Default variant",
						options: SHARE_VARIANT_OPTIONS.map((option) => ({
							label: option.label,
							value: option.value,
						})),
						initial_value: state.defaultVariant,
					},
					{
						type: "text_input",
						action_id: "publisherHandleX",
						label: "Publisher X handle",
						initial_value: state.publisherHandles.x ?? "",
					},
					{
						type: "text_input",
						action_id: "publisherHandleBluesky",
						label: "Publisher Bluesky handle",
						initial_value: state.publisherHandles.bluesky ?? "",
					},
				],
				submit: {
					label: "Save Settings",
					action_id: "save_settings",
				},
			},
			{ type: "divider" },
			{ type: "header", text: "Install Modes" },
			{
				type: "section",
				text: "Trusted full plugin: import socialSharingPlugin() from emdash-social-sharing in astro.config.mjs for theme rendering + Portable Text blocks.",
			},
			{
				type: "section",
				text: "Hybrid mode: keep this marketplace settings companion installed, then import SocialShare from emdash-social-sharing/astro in your theme templates.",
			},
			{
				type: "context",
				text: `Trusted install example: emdash({ plugins: [socialSharingPlugin()] }) for ${siteUrl || "your site"}.`,
			},
		],
	};
}

export async function saveSettings(
	values: Record<string, unknown>,
	ctx: PluginContext,
): Promise<{ state: SocialSharingSettings; response: BlockResponse }> {
	const normalized = resolveSettings(values);
	const stored = serializeSettingsForStorage(normalized);

	await Promise.all(
		Object.entries(stored).map(([key, value]) => ctx.kv.set(`${SETTINGS_PREFIX}${key}`, value)),
	);

	return {
		state: normalized,
		response: {
			...buildSettingsPage(normalized, ctx.site.url),
			toast: { message: "Settings saved", type: "success" },
		},
	};
}

export async function handleAdminRoute(
	routeCtx: { input?: unknown; request: Request; requestMeta?: unknown },
	ctx: PluginContext,
): Promise<BlockResponse> {
	const interaction = normalizeInteraction(routeCtx.input);

	if (interaction.type === "page_load" && interaction.page === SOCIAL_SHARING_MARKETPLACE_SETTINGS_PATH) {
		return buildSettingsPage(await loadSettingsState(ctx), ctx.site.url);
	}

	if (
		interaction.type === "page_load" &&
		interaction.page === `widget:${SOCIAL_SHARING_MARKETPLACE_WIDGET_ID}`
	) {
		return buildSummaryWidget(await loadSettingsState(ctx));
	}

	if (interaction.type === "form_submit" && interaction.action_id === "save_settings") {
		const { response } = await saveSettings(interaction.values ?? {}, ctx);
		return response;
	}

	return { blocks: [] };
}
