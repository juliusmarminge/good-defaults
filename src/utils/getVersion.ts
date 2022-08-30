// Source: https://github.com/t3-oss/create-t3-app/blob/main/cli/src/utils/getT3Version.ts

import fs from "fs-extra";
import path from "path";

import { getRootPath } from "./getRootPath.js";

export const getVersion = () => {
  const rootPath = getRootPath();
  const packageJsonPath = path.join(rootPath, "package.json");

  const packageJsonContent = fs.readJSONSync(packageJsonPath);

  return packageJsonContent.version as string;
};
