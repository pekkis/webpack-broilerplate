import { pathsFromRootPath } from "../src/paths";

test("creates paths from root path", () => {
  const paths = pathsFromRootPath("/tussihovi");

  expect(paths).toEqual({
    root: "/tussihovi",
    modules: "/tussihovi/node_modules",
    build: "/tussihovi/dist"
  });
});
