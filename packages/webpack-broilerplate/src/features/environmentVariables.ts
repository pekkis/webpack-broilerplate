import { BroilerplateContext, PluginDefinition } from "../index";
import { addPlugin, createPluginDefinition } from "../plugins";
import webpack from "webpack";
import { pickBy } from "ramda";

const getEnvironmentVariables = (
  env: NodeJS.ProcessEnv,
  prefix: string
): { [key: string]: string } =>
  pickBy((v, k) => k === "NODE_ENV" || k.startsWith(prefix), env);

const environmentVariables = (prefix = "REACT_APP_") => (
  bp: BroilerplateContext
): BroilerplateContext => {
  const d = createPluginDefinition(
    c =>
      new webpack.DefinePlugin({
        __DEVELOPMENT: bp.mode === "development",
        ...getEnvironmentVariables(process.env, c)
      }),
    prefix
  );

  return addPlugin(d)(bp);
};

export default environmentVariables;
