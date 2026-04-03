import * as emdash from "emdash";

import { SOCIAL_SHARING_PLUGIN_ID } from "./defaults.js";
import { resolveSettings } from "./settings.js";
import type { SocialSharingSettings } from "./types.js";

export interface StoredOptionRow {
	name: string;
	value: string;
}

interface RuntimeDb {
	selectFrom: (table: "options") => {
		select: (columns: string[]) => {
			where: (column: string, operator: string, value: string) => {
				execute: () => Promise<StoredOptionRow[]>;
			};
		};
	};
}

const SETTINGS_CACHE_KEY = "__emdashSocialSharingSettingsPromise";

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null;
}

function isPromiseLike<T>(value: unknown): value is Promise<T> {
	return !!value && typeof value === "object" && "then" in value;
}

function hasPublicSettingsLoader(
	module: typeof emdash,
): module is typeof emdash & {
	getPluginSettings: (pluginId: string) => Promise<Record<string, unknown>>;
} {
	return typeof (module as { getPluginSettings?: unknown }).getPluginSettings === "function";
}

function hasRuntimeDb(value: unknown): value is { db: RuntimeDb } {
	return isRecord(value) && isRecord(value.db) && "selectFrom" in value.db;
}

export function extractStoredSettingsValues(
	rows: Iterable<StoredOptionRow>,
	pluginId = SOCIAL_SHARING_PLUGIN_ID,
): Record<string, unknown> {
	const prefix = `plugin:${pluginId}:settings:`;
	const values: Record<string, unknown> = {};

	for (const row of rows) {
		if (!row.name.startsWith(prefix)) continue;

		try {
			values[row.name.slice(prefix.length)] = JSON.parse(row.value);
		} catch {
			// Ignore malformed rows and fall back to defaults.
		}
	}

	return values;
}

async function doLoadSocialSharingSettings(
	locals?: Record<string, unknown> | null,
): Promise<SocialSharingSettings> {
	try {
		if (hasPublicSettingsLoader(emdash)) {
			const storedSettings = await emdash.getPluginSettings(SOCIAL_SHARING_PLUGIN_ID);
			return resolveSettings(storedSettings);
		}

		if (locals && hasRuntimeDb(locals.emdash)) {
			const prefix = `plugin:${SOCIAL_SHARING_PLUGIN_ID}:settings:`;
			const rows = await locals.emdash.db
				.selectFrom("options")
				.select(["name", "value"])
				.where("name", "like", `${prefix}%`)
				.execute();

			return resolveSettings(extractStoredSettingsValues(rows));
		}

		return resolveSettings();
	} catch {
		return resolveSettings();
	}
}

export async function loadSocialSharingSettings(
	locals: Record<string, unknown> | null | undefined,
): Promise<SocialSharingSettings> {
	if (!locals) return doLoadSocialSharingSettings();

	const cached = locals[SETTINGS_CACHE_KEY];
	if (isPromiseLike<SocialSharingSettings>(cached)) {
		return cached;
	}

	const promise = doLoadSocialSharingSettings(locals);
	locals[SETTINGS_CACHE_KEY] = promise;
	return promise;
}
