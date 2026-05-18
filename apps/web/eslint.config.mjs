import { FlatCompat } from "@eslint/eslintrc";
import coreWebVitals from "eslint-config-next/core-web-vitals.js";
import typescriptConfig from "eslint-config-next/typescript.js";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

const config = [
  {
    ignores: [".next/**", "node_modules/**", "dist/**", "coverage/**"],
  },
  ...compat.config({
    extends: [...coreWebVitals.extends, ...typescriptConfig.extends],
  }),
];

export default config;
