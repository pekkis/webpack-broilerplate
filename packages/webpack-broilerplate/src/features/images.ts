import { BroilerplateContext, RuleDefinition } from "../index";
import { addRule } from "../rules";

export const identifier = Symbol("imagesRule");

const images = () => (bp: BroilerplateContext): BroilerplateContext => {
  const definition: RuleDefinition = {
    factory: () => {
      return {
        test: /\.(png|jpg|gif|ico|svg)$/,
        include: [bp.paths.src],
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[path][name]-[hash].[ext]",
              emitFile: true
            }
          },
          {
            loader: "img-loader",
            options: {
              enabled: bp.mode === "production"
            }
          }
        ]
      };
    }
  };

  const feature = addRule(definition);
  return feature(bp);
};

export default images;
