import broilerplate from "../../src/index";
import configOptimization from "../../src/features/configOptimization";
import { pipe } from "ramda";

test("configures optimization", () => {
  const bp = broilerplate("development");

  const bp2 = configOptimization()(bp);

  expect(bp2.config).toHaveProperty(["optimization", "splitChunks"]);
  expect(
    bp2.config.optimization.splitChunks.cacheGroups["vendor"].name
  ).toEqual("vendor");
});

test("merges optimization correctly", () => {
  const bp = broilerplate("development");

  const bp2 = pipe(
    configOptimization({}),
    configOptimization({
      minimize: false,
      splitChunks: {
        cacheGroups: {
          vendor: {
            name: "tussi"
          }
        }
      }
    })
  )(bp);

  expect(bp2.config).toHaveProperty(["optimization", "splitChunks"]);
  expect(bp2.config.optimization?.minimize).toBe(false);
});
