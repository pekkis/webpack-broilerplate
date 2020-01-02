import { PluginDefinition, addPlugin } from "../src/plugins";
import broilerplate from "../src";
import { compose } from "ramda";

test("adds a plugin", () => {
  const pluginDefinition: PluginDefinition = {
    factory: () => {
      return {
        apply() {}
      };
    }
  };

  const bp = compose(addPlugin(pluginDefinition))(broilerplate("development"));

  expect(bp.plugins.length).toEqual(1);
  expect(bp.plugins[0]).toBe(pluginDefinition);
});
