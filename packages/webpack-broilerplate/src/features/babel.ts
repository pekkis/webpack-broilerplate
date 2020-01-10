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

const getBrowsers = (browsers: BrowsersConfig): string[] => {
  if (type(browsers) === "Array") {
    return browsers as string[];
  }

  const browserFile = fs.readFileSync(
    path.resolve(browsers as string, ".browserslistrc"),
    {
      encoding: "utf-8"
    }
  );
  return browserFile
    .split("\n")
    .map(b => b.trim())
    .filter(b => b);
};

const getOptions = (
  mode: BroilerplateMode,
  browsers: string[],
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

type BrowsersConfig = string | string[];

interface Config {
  browsers: BrowsersConfig;
}

interface RuleConfig {
  options: object;
  test: RegExp;
}

interface BabelRuleDefinition extends RuleDefinition {
  config: RuleConfig;
  factory: (config: RuleConfig) => RuleSetRule;
}

const babelFeature = (config: Config) => (
  bp: BroilerplateContext
): BroilerplateContext => {
  const babelDefinition: BabelRuleDefinition = {
    identifier,
    config: {
      options: getOptions(bp.mode, getBrowsers(config.browsers), bp.debug),
      test: /\.(js|jsx|ts|tsx)$/
    },
    factory: (config: RuleConfig): RuleSetRule => {
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

/*
.updateIn(["use", 0, "options", "presets"], p => {
  return p.push(
    List.of(
      "@emotion/babel-preset-css-prop",
      Map({
        sourceMap: env === "development"
      })
    )
  );
});
*/

export default babelFeature;
