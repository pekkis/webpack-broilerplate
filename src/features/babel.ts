import path from "path";
import fs from "fs";
import { pipe } from "ramda";
import {
  BroilerplateContext,
  BroilerplateMode,
  BroilerplateTarget
} from "../index";
import { addRule, RuleDefinition } from "../rules";
import { Rule, RuleSetRule } from "webpack";

const getBrowsers = (configFilePath: string): string[] => {
  const browserFile = fs.readFileSync(
    path.resolve(configFilePath, ".browserslistrc"),
    {
      encoding: "utf-8"
    }
  );
  return browserFile
    .split("\n")
    .map(b => b.trim())
    .filter(b => b);
};

const getTargets = (target: BroilerplateTarget, configFilePath: string) => {
  if (target === "client") {
    return {
      browsers: getBrowsers(configFilePath)
    };
  }

  return {
    node: "current"
  };
};

const getOptions = (
  mode: BroilerplateMode,
  target: BroilerplateTarget,
  configFilePath: string,
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
          targets: getTargets(target, configFilePath),
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

export const identifier = Symbol("babelFeature");

const babelFeature = () => (bp: BroilerplateContext): BroilerplateContext => {
  const babelDefinition: RuleDefinition = {
    identifier,
    factory: (): RuleSetRule => {
      return {
        test: /\.(js|jsx|ts|tsx)$/,
        use: [
          {
            loader: "babel-loader",
            options: getOptions(bp.mode, bp.target, bp.paths.root, bp.debug)
          }
        ],
        exclude: [bp.paths.modules]
      };
    }
  };

  const feature = pipe(addRule(babelDefinition));
  return feature(bp);
};

export default babelFeature;
