import { View, Text, Image, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import { db } from "../../backend/config";
import { onSnapshot, collection, doc } from "firebase/firestore";
import ProductViewModal from "../../components/utility-components/ProductViewModal";
import { InfoModal, ContactModal } from "./BussinessViewComponents";

export default function AccountViewScreen({ route }) {
  const businessUID = route.params.item;

  const [business, setBusiness] = useState();
  const [posts, setPosts] = useState();
  const [infoModal, setInfoModal] = useState(false);
  const [contactModal, setContactModal] = useState(false);

  useEffect(() => {
    if (businessUID) {
      const businessRef = doc(db, "users", businessUID);
      const docUnsubscribe = onSnapshot(businessRef, (docSnap) => {
        if (docSnap.exists()) {
          setBusiness(docSnap.data());
        } else {
          console.log("User not found");
        }
      });

      return () => docUnsubscribe();
    }
  }, [businessUID]);

  useEffect(() => {
    if (business && !posts?.length) {
      const unsubscribe = onSnapshot(
        collection(db, "posts"),
        (querySnapshot) => {
          const data = querySnapshot.docs.map((doc) => doc.data());
          setPosts(data.filter((obj) => obj.author == business.id));
        }
      );
      return unsubscribe;
    }
  }, [business, posts]);



  return (
    <View className="flex flex-col w-full h-full items-center bg-white pt-4">
      <View className="flex flex-col items-center justify-center gap-y-2">
        {(business?.profilePic && (
          <Image
            source={{ uri: business.profilePic }}
            className="w-48 h-48 rounded-full"
          />
        )) || (
          <View
            className="w-48 h-48 flex-flex-col items-center justify-center rounded-full"
            style={{ backgroundColor: "#EFEFF0" }}
          >
            <Image
              source={require("../../assets/icons/image-icon.png")}
              style={{ width: 100, height: 100 }}
            />
          </View>
        )}
        <Text className="text-lg font-bold">{business?.name}</Text>
      </View>

      <View className="flex flex-row w-full items-center gap-x-5 justify-center mt-5">
        <TouchableOpacity
          style={{ width: 100 }}
          onPress={() => setInfoModal(true)}
        >
          <View
            className="rounded-lg w-full p-2 flex flex-row items-center justify-center"
            style={{
              borderWidth: 0.5,
              borderColor: "black",
              borderStyle: "solid",
            }}
          >
            <Text>Info</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ width: 100 }}
          onPress={() => setContactModal(true)}
        >
          <View
            className="rounded-lg w-full p-2 flex flex-row items-center justify-center"
            style={{
              borderWidth: 0.5,
              borderColor: "black",
              borderStyle: "solid",
            }}
          >
            <Text>Contact</Text>
          </View>
        </TouchableOpacity>

        <View>
          {business &&
            ((infoModal && (
              <InfoModal
                setModal={setInfoModal}
                modal={infoModal}
                business={business}
              />
            )) ||
              (contactModal && (
                <ContactModal
                  setModal={setContactModal}
                  modal={contactModal}
                  business={business}
                />
              )))}
        </View>
      </View>

      <View
        className="flex mt-10 h-full
      "
      >
        <ProductViewModal products={posts} />
      </View>
    </View>
  );
}
