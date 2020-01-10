import { BroilerplateContext, PluginDefinition } from "../index";
import { addPlugin } from "../plugins";
import CaseSensitivePathsPlugin from "case-sensitive-paths-webpack-plugin";

const caseSensitivePaths = () => (
  bp: BroilerplateContext
): BroilerplateContext => {
  const definition: PluginDefinition = {
    factory: () => new CaseSensitivePathsPlugin()
  };

  return addPlugin(definition)(bp);
};

export default caseSensitivePaths;
