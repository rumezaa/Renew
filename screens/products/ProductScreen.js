import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import Location from "../../components/utility-components/Location";
import Slider from "../../components/utility-components/Slider";
import { EvilIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { SimpleLineIcons } from "@expo/vector-icons";
import { AvailabilityModal } from "./ProductsScreens/AvailabilityModal";
import { UserContext } from "../../components/contexts/UserProvider";
import { useContext, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";

export default function ProductScreen({ route }) {
  const item = route.params.item;
  const [user] = useContext(UserContext);
  const nav = useNavigation();
  const [modal, setModal] = useState(false);

  function isOrdered() {
    for (let i = 0; i < user.orders.length; i++) {
      const values = Object.values(user.orders[i]);
      if (values.includes(item.id)) {
        return true;
      }
    }
    return false;
  }

  function getItems() {
    const itemString = item.includes
      .map((thing, index) => {
        if (item.includes.length === 1 || index === item.includes.length - 1) {
          return thing;
        } else {
          return thing + ", ";
        }
      })
      .join("");

    return itemString;
  }

  getItems();

  return (
    <ScrollView className="h-full bg-white">
      <View className="flex flex-col w-full h-full p-6 bg-white">
        <Slider data={item.images} />
        <AvailabilityModal modal={modal} setModal={setModal} item={item} />
        <View className="flex flex-col w-full gap-y-10 mb-10">
          <View className="flex flex-col w-full gap-y-5 items-start">
            <Text className="text-lg font-bold tracking-wider">
              {item.title}  
            </Text>
            <View>
              {(item.available && (
                <View className="flex flex-row items-center gap-x-2">
                  <View className="bg-green-400 w-3 h-3 rounded-full" />
                  <Text className="">available  </Text>
                </View>
              )) || (
                <View className="flex flex-row items-center gap-x-2">
                  <View className="bg-red-400 w-3 h-3 rounded-full" />
                  <Text className="" style={{fontWeight: 400}}>unavailable  </Text>
                </View>
              )}
            </View>
            <View>
              <Text className="uppercase text-sm font-bold">includes  </Text>
              <View className="flex flex-row w-full px-2">
                <Text style={{fontWeight: 400}}>{getItems()}  </Text>
              </View>
            </View>
          </View>

          <View className={`flex flex-row w-full gap-x-6 `}>
            <View>
              <Text className="uppercase text-sm font-bold ">location</Text>
              <Location location={item.location} />
            </View>

            <View>
              <Text className="uppercase text-sm font-bold">amount</Text>
              <View
                className="flex flex-row gap-x-2 items-center"
                style={{ marginTop: 0.5 }}
              >
                <Image
                  source={require("../../assets/icons/amount.png")}
                  style={{ width: 18, height: 13 }}
                />
                <Text className="w-40" style={{fontWeight: 400}}>{item.amount}  </Text>
              </View>
            </View>
          </View>

          <View>
            <Text className="uppercase text-sm font-bold mb-4 text-warm">
              delivery options
            </Text>
            <View className="w-full flex flex-row gap-x-3">
              {item.deliveryOptions.map((delivery) => (
                <View className="flex flex-row rounded-lg bg-light-green items-center justify-center w-36 p-2 px-4">
                  <Text className="text-green-700 text-md" style={{fontWeight: 400}}>{delivery}  </Text>
                  <Image
                    className={`w-6 h-6`}
                    source={require("../../assets/icons/check.png")}
                  />
                </View>
              ))}
            </View>
          </View>
        </View>

        {(user && user.type == "bs" && (
          <View className="flex flex-row w-full gap-x-4 items-center justify-center">
            <TouchableOpacity
              style={{ width: 150 }}
              onPress={() => nav.navigate("Update Product", { item: item })}
            >
              <View
                className="rounded-lg w-full p-4 flex flex-row items-center justify-center"
                style={{
                  borderWidth: 0.5,
                  borderColor: "black",
                  borderStyle: "solid",
                }}
              >
                <Text className="text-center mr-3" style={{ fontSize: 18, fontWeight: 400 }}>
                  edit </Text>
                <SimpleLineIcons name="pencil" size={20} color="black" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ width: 150 }}
              onPress={() => setModal(true)}
            >
              <View className="rounded-lg w-full p-4 flex bg-warm flex-row items-center justify-center">
                <Text
                  className="text-center text-white mr-3"
                  style={{ fontSize: 18, fontWeight: 400 }}
                >
                  manage </Text>
                <AntDesign name="setting" size={24} color="white" />
              </View>
            </TouchableOpacity>
          </View>
        )) || (
          <View className="flex flex-col w-full items-center justify-center gap-y-4">
            {(isOrdered() && (
              <View className="bg-cherry rounded-full w-full p-4">
                <Text className="text-white uppercase font-bold text-center">
                  Donation Claimed  </Text>
              </View>
            )) ||
              (item?.available &&
                (
                  <TouchableOpacity
                    className="w-full"
                    onPress={() =>
                      nav.navigate("Donation Claim", { item: item })
                    }
                  >
                    <View className="bg-black rounded-full w-full p-4">
                      <Text className="text-white uppercase font-bold text-center">
                        Claim Donation  </Text>
                    </View>
                  </TouchableOpacity>
                ) || (
                  <TouchableOpacity
                    className="w-full"
                    onPress={() =>
                      nav.navigate("Donation Claim", { item: item })
                    }
                  >
                    <View className="bg-cherry rounded-full w-full p-4">
                      <Text className="text-white uppercase font-bold text-center"> Unavailable  </Text>
                    </View>
                  </TouchableOpacity>
                ))}

            <View className="flex flex-row w-full gap-x-4 items-center justify-center">
              <TouchableOpacity
                style={{ width: 150 }}
                onPress={() =>
                  nav.navigate("Direct Message", { item: item.author })
                }
              >
                <View
                  className="rounded-lg w-full p-4 flex flex-row items-center justify-center"
                  style={{
                    borderWidth: 0.5,
                    borderColor: "black",
                    borderStyle: "solid",
                  }}
                >
                  <Ionicons
                    name="ios-chatbox-ellipses-outline"
                    size={18}
                    color="black"
                  />
                  <Text className="uppercase text-center ml-3" style={{fontWeight: 400}}>message  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ width: 150 }}
                onPress={() =>
                  nav.navigate("View Profile", { item: item.author })
                }
              >
                <View
                  className="rounded-lg w-full flex flex-row items-center justify-center"
                  style={{
                    borderWidth: 0.5,
                    borderColor: "black",
                    borderStyle: "solid",
                    padding: 16
                  }}
                >
                  <EvilIcons name="search" size={26} color="black" />
                  <Text className="uppercase text-center ml-1 mt-1" style={{fontSize:12, fontWeight: 400}}> view profile </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
