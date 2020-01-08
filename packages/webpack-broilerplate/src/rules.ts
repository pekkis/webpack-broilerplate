import {
  curry,
  lensPath,
  over,
  adjust,
  findIndex,
  lensProp,
  ifElse
} from "ramda";
import { BroilerplateContext, addDefinition, RuleDefinition } from "./index";
import { RuleSetRule } from "webpack";

export const addRule = curry(
  (definition: RuleDefinition, bp: BroilerplateContext) =>
    addDefinition(lensPath(["rules"]), definition, bp)
);

export const buildRule = (rule: RuleDefinition): RuleSetRule => {
  return rule.factory(rule.config);
};

export const updateRule = curry(
  (
    findPredicate: (rule: RuleDefinition) => boolean,
    updater: (rule: RuleDefinition) => RuleDefinition,
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
