import broilerplate, { pipe, build } from "@dr-kobros/webpack-broilerplate";
import babelFeature from "@dr-kobros/webpack-broilerplate/dist/features/babel";

import emotionFeature from "../src/index";

test("adds preset", () => {
  const bp = pipe(
    broilerplate,
    babelFeature({
      browsers: ["not dead"]
    }),
    emotionFeature(),
    build
  )("development");

  console.log(bp);

  expect(true).toBe(true);
});
