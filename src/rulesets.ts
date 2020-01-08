import { curry, lensPath, over, adjust, findIndex, lensProp } from "ramda";
import { BroilerplateContext, addDefinition, AddableDefinition } from "./index";
import { RuleSetRule } from "webpack";

export interface RulesetDefinition extends AddableDefinition {
  factory: (config: unknown) => RuleSetRule;
}

export const addRuleset = curry(
  (definition: RulesetDefinition, bp: BroilerplateContext) =>
    addDefinition(lensPath(["rulesets"]), definition, bp)
);

export const buildRuleset = (loader: RulesetDefinition): RuleSetRule => {
  return loader.factory(loader.config);
};

export const updateLoader = curry(
  (
    findPredicate: (loader: RulesetDefinition) => boolean,
    updater: (loader: RulesetDefinition) => RulesetDefinition,
    bp: BroilerplateContext
  ): BroilerplateContext => {
    return over(
      lensProp("rulesets"),
      (rulesets: RulesetDefinition[]) => {
        const foundIndex = findIndex(findPredicate, rulesets);

        if (foundIndex === -1) {
          return rulesets;
        }

        return adjust(foundIndex, updater, rulesets);
      },
      bp
    );
  }
);
