import webpack from "webpack";
import {
  lensPath,
  lensProp,
  compose,
  Lens,
  over,
  append,
  map,
  curry,
  set
} from "ramda";
import { buildPlugin, PluginDefinition } from "./plugins";
import { buildRule, RuleDefinition } from "./rules";
import { pathsFromRootPath } from "./paths";

export type BroilerplateMode = "development" | "production";

export type BroilerplateTarget = "client" | "server";

export const broilerPlateSymbol = Symbol("broilerplate");

export interface AddableDefinition {
  priority?: number;
  identifier?: symbol;
  factory: (options: any) => any;
  config?: any;
}

export const entryPointsLens = lensPath(["config", "entry"]);

export interface BroilerplatePaths {
  root: string;
  build: string;
  modules: string;
}

export interface BroilerplateContext {
  [broilerPlateSymbol]: true;
  mode: BroilerplateMode;
  target: BroilerplateTarget;
  plugins: Array<PluginDefinition>;
  rules: Array<RuleDefinition>;
  config: Partial<webpack.Configuration>;
  paths: BroilerplatePaths;
  debug: boolean;
}

export default function broilerplate(
  mode: BroilerplateMode,
  target: BroilerplateTarget = "client",
  rootPath: string = process.cwd()
): BroilerplateContext {
  if (!["development", "production"].includes(mode)) {
    throw new Error("Invalid broilerplate mode");
  }

  const bp: BroilerplateContext = {
    [broilerPlateSymbol]: true,
    mode,
    target,
    plugins: [],
    rules: [],
    config: {},
    debug: false,
    paths: pathsFromRootPath(rootPath)
  };

  return bp;
}

export const setDebug = curry((value: boolean, bp: BroilerplateContext) => {
  return set(lensProp("debug"), value, bp);
});

export const addEntrypoint = curry(
  (name: string, file: string, bp: BroilerplateContext) => {
    const lens = compose(entryPointsLens, lensProp(name)) as Lens;
    return set(lens, file, bp);
  }
);

export const removeEntrypoint = curry((name, bp) =>
  set(lensPath(["entry", name]), undefined, bp)
);

export const addDefinition = curry(
  (lens: Lens, definition: AddableDefinition, bp: BroilerplateContext) =>
    over(lens, definitionList => append(definition, definitionList), bp)
);

export const build = (bp: BroilerplateContext): webpack.Configuration => ({
  ...bp.config,
  mode: bp.mode,
  plugins: map(buildPlugin, bp.plugins),
  module: {
    rules: map(buildRule, bp.rules)
  }
});
