import { describe, expect, it } from "vitest";

import { DEFAULT_SOCIAL_SHARING_SETTINGS } from "../src/defaults.js";
import { extractStoredSettingsValues } from "../src/render-context.js";
import { resolveSettings } from "../src/settings.js";

describe("resolveSettings", () => {
	it("returns defaults when no settings have been saved yet", () => {
		expect(resolveSettings()).toEqual(DEFAULT_SOCIAL_SHARING_SETTINGS);
	});

	it("supports the PRD-shaped settings object and normalizes handles", () => {
		expect(
			resolveSettings({
				enabledNetworks: ["bluesky", "x", "x", "linkedin", "mastodon"],
				includeEmailShare: false,
				includeCopyLink: false,
				defaultVariant: "text",
				openInNewTab: false,
				publisherHandles: {
					x: " @emdash ",
					bluesky: "@@team.bsky.social ",
				},
			}),
		).toEqual({
			enabledNetworks: ["x", "linkedin", "bluesky"],
			includeEmailShare: false,
			includeCopyLink: false,
			defaultVariant: "text",
			openInNewTab: false,
			publisherHandles: {
				x: "emdash",
				bluesky: "team.bsky.social",
			},
		});
	});

	it("derives canonical network order from boolean schema fields", () => {
		expect(
			resolveSettings({
				enableX: false,
				enableLinkedIn: true,
				enableBluesky: true,
			}).enabledNetworks,
		).toEqual(["linkedin", "bluesky"]);
	});

	it("falls back on invalid values and drops empty handles", () => {
		expect(
			resolveSettings({
				defaultVariant: "grid",
				publisherHandleX: " ",
				publisherHandleBluesky: "@",
			}),
		).toEqual({
			...DEFAULT_SOCIAL_SHARING_SETTINGS,
			publisherHandles: {},
		});
	});
});

describe("extractStoredSettingsValues", () => {
	it("reads plugin-prefixed settings rows and ignores malformed values", () => {
		expect(
			extractStoredSettingsValues([
				{
					name: "plugin:social-sharing:settings:includeCopyLink",
					value: "false",
				},
				{
					name: "plugin:social-sharing:settings:publisherHandleX",
					value: "\"emdash\"",
				},
				{
					name: "plugin:social-sharing:settings:defaultVariant",
					value: "\"icon-label\"",
				},
				{
					name: "plugin:social-sharing:settings:broken",
					value: "{oops",
				},
				{
					name: "plugin:other-plugin:settings:includeCopyLink",
					value: "true",
				},
			]),
		).toEqual({
			includeCopyLink: false,
			publisherHandleX: "emdash",
			defaultVariant: "icon-label",
		});
	});
});
