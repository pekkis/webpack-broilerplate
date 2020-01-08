import broilerplate from "../src";
import { compose } from "ramda";
import { RulesetDefinition, addRuleset, updateLoader } from "../src/rulesets";

test("adds a loader", () => {
  const definition: RulesetDefinition = {
    factory: () => {
      return {};
    }
  };

  const bp = compose(addRuleset(definition))(broilerplate("development"));

  expect(bp.rulesets.length).toEqual(1);
  expect(bp.rulesets[0]).toBe(definition);
});

test("modifies a loader", () => {
  const id = Symbol("puuppa");

  const definition: RulesetDefinition = {
    identifier: id,
    factory: () => {
      return {};
    },
    config: {
      hellu: "rei"
    }
  };

  const definition2: RulesetDefinition = {
    identifier: Symbol("puupero"),
    factory: () => {
      return {};
    },
    config: {
      hellu: "rei"
    }
  };

  const bp = broilerplate("development");
  const bp2 = compose(addRuleset(definition), addRuleset(definition2))(bp);

  expect(bp2.rulesets.length).toBe(2);

  const mock = jest.fn(l => l);

  const bp3 = updateLoader(l => l.identifier === id, mock, bp2);

  expect(bp3.rulesets.length).toBe(2);
  expect(bp3).not.toBe(bp2);
  expect(mock).toHaveBeenCalledWith(definition);
  expect(mock).toHaveBeenCalledTimes(1);
});

test("not found does not modify anything", () => {
  const id = Symbol("puuppa");

  const notFoundId = Symbol("notfound");

  const definition: RulesetDefinition = {
    identifier: id,
    factory: () => {
      return {};
    },
    config: {
      hellu: "rei"
    }
  };

  const bp = broilerplate("development");
  const bp2 = addRuleset(definition)(bp);

  const mock = jest.fn(l => l);

  const bp3 = updateLoader(l => l.identifier === notFoundId, mock, bp2);
  expect(mock).not.toHaveBeenCalled();

  expect(bp3).not.toBe(bp2);
  expect(bp2.rulesets).toBe(bp3.rulesets);
});
