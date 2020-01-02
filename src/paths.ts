import { BroilerplatePaths, BroilerplateContext } from ".";
import path from "path";
import { lensProp, over, mergeRight } from "ramda";

export const pathsFromRootPath = (rootPath: string): BroilerplatePaths => ({
  root: rootPath,
  build: path.resolve(rootPath, "./dist"),
  modules: path.resolve(rootPath, "./node_modules")
});

export const setPaths = (newPaths: Partial<BroilerplatePaths>) => (
  bp: BroilerplateContext
) => {
  return over(
    lensProp("paths"),
    oldPaths => mergeRight(oldPaths, newPaths),
    bp
  );
};
