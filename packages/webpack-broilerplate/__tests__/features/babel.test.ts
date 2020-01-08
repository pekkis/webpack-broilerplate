import broilerplate, { pipe, build } from "../../src/index";
import util from "util";
import path from "path";

import babel, { pushBabelPreset } from "../../src/features/babel";

test("creates babel ruleset", () => {
  const bp = broilerplate(
    "development",
    "client",
    path.resolve(__dirname, "../app")
  );

  const bp2 = babel()(bp);

  // console.log(util.inspect(bp2, true, 999));
});

test("pushes a babel preset string", () => {
  const bp = broilerplate(
    "development",
    "client",
    path.resolve(__dirname, "../app")
  );

  const bp2 = pipe(babel(), pushBabelPreset("tussi"), build)(bp);

  expect(bp2.module.rules[0].use[0].options.presets.pop()).toEqual("tussi");
});

test("pushes a babel preset array", () => {
  const bp = broilerplate(
    "development",
    "client",
    path.resolve(__dirname, "../app")
  );

  const bp2 = pipe(
    babel(),
    pushBabelPreset(["hellurei", { config: "xoo" }]),
    build
  )(bp);

  expect(bp2.module.rules[0].use[0].options.presets.pop()).toEqual([
    "hellurei",
    { config: "xoo" }
  ]);
});
