import { ActivityIndicator } from "react-native";
import { useTheme, View } from "tamagui";

function LoadingIndicator({ size = 'large' }: { size?: 'large' | 'small' }) {

  const theme = useTheme();
  return (
    <View
      backgroundColor={"$background"}
      flex={1}
      justifyContent="center"
      alignItems="center"
    >
      <ActivityIndicator size={size} color={theme.icon.val} />
    </View>
  );
}

export default LoadingIndicator;
