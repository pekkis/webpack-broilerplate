import broilerplate, {
  BroilerplateMode,
  addEntrypoint,
  removeEntrypoint,
  setDebug
} from "../src/index";
import { pipe } from "ramda";
import util from "util";

test("invalid broilerplate mode throws", () => {
  expect(() => broilerplate("boobba")).toThrow("Invalid broilerplate mode");
});

test("broilerplate mode initializes correctly", () => {
  ["development", "production"].forEach(mode => {
    const bp = broilerplate(mode as BroilerplateMode);
    expect(bp.mode).toEqual(mode);
  });
});

test("paths initialize correctly by default", () => {
  const bp = broilerplate("development");
  expect(bp.paths.root).toEqual(process.cwd());
  expect(bp.paths.build).toEqual(`${process.cwd()}/dist`);
  expect(bp.paths.modules).toEqual(`${process.cwd()}/node_modules`);
});

test("paths initialize correctly with override", () => {
  const bp = broilerplate("development", "client", "/tussi");
  expect(bp.paths.root).toEqual("/tussi");
  expect(bp.paths.build).toEqual(`/tussi/dist`);
  expect(bp.paths.modules).toEqual(`/tussi/node_modules`);
});

test("adds entry point", () => {
  const bp = broilerplate("development");
  const bp2 = addEntrypoint("main", "main.js", bp);

  expect(bp2.config.entry?.["main"]).toBe("main.js");
});

test("removes entry point", () => {
  const bp = broilerplate("development");
  const bp2 = addEntrypoint("main", "main.js", bp);
  const bp3 = removeEntrypoint("main", bp);

  expect(bp2.config.entry?.["main"]).toBe("main.js");
  expect(bp3.config.entry?.["main"]).toBeUndefined();
});

test("features can be composed", () => {
  const bp = pipe(
    addEntrypoint("main", "tussi.js"),
    addEntrypoint("lubs", "lubs.js")
  )(broilerplate("development"));

  // console.log(util.inspect(bp, true, 999));

  expect(bp.config.entry?.["main"]).toBe("tussi.js");
  expect(bp.config.entry?.["lubs"]).toBe("lubs.js");
});

test("sets debug mode", () => {
  const bp = broilerplate("development");
  expect(bp.debug).toBe(false);

  const bp2 = setDebug(true, bp);
  expect(bp2.debug).toBe(true);
});
