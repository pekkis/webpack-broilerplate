import { BroilerplateContext, RuleDefinition } from "../index";
import { addRule } from "../rules";

export const identifier = Symbol("imagesRule");

const fonts = () => (bp: BroilerplateContext): BroilerplateContext => {
  const definition: RuleDefinition = {
    factory: () => {
      return {
        test: /font.*\.(woff|woff2|eot|ttf|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        include: [bp.paths.src, bp.paths.modules],
        use: [
          {
            loader: "url-loader",
            options: {
              emitFile: true,
              limit: 10000,
              name: "[path][name]-[hash].[ext]"
            }
          }
        ]
      };
    }
  };

  const feature = addRule(definition);
  return feature(bp);
};

export default fonts;
