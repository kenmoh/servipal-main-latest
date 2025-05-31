import { useHeaderHeight } from "@react-navigation/elements";
import { ActivityIndicator, Dimensions } from "react-native";
import { useTheme, View } from "tamagui";

function LoadingIndicator() {
  const headerHeight = useHeaderHeight();
  const LOADING_HEIGHT = Dimensions.get("window").height - headerHeight;
  const theme = useTheme();
  return (
    <View
      height={LOADING_HEIGHT}
      bottom={0}
      left={0}
      right={0}
      position="absolute"
      backgroundColor={"$background"}
      flex={1}
      justifyContent="center"
      alignItems="center"
    >
      <ActivityIndicator size="large" color={theme.icon.val} />
    </View>
  );
}

export default LoadingIndicator;
