import { mergeDeepRight, over, lensPath } from "ramda";
import { BroilerplateContext } from "../index";
import webpack = require("webpack");

const defaultConfig: Partial<webpack.Options.Optimization> = {
  splitChunks: {
    cacheGroups: {
      commons: {
        chunks: "initial",
        minChunks: 2,
        maxInitialRequests: 5, // The default limit is too small to showcase the effect
        minSize: 0 // This is example is too small to create commons chunks
      },
      vendor: {
        test: /node_modules/,
        chunks: "initial",
        name: "vendor",
        priority: 10,
        enforce: true
      }
    }
  }
};

const configOptimization = (
  config: Partial<webpack.Options.Optimization> = {}
) => (bp: BroilerplateContext) => {
  const mergedConfig = mergeDeepRight(defaultConfig, config);
  return over(
    lensPath(["config", "optimization"]),
    optimization => {
      return mergeDeepRight(optimization, mergedConfig);
    },
    bp
  );
};

export default configOptimization;
