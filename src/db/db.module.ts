import { createModule } from "difunkt";
import { DatabaseProvider } from "./client";

export const DatabaseModule = createModule({
	providers: [DatabaseProvider],
});
