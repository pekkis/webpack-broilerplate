import { BroilerplateContext, PluginDefinition } from "../index";
import { addPlugin } from "../plugins";
import { CleanWebpackPlugin, Options } from "clean-webpack-plugin";

const caseSensitivePaths = (config?: Options) => (
  bp: BroilerplateContext
): BroilerplateContext => {
  const definition: PluginDefinition = {
    factory: () => new CleanWebpackPlugin(config)
  };

  return addPlugin(definition)(bp);
};

export default caseSensitivePaths;
