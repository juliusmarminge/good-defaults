import fs from "fs";
import path from "path";
import sortPackageJson from "sort-package-json";

import type { Package } from "./index.js";
import { getUserPkgManager } from "./utils/getPkgManager.js";
import { getRootPath } from "./utils/getRootPath.js";

interface ConfigObject {
  files: { origin: string; dest: string }[];
  scripts: Record<string, string>;
  deps: Record<string, string>;
}
const config: Record<Package, ConfigObject> = {
  tsconfig: {
    files: [{ origin: "tsconfig.json", dest: "tsconfig.json" }],
    scripts: {},
    deps: { typescript: "^4.8.0" },
  },
  "eslint+prettier": {
    files: [
      { origin: "eslint.config.json", dest: ".eslintrc" },
      { origin: "prettier.config.json", dest: ".prettierrc" },
    ],
    scripts: {
      lint: "eslint . --cache --cache-strategy content --ignore-path .gitignore",
      format: "prettier --write '**/*.{ts,tsx,cjs,mjs,json,md,mdx}'",
    },
    deps: {
      eslint: "^8.23.0",
      prettier: "^2.7.1",
      "@typescript-eslint/eslint-plugin": "^5.36.0",
      "@typescript-eslint/parser": "^5.36.0",
      "eslint-config-prettier": "^4.2.1",
      "eslint-plugin-prettier": "^4.2.1",
      "eslint-plugin-simple-import-sort": "^7.0.0",
    },
  },
  gitignore: {
    files: [{ origin: "gitignore", dest: ".gitignore" }],
    scripts: {},
    deps: {},
  },
  vscode: {
    files: [
      { origin: "vscode/settings.json", dest: ".vscode/settings.json" },
      { origin: "vscode/extensions.json", dest: ".vscode/extensions.json" },
    ],
    scripts: {},
    deps: {},
  },
  "gh-actions": {
    files: [
      // SPECIAL CASE DEPENDING ON PKG MANAGER
      // CAN SEPARATE INSTALLERS IF THINGS GETS COMPLEX
      // BUT THIS IS OK FOR NOW
      { origin: "github/workflows/ci-", dest: ".github/workflows/ci.yml" },
    ],
    scripts: {},
    deps: {},
  },
};

// Files must not start with `.` or they won't be found by the CLI
// `origin` - path relative to `configs` directory
// `dest` - path relative to destination project root

type InstallerFn = (
  baseDir: string,
  installMode: boolean,
  addScripts: boolean,
) => void;
function getInstallerFn(pkg: Package): InstallerFn {
  const { files, scripts, deps } = config[pkg];
  const root = getRootPath();
  const configs = path.join(root, "configs");

  return (baseDir, installMode, addScripts) => {
    // Copy configuration files
    files.forEach((file) => {
      let origin = path.resolve(configs, file.origin);
      const dest = path.resolve(baseDir, file.dest);

      // HANDLING OF SPECIAL CASE FROM LINE 56
      if (file.origin === "github/workflows/ci-") {
        const pkgMgr = getUserPkgManager();
        origin = `${origin}${pkgMgr}.yml`;
      }

      fs.copyFileSync(origin, dest);
    });

    const pkgJsonPath = path.resolve(baseDir, "package.json");
    const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, "utf-8"));

    // Add scripts
    if (addScripts) {
      if (!pkgJson.scripts) {
        Object.assign(pkgJson, { scripts: {} });
      }

      Object.entries(scripts).forEach(([name, script]) => {
        pkgJson.scripts[name] = script;
      });
    }

    // Add package dependencies
    if (installMode) {
      if (!pkgJson.devDependencies) {
        Object.assign(pkgJson, { devDependencies: {} });
      }

      Object.entries(deps).forEach(([pkg, version]) => {
        pkgJson.devDependencies[pkg] = version;
      });
    }

    const sorted = sortPackageJson(pkgJson);
    fs.writeFileSync(pkgJsonPath, JSON.stringify(sorted, null, 2), "utf-8");
  };
}

export const installers: Record<Package, InstallerFn> = {
  tsconfig: getInstallerFn("tsconfig"),
  "eslint+prettier": getInstallerFn("eslint+prettier"),
  gitignore: getInstallerFn("gitignore"),
  vscode: getInstallerFn("vscode"),
  "gh-actions": getInstallerFn("gh-actions"),
};
