import { updateDoc, doc } from "firebase/firestore";
import { useState } from "react";
import { db } from "../../backend/config";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import { mergeSort } from "../../backend/sort";
import { useNavigation } from "@react-navigation/native";

const SortModal = ({ setModal, modal, posts, setPosts }) => {
  const [sort, setSort] = useState();

  function handleSort(){
    mergeSort(posts, posts.length-1, 0, setPosts)
    setModal(false)
  }
  return (
    <Modal visible={modal} transparent={true} animationType="slide">
      <View
        className="flex items-center justify-center w-full h-full"
        style={{ backgroundColor: "#000000aa" }}
      >
        <View className="bg-white rounded flex justify-start w-40 p-4">
          <Text className="text-lg font-bold mb-4">Sort By</Text>
          <View className="flex flex-col">
            <Text className="font-semibold mb-2" style={{ fontSize: 16 }}>
              Location
            </Text>
            <View className="flex flex-col gap-y-2">
              <TouchableOpacity
                onPress={() => setSort({ sort: "location", type: "AZ" })}
              >
                <View className="flex flex-row items-center justify-start gap-x-2">
                  <View
                    className={`${
                      (sort?.sort == "location" &&
                        sort?.type == "AZ" &&
                        "bg-light-green") ||
                      "border"
                    } w-5 h-5 rounded-full`}
                  />
                  <Text>sort A-Z</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setSort({ sort: "location", type: "ZA" })}
              >
                <View className="flex flex-row items-center justify-start gap-x-2">
                  <View
                    className={`${
                      (sort?.sort == "location" &&
                        sort?.type == "ZA" &&
                        "bg-light-green") ||
                      "border"
                    } w-5 h-5 rounded-full`}
                  />

                  <Text>sort Z-A</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View className="my-4">
            <Text className="font-semibold mb-2" style={{ fontSize: 16 }}>
              Title
            </Text>
            <View className="flex flex-col gap-y-2">
              <TouchableOpacity
                onPress={() => setSort({ sort: "title", type: "AZ" })}
              >
                <View className="flex flex-row items-center justify-start gap-x-2">
                  <View
                    className={`${
                      (sort?.sort == "title" &&
                        sort?.type == "AZ" &&
                        "bg-light-green") ||
                      "border"
                    } w-5 h-5 rounded-full`}
                  />
                  <Text>sort A-Z</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setSort({ sort: "title", type: "ZA" })}
              >
                <View className="flex flex-row items-center justify-start gap-x-2">
                  <View
                    className={`${
                      (sort?.sort == "title" &&
                        sort?.type == "ZA" &&
                        "bg-light-green") ||
                      "border"
                    } w-5 h-5 rounded-full`}
                  />

                  <Text>sort Z-A</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity onPress={handleSort}>
            <View className="bg-black rounded-full items-center p-4">
                <Text className="text-white font-semibold">sort</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export { SortModal };
