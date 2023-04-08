import { View, Image, Text } from "react-native";
import Delivery from "../utility-components/Delivery";
import Location from "../utility-components/Location";

export default function RectPost({ item }) {
  return (
    (item && (
      <View
        className={`h-28 w-full px-1 items-center rounded-md shadow-lg bg-light-grey flex flex-row mb-4`}
      >
        <Image
          className={`w-24 h-24 rounded`}
          source={{ uri: item.images[0] }}
        />
        <View
          className={`flex flex-col w-2/3 justify-between h-full py-3 px-2`}
        >
          <Text className={` font-semibold`}>
            {(item.title.length > 50 &&
              item.title.substring(0, 50 - 3) + "...") ||
              item.title}  
          </Text>
          <View className={`flex flex-row w-full justify-between`}>
            <Location location={item.location} />
            <View className={`flex flex-col`}>
              {
                <Delivery
                  delivery={"local pickup"}
                  isOffered={item.deliveryOptions.includes("local pickup")}
                />
              }
              <Delivery
                delivery={"local delivery"}
                isOffered={item.deliveryOptions.includes("local delivery")}
              />
            </View>
          </View>
        </View>
      </View>
    )) ||
    null
  );
}
