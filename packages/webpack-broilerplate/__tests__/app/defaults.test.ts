import broilerplate, {
  build,
  addEntrypoint,
  pathsFromRootPath
} from "../../src/index";
import configOptimization from "../../src/features/configOptimization";
import util from "util";
import { pipe } from "ramda";
import babelFeature from "../../src/features/babel";
import saneDefaultOptions from "../../src/features/saneDefaultOptions";
import copyFiles from "../../src/features/copyFiles";

test("initializes webpack", () => {
  const p = pipe(
    addEntrypoint("main", "./src/index.js"),
    babelFeature({
      browsers: __dirname
    }),
    saneDefaultOptions(),
    configOptimization({}),
    copyFiles("assets/web")
  );

  const devConfig = build(
    p(broilerplate("development", pathsFromRootPath(__dirname)))
  );
  const prodConfig = build(
    p(broilerplate("production", pathsFromRootPath(__dirname)))
  );

  console.log("dev", util.inspect(devConfig, false, 999));
  console.log("prod", util.inspect(prodConfig, false, 999));
});
