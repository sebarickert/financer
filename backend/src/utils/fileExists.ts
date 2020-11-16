import { existsSync } from "fs";
import path from "path";

const fileExists = (filename: string) => existsSync(
    path.join(filename)
  );

export default fileExists;
