import { config } from "dotenv";
import { resolve } from "path";

config();
config({ path: resolve(process.cwd(), ".env.local") });
