import { BroilerplateContext, PluginDefinition } from "../index";
import { addPlugin } from "../plugins";
import CoreJSUpgradeWebpackPlugin from "corejs-upgrade-webpack-plugin";

const coreJSUpgrade = () => (bp: BroilerplateContext): BroilerplateContext => {
  const definition: PluginDefinition = {
    factory: () =>
      CoreJSUpgradeWebpackPlugin({
        resolveFrom: bp.paths.root
      })
  };

  return addPlugin(definition)(bp);
};

export default coreJSUpgrade;
