import { copyFileSync } from "fs";
import path from "path";

import type { Package } from ".";
import { getRootPath } from "./utils/getRootPath.js";

// Files should be relative to project root
const filesToCopy: Record<Package, string[]> = {
  tsconfig: ["tsconfig.json"],
  eslint: [".eslintrc"],
  prettier: [".prettierrc"],
  gitignore: [".gitignore"],
  vscode: [".vscode/settings.json", ".vscode/extensions.json"],
  "gh-actions": [".github/workflows/main.yml"],
};

const installerFn = (pkg: Package) => {
  const files = filesToCopy[pkg];
  const root = getRootPath();
  return (baseDir: string) => {
    files.forEach((file) => {
      const origin = path.resolve(root, file);
      const dest = path.resolve(baseDir, file);
      copyFileSync(origin, dest);
    });
  };
};

type InstallerFn = (baseDir: string) => void;
export const installers: Record<Package, InstallerFn> = {
  tsconfig: installerFn("tsconfig"),
  eslint: installerFn("eslint"),
  prettier: installerFn("prettier"),
  gitignore: installerFn("gitignore"),
  vscode: installerFn("vscode"),
  "gh-actions": installerFn("gh-actions"),
};
