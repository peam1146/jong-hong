// @ts-check
const { defineConfig } = require("eslint-define-config");
const base = require("./base");

const config = defineConfig({
  ...base,
  overrides: [
    ...(base.overrides ?? []),
    {
      files: ["**/*.{js,jsx,ts,tsx}"],
      plugins: ["react", "jsx-a11y"],
      extends: [
        "plugin:react/recommended",
        "plugin:react/jsx-runtime",
        "plugin:react-hooks/recommended",
        "plugin:jsx-a11y/recommended",
        // "@vercel/style-guide/eslint/next",
      ],
      rules: {
        "@typescript-eslint/no-var-requires": "off",
        "no-undef": "off",
      },
      settings: {
        react: {
          version: "detect",
        },
        formComponents: ["Form"],
        linkComponents: [
          { name: "Link", linkAttribute: "to" },
          { name: "NavLink", linkAttribute: "to" },
        ],
        "import/resolver": {
          typescript: {},
        },
      },
    },
  ],
});

module.exports = config;
