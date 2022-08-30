import chalk from "chalk";
import inquirer from "inquirer";
import ora from "ora";

import { installers } from "./installers.js";

const packages = [
  "tsconfig",
  "eslint",
  "prettier",
  "gitignore",
  "vscode",
  "gh-actions",
] as const;
export type Package = typeof packages[number];

const title = () => {
  console.log(
    chalk.cyanBright(`
  Good Defaults
  -------------
  Let's setup your project with some good defaults.
  `),
  );
};

interface CliRes {
  packages: typeof packages;
}
const cli = async (): Promise<CliRes> => {
  const res = await inquirer.prompt<Pick<CliRes, "packages">>({
    name: "packages",
    type: "checkbox",
    message: "What configurations would you like me to setup?",
    choices: packages.map((pkg) => ({
      name: pkg,
      checked: false,
    })),
  });

  return res;
};

const farewell = () => {
  console.log(
    chalk.cyanBright(`
  -------------
  Thank you for using Good Defaults!
  `),
  );
};

const main = async () => {
  title();
  const { packages } = await cli();

  const baseDir = process.cwd();

  packages.forEach((pkg) => {
    const spinner = ora("Setting up " + pkg).start();
    installers[pkg](baseDir);
    spinner.succeed("Setup successful for " + pkg);
  });

  farewell();
};

void main();
