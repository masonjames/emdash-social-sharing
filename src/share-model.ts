import {
	DEFAULT_BLOCK_SELECTION_MODE,
	DEFAULT_SHARE_ALIGNMENT,
	DEFAULT_SHARE_ARIA_LABEL,
	DEFAULT_SHARE_DENSITY,
	DEFAULT_SOCIAL_SHARING_SETTINGS,
	SHARE_ACTION_LABELS,
} from "./defaults.js";
import {
	buildBlueskyShare,
	buildEmailShare,
	buildLinkedInShare,
	buildXShare,
	resolveAbsoluteShareUrl,
} from "./networks.js";
import {
	canonicalizeShareActions,
	isShareAlignment,
	isShareDensity,
	isShareVariant,
	normalizePublisherHandles,
} from "./settings.js";
import type {
	ResolveSocialShareModelInput,
	ResolvedShareAction,
	ResolvedSocialShareModel,
	ShareActionId,
	SocialShareBlockData,
	SocialSharingSettings,
} from "./types.js";

function normalizeOptionalString(value: string | undefined): string | undefined {
	const trimmed = value?.trim();
	return trimmed ? trimmed : undefined;
}

function resolveVariant(value: unknown) {
	return isShareVariant(value) ? value : DEFAULT_SOCIAL_SHARING_SETTINGS.defaultVariant;
}

function resolveDensity(value: unknown) {
	return isShareDensity(value) ? value : DEFAULT_SHARE_DENSITY;
}

function resolveAlignment(value: unknown) {
	return isShareAlignment(value) ? value : DEFAULT_SHARE_ALIGNMENT;
}

function resolveBaseActions(settings: SocialSharingSettings): ShareActionId[] {
	const actions: Array<ShareActionId | null> = [
		...settings.enabledNetworks,
		settings.includeEmailShare ? "email" : null,
		settings.includeCopyLink ? "copy" : null,
	];

	return canonicalizeShareActions(actions);
}

function resolveActionIds(input: {
	settings: SocialSharingSettings;
	block?: SocialShareBlockData;
	enabledActions?: ShareActionId[];
}): ShareActionId[] {
	if (input.enabledActions !== undefined) {
		return canonicalizeShareActions(input.enabledActions);
	}

	const baseActions = resolveBaseActions(input.settings);
	const mode = input.block?.networkSelectionMode ?? DEFAULT_BLOCK_SELECTION_MODE;
	const selected = canonicalizeShareActions(input.block?.networkSelection ?? []);

	if (mode === "show-only") {
		return selected;
	}

	if (mode === "hide-selected") {
		return baseActions.filter((action) => !selected.includes(action));
	}

	return baseActions;
}

function buildAction(id: ShareActionId, input: { url: string; title?: string; settings: SocialSharingSettings }): ResolvedShareAction {
	switch (id) {
		case "x":
			return buildXShare({
				url: input.url,
				title: input.title,
				publisherHandles: input.settings.publisherHandles,
			});
		case "linkedin":
			return buildLinkedInShare({ url: input.url, title: input.title });
		case "bluesky":
			return buildBlueskyShare({
				url: input.url,
				title: input.title,
				publisherHandles: input.settings.publisherHandles,
			});
		case "email":
			return buildEmailShare({ url: input.url, title: input.title });
		case "copy":
			return {
				id: "copy",
				label: SHARE_ACTION_LABELS.copy,
				copyValue: input.url,
			};
	}
}

export function resolveSocialShareModel(
	input: ResolveSocialShareModelInput,
): ResolvedSocialShareModel | null {
	const componentProps = input.componentProps ?? {};
	const block = componentProps.block;
	const settings = input.siteSettings ?? DEFAULT_SOCIAL_SHARING_SETTINGS;

	const mergedSettings: SocialSharingSettings = {
		...settings,
		publisherHandles: {
			...settings.publisherHandles,
			...normalizePublisherHandles(componentProps.publisherHandles),
		},
	};

	const url = resolveAbsoluteShareUrl({
		canonicalUrl: componentProps.canonicalUrl,
		url: componentProps.url,
		requestUrl: input.requestUrl,
	});

	if (!url) return null;

	const title = normalizeOptionalString(componentProps.title) ?? normalizeOptionalString(block?.titleOverride);
	const actions = resolveActionIds({
		settings: mergedSettings,
		block,
		enabledActions: componentProps.enabledActions,
	}).map((actionId) => buildAction(actionId, { url, title, settings: mergedSettings }));

	if (actions.length === 0) return null;

	return {
		url,
		title,
		variant: resolveVariant(componentProps.variant ?? block?.variant),
		density: resolveDensity(componentProps.density ?? block?.density),
		alignment: resolveAlignment(componentProps.alignment ?? block?.alignment),
		openInNewTab:
			typeof componentProps.openInNewTab === "boolean"
				? componentProps.openInNewTab
				: mergedSettings.openInNewTab,
		ariaLabel: normalizeOptionalString(componentProps.ariaLabel) ?? DEFAULT_SHARE_ARIA_LABEL,
		actions,
	};
}
