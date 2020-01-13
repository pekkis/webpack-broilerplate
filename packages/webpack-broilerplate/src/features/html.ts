import { BroilerplateContext, PluginDefinition } from "../index";
import { addPlugin, createPluginDefinition } from "../plugins";
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

  const definition = createPluginDefinition(
    c =>
      new HtmlWebpackPlugin({
        ...c,
        inject: "body",
        chunksSortMode: "dependency"
      }),
    config
  );

  return addPlugin(definition)(bp);
};

export default html;
