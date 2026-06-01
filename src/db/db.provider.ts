import { createProvider } from "difunkt";
import { ConfigProvider } from "../config/config.providers";
import { createDatabase } from "./create-db";

export const DatabaseProvider = createProvider(({ inject }) => {
	const config = inject(ConfigProvider);
	return createDatabase(config);
});
