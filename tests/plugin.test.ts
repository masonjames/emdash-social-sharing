import { describe, expect, it } from "vitest";

import { createPlugin, SOCIAL_SHARE_PORTABLE_TEXT_BLOCK, SOCIAL_SHARING_SETTINGS_SCHEMA } from "../src/plugin.js";
import { SOCIAL_SHARING_PLUGIN_ID, SOCIAL_SHARING_VERSION, socialSharingPlugin } from "../src/index.js";

describe("socialSharingPlugin descriptor", () => {
	it("returns a native descriptor wired to the runtime and astro entrypoints", () => {
		const descriptor = socialSharingPlugin();

		expect(descriptor).toMatchObject({
			id: SOCIAL_SHARING_PLUGIN_ID,
			version: SOCIAL_SHARING_VERSION,
			format: "native",
			entrypoint: "emdash-social-sharing/plugin",
			componentsEntry: "emdash-social-sharing/astro",
		});
	});
});

describe("createPlugin", () => {
	it("returns a route-free, storage-free plugin with no capabilities", () => {
		const plugin = createPlugin();

		expect(plugin.id).toBe(SOCIAL_SHARING_PLUGIN_ID);
		expect(plugin.version).toBe(SOCIAL_SHARING_VERSION);
		expect(plugin.capabilities).toEqual([]);
		expect(plugin.routes).toEqual({});
		expect(plugin.storage).toEqual({});
		expect(plugin.hooks).toEqual({});
	});

	it("publishes the expected settings schema", () => {
		const plugin = createPlugin();
		const schema = plugin.admin.settingsSchema ?? {};

		expect(Object.keys(schema)).toEqual(Object.keys(SOCIAL_SHARING_SETTINGS_SCHEMA));
		expect(schema.defaultVariant?.type).toBe("select");
		expect(schema.publisherHandleX?.type).toBe("string");
		expect(schema.publisherHandleBluesky?.type).toBe("string");
	});

	it("registers the Social Share portable text block", () => {
		const plugin = createPlugin();
		const block = plugin.admin.portableTextBlocks?.[0];

		expect(block).toMatchObject({
			type: "socialShare",
			label: "Social Share",
			icon: "link-external",
		});
		expect(block?.fields).toHaveLength(SOCIAL_SHARE_PORTABLE_TEXT_BLOCK.fields?.length ?? 0);
	});
});
