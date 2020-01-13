import { curry, lensPath } from "ramda";
import { BroilerplateContext, addDefinition, PluginDefinition } from "./index";
import webpack, { Plugin } from "webpack";

export const addPlugin = curry(
  (pluginDefinition: PluginDefinition<any>, bp: BroilerplateContext) =>
    addDefinition(lensPath(["plugins"]), pluginDefinition, bp)
);

export const buildPlugin = (plugin: PluginDefinition<any>): Plugin => {
  return plugin.factory(plugin.config);
};

export function createPluginDefinition<T = undefined>(
  factory: (c: T) => webpack.Plugin,
  config?: T
): PluginDefinition<T> {
  return {
    factory,
    config
  };
}
