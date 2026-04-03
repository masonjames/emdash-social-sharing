import type { PluginContext } from "emdash";
import { describe, expect, it } from "vitest";

import {
	buildSummaryWidget,
	handleAdminRoute,
	loadSettingsState,
	saveSettings,
} from "../src/admin.js";

function createContext(seed: Record<string, unknown> = {}) {
	const store = new Map<string, unknown>(Object.entries(seed));

	const ctx = {
		plugin: { id: "social-sharing", version: "0.1.1" },
		storage: {},
		kv: {
			async get<T>(key: string) {
				return (store.get(key) as T | undefined) ?? null;
			},
			async set(key: string, value: unknown) {
				store.set(key, value);
			},
			async delete(key: string) {
				return store.delete(key);
			},
			async list(prefix = "") {
				return [...store.entries()]
					.filter(([key]) => key.startsWith(prefix))
					.map(([key, value]) => ({ key, value }));
			},
		},
		site: {
			name: "Test Site",
			url: "https://example.com",
			locale: "en-US",
		},
		log: {
			debug() {},
			info() {},
			warn() {},
			error() {},
		},
		url(path: string) {
			return new URL(path, "https://example.com").toString();
		},
	} as unknown as PluginContext;

	return { ctx, store };
}

describe("marketplace admin route", () => {
	it("loads default settings from an empty kv store", async () => {
		const { ctx } = createContext();

		expect(await loadSettingsState(ctx)).toEqual({
			enabledNetworks: ["x", "linkedin", "bluesky"],
			includeEmailShare: true,
			includeCopyLink: true,
			defaultVariant: "button-row",
			openInNewTab: true,
			publisherHandles: {},
		});
	});

	it("renders the settings page on page_load", async () => {
		const { ctx } = createContext();

		const response = await handleAdminRoute(
			{
				input: { type: "page_load", page: "/settings" },
				request: new Request("https://example.com"),
			},
			ctx,
		);

		expect(response.blocks).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ type: "header", text: "Social Sharing" }),
				expect.objectContaining({ type: "form", block_id: "social-sharing-settings" }),
			]),
		);
	});

	it("writes normalized settings on save and returns a success toast", async () => {
		const { ctx, store } = createContext();

		const { state, response } = await saveSettings(
			{
				enableX: false,
				enableLinkedIn: true,
				enableBluesky: true,
				includeEmailShare: false,
				includeCopyLink: true,
				defaultVariant: "icon-label",
				openInNewTab: false,
				publisherHandleX: " @emdash ",
				publisherHandleBluesky: " @team.bsky.social ",
			},
			ctx,
		);

		expect(state).toEqual({
			enabledNetworks: ["linkedin", "bluesky"],
			includeEmailShare: false,
			includeCopyLink: true,
			defaultVariant: "icon-label",
			openInNewTab: false,
			publisherHandles: {
				x: "emdash",
				bluesky: "team.bsky.social",
			},
		});
		expect(store.get("settings:enableX")).toBe(false);
		expect(store.get("settings:enableLinkedIn")).toBe(true);
		expect(store.get("settings:publisherHandleX")).toBe("emdash");
		expect(response.toast).toEqual({ message: "Settings saved", type: "success" });
	});

	it("builds a compact summary widget from persisted state", async () => {
		const { ctx } = createContext({
			"settings:enableX": false,
			"settings:enableLinkedIn": true,
			"settings:enableBluesky": true,
			"settings:includeEmailShare": true,
			"settings:includeCopyLink": false,
			"settings:defaultVariant": "text",
			"settings:openInNewTab": false,
			"settings:publisherHandleBluesky": "team.bsky.social",
		});

		const widget = buildSummaryWidget(await loadSettingsState(ctx));
		expect(widget.blocks).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ type: "fields" }),
				expect.objectContaining({ type: "context" }),
			]),
		);
	});
});
