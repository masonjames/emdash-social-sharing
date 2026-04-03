import SocialShareComponent from "./SocialShare.astro";
import SocialShareBlockComponent from "./SocialShareBlock.astro";

export { SocialShareComponent as SocialShare, SocialShareBlockComponent as SocialShareBlock };

export const blockComponents = {
	socialShare: SocialShareBlockComponent,
} as const;
