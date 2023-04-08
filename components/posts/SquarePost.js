import { View, ImageBackground, Text } from "react-native";
import Location from "../utility-components/Location";

export default function SqaurePosts({ item }) {
  return (
    item && (
      <View
        className={`h-56 w-48 px-1 items-center shadow-lg flex flex-row mb-4`}
      >
        <ImageBackground
          source={{ uri: item.images[0] }}
          resizeMode="cover"
          className={`w-full h-full px-1 items-end rounded-md shadow-lg flex flex-row`}
        >
          <View className="pb-2">
            <Location
              location={
                (item.location.length > 18 &&
                  item.location.substring(0, 18 - 3) + "...") ||
                item.location
              }
              type={"white"}
            />
          </View>
        </ImageBackground>
      </View>
    )
  );
}
