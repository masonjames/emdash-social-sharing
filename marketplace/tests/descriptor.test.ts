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
			version: "0.1.1",
			format: "standard",
			entrypoint: "emdash-social-sharing-marketplace/sandbox",
			capabilities: [],
			adminPages: [{ path: SOCIAL_SHARING_MARKETPLACE_SETTINGS_PATH, label: "Social Sharing" }],
			adminWidgets: [{ id: SOCIAL_SHARING_MARKETPLACE_WIDGET_ID, title: "Social Sharing", size: "third" }],
		});
	});
});
