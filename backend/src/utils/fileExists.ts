import { existsSync } from "fs";
import path from "path";

const fileExists = (filename: string): boolean =>
  existsSync(path.join(filename));

export default fileExists;
