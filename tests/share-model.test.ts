import { describe, expect, it } from "vitest";

import { DEFAULT_SOCIAL_SHARING_SETTINGS } from "../src/defaults.js";
import { resolveSocialShareModel } from "../src/share-model.js";

const requestUrl = new URL("https://example.com/articles/hello-world");

describe("resolveSocialShareModel", () => {
	it("uses site settings in canonical action order", () => {
		const model = resolveSocialShareModel({
			requestUrl,
			siteSettings: {
				...DEFAULT_SOCIAL_SHARING_SETTINGS,
				enabledNetworks: ["linkedin", "x"],
				includeEmailShare: false,
				includeCopyLink: true,
			},
		});

		expect(model?.actions.map((action) => action.id)).toEqual(["x", "linkedin", "copy"]);
		expect(model?.variant).toBe("button-row");
	});

	it("lets explicit component props override settings", () => {
		const model = resolveSocialShareModel({
			requestUrl,
			siteSettings: DEFAULT_SOCIAL_SHARING_SETTINGS,
			componentProps: {
				title: "Custom share title",
				variant: "text",
				openInNewTab: false,
				enabledActions: ["copy", "x", "copy"],
				publisherHandles: { x: "custom-handle" },
			},
		});

		expect(model?.actions.map((action) => action.id)).toEqual(["x", "copy"]);
		expect(model?.variant).toBe("text");
		expect(model?.openInNewTab).toBe(false);

		const xAction = model?.actions.find((action) => action.id === "x");
		expect(xAction && "href" in xAction ? new URL(xAction.href).searchParams.get("via") : null).toBe(
			"custom-handle",
		);
	});

	it("supports show-only block overrides even when site settings disable those actions", () => {
		const model = resolveSocialShareModel({
			requestUrl,
			siteSettings: {
				...DEFAULT_SOCIAL_SHARING_SETTINGS,
				enabledNetworks: [],
				includeEmailShare: false,
				includeCopyLink: false,
			},
			componentProps: {
				block: {
					_type: "socialShare",
					_key: "share-1",
					titleOverride: "Share this essay",
					networkSelectionMode: "show-only",
					networkSelection: ["copy", "bluesky"],
					density: "compact",
					alignment: "center",
				},
			},
		});

		expect(model?.actions.map((action) => action.id)).toEqual(["bluesky", "copy"]);
		expect(model?.density).toBe("compact");
		expect(model?.alignment).toBe("center");
	});

	it("supports hide-selected block overrides", () => {
		const model = resolveSocialShareModel({
			requestUrl,
			siteSettings: DEFAULT_SOCIAL_SHARING_SETTINGS,
			componentProps: {
				block: {
					_type: "socialShare",
					_key: "share-2",
					networkSelectionMode: "hide-selected",
					networkSelection: ["x", "copy"],
				},
			},
		});

		expect(model?.actions.map((action) => action.id)).toEqual(["linkedin", "bluesky", "email"]);
	});

	it("returns null when no action survives or no URL can be resolved", () => {
		expect(
			resolveSocialShareModel({
				siteSettings: {
					...DEFAULT_SOCIAL_SHARING_SETTINGS,
					enabledNetworks: [],
					includeEmailShare: false,
					includeCopyLink: false,
				},
				requestUrl,
			}),
		).toBeNull();

		expect(
			resolveSocialShareModel({
				componentProps: {
					url: "javascript:alert(1)",
				},
			}),
		).toBeNull();
	});
});
