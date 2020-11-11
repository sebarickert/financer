import { config, parse } from "dotenv";
import { readFileSync } from "fs";

config();
const localConfig = parse(readFileSync(".env.local"));

Object.entries(localConfig).forEach(([key, value]) => {
  process.env[key] = value;
});
