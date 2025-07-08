// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = {
  extends: ["eslint:recommended", "plugin:react/recommended", "plugin:react-hooks/recommended"],
  plugins: ["react", "react-hooks", "import"],

  settings: {
    "import/resolver": {
      node: {
        paths: ["."],
        extensions: [".js", ".jsx", ".ts", ".tsx"]
      },
      alias: {
        map: [["@env", "./env.d.ts"]],
        extensions: [".ts", ".tsx", ".js", ".jsx"]
      }
    }
  },
}
