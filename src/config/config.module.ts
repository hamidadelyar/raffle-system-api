import { createModule } from "difunkt";
import { ConfigProvider } from "./config.providers";

export const ConfigModule = createModule({
	providers: [ConfigProvider],
});
