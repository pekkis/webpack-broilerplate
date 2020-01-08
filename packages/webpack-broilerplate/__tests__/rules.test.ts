import broilerplate from "../src";
import { compose } from "ramda";
import { RuleDefinition, addRule, updateRule } from "../src/rules";

test("adds a loader", () => {
  const definition: RuleDefinition = {
    factory: () => {
      return {};
    }
  };

  const bp = compose(addRule(definition))(broilerplate("development"));

  expect(bp.rules.length).toEqual(1);
  expect(bp.rules[0]).toBe(definition);
});

test("modifies a loader", () => {
  const id = Symbol("puuppa");

  const definition: RuleDefinition = {
    identifier: id,
    factory: () => {
      return {};
    },
    config: {
      hellu: "rei"
    }
  };

  const definition2: RuleDefinition = {
    identifier: Symbol("puupero"),
    factory: () => {
      return {};
    },
    config: {
      hellu: "rei"
    }
  };

  const bp = broilerplate("development");
  const bp2 = compose(addRule(definition), addRule(definition2))(bp);

  expect(bp2.rules.length).toBe(2);

  const mock = jest.fn(l => l);

  const bp3 = updateRule(l => l.identifier === id, mock, bp2);

  expect(bp3.rules.length).toBe(2);
  expect(bp3).not.toBe(bp2);
  expect(mock).toHaveBeenCalledWith(definition);
  expect(mock).toHaveBeenCalledTimes(1);
});

test("not found does not modify anything", () => {
  const id = Symbol("puuppa");

  const notFoundId = Symbol("notfound");

  const definition: RuleDefinition = {
    identifier: id,
    factory: () => {
      return {};
    },
    config: {
      hellu: "rei"
    }
  };

  const bp = broilerplate("development");
  const bp2 = addRule(definition)(bp);

  const mock = jest.fn(l => l);

  const bp3 = updateRule(l => l.identifier === notFoundId, mock, bp2);
  expect(mock).not.toHaveBeenCalled();

  expect(bp3).not.toBe(bp2);
  expect(bp2.rules).toBe(bp3.rules);
});
