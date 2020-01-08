module.exports = api => {
  // api.cache.using(() => process.env.NODE_ENV);
  api.cache.never();

  return {
    presets: [
      [
        "@babel/preset-env",
        {
          ignoreBrowserslistConfig: true,
          debug: false,
          targets: {
            node: 10
          },
          modules: "auto"
        }
      ],
      "@babel/preset-typescript"
    ],
    plugins: [
      "@babel/plugin-proposal-optional-chaining",
      "@babel/plugin-proposal-object-rest-spread",
      "@babel/plugin-proposal-nullish-coalescing-operator"
    ],
    env: {
      build: {
        ignore: [
          "**/*.test.tsx",
          "**/*.test.ts",
          "**/*.story.tsx",
          "__snapshots__",
          "__tests__",
          "__stories__"
        ]
      }
    },
    ignore: ["node_modules"]
  };
};
