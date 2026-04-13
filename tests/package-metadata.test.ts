import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { SOCIAL_SHARING_PLUGIN_ID, SOCIAL_SHARING_VERSION } from "../src/defaults.js";

function readJson(path: string) {
	return JSON.parse(readFileSync(new URL(path, import.meta.url), "utf8")) as Record<string, unknown>;
}

describe("package metadata", () => {
	it("keeps the root package version and core export in sync", () => {
		const pkg = readJson("../package.json");
		const exportsField = pkg.exports as Record<string, unknown>;

		expect(pkg.version).toBe(SOCIAL_SHARING_VERSION);
		expect(exportsField["./core"]).toBeTruthy();
		expect((pkg.plugin as { id?: string } | undefined)?.id).toBe(SOCIAL_SHARING_PLUGIN_ID);
	});

	it("keeps the marketplace package version in sync", () => {
		const pkg = readJson("../marketplace/package.json");
		expect(pkg.version).toBe(SOCIAL_SHARING_VERSION);
		expect((pkg.plugin as { id?: string } | undefined)?.id).toBe(SOCIAL_SHARING_PLUGIN_ID);
	});
});
