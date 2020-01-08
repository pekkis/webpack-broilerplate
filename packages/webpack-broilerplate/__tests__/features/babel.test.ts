import broilerplate from "../../src/index";
import util from "util";
import path from "path";

import babel from "../../src/features/babel";

test("creates babel ruleset", () => {
  const bp = broilerplate(
    "development",
    "client",
    path.resolve(__dirname, "../app")
  );

  const bp2 = babel()(bp);

  // console.log(util.inspect(bp2, true, 999));
});
