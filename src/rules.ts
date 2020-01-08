import { curry, lensPath, over, adjust, findIndex, lensProp } from "ramda";
import { BroilerplateContext, addDefinition, AddableDefinition } from "./index";
import { RuleSetRule } from "webpack";

export interface RuleDefinition extends AddableDefinition {
  factory: (config: unknown) => RuleSetRule;
}

export const addRule = curry(
  (definition: RuleDefinition, bp: BroilerplateContext) =>
    addDefinition(lensPath(["rules"]), definition, bp)
);

export const buildRule = (loader: RuleDefinition): RuleSetRule => {
  return loader.factory(loader.config);
};

export const updateLoader = curry(
  (
    findPredicate: (loader: RuleDefinition) => boolean,
    updater: (loader: RuleDefinition) => RuleDefinition,
    bp: BroilerplateContext
  ): BroilerplateContext => {
    return over(
      lensProp("rules"),
      (rules: RuleDefinition[]) => {
        const foundIndex = findIndex(findPredicate, rules);

        if (foundIndex === -1) {
          return rules;
        }

        return adjust(foundIndex, updater, rules);
      },
      bp
    );
  }
);
