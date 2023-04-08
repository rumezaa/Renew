import { View, Text, Image } from "react-native";

export default function Delivery({ delivery, isOffered }) {
  return (
    <View className={`flex flex-row items-center`}>
      {(isOffered && (
        <Image
          className={`w-5 h-5`}
          source={require("../../assets/icons/check.png")}
        />
      )) || (
        <Image
          className={`w-4 h-4`}
          source={require("../../assets/icons/x.png")}
        />
      )}

      <Text style={{fontWeight: 400}}>{delivery}  </Text>
    </View>
  );
}
