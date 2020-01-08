import { curry, lensPath } from "ramda";
import { BroilerplateContext, addDefinition, AddableDefinition } from ".";
import { Plugin } from "webpack";

export interface PluginDefinition extends AddableDefinition {
  factory: (options: unknown) => Plugin;
}

export const addPlugin = curry(
  (pluginDefinition: PluginDefinition, bp: BroilerplateContext) =>
    addDefinition(lensPath(["plugins"]), pluginDefinition, bp)
);

export const buildPlugin = (plugin: PluginDefinition): Plugin => {
  return plugin.factory(plugin.config);
};
