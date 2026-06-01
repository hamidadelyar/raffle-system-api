import { createProvider } from "difunkt";
import { ConfigProvider } from "../config/config.providers";
import { createDatabaseClient } from "./create-db-client";

export const DatabaseProvider = createProvider(({ inject }) => {
	const config = inject(ConfigProvider);
	return createDatabaseClient(config);
});
