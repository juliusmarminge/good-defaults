import { copyFileSync } from "fs";
import path from "path";

import type { Package } from ".";
import { getRootPath } from "./utils/getRootPath.js";

// Files must not start with `.` or they won't be found by the CLI
// `origin` - path relative to `configs` directory
// `dest` - path relative to destination project root
const filesToCopy: Record<Package, { origin: string; dest: string }[]> = {
  tsconfig: [{ origin: "tsconfig.json", dest: "tsconfig.json" }],
  eslint: [{ origin: "eslint.config.json", dest: ".eslintrc" }],
  prettier: [{ origin: "prettier.config.json", dest: ".prettierrc" }],
  gitignore: [{ origin: "gitignore", dest: ".gitignore" }],
  vscode: [
    { origin: "vscode/settings.json", dest: ".vscode/settings.json" },
    { origin: "vscode/extensions.json", dest: ".vscode/extensions.json" },
  ],
  "gh-actions": [
    { origin: "github/workflows/ci.yml", dest: ".github/workflows/ci.yml" },
  ],
};

const installerFn = (pkg: Package) => {
  const files = filesToCopy[pkg];
  const root = getRootPath();
  return (baseDir: string) => {
    files.forEach((file) => {
      const origin = path.resolve(root, file.origin);
      const dest = path.resolve(baseDir, file.dest);
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
