module.exports = {
  env: {
    es6: true,
    browser: false,
    node: true,
    "jest/globals": true
  },
  plugins: ["@typescript-eslint", "jest"],
  extends: [
    "node",
    "plugin:prettier/recommended",
    "plugin:jest/recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  parser: "@typescript-eslint/parser",
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"]
      }
    }
  },
  rules: {
    "import/no-nodejs-modules": 0
  }
};
