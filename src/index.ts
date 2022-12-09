import chalk from "chalk";
import { execSync } from "child_process";
import inquirer from "inquirer";
import ora from "ora";

import { installers } from "./installers.js";
import { getUserPkgManager } from "./utils/getPkgManager.js";
import { getVersion } from "./utils/getVersion.js";

const packages = [
  "tsconfig",
  "eslint+prettier",
  "gitignore",
  "vscode",
  "gh-actions",
] as const;
export type Package = typeof packages[number];

function printTitle() {
  console.log(
    chalk.cyanBright(`
  Good Defaults (v${getVersion()})
  -------------
  Let's setup your project with some good defaults.
  `),
  );
}

interface CliRes {
  packages: Package[];
  installMode: boolean;
  addScripts: boolean;
}
async function cli(): Promise<CliRes> {
  const pkg = await inquirer.prompt<Pick<CliRes, "packages">>({
    name: "packages",
    type: "checkbox",
    message: "What configurations would you like me to setup?",
    choices: packages.map((pkg) => ({
      name: pkg,
      checked: false,
    })),
  });

  const install = await inquirer.prompt<Pick<CliRes, "installMode">>({
    name: "installMode",
    type: "confirm",
    message: "Would you like me to install the necessary the dependencies too?",
    default: true,
  });

  const scripts = await inquirer.prompt<Pick<CliRes, "addScripts">>({
    name: "addScripts",
    type: "confirm",
    message: "Would you like me to add the necessary scripts too?",
    default: true,
  });

  return {
    packages: pkg.packages,
    installMode: install.installMode,
    addScripts: scripts.addScripts,
  };
}

function printFarewell() {
  console.log(
    chalk.cyanBright(`
  -------------
  Thank you for using Good Defaults!
  `),
  );
}

async function main() {
  printTitle();
  const { packages, installMode, addScripts } = await cli();

  const baseDir = process.cwd();

  console.log("");

  packages.forEach((pkg) => {
    const spinner = ora("Setting up " + pkg).start();
    installers[pkg](baseDir, installMode, addScripts);
    spinner.succeed("Setup successful for " + pkg);
  });

  if (installMode) {
    const pkgMgr = getUserPkgManager();
    console.log("");
    const spinner = ora(`Running "${pkgMgr} install"...`).start();
    execSync(`${pkgMgr} install`, { cwd: baseDir });
    spinner.succeed("Dependencies installed");
  }

  printFarewell();
}

void main();
