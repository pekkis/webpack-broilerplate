/// <reference types="webpack" />
declare module "broilerplate" {
    export function isBroilerplate(): boolean;
}
declare module "plugins" {
    import { BroilerplateContext, AddableDefinition } from "index";
    import { Plugin } from "webpack";
    export interface PluginDefinition extends AddableDefinition {
        factory: (options: unknown) => Plugin;
    }
    export const addPlugin: import("Function/Curry").Curry<(pluginDefinition: PluginDefinition, bp: BroilerplateContext) => BroilerplateContext>;
    export const buildPlugin: (plugin: PluginDefinition) => Plugin;
}
declare module "rules" {
    import { BroilerplateContext, AddableDefinition } from "index";
    import { RuleSetRule } from "webpack";
    export interface RuleDefinition extends AddableDefinition {
        factory: (config: unknown) => RuleSetRule;
    }
    export const addRule: import("Function/Curry").Curry<(definition: RuleDefinition, bp: BroilerplateContext) => BroilerplateContext>;
    export const buildRule: (loader: RuleDefinition) => RuleSetRule;
    export const updateLoader: import("Function/Curry").Curry<(findPredicate: (loader: RuleDefinition) => boolean, updater: (loader: RuleDefinition) => RuleDefinition, bp: BroilerplateContext) => BroilerplateContext>;
}
declare module "paths" {
    import { BroilerplatePaths, BroilerplateContext } from "index";
    export const pathsFromRootPath: (rootPath: string) => BroilerplatePaths;
    export const setPaths: (newPaths: Partial<BroilerplatePaths>) => (bp: BroilerplateContext) => BroilerplateContext;
}
declare module "index" {
    import webpack from "webpack";
    import { Lens } from "ramda";
    import { PluginDefinition } from "plugins";
    import { RuleDefinition } from "rules";
    export type BroilerplateMode = "development" | "production";
    export type BroilerplateTarget = "client" | "server";
    export const broilerPlateSymbol: unique symbol;
    export interface AddableDefinition {
        priority?: number;
        identifier?: symbol;
        factory: (options: any) => any;
        config?: any;
    }
    export const entryPointsLens: Lens;
    export interface BroilerplatePaths {
        root: string;
        build: string;
        modules: string;
    }
    export interface BroilerplateContext {
        [broilerPlateSymbol]: true;
        mode: BroilerplateMode;
        target: BroilerplateTarget;
        plugins: Array<PluginDefinition>;
        rules: Array<RuleDefinition>;
        config: Partial<webpack.Configuration>;
        paths: BroilerplatePaths;
        debug: boolean;
    }
    export default function broilerplate(mode: BroilerplateMode, target?: BroilerplateTarget, rootPath?: string): BroilerplateContext;
    export const setDebug: import("Function/Curry").Curry<(value: boolean, bp: BroilerplateContext) => BroilerplateContext>;
    export const addEntrypoint: import("Function/Curry").Curry<(name: string, file: string, bp: BroilerplateContext) => BroilerplateContext>;
    export const removeEntrypoint: import("Function/Curry").Curry<(name: any, bp: any) => any>;
    export const addDefinition: import("Function/Curry").Curry<(lens: Lens, definition: AddableDefinition, bp: BroilerplateContext) => BroilerplateContext>;
    export const build: (bp: BroilerplateContext) => webpack.Configuration;
}
declare module "features/babel" {
    import { BroilerplateContext } from "index";
    export const identifier: unique symbol;
    const babelFeature: () => (bp: BroilerplateContext) => BroilerplateContext;
    export default babelFeature;
}
declare module "features/configOptimization" {
    import { BroilerplateContext } from "index";
    import webpack from "webpack";
    const configOptimization: (config?: Partial<webpack.Options.Optimization>) => (bp: BroilerplateContext) => BroilerplateContext;
    export default configOptimization;
}
