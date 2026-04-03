import type { PluginAdminConfig, PortableTextBlockConfig, ResolvedPlugin } from "emdash";
import { definePlugin } from "emdash";

import {
	DEFAULT_BLOCK_SELECTION_MODE,
	DEFAULT_SHARE_ALIGNMENT,
	DEFAULT_SHARE_DENSITY,
	DEFAULT_SOCIAL_SHARING_SETTINGS,
	SHARE_ACTION_OPTIONS,
	SHARE_ALIGNMENT_OPTIONS,
	SHARE_DENSITY_OPTIONS,
	SHARE_SELECTION_MODE_OPTIONS,
	SHARE_VARIANT_OPTIONS,
	SOCIAL_SHARING_PLUGIN_ID,
	SOCIAL_SHARING_VERSION,
} from "./defaults.js";

export const SOCIAL_SHARING_SETTINGS_SCHEMA: NonNullable<PluginAdminConfig["settingsSchema"]> = {
	enableX: {
		type: "boolean",
		label: "Enable X",
		description: "Show X/Twitter-style share links by default.",
		default: true,
	},
	enableLinkedIn: {
		type: "boolean",
		label: "Enable LinkedIn",
		description: "Show LinkedIn share links by default.",
		default: true,
	},
	enableBluesky: {
		type: "boolean",
		label: "Enable Bluesky",
		description: "Show Bluesky compose links by default.",
		default: true,
	},
	includeEmailShare: {
		type: "boolean",
		label: "Include email share",
		description: "Offer a mailto share action alongside social networks.",
		default: true,
	},
	includeCopyLink: {
		type: "boolean",
		label: "Include copy link",
		description: "Offer a copy-link action with a no-script fallback panel.",
		default: true,
	},
	defaultVariant: {
		type: "select",
		label: "Default style",
		description: "Choose the default presentation for share actions.",
		options: [...SHARE_VARIANT_OPTIONS],
		default: DEFAULT_SOCIAL_SHARING_SETTINGS.defaultVariant,
	},
	openInNewTab: {
		type: "boolean",
		label: "Open share links in a new tab",
		description: "Keep readers on your site while opening the share target separately.",
		default: DEFAULT_SOCIAL_SHARING_SETTINGS.openInNewTab,
	},
	publisherHandleX: {
		type: "string",
		label: "Publisher X handle",
		description: "Optional handle used as the via parameter on X/Twitter.",
		default: "",
	},
	publisherHandleBluesky: {
		type: "string",
		label: "Publisher Bluesky handle",
		description: "Optional handle appended to Bluesky share text.",
		default: "",
	},
};

// EmDash currently types portableTextBlocks fields as plain Block Kit elements,
// but conditional fields are supported by the runtime/docs. Keep the cast narrow
// until the public plugin types carry the conditional form-field shape.
const SOCIAL_SHARE_BLOCK_FIELDS = [
	{
		type: "text_input",
		action_id: "titleOverride",
		label: "Title override",
		placeholder: "Optional custom share title",
	},
	{
		type: "radio",
		action_id: "networkSelectionMode",
		label: "Network override",
		options: [...SHARE_SELECTION_MODE_OPTIONS],
		initial_value: DEFAULT_BLOCK_SELECTION_MODE,
	},
	{
		type: "checkbox",
		action_id: "networkSelection",
		label: "Networks to show or hide",
		options: [...SHARE_ACTION_OPTIONS],
		initial_value: [],
		condition: { field: "networkSelectionMode", neq: "inherit" },
	},
	{
		type: "select",
		action_id: "variant",
		label: "Style variant",
		options: [...SHARE_VARIANT_OPTIONS],
		initial_value: DEFAULT_SOCIAL_SHARING_SETTINGS.defaultVariant,
	},
	{
		type: "radio",
		action_id: "density",
		label: "Density",
		options: [...SHARE_DENSITY_OPTIONS],
		initial_value: DEFAULT_SHARE_DENSITY,
	},
	{
		type: "radio",
		action_id: "alignment",
		label: "Alignment",
		options: [...SHARE_ALIGNMENT_OPTIONS],
		initial_value: DEFAULT_SHARE_ALIGNMENT,
	},
] as unknown as NonNullable<PortableTextBlockConfig["fields"]>;

export const SOCIAL_SHARE_PORTABLE_TEXT_BLOCK: PortableTextBlockConfig = {
	type: "socialShare",
	label: "Social Share",
	icon: "link-external",
	description: "Render privacy-light share actions for the current page.",
	fields: SOCIAL_SHARE_BLOCK_FIELDS,
};

export function createPlugin(): ResolvedPlugin {
	return definePlugin({
		id: SOCIAL_SHARING_PLUGIN_ID,
		version: SOCIAL_SHARING_VERSION,
		capabilities: [],
		admin: {
			settingsSchema: SOCIAL_SHARING_SETTINGS_SCHEMA,
			portableTextBlocks: [SOCIAL_SHARE_PORTABLE_TEXT_BLOCK],
		},
	});
}

export default createPlugin;
