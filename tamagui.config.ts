import { createTamagui } from "tamagui";
import { appTheme, poppinsFont, tokens } from "@/constants/theme";
import { fonts } from "@tamagui/config/v3";

export const tamaguiConfig = createTamagui({
  tokens,
  fonts: {
    ...fonts,
    heading: poppinsFont,
    body: poppinsFont,
    mono: poppinsFont,
  },
  themes: {
    dark: appTheme.darkTheme,
    light: appTheme.lightTheme,
  },
});

export default tamaguiConfig;

export type Conf = typeof tamaguiConfig;

declare module "tamagui" {
  interface TamaguiCustomConfig extends Conf {}
}
