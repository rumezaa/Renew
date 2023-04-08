import { View, Image, Text, TouchableOpacity } from "react-native";
import { EvilIcons } from "@expo/vector-icons";
import Location from "../utility-components/Location";
import { useNavigation } from "@react-navigation/native";


export default function OrderComponent({ item }) {
  const nav = useNavigation()

  const convertTime = (time) => {
    let hour = time.split(":")[0];
    let minute = time.split(":")[1];

    return (
      (hour <= 12 && `${hour}:${minute} ${(hour == 12 && "pm") || "am"}`) ||
      `${hour - 12}:${minute} pm`
    );
  };



  return (
    (item.userId && (
      <View className="w-full rounded-md shadow-lg bg-light-grey" >
        <TouchableOpacity onPress={() => nav.navigate("Product", { item: item.product })}
          className={`h-28 w-full px-1 items-center flex flex-row mb-4`}
        >
          <Image
            className={`w-24 h-24 rounded`}
            source={{ uri: item.product.images[0] }}
          />
          <View
            className={`flex flex-col w-2/3 justify-between h-full py-3 px-2`}
          >
            <Text className={`font-semibold`}>{(item.product.title.length > 50 &&
              item.product.title.substring(0, 50 - 3) + "...") ||
              item.product.title}</Text>
            <View
              className={`flex flex-col w-full justify-between items-start`}
            >
              <Text style={{fontWeight: 400}}>
                {item.delivery} at {convertTime(item.time)}  </Text>
              <Location location={item.product.location} />
            </View>
          </View>
        </TouchableOpacity>
        <View className="p-1">
          <TouchableOpacity
              onPress={() => nav.navigate("View Profile", { item: item.userId })}
            >
              <View
                className="rounded-lg w-full p-4 flex flex-row items-center justify-center"
                style={{
                  borderWidth: 0.5,
                  borderColor: "black",
                  borderStyle: "solid",
                }}
              >
                <EvilIcons name="search" size={24} color="black" />
                <Text className="uppercase text-center ml-1" style={{fontWeight: 400}}>view user info    </Text>
              </View>
            </TouchableOpacity>
          
        </View>
      </View>
    )) || (
      <View
        className={`h-28 w-full px-1 items-center rounded-md shadow-lg bg-light-grey flex flex-row mb-4`}
      >
        <Image
          className={`w-24 h-24 rounded`}
          source={{ uri: item.product.images[0] }}
        />
        <View
          className={`flex flex-col w-2/3 justify-between h-full py-3 px-2`}
        >
          <Text className={`font-semibold`}>{(item.product.title.length > 50 &&
              item.product.title.substring(0, 50 - 3) + "...") ||
              item.product.title}  </Text>
          <View className={`flex flex-col w-full justify-between items-start`}>
            <Text style={{fontWeight: 400}}>
              {item.delivery} at {convertTime(item.time)}  </Text>
            <Location location={item.product.location} />
          </View>
        </View>
      </View>
    )
  );
}
