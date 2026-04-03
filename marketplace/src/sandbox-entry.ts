import { definePlugin } from "emdash";

import { handleAdminRoute } from "./admin.js";

export default definePlugin({
	routes: {
		admin: {
			handler: handleAdminRoute,
		},
	},
});
