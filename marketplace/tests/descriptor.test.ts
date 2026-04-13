import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import {
	SOCIAL_SHARING_MARKETPLACE_SETTINGS_PATH,
	SOCIAL_SHARING_MARKETPLACE_WIDGET_ID,
	socialSharingMarketplacePlugin,
} from "../src/index.js";

describe("socialSharingMarketplacePlugin", () => {
	it("returns a standard marketplace-safe descriptor", () => {
		expect(socialSharingMarketplacePlugin()).toMatchObject({
			id: "social-sharing",
			version: "0.1.2",
			format: "standard",
			entrypoint: "emdash-social-sharing-marketplace/sandbox",
			capabilities: [],
			allowedHosts: [],
			adminPages: [{ path: SOCIAL_SHARING_MARKETPLACE_SETTINGS_PATH, label: "Social Sharing" }],
			adminWidgets: [{ id: SOCIAL_SHARING_MARKETPLACE_WIDGET_ID, title: "Social Sharing", size: "third" }],
		});
	});

	it("keeps marketplace package plugin.id in sync", () => {
		const descriptor = socialSharingMarketplacePlugin();
		const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8")) as {
			plugin?: { id?: string };
		};
		expect(pkg.plugin?.id).toBe(descriptor.id);
		expect(pkg.plugin?.id).toBe("social-sharing");
	});
});
