import type { PluginDescriptor } from "emdash";
import { SOCIAL_SHARING_PLUGIN_ID, SOCIAL_SHARING_VERSION } from "../../src/defaults.js";

export const SOCIAL_SHARING_MARKETPLACE_WIDGET_ID = "summary";
export const SOCIAL_SHARING_MARKETPLACE_SETTINGS_PATH = "/settings";

export function socialSharingMarketplacePlugin(): PluginDescriptor {
	return {
		id: SOCIAL_SHARING_PLUGIN_ID,
		version: SOCIAL_SHARING_VERSION,
		format: "standard",
		entrypoint: "emdash-social-sharing-marketplace/sandbox",
		capabilities: [],
		adminPages: [
			{
				path: SOCIAL_SHARING_MARKETPLACE_SETTINGS_PATH,
				label: "Social Sharing",
				icon: "link-external",
			},
		],
		adminWidgets: [
			{
				id: SOCIAL_SHARING_MARKETPLACE_WIDGET_ID,
				title: "Social Sharing",
				size: "third",
			},
		],
	};
}

