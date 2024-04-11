import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintConfigPrettier,
  {
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    rules: {
      "@typescript-eslint/no-namespace": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
    },
  },
);
