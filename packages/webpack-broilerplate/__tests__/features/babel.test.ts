import broilerplate, { pipe, build, pathsFromRootPath } from "../../src/index";
import util from "util";
import path from "path";

import babel, { pushBabelPreset } from "../../src/features/babel";

const browsers = [
  ">0.5%",
  "not dead",
  "not ie <= 11",
  "not op_mini all",
  "not android <= 600"
];

test("creates babel ruleset", () => {
  const bp = broilerplate(
    "development",
    pathsFromRootPath(path.resolve(__dirname, "../app"))
  );

  const bp2 = babel({
    browsers
  })(bp);

  expect(bp2.rules[0].config.options.presets[1][1].targets.browsers).toEqual(
    browsers
  );
});

test("pushes a babel preset string", () => {
  const bp = broilerplate(
    "development",
    pathsFromRootPath(path.resolve(__dirname, "../app"))
  );

  const bp2 = pipe(
    babel({
      browsers
    }),
    pushBabelPreset("tussi")
  )(bp);

  expect(bp2.rules[0].config.options.presets.pop()).toEqual("tussi");
});

test("pushes a babel preset array", () => {
  const bp = broilerplate(
    "development",
    pathsFromRootPath(path.resolve(__dirname, "../app"))
  );

  const bp2 = pipe(
    babel({
      browsers
    }),
    pushBabelPreset(["hellurei", { config: "xoo" }])
  )(bp);

  expect(bp2.rules[0].config.options.presets.pop()).toEqual([
    "hellurei",
    { config: "xoo" }
  ]);
});
