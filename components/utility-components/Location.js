import { View, Text, Image } from "react-native";

export default function Location({ location, type }) {
  return (
    <View
      className={`flex flex-row ${(type && "items-end") || "items-center"}`}
    >
      {(type && (
        <Image
          className={`w-6 h-6`}
          source={require("../../assets/icons/location-white.png")}
        />
      )) || (
        <Image
          className={`w-5 h-5`}
          source={require("../../assets/icons/location.png")}
        />
      )}

      <Text style={{fontWeight: 400}} className={(type && "text-white font-semibold") || "text-black w-28" }>
        {location}
      </Text>
    </View>
  );
}
