import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../backend/config";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { UserContext } from "../../components/contexts/UserProvider";
import { useContext, useState, useEffect } from "react";

export default function MessagesScreen() {
  const nav = useNavigation();
  const [user] = useContext(UserContext);
  const [messages, setMessages] = useState();

  useEffect(() => {
    if (user) {
      const userRef = doc(db, "users", user.id);
      const docUnsubscribe = onSnapshot(userRef, (docSnap) => {
        if (docSnap.exists() && docSnap.data().messages.length > 0) {

          setMessages(docSnap.data().messages);
        } else {
          console.log("User not found or messages not defined");
        }
      });

      return () => docUnsubscribe();
    }
  }, [user]);


  return (
    (user && messages && messages.length > 0 && (
      <View className="bg-white h-full p-2">
        {(messages.length > 0 && (
          <FlatList
            data={messages && messages.length > 0 && messages }
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  item.reciever == "Renew" && "" || item.reciever !== "Renew" && nav.navigate("Direct Message", { item: item.recieverId })
                }
                className="bg-light-grey p-2 flex flex-row items-center gap-x-3 mb-2 rounded shadow-lg"
                style={{
                  borderTopLeftRadius: 10,
                  borderBottomLeftRadius: 10,
                  borderTopRightRadius: 5,
                }}
              >
                <View className="flex flex-col items-center justify-center gap-y-2">
                  {(item?.recieverProfile && (
                    <Image
                      source={{ uri: item.recieverProfile }}
                      className="w-20 h-20 rounded-full"
                    />
                  )) || (
                    <View
                      className="w-20 h-20 flex-flex-col items-center justify-center rounded-full"
                      style={{ backgroundColor: "#EFEFF0" }}
                    >
                      <Image
                        source={require("../../assets/icons/image-icon.png")}
                        style={{ width: 35, height: 35 }}
                      />
                    </View>
                  )}
                  {(item?.reciever && (
                    <Text style={{fontWeight: 400, fontSize: 12}}  className="text-gray-400 tracking-tight w-20 text-center">
                      {item.reciever}
                    </Text>
                  )) || (
                    <Text style={{fontWeight: 400}} className="text-gray-400 tracking-tight w-20 text-center">
                      unknown  </Text>
                  )}
                </View>
                <View>
                  <Text style={{fontWeight: 400}} className="text-gray-400 uppercase tracking-tight">
                    latest message   </Text>
                  <Text className="text-black" style={{ fontSize: 18 }}>
                    {(item.latestMessage.content.length > 25 &&
                      item.latestMessage.content.substring(0, 25 - 3) +
                        "...") ||
                      item.latestMessage.content}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        )) || (
          <View className="flex flex-col w-full h-full items-center justify-center gap-y-2">
            <MaterialIcons name="error" size={50} color="#939393" />
            <Text>You have no messages   </Text>
          </View>
        )}
      </View>
    )) || (
      <View className="flex flex-col w-full h-full items-center justify-center gap-y-2">
        <MaterialIcons name="error" size={50} color="#939393" />
        <Text>You have no messages   </Text>
      </View>
    )
  );
}
