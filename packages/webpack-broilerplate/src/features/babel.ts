import path from "path";
import fs from "fs";
import { pipe, curry, over, lensPath, append, type } from "ramda";
import {
  BroilerplateContext,
  BroilerplateMode,
  RuleDefinition
} from "../index";
import { addRule, updateRuleConfig } from "../rules";
import { RuleSetRule } from "webpack";

const getOptions = (
  mode: BroilerplateMode,
  browsers: BrowsersConfig,
  isDebug: boolean
): object => {
  return {
    babelrc: false,
    presets: [
      "@babel/preset-typescript",
      [
        "@babel/preset-env",
        {
          debug: isDebug,
          useBuiltIns: "usage",
          targets: {
            browsers
          },
          modules: false,
          corejs: 3
        }
      ],
      [
        "@babel/preset-react",
        {
          development: mode === "development"
        }
      ]
    ],
    plugins: [
      "@babel/plugin-syntax-dynamic-import",
      "@babel/plugin-proposal-class-properties",
      "@babel/plugin-proposal-nullish-coalescing-operator",
      "@babel/plugin-proposal-optional-chaining"
    ]
  };
};

export const identifier = Symbol("babelRule");

type BrowsersConfig = string[] | { [key: string]: string[] };

interface Config {
  browsers: BrowsersConfig;
}

interface RuleConfig {
  options: object;
  test: RegExp;
}

const babelFeature = (config: Config) => (
  bp: BroilerplateContext
): BroilerplateContext => {
  const babelDefinition: RuleDefinition<RuleConfig> = {
    identifier,
    config: {
      options: getOptions(bp.mode, config.browsers, bp.debug),
      test: /\.(js|jsx|ts|tsx)$/
    },
    factory: (config): RuleSetRule => {
      return {
        test: config.test,
        use: [
          {
            loader: "babel-loader",
            options: config.options
          }
        ],
        exclude: [bp.paths.modules]
      };
    }
  };

  const feature = pipe(addRule(babelDefinition));
  return feature(bp);
};

export const pushBabelPreset = curry(
  (
    babelPreset: string | [string, object],
    bp: BroilerplateContext
  ): BroilerplateContext => {
    return updateRuleConfig(
      r => r.identifier === identifier,
      over(lensPath(["options", "presets"]), append(babelPreset)),
      bp
    );
  }
);

export default babelFeature;
