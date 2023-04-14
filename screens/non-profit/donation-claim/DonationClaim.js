
import DeliveryScreen from "./DeliveryScreen";
import DatesScreen from "./DatesScreen";
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity
} from "react-native";
import { db, auth } from "../../../backend/config";
import { doc, onSnapshot, getDoc, updateDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { NavModal } from "./NavModal";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../../components/contexts/UserProvider";

export default function DonationClaim({ route }) {
  const [user] = useContext(UserContext);
  const [page, setPage] = useState(1);
  const product = route.params.item;
  const [delivery, setDelivery] = useState();
  const [selectedTime, setSelectedTime] = useState();
  const [business, setBusiness] = useState();
  const nav = useNavigation()

  function formatSelected() {
    const date = new Date(selectedTime.date);
    const options = { day: 'numeric', month: 'long', year: "numeric", timeZone: 'UTC' };
    const formattedDate = date.toLocaleDateString("en-US", options); 
    
    return`${formattedDate} at ${convertTime(selectedTime.time)}`;
  }

  const convertTime = (time) => {
    let hour = time.split(":")[0];
    let minute = time.split(":")[1];

    return (
      (hour <= 12 && `${hour}:${minute} ${(hour == 12 && "pm") || "am"}`) ||
      `${hour - 12}:${minute} pm`
    );
  };

  useEffect(() => {
    if (product.author) {
      const businessRef = doc(db, "users", product.author);
      const docUnsubscribe = onSnapshot(businessRef, (docSnap) => {
        if (docSnap.exists()) {
          setBusiness(docSnap.data());
        } else {
          console.log("User not found");
        }
      });

      return () => docUnsubscribe();
    }
  }, [product.author]);

  async function handleConfirm() {
    //update user calendar + orders
    //update business calendar with booked time
    //change availabailtiy of product

    const NpCalendarObject = {
      time: selectedTime.time,
      date: selectedTime.date,
      businessId: business.id,
      productId: product.id,
      deliveryMethod: delivery,

    };
   
    const OrderObject = {
      productId: product.id,
      deliveryMethod: delivery,
      businessId: business.id
    }

    const BsOrderObject = {
      productId: product.id,
      deliveryMethod: delivery,
      userId: auth.currentUser.uid,
      time: selectedTime.time
    }



    //getting the business and non-profit
    const userRef = doc(db, "users", auth.currentUser.uid);
    const userSnap = await getDoc(userRef);

    const businessRef = doc(db, "users", business.id);
    const businessSnap = await getDoc(businessRef);

    //updating  calendar field for user
    const NpUpdatedCalendar = userSnap.data().calendar
      ? [...userSnap.data().calendar, NpCalendarObject]
      : [NpCalendarObject];
    const updatedOrders = userSnap.data().oders
      ? [...userSnap.data().orders, OrderObject]
      : [OrderObject];
    await updateDoc(userRef, {
      calendar: NpUpdatedCalendar,
      orders: updatedOrders,
    });

    //get business calendar
    //remove availabilty and add booking and order

    const updatedCalendar = businessSnap.data().calendar.map((obj) => {
      if (obj.date === selectedTime.date) {
        const availableTimes = obj.availableTimes.filter(
          (time) => time !== selectedTime.time
        );

        const orders = obj.orders ? [...obj.orders, BsOrderObject] : [BsOrderObject];
        return {
          ...obj,
          availableTimes: availableTimes,
          available: availableTimes.length > 0,
          booked: orders.length > 0,
          orders: orders,
        };
      } else {
        return obj;
      }
    });

    await updateDoc(businessRef, { calendar: updatedCalendar });

    const postRef = doc(db, "posts", product.id);
    await updateDoc(postRef, { available: false });

    setPage(3);
  }

  return (
    <ImageBackground
      className="h-full w-full flex flex-col"
      source={
        (page == 3 && require("../../../assets/backgrounds/gradient.png")) ||
        require("../../../assets/backgrounds/blank.png")
      }
    >
      <NavModal page={page} />
      <View className="w-full h-full pt-10">
        {page == 1 && (
          <DeliveryScreen
            delivery={delivery}
            setDelivery={setDelivery}
            deliveryOptions={product.deliveryOptions}
            setPage={setPage}
          />
        )}
        {page == 2 && (
          <DatesScreen
            selectedTime={selectedTime}
            setSelectedTime={setSelectedTime}
            author={product.author}
            setPage={setPage}
            handleConfirm={handleConfirm}
          />
        )}
        {page == 3 && (
          <View className="flex items-center justify-center">
            <ImageBackground
              source={require("../../../assets/confirm.png")}
              resizeMode={"contain"}
              className="flex items-center"
              style={{ width: 300, height: 400 }}
            >
              <View className="flex flex-col items-center">
                <View className="mt-16 mb-4">
                  {(business.profilePic && (
                    <Image
                      source={{ uri: business.profilePic }}
                      className="w-28 h-28 rounded-full"
                    />
                  )) || (
                    <View
                      className="w-28 h-28 flex-flex-col items-center justify-center rounded-full"
                      style={{ backgroundColor: "#EFEFF0" }}
                    >
                      <Image
                        source={require("../../../assets/icons/image-icon.png")}
                        style={{ width: 45, height: 45 }}
                      />
                    </View>
                  )}
                </View>
                <View className="flex flex-col px-5 gap-y-4">
                  <Text className="font-bold text-center px-3">
                    You've secured a donation from {business.name}!
                  </Text>
                  <Text className="text-center px-6 text-xs font-light" style={{fontWeight: 300, fontSize: 10}}>
                    Please make sure you are available for {delivery} on{" "}
                    {formatSelected()}. Check your notification and messages for
                    updates from Goodwill
                  </Text>
                </View>
              </View>
            </ImageBackground>
            <TouchableOpacity onPress={() => nav.navigate("Calendar")}>
              <View className="rounded-full bg-cherry p-4 px-6">
                <Text className="text-white font-semibold">Finish</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ImageBackground>
  );
}
