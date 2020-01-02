module.exports = {
  roots: ["<rootDir>"],
  testMatch: ["**/?(*.)+(spec|test).+(ts|tsx|js)"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
    "^.+\\.jsx?$": "babel-jest"
  },
  globals: {
    "ts-jest": {
      diagnostics: false,
      babelConfig: true
    }
  },
  verbose: true
};
