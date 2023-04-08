import { Modal, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../../../backend/config";
import { useState } from "react";

const AvailabilityModal = ({ setModal, modal, item }) => {
  const [available, setAvailable] = useState(item.available);
  const [needGone, setNeedGone] = useState(item.needGoneAsap);

  async function handleUpdate(){
    const postRef = doc(db,"posts",item.id)
    await updateDoc(postRef, {available: available, needGoneAsap: needGone})
    setModal(false)
  }


  return (
    <Modal visible={modal} transparent={true} animationType="slide">
      <View
        className="flex items-center justify-center w-full h-full"
        style={{ backgroundColor: "#000000aa" }}
      >
        <View className="bg-white rounded-md w-3/4 flex items-center p-4 gap-y-4">
          <Text className="text-lg font-semibold">Manage Availability  </Text>
          <View className="flex flex-col items-left gap-y-3 my-6">
            <View className="flex flex-row gap-x-2 items-center">
              <Text>mark as need gone ASAP </Text>
              <TouchableOpacity onPress={() => setNeedGone(!needGone)}>
                {(needGone && (
                  <Ionicons name="checkbox-sharp" size={24} color="green" />
                )) || <View className="border w-5 h-5" />}
              </TouchableOpacity>
            </View>

            <View className="flex flex-row gap-x-2 items-center">
              <Text>mark as available </Text>
              <TouchableOpacity onPress={() => setAvailable(!available)}>
                {(available && (
                  <Ionicons name="checkbox-sharp" size={24} color="green" />
                )) || <View className="border w-5 h-5" />}
              </TouchableOpacity>
            </View>
          </View>

          <View className="flex flex-row gap-x-4">
            <TouchableOpacity onPress={handleUpdate} className="">
              <View className="bg-black w-20 rounded-lg flex items-center py-2">
                <Text className="text-white font-semibold uppercase text-center">
                  Update
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModal(false)} className="">
              <View className="border w-20 rounded-lg flex items-center py-2">
                <Text className="text-black font-semibold uppercase text-center">
                  Cancel
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export { AvailabilityModal };
