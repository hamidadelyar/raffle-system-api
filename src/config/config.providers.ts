import { createProvider } from "difunkt";
import { env } from "./env";

export const ConfigProvider = createProvider(() => env);
