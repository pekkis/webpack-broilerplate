import { curry, lensPath, over, adjust, findIndex, lensProp } from "ramda";
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
  ): BroilerplateContext =>
    over(
      lensProp("rules"),
      (rules: RuleDefinition[]) => {
        const foundIndex = findIndex(findPredicate, rules);

        if (foundIndex === -1) {
          throw new Error("Rule not found");
        }

        return adjust(foundIndex, updater, rules);
      },
      bp
    )
);
export const updateRuleConfig = curry(
  (
    findPredicate: (rule: RuleDefinition) => boolean,
    updater: (config: any) => RuleDefinition,
    bp: BroilerplateContext
  ): BroilerplateContext =>
    updateRule(findPredicate, over(lensProp("config"), updater), bp)
);
