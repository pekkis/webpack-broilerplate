import webpack = require("webpack");
import R, {
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
import { buildLoader, LoaderDefinition } from "./loaders";
import { pathsFromRootPath } from "./paths";

export type BroilerplateMode = "development" | "production";

export type BroilerplateTarget = "client" | "server";

export const broilerPlateSymbol = Symbol("broilerplate");

export interface AddableDefinition {
  priority?: Number;
  identifier?: Symbol;
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
  loaders: Array<LoaderDefinition>;
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
    loaders: [],
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
    return R.set(lens, file, bp);
  }
);

export const removeEntrypoint = curry(
  (name: string, bp: BroilerplateContext) => {
    return R.set(R.lensPath(["entry", name]), undefined, bp);
  }
);

export const addDefinition = curry(
  (lens: Lens, definition: AddableDefinition, bp: BroilerplateContext) => {
    return over(lens, definitionList => append(definition, definitionList), bp);
  }
);

export const build = (bp: BroilerplateContext): webpack.Configuration => {
  return {
    ...bp.config,
    mode: bp.mode,
    plugins: map(buildPlugin, bp.plugins),
    module: {
      rules: map(buildLoader, bp.loaders)
    }
  };
};
