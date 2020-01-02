2import broilerplate from "../src";
import { compose } from "ramda";
import { LoaderDefinition, addLoader, updateLoader } from "../src/loaders";

test("adds a loader", () => {
  const definition: LoaderDefinition = {
    factory: () => {
      return {};
    }
  };

  const bp = compose(addLoader(definition))(broilerplate("development"));

  expect(bp.loaders.length).toEqual(1);
  expect(bp.loaders[0]).toBe(definition);
});

test("modifies a loader", () => {
  const id = Symbol("puuppa");

  const definition: LoaderDefinition = {
    identifier: id,
    factory: () => {
      return {};
    },
    config: {
      hellu: "rei"
    }
  };

  const definition2: LoaderDefinition = {
    identifier: Symbol("puupero"),
    factory: () => {
      return {};
    },
    config: {
      hellu: "rei"
    }
  };

  const bp = broilerplate("development");
  const bp2 = compose(
    addLoader(definition),
    addLoader(definition2)
  )(bp);

  expect(bp2.loaders.length).toBe(2);

  const mock = jest.fn(l => l);

  const bp3 = updateLoader(l => l.identifier === id, mock, bp2);

  expect(bp3.loaders.length).toBe(2);
  expect(bp3).not.toBe(bp2);
  expect(mock).toHaveBeenCalledWith(definition);
  expect(mock).toHaveBeenCalledTimes(1);
});

test("not found does not modify anything", () => {
  const id = Symbol("puuppa");

  const notFoundId = Symbol("notfound");

  const definition: LoaderDefinition = {
    identifier: id,
    factory: () => {
      return {};
    },
    config: {
      hellu: "rei"
    }
  };

  const bp = broilerplate("development");
  const bp2 = addLoader(definition)(bp);

  const mock = jest.fn(l => l);

  const bp3 = updateLoader(l => l.identifier === notFoundId, mock, bp2);
  expect(mock).not.toHaveBeenCalled();

  expect(bp3).not.toBe(bp2);
  expect(bp2.loaders).toBe(bp3.loaders);

});
