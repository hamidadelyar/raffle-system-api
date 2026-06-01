import { createModule } from "difunkt";
import { UserRepositoryProvider } from "./user.providers";

export const UserModule = createModule({
	providers: [UserRepositoryProvider],
});
