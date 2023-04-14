import { View, Text, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";

export default function DeliveryScreen({
  deliveryOptions,
  setDelivery,
  delivery,
  setPage
}) {
  const DeliverySelection = ({ deliveryType, page }) => {
    return (
      <TouchableOpacity
        onPress={() => setDelivery(deliveryType)}
        className={"mb-4"}
      >
        <View
          className={`${
            (deliveryType == delivery && "bg-warm") || "border"
          } rounded-lg w-40 flex items-center p-4`}
        >
          <Text
            className={`${
              (deliveryType == delivery && "text-white") || "text-black"
            } text-center font-semibold`}
            style={{ fontSize: 15, fontWeight: 400 }}
          >
            {(deliveryType == "local pickup" && "Pickup") || "Local Delivery"}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="w-full h-full justify-start items-center flex flex-col gap-y-20">
      <View className="w-full justify-center flex flex-col gap-3 items-center">
        <Text className="text-cherry font-semibold text-xl">
          Let's confirm your selection
        </Text>
        <Text style={{ fontSize: 15 }}>choose a delivery method</Text>
      </View>

      <View>
        {deliveryOptions.map((del) => (
          <DeliverySelection deliveryType={del} key={del} />
        ))}
      </View>

      {delivery && (
        <TouchableOpacity className="flex w-full justify-center items-center" onPress={() => setPage(2)}>
          <View className="flex flex-row w-full justify-center items-center gap-x-3">
            <Text
              className="text-xl font-bold text-cherry
      "
            >
              Next   </Text>
            <AntDesign name="arrowright" size={30} color="#D8473D" />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}
