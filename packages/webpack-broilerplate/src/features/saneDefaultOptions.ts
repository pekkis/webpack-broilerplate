import { BroilerplateContext, whenProduction, whenDevelopment } from "../index";
import { pipe } from "ramda";
import configOptimization from "./configOptimization";
import coreJSUpgrade from "./coreJSUpgrade";
import caseSensitivePaths from "./caseSensitivePaths";
import environmentVariables from "./environmentVariables";
import cleanDirectories from "./cleanDirectories";
import watchMissingNodeModules from "./watchMissingNodeModules";

const sanePlugins = pipe(
  coreJSUpgrade(),
  caseSensitivePaths(),
  environmentVariables(),
  whenDevelopment(watchMissingNodeModules()),
  whenProduction(cleanDirectories())
);

const saneDefaultOptions = () => (
  bp: BroilerplateContext
): BroilerplateContext => {
  return pipe(configOptimization(), sanePlugins)(bp);
};

export default saneDefaultOptions;
