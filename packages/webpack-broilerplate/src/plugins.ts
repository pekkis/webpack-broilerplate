import { curry, lensPath } from "ramda";
import { BroilerplateContext, addDefinition, PluginDefinition } from "./index";
import { Plugin } from "webpack";

export const addPlugin = curry(
  (pluginDefinition: PluginDefinition, bp: BroilerplateContext) =>
    addDefinition(lensPath(["plugins"]), pluginDefinition, bp)
);

export const buildPlugin = (plugin: PluginDefinition): Plugin => {
  return plugin.factory(plugin.config);
};
