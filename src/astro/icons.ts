import type { ShareActionId } from "../types.js";

const ICONS: Record<ShareActionId, string> = {
	x: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.901 2H22l-6.77 7.736L23.2 22h-6.24l-4.888-7.472L5.53 22H2.43l7.24-8.274L.8 2h6.397l4.418 6.75L18.9 2Zm-1.095 18h1.716L6.272 3.895H4.43L17.806 20Z"/></svg>`,
	linkedin: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.94 8.5H3.56V20h3.38V8.5ZM5.25 7.04a1.97 1.97 0 1 0 0-3.94 1.97 1.97 0 0 0 0 3.94ZM20.44 13.09c0-3.07-1.64-4.5-3.83-4.5-1.76 0-2.55.97-2.99 1.65V8.5H10.25c.04 1.16 0 11.5 0 11.5h3.37v-6.43c0-.34.03-.68.12-.93.27-.68.89-1.38 1.92-1.38 1.36 0 1.91 1.04 1.91 2.57V20H21v-6.91-.01Z"/></svg>`,
	bluesky: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 11.83c1.55-3 5.78-7.33 7.78-8.56.96-.59 2.5-1.05 2.5.72 0 .35-.2 2.94-.32 3.37-.42 1.5-1.93 1.88-3.28 1.65 2.36.4 2.96 1.72 1.66 3.03-2.46 2.48-3.53-.62-3.8-.17-.08.13-.36 1.75-.45 2.08-.16.58-.48 1.12-.98 1.46-.5-.34-.82-.88-.98-1.46-.09-.33-.37-1.95-.45-2.08-.27-.45-1.34 2.65-3.8.17-1.3-1.31-.7-2.63 1.66-3.03-1.35.23-2.86-.15-3.28-1.65-.12-.43-.32-3.02-.32-3.37 0-1.77 1.54-1.31 2.5-.72 2 1.23 6.23 5.56 7.78 8.56Z"/></svg>`,
	email: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg>`,
	copy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,
};

export function getSocialShareIcon(actionId: ShareActionId): string {
	return ICONS[actionId];
}
