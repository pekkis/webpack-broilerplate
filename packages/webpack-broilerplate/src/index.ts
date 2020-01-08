import webpack, { Plugin, RuleSetRule } from "webpack";
import {
  lensPath,
  lensProp,
  compose,
  Lens,
  over,
  append,
  map,
  curry,
  set,
  ifElse,
  always,
  Arity1Fn,
  nthArg
} from "ramda";
import { buildPlugin } from "./plugins";
import { buildRule } from "./rules";
import { pathsFromRootPath } from "./paths";

export { pipe } from "ramda";

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
export const contextLens = lensPath(["config", "context"]);
export const devtoolLens = lensPath(["config", "devtool"]);

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

export interface RuleDefinition extends AddableDefinition {
  factory: (config: unknown) => RuleSetRule;
}

export interface PluginDefinition extends AddableDefinition {
  factory: (options: unknown) => Plugin;
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
    config: {
      devtool: false
    },
    debug: false,
    paths: pathsFromRootPath(rootPath)
  };

  return bp;
}

export const whenModeIs = curry((mode: BroilerplateMode, modifier: Arity1Fn) =>
  ifElse(bp => bp.mode === mode, modifier, nthArg(0))
);

export const whenDevelopment = whenModeIs("development");

export const whenProduction = whenModeIs("production");

export const setDebug = curry((value: boolean, bp: BroilerplateContext) => {
  return set(lensProp("debug"), value, bp);
});

export const setContext = curry((path: string, bp: BroilerplateContext) => {
  return set(contextLens, path, bp);
});

export const setDevtool = curry(
  (devtool: webpack.Options.Devtool | false, bp: BroilerplateContext) => {
    return set(devtoolLens, devtool, bp);
  }
);

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
