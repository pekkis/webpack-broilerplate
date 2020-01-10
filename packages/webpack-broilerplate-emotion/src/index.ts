import { BroilerplateContext } from "@dr-kobros/webpack-broilerplate";
import { pushBabelPreset } from "@dr-kobros/webpack-broilerplate/dist/features/babel";

const emotionFeature = () => (bp: BroilerplateContext): BroilerplateContext => {
  return pushBabelPreset("@emotion/babel-preset-css-prop", bp);
};

export default emotionFeature;
