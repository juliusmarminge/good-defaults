import { defineConfig } from "tsup";

export default defineConfig({
  clean: true,
  dts: { resolve: true },
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
});
