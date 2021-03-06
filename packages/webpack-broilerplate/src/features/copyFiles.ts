import { BroilerplateContext, PluginDefinition } from "../index";
import { addPlugin } from "../plugins";
import CopyWebpackPlugin from "copy-webpack-plugin";

type Config = string;

const copyFiles = (config: string) => (
  bp: BroilerplateContext
): BroilerplateContext => {
  const definition: PluginDefinition<Config> = {
    config,
    factory: (c: Config) => new CopyWebpackPlugin([{ from: c, flatten: false }])
  };

  return addPlugin(definition)(bp);
};

export default copyFiles;
