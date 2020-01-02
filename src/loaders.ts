import { curry, lensPath, over, adjust, findIndex, lensProp } from "ramda";
import { BroilerplateContext, addDefinition, AddableDefinition } from ".";
import { RuleSetRule } from "webpack";

export interface LoaderDefinition extends AddableDefinition {
  factory: (config: any) => RuleSetRule;
}

export const addLoader = curry(
  (definition: LoaderDefinition, bp: BroilerplateContext) =>
    addDefinition(lensPath(["loaders"]), definition, bp)
);

export const buildLoader = (loader: LoaderDefinition): RuleSetRule => {
  return loader.factory(loader.config);
};

export const updateLoader = curry(
  (
    findPredicate: (loader: LoaderDefinition) => boolean,
    updater: (loader: LoaderDefinition) => LoaderDefinition,
    bp: BroilerplateContext
  ): BroilerplateContext => {
    return over(
      lensProp("loaders"),
      (loaders: LoaderDefinition[]) => {
        const foundIndex = findIndex(findPredicate, loaders);

        if (foundIndex === -1) {
          return loaders;
        }

        return adjust(foundIndex, updater, loaders);
      },
      bp
    );
  }
);
