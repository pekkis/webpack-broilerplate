// rollup.config.js
import resolve from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";
import pkg from "./package.json";

console.log(pkg);

const extensions = [".js", ".jsx", ".ts", ".tsx"];

export default {
  input: "src/index.ts",
  output: [
    {
      file: pkg.main,
      format: "cjs"
    },
    {
      file: pkg.module,
      format: "es" // the preferred format
    }
  ],
  plugins: [
    resolve(),
    babel({
      extensions,
      exclude: "node_modules/**" // only transpile our source code
    })
  ]
};
