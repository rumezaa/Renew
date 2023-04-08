import {
  Text,
  Touchable,
  TouchableOpacity,
  View,
  Modal,
  Button,
  FlatList,
  Image,
} from "react-native";
import { useState } from "react";
import { Calendar, DefaultTheme } from "react-native-calendars";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Feather } from "@expo/vector-icons";
import { useContext, useEffect } from "react";
import { AntDesign } from "@expo/vector-icons";
import { db, auth } from "../../backend/config";
import { useNavigation } from "@react-navigation/native";
import Location from "../../components/utility-components/Location";
import Delivery from "../../components/utility-components/Delivery";
import { doc, onSnapshot } from "firebase/firestore";
import { UserContext } from "../../components/contexts/UserProvider";
import { Entypo } from "@expo/vector-icons";
import RectPost from "../../components/posts/RectPost";
import OrderComponent from "../../components/posts/OrderComponent";

export default function NpCalendarScreen() {
  const [user] = useContext(UserContext);
  const [selected, setSelected] = useState();
  const [calendar, setCalendar] = useState(user?.calendar);
  const [markedDates, setMarkedDates] = useState();
  const [orders, setOrders] = useState([]);
  const nav = useNavigation();
  // only for the current dat

  const [upcomming, setUpcomming] = useState();

  function getMarked() {
    const marked = {
      [selected]: {
        disableTouchEvent: true,
        selected: true,
      },
    };
    calendar?.map((cal) => {
      if (cal) {
        marked[cal.date] = { marked: true, selected: selected == cal.date };
      }
    });
    setMarkedDates(marked);
  }

  async function getUpcomming() {
    const data = [];

    const today = new Date();
    const offsetMinutes = today.getTimezoneOffset();
    const offsetMilliseconds = offsetMinutes * 60 * 1000;
    const adjustedToday = new Date(today.getTime() - offsetMilliseconds);
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    calendar.map((cal) => {
      const calDate = new Date(cal.date);
      if (calDate >= adjustedToday && calDate <= nextWeek) {
        data.push(cal);
      }
    });

    if (data && data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        const postRef = doc(db, "posts", data[i].productId);
        const unsubscribe = await onSnapshot(postRef, (docSnap) => {
          if (docSnap.exists()) {
            const item = {
              product: docSnap.data(),
              delivery: data[i].deliveryMethod,
              time: data[i].time,
            };
            upcomming
              ? setUpcomming([...upcomming, item])
              : setUpcomming([item]);
          } else {
            console.log("No such document!");
          }
        });
        return () => unsubscribe();
      }
    }
  }

  async function getOrders() {
    await setOrders([]);
    if (orders?.length == 0) {
      for (let i = 0; i < calendar?.length; i++) {
        if (calendar[i].date === selected) {
          const postRef = doc(db, "posts", calendar[i].productId);
          const unsubscribe = await onSnapshot(postRef, (docSnap) => {
            if (docSnap.exists()) {
              const item = {
                product: docSnap.data(),
                delivery: calendar[i].deliveryMethod,
                time: calendar[i].time,
              };
              orders ? setOrders([...orders, item]) : setOrders([item]);
            } else {
              console.log("No such document!");
            }
          });
          return () => unsubscribe();
        }
      }
    }
  }

  const customTheme = {
    backgroundColor: "white",
    calendarBackground: "white",
    textSectionTitleColor: "#000000",
    selectedDayBackgroundColor: "#FF776D",
    selectedDayTextColor: "#FFFFFF",
    todayTextColor: "#FF776D",
    dayTextColor: "#000000",
    textDisabledColor: "#BFBFBF",
    dotColor: "#FF776D",
    selectedDotColor: "#FFFFFF",
    arrowColor: "black",
    monthTextColor: "#000000",
    indicatorColor: "#FF776D",
  };

  function formatSelected() {
    const date = new Date(selected);
    const options = { day: "numeric", month: "long", timeZone: "UTC" };
    const formattedDate = date.toLocaleDateString("en-US", options);
    return `${formattedDate}`;
  }

  useEffect(() => {
    getMarked();
    getOrders();
    getUpcomming();
  }, [selected, calendar]);



  return (
    <View className="bg-white">
      <Calendar
        onDayPress={(day) => {
          setSelected(day.dateString);
        }}
        style={{ height: 370 }}
        theme={customTheme}
        markedDates={markedDates}
      />

      {calendar && (
        <View className="h-3/5 w-full flex flex-col items-center gap-y-5 bg-white p-4">
          <View className="flex flex-row w-full items-left">
            <View className="flex flex-row items-center gap-x-4">
              <Text className="uppercase text-xl font-light ">
                {(selected && orders && `Orders for ${formatSelected()}`) ||
                  "Upcomming"}  </Text>
              <Image
                source={require("../../assets/icons/arrow-warm-right.png")}
                style={{ width: 26, height: 26 }}
              />
            </View>
          </View>

          {upcomming?.length == 0 ||
            (orders?.length == 0 && (
              <View>
                <Text>
                  {(upcomming?.length == 0 && "Nothing  upcomming this week") ||
                    "No orders for today"}   </Text>
              </View>
            )) || (
              <FlatList
                data={(selected && orders) || upcomming}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() =>
                      nav.navigate("Product", { item: item.product })
                    }
                  >
                    <OrderComponent item={item} />
                  </TouchableOpacity>
                )}
                //Setting the number of column

                className="w-full"
              />
            )}
        </View>
      )}
    </View>
  );
}
