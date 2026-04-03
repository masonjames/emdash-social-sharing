export type ShareNetwork = "x" | "linkedin" | "bluesky";
export type ShareActionId = ShareNetwork | "email" | "copy";
export type ShareLinkActionId = Exclude<ShareActionId, "copy">;
export type ShareVariant = "text" | "button-row" | "icon-label";
export type ShareDensity = "default" | "compact";
export type ShareAlignment = "start" | "center" | "end";
export type NetworkSelectionMode = "inherit" | "show-only" | "hide-selected";

export interface PublisherHandles {
	x?: string;
	bluesky?: string;
}

export interface SocialSharingSettings {
	enabledNetworks: ShareNetwork[];
	includeEmailShare: boolean;
	includeCopyLink: boolean;
	defaultVariant: ShareVariant;
	openInNewTab: boolean;
	publisherHandles: PublisherHandles;
}

export interface SocialShareBlockData {
	_type: "socialShare";
	_key: string;
	titleOverride?: string;
	variant?: ShareVariant;
	density?: ShareDensity;
	alignment?: ShareAlignment;
	networkSelectionMode?: NetworkSelectionMode;
	networkSelection?: ShareActionId[];
}

export interface SocialShareComponentProps {
	url?: string;
	canonicalUrl?: string;
	title?: string;
	variant?: ShareVariant;
	density?: ShareDensity;
	alignment?: ShareAlignment;
	openInNewTab?: boolean;
	enabledActions?: ShareActionId[];
	publisherHandles?: PublisherHandles;
	class?: string;
	ariaLabel?: string;
	block?: SocialShareBlockData;
}

export interface ShareTargetInput {
	url: string;
	title?: string;
	publisherHandles?: PublisherHandles;
}

export interface ShareLinkAction {
	id: ShareLinkActionId;
	label: string;
	href: string;
}

export interface ShareCopyAction {
	id: "copy";
	label: string;
	copyValue: string;
}

export type ResolvedShareAction = ShareLinkAction | ShareCopyAction;

export interface ResolvedSocialShareModel {
	url: string;
	title?: string;
	variant: ShareVariant;
	density: ShareDensity;
	alignment: ShareAlignment;
	openInNewTab: boolean;
	ariaLabel: string;
	actions: ResolvedShareAction[];
}

export interface ResolveSocialShareModelInput {
	requestUrl?: URL | string;
	siteSettings?: SocialSharingSettings;
	componentProps?: SocialShareComponentProps;
}
