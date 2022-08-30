import type { Package } from ".";

const tsconfigInstaller = () => {};

const eslintInstaller = () => {};

const prettierInstaller = () => {};

const vscodeInstaller = () => {};

const ghActionsInstaller = () => {};

export const installers: Record<Package, () => void> = {
  tsconfig: tsconfigInstaller,
  eslint: eslintInstaller,
  prettier: prettierInstaller,
  vscode: vscodeInstaller,
  "gh-actions": ghActionsInstaller,
};
