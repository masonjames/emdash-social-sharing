import type { PluginDescriptor } from "emdash";

import { SOCIAL_SHARING_PLUGIN_ID, SOCIAL_SHARING_VERSION } from "./defaults.js";

export function socialSharingPlugin(): PluginDescriptor {
	return {
		id: SOCIAL_SHARING_PLUGIN_ID,
		version: SOCIAL_SHARING_VERSION,
		format: "native",
		entrypoint: "@emdash-cms/plugin-social-sharing/plugin",
		componentsEntry: "@emdash-cms/plugin-social-sharing/astro",
		options: {},
	};
}

export default socialSharingPlugin;

export { createPlugin } from "./plugin.js";
export * from "./defaults.js";
export type * from "./types.js";
