import { curry, lensPath, over, adjust, findIndex, lensProp } from "ramda";
import { BroilerplateContext, addDefinition, RuleDefinition } from "./index";
import { RuleSetRule } from "webpack";

export const addRule = curry(
  (definition: RuleDefinition<any>, bp: BroilerplateContext) =>
    addDefinition(lensPath(["rules"]), definition, bp)
);

export const buildRule = (rule: RuleDefinition<any>): RuleSetRule => {
  return rule.factory(rule.config);
};

export const updateRule = curry(
  (
    findPredicate: (rule: RuleDefinition<any>) => boolean,
    updater: (rule: RuleDefinition<any>) => RuleDefinition,
    bp: BroilerplateContext
  ): BroilerplateContext =>
    over(
      lensProp("rules"),
      (rules: RuleDefinition<any>[]) => {
        const foundIndex = findIndex(findPredicate, rules);

        if (foundIndex === -1) {
          throw new Error("Rule not found");
        }

        return adjust(foundIndex, updater, rules);
      },
      bp
    )
);

export function updateRuleConfig(
  findPredicate: (rule: RuleDefinition<any>) => boolean,
  updater: (config: any) => RuleDefinition,
  bp: BroilerplateContext
): BroilerplateContext {
  return updateRule(findPredicate, over(lensProp("config"), updater), bp);
}
