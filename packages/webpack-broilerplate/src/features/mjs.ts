import { pipe, over, lensPath, append } from "ramda";
import { addRule } from "../rules";
import { BroilerplateContext } from "../index";

const mjs = () => (bp: BroilerplateContext): BroilerplateContext => {
  return pipe(
    addRule({
      factory: () => {
        return {
          test: /\.mjs$/,
          include: /node_modules/,
          type: "javascript/auto"
        };
      }
    }),
    (bp: BroilerplateContext) => {
      return over(
        lensPath(["config", "resolve", "extensions"]),
        e => append(".mjs", e),
        bp
      );
    }
  )(bp);
};

export default mjs;
