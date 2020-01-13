import WatchMissingNodeModulesPlugin from "react-dev-utils/WatchMissingNodeModulesPlugin";
import { BroilerplateContext, PluginDefinition } from "../index";
import { addPlugin, createPluginDefinition } from "../plugins";

const caseSensitivePaths = () => (
  bp: BroilerplateContext
): BroilerplateContext => {
  const definition = createPluginDefinition(
    () => new WatchMissingNodeModulesPlugin(bp.paths.root)
  );

  return addPlugin(definition)(bp);
};

export default caseSensitivePaths;
