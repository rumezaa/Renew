import { TouchableOpacity, View, Text, FlatList, Image } from "react-native";
import RectPost from "../posts/RectPost";
import { useNavigation } from "@react-navigation/native";

export default function ProductViewModal({ products }) {
  const nav = useNavigation();
  return (
    <View className="h-3/5 w-full flex flex-col items-center gap-5 bg-white">
      <View className="flex flex-row w-full items-left">
        <TouchableOpacity onPress={() => nav.navigate("Browse", {item:products})}>
          <View className="flex flex-row items-center gap-x-4">
            <Text className="uppercase text-xl font-light ">
              Browse all donations
            </Text>
            <Image
              source={require("../../assets/icons/arrow-warm-right.png")}
              style={{ width: 26, height: 26 }}
            />
          </View>
        </TouchableOpacity>
      </View>

      <FlatList
        data={products}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => nav.navigate("Product", { item: item })}
          >
            <RectPost item={item} />
          </TouchableOpacity>
        )}
        //Setting the number of column

        className="w-full"
      />
    </View>
  );
}
