import { Modal, View, Text, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

const InfoModal = ({ setModal, modal, business }) => {
  return (
    <Modal visible={modal} transparent={true} animationType="slide">
      <View
        className="flex items-center justify-center w-full h-full"
        style={{ backgroundColor: "#000000aa" }}
      >
        <View className="bg-white rounded-md w-3/4 flex items-center p-4 gap-y-4">
          <Text className="text-lg font-bold">About {business.name}</Text>
          <Ionicons name="md-flower-outline" size={15} color="#FFAF66" />

          <View className="flex flex-col my-2 items-center text-center">
            <View className="flex flex-row items-center gap-x-2">
              <Text style={{ fontSize: 16 }} className="text-center">
                {business.desc}
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => setModal(false)}>
            <View className="bg-black w-16 rounded-full flex items-center py-2">
              <Text className="text-white font-semibold uppercase text-center">
                Close
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const ContactModal = ({ setModal, modal, business }) => {
  return (
    <Modal visible={modal} transparent={true} animationType="slide">
      <View
        className="flex items-center justify-center w-full h-full"
        style={{ backgroundColor: "#000000aa" }}
      >
        <View className="bg-white rounded-md w-3/4 flex items-center p-4 gap-y-4">
          <Text className="text-lg font-bold">Contact {business.name}</Text>

          <View className="flex flex-col gap-y-2">
            {!!business.number && (
              <View className="flex flex-row items-center gap-x-2">
                <FontAwesome name="phone" size={24} color="#E4AC62" />
                <Text
                  style={{ fontSize: 16 }}
                  className="font-semibold text-black"
                >
                  {business.number}
                </Text>
              </View>
            )}

            <View className="flex flex-row items-center gap-x-2">
              <MaterialCommunityIcons name="email" size={24} color="#E4AC62" />
              <Text
                style={{ fontSize: 16 }}
                className="font-semibold text-black"
              >
                {business.email}
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => setModal(false)}>
            <View className="bg-black w-16 rounded-full flex items-center py-2">
              <Text className="text-white font-semibold uppercase text-center">
                Close
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export { ContactModal, InfoModal };
