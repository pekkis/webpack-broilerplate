import { BroilerplateContext, PluginDefinition } from "../index";
import { addPlugin, createPluginDefinition } from "../plugins";
import { CleanWebpackPlugin, Options } from "clean-webpack-plugin";

const cleanDirectories = (config?: Options) => (
  bp: BroilerplateContext
): BroilerplateContext => {
  const definition = createPluginDefinition(
    c => new CleanWebpackPlugin(c),
    config
  );
  return addPlugin(definition)(bp);
};

export default cleanDirectories;
