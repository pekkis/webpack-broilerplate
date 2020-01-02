module.exports = api => {
  api.cache(true);

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
          modules: false
        }
      ],
      "@babel/preset-typescript"
    ],
    plugins: [
      "@babel/plugin-proposal-optional-chaining",
      "@babel/plugin-proposal-object-rest-spread",
      "@babel/plugin-proposal-nullish-coalescing-operator"
    ]
  };
};
