import { BroilerplateContext } from "../index";
import { addPlugin, createPluginDefinition } from "../plugins";
import webpack from "webpack";
import { pickBy, any } from "ramda";

const hasPrefix = (prefixes: string[], value: string): boolean => {
  return any(p => value.startsWith(p), prefixes);
};

const getEnvironmentVariables = (
  env: NodeJS.ProcessEnv,
  prefix: string[],
  whitelisted: string[]
): { [key: string]: string } =>
  pickBy(
    (v, k) =>
      k === "NODE_ENV" || whitelisted.includes(v) || hasPrefix(prefix, v),
    env
  );

const environmentVariables = (
  prefixes: string[] = ["REACT_APP_"],
  whitelisted: string[] = []
) => (bp: BroilerplateContext): BroilerplateContext => {
  const d = createPluginDefinition(
    c =>
      new webpack.DefinePlugin({
        __DEVELOPMENT__: bp.mode === "development",
        __PRODUCTION__: bp.mode === "production",
        "process.env": JSON.stringify(
          getEnvironmentVariables(process.env, c.prefixes, c.whitelisted)
        )
      }),
    { prefixes, whitelisted }
  );

  return addPlugin(d)(bp);
};

export default environmentVariables;
