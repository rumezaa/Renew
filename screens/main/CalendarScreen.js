import {
  Text,
  Touchable,
  TouchableOpacity,
  View,
  Modal,
  Button,
  FlatList,
} from "react-native";
import { useState } from "react";
import { Calendar } from "react-native-calendars";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Feather } from "@expo/vector-icons";
import { useContext, useEffect } from "react";
import { doc, updateDoc, onSnapshot } from "firebase/firestore";
import { AntDesign } from "@expo/vector-icons";
import { db, auth } from "../../backend/config";
import { UserContext } from "../../components/contexts/UserProvider";
import { Entypo } from "@expo/vector-icons";
import OrderComponent from "../../components/posts/OrderComponent";
import TimePicker from "../../components/utility-components/TimePicker";

export default function CalendarScreen() {
  const [user] = useContext(UserContext);
  const [selected, setSelected] = useState();
  const [calendar, setCalendar] = useState(user?.calendar);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [time, setTime] = useState(new Date());
  const [orders, setOrders] = useState([]);
  const [upcomming, setUpcomming] = useState([]);
  const [modal, setModal] = useState(false);
  const [markedDates, setMarkedDates] = useState();
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  function getMarked() {
    const marked = {
      [selected]: {
        disableTouchEvent: true,
        selected: true,
      },
    };
    calendar?.map((cal) => {
      if (cal.booked) {
        marked[cal.date] = { marked: true, selected: selected == cal.date };
      }
    });
    setMarkedDates(marked);
  }

  const convertTime = (time) => {
    let hour = time.split(":")[0];
    let minute = time.split(":")[1];

    return (
      (hour <= 12 && `${hour}:${minute} ${(hour == 12 && "pm") || "am"}`) ||
      `${hour - 12}:${minute} pm`
    );
  };

  function addAvailability() {
    const options = { hour: "numeric", minute: "numeric", hour12: false };
    const formatTime = time.toLocaleTimeString("en-US", options);
    availableTimes
      ? setAvailableTimes([...availableTimes, formatTime])
      : setAvailableTimes([formatTime]);
  }

  const onChange = (event, selectedDate) => {
    if (event.type == "set") {
      const currentDate = selectedDate;
      setTime(currentDate);
      setIsPickerOpen(false);
    } else if (event.type == "dismissed") {
      setIsPickerOpen(false);
    }
  };

  function getTimes() {
    let times = [];

    for (let i = 0; i < calendar?.length; i++) {
      if (calendar[i].date === selected) {
        times = calendar[i]?.availableTimes;
      }
    }

    return times;
  }

  function formatSelected() {
    const date = new Date(selected);
    const options = { day: "numeric", month: "long", timeZone: "UTC" };
    const formattedDate = date.toLocaleDateString("en-US", options);
    return `${formattedDate}`;
  }

  async function getUpcomming() {
    const data = [];
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    calendar.map((cal) => {
      const calDate = new Date(cal.date);
      if (calDate >= today && calDate <= nextWeek && cal.orders.length > 0) {
        cal.orders.map((obj) => data.push(obj));
      }
    });

    for (let i = 0; i < data.length; i++) {
      const postRef = doc(db, "posts", data[i].productId);
      const unsubscribe = await onSnapshot(postRef, (docSnap) => {
        if (docSnap.exists()) {
          const item = {
            product: docSnap.data(),
            delivery: data[i].deliveryMethod,
            time: data[i].time,
            userId: data[i].userId,
          };
          upcomming ? setUpcomming([...upcomming, item]) : setUpcomming([item]);
        } else {
          console.log("No such document!");
        }
      });
      return () => unsubscribe();
    }
  }

  async function getOrders() {
    await setOrders([]);
    if (orders?.length == 0) {
      for (let i = 0; i < calendar?.length; i++) {
        if (calendar[i].date === selected) {
          for (let j = 0; j < calendar[i].orders.length; j++) {
            const obj = calendar[i].orders[j];
            const postRef = doc(db, "posts", obj.productId);
            const unsubscribe = await onSnapshot(postRef, (docSnap) => {
              if (docSnap.exists()) {
                const item = {
                  product: docSnap.data(),
                  delivery: obj.deliveryMethod,
                  time: obj.time,
                  userId: obj.userId,
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
  }

  async function handleAvailability() {
    const calItem = {
      date: selected,
      availableTimes: availableTimes,
      booked: orders.length > 0,
      orders: orders ? orders : [],
      available: availableTimes.length > 0,
    };

    const userRef = doc(db, "users", auth.currentUser.uid);

    const index = calendar.findIndex((obj) => obj.date === selected);

    if (index !== -1) {
      const updatedCalendar = calendar.map((obj) => {
        if (obj.date === selected) {
          return calItem;
        } else {
          return obj;
        }
      });

      setCalendar(updatedCalendar);
      await updateDoc(userRef, { calendar: updatedCalendar });
    } else {
      const newCal = [...calendar, calItem];
      setCalendar(newCal);
      await updateDoc(userRef, { calendar: newCal });
    }
    setModal(false);
  }
  const onClose = () => {
    console.log("hey");
    setIsPickerOpen(false);
  };

  useEffect(() => {
    setAvailableTimes(getTimes());
    getUpcomming();
    getOrders();
    getMarked();
  }, [selected, calendar]);

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

      <View className="bg-white h-full p-4">
        {(selected && (
          <>
            <View className={"flex flex-col"}>
              <TouchableOpacity onPress={() => setModal(true)}>
                <View className="flex flex-row gap-x-3 items-center">
                  <Text className="font-bold text-lg">
                    Manage Availability{" "}
                  </Text>
                  <AntDesign name="arrowright" size={24} color="#FFAF66" />
                </View>
              </TouchableOpacity>
            </View>

            <View>
              <Modal visible={modal} transparent={true} animationType="slide">
                <View
                  className="flex items-center justify-center w-full h-full"
                  style={{ backgroundColor: "#000000aa" }}
                >
                  <View className="bg-white rounded-md h-1/2 w-3/4 flex items-center justify-center p-4">
                    <Text className="text-cherry font-bold text-lg text-center">
                      Add Availability for {formatSelected(selected)}
                    </Text>

                    <View className="flex flex-row items-center justify-center gap-y-3 w-full mt-5">
                      <View className="mr-3">
                        {(isPickerOpen && (
                          <DateTimePicker
                            style={{ backgroundColor: "white" }}
                            mode={"time"}
                            value={time}
                            onChange={onChange}
                            onOpen={() => setIsPickerOpen(true)}
                            onClose={onClose}
                          />
                        )) || (
                          <TouchableOpacity
                            onPress={() => setIsPickerOpen(true)}
                          >
                            <View className="rounded bg-light-grey p-2">
                              <Text>
                                {time &&
                                  convertTime(time.toLocaleTimeString("en-US", {
                                    hour: "numeric",
                                    minute: "numeric",
                                    hour12: false,
                                  }))}{" "}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        )}
                      </View>

                      <TouchableOpacity onPress={addAvailability}>
                        <View className="bg-cherry w-5 h-5 rounded-full flex items-center justify-center ">
                          <Entypo name="plus" size={20} color="white" />
                        </View>
                      </TouchableOpacity>
                    </View>

                    {availableTimes && (
                      <View className="w-full flex items-center justify-center h-1/2 mt-8">
                        <Text className="">Your Current Availability   </Text>
                        <FlatList
                          data={availableTimes}
                          renderItem={({ item }) => (
                            <View
                              className="rounded-full h-8 flex flex-row m-1 items-center justify-between p-1"
                              style={{ backgroundColor: "#ED6E65" }}
                            >
                              <Text className="text-white font-semibold mr-1">
                                {convertTime(item)}
                              </Text>
                              <TouchableOpacity
                                onPress={() =>
                                  setAvailableTimes((times) =>
                                    times.filter((time) => time !== item)
                                  )
                                }
                              >
                                <View>
                                  <Feather name="x" size={15} color="white" />
                                </View>
                              </TouchableOpacity>
                            </View>
                          )}
                          //Setting the number of columns
                          className="w-full pl-8 mt-2 h-10"
                          numColumns={2}
                        />
                      </View>
                    )}

                    <View className="w-full flex flex-row items-center justify-center gap-x-3">
                      <TouchableOpacity onPress={handleAvailability}>
                        <View className="bg-golden w-16 rounded-full flex items-center py-2">
                          <Text className="text-white font-semibold uppercase text-center">
                            Save
                          </Text>
                        </View>
                      </TouchableOpacity>

                      <TouchableOpacity onPress={() => setModal(false)}>
                        <View className="bg-black w-16 rounded-full flex items-center py-2">
                          <Text className="text-white font-semibold uppercase text-center">
                            Close
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>
            </View>
            {(orders.length > 0 && (
              <View>
                <Text className="text-tomato font-semibold my-2">
                  Today's orders
                </Text>
                <FlatList
                  data={(selected && orders) || upcomming}
                  renderItem={({ item }) => <OrderComponent item={item} />}
                  //Setting the number of column

                  className="w-full"
                />
              </View>
            )) || (
              <View>
                <Text>No orders for today</Text>
              </View>
            )}
          </>
        )) || (
          <View>
            <Text className="text-tomato font-semibold my-2">Upcomming</Text>
            {(upcomming.length == 0 && (
              <View>
                <Text>No upcomming orders this week</Text>
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
    </View>
  );
}
