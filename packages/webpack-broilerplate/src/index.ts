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
  nthArg,
  mergeRight
} from "ramda";
import { buildPlugin } from "./plugins";
import { buildRule } from "./rules";
import path from "path";

export { pipe } from "ramda";

export type BroilerplateMode = "development" | "production";

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
  src: string;
  build: string;
  modules: string;
}

export interface BroilerplateContext {
  [broilerPlateSymbol]: true;
  mode: BroilerplateMode;
  plugins: Array<PluginDefinition>;
  rules: Array<RuleDefinition>;
  config: Partial<webpack.Configuration>;
  paths: BroilerplatePaths;
  debug: boolean;
}

export interface RuleDefinition extends AddableDefinition {
  factory: (config: any) => RuleSetRule;
}

export interface PluginDefinition extends AddableDefinition {
  factory: (config: any) => Plugin;
}

interface BroilerplateOptions {
  debug: boolean;
}

export const pathsFromRootPath = (rootPath: string): BroilerplatePaths => ({
  root: rootPath,
  src: path.resolve(rootPath, "./src"),
  build: path.resolve(rootPath, "./dist"),
  modules: path.resolve(rootPath, "./node_modules")
});

const defaultOptions: BroilerplateOptions = {
  debug: false
};

export default function broilerplate(
  mode: BroilerplateMode,
  paths: BroilerplatePaths = pathsFromRootPath(process.cwd()),
  options: Partial<BroilerplateOptions> = defaultOptions
): BroilerplateContext {
  if (!["development", "production"].includes(mode)) {
    throw new Error("Invalid broilerplate mode");
  }

  const mergedOptions: BroilerplateOptions = mergeRight(
    defaultOptions,
    options
  );

  const bp: BroilerplateContext = {
    [broilerPlateSymbol]: true,
    mode,
    plugins: [],
    rules: [],
    config: {
      devtool: false,
      optimization: {
        noEmitOnErrors: true,
        nodeEnv: false,
        mergeDuplicateChunks: true
      }
    },
    debug: mergedOptions.debug,
    paths
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
