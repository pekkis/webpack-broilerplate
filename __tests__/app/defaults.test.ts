import broilerplate, { build, addEntrypoint } from "../../src/index";
import configOptimization from "../../src/features/configOptimization";
import util from "util";
import { pipe } from "ramda";
import babelFeature from "../../src/features/babel";

test("initializes webpack", () => {
  const p = pipe(
    addEntrypoint("main", "./src/index.js"),
    babelFeature(),
    configOptimization({})
  );

  const bp = pipe(p)(broilerplate("development", "client", __dirname));

  const config = build(bp);

  console.log(util.inspect(config, true, 999));
});
