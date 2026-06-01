import { createModule } from "difunkt";
import { ConfigModule } from "../config/config.module";
import { DatabaseProvider } from "./client";

export const DatabaseModule = createModule({
	imports: [ConfigModule],
	providers: [DatabaseProvider],
});
