import { BroilerplateContext, PluginDefinition } from "../index";
import { addPlugin } from "../plugins";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { mergeRight } from "ramda";

interface Config {
  title: string;
  template: string;
  favicon: string;
}

const defaultConfig: Config = {
  title: "Webpack Broilerplate",
  template: "assets/index.html",
  favicon: "assets/favicon.png"
};

const html = (userConfig: Partial<Config>) => (
  bp: BroilerplateContext
): BroilerplateContext => {
  const config = mergeRight(defaultConfig, userConfig);

  const definition: PluginDefinition = {
    config,
    factory: (config: Config) =>
      new HtmlWebpackPlugin({
        ...config,
        inject: "body",
        chunksSortMode: "dependency"
      })
  };

  return addPlugin(definition)(bp);
};

export default html;

/*
const { List, fromJS } = require("immutable");
const Plugin = require("html-webpack-plugin");
const { createPlugin } = require("../extend");

module.exports = config =>
  createPlugin(Plugin)({
    name: () => "htmlPlugin",
    isEnabled: (env, target) => target === "client",
    options: () =>
      List.of(
        fromJS({
          title: "Hardcorest React App",
          template: "assets/index.html",
          favicon: "assets/favicon.png",
          inject: "body",
          chunksSortMode: "dependency"
        })
      )
  });
*/
